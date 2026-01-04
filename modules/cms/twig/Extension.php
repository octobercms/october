<?php namespace Cms\Twig;

use App;
use Cms;
use Flash;
use Cache;
use Block;
use Event;
use Request;
use Response;
use Cms\Classes\PageManager;
use Cms\Classes\Controller;
use Cms\Classes\ThisVariable;
use Twig\Environment as TwigEnvironment;
use Twig\TwigFilter as TwigSimpleFilter;
use Twig\TwigFunction as TwigSimpleFunction;
use Twig\Extension\AbstractExtension as TwigExtension;
use Illuminate\Http\Exceptions\HttpResponseException;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Closure;

/**
 * Extension implements the basic CMS Twig functions and filters.
 *
 * @package october\cms
 * @author Alexey Bobkov, Samuel Georges
 */
class Extension extends TwigExtension
{
    /**
     * @var \Cms\Classes\Controller controller reference
     */
    protected $controller;

    /**
     * @var array putOnceCache stores the cache for yieldBlockOnce
     */
    protected $putOnceCache = [];

    /**
     * __construct the extension instance.
     */
    public function __construct(?Controller $controller = null)
    {
        $this->controller = $controller;
    }

    /**
     * addExtensionToTwig adds this extension to the Twig environment and also
     * creates a hook for others.
     */
    public static function addExtensionToTwig(TwigEnvironment $twig, ?Controller $controller = null)
    {
        $twig->addExtension(new static($controller));

        /**
         * @event cms.extendTwig
         * Provides an opportunity to extend the Twig environment used by the CMS
         *
         * Example usage:
         *
         *     Event::listen('system.extendTwig', function ((Twig\Environment) $twig) {
         *         $twig->addExtension(new \Twig\Extension\StringLoaderExtension);
         *     });
         *
         */
        Event::fire('cms.extendTwig', [$twig]);
    }

    /**
     * getFunctions returns a list of functions to add to the existing list.
     * @return array
     */
    public function getFunctions()
    {
        return [
            new TwigSimpleFunction('page', [$this, 'pageFunction'], ['is_safe' => ['html']]),
            new TwigSimpleFunction('partial', [$this, 'partialFunction'], ['is_safe' => ['html']]),
            new TwigSimpleFunction('hasPartial', [$this, 'hasPartialFunction'], ['is_safe' => ['html']]),
            new TwigSimpleFunction('content', [$this, 'contentFunction'], ['is_safe' => ['html']]),
            new TwigSimpleFunction('hasContent', [$this, 'hasContentFunction'], ['is_safe' => ['html']]),
            new TwigSimpleFunction('component', [$this, 'componentFunction'], ['is_safe' => ['html']]),
            new TwigSimpleFunction('placeholder', [$this, 'placeholderFunction'], ['is_safe' => ['html']]),
            new TwigSimpleFunction('hasPlaceholder', [$this, 'hasPlaceholderFunction'], ['is_safe' => ['html']]),
            new TwigSimpleFunction('ajaxHandler', [$this, 'ajaxHandlerFunction'], []),
            new TwigSimpleFunction('response', [$this, 'responseFunction'], []),
            new TwigSimpleFunction('redirect', [$this, 'redirectFunction'], []),
            new TwigSimpleFunction('abort', [$this, 'abortFunction'], []),
            new TwigSimpleFunction('flash', [$this, 'flashFunction'], []),
        ];
    }

    /**
     * getFilters returns a list of filters this extension provides.
     * @return array
     */
    public function getFilters()
    {
        return [
            new TwigSimpleFilter('page', [$this, 'pageFilter'], ['is_safe' => ['html']]),
            new TwigSimpleFilter('theme', [$this, 'themeFilter'], ['is_safe' => ['html']]),
            new TwigSimpleFilter('content', [$this, 'contentFilter'], ['is_safe' => ['html']]),
        ];
    }

