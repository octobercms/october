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
use Twig_Environment;
use Controller as BaseController;
use Cms\Twig\Loader as TwigLoader;
use Cms\Twig\Extension as TwigExtension;
use Cms\Classes\FileHelper as CmsFileHelper;
use System\Classes\ErrorHandler;
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
     * @var \Cms\Classes\Page A reference to the CMS page being processed.
     */
    protected $page;

    /**
     * @var \Cms\Classes\Layout A reference to the CMS layout used by the page.
     */
    protected $layout;

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
     * Creates the controller.
     * @param \Cms\Classes\Theme $theme Specifies the CMS theme.
     * If the theme is not specified, the current active theme used.
     */
    public function __construct($theme = null)
    {
        $this->theme = $theme ? $theme : Theme::getActiveTheme();
        $this->assetPath = Config::get('cms.themesDir').'/'.$this->theme->getDirName();
    }

    /**
     * Finds and serves the requested page.
     * If the page cannot be found, returns the page with the URL /404.
     * If the /404 page doesn't exist, returns the system 404 page.
     * @param string $url Specifies the requested page URL.
     * If the parameter is omitted, the current URL used.
     * @return string Returns the processed page content.
     */
    public function run($url = null)
    {
        if (!$url)
            $url = Request::path();

        if (!strlen($url))
            $url = '/';

        $this->router = new Router($this->theme);

        $page = $this->router->findByUrl($url);

        /*
         * Extensibility
         */
        if ($event = Event::fire('cms.page.beforeDisplay', [$this, $url, $page], true))
            return $event;

        if ($event = $this->fireEvent('page.beforeDisplay', [$this, $url, $page], true))
            return $event;

        /*
         * If the page was not found, render the 404 page - either provided by the theme or the built-in one.
         */
        if (!$page && !($page = $this->router->findByUrl('/404')))
            return Response::make(View::make('cms::404'), 404);

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

        $this->initTwigEnvironment();

        /*
         * The 'this' variable is reserved for default variables.
         */
        $this->vars['this'] = [
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
        CmsException::capture($this->page, 400, function() {
            $this->loader->setObject($this->page);
            $template = $this->twig->loadTemplate($this->page->getFullPath());
            $this->pageContents = $template->render($this->vars);
        });

        /*
         * Render the layout
         */
        $result = CmsException::capture($this->layout, 400, function() {
            $this->loader->setObject($this->layout);
            $template = $this->twig->loadTemplate($this->layout->getFullPath());
            return $template->render($this->vars);
        });

        /*
         * Extensibility
         */
        if ($event = Event::fire('cms.page.display', [$this, $url, $page], true))
            return $event;

        if ($event = $this->fireEvent('page.display', [$this, $url, $page], true))
            return $event;

        return $result;
    }

    /**
     * Initializes the Twig environment and loader.
     * Registers the \Cms\Twig\Extension object with Twig.
     * @return \Twig_Environment Returns the Twig environment object.
     */
    protected function initTwigEnvironment()
    {
        $this->loader = new TwigLoader();

        $options = ['auto_reload' => true];
        if (!Config::get('cms.twigNoCache'))
            $options['cache'] =  storage_path().'/twig';

        $this->twig = new Twig_Environment($this->loader, $options);
        $this->twig->addExtension(new TwigExtension($this));
    }

    /**
     * Initializes the custom layout and page objects.
     */
    protected function initCustomObjects()
    {
        $this->layoutObj = null;
        
        if (!$this->layout->isFallBack()) {
            CmsException::capture($this->layout, 300, function(){
                $parser = new CodeParser($this->layout);
                $this->layoutObj = $parser->source($this->page, $this->layout, $this);
            });
        }

        CmsException::capture($this->page, 300, function(){
            $parser = new CodeParser($this->page);
            $this->pageObj = $parser->source($this->page, $this->layout, $this);
        });
    }

    /**
     * Initializes the components for the layout and page.
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

        $componentObj->onInit();
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
                        if (!CmsFileHelper::validateName($partial))
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
            catch (Exception $ex) {
                return Response::make($ex->getMessage(), 500);
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
     * Executes the page life cycle.
     * Creates an object from the PHP sections of the page and
     * it's layout, then executes their life cycle functions.
     */
    protected function execPageCycle()
    {
        /*
         * Extensibility
         */
        if ($event = Event::fire('cms.page.start', [$this], true))
            return $event;

        if ($event = $this->fireEvent('page.start', [$this], true))
            return $event;

        /*
         * Run layout functions
         */
        if ($this->layoutObj) {
            $response = CmsException::capture($this->layout, 300, function(){
                return (($result = $this->layoutObj->onStart())
                    || ($result = $this->layout->runComponents())
                    || ($result = $this->layoutObj->onBeforePageStart())) ? $result: null;
            });

            if ($response) return $response;
        }

        /*
         * Run page functions
         */
        $response = CmsException::capture($this->page, 300, function(){
            return (($result = $this->pageObj->onStart())
                || ($result = $this->page->runComponents())
                || ($result = $this->pageObj->onEnd())) ? $result : null;
        });

        if ($response) return $response;

        /*
         * Run remaining layout functions
         */
        if ($this->layoutObj) {
            $response = CmsException::capture($this->layout, 300, function(){
                return ($result = $this->layoutObj->onEnd()) ? $result : null;
            });
        }

        /*
         * Extensibility
         */
        if ($event = Event::fire('cms.page.end', [$this], true))
            return $event;

        if ($event = $this->fireEvent('page.end', [$this], true))
            return $event;

        return $response;
    }

    /**
     * Renders a requested page.
     * The framework uses this method internally.
     */
    public function renderPage()
    {
        return $this->pageContents;
    }

    /**
     * Renders a requested partial.
     * The framework uses this method internally.
     */
    public function renderPartial($name, $parameters = [])
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
                if ($this->componentContext !== null)
                    $componentObj = $this->componentContext;

                elseif (($componentObj = $this->findComponentByPartial($partialName)) === null)
                    throw new CmsException(Lang::get('cms::lang.partial.not_found', ['name'=>$name]));
            }
            /*
             * Component alias is supplied
             */
            else {
                if (($componentObj = $this->findComponentByName($componentAlias)) === null)
                    throw new CmsException(Lang::get('cms::lang.component.not_found', ['name'=>$componentAlias]));
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


            if ($partial === null)
                throw new CmsException(Lang::get('cms::lang.partial.not_found', ['name'=>$name]));

            /*
             * Set context for self access
             */
            $this->vars['__SELF__'] = $componentObj;
        }
        else {
            /*
             * Process theme partial
             */
            if (($partial = Partial::loadCached($this->theme, $name)) === null)
                throw new CmsException(Lang::get('cms::lang.partial.not_found', ['name'=>$name]));
        }

        $this->loader->setObject($partial);
        $template = $this->twig->loadTemplate($partial->getFullPath());
        $result = $template->render(array_merge($this->vars, $parameters));
        $this->componentContext = null;
        return $result;
    }

    /**
     * Renders a requested content file.
     * The framework uses this method internally.
     */
    public function renderContent($name)
    {
        if (($content = Content::loadCached($this->theme, $name)) === null)
            throw new CmsException(Lang::get('cms::lang.content.not_found', ['name'=>$name]));

        $filePath = $content->getFullPath();
        $fileContent = File::get($filePath);

        if (strtolower(File::extension($filePath)) == 'md')
            $fileContent = Markdown::parse($fileContent);

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

        return $this->renderPartial($name.'::default');
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
     * Returns the routing object.
     * @return \Cms\Classes\Router
     */
    public function getRouter()
    {
        return $this->router;
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

        $url = $this->router->findByFile($name, $parameters);
        return ($url) ? URL::to($url) : null;
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
        $_url = Request::getBaseUrl();

        if ($url === null)
            $_url .= $themePath;
        elseif (is_array($url))
            $_url .= CombineAssets::combine($url, $themePath);
        else
            $_url .= $themePath.'/'.$url;

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
    private function findComponentByName($name)
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
    private function findComponentByHandler($handler)
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
    private function findComponentByPartial($partial)
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