<?php namespace October\Core\Tests\Concerns;

use Config;
use Backend\Classes\AuthManager;

trait CreatesApplication
{
    /**
     * Determines if a test SQLite database is being used
     *
     * @var boolean
     */
    protected $usingTestDatabase = false;

    /**
     * The test SQLite database in use
     *
     * @var string
     */
    protected $testDatabasePath;

    /**
     * Creates the application.
     *
     * @return \Illuminate\Foundation\Application
     */
    public function createApplication()
    {
        $app = require __DIR__ . '/../../bootstrap/app.php';
        $app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();
        $app['cache']->setDefaultDriver('array');
        $app->setLocale('en');

        $app->singleton('auth', function ($app) {
            $app['auth.loaded'] = true;

            return AuthManager::instance();
        });

        // Use test database configuration, unless overriden
        $dbConnection = Config::get('database.default', 'sqlite');
        $dbConnections = [
            $dbConnection => Config::get('database.connections.' . $dbConnection, [
                'driver' => 'sqlite',
                'database' => ':memory:',
                'prefix' => '',
            ])
        ];

        if (env('APP_ENV') === 'testing' && !Config::get('database.useConfigForTesting', false)) {
            $this->usingTestDatabase = true;

            $dbConnection = 'sqlite';
            $dbConnections = [
                'sqlite' => [
                    'driver' => 'sqlite',
                    'database' => ':memory:',
                    'prefix' => '',
                ],
            ];
        } elseif (env('APP_ENV') === 'dusk' && !Config::get('database.useConfigForTesting', false)) {
            $this->usingTestDatabase = true;

            $dbConnection = 'sqlite';
            $dbConnections = [
                'sqlite' => [
                    'driver' => 'sqlite',
                    'database' => 'storage/dusk.sqlite',
                    'prefix' => '',
                ],
            ];

            // Ensure a fresh copy of the SQLite database is made
            $this->testDatabasePath = base_path('storage/dusk.sqlite');

            if (file_exists($this->testDatabasePath)) {
                unlink($this->testDatabasePath);
            }

            touch($this->testDatabasePath);
        }

        $app['config']->set('database.default', $dbConnection);
        $app['config']->set('database.connections.' . $dbConnection, $dbConnections[$dbConnection]);

        /**
         * Prevent mail from being sent out
         */
        $app['config']->set('mail.driver', 'array');

        /**
         * Modify the plugin path away from the test context
         */
        $app->setPluginsPath(realpath(base_path().Config::get('cms.pluginsPath')));

        return $app;
    }
}
