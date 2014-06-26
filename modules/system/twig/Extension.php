<?php namespace System\Twig;

use URL;
use Twig_Extension;
use Twig_TokenParser;
use Twig_SimpleFilter;
use Twig_SimpleFunction;
use System\Classes\ApplicationException;

/**
 * The System Twig extension class implements common Twig functions and filters.
 *
 * @package october\system
 * @author Alexey Bobkov, Samuel Georges
 */
class Extension extends Twig_Extension
{
    /**
     * Creates the extension instance.
     */
    public function __construct(){}

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
        return [];
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

        return $filters;
    }

    /**
     * Returns a list of token parsers this extensions provides.
     *
     * @return array An array of token parsers
     */
    public function getTokenParsers()
    {
        return [];
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