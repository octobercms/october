<?php namespace System\Console;

use Illuminate\Console\Command;

/**
 * Console command to convert configuration to use .env files.
 *
 * This creates an .env file with some default configuration values, it also converts
 * the existing PHP-based configuration files to use the `env` function for values.
 *
 * @package october\system
 * @author Alexey Bobkov, Samuel Georges
 */
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
     * @var array The env keys that need to have their original values removed from the config files
     */
    protected $protectedKeys = [
        'APP_KEY',
        'DB_USERNAME',
        'DB_PASSWORD',
        'MAIL_USERNAME',
        'MAIL_PASSWORD',
        'REDIS_PASSWORD',
    ];

    /**
     * The current config cursor.
     */
    protected $config;

    /**
     * The current database connection cursor.
     */
    protected $connection;

    /**
     * Execute the console command.
     */
    public function handle()
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
    protected function overwriteConfig()
    {
        foreach (array_keys($this->config()) as $config) {
            $this->config = $config;

            $this->configToEnv();
        }
    }

    /**
     * Replace config values with env() syntax
     */
    protected function configToEnv()
    {
        $content = $this->parseConfigFile();

        $this->writeToConfigFile($content);
    }

    /**
     * Parse config file line by line
     *
     * @return string
     */
    protected function parseConfigFile()
    {
        $lines = [];

        foreach ($this->lines() as $line) {
            $keys = $this->config()[$this->config];

            $lines[] = $this->parseLine($line, $keys);
        }

        $this->writeToEnv("\n");

        return implode('', $lines);
    }

    /**
     * @param $keys
     * @param $line
     * @return mixed
     */
    protected function parseLine($line, $keys)
    {
        $line = $this->replaceConfigLine($line, $keys);

        $line = $this->replaceDbConfigLine($line);

        return $line;
    }

    /**
     * @param $line
     * @param $keys
     * @return mixed
     */
    protected function replaceConfigLine($line, $keys)
    {
        foreach ($keys as $envKey => $configKey) {
            $pattern = $this->buildPattern($configKey);

            $callback = $this->buildCallback($envKey, $configKey);

            if (preg_match($pattern, $line)) {
                $line = preg_replace_callback($pattern, $callback, $line);
            }
        }

        return $line;
    }

    /**
     * @param $line
     * @return mixed
     */
    protected function replaceDbConfigLine($line)
    {
        if ($this->config == 'database') {
            foreach ($this->dbConfig() as $connection => $settings) {
                $this->setCurrentConnection($line, $connection);

                if ($this->connection == $connection) {
                    $line = $this->replaceConfigLine($line, $settings);
                }
            }
        }

        return $line;
    }

    /**
     * @param $line
     * @param $connection
     */
    protected function setCurrentConnection($line, $connection)
    {
        if (preg_match("/['\"]" . $connection . "['\"]" . "\s*=>/", $line)) {
            $this->connection = $connection;
        }
    }

    /**
     * @param $configKey
     * @return string
     */
    protected function buildPattern($configKey)
    {
        return "/['\"]" . $configKey . "['\"]" . "\s*=>\s*[^,\[]+,/";
    }

    /**
     * @param $envKey
     * @param $configKey
     * @return \Closure
     */
    protected function buildCallback($envKey, $configKey)
    {
        return function ($matches) use ($envKey, $configKey) {
            $value = $this->envValue($configKey);

            $this->saveEnvSettings($envKey, $this->normalizeForEnv($value));

            // Remove protected values from the config files
            if (in_array($envKey, $this->protectedKeys) && !empty($value)) {
                $value = '';
            }

            return $this->isEnv($matches[0]) ? $matches[0] : "'$configKey' => env('$envKey', {$this->normalizeForConfig($value)}),";
        };
    }

    /**
     * @param $key
     * @param $value
     */
    protected function saveEnvSettings($key, $value)
    {
        if (! $this->envKeyExists($key)) {
            $line = sprintf("%s=%s\n", $key, $value);

            if ($this->config == 'database' && $key != 'DB_CONNECTION') {
                $this->writeDbEnvSettings($line);
            } else {
                $this->writeToEnv($line);
            }
        }
    }

    /**
     * @param $line
     */
    protected function writeDbEnvSettings($line)
    {
        if ($this->connection == config('database.default') || $this->connection == 'redis') {
            $this->writeToEnv($line);
        }
    }

    /**
     * @param $configKey
     * @return string
     */
    protected function envValue($configKey)
    {
        $value = config("$this->config.$configKey");

        if ($this->config == 'database') {
            $value = $this->databaseConfigValue($configKey);
        }

        return $value;
    }

    /**
     * @param $configKey
     * @return string
     */
    protected function databaseConfigValue($configKey)
    {
        if ($configKey == 'default') {
            return config('database.default');
        }

        if ($configKey == 'useConfigForTesting') {
            return config('database.useConfigForTesting');
        }

        if ($this->connection == 'redis') {
            return config("database.redis.default.$configKey");
        }

        return config("database.connections.$this->connection.$configKey");
    }

    /**
     * Normalizes a value to be inserted into the .env file
     *
     * @param $value
     * @return string
     */
    protected function normalizeForEnv($value)
    {
        if (is_string($value)) {
            if (preg_match('/["\'#]/', $value)) {
                return '"' . str_replace('"', '\\"', $value) . '"';
            } else {
                return $value;
            }
        } elseif (is_bool($value)) {
            return $value ? 'true' : 'false';
        } elseif ($value === null) {
            return 'null';
        }

        return $value;
    }

    /**
     * Normalizes a value to be inserted into config files.
     *
     * @param $value
     * @return string
     */
    protected function normalizeForConfig($value)
    {
        if (is_string($value)) {
            return '\'' . addslashes($value) . '\'';
        }

        return $this->normalizeForEnv($value);
    }

    /**
     * @param $matches
     * @return bool
     */
    protected function isEnv($matches)
    {
        return strpos($matches, 'env') !== false;
    }

    /**
     * @param $content
     */
    protected function writeToEnv($content)
    {
        file_put_contents('.env', $content, FILE_APPEND);
    }

    /**
     * @return string
     */
    protected function readEnvFile()
    {
        return file_exists('.env') ? file_get_contents('.env') : '';
    }

    /**
     * @param $content
     */
    protected function writeToConfigFile($content)
    {
        file_put_contents(config_path($this->config . '.php'), $content);
    }

    /**
     * @return array
     */
    protected function lines()
    {
        return file(config_path($this->config . '.php'));
    }

    /**
     * @param $key
     * @return bool
     */
    protected function envKeyExists($key)
    {
        return strpos($this->readEnvFile(), $key) !== false;
    }

    /**
     * @return array
     */
    protected function config()
    {
        return [
            'app' => [
                'APP_DEBUG' => 'debug',
                'APP_URL' => 'url',
                'APP_KEY' => 'key',
            ],
            'database' => [
                'DB_CONNECTION' => 'default',
                'DB_USE_CONFIG_FOR_TESTING' => 'useConfigForTesting',
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
                'DATABASE_TEMPLATES' => 'databaseTemplates'
            ],
        ];
    }

    /**
     * @return array
     */
    protected function dbConfig()
    {
        return [
            'sqlite' => [
                'DB_DATABASE' => 'database',
            ],
            'mysql' => [
                'DB_HOST' => 'host',
                'DB_PORT' => 'port',
                'DB_DATABASE' => 'database',
                'DB_USERNAME' => 'username',
                'DB_PASSWORD' => 'password',
            ],
            'pgsql' => [
                'DB_HOST' => 'host',
                'DB_PORT' => 'port',
                'DB_DATABASE' => 'database',
                'DB_USERNAME' => 'username',
                'DB_PASSWORD' => 'password',
            ],
            'redis' => [
                'REDIS_HOST' => 'host',
                'REDIS_PASSWORD' => 'password',
                'REDIS_PORT' => 'port',
            ],
        ];
    }
}
