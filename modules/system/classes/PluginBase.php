<?php namespace System\Classes;

use Illuminate\Support\ServiceProvider as ServiceProviderBase;
use ReflectionClass;
use SystemException;
use Yaml;
use Backend;

/**
 * Plugin base class
 *
 * @package october\system
 * @author Alexey Bobkov, Samuel Georges
 */
class PluginBase extends ServiceProviderBase
{
    /**
     * @var boolean
     */
    protected $loadedYamlConfiguration = false;

    /**
     * @var array Plugin dependencies
     */
    public $require = [];

    /**
     * @var boolean Determine if this plugin should have elevated privileges.
     */
    public $elevated = false;

    /**
     * @var boolean Determine if this plugin should be loaded (false) or not (true).
     */
    public $disabled = false;

    /**
     * Returns information about this plugin, including plugin name and developer name.
     *
     * @return array
     * @throws SystemException
     */
    public function pluginDetails()
    {
        $thisClass = get_class($this);

        $configuration = $this->getConfigurationFromYaml(sprintf('Plugin configuration file plugin.yaml is not '.
            'found for the plugin class %s. Create the file or override pluginDetails() '.
            'method in the plugin class.', $thisClass));

        if (!array_key_exists('plugin', $configuration)) {
            throw new SystemException(sprintf(
                'The plugin configuration file plugin.yaml should contain the "plugin" section: %s.', $thisClass)
            );
        }

        return $configuration['plugin'];
    }

    /**
     * Register method, called when the plugin is first registered.
     *
     * @return void
     */
    public function register()
    {
    }

    /**
     * Boot method, called right before the request route.
     *
     * @return array
     */
    public function boot()
    {
    }

    /**
     * Registers CMS markup tags introduced by this plugin.
     *
     * @return array
     */
    public function registerMarkupTags()
    {
        return [];
    }

    /**
     * Registers any front-end components implemented in this plugin.
     *
     * @return array
     */
    public function registerComponents()
    {
        return [];
    }

    /**
     * Registers back-end navigation items for this plugin.
     *
     * @return array
     */
    public function registerNavigation()
    {
        $configuration = $this->getConfigurationFromYaml();
        if (array_key_exists('navigation', $configuration)) {
            $navigation = $configuration['navigation'];

            if (is_array($navigation)) {
                array_walk_recursive($navigation, function (&$item, $key) {
                    if ($key === 'url') {
                        $item = Backend::url($item);
                    }
                });
            }

            return $navigation;
        }
    }

    /**
     * Registers any back-end permissions used by this plugin.
     *
     * @return array
     */
    public function registerPermissions()
    {
        $configuration = $this->getConfigurationFromYaml();
        if (array_key_exists('permissions', $configuration)) {
            return $configuration['permissions'];
        }
    }

    /**
     * Registers any back-end configuration links used by this plugin.
     *
     * @return array
     */
    public function registerSettings()
    {
        $configuration = $this->getConfigurationFromYaml();
        if (array_key_exists('settings', $configuration)) {
            return $configuration['settings'];
        }
    }

    /**
     * Registers scheduled tasks that are executed on a regular basis.
     *
     * @param string $schedule
     * @return void
     */
    public function registerSchedule($schedule)
    {
    }

    /**
     * Registers any report widgets provided by this plugin.
     * The widgets must be returned in the following format:
     *
     *     return [
     *         'className1'=>[
     *             'label'    => 'My widget 1',
     *             'context' => ['context-1', 'context-2'],
     *         ],
     *         'className2' => [
     *             'label'    => 'My widget 2',
     *             'context' => 'context-1'
     *         ]
     *     ];
     *
     * @return array
     */
    public function registerReportWidgets()
    {
        return [];
    }

    /**
     * Registers any form widgets implemented in this plugin.
     * The widgets must be returned in the following format:
     *
     *     return [
     *         ['className1' => 'alias'],
     *         ['className2' => 'anotherAlias']
     *     ];
     *
     * @return array
     */
    public function registerFormWidgets()
    {
        return [];
    }

    /**
     * Registers custom back-end list column types introduced by this plugin.
     *
     * @return array
     */
    public function registerListColumnTypes()
    {
        return [];
    }

    /**
     * Registers any mail templates implemented by this plugin.
     * The templates must be returned in the following format:
     *
     *     return [
     *         ['acme.blog::mail.welcome' => 'This is a description of the welcome template'],
     *         ['acme.blog::mail.forgot_password' => 'This is a description of the forgot password template'],
     *     ];
     *
     * @return array
     */
    public function registerMailTemplates()
    {
        return [];
    }

    /**
     * Registers a new console (artisan) command
     *
     * @param string $key The command name
     * @param string $class The command class
     * @return void
     */
    public function registerConsoleCommand($key, $class)
    {
        $key = 'command.'.$key;

        $this->app->singleton($key, function ($app) use ($class) {
            return new $class;
        });

        $this->commands($key);
    }

    /**
     * Read configuration from YAML file
     *
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

        if (!file_exists($yamlFilePath)) {
            if ($exceptionMessage) {
                throw new SystemException($exceptionMessage);
            }
            else {
                $this->loadedYamlConfiguration = [];
            }
        }
        else {
            $this->loadedYamlConfiguration = Yaml::parse(file_get_contents($yamlFilePath));
            if (!is_array($this->loadedYamlConfiguration)) {
                throw new SystemException(sprintf('Invalid format of the plugin configuration file: %s. The file should define an array.', $yamlFilePath));
            }
        }

        return $this->loadedYamlConfiguration;
    }
}
