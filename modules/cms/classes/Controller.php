<?php namespace Cms\Classes;

use Cms;
use App;
use Url;
use Site;
use View;
use Lang;
use Config;
use System;
use Session;
use Request;
use Response;
use BackendAuth;
use Twig\Environment as TwigEnvironment;
use Twig\Cache\FilesystemCache as TwigCacheFilesystem;
use Cms\Twig\Loader as TwigLoader;
use Cms\Twig\DebugExtension;
use Cms\Twig\Extension as CmsTwigExtension;
use Cms\Models\MaintenanceSetting;
use System\Models\RequestLog;
use System\Twig\Extension as SystemTwigExtension;
use System\Twig\SecurityPolicy as TwigSecurityPolicy;
use Larajax\Contracts\AjaxControllerInterface;

/**
 * Controller finds and serves requested CMS pages.
 *
 * @package october\cms
 * @author Alexey Bobkov, Samuel Georges
 */
class Controller implements AjaxControllerInterface
{
    use \Cms\Classes\Controller\HasRenderers;
    use \Cms\Classes\Controller\HasAjaxRequests;
    use \Cms\Classes\Controller\HasThemeAssetMaker;
    use \Cms\Classes\Controller\HasComponentHelpers;
    use \Cms\Traits\ParsableController;
    use \System\Traits\EventEmitter;
    use \System\Traits\ResponseMaker;
    use \System\Traits\SecurityController;

    /**
     * @var \Cms\Classes\Theme theme reference to the CMS theme processed by the controller.
     */
    protected $theme;

    /**
     * @var \Cms\Classes\Router router reference to the Router object.
     */
    protected $router;

    /**
     * @var \Cms\Twig\Loader loader reference to the Twig template loader.
     */
    protected $loader;

    /**
     * @var \Cms\Classes\Page page reference to the CMS page template being processed.
     */
    protected $page;

    /**
     * @var \Cms\Classes\CodeBase pageObj reference to the CMS page code section object.
     */
    protected $pageObj;

    /**
     * @var \Cms\Classes\Layout layout reference to the CMS layout template used by the page.
     */
    protected $layout;

    /**
     * @var \Cms\Classes\CodeBase layoutObj reference to the CMS layout code section object.
     */
    protected $layoutObj;

    /**
     * @var TwigEnvironment twig environment object.
     */
    protected $twig;

    /**
     * @var string pageContents contains the rendered page contents string.
     */
    protected $pageContents;

    /**
     * @var array vars is a list of variables to pass to the page.
     */
    public $vars = [];

    /**
     * @var self instance is a cache of this object.
     */
    protected static $instance;

    /**
     * @var \Cms\Classes\ComponentBase componentContext of the active component, used internally.
     */
    protected $componentContext;

    /**
     * @var \Cms\Classes\PartialStack partialStack, used internally.
     */
    protected $partialStack;

    /**
     * @var \Cms\Classes\PartialWatcher partialWatcher, used internally.
     */
    protected $partialWatcher;

    /**
     * @var bool pageCycled
     */
    protected $pageCycled = false;

    /**
     * __construct the controller.
     * @param \Cms\Classes\Theme $theme Specifies the CMS theme.
     * If the theme is not specified, the current active theme used.
     */
    public function __construct($theme = null)
    {
        $this->theme = $theme ?: Theme::getActiveTheme();
        if (!$this->theme) {
            throw new CmsException(Lang::get('cms::lang.theme.active.not_found'));
        }

        $this->assetPath = $this->getThemeAssetRelativePath();
        $this->assetUrlPath = $this->getThemeAssetUrl();
        $this->router = new Router($this->theme);
        $this->initTwigEnvironment();

        self::$instance = $this;
    }

