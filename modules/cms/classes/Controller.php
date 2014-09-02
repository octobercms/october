<?php namespace Cms\Classes;

use URL;
use Str;
use App;
use File;
use View;
use Lang;
use Event;
use Config;
use Request;
use Response;
use Exception;
use BackendAuth;
use Twig_Environment;
use Controller as BaseController;
use Cms\Twig\Loader as TwigLoader;
use Cms\Twig\DebugExtension;
use Cms\Twig\Extension as CmsTwigExtension;
use Cms\Classes\FileHelper as CmsFileHelper;
use System\Models\RequestLog;
use System\Classes\ErrorHandler;
use System\Classes\ApplicationException;
use System\Twig\Extension as SystemTwigExtension;
use October\Rain\Support\Markdown;
use October\Rain\Support\ValidationException;
use Illuminate\Http\RedirectResponse;

/**
 * The CMS controller class.
 * The controller finds and serves requested pages.
 *
 * @package october\cms
 * @author Alexey Bobkov, Samuel Georges
 */
class Controller extends BaseController
{
    use \System\Traits\AssetMaker;
    use \October\Rain\Support\Traits\Emitter;

    /**
     * @var \Cms\Classes\Theme A reference to the CMS theme processed by the controller.
     */
    protected $theme;

    /**
     * @var \Cms\Classes\Router A reference to the Router object.
     */
    protected $router;

    /**
     * @var \Cms\Twig\Loader A reference to the Twig template loader.
     */
    protected $loader;

    /**
     * @var \Cms\Classes\Page A reference to the CMS page template being processed.
     */
    protected $page;

    /**
     * @var \Cms\Classes\CodeBase A reference to the CMS page code section object.
     */
    protected $pageObj;

    /**
     * @var \Cms\Classes\Layout A reference to the CMS layout template used by the page.
     */
    protected $layout;

    /**
     * @var \Cms\Classes\CodeBase A reference to the CMS layout code section object.
     */
    protected $layoutObj;

    /**
     * @var \Twig_Environment Keeps the Twig environment object.
     */
    protected $twig;

    /**
     * @var string Contains the rendered page contents string.
     */
    protected $pageContents;

    /**
     * @var string Alias name of an executing component.
     */
    protected $componentContext;

    /**
     * @var array A list of variables to pass to the page.
     */
    public $vars = [];

    /**
     * @var int Response status code
     */
    protected $statusCode = 200;

    /**
     * Creates the controller.
     * @param \Cms\Classes\Theme $theme Specifies the CMS theme.
     * If the theme is not specified, the current active theme used.
     */
    public function __construct($theme = null)
    {
        $this->theme = $theme ? $theme : Theme::getActiveTheme();
        if (!$this->theme)
            throw new CmsException(Lang::get('cms::lang.theme.active.not_found'));

        $this->assetPath = Config::get('cms.themesDir').'/'.$this->theme->getDirName();
        $this->router = new Router($this->theme);
        $this->initTwigEnvironment();
    }

