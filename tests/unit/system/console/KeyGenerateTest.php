<?php

use October\Rain\Foundation\Bootstrap\LoadConfiguration;
use October\Rain\Foundation\Console\KeyGenerateCommand;
use Symfony\Component\Console\Input\ArrayInput;
use Symfony\Component\Console\Output\BufferedOutput;
use Symfony\Component\Console\Output\NullOutput;

class KeyGenerateTest extends TestCase
{
    /** @var bool If the config fixtures have been copied */
    public static $fixturesCopied = false;

    /** @var string Stores the original config path from the app container */
    public static $originalConfigPath;

    protected function setUp(): void
    {
        parent::setUp();

        $this->setupConfigFixtures();
    }

    protected function tearDown(): void
    {
        $this->tearDownConfigFixtures();
        $this->restoreEnvFile();

        parent::tearDown();
    }

    public function testCommand()
    {
        $appKey = $this->runCommand();

        // Check config file
        $appConfigFile = file_get_contents(storage_path('temp/tests/config/app.php'));

        $this->assertStringContainsString("'key' => '{$appKey}',", $appConfigFile);
    }

    public function test_it_replaces_the_app_key_in_current_environment_app_config()
    {
        if (!is_dir(storage_path('temp/tests/config/testing'))) {
            mkdir(storage_path('temp/tests/config/testing'), 0777, true);
        }

        copy(storage_path('temp/tests/config/app.php'), storage_path('temp/tests/config/testing/app.php'));

        $appKey = $this->runCommand();

        // Check testing app.php config file
        $testingAppConfig = file_get_contents(storage_path('temp/tests/config/testing/app.php'));

        $this->assertStringContainsString("'key' => '{$appKey}',", $testingAppConfig);

        // Check app.php config file
        $appConfig = file_get_contents(storage_path('temp/tests/config/app.php'));

        $this->assertStringNotContainsString("'key' => '{$appKey}',", $appConfig);
    }

    public function test_it_replaces_the_app_key_in_env_file()
    {
        $this->stubOutEnvFile();
        $envCommand = new \System\Console\OctoberEnv();
        $envCommand->setLaravel($this->app);
        $envCommand->run(new ArrayInput([]), new NullOutput());

        $appKey = $this->runCommand();

        // Check environment file
        $envFile = file_get_contents($this->app->environmentFilePath());

        $this->assertStringContainsString('APP_KEY='.$appKey, $envFile);
    }

    public function test_it_replaces_the_app_config_key_when_app_key_is_missing_from_env_file()
    {
        $this->stubOutEnvFile();
        $envCommand = new \System\Console\OctoberEnv();
        $envCommand->setLaravel($this->app);
        $envCommand->run(new ArrayInput([]), new NullOutput());

        $envFile = file_get_contents($this->app->environmentFilePath());
        // Comment out the app key
        $envFile = preg_replace('/^APP_KEY=/m', '#${0}', $envFile);
        file_put_contents($this->app->environmentFilePath(), $envFile);

        $appKey = $this->runCommand();

        // Check environment file
        $envFile = file_get_contents($this->app->environmentFilePath());

        $this->assertStringNotContainsString("APP_KEY={$appKey}", $envFile);

        // Check app.php config file
        $appConfig = file_get_contents(storage_path('temp/tests/config/app.php'));

        $this->assertStringContainsString("'key' => env('APP_KEY', '${appKey}'),", $appConfig);
    }

    /**
     * Runs the key generate command and returns the newly generated app key
     *
     * @return string|null
     * @throws \Illuminate\Contracts\Container\BindingResolutionException
     */
    protected function runCommand(): ?string
    {
        $output = new BufferedOutput();

        /** @var KeyGenerateCommand $command */
        $command = $this->app->make(KeyGenerateCommand::class);
        $command->setLaravel($this->app);
        $command->run(new ArrayInput([]), $output);

        preg_match('/\[(.*)\]/', $output->fetch(), $matches);

        return isset($matches[1]) ? $matches[1] : null;
    }

    protected function setupConfigFixtures()
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
        static::$originalConfigPath = $this->app->make('path.config');

        $this->app->instance('path.config', storage_path('temp/tests/config'));

        // Re-load configuration
        $configBootstrap = new LoadConfiguration();
        $configBootstrap->bootstrap($this->app);
    }

    protected function tearDownConfigFixtures()
    {
        // Remove copied config fixtures
        if (static::$fixturesCopied) {
            foreach (glob(storage_path('temp/tests/config/testing/*.php')) as $file) {
                unlink($file);
            }

            foreach (glob(storage_path('temp/tests/config/*.php')) as $file) {
                unlink($file);
            }

            @rmdir(storage_path('temp/tests/config/testing'));
            rmdir(storage_path('temp/tests/config'));
            rmdir(storage_path('temp/tests'));

            static::$fixturesCopied = false;
        }

        // Restore config path
        if (static::$originalConfigPath) {
            $this->app->instance('path.config', static::$originalConfigPath);

            static::$originalConfigPath = null;
        }

        // Re-load configuration
        $configBootstrap = new LoadConfiguration();
        $configBootstrap->bootstrap($this->app);
    }

    protected function stubOutEnvFile()
    {
        if (file_exists(base_path('.env.stub'))) {
            unlink(base_path('.env.stub'));
        }

        if (file_exists($this->app->environmentFilePath())) {
            rename($this->app->environmentFilePath(), base_path('.env.stub'));
        }
    }

    protected function restoreEnvFile()
    {
        if (file_exists($this->app->environmentFilePath())) {
            unlink($this->app->environmentFilePath());
        }

        if (file_exists(base_path('.env.stub'))) {
            rename(base_path('.env.stub'), $this->app->environmentFilePath());
        }
    }
}
