<?php namespace System\Twig;

use URL;
use Twig_Extension;
use Twig_TokenParser;
use Twig_SimpleFilter;
use Twig_SimpleFunction;
use System\Classes\ApplicationException;
use System\Classes\MarkupManager;

/**
 * The System Twig extension class implements common Twig functions and filters.
 *
 * @package october\system
 * @author Alexey Bobkov, Samuel Georges
 */
class Extension extends Twig_Extension
{

    /**
     * @var \System\Classes\MarkupManager A reference to the markup manager instance.
     */
    private $markupManager;

    /**
     * Creates the extension instance.
     */
    public function __construct()
    {
        $this->markupManager = MarkupManager::instance();
    }

    /**
     * Returns the name of the extension.
     *
     * @return string The extension name
     */
    public function getName()
    {
        return 'System';
    }

    /**
     * Returns a list of functions to add to the existing list.
     *
     * @return array An array of functions
     */
    public function getFunctions()
    {
        $functions = [];

        /*
         * Include extensions provided by plugins
         */
        foreach ($this->markupManager->listFunctions() as $name => $callable) {
            if (!is_callable($callable))
                throw new ApplicationException(sprintf('The markup function for %s is not callable.', $name));

            $functions[] = new Twig_SimpleFunction($name, $callable, ['is_safe' => ['html']]);
        }

        return $functions;
    }

    /**
     * Returns a list of filters this extensions provides.
     *
     * @return array An array of filters
     */
    public function getFilters()
    {
        $filters = [
            new Twig_SimpleFilter('app', [$this, 'appFilter'], ['is_safe' => ['html']]),
        ];

        /*
         * Include extensions provided by plugins
         */
        foreach ($this->markupManager->listFilters() as $name => $callable) {
            if (!is_callable($callable))
                throw new ApplicationException(sprintf('The markup filter for %s is not callable.', $name));

            $filters[] = new Twig_SimpleFilter($name, $callable, ['is_safe' => ['html']]);
        }

        return $filters;
    }

    /**
     * Returns a list of token parsers this extensions provides.
     *
     * @return array An array of token parsers
     */
    public function getTokenParsers()
    {
        $parsers = [];

        $extraParsers = $this->markupManager->listTokenParsers();
        foreach ($extraParsers as $obj) {
            if (!$obj instanceof Twig_TokenParser)
                continue;

            $parsers[] = $obj;
        }

        return $parsers;
    }

    /**
     * Converts supplied URL to one relative to the website root.
     * @param mixed $url Specifies the application-relative URL
     * @return string
     */
    public function appFilter($url)
    {
        return URL::to($url);
    }

}