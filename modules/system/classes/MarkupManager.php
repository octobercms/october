<?php namespace System\Classes;

use Str;
use Twig\TokenParser\AbstractTokenParser as TwigTokenParser;
use Twig\TwigFilter as TwigSimpleFilter;
use Twig\TwigFunction as TwigSimpleFunction;
use ApplicationException;

/**
 * This class manages Twig functions, token parsers and filters.
 *
 * @package october\system
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
    protected $callbacks = [];

    /**
     * @var array Globally registered extension items
     */
    protected $items;

    /**
     * @var \System\Classes\PluginManager
     */
    protected $pluginManager;

    /**
     * @var array Transaction based extension items
     */
    protected $transactionItems;

    /**
     * @var bool Manager is in transaction mode
     */
    protected $transactionMode = false;

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
            if (!is_array($items)) {
                continue;
            }

            foreach ($items as $type => $definitions) {
                if (!is_array($definitions)) {
                    continue;
                }

                $this->registerExtensions($type, $definitions);
            }
        }
    }

    /**
     * Registers a callback function that defines simple Twig extensions.
     * The callback function should register menu items by calling the manager's
     * `registerFunctions`, `registerFilters`, `registerTokenParsers` function.
     * The manager instance is passed to the callback function as an argument.
     * Usage:
     *
     *     MarkupManager::registerCallback(function($manager){
     *         $manager->registerFilters([...]);
     *         $manager->registerFunctions([...]);
     *         $manager->registerTokenParsers([...]);
     *     });
     *
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
        $items = $this->transactionMode ? 'transactionItems' : 'items';

        if ($this->$items === null) {
            $this->$items = [];
        }

        if (!array_key_exists($type, $this->$items)) {
            $this->$items[$type] = [];
        }

        foreach ($definitions as $name => $definition) {
            switch ($type) {
                case self::EXTENSION_TOKEN_PARSER:
                    $this->$items[$type][] = $definition;
                    break;
                case self::EXTENSION_FILTER:
                case self::EXTENSION_FUNCTION:
                    $this->$items[$type][$name] = $definition;
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
        $results = [];

        if ($this->items === null) {
            $this->loadExtensions();
        }

        if (isset($this->items[$type]) && is_array($this->items[$type])) {
            $results = $this->items[$type];
        }

        if ($this->transactionItems !== null && isset($this->transactionItems[$type])) {
            $results = array_merge($results, $this->transactionItems[$type]);
        }

        return $results;
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

    /**
     * Makes a set of Twig functions for use in a twig extension.
     * @param  array $functions Current collection
     * @return array
     */
    public function makeTwigFunctions($functions = [])
    {
        if (!is_array($functions)) {
            $functions = [];
        }

        foreach ($this->listFunctions() as $name => $callable) {
            /*
             * Handle a wildcard function
             */
            if (strpos($name, '*') !== false && $this->isWildCallable($callable)) {
                $callable = function ($name) use ($callable) {
                    $arguments = array_slice(func_get_args(), 1);
                    $method = $this->isWildCallable($callable, Str::camel($name));
                    return call_user_func_array($method, $arguments);
                };
            }

            if (!is_callable($callable)) {
                throw new ApplicationException(sprintf('The markup function for %s is not callable.', $name));
            }

            $functions[] = new TwigSimpleFunction($name, $callable, ['is_safe' => ['html']]);
        }

        return $functions;
    }

    /**
     * Makes a set of Twig filters for use in a twig extension.
     * @param  array $filters Current collection
     * @return array
     */
    public function makeTwigFilters($filters = [])
    {
        if (!is_array($filters)) {
            $filters = [];
        }

        foreach ($this->listFilters() as $name => $callable) {
            /*
             * Handle a wildcard function
             */
            if (strpos($name, '*') !== false && $this->isWildCallable($callable)) {
                $callable = function ($name) use ($callable) {
                    $arguments = array_slice(func_get_args(), 1);
                    $method = $this->isWildCallable($callable, Str::camel($name));
                    return call_user_func_array($method, $arguments);
                };
            }

            if (!is_callable($callable)) {
                throw new ApplicationException(sprintf('The markup filter for %s is not callable.', $name));
            }

            $filters[] = new TwigSimpleFilter($name, $callable, ['is_safe' => ['html']]);
        }

        return $filters;
    }

    /**
     * Makes a set of Twig token parsers for use in a twig extension.
     * @param  array $parsers Current collection
     * @return array
     */
    public function makeTwigTokenParsers($parsers = [])
    {
        if (!is_array($parsers)) {
            $parsers = [];
        }

        $extraParsers = $this->listTokenParsers();
        foreach ($extraParsers as $obj) {
            if (!$obj instanceof TwigTokenParser) {
                continue;
            }

            $parsers[] = $obj;
        }

        return $parsers;
    }

    /**
     * Tests if a callable type contains a wildcard, also acts as a
     * utility to replace the wildcard with a string.
     * @param  callable  $callable
     * @param  string|bool $replaceWith
     * @return mixed
     */
    protected function isWildCallable($callable, $replaceWith = false)
    {
        $isWild = false;

        if (is_string($callable) && strpos($callable, '*') !== false) {
            $isWild = $replaceWith ? str_replace('*', $replaceWith, $callable) : true;
        }

        if (is_array($callable)) {
            if (is_string($callable[0]) && strpos($callable[0], '*') !== false) {
                if ($replaceWith) {
                    $isWild = $callable;
                    $isWild[0] = str_replace('*', $replaceWith, $callable[0]);
                }
                else {
                    $isWild = true;
                }
            }

            if (!empty($callable[1]) && strpos($callable[1], '*') !== false) {
                if ($replaceWith) {
                    $isWild = $isWild ?: $callable;
                    $isWild[1] = str_replace('*', $replaceWith, $callable[1]);
                }
                else {
                    $isWild = true;
                }
            }
        }

        return $isWild;
    }

    //
    // Transactions
    //

    /**
     * Execute a single serving transaction, containing filters, functions,
     * and token parsers that are disposed of afterwards.
     * @param  \Closure  $callback
     * @return void
     */
    public function transaction(Closure $callback)
    {
        $this->beginTransaction();
        $callback($this);
        $this->endTransaction();
    }

    /**
     * Start a new transaction.
     * @return void
     */
    public function beginTransaction()
    {
        $this->transactionMode = true;
    }

    /**
     * Ends an active transaction.
     * @return void
     */
    public function endTransaction()
    {
        $this->transactionMode = false;

        $this->transactionItems = null;
    }
}
