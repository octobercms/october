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
     * Initializes the plugin manager
     */
    protected function init()
    {
        $this->app = App::make('app');
        $this->loadPlugins();
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
            if (!class_exists($pluginClassName))
                include_once $classPath.'/Plugin.php';

            // Not a valid plugin!
            if (!class_exists($pluginClassName))
                continue;

            $classObj = new $pluginClassName($this->app);
            $classId = $this->getIdentifier($classObj);
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
        if ($this->registered)
            return;

        foreach ($this->plugins as $pluginId => $plugin) {
            $plugin->register();
            $pluginPath = $this->getPluginPath($plugin);
            $pluginNamespace = strtolower($pluginId);

            /*
             * Register plugin class autoloaders
             */
            $autoloadPath = $pluginPath . '/vendor/autoload.php';
            if (File::isFile($autoloadPath))
                require_once $autoloadPath;

            /*
             * Register language namespaces
             */
            $langPath = $pluginPath . '/lang';
            if (File::isDirectory($langPath))
                Lang::addNamespace($pluginNamespace, $langPath);

            /*
             * Register configuration path
             */
            $configPath = $pluginPath . '/config';
            if (File::isDirectory($configPath))
                Config::package($pluginNamespace, $configPath, $pluginNamespace);

            /*
             * Register views path
             */
            $viewsPath = $pluginPath . '/views';
            if (File::isDirectory($viewsPath))
                View::addNamespace($pluginNamespace, $viewsPath);

            /*
             * Add routes, if available
             */
            $routesFile = $pluginPath . '/routes.php';
            if (File::exists($routesFile))
                require $routesFile;
        }

        $this->registered = true;
    }

    /**
     * Runs the boot() method on all plugins. Can only be called once.
     */
    public function bootAll()
    {
        if ($this->booted)
            return;

        foreach ($this->plugins as $plugin)
            $plugin->boot();

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
     * 
     */
    public function getPluginPath($id)
    {
        $classId = $this->getIdentifier($id);
        if (!isset($this->pathMap[$classId]))
            return null;

        return $this->pathMap[$classId];
    }

    /**
     * Returns an array with all registered plugins
     * The index is the plugin namespace, the value is the plugin information object.
     */
    public function getPlugins()
    {
        return $this->plugins;
    }

    /**
     * Returns a plugin registration class based on its namespace (Author\Plugin).
     */
    public function findByNamespace($namespace)
    {
        if (!$this->hasPlugin($namespace))
            return null;

        $classId = $this->getIdentifier($namespace);
        return $this->plugins[$classId];
    }

    /**
     * Returns a plugin registration class based on its identifier (Author.Plugin).
     */
    public function findByIdentifier($identifier)
    {
        if (!isset($this->plugins[$identifier]))
            return null;

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
        $it = new RecursiveIteratorIterator(new RecursiveDirectoryIterator($dirPath));
        $it->setMaxDepth(2);

        while($it->valid()) {
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
        if (strpos($namespace, '\\') === null)
            return $namespace;

        $parts = explode('\\', $namespace);
        $slice = array_slice($parts, 1, 2);
        $namespace = implode('.', $slice);
        return $namespace;
    }
}