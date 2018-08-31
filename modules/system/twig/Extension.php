<?php namespace System\Twig;

use Url;
use Twig_Extension;
use Twig_SimpleFilter;
use System\Classes\MediaLibrary;
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
    protected $markupManager;

    /**
     * Creates the extension instance.
     */
    public function __construct()
    {
        $this->markupManager = MarkupManager::instance();
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
        $functions = $this->markupManager->makeTwigFunctions($functions);

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
            new Twig_SimpleFilter('media', [$this, 'mediaFilter'], ['is_safe' => ['html']]),
        ];

        /*
         * Include extensions provided by plugins
         */
        $filters = $this->markupManager->makeTwigFilters($filters);

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

        /*
         * Include extensions provided by plugins
         */
        $parsers = $this->markupManager->makeTwigTokenParsers($parsers);

        return $parsers;
    }

    /**
     * Converts supplied URL to one relative to the website root.
     * @param mixed $url Specifies the application-relative URL
     * @return string
     */
    public function appFilter($url)
    {
        return Url::to($url);
    }

    /**
     * Converts supplied file to a URL relative to the media library.
     * @param string $file Specifies the media-relative file
     * @return string
     */
    public function mediaFilter($file)
    {
        return MediaLibrary::url($file);
    }
}
