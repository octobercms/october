<?php namespace Cms\Twig;

use Block;
use Event;
use Twig_Extension;
use Twig_SimpleFilter;
use Twig_SimpleFunction;
use Cms\Classes\Controller;

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
    protected $controller;

    /**
     * Creates the extension instance.
     * @param \Cms\Classes\Controller $controller The CMS controller object.
     */
    public function __construct(Controller $controller = null)
    {
        $this->controller = $controller;
    }

    /**
     * Returns a list of functions to add to the existing list.
     *
     * @return array An array of functions
     */
    public function getFunctions()
    {
        return [
            new Twig_SimpleFunction('page', [$this, 'pageFunction'], ['is_safe' => ['html']]),
            new Twig_SimpleFunction('partial', [$this, 'partialFunction'], ['is_safe' => ['html']]),
            new Twig_SimpleFunction('content', [$this, 'contentFunction'], ['is_safe' => ['html']]),
            new Twig_SimpleFunction('component', [$this, 'componentFunction'], ['is_safe' => ['html']]),
            new Twig_SimpleFunction('placeholder', [$this, 'placeholderFunction'], ['is_safe' => ['html']]),
        ];
    }

    /**
     * Returns a list of filters this extensions provides.
     *
     * @return array An array of filters
     */
    public function getFilters()
    {
        return [
            new Twig_SimpleFilter('page', [$this, 'pageFilter'], ['is_safe' => ['html']]),
            new Twig_SimpleFilter('theme', [$this, 'themeFilter'], ['is_safe' => ['html']]),
        ];
    }

    /**
     * Returns a list of token parsers this extensions provides.
     *
     * @return array An array of token parsers
     */
    public function getTokenParsers()
    {
        return [
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
        ];
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
     * @param bool $throwException Throw an exception if the partial is not found.
     * @return string Returns the partial contents.
     */
    public function partialFunction($name, $parameters = [], $throwException = false)
    {
        return $this->controller->renderPartial($name, $parameters, $throwException);
    }

    /**
     * Renders a content file.
     * @param string $name Specifies the content block name.
     * @param array $parameters A optional list of parameters to pass to the content.
     * @return string Returns the file contents.
     */
    public function contentFunction($name, $parameters = [])
    {
        return $this->controller->renderContent($name, $parameters);
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
        if (($result = Block::get($name)) === null) {
            return null;
        }

        $result = str_replace('<!-- X_OCTOBER_DEFAULT_BLOCK_CONTENT -->', trim($default), $result);
        return $result;
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
        if (($result = Block::placeholder($name)) === null) {
            return $default;
        }

        if ($event = Event::fire('cms.block.render', [$name, $result], true))
            $result = $event;

        $result = str_replace('<!-- X_OCTOBER_DEFAULT_BLOCK_CONTENT -->', trim($default), $result);
        return $result;
    }

    /**
     * Closes a layout block.
     */
    public function endBlock($append = true)
    {
        Block::endBlock($append);
    }
}
