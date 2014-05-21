<?php namespace Cms\Classes;

use System\Classes\PluginManager;

/**
 * This class manages Twig functions, token parsers and filters.
 *
 * @package october\cms
 * @author Alexey Bobkov, Samuel Georges
 */
class MarkupManager
{
    use \October\Rain\Support\Traits\Singleton;

    const EXTENSION_FILTER = 'filters';
    const EXTENSION_FUNCTION = 'functions';
    const EXTENSION_TOKEN_PARSER = 'tokens';

    /**
     * @var array Cache of registration callbacks.
     */
    private $callbacks = [];

    /**
     * @var array Registered extension items
     */
    protected $items;

    /**
     * @var \System\Classes\PluginManager
     */
    protected $pluginManager;

    /**
     * Initialize this singleton.
     */
    protected function init()
    {
        $this->pluginManager = PluginManager::instance();
    }

    protected function loadExtensions()
    {
        /*
         * Load module items
         */
        foreach ($this->callbacks as $callback) {
            $callback($this);
        }

        /*
         * Load plugin items
         */
        $plugins = $this->pluginManager->getPlugins();

        foreach ($plugins as $id => $plugin) {
            $items = $plugin->registerMarkupTags();
            if (!is_array($items))
                continue;

            foreach ($items as $type => $definitions) {
                if (!is_array($definitions))
                    continue;

                $this->registerExtensions($type, $definitions);
            }

        }
    }

    /**
     * Registers a callback function that defines simple Twig extensions.
     * The callback function should register menu items by calling the manager's
     * registerFunctions(), registerFilters(), registerTokenParsers() function.
     * The manager instance is passed to the callback function as an argument. 
     * Usage:
     * <pre>
     *   MarkupManager::registerCallback(function($manager){
     *       $manager->registerFilters([...]);
     *       $manager->registerFunctions([...]);
     *       $manager->registerTokenParsers([...]);
     *   });
     * </pre>
     * @param callable $callback A callable function.
     */
    public function registerCallback(callable $callback)
    {
        $this->callbacks[] = $callback;
    }

    /**
     * Registers the CMS Twig extension items.
     * The argument is an array of the extension definitions. The array keys represent the 
     * function/filter name, specific for the plugin/module. Each element in the
     * array should be an associative array.
     * @param string $type The extension type: filters, functions, tokens
     * @param array $definitions An array of the extension definitions.
     */
    public function registerExtensions($type, array $definitions)
    {
        if (is_null($this->items))
            $this->items = [];

        if (!array_key_exists($type, $this->items))
            $this->items[$type] = [];

        foreach ($definitions as $name => $definition) {

            switch ($type) {
                case self::EXTENSION_TOKEN_PARSER:
                    $this->items[$type][] = $definition;
                break;

                case self::EXTENSION_FILTER:
                case self::EXTENSION_FUNCTION:
                    $this->items[$type][$name] = $definition;
                break;
            }
        }
    }

    /**
     * Registers a CMS Twig Filter
     * @param array $definitions An array of the extension definitions.
     */
    public function registerFilters(array $definitions)
    {
        $this->registerExtensions(self::EXTENSION_FILTER, $definitions);
    }

    /**
     * Registers a CMS Twig Function
     * @param array $definitions An array of the extension definitions.
     */
    public function registerFunctions(array $definitions)
    {
        $this->registerExtensions(self::EXTENSION_FUNCTION, $definitions);
    }

    /**
     * Registers a CMS Twig Token Parser
     * @param array $definitions An array of the extension definitions.
     */
    public function registerTokenParsers(array $definitions)
    {
        $this->registerExtensions(self::EXTENSION_TOKEN_PARSER, $definitions);
    }

    /**
     * Returns a list of the registered Twig extensions of a type.
     * @param $type string The Twig extension type
     * @return array
     */
    public function listExtensions($type)
    {
        if ($this->items === null)
            $this->loadExtensions();

        if (!isset($this->items[$type]) || !is_array($this->items[$type]))
            return [];

        return $this->items[$type];
    }

    /**
     * Returns a list of the registered Twig filters.
     * @return array
     */
    public function listFilters()
    {
        return $this->listExtensions(self::EXTENSION_FILTER);
    }

    /**
     * Returns a list of the registered Twig functions.
     * @return array
     */
    public function listFunctions()
    {
        return $this->listExtensions(self::EXTENSION_FUNCTION);
    }

    /**
     * Returns a list of the registered Twig token parsers.
     * @return array
     */
    public function listTokenParsers()
    {
        return $this->listExtensions(self::EXTENSION_TOKEN_PARSER);
    }

}