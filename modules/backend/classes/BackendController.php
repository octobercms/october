<?php namespace Backend\Classes;

use Str;
use App;
use File;
use View;
use Event;
use Config;
use Request;
use Response;
use Closure;
use Illuminate\Routing\Controller as ControllerBase;
use October\Rain\Router\Helper as RouterHelper;
use System\Classes\PluginManager;

/**
 * This is the master controller for all back-end pages.
 * All requests that are prefixed with the backend URI pattern are sent here,
 * then the next URI segments are analysed and the request is routed to the
 * relevant back-end controller.
 *
 * For example, a request with the URL `/backend/acme/blog/posts` will look
 * for the `Posts` controller inside the `Acme.Blog` plugin.
 *
 * @see Backend\Classes\Controller Base class for back-end controllers
 * @package october\backend
 * @author Alexey Bobkov, Samuel Georges
 */
class BackendController extends ControllerBase
{
    use \October\Rain\Extension\ExtendableTrait;

    /**
     * @var array Behaviors implemented by this controller.
     */
    public $implement;

    /**
     * @var string Allows early access to page action.
     */
    public static $action;

    /**
     * @var array Allows early access to page parameters.
     */
    public static $params;

    /**
     * @var boolean Flag to indicate that the CMS module is handling the current request
     */
    protected $cmsHandling = false;

    /**
     * Stores the requested controller so that the constructor is only run once
     *
     * @var Backend\Classes\Controller
     */
    protected $requestedController;

    /**
     * Instantiate a new BackendController instance.
     */
    public function __construct()
    {
        $this->middleware(function ($request, $next) {
            // Process the request before retrieving controller middleware, to allow for the session and auth data
            // to be made available to the controller's constructor.
            $response = $next($request);

            // Find requested controller to determine if any middleware has been attached
            $pathParts = explode('/', str_replace(Request::root() . '/', '', Request::url()));
            if (count($pathParts)) {
                // Drop off preceding backend URL part if needed
                if (!empty(Config::get('cms.backendUri', 'backend'))) {
                    array_shift($pathParts);
                }
                $path = implode('/', $pathParts);

                $requestedController = $this->getRequestedController($path);
                if (!is_null($requestedController) && count($requestedController['controller']->getMiddleware())) {
                    $action = $requestedController['action'];

                    // Collect applicable middleware and insert middleware into pipeline
                    $controllerMiddleware = collect($requestedController['controller']->getMiddleware())
                        ->reject(function ($data) use ($action) {
                            return static::methodExcludedByOptions($action, $data['options']);
                        })
                        ->pluck('middleware');

                    foreach ($controllerMiddleware as $middleware) {
                        $middleware->call($requestedController['controller'], $request, $response);
                    }
                }
            }

            return $response;
        });

        $this->extendableConstruct();
    }

    /**
     * Extend this object properties upon construction.
     */
    public static function extend(Closure $callback)
    {
        self::extendableExtendCallback($callback);
    }

    /**
     * Pass unhandled URLs to the CMS Controller, if it exists
     *
     * @param string $url
     * @return Response
     */
    protected function passToCmsController($url)
    {
        if (
            in_array('Cms', Config::get('cms.loadModules', [])) &&
            class_exists('\Cms\Classes\Controller')
        ) {
            $this->cmsHandling = true;
            return App::make('Cms\Classes\Controller')->run($url);
        } else {
            return Response::make(View::make('backend::404'), 404);
        }
    }

    /**
     * Finds and serves the requested backend controller.
     * If the controller cannot be found, returns the Cms page with the URL /404.
     * If the /404 page doesn't exist, returns the system 404 page.
     * @param string $url Specifies the requested page URL.
     * If the parameter is omitted, the current URL used.
     * @return string Returns the processed page content.
     */
    public function run($url = null)
    {
        $params = RouterHelper::segmentizeUrl($url);

        // Handle NotFoundHttpExceptions in the backend (usually triggered by abort(404))
        Event::listen('exception.beforeRender', function ($exception, $httpCode, $request) {
            if (!$this->cmsHandling && $exception instanceof \Symfony\Component\HttpKernel\Exception\NotFoundHttpException) {
                return View::make('backend::404');
            }
        }, 1);

        /*
         * Database check
         */
        if (!App::hasDatabase()) {
            return Config::get('app.debug', false)
                ? Response::make(View::make('backend::no_database'), 200)
                : $this->passToCmsController($url);
        }

        $controllerRequest = $this->getRequestedController($url);
        if (!is_null($controllerRequest)) {
            return $controllerRequest['controller']->run(
                $controllerRequest['action'],
                $controllerRequest['params']
            );
        }

        /*
         * Fall back on Cms controller
         */
        return $this->passToCmsController($url);
    }

