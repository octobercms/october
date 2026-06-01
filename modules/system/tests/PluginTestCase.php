<?php

require 'concerns/InteractsWithAuthentication.php';
require 'concerns/PerformsMigrations.php';
require 'concerns/PerformsRegistrations.php';

use Backend\Classes\AuthManager;
use October\Rain\Database\Model as ActiveRecord;

abstract class PluginTestCase extends TestCase
{
    use \October\Tests\Concerns\InteractsWithAuthentication;
    use \October\Tests\Concerns\PerformsMigrations;
    use \October\Tests\Concerns\PerformsRegistrations;

    /**
     * @var bool autoMigrate performs database migrations upon setup,
     * for the core and the current plugin and it's dependencies.
     */
    protected $autoMigrate = true;

    /**
     * @var bool autoRegister performs plugin boot and registration.
     */
    protected $autoRegister = true;

    /**
     * Creates the application.
     * @return Symfony\Component\HttpKernel\HttpKernelInterface
     */
    public function createApplication()
    {
        $app = require __DIR__.'/../../../bootstrap/app.php';
        $app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

        // Register auth provider
        $app->singleton('auth', function ($app) {
            $app['auth.loaded'] = true;
            return AuthManager::instance();
        });

        return $app;
    }

    /**
     * setUp test case
     */
    public function setUp(): void
    {
        // Reset locals
        $this->pluginTestCaseMigratedPlugins = [];
        $this->pluginTestCaseLoadedPlugins = [];

        // Create application instance
        parent::setUp();

        // Register and boot the current plugin
        if ($this->autoRegister === true) {
            $this->loadCurrentPlugin();
        }

        // Migrate core and current plugin
        if ($this->autoMigrate === true) {
            $this->migrateModules();
            $this->migrateCurrentPlugin();
        }

        // Disable mailer
        Mail::pretend();
    }

    /**
     * tearDown test case will flush event listeners and collect garbage.
     */
    public function tearDown(): void
    {
        $this->flushModelEventListeners();
        parent::tearDown();
        unset($this->app);
    }

    /**
     * flushModelEventListeners for the models, which in October CMS use a static property
     * to store their events, these will need to be targeted and reset ready for a new test
     * cycle. Pivot models are an exception since they are internally managed.
     * @return void
     */
    protected function flushModelEventListeners()
    {
        foreach (get_declared_classes() as $class) {
            if ($class == \October\Rain\Database\Pivot::class) {
                continue;
            }

            if (str_starts_with($class, 'Mockery_')) {
                continue;
            }

            $reflectClass = new ReflectionClass($class);
            if (
                !$reflectClass->isInstantiable() ||
                !$reflectClass->isSubclassOf(\October\Rain\Database\Model::class) ||
                $reflectClass->isSubclassOf(\October\Rain\Database\Pivot::class) ||
                $reflectClass->isSubclassOf(\PHPUnit\Framework\MockObject\MockObject::class)
            ) {
                continue;
            }

            $class::flushEventListeners();
        }

        ActiveRecord::flushEventListeners();
    }

    /**
     * guessPluginCodeFromTest locates the plugin code based on the test file location.
     * @return string|bool
     */
    protected function guessPluginCodeFromTest()
    {
        $reflect = new ReflectionClass($this);
        $path = $reflect->getFilename();
        $pluginPath = $this->app->pluginsPath();

        if (strpos($path, $pluginPath) === 0) {
            $result = ltrim(str_replace('\\', '/', substr($path, strlen($pluginPath))), '/');
            $result = implode('.', array_slice(explode('/', $result), 0, 2));
            return $result;
        }

        return false;
    }

    /**
     * isAppCodeFromTest determines if this test is running the app directory
     * @return string|bool
     */
    protected function isAppCodeFromTest()
    {
        $reflect = new ReflectionClass($this);
        $path = $reflect->getFilename();
        $appPath = $this->app->path();

        if (strpos($path, $appPath) === 0) {
            return 'app';
        }

        return false;
    }
}
