<?php namespace System\Console;

use Db;
use App;
use Str;
use Url;
use PDO;
use File;
use Config;
use Artisan;
use Cms\Classes\Theme;
use Cms\Classes\ThemeManager;
use Backend\Database\Seeds\SeedSetupAdmin;
use System\Classes\UpdateManager;
use October\Rain\Config\ConfigWriter;
use Illuminate\Console\Command;
use Illuminate\Encryption\Encrypter;
use Symfony\Component\Console\Input\InputOption;
use Exception;

/**
 * Console command to install October.
 *
 * This sets up October for the first time. It will prompt the user for several
 * configuration items, including application URL and database config, and then
 * perform a database migration.
 *
 * @package october\system
 * @author Alexey Bobkov, Samuel Georges
 */
class OctoberInstall extends Command
{
    use \Illuminate\Console\ConfirmableTrait;

    /**
     * The console command name.
     */
    protected $name = 'october:install';

    /**
     * The console command description.
     */
    protected $description = 'Set up October for the first time.';

    /**
     * @var October\Rain\Config\ConfigWriter
     */
    protected $configWriter;

    /**
     * Create a new command instance.
     */
    public function __construct()
    {
        parent::__construct();

        $this->configWriter = new ConfigWriter;
    }

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->displayIntro();

        if (
            App::hasDatabase() &&
            !$this->confirm('Application appears to be installed already. Continue anyway?', false)
        ) {
            return;
        }

        $this->setupDatabaseConfig();
        $this->setupAdminUser();
        $this->setupCommonValues();

        if ($this->confirm('Configure advanced options?', false)) {
            $this->setupEncryptionKey();
            $this->setupAdvancedValues();
        }
        else {
            $this->setupEncryptionKey(true);
        }