    /**
     * Determines the controller and action to load in the backend via a provided URL.
     *
     * If a suitable controller is found, this will return an array with the controller class name as a string, the
     * action to call as a string and an array of parameters. If a suitable controller and action cannot be found,
     * this method will return null.
     *
     * @param string $url A URL to determine the requested controller and action for
     * @return array|null A suitable controller, action and parameters in an array if found, otherwise null.
     */
    protected function getRequestedController($url)
    {
        $params = RouterHelper::segmentizeUrl($url);

        /*
         * Look for a Module controller
         */
        $module = $params[0] ?? 'backend';
        $controller = $params[1] ?? 'index';
        self::$action = $action = isset($params[2]) ? $this->parseAction($params[2]) : 'index';
        self::$params = $controllerParams = array_slice($params, 3);
        $controllerClass = '\\'.$module.'\Controllers\\'.$controller;
        if ($controllerObj = $this->findController(
            $controllerClass,
            $action,
            base_path().'/modules'
        )) {
            return [
                'controller' => $controllerObj,
                'action' => $action,
                'params' => $controllerParams
            ];
        }

        /*
         * Look for a Plugin controller
         */
        if (count($params) >= 2) {
            list($author, $plugin) = $params;

            $pluginCode = ucfirst($author) . '.' . ucfirst($plugin);
            if (PluginManager::instance()->isDisabled($pluginCode)) {
                return Response::make(View::make('backend::404'), 404);
            }

            $controller = $params[2] ?? 'index';
            self::$action = $action = isset($params[3]) ? $this->parseAction($params[3]) : 'index';
            self::$params = $controllerParams = array_slice($params, 4);
            $controllerClass = '\\'.$author.'\\'.$plugin.'\Controllers\\'.$controller;
            if ($controllerObj = $this->findController(
                $controllerClass,
                $action,
                plugins_path()
            )) {
                return [
                    'controller' => $controllerObj,
                    'action' => $action,
                    'params' => $controllerParams
                ];
            }
        }

        return null;
    }

    /**
     * This method is used internally.
     * Finds a backend controller with a callable action method.
     * @param string $controller Specifies a method name to execute.
     * @param string $action Specifies a method name to execute.
     * @param string $inPath Base path for class file location.
     * @return ControllerBase Returns the backend controller object
     */
    protected function findController($controller, $action, $inPath)
    {
        if (isset($this->requestedController)) {
            return $this->requestedController;
        }

        /*
         * Workaround: Composer does not support case insensitivity.
         */
        if (!class_exists($controller)) {
            $controller = Str::normalizeClassName($controller);
            $controllerFile = $inPath.strtolower(str_replace('\\', '/', $controller)) . '.php';
            if ($controllerFile = File::existsInsensitive($controllerFile)) {
                include_once $controllerFile;
            }
        }

        if (!class_exists($controller)) {
            return $this->requestedController = null;
        }

        $controllerObj = App::make($controller);

        if ($controllerObj->actionExists($action)) {
            return $this->requestedController = $controllerObj;
        }

        return $this->requestedController = null;
    }

    /**
     * Process the action name, since dashes are not supported in PHP methods.
     * @param  string $actionName
     * @return string
     */
    protected function parseAction($actionName)
    {
        if (strpos($actionName, '-') !== false) {
            return camel_case($actionName);
        }

        return $actionName;
    }

    /**
     * Determine if the given options exclude a particular method.
     *
     * @param  string  $method
     * @param  array  $options
     * @return bool
     */
    protected static function methodExcludedByOptions($method, array $options)
    {
        return (isset($options['only']) && !in_array($method, (array) $options['only'])) ||
            (!empty($options['except']) && in_array($method, (array) $options['except']));
    }
}
