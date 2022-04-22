<?php namespace System\Console;

use PDO;
use Lang;
use Config;
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

        // Application Configuration
        $this->output->section(Lang::get('system::lang.installer.app_config_section'));
        $this->setupApplicationUrls();
        $this->setupDatabaseConfig();

        // Demo Theme
        $this->output->section(Lang::get('system::lang.installer.demo_section'));
        $this->setupDemoTheme();

        if ($this->nonInteractiveCheck()) {
            $this->outputNonInteractive();
            return 1;
        }

        // License Key
        $this->output->section(Lang::get('system::lang.installer.license_section'));
        $this->setupLicenseKey();

        // Installing Dependencies
        $this->output->section(Lang::get('system::lang.installer.dependencies_section'));
        $this->setupInstallOctober();

        // $this->output->section('Migrating Database');
        // $this->refreshEnvVars();
        // $this->setupMigrateDatabase();

        $this->outputOutro();
    }

    /**
     * setupDemoTheme
     */
    protected function setupDemoTheme()
    {
        // Install the demo theme and content?
        $this->setDemoContent(
            $this->confirm(Lang::get('system::lang.installer.install_demo_label'), true)
        );
    }

    /**
     * setupLanguage asks the user their language preference
     */
    protected function setupLanguage()
    {
        try {
            $locale = strtolower($this->ask(
                // Select Language
                Lang::get('system::lang.installer.locale_select_label'),
                env('APP_LOCALE', 'en')
            ));

            $availableLocales = $this->getAvailableLocales();
            if (!isset($availableLocales[$locale])) {
                throw new Exception("Language code '{$locale}' is invalid, please try again");
            }

            $this->setEnvVar('APP_LOCALE', $locale);
            Lang::setLocale($locale);
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
        $url = $this->ask(
            // Application URL
            Lang::get('system::lang.installer.app_url_label'),
            env('APP_URL', 'http://localhost')
        );
        $url = rtrim(trim($url), '/');
        $this->setEnvVar('APP_URL', $url);

        // To secure your application, use a custom address for accessing the admin panel.
        $this->comment(Lang::get('system::lang.installer.backend_uri_comment'));
        $backendUri = $this->ask(
            // Backend URI
            Lang::get('system::lang.installer.backend_uri_label'),
            env('BACKEND_URI', '/backend')
        );

        if ($backendUri[0] !== '/') {
            $backendUri = '/'.$backendUri;
        }

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
        $typeMap = [
            'SQLite' => 'sqlite',
            'MySQL' => 'mysql',
            'Postgres' => 'pgsql',
            'SQL Server' => 'sqlsrv',
        ];

        $currentDriver = array_flip($typeMap)[$this->getEnvVar('DB_CONNECTION')] ?? 'SQLite';

        $type = $this->choice(
            // Database Engine
            Lang::get('system::lang.installer.database_engine_label'),
            [
                'SQLite',
                'MySQL',
                'Postgres',
                'SQL Server'
            ],
            $currentDriver
        );

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
        // Hostname for the database connection.
        $this->comment(Lang::get('system::lang.installer.database_host_comment'));
        $host = $this->ask(
            // Database Host
            Lang::get('system::lang.installer.database_host_label'),
            $this->getEnvVar('DB_HOST', 'localhost')
        );
        $this->setEnvVar('DB_HOST', $host);
        Config::set("database.connections.{$driver}.host", $host);

        // (Optional) A port for the connection.
        $this->comment(Lang::get('system::lang.installer.database_port_comment'));
        $port = $this->ask(
            // Database Port
            Lang::get('system::lang.installer.database_port_label'),
            $this->getEnvVar('DB_PORT', false)
        ) ?: '';
        $this->setEnvVar('DB_PORT', $port);
        Config::set("database.connections.{$driver}.port", $port);

        // Specify the name of the database to use.
        $this->comment(Lang::get('system::lang.installer.database_name_comment'));
        $database = $this->ask(
            // Database Name
            Lang::get('system::lang.installer.database_name_label'),
            $this->getEnvVar('DB_DATABASE', 'octobercms')
        );
        $this->setEnvVar('DB_DATABASE', $database);
        Config::set("database.connections.{$driver}.database", $database);

        // User with create database privileges.
        $this->comment(Lang::get('system::lang.installer.database_login_comment'));
        $username = $this->ask(
            // Database Login
            Lang::get('system::lang.installer.database_login_label'),
            $this->getEnvVar('DB_USERNAME', 'root')
        );
        $this->setEnvVar('DB_USERNAME', $username);
        Config::set("database.connections.{$driver}.username", $username);

        // Password for the specified user.
        $this->comment(Lang::get('system::lang.installer.database_pass_comment'));
        $password = $this->ask(
            // Database Password
            Lang::get('system::lang.installer.database_pass_label'),
            $this->getEnvVar('DB_PASSWORD', false)
        ) ?: '';
        $this->setEnvVar('DB_PASSWORD', $password);
        Config::set("database.connections.{$driver}.password", $password);
    }

    /**
     * setupDatabaseSqlite sets up the SQLite database engine
     */
    protected function setupDatabaseSqlite()
    {
        // For file-based storage, enter a path relative to the application root directory.
        $this->comment(Lang::get('system::lang.installer.database_path_comment'));

        $defaultDb = $this->getEnvVar('DB_DATABASE', 'storage/database.sqlite');
        if ($defaultDb === 'database') {
            $defaultDb = 'storage/database.sqlite';
        }

        $filename = $this->ask(
            // Database Path
            Lang::get('system::lang.installer.database_path_label'),
            $defaultDb
        );
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
            // Too many failed attempts
            $this->output->error(Lang::get('system::lang.installer.too_many_failures_label'));

            $this->outputNonInteractive();
            exit(1);
        }

        // Enter a valid License Key to proceed.
        $this->comment(Lang::get('system::lang.installer.license_key_comment'));

        // License Key
        $licenceKey = trim($this->ask(Lang::get('system::lang.installer.license_key_label')));
        if (!strlen($licenceKey)) {
            return $this->setupLicenseKey();
        }

        try {
            $this->setupSetProject($licenceKey);

            // Thanks for being a customer of October CMS!
            $this->output->success(Lang::get('system::lang.installer.license_thanks_comment'));
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
        $this->line('');

        passthru($exec, $errCode);

        if ($errCode !== 0) {
            $this->outputFailedOutro();
            exit(1);
        }
    }

    protected function outputNonInteractive()
    {
        // Too many failed attempts
        $this->output->error(Lang::get('system::lang.installer.non_interactive_label'));

        // If you see this error immediately, use these non-interactive commands instead.
        $this->comment(Lang::get('system::lang.installer.non_interactive_comment'));
        $this->line('');

        // Open this application in your browser
        $this->line(Lang::get('system::lang.installer.open_configurator_comment'));
        $this->line('');

        $this->line('-- OR --');
        $this->line('');

        $this->line("* php artisan project:set <LICENSE KEY>");
        $this->line('');

        if ($want = $this->option('want')) {
            $this->line("* php artisan october:build --want=".$want);
        }
        else {
            $this->line("* php artisan october:build");
        }
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
