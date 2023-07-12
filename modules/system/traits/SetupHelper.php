<?php namespace System\Traits;

use App;
use Str;
use Config;
use System\Classes\UpdateManager;
use October\Rain\Composer\Manager as ComposerManager;
use Illuminate\Support\Env;
use Dotenv\Dotenv;
use Exception;
use PDOException;
use PDO;

/**
 * SetupHelper is shared logic for the handlers
 */
trait SetupHelper
{
    /**
     * @var array userConfig is a temporary store of user input config values
     */
    protected $userConfig = [];

    /**
     * setComposerAuth configures authentication for composer and October CMS
     */
    protected function setComposerAuth($email, $projectKey)
    {
        $composer = ComposerManager::instance();

        // Save authentication token
        $composer->addAuthCredentials(
            $this->getComposerUrl(false),
            $email,
            $projectKey
        );

        // Store project details
        $this->injectJsonToFile(storage_path('cms/project.json'), [
            'project' => $projectKey
        ]);

        // Add gateway as a composer repo
        $composer->addOctoberRepository($this->getComposerUrl());
    }

    /**
     * setDemoContent instructs the system to install demo content or not
     */
    protected function setDemoContent($confirm = true)
    {
        if ($confirm) {
            $this->injectJsonToFile(storage_path('cms/autoexec.json'), [
                'theme:seed demo --root'
            ]);
        }
        else {
            $this->injectJsonToFile(storage_path('cms/autoexec.json'), [
                'october:fresh --force'
            ]);
        }
    }

    /**
     * processWantString ensures a valid want version is supplied
     */
    protected function processWantString($version)
    {
        $parts = explode('.', $version);

        if (count($parts) > 1) {
            $parts[2] = '*';
        }

        $parts = array_slice($parts, 0, 3);

        return implode('.', $parts);
    }

    /**
     * addModulesToGitignore
     */
    protected function addModulesToGitignore($gitignore)
    {
        $toIgnore = '/modules';
        $contents = file_get_contents($gitignore);

        if (strpos($contents, $toIgnore) === false) {
            file_put_contents($gitignore,
                trim(file_get_contents($gitignore), PHP_EOL) . PHP_EOL .
                $toIgnore . PHP_EOL
            );
        }
    }

    /**
     * setEnvVars sets multiple environment variables
     */
    protected function setEnvVars(array $vars)
    {
        foreach ($vars as $key => $val) {
            $this->setEnvVar($key, $val);
        }
    }

    /**
     * setEnvVar writes an environment variable to disk
     */
    protected function setEnvVar($key, $value)
    {
        $path = base_path('.env');
        $old = $this->getEnvVar($key);
        $value = $this->encodeEnvVar($value);

        if (is_bool(env($key))) {
            $old = env($key) ? 'true' : 'false';
        }

        if (file_exists($path)) {
            file_put_contents($path, str_replace(
                [$key.'='.$old, $key.'='.'"'.$old.'"'],
                [$key.'='.$value, $key.'='.$value],
                file_get_contents($path)
            ));
        }

        $this->userConfig[$key] = $value;
    }

    /**
     * encodeEnvVar for compatibility with certain characters
     */
    protected function encodeEnvVar($value)
    {
        if (!is_string($value)) {
            return $value;
        }

        // Escape quotes
        if (strpos($value, '"') !== false) {
            $value = str_replace('"', '\"', $value);
        }

        // Quote values with comment, space, quotes
        $triggerChars = ['#', ' ', '"', "'"];
        foreach ($triggerChars as $char) {
            if (strpos($value, $char) !== false) {
                $value = '"'.$value.'"';
                break;
            }
        }

        return $value;
    }

    /**
     * getEnvVar specifically from installer specified values. This is needed since
     * the writing to the environment file may not update the values from env()
     */
    protected function getEnvVar(string $key, $default = null)
    {
        return $this->userConfig[$key] ?? env($key, $default);
    }

