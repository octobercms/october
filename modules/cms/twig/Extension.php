<?php namespace Cms\Twig;

use URL;
use Flash;
use Block;
use Twig_Extension;
use Twig_TokenParser;
use Twig_SimpleFilter;
use Twig_SimpleFunction;
use Cms\Classes\Controller;
use Cms\Classes\CmsException;
use Cms\Classes\MarkupManager;

/**
 * The CMS Twig extension class implements the basic CMS Twig functions and filters.
 *
 * @package october\cms
 * @author Alexey Bobkov, Samuel Georges
 */
class Extension extends Twig_Extension
{
    /**
     * @var \Cms\Classes\Controller A reference to the CMS controller.
     */
    private $controller;

    /**
     * @var \Cms\Classes\MarkupManager A reference to the markup manager instance.
     */
    private $markupManager;

    /**
     * Creates the extension instance.
     * @param \Cms\Classes\Controller $controller The CMS controller object.
     */
    public function __construct(Controller $controller)
    {
        $this->controller = $controller;
        $this->markupManager = MarkupManager::instance();
    }

    /**
     * Returns the name of the extension.
     *
     * @return string The extension name
     */
    public function getName()
    {
        return 'CMS';
    }

    /**
     * Returns a list of functions to add to the existing list.
     *
     * @return array An array of functions
     */
    public function getFunctions()
    {
        $functions = [
            new Twig_SimpleFunction('file', [$this, 'fileFunction'], ['is_safe' => ['html']]),
            new Twig_SimpleFunction('page', [$this, 'pageFunction'], ['is_safe' => ['html']]),
            new Twig_SimpleFunction('partial', [$this, 'partialFunction'], ['is_safe' => ['html']]),
            new Twig_SimpleFunction('content', [$this, 'contentFunction'], ['is_safe' => ['html']]),
            new Twig_SimpleFunction('component', [$this, 'componentFunction'], ['is_safe' => ['html']]),
            new Twig_SimpleFunction('placeholder', [$this, 'placeholderFunction'], ['is_safe' => ['html']]),
        ];

        /*
         * Include extensions provided by plugins
         */
        foreach ($this->markupManager->listFunctions() as $name => $callable) {
            if (!is_callable($callable))
                continue;

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
            new Twig_SimpleFilter('page', [$this, 'pageFilter'], ['is_safe' => ['html']]),
            new Twig_SimpleFilter('theme', [$this, 'themeFilter'], ['is_safe' => ['html']]),
        ];

        /*
         * Include extensions provided by plugins
         */
        foreach ($this->markupManager->listFilters() as $name => $callable) {
            if (!is_callable($callable))
                continue;

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
        $parsers = [
            new PageTokenParser,
            new PartialTokenParser,
            new ContentTokenParser,
            new PutTokenParser,
            new PlaceholderTokenParser,
            new DefaultTokenParser,
            new FrameworkTokenParser,
            new ComponentTokenParser,
            new FlashTokenParser,
            new ScriptsTokenParser,
            new StylesTokenParser,
            new FileTokenParser
        ];

        $extraParsers = $this->markupManager->listTokenParsers();
        foreach ($extraParsers as $obj) {
            if (!$obj instanceof Twig_TokenParser)
                continue;

            $parsers[] = $obj;
        }

        return $parsers;
    }

    /**
     * Renders a page.
     * This function should be used in the layout code to output the requested page.
     * @return string Returns the page contents.
     */
    public function pageFunction()
    {
        return $this->controller->renderPage();
    }

    /**
     * Renders a partial.
     * @param string $name Specifies the partial name.
     * @param array $parameters A optional list of parameters to pass to the partial.
     * @return string Returns the partial contents.
     */
    public function partialFunction($name, $parameters = [])
    {
        return $this->controller->renderPartial($name, $parameters);
    }

    /**
     * Renders a content file.
     * @return string Returns the file contents.
     */
    public function contentFunction($name)
    {
        return $this->controller->renderContent($name);
    }

    /**
     * Renders a component's default content.
     * @param string $name Specifies the component name.
     * @param array $parameters A optional list of parameters to pass to the component.
     * @return string Returns the component default contents.
     */
    public function componentFunction($name, $parameters = [])
    {
        return $this->controller->renderComponent($name, $parameters);
    }

    /**
     * Renders registered assets of a given type
     * @return string Returns the component default contents.
     */
    public function assetsFunction($type = null)
    {
        return $this->controller->makeAssets($type);
    }

    /**
     * Renders a placeholder content, without removing the block,
     * must be called before the placeholder tag itself
     * @return string Returns the placeholder contents.
     */
    public function placeholderFunction($name, $default = null)
    {
        if (($result = Block::get($name)) === null)
            return null;

        $result = str_replace('<!-- X_OCTOBER_DEFAULT_BLOCK_CONTENT -->', trim($default), $result);
        return $result;
    }

    /**
     * Returns the uploaded file/image
     * @param string $file Specifies the file name.
     * @return object An object of data for selected file
     */
    public function fileFunction($file)
    {
        return $this->controller->getFile($file, $publicOrProtected);
    }

    /**
     * Converts supplied URL to a theme URL relative to the website root. If the URL provided is an
     * array then the files will be combined.
     * @param mixed $url Specifies the theme-relative URL
     * @return string
     */
    public function themeFilter($url)
    {
        return $this->controller->themeUrl($url);
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

    /**
     * Looks up the URL for a supplied page and returns it relative to the website root.
     * @param mixed $name Specifies the Cms Page file name.
     * @param array $parameters Route parameters to consider in the URL.
     * @param bool $routePersistence By default the existing routing parameters will be included
     * when creating the URL, set to false to disable this feature.
     * @return string
     */
    public function pageFilter($name, $parameters = [], $routePersistence = true)
    {
        return $this->controller->pageUrl($name, $parameters, $routePersistence);
    }

    /**
     * Opens a layout block.
     * @param string $name Specifies the block name
     */
    public function startBlock($name)
    {
        Block::startBlock($name);
    }

    /**
     * Returns a layout block contents and removes the block.
     * @param string $name Specifies the block name
     * @param string $default The default placeholder contents.
     * @return mixed Returns the block contents string or null of the block doesn't exist
     */
    public function displayBlock($name, $default = null)
    {
        if (($result = Block::placeholder($name)) === null)
            return null;

        $result = str_replace('<!-- X_OCTOBER_DEFAULT_BLOCK_CONTENT -->', trim($default), $result);
        return $result;
    }

    /**
     * Closes a layout block.
     */
    public function endBlock()
    {
        Block::endBlock();
    }
}