    /**
     * run finds and serves the requested page URL.
     * If the page cannot be found, returns the page with the URL /404.
     * If the /404 page doesn't exist, returns the system 404 page.
     * If the parameter is null, the current URL used. If it is not provided then '/' is used.
     * Returns the response to the provided URL.
     *
     * @param string|null $url
     * @return mixed
     */
    public function run($url = '/')
    {
        if ($url === null) {
            $url = Request::path();
        }

        if (trim($url) === '') {
            $url = '/';
        }

        // Hidden page
        $page = $this->router->findByUrl($url);
        if ($page && $page->is_hidden && !BackendAuth::getUser()) {
            $page = null;
        }

        $originalPageFound = !!$page;

        // Maintenance mode
        if (MaintenanceSetting::isEnabled() && !Cms::urlHasException($url, 'maintenance')) {
            if (!Request::ajax()) {
                $this->setStatusCode(503);
            }

            $page = Page::loadCached($this->theme, MaintenanceSetting::get('cms_page'));
        }

        /**
         * @event cms.page.beforeDisplay
         * Provides an opportunity to swap the page that gets displayed immediately after loading the page assigned to the URL.
         *
         * Example usage:
         *
         *     Event::listen('cms.page.beforeDisplay', function ((\Cms\Classes\Controller) $controller, (string) $url, (\Cms\Classes\Page) $page) {
         *         if ($url === '/tricked-you') {
         *             return \Cms\Classes\Page::loadCached('trick-theme-code', 'page-file-name');
         *         }
         *     });
         *
         * Or
         *
         *     $controller->bindEvent('page.beforeDisplay', function ((string) $url, (\Cms\Classes\Page) $page) {
         *         if ($url === '/tricked-you') {
         *             return \Cms\Classes\Page::loadCached('trick-theme-code', 'page-file-name');
         *         }
         *     });
         *
         */
        if ($event = $this->fireSystemEvent('cms.page.beforeDisplay', [$url, $page])) {
            if ($event instanceof Page) {
                $page = $event;
            }
            else {
                return $event;
            }
        }

        // If the page was not found, render the 404 page - either provided by the theme or the built-in one.
        if (!$page || $url === '404' || ($url === 'error' && !Config::get('app.debug', false))) {
            if (!Request::ajax()) {
                $this->setStatusCode(404);
            }

            // Log the 404 request
            if (!App::runningUnitTests()) {
                RequestLog::add();
            }

            if (!$page = $this->router->findByUrl('/404')) {
                return Response::make(View::make('cms::404'), $this->statusCode);
            }
        }

        // Run page in capture mode
        if ($ajaxPartial = $this->getAjaxPartialName()) {
            $result = $this->runPageCapture($page, $ajaxPartial);
        }
        // Run the page
        else {
            $result = $this->runPage($page);
        }

        // Post-processing raw content
        if (is_string($result)) {
            $result = $this->postProcessResult($page, $url, $result);
        }

        /**
         * @event cms.page.display
         * Provides an opportunity to modify the response after the page for the URL has been processed. `$result` could be a string representing the HTML to be returned or it could be a Response instance.
         *
         * Example usage:
         *
         *     Event::listen('cms.page.display', function ((\Cms\Classes\Controller) $controller, (string) $url, (\Cms\Classes\Page) $page, (mixed) $result) {
         *         if ($url === '/tricked-you') {
         *             return Response::make('Boo!', 200);
         *         }
         *     });
         *
         * Or
         *
         *     $controller->bindEvent('page.display', function ((string) $url, (\Cms\Classes\Page) $page, (mixed) $result) {
         *         if ($url === '/tricked-you') {
         *             return Response::make('Boo!', 200);
         *         }
         *     });
         *
         */
        if ($event = $this->fireSystemEvent('cms.page.display', [$url, $page, $result])) {
            $result = $event;
        }

        // Log the pageview with dashboard module
        if ($originalPageFound && !App::runningUnitTests() && System::hasModule('Dashboard')) {
            \Dashboard\Classes\TrafficLogger::instance()->logPageview();
        }

        // Prepare and return response
        // @see \System\Traits\ResponseMaker
        return $this->makeResponse($result);
    }

    /**
     * render a page in its entirety, including component initialization.
     * AJAX will be disabled for this process.
     * @param string $pageFile Specifies the CMS page file name to run.
     * @param array  $parameters  Routing parameters.
     * @param \Cms\Classes\Theme  $theme  Theme object
     */
    public static function render($pageFile, $parameters = [], $theme = null)
    {
        if (!$theme && (!$theme = Theme::getActiveTheme())) {
            throw new CmsException(Lang::get('cms::lang.theme.active.not_found'));
        }

        $controller = new static($theme);
        $controller->getRouter()->setParameters($parameters);

        if (($page = Page::load($theme, $pageFile)) === null) {
            throw new CmsException(Lang::get('cms::lang.page.not_found_name', ['name'=>$pageFile]));
        }

        return $controller->runPage($page, ['render' => true]);
    }