        $this->setupMigrateDatabase();
        $this->displayOutro();
    }

    /**
     * Get the console command arguments.
     */
    protected function getArguments()
    {
        return [];
    }

    /**
     * Get the console command options.
     */
    protected function getOptions()
    {
        return [
            ['force', null, InputOption::VALUE_NONE, 'Force the operation to run.'],
        ];
    }

    //
    // Misc
    //

    protected function setupCommonValues()
    {
        $url = $this->ask('Application URL', Config::get('app.url'));
        $this->writeToConfig('app', ['url' => $url]);
    }

    protected function setupAdvancedValues()
    {
        $backendUri = $this->ask('Backend URL', Config::get('cms.backendUri'));
        $this->writeToConfig('cms', ['backendUri' => $backendUri]);

        $defaultMask = $this->ask('File Permission Mask', Config::get('cms.defaultMask.file') ?: '777');
        $this->writeToConfig('cms', ['defaultMask.file' => $defaultMask]);

        $defaultMask = $this->ask('Folder Permission Mask', Config::get('cms.defaultMask.folder') ?: '777');
        $this->writeToConfig('cms', ['defaultMask.folder' => $defaultMask]);

        $debug = (bool) $this->confirm('Enable Debug Mode?', true);
        $this->writeToConfig('app', ['debug' => $debug]);
    }

    //
    // Encryption key
    //

    protected function setupEncryptionKey($force = false)
    {
        $validKey = false;
        $cipher = Config::get('app.cipher');
        $keyLength = $this->getKeyLength($cipher);
        $randomKey = $this->getRandomKey($cipher);

        if ($force) {
            $key = $randomKey;
        }
        else {
            $this->line(sprintf('Enter a new value of %s characters, or press ENTER to use the generated key', $keyLength));

            while (!$validKey) {
                $key = $this->ask('Application key', $randomKey);
                $validKey = Encrypter::supported($key, $cipher);
                if (!$validKey) {
                    $this->error(sprintf('[ERROR] Invalid key length for "%s" cipher. Supplied key must be %s characters in length.', $cipher, $keyLength));
                }
            }
        }

        $this->writeToConfig('app', ['key' => $key]);

        $this->info(sprintf('Application key [%s] set successfully.', $key));
    }

    /**
     * Generate a random key for the application.
     *
     * @param  string  $cipher
     * @return string
     */
    protected function getRandomKey($cipher)
    {
        return Str::random($this->getKeyLength($cipher));
    }

    /**
     * Returns the supported length of a key for a cipher.
     *
     * @param  string  $cipher
     * @return int
     */
    protected function getKeyLength($cipher)
    {
        return $cipher === 'AES-128-CBC' ? 16 : 32;
    }

    //
    // Database config
    //

    protected function setupDatabaseConfig()
    {
        $type = $this->choice('Database type', ['MySQL', 'Postgres', 'SQLite', 'SQL Server']);

        $typeMap = [
            'SQLite' => 'sqlite',
            'MySQL' => 'mysql',
            'Postgres' => 'pgsql',
            'SQL Server' => 'sqlsrv',
        ];

        $driver = array_get($typeMap, $type, 'sqlite');

        $method = 'setupDatabase'.Str::studly($driver);

        $newConfig = $this->$method();

        $this->writeToConfig('database', ['default' => $driver]);

        foreach ($newConfig as $config => $value) {
            $this->writeToConfig('database', ['connections.'.$driver.'.'.$config => $value]);
        }
    }

    protected function setupDatabaseMysql()
    {
        $result = [];
        $result['host'] = $this->ask('MySQL Host', Config::get('database.connections.mysql.host'));
        $result['port'] = $this->output->ask('MySQL Port', Config::get('database.connections.mysql.port') ?: false) ?: '';
        $result['database'] = $this->ask('Database Name', Config::get('database.connections.mysql.database'));
        $result['username'] = $this->ask('MySQL Login', Config::get('database.connections.mysql.username'));
        $result['password'] = $this->ask('MySQL Password', Config::get('database.connections.mysql.password') ?: false) ?: '';
        return $result;
    }

    protected function setupDatabasePgsql()
    {
        $result = [];
        $result['host'] = $this->ask('Postgres Host', Config::get('database.connections.pgsql.host'));
        $result['port'] = $this->ask('Postgres Port', Config::get('database.connections.pgsql.port') ?: false) ?: '';
        $result['database'] = $this->ask('Database Name', Config::get('database.connections.pgsql.database'));
        $result['username'] = $this->ask('Postgres Login', Config::get('database.connections.pgsql.username'));
        $result['password'] = $this->ask('Postgres Password', Config::get('database.connections.pgsql.password') ?: false) ?: '';
        return $result;
    }

    protected function setupDatabaseSqlite()
    {
        $filename = $this->ask('Database path', Config::get('database.connections.sqlite.database'));

        try {
            if (!file_exists($filename)) {
                $directory = dirname($filename);
                if (!is_dir($directory)) {
                    mkdir($directory, 0777, true);
                }

                new PDO('sqlite:'.$filename);
            }
        }
        catch (Exception $ex) {
            $this->error($ex->getMessage());
            $this->setupDatabaseSqlite();
        }

        return ['database' => $filename];
    }

    protected function setupDatabaseSqlsrv()
    {
        $result = [];
        $result['host'] = $this->ask('SQL Host', Config::get('database.connections.sqlsrv.host'));
        $result['port'] = $this->ask('SQL Port', Config::get('database.connections.sqlsrv.port') ?: false) ?: '';
        $result['database'] = $this->ask('Database Name', Config::get('database.connections.sqlsrv.database'));
        $result['username'] = $this->ask('SQL Login', Config::get('database.connections.sqlsrv.username'));
        $result['password'] = $this->ask('SQL Password', Config::get('database.connections.sqlsrv.password') ?: false) ?: '';
        return $result;
    }

    //
    // Migration
    //

    protected function setupAdminUser()
    {
        $this->line('Enter a new value, or press ENTER for the default');

        SeedSetupAdmin::$firstName = $this->ask('First Name', SeedSetupAdmin::$firstName);
        SeedSetupAdmin::$lastName = $this->ask('Last Name', SeedSetupAdmin::$lastName);
        SeedSetupAdmin::$email = $this->ask('Email Address', SeedSetupAdmin::$email);
        SeedSetupAdmin::$login = $this->ask('Admin Login', SeedSetupAdmin::$login);
        SeedSetupAdmin::$password = $this->ask('Admin Password', SeedSetupAdmin::$password);

        if (!$this->confirm('Is the information correct?', true)) {
            $this->setupAdminUser();
        }
    }

    protected function setupMigrateDatabase()
    {
        $this->line('Migrating application and plugins...');

        try {
            Db::purge();

            UpdateManager::instance()
                ->setNotesOutput($this->output)
                ->update()
            ;
        }
        catch (Exception $ex) {
            $this->error($ex->getMessage());
            $this->setupDatabaseConfig();
            $this->setupMigrateDatabase();
        }
    }

    //
    // Helpers
    //

    protected function displayIntro()
    {
        $message = [
            ".====================================================================.",
            "                                                                      ",
            " .d8888b.   .o8888b.   db  .d8888b.  d8888b. d88888b d8888b.  .d888b. ",
            ".8P    Y8. d8P    Y8   88 .8P    Y8. 88  `8D 88'     88  `8D .8P , Y8.",
            "88      88 8P      oooo88 88      88 88oooY' 88oooo  88oobY' 88  |  88",
            "88      88 8b      ~~~~88 88      88 88~~~b. 88~~~~  88`8b   88  |/ 88",
            "`8b    d8' Y8b    d8   88 `8b    d8' 88   8D 88.     88 `88. `8b | d8'",
            " `Y8888P'   `Y8888P'   YP  `Y8888P'  Y8888P' Y88888P 88   YD  `Y888P' ",
            "                                                                      ",
            "`=========================== INSTALLATION ==========================='",
            "",
        ];

        $this->line($message);
    }

    protected function displayOutro()
    {
        $message = [
            ".=========================================.",
            "                ,@@@@@@@,                  ",
            "        ,,,.   ,@@@@@@/@@,  .oo8888o.      ",
            "     ,&%%&%&&%,@@@@@/@@@@@@,8888\88/8o     ",
            "    ,%&\%&&%&&%,@@@\@@@/@@@88\88888/88'    ",
            "    %&&%&%&/%&&%@@\@@/ /@@@88888\88888'    ",
            "    %&&%/ %&%%&&@@\ V /@@' `88\8 `/88'     ",
            "    `&%\ ` /%&'    |.|        \ '|8'       ",
            "        |o|        | |         | |         ",
            "        |.|        | |         | |         ",
            "`========= INSTALLATION COMPLETE ========='",
            "",
        ];

        $this->line($message);
    }

    protected function writeToConfig($file, $values)
    {
        $configFile = $this->getConfigFile($file);

        foreach ($values as $key => $value) {
            Config::set($file.'.'.$key, $value);
        }

        $this->configWriter->toFile($configFile, $values);
    }

    /**
     * Get a config file and contents.
     *
     * @return array
     */
    protected function getConfigFile($name = 'app')
    {
        $env = $this->option('env') ? $this->option('env').'/' : '';

        $name .= '.php';

        $contents = File::get($path = $this->laravel['path.config']."/{$env}{$name}");

        return $path;
    }
}