    /**
     * Finds and serves the requested page.
     * If the page cannot be found, returns the page with the URL /404.
     * If the /404 page doesn't exist, returns the system 404 page.
     * @param string $url Specifies the requested page URL.
     * If the parameter is omitted, the current URL used.
     * @return string Returns the processed page content.
     */
    public function run($url = '/')
    {
        if ($url === null)
            $url = Request::path();

        if (!strlen($url))
            $url = '/';

        /*
         * Handle hidden pages
         */
        $page = $this->router->findByUrl($url);
        if ($page && $page->hidden) {
            if (!BackendAuth::getUser())
                $page = null;
        }

        /*
         * Extensibility
         */
        if ($event = $this->fireEvent('page.beforeDisplay', [$url, $page], true))
            return $event;

        if ($event = Event::fire('cms.page.beforeDisplay', [$this, $url, $page], true))
            return $event;

        /*
         * If the page was not found, render the 404 page - either provided by the theme or the built-in one.
         */
        if (!$page) {
            $this->setStatusCode(404);

            // Log the 404 request
            RequestLog::add();

            if (!$page = $this->router->findByUrl('/404'))
                return Response::make(View::make('cms::404'), $this->statusCode);
        }

        $this->page = $page;

        /*
         * If the page doesn't refer any layout, create the fallback layout.
         * Otherwise load the layout specified in the page.
         */
        if (!$page->layout)
            $layout = Layout::initFallback($this->theme);
        elseif (($layout = Layout::loadCached($this->theme, $page->layout)) === null)
            throw new CmsException(Lang::get('cms::lang.layout.not_found', ['name'=>$page->layout]));

        $this->layout = $layout;

        /*
         * The 'this' variable is reserved for default variables.
         */
        $this->vars['this'] = [
            'controller'  => $this,
            'layout'      => $this->layout,
            'page'        => $this->page,
            'param'       => $this->router->getParameters(),
            'environment' => App::environment(),
        ];

        /*
         * Handle AJAX requests and execute the life cycle functions
         */
        $this->initCustomObjects();

        $this->initComponents();

        /*
         * Give the layout and page an opportunity to participate
         * after components are initialized and before AJAX is handled.
         */
        if ($this->layoutObj) {
            CmsException::mask($this->layout, 300);
            $this->layoutObj->onInit();
            CmsException::unmask();
        }

        CmsException::mask($this->page, 300);
        $this->pageObj->onInit();
        CmsException::unmask();

        /*
         * Extensibility
         */
        if ($event = $this->fireEvent('page.init', [$url, $page], true))
            return $event;

        if ($event = Event::fire('cms.page.init', [$this, $url, $page], true))
            return $event;

        /*
         * Execute AJAX event
         */
        if ($ajaxResponse = $this->execAjaxHandlers())
            return $ajaxResponse;

        /*
         * Execute postback handler
         */
        if (($handler = post('_handler')) && ($handlerResponse = $this->runAjaxHandler($handler)) && $handlerResponse !== true)
            return $handlerResponse;

        /*
         * Execute page lifecycle
         */
        if ($cycleResponse = $this->execPageCycle())
            return $cycleResponse;

        /*
         * Render the page
         */
        CmsException::mask($this->page, 400);
        $this->loader->setObject($this->page);
        $template = $this->twig->loadTemplate($this->page->getFullPath());
        $this->pageContents = $template->render($this->vars);
        CmsException::unmask();

        /*
         * Render the layout
         */
        CmsException::mask($this->layout, 400);
        $this->loader->setObject($this->layout);
        $template = $this->twig->loadTemplate($this->layout->getFullPath());
        $result = $template->render($this->vars);
        CmsException::unmask();

        /*
         * Extensibility
         */
        if ($event = $this->fireEvent('page.display', [$url, $page], true))
            return $event;

        if ($event = Event::fire('cms.page.display', [$this, $url, $page], true))
            return $event;

        if (!is_string($result))
            return $result;

        return Response::make($result, $this->statusCode);
    }

    /**
     * Initializes the Twig environment and loader.
     * Registers the \Cms\Twig\Extension object with Twig.
     * @return void
     */
    protected function initTwigEnvironment()
    {
        $this->loader = new TwigLoader;

        $isDebugMode = Config::get('app.debug', false);

        $options = [
            'auto_reload' => true,
            'debug' => $isDebugMode,
        ];
        if (!Config::get('cms.twigNoCache'))
            $options['cache'] =  storage_path().'/twig';

        $this->twig = new Twig_Environment($this->loader, $options);
        $this->twig->addExtension(new CmsTwigExtension($this));
        $this->twig->addExtension(new SystemTwigExtension);

        if ($isDebugMode)
            $this->twig->addExtension(new DebugExtension($this));
    }

    /**
     * Initializes the custom layout and page objects.
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
     * Initializes the components for the layout and page.
     * @return void
     */
    protected function initComponents()
    {
        if (!$this->layout->isFallBack()) {
            foreach ($this->layout->settings['components'] as $component => $properties) {
                list($name, $alias) = strpos($component, ' ') ? explode(' ', $component) : array($component, $component);
                $this->addComponent($name, $alias, $properties, true);
            }
        }

        foreach ($this->page->settings['components'] as $component => $properties) {
            list($name, $alias) = strpos($component, ' ') ? explode(' ', $component) : array($component, $component);
            $this->addComponent($name, $alias, $properties);
        }
    }