    /**
     * runPage runs a page directly from its object and supplied parameters.
     * @param \Cms\Classes\Page $page
     * @param array $options
     * @return string
     */
    public function runPage($page, $options = [])
    {
        // Process options
        extract(array_merge([
            'capture' => false,
            'render' => false
        ], (array) $options));

        $useAjax = !($capture || $render);

        // If the page doesn't refer any layout, create the fallback layout.
        // Otherwise load the layout specified in the page.
        if (!$page->layout) {
            $layout = Layout::initFallback($this->theme);
        }
        elseif (($layout = Layout::loadCached($this->theme, $page->layout)) === null) {
            throw new CmsException(Lang::get('cms::lang.layout.not_found_name', ['name' => $page->layout]));
        }

        $this->page = $page;
        $this->layout = $layout;
        $this->pageCycled = false;

        // The 'this' variable is reserved for default variables.
        $this->vars['this'] = new ThisVariable([
            'controller' => $this,
            'page' => $this->page,
            'layout' => $this->layout,
            'theme' => $this->theme,
            'param' => $this->router->getParameters(),
            'environment' => fn() => App::environment(),
            'request' => fn() => App::make('request'),
            'session' => fn() => App::make('session')->driver(),
            'site' => fn() => Site::getActiveSite(),
            'locale' => fn() => App::getLocale(),

            // @deprecated
            'method' => fn() => Request::method(),
        ]);

        // Check for validation errors and old input in the session.
        $this->vars['errors'] = (Config::get('session.driver') && Session::has('errors'))
            ? Session::get('errors')
            : new \Illuminate\Support\ViewErrorBag;

        $this->vars['oldInput'] = (Config::get('session.driver') && Session::hasOldInput())
            ? Session::getOldInput()
            : array_get($this->vars, 'oldInput', []);

        // Handle AJAX requests and execute the life cycle functions
        $this->initCustomObjects();

        $this->initComponents();

        // Give the layout and page an opportunity to participate
        // after components are initialized and before AJAX is handled.
        if ($this->layoutObj) {
            CmsException::mask($this->layout, 300);
            $this->layoutObj->onInit();
            CmsException::unmask();
        }

        CmsException::mask($this->page, 300);
        $this->pageObj->onInit();
        CmsException::unmask();

        /**
         * @event cms.page.init
         * Provides an opportunity to return a custom response from Controller->runPage() before AJAX handlers are executed
         *
         * Example usage:
         *
         *     Event::listen('cms.page.init', function ((\Cms\Classes\Controller) $controller, (\Cms\Classes\Page) $page) {
         *         return \Cms\Classes\Page::loadCached('trick-theme-code', 'page-file-name');
         *     });
         *
         * Or
         *
         *     $controller->bindEvent('page.init', function ((\Cms\Classes\Page) $page) {
         *         return \Cms\Classes\Page::loadCached('trick-theme-code', 'page-file-name');
         *     });
         *
         */
        if ($event = $this->fireSystemEvent('cms.page.init', [$page])) {
            return $event;
        }

        // Execute AJAX event
        if ($useAjax && ($ajaxResponse = $this->execAjaxHandlers())) {
            return $ajaxResponse;
        }

        // Execute postback handler
        if ($useAjax && ($handlerResponse = $this->execPostbackHandler())) {
            return $handlerResponse;
        }

        // Execute page lifecycle
        if ($cycleResponse = $this->execPageCycle()) {
            return $cycleResponse;
        }

        // Parse dynamic attributes on templates and components
        $this->parseAllEnvironmentVars();

        /**
         * @event cms.page.beforeRenderPage
         * Fires after AJAX handlers are dealt with and provides an opportunity to modify the page contents
         *
         * Example usage:
         *
         *     Event::listen('cms.page.beforeRenderPage', function ((\Cms\Classes\Controller) $controller, (\Cms\Classes\Page) $page) {
         *         return 'Custom page contents';
         *     });
         *
         * Or
         *
         *     $controller->bindEvent('page.beforeRenderPage', function ((\Cms\Classes\Page) $page) {
         *         return 'Custom page contents';
         *     });
         *
         */
        if ($event = $this->fireSystemEvent('cms.page.beforeRenderPage', [$this->page])) {
            $this->pageContents = $event;
        }
        // Render the page
        elseif (!$this->layout->isPriority()) {
            $this->pageContents = $this->renderPageContents();
        }

        // Render the layout
        $result = $this->renderLayoutContents();

        if (!$capture) {
            return $result;
        }
    }