    /**
     * checkDatabase validates the supplied database configuration
     */
    protected function checkDatabase($type, $host, $port, $name, $user, $pass)
    {
        if ($type != 'sqlite' && !strlen($host)) {
            throw new Exception('Please specify a database host');
        }

        if (!strlen($name)) {
            throw new Exception('Please specify the database name');
        }

        // Check connection
        switch ($type) {
            case 'mysql':
                $dsn = 'mysql:host='.$host.';dbname='.$name;
                if ($port) $dsn .= ";port=".$port;
                break;

            case 'pgsql':
                $_host = ($host) ? 'host='.$host.';' : '';
                $dsn = 'pgsql:'.$_host.'dbname='.$name;
                if ($port) $dsn .= ";port=".$port;
                break;

            case 'sqlite':
                $dsn = 'sqlite:'.$name;
                $this->checkSqliteFile($name);
                break;

            case 'sqlsrv':
                $availableDrivers = PDO::getAvailableDrivers();
                $portStr = $port ? ','.$port : '';
                if (in_array('dblib', $availableDrivers)) {
                    $dsn = 'dblib:host='.$host.$portStr.';dbname='.$name;
                }
                else {
                    $dsn = 'sqlsrv:Server='.$host.$portStr.';Database='.$name;
                }
                break;
        }
        try {
            return new PDO($dsn, $user, $pass, array(PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION));
        }
        catch (PDOException $ex) {
            throw new Exception('Connection failed: ' . $ex->getMessage());
        }
    }

    /**
     * validateSqliteFile will establish the SQLite engine
     */
    protected function checkSqliteFile($filename)
    {
        if (file_exists($filename)) {
            return;
        }

        $directory = dirname($filename);
        if (!is_dir($directory)) {
            mkdir($directory, 0777, true);
        }

        new PDO('sqlite:'.$filename);
    }

    /**
     * injectJsonToFile merges a JSON array in to an existing JSON file.
     * Merging is useful for preserving array values.
     */
    protected function injectJsonToFile(string $filename, array $jsonArr, bool $merge = false): void
    {
        $contentsArr = file_exists($filename)
            ? json_decode(file_get_contents($filename), true)
            : [];

        $newArr = $merge
            ? array_merge_recursive($contentsArr, $jsonArr)
            : $this->mergeRecursive($contentsArr, $jsonArr);

        $content = json_encode($newArr, JSON_UNESCAPED_SLASHES|JSON_PRETTY_PRINT);

        file_put_contents($filename, $content);
    }

    /**
     * mergeRecursive substitues the native PHP array_merge_recursive to be
     * more config friendly. Scalar values are replaced instead of being
     * merged in to their own new array.
     */
    protected function mergeRecursive(array $array1, $array2)
    {
        if ($array2 && is_array($array2)) {
            foreach ($array2 as $key => $val2) {
                if (
                    is_array($val2) &&
                    (($val1 = isset($array1[$key]) ? $array1[$key] : null) !== null) &&
                    is_array($val1)
                ) {
                    $array1[$key] = $this->mergeRecursive($val1, $val2);
                }
                else {
                    $array1[$key] = $val2;
                }
            }
        }

        return $array1;
    }