    /**
     * getTokenParsers returns a list of token parsers this extension provides.
     * @return array
     */
    public function getTokenParsers()
    {
        return [
            new \Cms\Twig\TokenParser\PageTokenParser,
            new \Cms\Twig\TokenParser\PartialTokenParser,
            new \Cms\Twig\TokenParser\AjaxPartialTokenParser,
            new \Cms\Twig\TokenParser\ContentTokenParser,
            new \Cms\Twig\TokenParser\PutTokenParser,
            new \Cms\Twig\TokenParser\PlaceholderTokenParser,
            new \Cms\Twig\TokenParser\DefaultTokenParser,
            new \Cms\Twig\TokenParser\FrameworkTokenParser,
            new \Cms\Twig\TokenParser\ComponentTokenParser,
            new \Cms\Twig\TokenParser\FlashTokenParser,
            new \Cms\Twig\TokenParser\ScriptsTokenParser,
            new \Cms\Twig\TokenParser\StylesTokenParser,
            new \Cms\Twig\TokenParser\MetaTokenParser,
            new \Cms\Twig\TokenParser\CacheTokenParser,
        ];
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
     * pageFunction renders a page.
     * This function should be used in the layout code to output the requested page.
     * @param array|null $context
     * @return string
     */
    public function pageFunction($context = null)
    {
        if ($this->controller->getLayout()->isPriority() && is_array($context)) {
            $this->controller->vars += $context;
        }

        return $this->controller->renderPage();
    }

    /**
     * partialFunction renders a partial based on the partial name. The parameters
     * are an optional list of view variables. An exception can be thrown if
     * nothing is found.
     * @return string
     */
    public function partialFunction($name, $parameters = [], $throwException = false)
    {
        return $this->controller->renderPartial($name, $parameters, $throwException);
    }

    /**
     * hasPartialFunction checks the partials existence without rendering it.
     * @return bool
     */
    public function hasPartialFunction($name)
    {
        return (bool) $this->controller->loadPartialObject($name);
    }

    /**
     * contentFunction renders a partial based on the file name. The parameters
     * are an optional list of view variables, otherwise pass false to render nothing
     * and check the existence. An exception can be thrown if nothing is found.
     * @return string
     */
    public function contentFunction($name, $parameters = [], $throwException = false)
    {
        return $this->controller->renderContent($name, $parameters, $throwException);
    }

    /**
     * hasContentFunction checks the content existence without rendering it.
     * @return bool
     */
    public function hasContentFunction($name)
    {
        return (bool) $this->controller->loadContentObject($name);
    }

    /**
     * componentFunction renders a component's default content.
     * @param string $name Specifies the component name.
     * @param array $parameters A optional list of parameters to pass to the component.
     * @return string
     */
    public function componentFunction($name, $parameters = [])
    {
        return $this->controller->renderComponent($name, $parameters);
    }

    /**
     * assetsFunction renders registered assets of a given type
     * @return string
     */
    public function assetsFunction($type = null)
    {
        $result = $this->controller->makeAssets($type);

        Event::fire('cms.assets.render', [$type, &$result]);

        return $result;
    }

    /**
     * placeholderFunction renders a placeholder content, without removing the block,
     * must be called before the placeholder tag itself
     * @return string
     */
    public function placeholderFunction($name, $default = null)
    {
        if (($result = Block::get($name)) === null) {
            return null;
        }

        if (is_string($result)) {
            $result = str_replace(
                '<!-- X_OCTOBER_DEFAULT_BLOCK_CONTENT -->',
                trim((string) $default),
                $result
            );
        }

        return $result;
    }

    /**
     * hasPlaceholderFunction checks that a placeholder exists without rendering it
     */
    public function hasPlaceholderFunction($name)
    {
        return Block::has($name);
    }

    /**
     * ajaxHandlerFunction runs an ajax handler
     * @param string $name
     * @param array|null $postVars
     */
    public function ajaxHandlerFunction($name = '', $postVars = null)
    {
        if (is_array($postVars)) {
            Request::merge($postVars);
        }

        return $this->controller->runAjaxHandlerAsResponse($name);
    }

    /**
     * flashFunction returns flash messages as an object
     * @param string $type
     */
    public function flashFunction($type = null)
    {
        if ($type === 'all') {
            return Flash::messages();
        }

        if ($type) {
            return array_first(Flash::{$type}());
        }

        return Flash::all();
    }

    /**
     * responseFunction returns a new response from the application.
     * @param \Illuminate\Contracts\View\View|string|array|null $content
     * @param int|null $status
     * @param array $headers
     */
    public function responseFunction($content = '', $status = null, array $headers = [])
    {
        if ($content instanceof \Illuminate\Contracts\Support\Responsable) {
            $response = $content->toResponse(App::make('request'));
        }
        elseif ($content instanceof \Symfony\Component\HttpFoundation\Response) {
            $response = $content;
        }
        else {
            $response = Response::make($content, $status ?: 200, $headers);
        }

        if ($status !== null) {
            $response->setStatusCode($status);
        }

        // Allow headers and interception from Response Maker
        $response = $this->controller->makeResponse($response);

        throw new HttpResponseException($response);
    }

    /**
     * redirectFunction will redirect the response to a theme page or URL
     * @param string $to
     * @param int $code
     */
    public function redirectFunction($to, $parameters = [], $code = 302)
    {
        throw new HttpResponseException(Cms::redirect($to, $parameters, $code));
    }

    /**
     * abortFunction will abort the successful page cycle
     * @param int $code
     * @param string|false $message
     */
    public function abortFunction($code, $message = '')
    {
        if ($message === false) {
            $this->controller->setStatusCode($code);
            return;
        }

        if ($code == 404) {
            throw new NotFoundHttpException($message);
        }

        throw new HttpException($code, $message);
    }

    /**
     * pageFilter looks up the URL for a supplied page name and returns it relative to the website root,
     * including route parameters. Parameters can be persisted from the current page parameters.
     * @param mixed $name
     * @param array $parameters
     * @param bool $routePersistence
     * @return string
     */
    public function pageFilter($name, $parameters = [], $routePersistence = true)
    {
        if ($name instanceof ThisVariable) {
            $name = '';
        }

        return $this->controller->pageUrl($name, $parameters, $routePersistence);
    }

    /**
     * themeFilter converts supplied URL to a theme URL relative to the website root. If the URL provided is an
     * array then the files will be combined.
     * @param mixed $url Specifies the theme-relative URL
     * @return string
     */
    public function themeFilter($url)
    {
        return $this->controller->themeUrl($url);
    }

    /**
     * contentFilter processes content for links and snippets
     * @param string $content
     * @return string
     */
    public function contentFilter($content)
    {
        return PageManager::processMarkup($content);
    }

    /**
     * displayBlock returns a layout block contents and removes the block.
     * @param string $name Specifies the block name
     * @param string $default The default placeholder contents.
     * @return string|null
     */
    public function displayBlock($name, $default = null)
    {
        if (($result = Block::placeholder($name)) === null) {
            return $default;
        }

        /**
         * @event cms.block.render
         * Provides an opportunity to modify the rendered block content
         *
         * Example usage:
         *
         *     Event::listen('cms.block.render', function ((string) $name, (string) $result) {
         *         if ($name === 'myBlockName') {
         *             return 'my custom content';
         *         }
         *     });
         *
         */
        if ($event = Event::fire('cms.block.render', [$name, $result], true)) {
            $result = $event;
        }

        $result = str_replace(
            '<!-- X_OCTOBER_DEFAULT_BLOCK_CONTENT -->',
            trim((string) $default),
            $result
        );

        return $result;
    }

    /**
     * setBlock sets a block name as a variable value.
     */
    public function setBlock(string $name, $value)
    {
        Block::set($name, $value);
    }

    /**
     * yieldBlock yields the contents of a block by appending or overwriting,
     * and storing its name alongside the content.
     */
    public function yieldBlock(string $name, $callable, $append = true)
    {
        $content = '';
        foreach ($callable() as $value) {
            $content .= $value;
        }

        if ($append) {
            Block::append($name, $content);
        }
        else {
            Block::set($name, $content);
        }
    }

    /**
     * yieldBlockOnce will append or set some content once per template (partial)
     */
    public function yieldBlockOnce(string $templateName, $placeholderName, $callable, $append = false)
    {
        $cacheKey = "{$templateName}-{$placeholderName}";

        if (!isset($this->putOnceCache[$cacheKey])) {
            $this->yieldBlock($placeholderName, $callable, $append);

            $this->putOnceCache[$cacheKey] = true;
        }
    }

    /**
     * setCache
     */
    public function setCache(string $key, $ttl, $callable): string
    {
        $repo = Cache::store(config('cache.twig', config('cache.default')));

        $themeCode = $this->controller->getTheme()?->getDirName();

        $cacheKey = "cms_twig_{$themeCode}_cache_{$key}";

        if ($ttl === null) {
            $value = $repo->rememberForever($cacheKey, $callable);
        }
        else {
            if ($ttl instanceof \DateTimeInterface) {
                $expiresAt = $ttl;
            }
            elseif ($ttl instanceof \DateInterval) {
                $expiresAt = now()->add($ttl);
            }
            else {
                $expiresAt = now()->addMinutes((int) $ttl);
            }
            $value = $repo->remember($cacheKey, $expiresAt, $callable);
        }

        return is_string($value) ? $value : (string) $value;
    }

    /**
     * @deprecated use yieldBlock
     */
    public function endBlock($append = true)
    {
        Block::endBlock($append);
    }

    /**
     * @deprecated use yieldBlock
     */
    public function startBlock($name)
    {
        Block::startBlock($name);
    }
}