    /**
     * Adds a component to the page object
     * @param mixed  $name        Component class name or short name
     * @param string $alias       Alias to give the component
     * @param array  $properties  Component properties
     * @param bool   $addToLayout Add to layout, instead of page
     * @return ComponentBase Component object
     */
    public function addComponent($name, $alias, $properties, $addToLayout = false)
    {
        $manager = ComponentManager::instance();

        if ($addToLayout) {
            if (!$componentObj = $manager->makeComponent($name, $this->layoutObj, $properties))
                throw new CmsException(Lang::get('cms::lang.component.not_found', ['name'=>$name]));

            $componentObj->alias = $alias;
            $this->vars[$alias] = $this->layout->components[$alias] = $componentObj;
        }
        else {
            if (!$componentObj = $manager->makeComponent($name, $this->pageObj, $properties))
                throw new CmsException(Lang::get('cms::lang.component.not_found', ['name'=>$name]));

            $componentObj->alias = $alias;
            $this->vars[$alias] = $this->page->components[$alias] = $componentObj;
        }

        $componentObj->init();
        $componentObj->onInit(); // Deprecated: Remove ithis line if year >= 2015
        return $componentObj;
    }

    /**
     * Executes the page, layout, component and plugin AJAX handlers.
     * @return mixed Returns the AJAX Response object or null.
     */
    protected function execAjaxHandlers()
    {
        if ($handler = trim(Request::header('X_OCTOBER_REQUEST_HANDLER'))) {
            try {
                /*
                 * Validate the handler name
                 */
                if (!preg_match('/^(?:\w+\:{2})?on[A-Z]{1}[\w+]*$/', $handler))
                    throw new CmsException(Lang::get('cms::lang.ajax_handler.invalid_name', ['name'=>$handler]));

                /*
                 * Validate the handler partial list
                 */
                if ($partialList = trim(Request::header('X_OCTOBER_REQUEST_PARTIALS'))) {
                    $partialList = explode('&', $partialList);

                    foreach ($partialList as $partial) {
                        if (!preg_match('/^(?:\w+\:{2}|@)?[a-z0-9\_\-\.\/]+$/i', $partial))
                            throw new CmsException(Lang::get('cms::lang.partial.invalid_name', ['name'=>$partial]));
                    }
                }
                else {
                    $partialList = [];
                }

                $responseContents = [];

                /*
                 * Execute the handler
                 */
                if (!$result = $this->runAjaxHandler($handler))
                    throw new CmsException(Lang::get('cms::lang.ajax_handler.not_found', ['name'=>$handler]));

                /*
                 * If the handler returned an array, we should add it to output for rendering.
                 * If it is a string, add it to the array with the key "result".
                 */
                if (is_array($result))
                    $responseContents = array_merge($responseContents, $result);
                elseif (is_string($result))
                    $responseContents['result'] = $result;

                /*
                 * Render partials and return the response as array that will be converted to JSON automatically.
                 */
                foreach ($partialList as $partial)
                    $responseContents[$partial] = $this->renderPartial($partial);

                /*
                 * If the handler returned a redirect, process it so framework.js knows to redirect
                 * the browser and not the request!
                 */
                if ($result instanceof RedirectResponse) {
                    $responseContents['X_OCTOBER_REDIRECT'] = $result->getTargetUrl();
                }

                return Response::make()->setContent($responseContents);
            }
            catch (ValidationException $ex) {
                /*
                 * Handle validation errors
                 */
                $responseContents['X_OCTOBER_ERROR_FIELDS'] = $ex->getFields();
                $responseContents['X_OCTOBER_ERROR_MESSAGE'] = $ex->getMessage();
                return Response::make($responseContents, 406);
             }
            catch (ApplicationException $ex) {
                return Response::make($ex->getMessage(), 500);
            }
            catch (Exception $ex) {
                /*
                 * Display a "dumbed down" error if custom page is activated
                 * otherwise display a more detailed error.
                 */
                if (Config::get('cms.customErrorPage', false))
                    return Response::make($ex->getMessage(), 500);

                return Response::make(sprintf('"%s" on line %s of %s', $ex->getMessage(), $ex->getLine(), $ex->getFile()), 500);
            }
        }

        return null;
    }

    /**
     * Tries to find and run an AJAX handler in the page, layout, components and plugins.
     * The method stops as soon as the handler is found.
     * @return boolean Returns true if the handler was found. Returns false otherwise.
     */
    protected function runAjaxHandler($handler)
    {
        /*
         * Process Component handler
         */
        if (strpos($handler, '::')) {

            list($componentName, $handlerName) = explode('::', $handler);
            $componentObj = $this->findComponentByName($componentName);

            if ($componentObj && method_exists($componentObj, $handlerName)) {
                $this->componentContext = $componentObj;
                $result = $componentObj->$handlerName();
                return ($result) ?: true;
            }
        }
        /*
         * Process code section handler
         */
        else {
            if (method_exists($this->pageObj, $handler)) {
                $result = $this->pageObj->$handler();
                return ($result) ?: true;
            }

            if (!$this->layout->isFallBack() && method_exists($this->layoutObj, $handler)) {
                $result = $this->layoutObj->$handler();
                return ($result) ?: true;
            }

            /*
             * Cycle each component to locate a usable handler
             */
            if (($componentObj = $this->findComponentByHandler($handler)) !== null) {
                $this->componentContext = $componentObj;
                $result = $componentObj->$handler();
                return ($result) ?: true;
            }
        }

        return false;
    }

