<?php

use October\Rain\Foundation\Bootstrap\LoadConfiguration;
use Symfony\Component\Console\Input\ArrayInput;
use Symfony\Component\Console\Output\NullOutput;
use System\Console\OctoberEnv;

class OctoberEnvTest extends TestCase
{
    /** @var bool If the config fixtures have been copied */
    public static $fixturesCopied = false;

    /** @var string Stores the original config path from the app container */
    public static $origConfigPath;

    protected function setUp(): void
    {
        parent::setUp();

        $this->setUpConfigFixtures();
        $this->stubOutEnvFile();
    }

    public function testCommand()
    {
        $command = new OctoberEnv();
        $command->setLaravel($this->app);
        $command->run(new ArrayInput([]), new NullOutput);

        // Check environment file
        $envFile = file_get_contents(base_path('.env'));

        $this->assertStringContainsString('APP_DEBUG=true', $envFile);
        $this->assertStringContainsString('APP_URL=https://localhost', $envFile);
        $this->assertStringContainsString('DB_CONNECTION=mysql', $envFile);
        $this->assertStringContainsString('DB_DATABASE="data#base"', $envFile);
        $this->assertStringContainsString('DB_USERNAME="teal\'c"', $envFile);
        $this->assertStringContainsString('DB_PASSWORD="test\\"quotes\'test"', $envFile);
        $this->assertStringContainsString('DB_PORT=3306', $envFile);

        // Check app.php config file
        $appConfigFile = file_get_contents(storage_path('temp/tests/config/app.php'));

        $this->assertStringContainsString('\'debug\' => env(\'APP_DEBUG\', true),', $appConfigFile);
        $this->assertStringContainsString('\'url\' => env(\'APP_URL\', \'https://localhost\'),', $appConfigFile);

        // Check database.php config file
        $appConfigFile = file_get_contents(storage_path('temp/tests/config/database.php'));

        $this->assertStringContainsString('\'default\' => env(\'DB_CONNECTION\', \'mysql\')', $appConfigFile);
        $this->assertStringContainsString('\'port\' => env(\'DB_PORT\', 3306),', $appConfigFile);
        // Both the following configurations had values in the original config, they should be stripped out once
        // the .env file is generated.
        $this->assertStringContainsString('\'username\' => env(\'DB_USERNAME\', \'\'),', $appConfigFile);
        $this->assertStringContainsString('\'password\' => env(\'DB_PASSWORD\', \'\'),', $appConfigFile);
    }

    protected function tearDown(): void
    {
        $this->tearDownConfigFixtures();
        $this->restoreEnvFile();

        parent::tearDown();
    }

    protected function setUpConfigFixtures()
    {
        // Mock config path and copy fixtures
        if (!is_dir(storage_path('temp/tests/config'))) {
            mkdir(storage_path('temp/tests/config'), 0777, true);
        }

        foreach (glob(base_path('tests/fixtures/config/*.php')) as $file) {
            $path = pathinfo($file);
            copy($file, storage_path('temp/tests/config/' . $path['basename']));
        }

        static::$fixturesCopied = true;

        // Store original config path
        static::$origConfigPath = $this->app->make('path.config');

        $this->app->instance('path.config', storage_path('temp/tests/config'));

        // Re-load configuration
        $configBootstrap = new LoadConfiguration;
        $configBootstrap->bootstrap($this->app);
    }

    protected function tearDownConfigFixtures()
    {
        // Remove copied config fixtures
        if (static::$fixturesCopied) {
            foreach (glob(storage_path('temp/tests/config/*.php')) as $file) {
                unlink($file);
            }
            rmdir(storage_path('temp/tests/config'));
            rmdir(storage_path('temp/tests'));

            static::$fixturesCopied = false;
        }

        // Restore config path
        if (self::$origConfigPath) {
            $this->app->instance('path.config', static::$origConfigPath);

            static::$origConfigPath = null;
        }

        // Re-load configuration
        $configBootstrap = new LoadConfiguration;
        $configBootstrap->bootstrap($this->app);
    }

    protected function stubOutEnvFile()
    {
        if (file_exists(base_path('.env.stub'))) {
            unlink(base_path('.env.stub'));
        }
        if (file_exists(base_path('.env'))) {
            rename(base_path('.env'), base_path('.env.stub'));
        }
    }

    protected function restoreEnvFile()
    {
        unlink(base_path('.env'));

        if (file_exists(base_path('.env.stub'))) {
            rename(base_path('.env.stub'), base_path('.env'));
        }
    }
}
