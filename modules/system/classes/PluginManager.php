<?php namespace System\Classes;

use App;
use Str;
use File;
use Lang;
use View;
use Config;
use RecursiveIteratorIterator;
use RecursiveDirectoryIterator;
use Illuminate\Container\Container;
use ApplicationException;

/**
 * Plugin manager
 *
 * @package october\system
 * @author Alexey Bobkov, Samuel Georges
 */
class PluginManager
{
    use \October\Rain\Support\Traits\Singleton;

    /**
     * The application instance, since Plugins are an extension of a Service Provider
     */
    protected $app;

    /**
     * Container object used for storing plugin information objects.
     */
    protected $plugins;

    /**
     * @var array A map of plugins and their directory paths.
     */
    protected $pathMap = [];

    /**
     * @var bool Check if all plugins have had the register() method called.
     */
    protected $registered = false;

    /**
     * @var bool Check if all plugins have had the boot() method called.
     */
    protected $booted = false;

    /**
     * @var string Path to the disarm file.
     */
    protected $metaPath;

    /**
     * @var array Collection of disabled plugins
     */
    protected $disabledPlugins = [];

    /**
     * @var boolean Prevent all plugins from registering or booting
     */
    public static $noInit = false;

    /**
     * Initializes the plugin manager
     */
    protected function init()
    {
        $this->app = App::make('app');
        $this->metaPath = Config::get('app.manifest');
        $this->loadDisabled();
        $this->loadPlugins();
        $this->loadDependencies();
    }

    /**
     * Finds all available plugins and loads them in to the $plugins array.
     */
    public function loadPlugins()
    {
        $this->plugins = [];

        /**
         * Locate all plugins and binds them to the container
         */
        foreach ($this->getPluginNamespaces() as $className => $classPath) {

            $pluginClassName = $className.'\Plugin';

            // Autoloader failed?
            if (!class_exists($pluginClassName)) {
                include_once $classPath.'/Plugin.php';
            }

            // Not a valid plugin!
            if (!class_exists($pluginClassName)) {
                continue;
            }

            $classObj = new $pluginClassName($this->app);
            $classId = $this->getIdentifier($classObj);

            /*
             * Check for disabled plugins
             */
            if ($this->isDisabled($classId)) {
                $classObj->disabled = true;
            }

            $this->plugins[$classId] = $classObj;
            $this->pathMap[$classId] = $classPath;
        }

        return $this->plugins;
    }

    /**
     * Runs the register() method on all plugins. Can only be called once.
     */
    public function registerAll()
    {
        if ($this->registered) {
            return;
        }

        foreach ($this->plugins as $pluginId => $plugin) {
            if ($plugin->disabled) {
                continue;
            }

            if (!self::$noInit) {
                $plugin->register();
            }

            $pluginPath = $this->getPluginPath($plugin);
            $pluginNamespace = strtolower($pluginId);

            /*
             * Register plugin class autoloaders
             */
            $autoloadPath = $pluginPath . '/vendor/autoload.php';
            if (File::isFile($autoloadPath)) {
                require_once $autoloadPath;
            }

            /*
             * Register language namespaces
             */
            $langPath = $pluginPath . '/lang';
            if (File::isDirectory($langPath)) {
                Lang::addNamespace($pluginNamespace, $langPath);
            }

            /*
             * Register configuration path
             */
            $configPath = $pluginPath . '/config';
            if (File::isDirectory($configPath)) {
                Config::package($pluginNamespace, $configPath, $pluginNamespace);
            }

            /*
             * Register views path
             */
            $viewsPath = $pluginPath . '/views';
            if (File::isDirectory($viewsPath)) {
                View::addNamespace($pluginNamespace, $viewsPath);
            }

            /*
             * Add routes, if available
             */
            $routesFile = $pluginPath . '/routes.php';
            if (File::exists($routesFile)) {
                require $routesFile;
            }
        }

        $this->registered = true;
    }

    /**
     * Runs the boot() method on all plugins. Can only be called once.
     */
    public function bootAll()
    {
        if ($this->booted) {
            return;
        }

        foreach ($this->plugins as $plugin) {
            if ($plugin->disabled) {
                continue;
            }

            if (!self::$noInit) {
                $plugin->boot();
            }
        }

        $this->booted = true;
    }

    /**
     * Returns the absolute plugin path.
     */
    public function getPath()
    {
        return base_path() . Config::get('cms.pluginsDir');
    }