    /**
     * Invokes the current page cycle without rendering the page,
     * used by AJAX handler that may rely on the logic inside the action.
     */
    public function pageCycle()
    {
        return $this->execPageCycle();
    }

    /**
     * Executes the page life cycle.
     * Creates an object from the PHP sections of the page and
     * it's layout, then executes their life cycle functions.
     */
    protected function execPageCycle()
    {
        /*
         * Extensibility
         */
        if ($event = $this->fireEvent('page.start', [], true))
            return $event;

        if ($event = Event::fire('cms.page.start', [$this], true))
            return $event;

        /*
         * Run layout functions
         */
        if ($this->layoutObj) {
            CmsException::mask($this->layout, 300);
            $response = (($result = $this->layoutObj->onStart())
                || ($result = $this->layout->runComponents())
                || ($result = $this->layoutObj->onBeforePageStart())) ? $result: null;
            CmsException::unmask();

            if ($response) return $response;
        }

        /*
         * Run page functions
         */
        CmsException::mask($this->page, 300);
        $response = (($result = $this->pageObj->onStart())
            || ($result = $this->page->runComponents())
            || ($result = $this->pageObj->onEnd())) ? $result : null;
        CmsException::unmask();

        if ($response) return $response;

        /*
         * Run remaining layout functions
         */
        if ($this->layoutObj) {
            CmsException::mask($this->layout, 300);
            $response = ($result = $this->layoutObj->onEnd()) ? $result : null;
            CmsException::unmask();
        }

        /*
         * Extensibility
         */
        if ($event = $this->fireEvent('page.end', [], true))
            return $event;

        if ($event = Event::fire('cms.page.end', [$this], true))
            return $event;

        return $response;
    }

    /**
     * Renders a requested page.
     * The framework uses this method internally.
     */
    public function renderPage()
    {
        $contents = $this->pageContents;

        /*
         * Extensibility
         */
        if ($event = $this->fireEvent('page.render', [$contents], true))
            return $event;

        if ($event = Event::fire('cms.page.render', [$this, $contents], true))
            return $event;

        return $contents;
    }

    /**
     * Renders a requested partial.
     * The framework uses this method internally.
     * @param string $partial The view to load.
     * @param array $params Parameter variables to pass to the view.
     * @param bool $throwException Throw an exception if the partial is not found.
     * @return mixed Partial contents or false if not throwing an exception.
     */
    public function renderPartial($name, $parameters = [], $throwException = true)
    {
        /*
         * Alias @ symbol for ::
         */
        if (substr($name, 0, 1) == '@')
            $name = '::' . substr($name, 1);

        /*
         * Process Component partial
         */
        if (strpos($name, '::') !== false) {

            list($componentAlias, $partialName) = explode('::', $name);

            /*
             * Component alias not supplied
             */
            if (!strlen($componentAlias)) {
                if ($this->componentContext !== null) {
                    $componentObj = $this->componentContext;
                }
                elseif (($componentObj = $this->findComponentByPartial($partialName)) === null) {
                    if ($throwException)
                        throw new CmsException(Lang::get('cms::lang.partial.not_found', ['name'=>$name]));
                    else
                        return false;
                }
            }
            /*
             * Component alias is supplied
             */
            else {
                if (($componentObj = $this->findComponentByName($componentAlias)) === null) {
                    if ($throwException)
                        throw new CmsException(Lang::get('cms::lang.component.not_found', ['name'=>$componentAlias]));
                    else
                        return false;
                }
            }

            $partial = null;
            $this->componentContext = $componentObj;

            /*
             * Check if the theme has an override
             */
            if (strpos($partialName, '/') === false) {
                $overrideName = strtolower($componentObj->alias) . '/' . $partialName;
                $partial = Partial::loadCached($this->theme, $overrideName);
            }

            /*
             * Check the component partial
             */
            if ($partial === null)
                $partial = ComponentPartial::loadCached($componentObj, $partialName);


            if ($partial === null) {
                if ($throwException)
                    throw new CmsException(Lang::get('cms::lang.partial.not_found', ['name'=>$name]));
                else
                    return false;
            }

            /*
             * Set context for self access
             */
            $this->vars['__SELF__'] = $componentObj;
        }
        else {
            /*
             * Process theme partial
             */
            if (($partial = Partial::loadCached($this->theme, $name)) === null) {
                if ($throwException)
                    throw new CmsException(Lang::get('cms::lang.partial.not_found', ['name'=>$name]));
                else
                    return false;
            }
        }

        CmsException::mask($partial, 400);
        $this->loader->setObject($partial);
        $template = $this->twig->loadTemplate($partial->getFullPath());
        $result = $template->render(array_merge($this->vars, $parameters));
        CmsException::unmask();

        $this->componentContext = null;
        return $result;
    }

