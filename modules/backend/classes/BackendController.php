<?php namespace Backend\Classes;

use Str;
use App;
use File;
use Config;
use Illuminate\Routing\Controller as ControllerBase;
use October\Rain\Router\Helper as RouterHelper;
use Closure;

/**
 * The Backend controller class.
 * The base controller services back end pages.
 *
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
     * Instantiate a new BackendController instance.
     */
    public function __construct()
    {
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

        /*
         * Look for a Module controller
         */
        $module = isset($params[0]) ? $params[0] : 'backend';
        $controller = isset($params[1]) ? $params[1] : 'index';
        self::$action = $action = isset($params[2]) ? $this->parseAction($params[2]) : 'index';
        self::$params = $controllerParams = array_slice($params, 3);
        $controllerClass = '\\'.$module.'\Controllers\\'.$controller;
        if ($controllerObj = $this->findController(
            $controllerClass,
            $action,
            base_path().'/modules'
        )) {
            return $controllerObj->run($action, $controllerParams);
        }

        /*
         * Look for a Plugin controller
         */
        if (count($params) >= 2) {
            list($author, $plugin) = $params;
            $controller = isset($params[2]) ? $params[2] : 'index';
            self::$action = $action = isset($params[3]) ? $this->parseAction($params[3]) : 'index';
            self::$params = $controllerParams = array_slice($params, 4);
            $controllerClass = '\\'.$author.'\\'.$plugin.'\Controllers\\'.$controller;
            if ($controllerObj = $this->findController(
                $controllerClass,
                $action,
                plugins_path()
            )) {
                return $controllerObj->run($action, $controllerParams);
            }
        }

        /*
         * Fall back on Cms controller
         */
        return App::make('Cms\Classes\Controller')->run($url);
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
        /*
         * Workaround: Composer does not support case insensitivity.
         */
        if (!class_exists($controller)) {
            $controller = Str::normalizeClassName($controller);
            $controllerFile = $inPath.strtolower(str_replace('\\', '/', $controller)) . '.php';
            if ($controllerFile = File::existsInsensitive($controllerFile)) {
                include_once($controllerFile);
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
}