    /**
     * pageCycle invokes the current page cycle without rendering the page,
     * used by AJAX handler that may rely on the logic inside the action.
     */
    public function pageCycle()
    {
        if (!$this->pageCycled) {
            $this->execPageCycle();
        }
    }

    /**
     * execPageCycle executes the page life cycle.
     * Creates an object from the PHP sections of the page and
     * it's layout, then executes their life cycle functions.
     */
    protected function execPageCycle()
    {
        $this->pageCycled = true;

        /**
         * @event cms.page.start
         * Fires before all of the page & layout lifecycle handlers are run
         *
         * Example usage:
         *
         *     Event::listen('cms.page.start', function ((\Cms\Classes\Controller) $controller) {
         *         return Response::make('Taking over the lifecycle!', 200);
         *     });
         *
         * Or
         *
         *     $controller->bindEvent('page.start', function () {
         *         return Response::make('Taking over the lifecycle!', 200);
         *     });
         *
         */
        if ($event = $this->fireSystemEvent('cms.page.start')) {
            return $event;
        }

        // Run layout functions
        if ($this->layoutObj) {
            CmsException::mask($this->layout, 300);
            $response = (
                ($result = $this->layoutObj->onStart()) ||
                ($result = $this->layout->runComponents()) ||
                ($result = $this->layoutObj->onBeforePageStart())
            ) ? $result : null;
            CmsException::unmask();

            if ($response) {
                return $response;
            }
        }

        // Run page functions
        CmsException::mask($this->page, 300);
        $response = (
            ($result = $this->pageObj->onStart()) ||
            ($result = $this->page->runComponents()) ||
            ($result = $this->pageObj->onEnd())
        ) ? $result : null;
        CmsException::unmask();

        if ($response) {
            return $response;
        }

        // Run remaining layout functions
        if ($this->layoutObj) {
            CmsException::mask($this->layout, 300);
            $response = ($result = $this->layoutObj->onEnd()) ? $result : null;
            CmsException::unmask();
        }

        /**
         * @event cms.page.end
         * Fires after all of the page & layout lifecycle handlers are run
         *
         * Example usage:
         *
         *     Event::listen('cms.page.end', function ((\Cms\Classes\Controller) $controller) {
         *         return Response::make('Taking over the lifecycle!', 200);
         *     });
         *
         * Or
         *
         *     $controller->bindEvent('page.end', function () {
         *         return Response::make('Taking over the lifecycle!', 200);
         *     });
         *
         */
        if ($event = $this->fireSystemEvent('cms.page.end')) {
            return $event;
        }

        return $response;
    }

    /**
     * postProcessResult post-processes page HTML code before it's sent to the client.
     * Note for pre-processing see cms.template.processTwigContent event.
     * @param \Cms\Classes\Page $page Specifies the current CMS page.
     * @param string $url Specifies the current URL.
     * @param string $content The page markup to post-process.
     * @return string Returns the updated result string.
     */
    protected function postProcessResult($page, $url, $content)
    {
        /**
         * @event cms.page.postProcessContent
         * Provides opportunity to hook into the post-processing of page HTML code before being sent to the client.
         *
         * Example usage:
         *
         *     Event::listen('cms.page.postProcessContent', function ((\Cms\Classes\Controller) $controller, (string) $url, (\Cms\Classes\Page) $page, (string) &$content) {
         *         $content = str_replace('<a href=', '<a rel="nofollow" href=', $content);
         *     });
         *
         * Or
         *
         *     $controller->bindEvent('page.postProcessContent', function ((string) $url, (\Cms\Classes\Page) $page, (string) &$content) {
         *         $content = 'My custom content';
         *     });
         *
         */
        $this->fireSystemEvent('cms.page.postProcessContent', [$url, $page, &$content]);

        // @deprecated this event will be removed in a later version
        $dataHolder = (object) ['content' => $content];
        $this->fireSystemEvent('cms.page.postprocess', [$url, $page, $dataHolder]);
        $content = $dataHolder->content;

        return $content;
    }

