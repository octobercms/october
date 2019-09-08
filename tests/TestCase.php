<?php

use System\Classes\UpdateManager;
use System\Classes\PluginManager;
use Backend\Classes\AuthManager;
use October\Tests\Concerns\InteractsWithAuthentication;

class TestCase extends Illuminate\Foundation\Testing\TestCase
{
    use InteractsWithAuthentication;

    /**
     * Creates the application.
     *
     * @return \Illuminate\Foundation\Application
     */
    public function createApplication()
    {
        $app = require __DIR__.'/../bootstrap/app.php';

        $app->singleton('auth', function ($app) {
            $app['auth.loaded'] = true;

            return AuthManager::instance();
        });

        $app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

        $app['cache']->setDefaultDriver('array');
        $app->setLocale('en');

        /*
         * Store database in memory by default, if not specified otherwise
         */
        $dbConnection = 'sqlite';

        $dbConnections = [];
        $dbConnections['sqlite'] = [
            'driver'   => 'sqlite',
            'database' => ':memory:',
            'prefix'   => ''
        ];

        if (env('APP_ENV') === 'testing' && Config::get('database.useConfigForTesting', false)) {
            $dbConnection = Config::get('database.default', 'sqlite');

            $dbConnections[$dbConnection] = Config::get('database.connections' . $dbConnection, $dbConnections['sqlite']);
        }

        $app['config']->set('database.default', $dbConnection);
        $app['config']->set('database.connections.' . $dbConnection, $dbConnections[$dbConnection]);

        return $app;
    }

    /**
     * Perform test case set up.
     * @return void
     */
    public function setUp()
    {
        /*
         * Force reload of October singletons
         */
        PluginManager::forgetInstance();
        UpdateManager::forgetInstance();

        /*
         * Create application instance
         */
        parent::setUp();

        /*
         * Ensure system is up to date
         */
        $this->runOctoberUpCommand();

        /*
         * Disable mailer
         */
        Mail::pretend();
    }

    /**
     * Migrate database using october:up command.
     * @return void
     */
    protected function runOctoberUpCommand()
    {
        Artisan::call('october:up');
    }

    //
    // Helpers
    //

    protected static function callProtectedMethod($object, $name, $params = [])
    {
        $className = get_class($object);
        $class = new ReflectionClass($className);
        $method = $class->getMethod($name);
        $method->setAccessible(true);
        return $method->invokeArgs($object, $params);
    }

    public static function getProtectedProperty($object, $name)
    {
        $className = get_class($object);
        $class = new ReflectionClass($className);
        $property = $class->getProperty($name);
        $property->setAccessible(true);
        return $property->getValue($object);
    }

    public static function setProtectedProperty($object, $name, $value)
    {
        $className = get_class($object);
        $class = new ReflectionClass($className);
        $property = $class->getProperty($name);
        $property->setAccessible(true);
        return $property->setValue($object, $value);
    }
}
