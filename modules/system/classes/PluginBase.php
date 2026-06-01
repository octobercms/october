<?php namespace System\Classes;

use Backend;
use Illuminate\Console\Application as Artisan;
use October\Contracts\Support\OctoberPackage;
use October\Rain\Support\ServiceProvider as ServiceProviderBase;
use ReflectionClass;
use SystemException;
use Yaml;

/**
 * PluginBase class
 *
 * @package october\system
 * @author Alexey Bobkov, Samuel Georges
 */
class PluginBase extends ServiceProviderBase implements OctoberPackage
{
    /**
     * @var array require plugin dependencies.
     */
    public $require = [];

    /**
     * @var boolean disabled determines if this plugin should be loaded (false) or not (true).
     */
    public $disabled = false;

    /**
     * @var bool loadedYamlConfiguration
     */
    protected $loadedYamlConfiguration = false;

    /**
     * pluginDetails returns information about this plugin, including plugin name and developer name.
     *
     * @return array
     * @throws SystemException
     */
    public function pluginDetails()
    {
        $thisClass = get_class($this);

        $configuration = $this->getConfigurationFromYaml(sprintf(
            'Plugin configuration file plugin.yaml is not '.
            'found for the plugin class %s. Create the file or override pluginDetails() '.
            'method in the plugin class.',
            $thisClass
        ));

        if (array_key_exists('plugin', $configuration)) {
            return $configuration['plugin'];
        }

        throw new SystemException(sprintf(
            'The plugin configuration file plugin.yaml should contain the "plugin" section: %s.',
            $thisClass
        ));
    }

    /**
     * register method, called when the plugin is first registered.
     */
    public function register()
    {
    }

    /**
     * @inheritDoc
     */
    public function registerMarkupTags()
    {
        return [];
    }

    /**
     * @inheritDoc
     */
    public function registerComponents()
    {
        return [];
    }

    /**
     * @inheritDoc
     */
    public function registerPageSnippets()
    {
        return [];
    }

    /**
     * @inheritDoc
     */
    public function registerContentFields()
    {
        return [];
    }

    /**
     * @inheritDoc
     */
    public function registerNavigation()
    {
        $configuration = $this->getConfigurationFromYaml();

        if (!array_key_exists('navigation', $configuration)) {
            return [];
        }

        $navigation = $configuration['navigation'];

        if (!is_array($navigation)) {
            return [];
        }

        array_walk_recursive($navigation, static function (&$item, $key) {
            if ($key === 'url') {
                $item = Backend::url($item);
            }
        });

        return $navigation;
    }

    /**
     * @inheritDoc
     */
    public function registerPermissions()
    {
        $configuration = $this->getConfigurationFromYaml();

        if (!array_key_exists('permissions', $configuration)) {
            return [];
        }

        return $configuration['permissions'];
    }

    /**
     * @inheritDoc
     */
    public function registerSettings()
    {
        $configuration = $this->getConfigurationFromYaml();

        if (!array_key_exists('settings', $configuration)) {
            return [];
        }

        $settings = $configuration['settings'];

        if (!is_array($settings)) {
            return [];
        }

        array_walk_recursive($settings, function (&$item, $key) {
            if ($key === 'url') {
                $item = Backend::url($item);
            }
        });

        return $settings;
    }

    /**
     * @inheritDoc
     */
    public function registerSchedule($schedule)
    {
    }

    /**
     * @inheritDoc
     */
    public function registerReportWidgets()
    {
        return [];
    }

    /**
     * @inheritDoc
     */
    public function registerFormWidgets()
    {
        return [];
    }

    /**
     * @inheritDoc
     */
    public function registerFilterWidgets()
    {
        return [];
    }

    /**
     * @inheritDoc
     */
    public function registerListColumnTypes()
    {
        return [];
    }

    /**
     * @inheritDoc
     */
    public function registerMailLayouts()
    {
        return [];
    }

    /**
     * @inheritDoc
     */
    public function registerMailTemplates()
    {
        return [];
    }

    /**
     * @inheritDoc
     */
    public function registerMailPartials()
    {
        return [];
    }

    /**
     * discoverConsoleCommands automatically finds and registers console
     * commands from the plugin's console directory
     */
    public function discoverConsoleCommands(): void
    {
        $reflection = new ReflectionClass(get_class($this));
        $pluginPath = dirname($reflection->getFileName());
        $consolePath = $pluginPath . '/console';

        if (!is_dir($consolePath)) {
            return;
        }

        $pluginClass = get_class($this);
        $namespace = substr($pluginClass, 0, strrpos($pluginClass, '\\')) . '\\Console\\';

        Artisan::starting(function ($artisan) use ($consolePath, $namespace) {
            $commands = [];

            foreach (glob($consolePath . '/*.php') as $file) {
                $className = $namespace . basename($file, '.php');

                if (!class_exists($className)) {
                    continue;
                }

                $ref = new ReflectionClass($className);

                if (
                    $ref->isSubclassOf(\Illuminate\Console\Command::class) &&
                    !$ref->isAbstract()
                ) {
                    $commands[] = $className;
                }
            }

            $artisan->resolveCommands($commands);
        });
    }

    /**
     * registerConsoleCommand registers a new console (artisan) command.
     * @param string $key The command name
     * @param string $class The command class
     * @return void
     */
    public function registerConsoleCommand($key, $class)
    {
        $key = 'command.'.$key;

        $this->app->singleton($key, $class);

        $this->commands($key);
    }

    /**
     * registerValidationRule registers a new validation rule.
     * @param string $key The rule name
     * @param mixed $rule The validation rule
     * @return void
     */
    public function registerValidationRule($key, $rule)
    {
        $this->callAfterResolving('validator', function ($validator) use ($key, $rule) {
            $validator->extend($key, $rule);
        });
    }

    /**
     * getConfigurationFromYaml reads configuration from YAML file.
     * @param string|null $exceptionMessage
     * @return array|bool
     * @throws SystemException
     */
    protected function getConfigurationFromYaml($exceptionMessage = null)
    {
        if ($this->loadedYamlConfiguration !== false) {
            return $this->loadedYamlConfiguration;
        }

        $reflection = new ReflectionClass(get_class($this));
        $yamlFilePath = dirname($reflection->getFileName()).'/plugin.yaml';

        if (file_exists($yamlFilePath)) {
            $this->loadedYamlConfiguration = Yaml::parse(file_get_contents($yamlFilePath));

            if (!is_array($this->loadedYamlConfiguration)) {
                throw new SystemException(sprintf(
                    'Invalid format of the plugin configuration file: %s. The file should define an array.',
                    $yamlFilePath
                ));
            }
        }
        else {
            if ($exceptionMessage !== null) {
                throw new SystemException($exceptionMessage);
            }

            $this->loadedYamlConfiguration = [];
        }

        return $this->loadedYamlConfiguration;
    }
}