    //
    // Initialization
    //

    /**
     * initTwigEnvironment initializes the Twig environment and loader.
     * Registers the \Cms\Twig\Extension object with Twig.
     * @return void
     */
    protected function initTwigEnvironment()
    {
        $useCache = Config::get('cms.enable_twig_cache', true);
        $isDebugMode = System::checkDebugMode();
        $strictVariables = Config::get('cms.strict_variables', false);
        $forceBytecode = Config::get('cms.force_bytecode_invalidation', false);

        $options = [
            'auto_reload' => true,
            'debug' => $isDebugMode,
            'strict_variables' => $strictVariables,
        ];

        if ($useCache) {
            $options['cache'] = new TwigCacheFilesystem(
                storage_path().'/cms/twig',
                $forceBytecode ? TwigCacheFilesystem::FORCE_BYTECODE_INVALIDATION : 0
            );
        }

        $loader = new TwigLoader;
        $twig = new TwigEnvironment($loader, $options);

        CmsTwigExtension::addExtensionToTwig($twig, $this);
        SystemTwigExtension::addExtensionToTwig($twig);
        TwigSecurityPolicy::addExtensionToTwig($twig);
        DebugExtension::addExtensionToTwig($twig);

        $this->loader = $loader;
        $this->twig = $twig;
    }

    /**
     * initCustomObjects initializes the custom layout and page objects.
     * @return void
     */
    protected function initCustomObjects()
    {
        $this->layoutObj = null;

        if (!$this->layout->isFallBack()) {
            CmsException::mask($this->layout, 300);
            $parser = new CodeParser($this->layout);
            $this->layoutObj = $parser->source($this->page, $this->layout, $this);
            CmsException::unmask();
        }

        CmsException::mask($this->page, 300);
        $parser = new CodeParser($this->page);
        $this->pageObj = $parser->source($this->page, $this->layout, $this);
        CmsException::unmask();
    }

    /**
     * initComponents initializes the components for the layout and page.
     * @return void
     */
    protected function initComponents()
    {
        if (!$this->layout->isFallBack()) {
            foreach ($this->layout->settings['components'] as $component => $properties) {
                [$name, $alias] = strpos($component, ' ')
                    ? explode(' ', $component)
                    : [$component, $component];

                $this->addComponent($name, $alias, $properties, true);
            }
        }

        foreach ($this->page->settings['components'] as $component => $properties) {
            [$name, $alias] = strpos($component, ' ')
                ? explode(' ', $component)
                : [$component, $component];

            $this->addComponent($name, $alias, $properties);
        }

        /**
         * @event cms.page.initComponents
         * Fires after the components for the given page have been initialized
         *
         * Example usage:
         *
         *     Event::listen('cms.page.initComponents', function ((\Cms\Classes\Controller) $controller, (\Cms\Classes\Page) $page, (\Cms\Classes\Layout) $layout) {
         *         \Log::info($page->title . ' components have been initialized');
         *     });
         *
         * Or
         *
         *     $controller->bindEvent('page.initComponents', function ((\Cms\Classes\Page) $page, (\Cms\Classes\Layout) $layout) {
         *         \Log::info($page->title . ' components have been initialized');
         *     });
         *
         */
        $this->fireSystemEvent('cms.page.initComponents', [$this->page, $this->layout]);
    }

    //
    // Page Helpers
    //

