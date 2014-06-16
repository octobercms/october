<?php namespace Backend\Classes;

use Str;
use Log;
use Lang;
use Flash;
use Request;
use Backend;
use Redirect;
use Response;
use Exception;
use BackendAuth;
use System\Classes\SystemException;
use October\Rain\Extension\Extendable;
use October\Rain\Support\ValidationException;
use Illuminate\Http\RedirectResponse;

/**
 * The Backend base controller class, used by Backend controllers.
 * The base controller services back end pages.
 *
 * @package october\backend
 * @author Alexey Bobkov, Samuel Georges
 */
class Controller extends Extendable
{
    use \System\Traits\AssetMaker;
    use \System\Traits\ConfigMaker;
    use \Backend\Traits\ViewMaker;
    use \Backend\Traits\WidgetMaker;

    /**
     * @var string Object used for storing a fatal error.
     */
    protected $fatalError;

    /**
     * @var object Reference the logged in admin user.
     */
    protected $user;

    /**
     * @var array Collection of WidgetBase objects used on this page.
     */
    public $widget;

    /**
     * @var bool Prevents the automatic view display.
     */
    public $suppressView = false;

    /**
     * @var array Routed parameters.
     */
    protected $params;

    /**
     * @var string Page action being called.
     */
    protected $action;

    /**
     * @var array Defines a collection of actions available without authentication.
     */
    protected $publicActions = [];

    /**
     * @var array Permissions required to view this page.
     */
    protected $requiredPermissions = [];

    /**
     * @var string Page title
     */
    public $pageTitle;

    /**
     * @var string Body class property used for customising the layout on a controller basis.
     */
    public $bodyClass;

    /**
     * @var array Default methods which cannot be called as actions.
     */
    public $hiddenActions = ['run', 'actionExists', 'pageAction', 'getId', 'handleError'];

    /**
     * @var array Controller specified methods which cannot be called as actions.
     */
    protected $guarded = [];

    /**
     * Constructor.
     */
    public function __construct()
    {
        /*
         * Allow early access to route data.
         */
        $this->action = BackendController::$action;
        $this->params = BackendController::$params;

        /*
         * Apply $guarded methods to hidden actions
         */
        $this->hiddenActions = array_merge($this->hiddenActions, $this->guarded);

        /*
         * Define layout and view paths
         */
        $this->layout = 'default';
        $this->layoutPath = ['modules/backend/layouts'];

        // Option A: (@todo Determine which is faster by benchmark)
        // $relativePath = strtolower(str_replace('\\', '/', get_called_class()));
        // $this->viewPath = $this->configPath = ['modules/' . $relativePath, 'plugins/' . $relativePath];

        // Option B:
        $this->viewPath = $this->configPath = $this->guessViewPath();

        parent::__construct();
    }

    /**
     * Execute the controller action.
     * @param string $action The action name.
     * @param array $params Routing parameters to pass to the action.
     * @return mixed The action result.
     */
    public function run($action = null, $params = [])
    {
        $this->action = $action;
        $this->params = $params;

        /*
         * Determine if this request is a public action.
         */
        $isPublicAction = in_array($action, $this->publicActions);

        /*
         * Check that user is logged in and has permission to view this page
         */
        if (!$isPublicAction) {

            // Not logged in, redirect to login screen or show ajax error
            if (!BackendAuth::check()) {
                return Request::ajax()
                    ? Response::make('Access Forbidden', '403')
                    : Redirect::guest(Backend::url('backend/auth'));
            }

            // Create a new instance of the admin user
            $this->user = BackendAuth::getUser();

            // Check his access groups against the page definition
            if ($this->requiredPermissions && !$this->user->hasAnyAccess($this->requiredPermissions))
                return Response::make('Access Forbidden', '403');
        }

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
         * Execute page action
         */
        return $this->execPageAction($action, $params);
    }

    /**
     * This method is used internally.
     * Determines whether an action with the specified name exists.
     * Action must be a class public method. Action name can not be prefixed with the underscore character.
     * @param string $name Specifies the action name.
     * @param bool $internal Allow protected actions.
     * @return boolean
     */
    public function actionExists($name, $internal = false)
    {
        if (!strlen($name) || substr($name, 0, 1) == '_' || !$this->methodExists($name))
            return false;

        foreach ($this->hiddenActions as $method) {
            if (strtolower($name) == strtolower($method))
                return false;
        }

        $ownMethod = method_exists($this, $name);

        if ($ownMethod) {
            $methodInfo = new \ReflectionMethod($this, $name);
            $public = $methodInfo->isPublic();
            if ($public)
                return true;
        }

        if ($internal && (($ownMethod && $methodInfo->isProtected()) || !$ownMethod))
            return true;

        if (!$ownMethod)
            return true;

        return false;
    }

    /**
     * Invokes the current controller action without rendering a view,
     * used by AJAX handler who may rely on the logic inside the action.
     */
    public function pageAction()
    {
        if (!$this->action)
            return;

        $this->suppressView = true;
        $this->execPageAction($this->action, $this->params);
    }