    /**
     * Renders a requested content file.
     * The framework uses this method internally.
     */
    public function renderContent($name)
    {
        /*
         * Extensibility
         */
        if ($event = $this->fireEvent('page.beforeRenderContent', [$name], true))
            $content = $event;

        elseif ($event = Event::fire('cms.page.beforeRenderContent', [$this, $name], true))
            $content = $event;

        /*
         * Load content from theme
         */
        elseif (($content = Content::loadCached($this->theme, $name)) === null)
            throw new CmsException(Lang::get('cms::lang.content.not_found', ['name'=>$name]));

        $filePath = $content->getFullPath();
        $fileContent = File::get($filePath);

        if (strtolower(File::extension($filePath)) == 'md')
            $fileContent = Markdown::parse($fileContent);

        /*
         * Extensibility
         */
        if ($event = $this->fireEvent('page.renderContent', [$name, $fileContent], true))
            return $event;

        if ($event = Event::fire('cms.page.renderContent', [$this, $name, $fileContent], true))
            return $event;

        return $fileContent;
    }

    /**
     * Renders a component's default content.
     * @return string Returns the component default contents.
     */
    public function renderComponent($name, $parameters = [])
    {
        if ($componentObj = $this->findComponentByName($name)) {
            $componentObj->id = uniqid($name);
            $componentObj->setProperties(array_merge($componentObj->getProperties(), $parameters));
            if ($result = $componentObj->onRender())
                return $result;
        }

        return $this->renderPartial($name.'::default', [], false);
    }

    /**
     * Sets the status code for the current web response.
     * @param int $code Status code
     */
    public function setStatusCode($code)
    {
        $this->statusCode = (int) $code;
        return $this;
    }

    /**
     * Returns the current CMS theme.
     * @return \Cms\Classes\Theme
     */
    public function getTheme()
    {
        return $this->theme;
    }

    /**
     * Returns the Twig environment.
     * @return Twig_Environment
     */
    public function getTwig()
    {
        return $this->twig;
    }

    /**
     * Returns the routing object.
     * @return \Cms\Classes\Router
     */
    public function getRouter()
    {
        return $this->router;
    }

    /**
     * Intended to be called from the layout, returns the page code base object.
     * @return \Cms\Classes\CodeBase
     */
    public function getPageObject()
    {
        return $this->pageObj;
    }

    /**
     * Intended to be called from the page, returns the layout code base object.
     * @return \Cms\Classes\CodeBase
     */
    public function getLayoutObject()
    {
        return $this->layoutObj;
    }

    /**
     * Looks up the URL for a supplied page and returns it relative to the website root.
     *
     * @param mixed $name Specifies the Cms Page file name.
     * @param array $parameters Route parameters to consider in the URL.
     * @param bool $routePersistence By default the existing routing parameters will be included
     * when creating the URL, set to false to disable this feature.
     * @return string
     */
    public function pageUrl($name, $parameters = [], $routePersistence = true)
    {
        if (!$name)
            return null;

        /*
         * Second parameter can act as third
         */
        if (is_bool($parameters)) {
            $routePersistence = $parameters;
            $parameters = [];
        }

        if ($routePersistence)
            $parameters = array_merge($this->router->getParameters(), $parameters);

        if (!$url = $this->router->findByFile($name, $parameters))
            return null;

        if (substr($url, 0, 1) == '/')
            $url = substr($url, 1);

        return URL::action('Cms\Classes\Controller@run', ['slug' => $url]);
    }

    /**
     * Looks up the current page URL with supplied parameters and route persistence.
     */
    public function currentPageUrl($parameters = [], $routePersistence = true)
    {
        return $this->pageUrl($this->page->getFileName(), $parameters, $routePersistence);
    }

