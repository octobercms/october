<?php namespace System\Console;

use Str;
use File;
use Config;
use October\Rain\Config\ConfigWriter;
use Illuminate\Console\Command;
use Illuminate\Encryption\Encrypter;
use Symfony\Component\Console\Input\InputOption;

/**
 * Console command to regenerate the app key in the config file.
 *
 * @package october\system
 * @author Alexey Bobkov, Samuel Georges
 */
class OctoberKey extends Command
{
    use \Illuminate\Console\ConfirmableTrait;

    /**
     * The console command name.
     */
    protected $name = 'october:key';

    /**
     * The console command description.
     */
    protected $description = 'Generate new key.';

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
        $this->setupEncryptionKey();
    }

    /**
     * Get the console command arguments.
     */
    protected function getArguments()
    {
        return [];
    }

    //
    // Encryption key
    //

    protected function setupEncryptionKey()
    {
        $validKey = false;
        $cipher = Config::get('app.cipher');
        $keyLength = $this->getKeyLength($cipher);
        $key = $this->getRandomKey($cipher);

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
