<?php namespace System\Classes;

use Illuminate\Support\ServiceProvider as ServiceProviderBase;
use ReflectionClass;
use SystemException;
use Yaml;

/**
 * Plugin base class
 *
 * @package october\system
 * @author Alexey Bobkov, Samuel Georges
 */
class PluginBase extends ServiceProviderBase
{
    protected $loadedYamlConfigration = false;

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
     */
    public function pluginDetails()
    {
        $thisClass = get_class($this);

        $configuration = $this->getConfigurationFromYaml(sprintf('Plugin configuration file plugin.yaml is not '.
            'found for the plugin class %s. Create the file or override pluginDetails() '.
            'method in the plugin class.', $thisClass));

        if (!array_key_exists('plugin', $configuration)) {
            throw new SystemException('The plugin configuration file plugin.yaml should contain the "plugin" section: %s.', $thisClass);
        }

        return $configuration['plugin'];
    }

    /**
     * Register method, called when the plugin is first registered.
     */
    public function register()
    {
    }

    /**
     * Boot method, called right before the request route.
     */
    public function boot()
    {
    }

    /**
     * Registers CMS markup tags introduced by this plugin.
     */
    public function registerMarkupTags()
    {
        return [];
    }

    /**
     * Registers any front-end components implemented in this plugin.
     */
    public function registerComponents()
    {
        return [];
    }

    /**
     * Registers back-end navigation items for this plugin.
     */
    public function registerNavigation()
    {
        return [];
    }

    /**
     * Registers any back-end permissions used by this plugin.
     */
    public function registerPermissions()
    {
        return [];
    }

    /**
     * Registers any back-end configuration links used by this plugin.
     */
    public function registerSettings()
    {
        return [];
    }

    /**
     * Registers scheduled tasks that are executed on a regular basis.
     */
    public function registerSchedule($schedule)
    {
    }

    /**
     * Registers any report widgets provided by this plugin.
     * The widgets must be returned in the following format:
     * [
     *  'className1'=>[
     *          'label'    => 'My widget 1',
     *          'context' => ['context-1', 'context-2'],
     *      ], 
     *  'className2' => [
     *          'label'    => 'My widget 2',
     *          'context' => 'context-1'
     *      ]
     * ]
     */
    public function registerReportWidgets()
    {
        return [];
    }

    /**
     * Registers any form widgets implemented in this plugin.
     * The widgets must be returned in the following format:
     * ['className1' => 'alias'],
     * ['className2' => 'anotherAlias']
     */
    public function registerFormWidgets()
    {
        return [];
    }

    /**
     * Registers any mail templates implemented by this plugin.
     * The templates must be returned in the following format:
     * ['acme.blog::mail.welcome' => 'This is a description of the welcome template'],
     * ['acme.blog::mail.forgot_password' => 'This is a description of the forgot password template'],
     */
    public function registerMailTemplates()
    {
        return [];
    }

    /**
     * Registers a new console (artisan) command
     * @param $key The command name
     * @param $class The command class
     * @return void
     */
    public function registerConsoleCommand($key, $class)
    {
        $key = 'command.'.$key;
        $this->app[$key] = $this->app->share(function ($app) use ($class) {
            return new $class;
        });

        $this->commands($key);
    }

    protected function getConfigurationFromYaml($exceptionMessage = null)
    {
        if ($this->loadedYamlConfigration !== false) {
            return $this->loadedYamlConfigration;
        }

        $reflection = new ReflectionClass(get_class($this));
        $yamlFilePath = dirname($reflection->getFileName()).'/plugin.yaml';

        if (!file_exists($yamlFilePath)) {
            if ($exceptionMessage) {
                throw new SystemException($exceptionMessage);
            }
            else {
                $this->loadedYamlConfigration = [];
            }
        }
        else {
            $this->loadedYamlConfigration = Yaml::parse(file_get_contents($yamlFilePath));
            if (!is_array($this->loadedYamlConfigration)) {
                throw new SystemException('Invalid format of the plugin configuration file: %s. The file should define an array.', $filePath);
            }
        }

        return $this->loadedYamlConfigration;
    }
}
