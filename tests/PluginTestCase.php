<?php namespace October\Core\Tests;

use October\Rain\Database\Model as ActiveRecord;
use October\Core\Tests\Concerns\CreatesApplication;
use October\Core\Tests\Concerns\InteractsWithAuthentication;
use October\Core\Tests\Concerns\RunsMigrations;
use October\Core\Tests\Concerns\TestsPlugins;

abstract class PluginTestCase extends TestCase
{
    use CreatesApplication;
    use InteractsWithAuthentication;
    use RunsMigrations;
    use TestsPlugins;

    /**
     * Perform test case set up.
     * @return void
     */
    public function setUp() : void
    {
        $this->resetManagers();

        // Create application
        parent::setUp();

        // Ensure system is up to date
        if ($this->usingTestDatabase) {
            $this->runOctoberUpCommand();
        }

        // Detect a plugin and autoload it, if necessary
        $this->detectPlugin();

        // Disable mailer
        \Mail::pretend();
    }

    /**
     * Flush event listeners and collect garbage.
     * @return void
     */
    public function tearDown() : void
    {
        $this->flushModelEventListeners();

        parent::tearDown();
    }

    /**
     * The models in October use a static property to store their events, these
     * will need to be targeted and reset ready for a new test cycle.
     * Pivot models are an exception since they are internally managed.
     * @return void
     */
    protected function flushModelEventListeners()
    {
        foreach (get_declared_classes() as $class) {
            if ($class == 'October\Rain\Database\Pivot') {
                continue;
            }

            $reflectClass = new \ReflectionClass($class);
            if (
                !$reflectClass->isInstantiable() ||
                !$reflectClass->isSubclassOf('October\Rain\Database\Model') ||
                $reflectClass->isSubclassOf('October\Rain\Database\Pivot')
            ) {
                continue;
            }

            $class::flushEventListeners();
        }

        ActiveRecord::flushEventListeners();
    }
}