    /**
     * Returns the directory path to a plugin
     */
    public function getPluginPath($id)
    {
        $classId = $this->getIdentifier($id);
        if (!isset($this->pathMap[$classId])) {
            return null;
        }

        return File::normalizePath($this->pathMap[$classId]);
    }

    /**
     * Check if a plugin exists and is enabled.
     * @param   string $id Plugin identifier, eg: Namespace.PluginName
     * @return  boolean
     */
    public function exists($id)
    {
        return (!$this->findByIdentifier($id) || $this->isDisabled($id))
            ? false
            : true;
    }

    /**
     * Returns an array with all registered plugins
     * The index is the plugin namespace, the value is the plugin information object.
     */
    public function getPlugins()
    {
        return array_diff_key($this->plugins, $this->disabledPlugins);
    }

    /**
     * Returns a plugin registration class based on its namespace (Author\Plugin).
     */
    public function findByNamespace($namespace)
    {
        if (!$this->hasPlugin($namespace)) {
            return null;
        }

        $classId = $this->getIdentifier($namespace);
        return $this->plugins[$classId];
    }

    /**
     * Returns a plugin registration class based on its identifier (Author.Plugin).
     */
    public function findByIdentifier($identifier)
    {
        if (!isset($this->plugins[$identifier])) {
            $identifier = $this->normalizeIdentifier($identifier);
        }

        if (!isset($this->plugins[$identifier])) {
            return null;
        }

        return $this->plugins[$identifier];
    }

    /**
     * Checks to see if a plugin has been registered.
     */
    public function hasPlugin($namespace)
    {
        $classId = $this->getIdentifier($namespace);
        return isset($this->plugins[$classId]);
    }

    /**
     * Returns a flat array of vendor plugin namespaces and their paths
     */
    public function getPluginNamespaces()
    {
        $classNames = [];

        foreach ($this->getVendorAndPluginNames() as $vendorName => $vendorList) {
            foreach ($vendorList as $pluginName => $pluginPath) {
                $namespace = '\\'.$vendorName.'\\'.$pluginName;
                $namespace = Str::normalizeClassName($namespace);
                $classNames[$namespace] = $pluginPath;
            }
        }

        return $classNames;
    }

    /**
     * Returns a 2 dimensional array of vendors and their plugins.
     */
    public function getVendorAndPluginNames()
    {
        $plugins = [];

        $dirPath = $this->getPath();
        if (!File::isDirectory($dirPath)) {
            return $plugins;
        }

        $it = new RecursiveIteratorIterator(new RecursiveDirectoryIterator($dirPath));
        $it->setMaxDepth(2);
        $it->rewind();

        while ($it->valid()) {
            if (($it->getDepth() > 1) && $it->isFile() && (strtolower($it->getFilename()) == "plugin.php")) {
                $filePath = dirname($it->getPathname());
                $pluginName = basename($filePath);
                $vendorName = basename(dirname($filePath));
                $plugins[$vendorName][$pluginName] = $filePath;
            }

            $it->next();
        }

        return $plugins;
    }

    /**
     * Returns a plugin identifier from a Plugin class name or object
     * @param mixed Plugin class name or object
     * @return string Identifier in format of Vendor.Plugin
     */
    public function getIdentifier($namespace)
    {
        $namespace = Str::normalizeClassName($namespace);
        if (strpos($namespace, '\\') === null) {
            return $namespace;
        }

        $parts = explode('\\', $namespace);
        $slice = array_slice($parts, 1, 2);
        $namespace = implode('.', $slice);
        return $namespace;
    }

    /**
     * Takes a human plugin code (acme.blog) and makes it authentic (Acme.Blog)
     * @param  string $id
     * @return string
     */
    public function normalizeIdentifier($identifier)
    {
        foreach ($this->plugins as $id => $object) {
            if (strtolower($id) == strtolower($identifier)) {
                return $id;
            }
        }

        return $identifier;
    }

    //
    // Disability
    //

    public function clearDisabledCache()
    {
        File::delete($this->metaPath.'/disabled.json');
        $this->disabledPlugins = [];
    }

    /**
     * Loads all disables plugins from the meta file.
     */
    protected function loadDisabled()
    {
        $path = $this->metaPath.'/disabled.json';

        if (($configDisabled = Config::get('cms.disablePlugins')) && is_array($configDisabled)) {
            foreach ($configDisabled as $disabled) {
                $this->disabledPlugins[$disabled] = true;
            }
        }

        if (File::exists($path)) {
            $disabled = json_decode(File::get($path), true);
            $this->disabledPlugins = array_merge($this->disabledPlugins, $disabled);
        }
        else {
            $this->writeDisabled();
        }
    }

