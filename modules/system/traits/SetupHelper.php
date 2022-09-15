<?php namespace System\Traits;

use Str;
use Config;
use October\Rain\Composer\Manager as ComposerManager;
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
     * composerRequireString returns the composer require string for installing dependencies
     */
    protected function composerRequireCore($composer, $want = null)
    {
        if ($want === null) {
            $composer->require('october/all', $this->getUpdateWantVersion());
        }
        else {
            $want = $this->processWantString($want);
            $composer->require('october/rain', $want);
            $composer->require('october/all', $want);
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
        $path = $this->getBasePath('.env');
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
}
