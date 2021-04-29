<?php namespace System\Console;

use PDO;
use Config;
use System\Classes\UpdateManager;
use October\Rain\Process\Composer as ComposerProcess;
use Symfony\Component\Console\Input\InputOption;
use Illuminate\Console\Command;
use Exception;

/**
 * OctoberInstall is a console command to install October CMS
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
    use \System\Traits\SetupHelper;
    use \System\Traits\SetupBuilder;

    /**
     * @var string name is the console command name
     */
    protected $name = 'october:install';

    /**
     * @var string description is the console command description
     */
    protected $description = 'Set up October CMS for the first time.';

    /**
     * @var int keyRetries counts license key attempts before giving up
     */
    protected $keyRetries = 0;

    /**
     * handle executes the console command
     */
    public function handle()
    {
        if (!$this->checkEnvWritable()) {
            $this->output->error('Cannot write to .env file. Check file permissions and try again.');
            return 1;
        }

        $this->outputIntro();
        $this->setupEncryptionKey();
        $this->outputLanguageTable();
        $this->setupLanguage();

        $this->output->section('Application Configuration');
        $this->setupApplicationUrls();
        $this->setupDatabaseConfig();

        $this->output->section('License Key');
        $this->setupLicenseKey();

        $this->output->section('Installing Dependencies');
        $this->setupInstallOctober();

        // $this->output->section('Migrating Database');
        // $this->refreshEnvVars();
        // $this->setupMigrateDatabase();

        $this->outputOutro();
    }

    /**
     * setupLanguage asks the user their language preference
     */
    protected function setupLanguage()
    {
        try {
            $locale = strtolower($this->ask('Select Language', env('APP_LOCALE', 'en')));

            $availableLocales = $this->getAvailableLocales();
            if (!isset($availableLocales[$locale])) {
                throw new Exception("Language code '{$locale}' is invalid, please try again");
            }

            $this->setEnvVar('APP_LOCALE', $locale);
        }
        catch (Exception $ex) {
            $this->output->error($ex->getMessage());
            return $this->setupLanguage();
        }
    }

    /**
     * outputLanguageTable displays a 2 column table with the available locales
     */
    protected function outputLanguageTable()
    {
        $locales = $this->getAvailableLocales();

        $tableRows = [];
        $halfCount = count($locales) / 2;
        $i = 0;
        foreach ($locales as $locale => $info) {
            if ($i < $halfCount) {
                $tableRows[$i] = [$locale, "({$info[1]}) {$info[0]}"];
            }
            else {
                $tableRows[$i-$halfCount] = array_merge(
                    $tableRows[$i-$halfCount],
                    [$locale, "({$info[1]}) {$info[0]}"]
                );
            }
            $i++;
        }

        $this->output->table(['Code', 'Language', 'Code', 'Language'], $tableRows);
    }

    /**
     * setupApplicationUrls asks for URL based configuration
     */
    protected function setupApplicationUrls()
    {
        $url = $this->ask('Application URL', env('APP_URL', 'http://localhost'));
        $this->setEnvVar('APP_URL', $url);

        $this->comment('To secure your application, use a custom address for accessing the admin panel.');
        $backendUri = $this->ask('Backend URI', env('BACKEND_URI', '/backend'));
        $this->setEnvVar('BACKEND_URI', $backendUri);
    }

    /**
     * setupEncryptionKey sets the application encryption key if not set already
     */
    protected function setupEncryptionKey()
    {
        if (env('APP_KEY')) {
            return;
        }

        $key = $this->getRandomKey();
        $this->setEnvVar('APP_KEY', $key);
        Config::set('app.key', $key);

        $this->info(sprintf('Application key [%s] set successfully.', $key));
    }

    /**
     * setupDatabaseConfig requests the database engine
     */
    protected function setupDatabaseConfig()
    {
        $type = $this->choice('Database Engine', [
            'SQLite',
            'MySQL',
            'Postgres',
            'SQL Server'
        ], 'SQLite');

        $typeMap = [
            'SQLite' => 'sqlite',
            'MySQL' => 'mysql',
            'Postgres' => 'pgsql',
            'SQL Server' => 'sqlsrv',
        ];

        $driver = $typeMap[$type] ?? 'sqlite';

        $this->setEnvVar('DB_CONNECTION', $driver);
        Config::set('database.default', $driver);

        if ($driver === 'sqlite') {
            $this->setupDatabaseSqlite();
        }
        else {
            $this->setupDatabase($driver);
        }

        // Validate database connection
        try {
            $this->checkDatabaseFromConfig($driver);
        }
        catch (Exception $ex) {
            $this->output->error($ex->getMessage());
            return $this->setupDatabaseConfig();
        }
    }

    /**
     * checkDatabaseFromConfig validates the supplied database config
     * and throws an exception if something is wrong
     */
    protected function checkDatabaseFromConfig($driver)
    {
        $this->checkDatabase(
            $driver,
            Config::get("database.connections.{$driver}.host"),
            Config::get("database.connections.{$driver}.port"),
            Config::get("database.connections.{$driver}.database"),
            Config::get("database.connections.{$driver}.username"),
            Config::get("database.connections.{$driver}.password")
        );
    }

    /**
     * setupDatabase sets up a SQL based database
     */
    protected function setupDatabase($driver)
    {
        $this->comment('Hostname for the database connection.');
        $host = $this->ask('Database Host', env('DB_HOST', 'localhost'));
        $this->setEnvVar('DB_HOST', $host);
        Config::set("database.connections.{$driver}.host", $host);

        $this->comment('(Optional) A port for the connection');
        $port = $this->ask('Database Port', env('DB_PORT', false)) ?: '';
        $this->setEnvVar('DB_PORT', $port);
        Config::set("database.connections.{$driver}.port", $port);

        $this->comment('Specify the name of an empty database.');
        $database = $this->ask('Database Name', env('DB_DATABASE', 'octobercms'));
        $this->setEnvVar('DB_DATABASE', $database);
        Config::set("database.connections.{$driver}.database", $database);

        $this->comment('User with create database privileges.');
        $username = $this->ask('Database Login', env('DB_USERNAME', 'root'));
        $this->setEnvVar('DB_USERNAME', $username);
        Config::set("database.connections.{$driver}.username", $username);

        $this->comment('Password for the specified user.');
        $password = $this->ask('Database Password', env('DB_PASSWORD', false)) ?: '';
        $this->setEnvVar('DB_PASSWORD', $password);
        Config::set("database.connections.{$driver}.password", $password);
    }

    /**
     * setupDatabaseSqlite sets up the SQLite database engine
     */
    protected function setupDatabaseSqlite()
    {
        $this->comment('For file-based storage, enter a path relative to the application root directory.');

        $defaultDb = env('DB_DATABASE', 'storage/database.sqlite');
        if ($defaultDb === 'database') {
            $defaultDb = 'storage/database.sqlite';
        }

        $filename = $this->ask('Database Path', $defaultDb);
        $this->setEnvVar('DB_DATABASE', $filename);
        Config::set("database.connections.sqlite.database", $filename);

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
            $this->output->error($ex->getMessage());
            return $this->setupDatabaseSqlite();
        }

        return ['database' => $filename];
    }

    /**
     * setupLicenseKey asks for the licence key
     */
    protected function setupLicenseKey()
    {
        if ($this->keyRetries++ > 10) {
            $this->output->error('Too many failed attempts, please try again');

            $this->comment('If you see this error immediately, use these non-interactive commands instead');
            $this->output->newLine();
            $this->line("* php artisan project:set <LICENSE KEY>");
            $this->output->newLine();
            $this->line("* php artisan october:build");
            exit(1);
        }

        $this->comment('Enter a valid License Key to proceed.');

        $licenceKey = trim($this->ask('License Key'));
        if (!strlen($licenceKey)) {
            return $this->setupLicenseKey();
        }

        try {
            $this->setupSetProject($licenceKey);

            $this->output->success('Thanks for being a customer of October CMS!');
        }
        catch (Exception $ex) {
            $this->output->error($ex->getMessage());
            return $this->setupLicenseKey();
        }
    }

    /**
     * setupMigrateDatabase migrates the database
     */
    protected function setupMigrateDatabase()
    {
        $errCode = null;
        $exec = 'php artisan october:migrate';
        $this->comment("Executing: {$exec}");
        $this->output->newLine();

        passthru($exec, $errCode);

        if ($errCode !== 0) {
            $this->outputFailedOutro();
            exit(1);
        }

        // $this->line('Migrating application and plugins...');

        // try {
        //     Db::purge();

        //     UpdateManager::instance()
        //         ->setNotesOutput($this->output)
        //         ->update()
        //     ;
        // }
        // catch (Exception $ex) {
        //     $this->output->error($ex->getMessage());
        //     $this->setupDatabaseConfig();
        //     $this->setupMigrateDatabase();
        // }
    }

    /**
     * outputFailedOutro displays the failure message
     */
    protected function outputFailedOutro()
    {
        $this->output->title('INSTALLATION FAILED');

        $this->output->error('Please try running these commands manually');

        $commands = [];
        $commands[] = 'php artisan project:set <license key>';

        if ($want = $this->option('want')) {
            $commands[] = 'php artisan october:build --want='.$want;
        }
        else {
            $commands[] = 'php artisan october:build';
        }

        $this->output->listing($commands);
    }

    /**
     * getOptions get the console command options
     */
    protected function getOptions()
    {
        return [
            ['want', 'w', InputOption::VALUE_REQUIRED, 'Provide a custom version.'],
        ];
    }
}