    /**
     * getAvailableLocales returns available system locales
     */
    public function getAvailableLocales()
    {
        return [
            'ar'    => [$this->getLang('system::lang.locale.ar'),    'Arabic'],
            'be'    => [$this->getLang('system::lang.locale.be'),    'Belarusian'],
            'bg'    => [$this->getLang('system::lang.locale.bg'),    'Bulgarian'],
            'ca'    => [$this->getLang('system::lang.locale.ca'),    'Catalan'],
            'cs'    => [$this->getLang('system::lang.locale.cs'),    'Czech'],
            'da'    => [$this->getLang('system::lang.locale.da'),    'Danish'],
            'de'    => [$this->getLang('system::lang.locale.de'),    'German'],
            'el'    => [$this->getLang('system::lang.locale.el'),    'Greek'],
            'en'    => [$this->getLang('system::lang.locale.en'),    'English'],
            'en-au' => [$this->getLang('system::lang.locale.en-au'), 'English'],
            'en-ca' => [$this->getLang('system::lang.locale.en-ca'), 'English'],
            'en-gb' => [$this->getLang('system::lang.locale.en-gb'), 'English'],
            'es'    => [$this->getLang('system::lang.locale.es'),    'Spanish'],
            'es-ar' => [$this->getLang('system::lang.locale.es-ar'), 'Spanish'],
            'et'    => [$this->getLang('system::lang.locale.et'),    'Estonian'],
            'fa'    => [$this->getLang('system::lang.locale.fa'),    'Persian'],
            'fi'    => [$this->getLang('system::lang.locale.fi'),    'Finnish'],
            'fr'    => [$this->getLang('system::lang.locale.fr'),    'French'],
            'fr-ca' => [$this->getLang('system::lang.locale.fr-ca'), 'French'],
            'hu'    => [$this->getLang('system::lang.locale.hu'),    'Hungarian'],
            'id'    => [$this->getLang('system::lang.locale.id'),    'Indonesian'],
            'it'    => [$this->getLang('system::lang.locale.it'),    'Italian'],
            'ja'    => [$this->getLang('system::lang.locale.ja'),    'Japanese'],
            'ko'    => [$this->getLang('system::lang.locale.ko'),    'Korean'],
            'lt'    => [$this->getLang('system::lang.locale.lt'),    'Lithuanian'],
            'lv'    => [$this->getLang('system::lang.locale.lv'),    'Latvian'],
            'nb-no' => [$this->getLang('system::lang.locale.nb-no'), 'Norwegian'],
            'nl'    => [$this->getLang('system::lang.locale.nl'),    'Dutch'],
            'pl'    => [$this->getLang('system::lang.locale.pl'),    'Polish'],
            'pt-br' => [$this->getLang('system::lang.locale.pt-br'), 'Portuguese'],
            'pt-pt' => [$this->getLang('system::lang.locale.pt-pt'), 'Portuguese'],
            'ro'    => [$this->getLang('system::lang.locale.ro'),    'Romanian'],
            'ru'    => [$this->getLang('system::lang.locale.ru'),    'Russian'],
            'sk'    => [$this->getLang('system::lang.locale.sk'),    'Slovak'],
            'sl'    => [$this->getLang('system::lang.locale.sl'),    'Slovene'],
            'sv'    => [$this->getLang('system::lang.locale.sv'),    'Swedish'],
            'th'    => [$this->getLang('system::lang.locale.th'),    'Thai'],
            'tr'    => [$this->getLang('system::lang.locale.tr'),    'Turkish'],
            'uk'    => [$this->getLang('system::lang.locale.uk'),    'Ukrainian'],
            'vn'    => [$this->getLang('system::lang.locale.vn'),    'Vietnamese'],
            'zh-cn' => [$this->getLang('system::lang.locale.zh-cn'), 'Chinese'],
            'zh-tw' => [$this->getLang('system::lang.locale.zh-tw'), 'Chinese'],
        ];
    }

    //
    // Framework Booted
    //

    /**
     * getRandomKey generates a random application key
     */
    protected function getRandomKey(): string
    {
        return Str::random($this->getKeyLength(Config::get('app.cipher')));
    }

    /**
     * getKeyLength returns the supported length of a key for a cipher
     */
    protected function getKeyLength(string $cipher): int
    {
        return $cipher === 'AES-128-CBC' ? 16 : 32;
    }

    /**
     * checkEnvWritable checks to see if the app can write to the .env file
     */
    protected function checkEnvWritable()
    {
        $path = base_path('.env');
        $gitignore = base_path('.gitignore');

        // Copy environment variables and reload
        if (!file_exists($path)) {
            copy(base_path('.env.example'), $path);
            $this->refreshEnvVars();
        }

        // Add modules to .gitignore
        if (file_exists($gitignore) && is_writable($gitignore)) {
            $this->addModulesToGitignore($gitignore);
        }

        return is_writable($path);
    }

    /**
     * getComposerUrl returns the endpoint for composer
     */
    protected function getComposerUrl(bool $withProtocol = true): string
    {
        return UpdateManager::instance()->getComposerUrl($withProtocol);
    }

    /**
     * refreshEnvVars will reload defined environment variables
     */
    protected function refreshEnvVars()
    {
        DotEnv::create(Env::getRepository(), App::environmentPath(), App::environmentFile())->load();
    }
}
