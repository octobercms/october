<?php namespace Backend\Classes;

use App;
use File;
use View;
use System;
use Response;
use Illuminate\Routing\Controller as ControllerBase;
use October\Rain\Router\Helper as RouterHelper;
use System\Classes\PluginManager;
use Closure;

/**
 * BackendController is the master controller for all back-end pages.
 * All requests that are prefixed with the backend URI pattern are sent here,
 * then the next URI segments are analyzed and the request is routed to the
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
     * __construct a new BackendController instance
     */
    public function __construct()
    {
        $this->extendableConstruct();
    }

    /**
     * extend this object properties upon construction
     */
    public static function extend(Closure $callback)
    {
        self::extendableExtendCallback($callback);
    }

    /**
     * run finds and serves the requested backend controller
     * If the controller cannot be found, returns the Cms page with the URL /404.
     * If the /404 page doesn't exist, returns the system 404 page.
     * @param string $url Specifies the requested page URL.
     * If the parameter is omitted, the current URL used.
     * @return string Returns the processed page content.
     */
    public function run($url = null)
    {
        $params = RouterHelper::segmentizeUrl($url);

        // Database check
        if (!App::hasDatabase()) {
            return System::checkDebugMode()
                ? Response::make(View::make('backend::no_database'), 200)
                : $this->runPageNotFound();
        }

        // Look for App or Module controller
        $module = $params[0] ?? 'backend';
        $controller = $params[1] ?? 'index';
        $isApp = strtolower($module) === 'app';
        $controllerClass = "{$module}\\Controllers\\{$controller}";
        $controllerBase = $isApp ? base_path() : base_path('modules');

        // Store the current context
        self::$action = $action = isset($params[2]) ? $this->parseAction($controllerClass, $params[2]) : 'index';
        self::$params = $controllerParams = array_slice($params, 3);

        if ($controllerObj = $this->findController(
            $controllerClass,
            $action,
            $controllerBase
        )) {
            if (!$isApp && !System::hasModule(ucfirst($module))) {
                return Response::make(View::make('backend::404'), 404);
            }

            return $controllerObj->run($action, $controllerParams);
        }

        // Look for Plugin controller using hint segment
        $hint = $params[0] ?? null;
        $namespace = PluginManager::instance()->getPluginHints()[$hint] ?? null;
        if ($namespace && str_contains($namespace, '.')) {
            [$author, $plugin] = explode('.', strtolower($namespace));
            $controller = $params[1] ?? 'index';
            $controllerClass = "{$author}\\{$plugin}\Controllers\\{$controller}";

            // Store the current context
            self::$action = $action = isset($params[2]) ? $this->parseAction($controllerClass, $params[2]) : 'index';
            self::$params = $controllerParams = array_slice($params, 3);

            if ($controllerObj = $this->findController(
                $controllerClass,
                $action,
                plugins_path()
            )) {
                return $controllerObj->run($action, $controllerParams);
            }
        }

        // Look for a Plugin controller
        if (count($params) >= 2) {
            [$author, $plugin] = $params;
            $controller = $params[2] ?? 'index';
            $controllerClass = "{$author}\\{$plugin}\Controllers\\{$controller}";

            // Store the current context
            self::$action = $action = isset($params[3]) ? $this->parseAction($controllerClass, $params[3]) : 'index';
            self::$params = $controllerParams = array_slice($params, 4);

            if ($controllerObj = $this->findController(
                $controllerClass,
                $action,
                plugins_path()
            )) {
                if (PluginManager::instance()->isDisabled(ucfirst($author).'.'.ucfirst($plugin))) {
                    return Response::make(View::make('backend::404'), 404);
                }

                return $controllerObj->run($action, $controllerParams);
            }
        }

        // Fall back to CMS controller
        return $this->runPageNotFound();
    }

    /**
     * runPageNotFound display a CMS 404 page, if one is available. For security reasons,
     * the backend 404 page is not used unless an admin session is found, this prevents
     * random discovery of the admin panel URL by crawlers or bots.
     */
    protected function runPageNotFound()
    {
        if (System::hasModule('Cms') && !\BackendAuth::getUser()) {
            return \Cms::pageNotFound();
        }

        return Response::make(View::make('backend::404'), 404);
    }

    /**
     * findController is used internally to find a backend controller with a
     * callable action method
     * @param string $controller Specifies a method name to execute.
     * @param string $action Specifies a method name to execute.
     * @param string $inPath Base path for class file location.
     * @return ControllerBase|false Returns the backend controller object
     */
    protected function findController($controller, $action, $inPath)
    {
        // Workaround: Composer does not support case insensitivity.
        if (!class_exists($controller)) {
            $controllerFile = $inPath.'/'.strtolower(str_replace('\\', '/', $controller)) . '.php';
            if (
                strpos($controllerFile, '..') !== false ||
                strpos($controllerFile, './') !== false ||
                strpos($controllerFile, '//') !== false
            ) {
                return false;
            }

            if ($controllerFile = File::existsInsensitive($controllerFile)) {
                include_once $controllerFile;
            }
        }

        if (!class_exists($controller)) {
            return false;
        }

        $controllerObj = App::make($controller);

        if ($controllerObj->actionExists($action)) {
            return $controllerObj;
        }

        return false;
    }

    /**
     * parseAction processes the action name, since dashes are not supported in PHP methods
     */
    protected function parseAction(string $controllerClass, string $actionName): string
    {
        if (strpos($actionName, '-') === false) {
            return $actionName;
        }

        if (is_a($controllerClass, \Backend\Classes\WildcardController::class, true)) {
            return $actionName;
        }

        return snake_case(camel_case($actionName));
    }
}
