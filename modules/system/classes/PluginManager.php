<?php namespace System\Classes;

use Db;
use App;
use Str;
use Log;
use File;
use Lang;
use View;
use Config;
use Schema;
use SystemException;
use RecursiveIteratorIterator;
use RecursiveDirectoryIterator;

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
     * @var array Container array used for storing plugin information objects.
     */
    protected $plugins;

    /**
     * @var array A map of plugins and their directory paths.
     */
    protected $pathMap = [];

    /**
     * @var array A map of normalized plugin identifiers [lowercase.identifier => Normalized.Identifier]
     */
    protected $normalizedMap = [];

    /**
     * @var bool Flag to indicate that all plugins have had the register() method called by registerAll() being called on this class.
     */
    protected $registered = false;

    /**
     * @var bool Flag to indicate that all plugins have had the boot() method called by bootAll() being called on this class.
     */
    protected $booted = false;

    /**
     * @var string Path to the JSON encoded file containing the disabled plugins.
     */
    protected $metaFile;

    /**
     * @var array Array of disabled plugins
     */
    protected $disabledPlugins = [];

    /**
     * @var array Cache of registration method results.
     */
    protected $registrationMethodCache = [];

    /**
     * @var bool Prevent all plugins from registering or booting
     */
    public static $noInit = false;

    /**
     * Initializes the plugin manager
     */
    protected function init()
    {
        $this->bindContainerObjects();
        $this->metaFile = storage_path('cms/disabled.json');
        $this->loadDisabled();
        $this->loadPlugins();

        if ($this->app->runningInBackend()) {
            $this->loadDependencies();
        }
    }

    /**
     * These objects are "soft singletons" and may be lost when
     * the IoC container reboots. This provides a way to rebuild
     * for the purposes of unit testing.
     */
    public function bindContainerObjects()
    {
        $this->app = App::make('app');
    }

    /**
     * Finds all available plugins and loads them in to the $this->plugins array.
     *
     * @return array
     */
    public function loadPlugins()
    {
        $this->plugins = [];

        /**
         * Locate all plugins and binds them to the container
         */
        foreach ($this->getPluginNamespaces() as $namespace => $path) {
            $this->loadPlugin($namespace, $path);
        }

        $this->sortDependencies();

        return $this->plugins;
    }

    /**
     * Loads a single plugin into the manager.
     *
     * @param string $namespace Eg: Acme\Blog
     * @param string $path Eg: plugins_path().'/acme/blog';
     * @return void
     */
    public function loadPlugin($namespace, $path)
    {
        $className = $namespace . '\Plugin';
        $classPath = $path . '/Plugin.php';

        try {
            // Autoloader failed?
            if (!class_exists($className)) {
                include_once $classPath;
            }

            // Not a valid plugin!
            if (!class_exists($className)) {
                return;
            }

            $classObj = new $className($this->app);
        } catch (\Throwable $e) {
            Log::error('Plugin ' . $className . ' could not be instantiated.', [
                'message' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'trace' => $e->getTraceAsString()
            ]);
            return;
        }

        $classId = $this->getIdentifier($classObj);

        /*
         * Check for disabled plugins
         */
        if ($this->isDisabled($classId)) {
            $classObj->disabled = true;
        }

        $this->plugins[$classId] = $classObj;
        $this->pathMap[$classId] = $path;
        $this->normalizedMap[strtolower($classId)] = $classId;

        return $classObj;
    }

    /**
     * Runs the register() method on all plugins. Can only be called once.
     *
     * @param bool $force Defaults to false, if true will force the re-registration of all plugins. Use unregisterAll() instead.
     * @return void
     */
    public function registerAll($force = false)
    {
        if ($this->registered && !$force) {
            return;
        }

        foreach ($this->plugins as $pluginId => $plugin) {
            $this->registerPlugin($plugin, $pluginId);
        }

        $this->registered = true;
    }

    /**
     * Unregisters all plugins: the inverse of registerAll().
     *
     * @return void
     */
    public function unregisterAll()
    {
        $this->registered = false;
        $this->plugins = [];
    }

    /**
     * Registers a single plugin object.
     *
     * @param PluginBase $plugin The instantiated Plugin object
     * @param string $pluginId The string identifier for the plugin
     * @return void
     */
    public function registerPlugin($plugin, $pluginId = null)
    {
        if (!$pluginId) {
            $pluginId = $this->getIdentifier($plugin);
        }

        $pluginPath = $this->getPluginPath($plugin);
        $pluginNamespace = strtolower($pluginId);

        /*
         * Register language namespaces
         */
        $langPath = $pluginPath . '/lang';
        if (File::isDirectory($langPath)) {
            Lang::addNamespace($pluginNamespace, $langPath);
        }

        /**
         * Prevent autoloaders from loading if plugin is disabled
         */
        if ($plugin->disabled) {
            return;
        }

        /*
         * Register plugin class autoloaders
         */
        $autoloadPath = $pluginPath . '/vendor/autoload.php';
        if (File::isFile($autoloadPath)) {
            ComposerManager::instance()->autoload($pluginPath . '/vendor');
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

        /**
         * Disable plugin registration for restricted pages, unless elevated
         */
        if (self::$noInit && !$plugin->elevated) {
            return;
        }

        /**
         * Run the plugin's register() method
         */
        $plugin->register();

        /*
         * Add init, if available
         */
        $initFile = $pluginPath . '/init.php';
        if (File::exists($initFile)) {
            require $initFile;
        }

        /*
         * Add routes, if available
         */
        $routesFile = $pluginPath . '/routes.php';
        if (File::exists($routesFile)) {
            require $routesFile;
        }
    }

    /**
     * Runs the boot() method on all plugins. Can only be called once.
     *
     * @param bool $force Defaults to false, if true will force the re-booting of all plugins
     * @return void
     */
    public function bootAll($force = false)
    {
        if ($this->booted && !$force) {
            return;
        }

        foreach ($this->plugins as $plugin) {
            $this->bootPlugin($plugin);
        }

        $this->booted = true;
    }

    /**
     * Boots the provided plugin object.
     *
     * @param PluginBase $plugin
     * @return void
     */
    public function bootPlugin($plugin)
    {
        if (!$plugin || $plugin->disabled || (self::$noInit && !$plugin->elevated)) {
            return;
        }

        $plugin->boot();
    }

    /**
     * Returns the directory path to a plugin
     *
     * @param PluginBase|string $id The plugin to get the path for
     * @return string|null
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
     *
     * @param string $id Plugin identifier, eg: Namespace.PluginName
     * @return bool
     */
    public function exists($id)
    {
        return $this->findByIdentifier($id) && !$this->isDisabled($id);
    }

    /**
     * Returns an array with all enabled plugins
     *
     * @return array [$code => $pluginObj]
     */
    public function getPlugins()
    {
        return array_diff_key($this->plugins, $this->disabledPlugins);
    }

    /**
     * Returns an array will all plugins detected on the filesystem
     *
     * @return array [$code => $pluginObj]
     */
    public function getAllPlugins()
    {
        return $this->plugins;
    }

    /**
     * Returns a plugin registration class based on its namespace (Author\Plugin).
     *
     * @param string $namespace
     * @return PluginBase|null
     */
    public function findByNamespace($namespace)
    {
        $identifier = $this->getIdentifier($namespace);

        return $this->plugins[$identifier] ?? null;
    }

    /**
     * Returns a plugin registration class based on its identifier (Author.Plugin).
     *
     * @param string|PluginBase $identifier
     * @return PluginBase|null
     */
    public function findByIdentifier($identifier)
    {
        if (!isset($this->plugins[$identifier])) {
            $code = $this->getIdentifier($identifier);
            $identifier = $this->normalizeIdentifier($code);
        }

        return $this->plugins[$identifier] ?? null;
    }

    /**
     * Checks to see if a plugin has been registered.
     *
     * @param string|PluginBase
     * @return bool
     */
    public function hasPlugin($namespace)
    {
        $classId = $this->getIdentifier($namespace);
        $normalized = $this->normalizeIdentifier($classId);

        return isset($this->plugins[$normalized]);
    }

    /**
     * Returns a flat array of vendor plugin namespaces and their paths
     *
     * @return array ['Author\Plugin' => 'plugins/author/plugin']
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
     *
     * @return array ['vendor' => ['author' => 'plugins/author/plugin']]
     */
    public function getVendorAndPluginNames()
    {
        $plugins = [];

        $dirPath = plugins_path();
        if (!File::isDirectory($dirPath)) {
            return $plugins;
        }

        $it = new RecursiveIteratorIterator(
            new RecursiveDirectoryIterator($dirPath, RecursiveDirectoryIterator::FOLLOW_SYMLINKS)
        );
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
     * Resolves a plugin identifier (Author.Plugin) from a plugin class name or object.
     *
     * @param mixed Plugin class name or object
     * @return string Identifier in format of Author.Plugin
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
     * Returns the provided identifier if a match isn't found
     *
     * @param  string $identifier
     * @return string
     */
    public function normalizeIdentifier($identifier)
    {
        $id = strtolower($identifier);
        if (isset($this->normalizedMap[$id])) {
            return $this->normalizedMap[$id];
        }

        return $identifier;
    }

    /**
     * Spins over every plugin object and collects the results of a method call. Results are cached in memory.
     *
     * @param  string $methodName
     * @return array
     */
    public function getRegistrationMethodValues($methodName)
    {
        if (isset($this->registrationMethodCache[$methodName])) {
            return $this->registrationMethodCache[$methodName];
        }

        $results = [];
        $plugins = $this->getPlugins();

        foreach ($plugins as $id => $plugin) {
            if (!method_exists($plugin, $methodName)) {
                continue;
            }

            $results[$id] = $plugin->{$methodName}();
        }

        return $this->registrationMethodCache[$methodName] = $results;
    }

    //
    // Disability
    //

    /**
     * Clears the disabled plugins cache file
     *
     * @return void
     */
    public function clearDisabledCache()
    {
        File::delete($this->metaFile);
        $this->disabledPlugins = [];
    }

    /**
     * Loads all disabled plugins from the cached JSON file.
     *
     * @return void
     */
    protected function loadDisabled()
    {
        $path = $this->metaFile;

        if (($configDisabled = Config::get('cms.disablePlugins')) && is_array($configDisabled)) {
            foreach ($configDisabled as $disabled) {
                $this->disabledPlugins[$disabled] = true;
            }
        }

        if (File::exists($path)) {
            $disabled = json_decode(File::get($path), true) ?: [];
            $this->disabledPlugins = array_merge($this->disabledPlugins, $disabled);
        } else {
            $this->populateDisabledPluginsFromDb();
            $this->writeDisabled();
        }
    }

    /**
     * Determines if a plugin is disabled by looking at the meta information
     * or the application configuration.
     *
     * @param string|PluginBase $id
     * @return bool
     */
    public function isDisabled($id)
    {
        $code = $this->getIdentifier($id);
        $normalized = $this->normalizeIdentifier($code);

        return isset($this->disabledPlugins[$normalized]);
    }

    /**
     * Write the disabled plugins to a meta file.
     *
     * @return void
     */
    protected function writeDisabled()
    {
        File::put($this->metaFile, json_encode($this->disabledPlugins));
    }

    /**
     * Populates information about disabled plugins from database
     *
     * @return void
     */
    protected function populateDisabledPluginsFromDb()
    {
        if (!App::hasDatabase()) {
            return;
        }

        if (!Schema::hasTable('system_plugin_versions')) {
            return;
        }

        $disabled = Db::table('system_plugin_versions')->where('is_disabled', 1)->lists('code');

        foreach ($disabled as $code) {
            $this->disabledPlugins[$code] = true;
        }
    }

    /**
     * Disables a single plugin in the system.
     *
     * @param string|PluginBase $id Plugin code/namespace
     * @param bool $isUser Set to true if disabled by the user, false by default
     * @return bool Returns false if the plugin was already disabled, true otherwise
     */
    public function disablePlugin($id, $isUser = false)
    {
        $code = $this->getIdentifier($id);
        $code = $this->normalizeIdentifier($code);
        if (isset($this->disabledPlugins[$code])) {
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
     *
     * @param string|PluginBase $id Plugin code/namespace
     * @param bool $isUser Set to true if enabled by the user, false by default
     * @return bool Returns false if the plugin wasn't already disabled or if the user disabled a plugin that the system is trying to re-enable, true otherwise
     */
    public function enablePlugin($id, $isUser = false)
    {
        $code = $this->getIdentifier($id);
        $code = $this->normalizeIdentifier($code);
        if (!isset($this->disabledPlugins[$code])) {
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
     * Scans the system plugins to locate any dependencies that are not currently
     * installed. Returns an array of missing plugin codes keyed by the plugin that requires them.
     *
     *     ['Author.Plugin' => ['Required.Plugin1', 'Required.Plugin2']
     *
     *     PluginManager::instance()->findMissingDependencies();
     *
     * @return array
     */
    public function findMissingDependencies()
    {
        $missing = [];

        foreach ($this->plugins as $id => $plugin) {
            if (!$required = $this->getDependencies($plugin)) {
                continue;
            }

            foreach ($required as $require) {
                if ($this->hasPlugin($require)) {
                    continue;
                }

                if (!in_array($require, $missing)) {
                    $missing[$this->getIdentifier($plugin)][] = $require;
                }
            }
        }

        return $missing;
    }

    /**
     * Cross checks all plugins and their dependancies, if not met plugins
     * are disabled and vice versa.
     *
     * @return void
     */
    protected function loadDependencies()
    {
        foreach ($this->plugins as $id => $plugin) {
            if (!$required = $this->getDependencies($plugin)) {
                continue;
            }

            $disable = false;

            foreach ($required as $require) {
                if (!$pluginObj = $this->findByIdentifier($require)) {
                    $disable = true;
                } elseif ($pluginObj->disabled) {
                    $disable = true;
                }
            }

            if ($disable) {
                $this->disablePlugin($id);
            } else {
                $this->enablePlugin($id);
            }
        }
    }

    /**
     * Sorts a collection of plugins, in the order that they should be actioned,
     * according to their given dependencies. Least dependent come first.
     *
     * @return array Array of sorted plugin identifiers and instantiated classes ['Author.Plugin' => PluginBase]
     * @throws SystemException If a possible circular dependency is detected
     */
    protected function sortDependencies()
    {
        ksort($this->plugins);

        /*
         * Canvas the dependency tree
         */
        $checklist = $this->plugins;
        $result = [];

        $loopCount = 0;
        while (count($checklist)) {
            if (++$loopCount > 2048) {
                throw new SystemException('Too much recursion! Check for circular dependencies in your plugins.');
            }

            foreach ($checklist as $code => $plugin) {
                /*
                 * Get dependencies and remove any aliens
                 */
                $depends = $this->getDependencies($plugin);
                $depends = array_filter($depends, function ($pluginCode) {
                    return isset($this->plugins[$pluginCode]);
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

        /*
         * Reassemble plugin map
         */
        $sortedPlugins = [];

        foreach ($result as $code) {
            $sortedPlugins[$code] = $this->plugins[$code];
        }

        return $this->plugins = $sortedPlugins;
    }

    /**
     * Returns the plugin identifiers that are required by the supplied plugin.
     *
     * @param  string $plugin Plugin identifier, object or class
     * @return array
     */
    public function getDependencies($plugin)
    {
        if (is_string($plugin) && (!$plugin = $this->findByIdentifier($plugin))) {
            return [];
        }

        if (!isset($plugin->require) || !$plugin->require) {
            return [];
        }

        return is_array($plugin->require) ? $plugin->require : [$plugin->require];
    }

    /**
     * @deprecated Plugins are now sorted by default. See getPlugins()
     * Remove if year >= 2022
     */
    public function sortByDependencies($plugins = null)
    {
        traceLog('PluginManager::sortByDependencies is deprecated. Plugins are now sorted by default. Use PluginManager::getPlugins()');

        return array_keys($plugins ?: $this->getPlugins());
    }

    //
    // Management
    //

    /**
     * Completely roll back and delete a plugin from the system.
     *
     * @param string $id Plugin code/namespace
     * @return void
     */
    public function deletePlugin($id)
    {
        /*
         * Rollback plugin
         */
        UpdateManager::instance()->rollbackPlugin($id);

        /*
         * Delete from file system
         */
        if ($pluginPath = self::instance()->getPluginPath($id)) {
            File::deleteDirectory($pluginPath);
        }
    }

    /**
     * Tears down a plugin's database tables and rebuilds them.
     *
     * @param string $id Plugin code/namespace
     * @return void
     */
    public function refreshPlugin($id)
    {
        $manager = UpdateManager::instance();
        $manager->rollbackPlugin($id);
        $manager->updatePlugin($id);
    }
}