    /**
     * pageUrl looks up the URL for a supplied page name and returns it relative to the website root,
     * including route parameters. Parameters can be persisted from the current page parameters.
     * @param string|null $name
     * @param array $parameters
     * @param bool $routePersistence
     * @return string
     */
    public function pageUrl($name = null, $parameters = [], $routePersistence = true)
    {
        if (!$name) {
            return $this->currentPageUrl($parameters, $routePersistence);
        }

        // Invalid input same as not found
        if (!is_string($name)) {
            return null;
        }

        // Second parameter can act as third
        if (is_bool($parameters)) {
            $routePersistence = $parameters;
        }

        if (!is_array($parameters)) {
            $parameters = [];
        }

        if ($routePersistence) {
            $parameters = array_merge($this->router->getParameters(), $parameters);
        }

        if (!$url = $this->router->findByFile($name, $parameters)) {
            return null;
        }

        return Cms::url($url);
    }

    /**
     * currentPageUrl looks up the current page URL with supplied parameters and route persistence.
     * @param array $parameters
     * @param bool $routePersistence
     * @return null|string
     */
    public function currentPageUrl($parameters = [], $routePersistence = true)
    {
        if (!$currentFile = $this->page->getFileName()) {
            return null;
        }

        return $this->pageUrl($currentFile, $parameters, $routePersistence);
    }

    /**
     * themeUrl converts supplied URL to a theme URL relative to the website root, if the URL
     * provided is an array then the files will be combined
     */
    public function themeUrl($url = null): string
    {
        if (is_array($url)) {
            return $this->combineAssets($url);
        }

        $themeUrl = $this->getThemeAssetUrl($url);
        if (Config::get('system.themes_asset_url')) {
            return $themeUrl;
        }

        return Url::toRelative($themeUrl);
    }

    /**
     * param returns a routing parameter.
     * @param string $name Routing parameter name.
     * @param string $default Default to use if none is found.
     * @return string
     */
    public function param($name, $default = null)
    {
        return $this->router->getParameter($name, $default);
    }

    //
    // Getters
    //

    /**
     * getController returns an existing instance of the controller.
     * If the controller doesn't exists, returns null.
     * @return self|null
     */
    public static function getController()
    {
        return self::$instance;
    }

    /**
     * getTheme returns the current CMS theme.
     * @return \Cms\Classes\Theme
     */
    public function getTheme()
    {
        return $this->theme;
    }

    /**
     * getTwig returns the Twig environment.
     * @return TwigEnvironment
     */
    public function getTwig()
    {
        return $this->twig;
    }

    /**
     * getLoader returns the Twig loader.
     * @return \Cms\Twig\Loader
     */
    public function getLoader()
    {
        return $this->loader;
    }

    /**
     * getRouter returns the routing object.
     * @return \Cms\Classes\Router
     */
    public function getRouter()
    {
        return $this->router;
    }

    /**
     * getPageObject is intended to be called from the layout, returns the page code base object.
     * @return \Cms\Classes\CodeBase
     */
    public function getPageObject()
    {
        return $this->pageObj;
    }

    /**
     * getPage returns the CMS page object being processed by the controller.
     * The object is not available on the early stages of the controller
     * initialization.
     * @return \Cms\Classes\Page Returns the Page object or null.
     */
    public function getPage()
    {
        return $this->page;
    }

    /**
     * getLayoutObject is intended to be called from the page, returns the layout code base object.
     * @return \Cms\Classes\CodeBase
     */
    public function getLayoutObject()
    {
        return $this->layoutObj;
    }

    /**
     * getLayout returns the CMS layout object being processed by the controller.
     * The object is not available on the early stages of the controller
     * initialization.
     * @return \Cms\Classes\Layout Returns the Layout object or null.
     */
    public function getLayout()
    {
        return $this->layout;
    }

    /**
     * getPartialObject returns the active partial object from the current context
     * @return \Cms\Classes\CodeBase
     */
    public function getPartialObject()
    {
        return $this->partialStack ? $this->partialStack->getPartialObj() : null;
    }

    //
    // Setters
    //

    /**
     * inComponentContext runs a callback in component context
     */
    public function inComponentContext(?ComponentBase $component = null, ?callable $callback = null)
    {
        $previousContext = $this->componentContext;

        $this->componentContext = $component;

        $result = $callback ? $callback() : $callback;

        $this->componentContext = $previousContext;

        return $result;
    }

    /**
     * @deprecated
     */
    public function setComponentContext(?ComponentBase $component = null)
    {
        $this->componentContext = $component;
    }
}