    /**
     * This method is used internally.
     * Invokes the controller action and loads the corresponding view.
     * @param string $actionName Specifies a action name to execute.
     * @param array $parameters A list of the action parameters.
     */
    protected function execPageAction($actionName, $parameters)
    {
        $result = null;

        if (!$this->actionExists($actionName))
            throw new SystemException(sprintf("Action %s is not found in the controller %s", $actionName, get_class($this)));

        // Execute the action
        $result = call_user_func_array([$this, $actionName], $parameters);

        if ($result instanceof RedirectResponse)
            return $result;

        // Translate the page title
        $this->pageTitle = $this->pageTitle
            ? Lang::get($this->pageTitle)
            : Lang::get('backend::lang.page.untitled');

        // Load the view
        if (!$this->suppressView && is_null($result))
            return $this->makeView($actionName);

        return $this->makeViewContent($result);
    }

    /**
     * This method is used internally.
     * Invokes a controller event handler and loads the supplied partials.
     */
    protected function execAjaxHandlers()
    {
        if ($handler = trim(Request::header('X_OCTOBER_REQUEST_HANDLER'))) {
            try {
                /*
                 * Validate the handler name
                 */
                if (!preg_match('/^(?:\w+\:{2})?on[A-Z]{1}[\w+]*$/', $handler))
                    throw new SystemException(Lang::get('cms::lang.ajax_handler.invalid_name', ['name'=>$handler]));

                /*
                 * Validate the handler partial list
                 */
                if ($partialList = trim(Request::header('X_OCTOBER_REQUEST_PARTIALS'))) {
                    $partialList = explode('&', $partialList);

                    // @todo Do we need to validate backend partials?
                    // foreach ($partialList as $partial) {
                    //     if (!CmsFileHelper::validateName($partial))
                    //         throw new SystemException(Lang::get('cms::lang.partial.invalid_name', ['name'=>$partial]));
                    // }
                }
                else {
                    $partialList = [];
                }

                $responseContents = [];

                /*
                 * Execute the handler
                 */
                if (!$result = $this->runAjaxHandler($handler))
                    throw new SystemException(Lang::get('cms::lang.ajax_handler.not_found', ['name'=>$handler]));

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
                    $responseContents[$partial] = $this->makePartial($partial);

                /*
                 * If the handler returned a redirect, process it so framework.js knows to redirect
                 * the browser and not the request!
                 */
                if ($result instanceof RedirectResponse) {
                    $responseContents['X_OCTOBER_REDIRECT'] = $result->getTargetUrl();
                }
                /*
                 * No redirect is used, look for any flash messages
                 */
                else if (Flash::check()) {
                    $responseContents['#layout-flash-messages'] = $this->makeLayoutPartial('flash_messages');
                }

                /*
                 * Detect assets
                 */
                if ($this->hasAssetsDefined()) {
                    $responseContents['X_OCTOBER_ASSETS'] = $this->getAssetPaths();
                }

                return Response::make()->setContent($responseContents);
            }
            catch (ValidationException $ex) {
                /*
                 * Handle validation error gracefully
                 */
                Flash::error($ex->getMessage());
                $responseContents = [];
                $responseContents['#layout-flash-messages'] = $this->makeLayoutPartial('flash_messages');
                $responseContents['X_OCTOBER_ERROR_FIELDS'] = $ex->getFields();
                return Response::make($responseContents, 406);
            }
            catch (Exception $ex) {
                Log::error($ex);
                return Response::make($ex->getMessage(), 500);
            }
        }

        return null;
    }

    /**
     * Tries to find and run an AJAX handler in the page action.
     * The method stops as soon as the handler is found.
     * @return boolean Returns true if the handler was found. Returns false otherwise.
     */
    protected function runAjaxHandler($handler)
    {
        /*
         * Process Widget handler
         */
        if (strpos($handler, '::')) {
            list($widgetName, $handlerName) = explode('::', $handler);

            /*
             * Execute the page action so widgets are initialized
             */
            $this->pageAction();

            if (!isset($this->widget->{$widgetName}))
                throw new SystemException(Lang::get('backend::lang.widget.not_bound', ['name'=>$widgetName]));

            if (($widget = $this->widget->{$widgetName}) && method_exists($widget, $handlerName)) {
                $result = call_user_func_array([$widget, $handlerName], $this->params);
                return ($result) ?: true;
            }
        }
        else {
            /*
             * Process page specific handler (index_onSomething)
             */
            $pageHandler = $this->action . '_' . $handler;

            if ($this->methodExists($pageHandler)) {
                $result = call_user_func_array([$this, $pageHandler], $this->params);
                return ($result) ?: true;
            }

            /*
             * Process page global handler (onSomething)
             */
            if ($this->methodExists($handler)) {
                $result = call_user_func_array([$this, $handler], $this->params);
                return ($result) ?: true;
            }

            /*
             * Cycle each widget to locate a usable handler (widget::onSomething)
             */
            $this->suppressView = true;
            $this->execPageAction($this->action, $this->params);

            foreach ($this->widget as $widget) {
                if (method_exists($widget, $handler)) {
                    $result = call_user_func_array([$widget, $handler], $this->params);
                    return ($result) ?: true;
                }
            }
        }

        return false;
    }

    /**
     * Returns a unique ID for the controller and route. Useful in creating HTML markup.
     */
    public function getId($suffix = null)
    {
        $id = Str::getRealClass(get_called_class()) . '-' . $this->action;
        if ($suffix !== null)
            $id .= '-' . $suffix;

        return $id;
    }

    /**
     * Sets standard page variables in the case of a controller error.
     */
    public function handleError($exception)
    {
        $this->fatalError = $exception->getMessage();
        $this->vars['fatalError'] = $exception->getMessage();
    }
}