<?php namespace Cms\Classes;

use URL;
use Str;
use App;
use File;
use View;
use Lang;
use Route;
use Event;
use Config;
use Session;
use Request;
use Response;
use Exception;
use BackendAuth;
use Twig_Environment;
use Cms\Twig\Loader as TwigLoader;
use Cms\Twig\DebugExtension;
use Cms\Twig\Extension as CmsTwigExtension;
use Cms\Models\MaintenanceSettings;
use System\Models\RequestLog;
use System\Classes\ErrorHandler;
use System\Classes\CombineAssets;
use System\Twig\Extension as SystemTwigExtension;
use October\Rain\Exception\AjaxException;
use October\Rain\Exception\SystemException;
use October\Rain\Exception\ValidationException;
use October\Rain\Exception\ApplicationException;
use October\Rain\Parse\Template as TextParser;
use Illuminate\Http\RedirectResponse;

/**
 * The CMS controller class.
 * The controller finds and serves requested pages.
 *
 * @package october\cms
 * @author Alexey Bobkov, Samuel Georges
 */
class Controller
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
     * @var array A list of variables to pass to the page.
     */
    public $vars = [];

    /**
     * @var int Response status code
     */
    protected $statusCode = 200;

    /**
     * @var self Cache of self
     */
    protected static $instance = null;

    /**
     * @var Cms\Classes\ComponentBase Object of the active component, used internally.
     */
    protected $componentContext = null;

    /**
     * @var array Component partial stack, used internally.
     */
    protected $partialStack = [];

    /**
     * Creates the controller.
     * @param \Cms\Classes\Theme $theme Specifies the CMS theme.
     * If the theme is not specified, the current active theme used.
     */
    public function __construct($theme = null)
    {
        $this->theme = $theme ? $theme : Theme::getActiveTheme();
        if (!$this->theme) {
            throw new CmsException(Lang::get('cms::lang.theme.active.not_found'));
        }

        $this->assetPath = Config::get('cms.themesPath', '/themes').'/'.$this->theme->getDirName();
        $this->router = new Router($this->theme);
        $this->partialStack = new PartialStack;
        $this->initTwigEnvironment();

        self::$instance = $this;
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
        if ($url === null) {
            $url = Request::path();
        }

        if (!strlen($url)) {
            $url = '/';
        }

        /*
         * Hidden page
         */
        $page = $this->router->findByUrl($url);
        if ($page && $page->is_hidden) {
            if (!BackendAuth::getUser()) {
                $page = null;
            }
        }

        /*
         * Maintenance mode
         */
        if (
            MaintenanceSettings::isConfigured() &&
            MaintenanceSettings::get('is_enabled', false) &&
            !BackendAuth::getUser()
        ) {
            $this->setStatusCode(503);
            $page = Page::loadCached($this->theme, MaintenanceSettings::get('cms_page'));
        }

        /*
         * Extensibility
         */
        if (
            ($event = $this->fireEvent('page.beforeDisplay', [$url, $page], true)) ||
            ($event = Event::fire('cms.page.beforeDisplay', [$this, $url, $page], true))
        ) {
            if ($event instanceof Page) {
                $page = $event;
            }
            else {
                return $event;
            }
        }

        /*
         * If the page was not found, render the 404 page - either provided by the theme or the built-in one.
         */
        if (!$page) {
            $this->setStatusCode(404);

            // Log the 404 request
            if (!App::runningUnitTests()) {
                RequestLog::add();
            }

            if (!$page = $this->router->findByUrl('/404')) {
                return Response::make(View::make('cms::404'), $this->statusCode);
            }
        }

        /*
         * Run the page
         */
        $result = $this->runPage($page);

        /*
         * Post-processing
         */
        $result = $this->postProcessResult($page, $url, $result);

        /*
         * Extensibility
         */
        if (
            ($event = $this->fireEvent('page.display', [$url, $page, $result], true)) ||
            ($event = Event::fire('cms.page.display', [$this, $url, $page, $result], true))
        ) {
            return $event;
        }

        if (!is_string($result)) {
            return $result;
        }

        return Response::make($result, $this->statusCode);
    }

    /**
     * Renders a page in its entirety, including component initialization.
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

        return $controller->runPage($page, false);
    }

    /**
     * Runs a page directly from its object and supplied parameters.
     * @param \Cms\Classes\Page $page Specifies the CMS page to run.
     * @return string
     */
    public function runPage($page, $useAjax = true)
    {
        $this->page = $page;

        /*
         * If the page doesn't refer any layout, create the fallback layout.
         * Otherwise load the layout specified in the page.
         */
        if (!$page->layout) {
            $layout = Layout::initFallback($this->theme);
        }
        elseif (($layout = Layout::loadCached($this->theme, $page->layout)) === null) {
            throw new CmsException(Lang::get('cms::lang.layout.not_found_name', ['name'=>$page->layout]));
        }

        $this->layout = $layout;

        /*
         * The 'this' variable is reserved for default variables.
         */
        $this->vars['this'] = [
            'page'        => $this->page,
            'layout'      => $this->layout,
            'theme'       => $this->theme,
            'param'       => $this->router->getParameters(),
            'controller'  => $this,
            'environment' => App::environment(),
            'session'     => App::make('session'),
        ];

        /*
         * Check for the presence of validation errors in the session.
         */
        $this->vars['errors'] = (Config::get('session.driver') && Session::has('errors'))
            ? Session::get('errors')
            : new \Illuminate\Support\ViewErrorBag;

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
        if (
            ($event = $this->fireEvent('page.init', [$page], true)) ||
            ($event = Event::fire('cms.page.init', [$this, $page], true))
        ) {
            return $event;
        }

        /*
         * Execute AJAX event
         */
        if ($useAjax && $ajaxResponse = $this->execAjaxHandlers()) {
            return $ajaxResponse;
        }

        /*
         * Execute postback handler
         */
        if (
            $useAjax &&
            ($handler = post('_handler')) &&
            ($handlerResponse = $this->runAjaxHandler($handler)) &&
            $handlerResponse !== true
        ) {
            return $handlerResponse;
        }

        /*
         * Execute page lifecycle
         */
        if ($cycleResponse = $this->execPageCycle()) {
            return $cycleResponse;
        }

        /*
         * Extensibility
         */
        if (
            ($event = $this->fireEvent('page.beforeRenderPage', [$page], true)) ||
            ($event = Event::fire('cms.page.beforeRenderPage', [$this, $page], true))
        ) {
            $this->pageContents = $event;
        }
        else {
            /*
             * Render the page
             */
            CmsException::mask($this->page, 400);
            $this->loader->setObject($this->page);
            $template = $this->twig->loadTemplate($this->page->getFullPath());
            $this->pageContents = $template->render($this->vars);
            CmsException::unmask();
        }

        /*
         * Render the layout
         */
        CmsException::mask($this->layout, 400);
        $this->loader->setObject($this->layout);
        $template = $this->twig->loadTemplate($this->layout->getFullPath());
        $result = $template->render($this->vars);
        CmsException::unmask();

        return $result;
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
        if (
            ($event = $this->fireEvent('page.start', [], true)) ||
            ($event = Event::fire('cms.page.start', [$this], true))
        ) {
            return $event;
        }

        /*
         * Run layout functions
         */
        if ($this->layoutObj) {
            CmsException::mask($this->layout, 300);
            $response = (($result = $this->layoutObj->onStart()) ||
                ($result = $this->layout->runComponents()) ||
                ($result = $this->layoutObj->onBeforePageStart())) ? $result: null;
            CmsException::unmask();

            if ($response) {
                return $response;
            }
        }

        /*
         * Run page functions
         */
        CmsException::mask($this->page, 300);
        $response = (($result = $this->pageObj->onStart()) ||
            ($result = $this->page->runComponents()) ||
            ($result = $this->pageObj->onEnd())) ? $result : null;
        CmsException::unmask();

        if ($response) {
            return $response;
        }

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
        if (
            ($event = $this->fireEvent('page.end', [], true)) ||
            ($event = Event::fire('cms.page.end', [$this], true))
        ) {
            return $event;
        }

        return $response;
    }

    /**
     * Post-processes page HTML code before it's sent to the client.
     * Note for pre-processing see cms.template.processTwigContent event.
     * @param \Cms\Classes\Page $page Specifies the current CMS page.
     * @param string $url Specifies the current URL.
     * @param string $content The page markup to post processs.
     * @return string Returns the updated result string.
     */
    protected function postProcessResult($page, $url, $content)
    {
        $content = MediaViewHelper::instance()->processHtml($content);

        $dataHolder = (object) ['content' => $content];

        Event::fire('cms.page.postprocess', [$this, $url, $page, $dataHolder]);

        return $dataHolder->content;
    }

    //
    // Initialization
    //

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
        if (!Config::get('cms.twigNoCache')) {
            $options['cache'] =  storage_path().'/cms/twig';
        }

        $this->twig = new Twig_Environment($this->loader, $options);
        $this->twig->addExtension(new CmsTwigExtension($this));
        $this->twig->addExtension(new SystemTwigExtension);

        if ($isDebugMode) {
            $this->twig->addExtension(new DebugExtension($this));
        }
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
                list($name, $alias) = strpos($component, ' ')
                    ? explode(' ', $component)
                    : [$component, $component];

                $this->addComponent($name, $alias, $properties, true);
            }
        }

        foreach ($this->page->settings['components'] as $component => $properties) {
            list($name, $alias) = strpos($component, ' ')
                ? explode(' ', $component)
                : [$component, $component];

            $this->addComponent($name, $alias, $properties);
        }

        /*
         * Extensibility
         */
        $this->fireEvent('page.initComponents', [$this->page, $this->layout]);
        Event::fire('cms.page.initComponents', [$this, $this->page, $this->layout]);
    }

    //
    // AJAX
    //

    /**
     * Returns the AJAX handler for the current request, if available.
     * @return string
     */
    public function getAjaxHandler()
    {
        if (!Request::ajax() || Request::method() != 'POST') {
            return null;
        }

        if ($handler = Request::header('X_OCTOBER_REQUEST_HANDLER')) {
            return trim($handler);
        }

        return null;
    }

    /**
     * Executes the page, layout, component and plugin AJAX handlers.
     * @return mixed Returns the AJAX Response object or null.
     */
    protected function execAjaxHandlers()
    {
        if ($handler = $this->getAjaxHandler()) {
            try {
                /*
                 * Validate the handler name
                 */
                if (!preg_match('/^(?:\w+\:{2})?on[A-Z]{1}[\w+]*$/', $handler)) {
                    throw new CmsException(Lang::get('cms::lang.ajax_handler.invalid_name', ['name'=>$handler]));
                }

                /*
                 * Validate the handler partial list
                 */
                if ($partialList = trim(Request::header('X_OCTOBER_REQUEST_PARTIALS'))) {
                    $partialList = explode('&', $partialList);

                    foreach ($partialList as $partial) {
                        if (!preg_match('/^(?:\w+\:{2}|@)?[a-z0-9\_\-\.\/]+$/i', $partial)) {
                            throw new CmsException(Lang::get('cms::lang.partial.invalid_name', ['name'=>$partial]));
                        }
                    }
                }
                else {
                    $partialList = [];
                }

                $responseContents = [];

                /*
                 * Execute the handler
                 */
                if (!$result = $this->runAjaxHandler($handler)) {
                    throw new CmsException(Lang::get('cms::lang.ajax_handler.not_found', ['name'=>$handler]));
                }

                /*
                 * If the handler returned an array, we should add it to output for rendering.
                 * If it is a string, add it to the array with the key "result".
                 */
                if (is_array($result)) {
                    $responseContents = array_merge($responseContents, $result);
                }
                elseif (is_string($result)) {
                    $responseContents['result'] = $result;
                }

                /*
                 * Render partials and return the response as array that will be converted to JSON automatically.
                 */
                foreach ($partialList as $partial) {
                    $responseContents[$partial] = $this->renderPartial($partial);
                }

                /*
                 * If the handler returned a redirect, process it so framework.js knows to redirect
                 * the browser and not the request!
                 */
                if ($result instanceof RedirectResponse) {
                    $responseContents['X_OCTOBER_REDIRECT'] = $result->getTargetUrl();
                }

                return Response::make($responseContents, $this->statusCode);
            }
            catch (ValidationException $ex) {
                /*
                 * Handle validation errors
                 */
                $responseContents['X_OCTOBER_ERROR_FIELDS'] = $ex->getFields();
                $responseContents['X_OCTOBER_ERROR_MESSAGE'] = $ex->getMessage();
                throw new AjaxException($responseContents);
            }
            catch (Exception $ex) {
                throw $ex;
            }
        }

        return null;
    }

    /**
     * Tries to find and run an AJAX handler in the page, layout, components and plugins.
     * The method stops as soon as the handler is found.
     * @param string $handler name of the ajax handler
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

            if ($componentObj && $componentObj->methodExists($handlerName)) {
                $this->componentContext = $componentObj;
                $result = $componentObj->runAjaxHandler($handlerName);
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
                $result = $componentObj->runAjaxHandler($handler);
                return ($result) ?: true;
            }
        }

        return false;
    }

    //
    // Rendering
    //

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
        if (
            ($event = $this->fireEvent('page.render', [$contents], true)) ||
            ($event = Event::fire('cms.page.render', [$this, $contents], true))
        ) {
            return $event;
        }

        return $contents;
    }

    /**
     * Renders a requested partial.
     * The framework uses this method internally.
     * @param string $name The view to load.
     * @param array $parameters Parameter variables to pass to the view.
     * @param bool $throwException Throw an exception if the partial is not found.
     * @return mixed Partial contents or false if not throwing an exception.
     */
    public function renderPartial($name, $parameters = [], $throwException = true)
    {
        $vars = $this->vars;

        /*
         * Alias @ symbol for ::
         */
        if (substr($name, 0, 1) == '@') {
            $name = '::' . substr($name, 1);
        }

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
                    if ($throwException) {
                        throw new CmsException(Lang::get('cms::lang.partial.not_found_name', ['name'=>$partialName]));
                    }
                    else {
                        return false;
                    }
                }
            /*
             * Component alias is supplied
             */
            }
            else {
                if (($componentObj = $this->findComponentByName($componentAlias)) === null) {
                    if ($throwException) {
                        throw new CmsException(Lang::get('cms::lang.component.not_found', ['name'=>$componentAlias]));
                    }
                    else {
                        return false;
                    }
                }
            }

            $partial = null;
            $this->componentContext = $componentObj;

            /*
             * Check if the theme has an override
             */
            if (strpos($partialName, '/') === false) {
                $overrideName = $componentObj->alias . '/' . $partialName;
                $partial = Partial::loadCached($this->theme, $overrideName);
            }

            /*
             * Check the component partial
             */
            if ($partial === null) {
                $partial = ComponentPartial::loadCached($componentObj, $partialName);
            }

            if ($partial === null) {
                if ($throwException) {
                    throw new CmsException(Lang::get('cms::lang.partial.not_found_name', ['name'=>$name]));
                }
                else {
                    return false;
                }
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
                if ($throwException) {
                    throw new CmsException(Lang::get('cms::lang.partial.not_found_name', ['name'=>$name]));
                }
                else {
                    return false;
                }
            }
        }

        /*
         * Run functions for CMS partials only (Cms\Classes\Partial)
         */

        if ($partial instanceof Partial) {
            $this->partialStack->stackPartial();

            $manager = ComponentManager::instance();

            foreach ($partial->settings['components'] as $component => $properties) {
                // Do not inject the viewBag component to the environment.
                // Not sure if they're needed there by the requirements,
                // but there were problems with array-typed properties used by Static Pages 
                // snippets and setComponentPropertiesFromParams(). --ab
                if ($component == 'viewBag')
                    continue;

                list($name, $alias) = strpos($component, ' ')
                    ? explode(' ', $component)
                    : [$component, $component];

                if (!$componentObj = $manager->makeComponent($name, $this->pageObj, $properties)) {
                    throw new CmsException(Lang::get('cms::lang.component.not_found', ['name'=>$name]));
                }

                $componentObj->alias = $alias;
                $parameters[$alias] = $partial->components[$alias] = $componentObj;

                $this->partialStack->addComponent($alias, $componentObj);

                $this->setComponentPropertiesFromParams($componentObj, $parameters);
                $componentObj->init();
            }

            CmsException::mask($this->page, 300);
            $parser = new CodeParser($partial);
            $partialObj = $parser->source($this->page, $this->layout, $this);
            CmsException::unmask();

            CmsException::mask($partial, 300);
            $partialObj->onStart();
            $partial->runComponents();
            $partialObj->onEnd();
            CmsException::unmask();
        }

        /*
         * Render the partial
         */
        CmsException::mask($partial, 400);
        $this->loader->setObject($partial);
        $template = $this->twig->loadTemplate($partial->getFullPath());
        $result = $template->render(array_merge($this->vars, $parameters));
        CmsException::unmask();

        if ($partial instanceof Partial) {
            $this->partialStack->unstackPartial();
        }

        $this->vars = $vars;
        return $result;
    }

    /**
     * Renders a requested content file.
     * The framework uses this method internally.
     * @param string $name The content view to load.
     * @param array $parameters Parameter variables to pass to the view.
     * @return string
     */
    public function renderContent($name, $parameters = [])
    {
        /*
         * Extensibility
         */
        if (
            ($event = $this->fireEvent('page.beforeRenderContent', [$name], true)) ||
            ($event = Event::fire('cms.page.beforeRenderContent', [$this, $name], true))
        ) {
            $content = $event;
        }
        /*
         * Load content from theme
         */
        elseif (($content = Content::loadCached($this->theme, $name)) === null) {
            throw new CmsException(Lang::get('cms::lang.content.not_found_name', ['name'=>$name]));
        }

        $fileContent = $content->parsedMarkup;

        /*
         * Parse basic template variables
         */
        if (!empty($parameters)) {
            $fileContent = TextParser::parse($fileContent, $parameters);
        }

        /*
         * Extensibility
         */
        if (
            ($event = $this->fireEvent('page.renderContent', [$name, $fileContent], true)) ||
            ($event = Event::fire('cms.page.renderContent', [$this, $name, $fileContent], true))
        ) {
            return $event;
        }

        return $fileContent;
    }

    /**
     * Renders a component's default content.
     * @param $name
     * @param array $parameters
     * @return string Returns the component default contents.
     */
    public function renderComponent($name, $parameters = [])
    {
        if ($componentObj = $this->findComponentByName($name)) {
            $componentObj->id = uniqid($name);
            $componentObj->setProperties(array_merge($componentObj->getProperties(), $parameters));
            if ($result = $componentObj->onRender()) {
                return $result;
            }
        }

        return $this->renderPartial($name.'::default', [], false);
    }

    //
    // Setters
    //

    /**
     * Sets the status code for the current web response.
     * @param int $code Status code
     * @return self
     */
    public function setStatusCode($code)
    {
        $this->statusCode = (int) $code;
        return $this;
    }

    //
    // Getters
    //

    /**
     * Returns an existing instance of the controller.
     * If the controller doesn't exists, returns null.
     * @return mixed Returns the controller object or null.
     */
    public static function getController()
    {
        return self::$instance;
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
     * Returns the Twig loader.
     * @return \Cms\Twig\Loader
     */
    public function getLoader()
    {
        return $this->loader;
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
     * Returns the CMS page object being processed by the controller.
     * The object is not available on the early stages of the controller
     * initialization.
     * @return \Cms\Classes\Page Returns the Page object or null.
     */
    public function getPage()
    {
        return $this->page;
    }

    /**
     * Intended to be called from the page, returns the layout code base object.
     * @return \Cms\Classes\CodeBase
     */
    public function getLayoutObject()
    {
        return $this->layoutObj;
    }

    //
    // Page helpers
    //

    /**
     * Looks up the URL for a supplied page and returns it relative to the website root.
     *
     * @param mixed $name Specifies the Cms Page file name.
     * @param array $parameters Route parameters to consider in the URL.
     * @param bool $routePersistence By default the existing routing parameters will be included
     * @return string
     */
    public function pageUrl($name, $parameters = [], $routePersistence = true)
    {
        if (!$name) {
            return $this->currentPageUrl($parameters, $routePersistence);
        }

        /*
         * Second parameter can act as third
         */
        if (is_bool($parameters)) {
            $routePersistence = $parameters;
            $parameters = [];
        }

        if ($routePersistence) {
            $parameters = array_merge($this->router->getParameters(), $parameters);
        }

        if (!$url = $this->router->findByFile($name, $parameters)) {
            return null;
        }

        if (substr($url, 0, 1) == '/') {
            $url = substr($url, 1);
        }

        $routeAction = 'Cms\Classes\CmsController@run';
        $actionExists = Route::getRoutes()->getByAction($routeAction) !== null;

        if ($actionExists) {
            return URL::action($routeAction, ['slug' => $url]);
        }
        else {
            return URL::to($url);
        }
    }

    /**
     * Looks up the current page URL with supplied parameters and route persistence.
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
     * Converts supplied URL to a theme URL relative to the website root. If the URL provided is an
     * array then the files will be combined.
     * @param mixed $url Specifies the theme-relative URL. If null, the theme path is returned.
     * @return string
     */
    public function themeUrl($url = null)
    {
        $themeDir = $this->getTheme()->getDirName();

        if (is_array($url)) {
            $_url = URL::to(CombineAssets::combine($url, themes_path().'/'.$themeDir));
        }
        else {
            $_url = Config::get('cms.themesPath', '/themes').'/'.$themeDir;
            if ($url !== null) {
                $_url .= '/'.$url;
            }
            $_url = URL::asset($_url);
        }

        return $_url;
    }

    /**
     * Converts supplied file to a URL relative to the media library.
     * @param string $file Specifies the media-relative file
     * @return string
     */
    public function mediaUrl($file = null)
    {
        return MediaLibrary::url($file);
    }

    /**
     * Returns a routing parameter.
     * @param string $name Routing parameter name.
     * @param string $default Default to use if none is found.
     * @return string
     */
    public function param($name, $default = null)
    {
        return $this->router->getParameter($name, $default);
    }

    //
    // Component helpers
    //

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
            if (!$componentObj = $manager->makeComponent($name, $this->layoutObj, $properties)) {
                throw new CmsException(Lang::get('cms::lang.component.not_found', ['name'=>$name]));
            }

            $componentObj->alias = $alias;
            $this->vars[$alias] = $this->layout->components[$alias] = $componentObj;
        }
        else {
            if (!$componentObj = $manager->makeComponent($name, $this->pageObj, $properties)) {
                throw new CmsException(Lang::get('cms::lang.component.not_found', ['name'=>$name]));
            }

            $componentObj->alias = $alias;
            $this->vars[$alias] = $this->page->components[$alias] = $componentObj;
        }

        $this->setComponentPropertiesFromParams($componentObj);
        $componentObj->init();
        return $componentObj;
    }

    /**
     * Searches the layout and page components by an alias
     * @param $name
     * @return ComponentBase The component object, if found
     */
    public function findComponentByName($name)
    {
        if (isset($this->page->components[$name])) {
            return $this->page->components[$name];
        }

        if (isset($this->layout->components[$name])) {
            return $this->layout->components[$name];
        }

        $partialComponent = $this->partialStack->getComponent($name);
        if ($partialComponent !== null) {
            return $partialComponent;
        }

        return null;
    }

    /**
     * Searches the layout and page components by an AJAX handler
     * @param string $handler
     * @return ComponentBase The component object, if found
     */
    public function findComponentByHandler($handler)
    {
        foreach ($this->page->components as $component) {
            if (method_exists($component, $handler)) {
                return $component;
            }
        }

        foreach ($this->layout->components as $component) {
            if (method_exists($component, $handler)) {
                return $component;
            }
        }

        return null;
    }

    /**
     * Searches the layout and page components by a partial file
     * @param string $partial
     * @return ComponentBase The component object, if found
     */
    public function findComponentByPartial($partial)
    {
        foreach ($this->page->components as $component) {
            $fileName = ComponentPartial::getFilePath($component, $partial);
            if (!strlen(File::extension($fileName))) {
                $fileName .= '.htm';
            }

            if (File::isFile($fileName)) {
                return $component;
            }
        }

        foreach ($this->layout->components as $component) {
            $fileName = ComponentPartial::getFilePath($component, $partial);
            if (!strlen(File::extension($fileName))) {
                $fileName .= '.htm';
            }

            if (File::isFile($fileName)) {
                return $component;
            }
        }

        return null;
    }

    /**
     * Set the component context manually, used by Components when calling renderPartial.
     * @param ComponentBase $component
     * @return void
     */
    public function setComponentContext(ComponentBase $component = null)
    {
        $this->componentContext = $component;
    }

    /**
     * Sets component property values from partial parameters.
     * The property values should be defined as {{ param }}.
     * @param ComponentBase $component The component object.
     * @param array $parameters Specifies the partial parameters.
     */
    protected function setComponentPropertiesFromParams($component, $parameters = [])
    {
        $properties = $component->getProperties();
        $routerParameters = $this->router->getParameters();

        foreach ($properties as $propertyName => $propertyValue) {
            if (is_array($propertyValue)) {
                continue;
            }

            $matches = [];
            if (preg_match('/^\{\{([^\}]+)\}\}$/', $propertyValue, $matches)) {
                $paramName = trim($matches[1]);

                if (substr($paramName, 0, 1) == ':') {
                    $routeParamName = substr($paramName, 1);
                    $newPropertyValue = array_key_exists($routeParamName, $routerParameters)
                        ? $routerParameters[$routeParamName]
                        : null;

                }
                else {
                    $newPropertyValue = array_key_exists($paramName, $parameters)
                        ? $parameters[$paramName]
                        : null;
                }

                $component->setProperty($propertyName, $newPropertyValue);
                $component->setExternalPropertyName($propertyName, $paramName);
            }
        }
    }
}