    /**
     * Converts supplied URL to a theme URL relative to the website root. If the URL provided is an
     * array then the files will be combined.
     * @param mixed $url Specifies the theme-relative URL. If null, the theme path is returned.
     * @return string
     */
    public function themeUrl($url = null)
    {
        $themePath = Config::get('cms.themesDir').'/'.$this->getTheme()->getDirName();

        if (is_array($url)) {
            $_url = Request::getBaseUrl();
            $_url .= CombineAssets::combine($url, $themePath);
        }
        else {
            $_url = Request::getBasePath().$themePath;
            if ($url !== null) $_url .= '/'.$url;
        }

        return $_url;
    }

    /**
     * Returns a routing parameter.
     * @param string Routing parameter name.
     * @param string Default to use if none is found.
     * @return string
     */
    public function param($name, $default = null)
    {
        return $this->router->getParameter($name, $default);
    }

    /**
     * Combines JavaScript and StyleSheet assets.
     * @param string $name Combined file code
     * @return string Combined content.
     */
    public function combine($name)
    {
       try {
           if (!strpos($name, '-'))
               throw new CmsException(Lang::get('cms::lang.combiner.not_found', ['name'=>$name]));

           $parts = explode('-', $name);
           $cacheId = $parts[0];

           $combiner = new CombineAssets;
           return $combiner->getContents($cacheId);
       }
       catch (Exception $ex) {
           return '/* '.$ex->getMessage().' */';
       }
    }

    /**
     * Searches the layout and page components by an alias
     * @return ComponentBase The component object, if found
     */
    protected function findComponentByName($name)
    {
        if (isset($this->page->components[$name]))
            return $this->page->components[$name];

        if (isset($this->layout->components[$name]))
            return $this->layout->components[$name];

        return null;
    }

    /**
     * Searches the layout and page components by an AJAX handler
     * @return ComponentBase The component object, if found
     */
    protected function findComponentByHandler($handler)
    {
        foreach ($this->page->components as $component) {
            if (method_exists($component, $handler))
                return $component;
        }

        foreach ($this->layout->components as $component) {
            if (method_exists($component, $handler))
                return $component;
        }

        return null;
    }

    /**
     * Searches the layout and page components by a partial file
     * @return ComponentBase The component object, if found
     */
    protected function findComponentByPartial($partial)
    {
        foreach ($this->page->components as $component) {
            $fileName = ComponentPartial::getFilePath($component, $partial);
            if (!strlen(File::extension($fileName)))
                $fileName .= '.htm';

            if (File::isFile($fileName))
                return $component;
        }

        foreach ($this->layout->components as $component) {
            $fileName = ComponentPartial::getFilePath($component, $partial);
            if (!strlen(File::extension($fileName)))
                $fileName .= '.htm';

            if (File::isFile($fileName))
                return $component;
        }

        return null;
    }

    /**
     * Creates a basic component object for another page, useful for extracting properties.
     * @param  string $page  Page name or page file name
     * @param  string $class Component class name
     * @return ComponentBase
     */
    // public function getOtherPageComponent($page, $class)
    // {
    //     $class = Str::normalizeClassName($class);
    //     $theme = $this->getTheme();
    //     $manager = ComponentManager::instance();
    //     $componentObj = new $class;

    //     if (($page = Page::loadCached($theme, $page)) && isset($page->settings['components'])) {
    //         foreach ($page->settings['components'] as $component => $properties) {
    //             list($name, $alias) = strpos($component, ' ') ? explode(' ', $component) : array($component, $component);
    //             if ($manager->resolve($name) == $class) {
    //                 $componentObj->setProperties($properties);
    //                 $componentObj->alias = $alias;
    //                 return $componentObj;
    //             }
    //         }

    //         if (!isset($page->settings['layout']))
    //             return null;

    //         $layout = $page->settings['layout'];
    //         if (($layout = Layout::loadCached($theme, $layout)) && isset($layout->settings['components'])) {
    //             foreach ($layout->settings['components'] as $component => $properties) {
    //                 list($name, $alias) = strpos($component, ' ') ? explode(' ', $component) : array($component, $component);
    //                 if ($manager->resolve($name) == $class) {
    //                     $componentObj->setProperties($properties);
    //                     $componentObj->alias = $alias;
    //                     return $componentObj;
    //                 }
    //             }
    //         }
    //     }

    //     return null;
    // }

}