    /**
     * Determines if a plugin is disabled by looking at the meta information
     * or the application configuration.
     * @return boolean
     */
    public function isDisabled($id)
    {
        $code = $this->getIdentifier($id);
        if (array_key_exists($code, $this->disabledPlugins)) {
            return true;
        }
    }

    /**
     * Write the disabled plugins to a meta file.
     */
    protected function writeDisabled()
    {
        $path = $this->metaPath.'/disabled.json';
        File::put($path, json_encode($this->disabledPlugins));
    }

    /**
     * Disables a single plugin in the system.
     * @param string $id Plugin code/namespace
     * @param bool $user Set to true if disabled by the user
     */
    public function disablePlugin($id, $isUser = false)
    {
        $code = $this->getIdentifier($id);
        if (array_key_exists($code, $this->disabledPlugins)) {
            return false;
        }

        $this->disabledPlugins[$code] = $isUser;
        $this->writeDisabled();

        if ($pluginObj = $this->findByIdentifier($code)) {
            $pluginObj->disabled = true;
        }

        return true;
    }

    /**
     * Enables a single plugin in the system.
     * @param string $id Plugin code/namespace
     * @param bool $user Set to true if enabled by the user
     */
    public function enablePlugin($id, $isUser = false)
    {
        $code = $this->getIdentifier($id);
        if (!array_key_exists($code, $this->disabledPlugins)) {
            return false;
        }

        // Prevent system from enabling plugins disabled by the user
        if (!$isUser && $this->disabledPlugins[$code] === true) {
            return false;
        }

        unset($this->disabledPlugins[$code]);
        $this->writeDisabled();

        if ($pluginObj = $this->findByIdentifier($code)) {
            $pluginObj->disabled = false;
        }

        return true;
    }

    //
    // Dependencies
    //
    
    /**
     * Cross checks all plugins and their dependancies, if not met plugins
     * are disabled and vice versa.
     */
    protected function loadDependencies()
    {
        foreach ($this->plugins as $id => $plugin) {
            if (!$required = $this->getDependencies($plugin)) {
                continue;
            }

            $disable = false;
            foreach ($required as $require) {
                if (!$this->hasPlugin($require)) {
                    $disable = true;
                }
                elseif (($pluginObj = $this->findByIdentifier($require)) && $pluginObj->disabled) {
                    $disable = true;
                }
            }

            if ($disable) {
                $this->disablePlugin($id);
            }
            else {
                $this->enablePlugin($id);
            }
        }
    }

    /**
     * Returns the plugin identifiers that are required by the supplied plugin.
     * @param  string $plugin Plugin identifier, object or class
     * @return array
     */
    public function getDependencies($plugin)
    {
        if (is_string($plugin) && (!$plugin = $this->findByIdentifier($plugin))) {
            return false;
        }

        if (!isset($plugin->require) || !$plugin->require) {
            return null;
        }

        return is_array($plugin->require) ? $plugin->require : [$plugin->require];
    }

    /**
     * Sorts a collection of plugins, in the order that they should be actioned,
     * according to their given dependencies. Least dependent come first.
     * @param  array $plugins Object collection to sort, or null to sort all.
     * @return array Collection of sorted plugin identifiers
     */
    public function sortByDependencies($plugins = null)
    {
        if (!is_array($plugins)) {
            $plugins = $this->getPlugins();
        }

        $result = [];
        $checklist = $plugins;

        $loopCount = 0;
        while (count($checklist)) {

            if (++$loopCount > 999) {
                throw new ApplicationException('Too much recursion');
            }

            foreach ($checklist as $code => $plugin) {

                /*
                 * Get dependencies and remove any aliens
                 */
                $depends = $this->getDependencies($plugin) ?: [];
                $depends = array_filter($depends, function ($pluginCode) use ($plugins) {
                    return isset($plugins[$pluginCode]);
                });

                /*
                 * No dependencies
                 */
                if (!$depends) {
                    array_push($result, $code);
                    unset($checklist[$code]);
                    continue;
                }

                /*
                 * Find dependencies that have not been checked
                 */
                $depends = array_diff($depends, $result);
                if (count($depends) > 0) {
                    continue;
                }

                /*
                 * All dependencies are checked
                 */
                array_push($result, $code);
                unset($checklist[$code]);
            }

        }

        return $result;
    }
}
