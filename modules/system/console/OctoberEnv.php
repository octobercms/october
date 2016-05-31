<?php namespace System\Console;

use Illuminate\Console\Command;

class OctoberEnv extends Command
{

    /**
     * The console command name.
     */
    protected $name = 'october:env';

    /**
     * The console command description.
     */
    protected $description = 'Creates .env file with default configuration values.';

    /**
     * Create a new command instance.
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     */
    public function fire()
    {
        if (file_exists('.env')) {
            return $this->error('.env file already exists.');
        }

        $this->overwriteConfig();

        $this->info('.env configuration file has been created.');
    }

    /**
     * Overwrite config file
     */
    private function overwriteConfig()
    {
        foreach ($this->config() as $file => $keys) {
            $content = $this->configToEnv($file, $keys);

            $this->writeToConfigFile($file, $content);
        }
    }

    /**
     * Replace config values with env() syntax
     *
     * @param $file
     * @param $keys
     * @return string
     */
    private function configToEnv($file, $keys)
    {
        $content = $this->readConfigFile($file);

        foreach ($keys as $envKey => $configKey) {
            $pattern = $this->buildPattern($configKey);
            $callback = $this->buildCallback($file, $envKey, $configKey);

            $content = preg_replace_callback($pattern, $callback, $content);
        }

        $this->writeToEnv("\n");

        return $content;
    }

    /**
     * @param $configKey
     * @return string
     */
    private function buildPattern($configKey)
    {
        return "/['\"]" . $configKey . "['\"]" . "\s*=>\s*[^,\[]+,/";
    }

    /**
     * @param $file
     * @param $envKey
     * @param $configKey
     * @return \Closure
     */
    private function buildCallback($file, $envKey, $configKey)
    {
        return function ($matches) use ($envKey, $configKey, $file) {

            $value = $this->envValue($file, $configKey);

            if ( ! $this->envKeyExists($envKey)) {
                $envLine = sprintf("%s=%s\n", $envKey, $this->stripQuotes($value));
                $this->writeToEnv($envLine);
            }

            return $this->isEnv($matches[0]) ? $matches[0] : "'$configKey' => env('$envKey', {$value}),";
        };
    }

    /**
     * @param $config
     * @param $configKey
     * @return string
     */
    private function envValue($config, $configKey)
    {
        $value = config("$config.$configKey");

        if ($config == 'database') {
            $value = $this->databaseConfigValue($configKey);
        }

        return $this->normalize($value);
    }

    /**
     * @param $configKey
     * @return string
     */
    private function databaseConfigValue($configKey)
    {
        $defaultConnection = config('database.default');

        return $configKey == 'default'
            ? $defaultConnection
            : config("database.connections.$defaultConnection.$configKey");
    }

    /**
     * @param $value
     * @return string
     */
    private function normalize($value)
    {
        if (is_string($value)) {
            return "'$value'";
        } elseif (is_bool($value)) {
            return $value ? 'true' : 'false';
        } elseif (is_null($value)) {
            return 'null';
        }

        return $value;
    }

    /**
     * Strip single and double quotes
     *
     * @param $string
     * @return string
     */
    private function stripQuotes($string)
    {
        return strtr($string, ['"' => '', "'" => '']);
    }

    /**
     * @param $matches
     * @return bool
     */
    private function isEnv($matches)
    {
        return strpos($matches, 'env') !== false;
    }

    /**
     * Write content to .env file
     *
     * @param $content
     */
    private function writeToEnv($content)
    {
        file_put_contents('.env', $content, FILE_APPEND);
    }

    /**
     * @return string
     */
    private function readEnvFile()
    {
        return file_exists('.env') ? file_get_contents('.env') : '';
    }

    /**
     * Write content to config file
     *
     * @param $file
     * @param $content
     */
    private function writeToConfigFile($file, $content)
    {
        file_put_contents(config_path($file . '.php'), $content);
    }

    /**
     * @param $file
     * @return string
     */
    private function readConfigFile($file)
    {
        return file_get_contents(config_path($file . '.php'));
    }

    /**
     * @param $key
     * @return bool
     */
    private function envKeyExists($key)
    {
        return strpos($this->readEnvFile(), $key) !== false;
    }

    /**
     * Configuration array for search and replace
     *
     * @return array
     */
    private function config()
    {
        return [
            'app' => [
                'APP_DEBUG' => 'debug',
                'APP_URL' => 'url',
                'APP_KEY' => 'key',
            ],
            'database' => [
                'DB_CONNECTION' => 'default',
                'DB_HOST' => 'host',
                'DB_PORT' => 'port',
                'DB_DATABASE' => 'database',
                'DB_USERNAME' => 'username',
                'DB_PASSWORD' => 'password',
            ],
            'cache' => [
                'CACHE_DRIVER' => 'default',
            ],
            'session' => [
                'SESSION_DRIVER' => 'driver',
            ],
            'queue' => [
                'QUEUE_DRIVER' => 'default',
            ],
            'mail' => [
                'MAIL_DRIVER' => 'driver',
                'MAIL_HOST' => 'host',
                'MAIL_PORT' => 'port',
                'MAIL_USERNAME' => 'username',
                'MAIL_PASSWORD' => 'password',
                'MAIL_ENCRYPTION' => 'encryption',
            ],
            'cms' => [
                'ROUTES_CACHE' => 'enableRoutesCache',
                'ASSET_CACHE' => 'enableAssetCache',
                'LINK_POLICY' => 'linkPolicy',
                'ENABLE_CSRF' => 'enableCsrfProtection',
            ],
        ];
    }

}
