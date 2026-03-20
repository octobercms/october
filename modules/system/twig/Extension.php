<?php namespace System\Twig;

use App;
use Url;
use Event;
use System;
use Twig\Extension\AbstractExtension as TwigExtension;
use Twig\Environment as TwigEnvironment;
use Twig\Runtime\EscaperRuntime;
use Twig\TwigFilter as TwigSimpleFilter;
use Twig\TwigFunction as TwigSimpleFunction;
use October\Rain\Support\Collection;
use System\Classes\MarkupManager;
use System\Classes\PagerElement;
use System\Classes\ResizeImages;

/**
 * Extension implements common Twig functions and filters for the system twig environment.
 *
 * @package october\system
 * @author Alexey Bobkov, Samuel Georges
 */
class Extension extends TwigExtension
{
    /**
     * @var \System\Classes\MarkupManager markupManager reference.
     */
    protected $markupManager;

    /**
     * __construct the extension instance.
     */
    public function __construct()
    {
        $this->markupManager = MarkupManager::instance();
    }

    /**
     * addExtensionToTwig adds this extension to the Twig environment and also
     * creates a hook for others.
     */
    public static function addExtensionToTwig(TwigEnvironment $twig)
    {
        $twig->addExtension(new static);

        $twig->getRuntime(EscaperRuntime::class)->addSafeClass(
            \Illuminate\View\ComponentAttributeBag::class,
            ['html']
        );

        /**
         * @event system.extendTwig
         * Provides an opportunity to extend the Twig environment used by the system
         *
         * Example usage:
         *
         *     Event::listen('system.extendTwig', function ((Twig\Environment) $twig) {
         *         $twig->addExtension(new \Twig\Extension\StringLoaderExtension);
         *     });
         *
         */
        Event::fire('system.extendTwig', [$twig]);
    }

    /**
     * getFunctions returns a list of functions to add to the existing list.
     * @return array
     */
    public function getFunctions()
    {
        $functions = [
            new TwigSimpleFunction('carbon', [$this, 'carbonFunction'], ['is_safe' => ['html']]),
            new TwigSimpleFunction('pager', [$this, 'pagerFunction'], ['is_safe' => ['html']]),
            new TwigSimpleFunction('ajaxPager', [$this, 'ajaxPagerFunction'], ['is_safe' => ['html']]),
            new TwigSimpleFunction('collect', [$this, 'collectFunction'], []),
        ];

        // Disabled by safe mode
        if (!System::checkSafeMode()) {
            $functions[] = new TwigSimpleFunction('env', 'env');
            $functions[] = new TwigSimpleFunction('config', [\Config::class, 'get']);
        }

        // Include extensions provided by plugins
        $functions = $this->markupManager->makeTwigFunctions($functions);

        return $functions;
    }

    /**
     * getFilters returns a list of filters this extensions provides.
     * @return array
     */
    public function getFilters()
    {
        $filters = [
            new TwigSimpleFilter('app', [$this, 'appFilter'], ['is_safe' => ['html']]),
            new TwigSimpleFilter('resize', [$this, 'resizeFilter'], ['is_safe' => ['html']]),
            new TwigSimpleFilter('trans', '__'),
            new TwigSimpleFilter('trans_choice', 'trans_choice'),
            new TwigSimpleFilter('_', '__'),
            new TwigSimpleFilter('__', 'trans_choice'),

            // @deprecated
            new TwigSimpleFilter('transchoice', 'trans_choice'),
        ];

        // Include extensions provided by plugins
        $filters = $this->markupManager->makeTwigFilters($filters);

        return $filters;
    }

    /**
     * getNodeVisitors returns a list of node visitors this extension provides.
     * @return array
     */
    public function getNodeVisitors()
    {
        return [
            new GetAttrAdjuster
        ];
    }

    /**
     * getTokenParsers returns a list of token parsers this extensions provides.
     * @return array
     */
    public function getTokenParsers()
    {
        $parsers = [];

        // Include extensions provided by plugins
        $parsers = $this->markupManager->makeTwigTokenParsers($parsers);

        return $parsers;
    }

    /**
     * appFilter converts supplied URL to one relative to the website root.
     * @param mixed $url Specifies the application-relative URL
     * @return string
     */
    public function appFilter($url)
    {
        return Url::to($url);
    }

    /**
     * resizeFilter converts supplied input into a URL that will return the desired resized image.
     * The image can be either a file model, absolute path, or URL.
     */
    public function resizeFilter($image, $width = null, $height = null, $options = [])
    {
        return ResizeImages::resize($image, $width, $height, $options);
    }

    /**
     * carbonFunction returns a Carbon function with timezone preference applied.
     */
    public function carbonFunction($value)
    {
        if (App::runningInFrontend() && System::hasModule('Cms')) {
            return \Cms::makeCarbon($value);
        }

        return \System\Helpers\DateTime::makeCarbon($value);
    }

    /**
     * pagerFunction converts a pagination instance to usable attributes
     * @param mixed $paginator
     */
    public function pagerFunction($paginator, $options = [])
    {
        return $paginator ? new PagerElement($paginator, $options) : null;
    }

    /**
     * ajaxPagerFunction
     */
    public function ajaxPagerFunction($paginator, $options = [])
    {
        return $paginator ? new PagerElement($paginator, ['template' => 'ajax'] + $options) : null;
    }

    /**
     * collectFunction spawns a new collection
     * @param mixed $value
     */
    public function collectFunction($value = null)
    {
        return new Collection($value);
    }
}
