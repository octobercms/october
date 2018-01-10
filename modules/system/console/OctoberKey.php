<?php namespace System\Console;

use Illuminate\Console\Command;
use Illuminate\Encryption\Encrypter;
use October\Rain\Config\ConfigWriter;
use File;
use Config;
use Str;

class OctoberKey extends Command
{
    /**
     * The console command name.
     */
    protected $name = 'october:key';

    /**
     * The console command description.
     */
    protected $description = 'Set the october application key';

    protected $configWriter;

    /**
     * Create a new command instance.
     */
    public function __construct()
    {
        parent::__construct();

        $this->configWriter = new ConfigWriter;
    }

    public function handle()
    {
        $key = $this->generateRandomKey();

        $this->writeToConfig('app', ['key' => $key]);

        $this->laravel['config']['app.key'] = $key;

        $this->info("Application key [$key] set successfully.");
    }

    /**
     * Generate a random key for the application.
     *
     * @return string
     */
    protected function generateRandomKey()
    {
        return 'base64:' . base64_encode(
                Encrypter::generateKey($this->laravel['config']['app.cipher'])
            );
    }

    protected function writeToConfig($file, $values)
    {
        $configFile = $this->getConfigFile($file);

        foreach ($values as $key => $value) {
            Config::set($file . '.' . $key, $value);
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
        $env = $this->option('env') ? $this->option('env') . '/' : '';
        $name .= '.php';
        $contents = File::get($path = $this->laravel['path.config'] . "/{$env}{$name}");
        return $path;
    }
}
