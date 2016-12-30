<?php namespace Backend\Classes;

use App;
use Str;
use Lang;
use View;
use Flash;
use Config;
use Request;
use Backend;
use Session;
use Redirect;
use Response;
use Exception;
use BackendAuth;
use Backend\Models\UserPreference;
use Backend\Models\Preference as BackendPreference;
use Cms\Widgets\MediaManager;
use System\Classes\ErrorHandler;
use October\Rain\Exception\AjaxException;
use October\Rain\Exception\SystemException;
use October\Rain\Exception\ValidationException;
use October\Rain\Exception\ApplicationException;
use October\Rain\Extension\Extendable;
use Illuminate\Database\Eloquent\MassAssignmentException;
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
    use \System\Traits\ViewMaker;
    use \System\Traits\AssetMaker;
    use \System\Traits\ConfigMaker;
    use \System\Traits\EventEmitter;
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
     * @var string Page title template
     */
    public $pageTitleTemplate;

    /**
     * @var string Body class property used for customising the layout on a controller basis.
     */
    public $bodyClass;

    /**
     * @var array Default methods which cannot be called as actions.
     */
    public $hiddenActions = [
        'run',
        'actionExists',
        'pageAction',
        'getId',
        'setStatusCode',
        'handleError',
        'makeHintPartial'
    ];

    /**
     * @var array Controller specified methods which cannot be called as actions.
     */
    protected $guarded = [];

    /**
     * @var int Response status code
     */
    protected $statusCode = 200;

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
        $this->layout = $this->layout ?: 'default';
        $this->layoutPath = Skin::getActive()->getLayoutPaths();
        $this->viewPath = $this->configPath = $this->guessViewPath();

        /*
         * Add layout paths from the plugin / module context
         */
        $relativePath = dirname(dirname(strtolower(str_replace('\\', '/', get_called_class()))));
        $this->layoutPath[] = '~/modules/' . $relativePath . '/layouts';
        $this->layoutPath[] = '~/plugins/' . $relativePath . '/layouts';

        parent::__construct();

        /*
         * Media Manager widget is available on all back-end pages
         */
        $manager = new MediaManager($this, 'ocmediamanager');
        $manager->bindToController();
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
         * Check security token.
         */
        if (!$this->verifyCsrfToken()) {
            return Response::make(Lang::get('backend::lang.page.invalid_token.label'), 403);
        }

        /*
         * Check forced HTTPS protocol.
         */
        if (!$this->verifyForceSecure()) {
            return Redirect::secure(Request::path());
        }

        /*
         * Extensibility
         */
        if ($event = $this->fireSystemEvent('backend.page.beforeDisplay', [$action, $params])) {
            return $event;
        }

        /*
         * Determine if this request is a public action.
         */
        $isPublicAction = in_array($action, $this->publicActions);

        // Create a new instance of the admin user
        $this->user = BackendAuth::getUser();

        /*
         * Check that user is logged in and has permission to view this page
         */
        if (!$isPublicAction) {

            /*
             * Not logged in, redirect to login screen or show ajax error.
             */
            if (!BackendAuth::check()) {
                return Request::ajax()
                    ? Response::make(Lang::get('backend::lang.page.access_denied.label'), 403)
                    : Backend::redirectGuest('backend/auth');
            }

            /*
             * Check access groups against the page definition
             */
            if ($this->requiredPermissions && !$this->user->hasAnyAccess($this->requiredPermissions)) {
                return Response::make(View::make('backend::access_denied'), 403);
            }
        }

        /*
         * Set the admin preference locale
         */
        BackendPreference::setAppLocale();
        BackendPreference::setAppFallbackLocale();

        /*
         * Execute AJAX event
         */
        if ($ajaxResponse = $this->execAjaxHandlers()) {
            return $ajaxResponse;
        }

        /*
         * Execute postback handler
         */
        if (
            ($handler = post('_handler')) &&
            ($handlerResponse = $this->runAjaxHandler($handler)) &&
            $handlerResponse !== true
        ) {
            return $handlerResponse;
        }

        /*
         * Execute page action
         */
        $result = $this->execPageAction($action, $params);

        if (!is_string($result)) {
            return $result;
        }

        return Response::make($result, $this->statusCode);
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
        if (!strlen($name) || substr($name, 0, 1) == '_' || !$this->methodExists($name)) {
            return false;
        }

        foreach ($this->hiddenActions as $method) {
            if (strtolower($name) == strtolower($method)) {
                return false;
            }
        }

        $ownMethod = method_exists($this, $name);

        if ($ownMethod) {
            $methodInfo = new \ReflectionMethod($this, $name);
            $public = $methodInfo->isPublic();
            if ($public) {
                return true;
            }
        }

        if ($internal && (($ownMethod && $methodInfo->isProtected()) || !$ownMethod)) {
            return true;
        }

        if (!$ownMethod) {
            return true;
        }

        return false;
    }

    /**
     * Returns a URL for this controller and supplied action.
     */
    public function actionUrl($action = null, $path = null)
    {
        if ($action === null) {
            $action = $this->action;
        }

        $class = get_called_class();
        $uriPath = dirname(dirname(strtolower(str_replace('\\', '/', $class))));
        $controllerName = strtolower(class_basename($class));

        $url = $uriPath.'/'.$controllerName.'/'.$action;
        if ($path) {
            $url .= '/'.$path;
        }

        return Backend::url($url);
    }

    /**
     * Invokes the current controller action without rendering a view,
     * used by AJAX handler that may rely on the logic inside the action.
     */
    public function pageAction()
    {
        if (!$this->action) {
            return;
        }

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

        if (!$this->actionExists($actionName)) {
            throw new SystemException(sprintf(
                "Action %s is not found in the controller %s",
                $actionName,
                get_class($this)
            ));
        }

        // Execute the action
        $result = call_user_func_array([$this, $actionName], $parameters);

        // Expecting \Response and \RedirectResponse
        if ($result instanceof \Symfony\Component\HttpFoundation\Response) {
            return $result;
        }

        // No page title
        if (!$this->pageTitle) {
            $this->pageTitle = 'backend::lang.page.untitled';
        }

        // Load the view
        if (!$this->suppressView && is_null($result)) {
            return $this->makeView($actionName);
        }

        return $this->makeViewContent($result);
    }

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
     * This method is used internally.
     * Invokes a controller event handler and loads the supplied partials.
     */
    protected function execAjaxHandlers()
    {

        if ($handler = $this->getAjaxHandler()) {
            try {
                /*
                 * Validate the handler name
                 */
                if (!preg_match('/^(?:\w+\:{2})?on[A-Z]{1}[\w+]*$/', $handler)) {
                    throw new SystemException(Lang::get('cms::lang.ajax_handler.invalid_name', ['name'=>$handler]));
                }

                /*
                 * Validate the handler partial list
                 */
                if ($partialList = trim(Request::header('X_OCTOBER_REQUEST_PARTIALS'))) {
                    $partialList = explode('&', $partialList);
                }
                else {
                    $partialList = [];
                }

                $responseContents = [];

                /*
                 * Execute the handler
                 */
                if (!$result = $this->runAjaxHandler($handler)) {
                    throw new ApplicationException(Lang::get('cms::lang.ajax_handler.not_found', ['name'=>$handler]));
                }

                /*
                 * Render partials and return the response as array that will be converted to JSON automatically.
                 */
                foreach ($partialList as $partial) {
                    $responseContents[$partial] = $this->makePartial($partial);
                }

                /*
                 * If the handler returned a redirect, process the URL and dispose of it so
                 * framework.js knows to redirect the browser and not the request!
                 */
                if ($result instanceof RedirectResponse) {
                    $responseContents['X_OCTOBER_REDIRECT'] = $result->getTargetUrl();
                    $result = null;
                }
                /*
                 * No redirect is used, look for any flash messages
                 */
                elseif (Flash::check()) {
                    $responseContents['#layout-flash-messages'] = $this->makeLayoutPartial('flash_messages');
                }

                /*
                 * Detect assets
                 */
                if ($this->hasAssetsDefined()) {
                    $responseContents['X_OCTOBER_ASSETS'] = $this->getAssetPaths();
                }

                /*
                 * If the handler returned an array, we should add it to output for rendering.
                 * If it is a string, add it to the array with the key "result".
                 * If an object, pass it to Laravel as a response object.
                 */
                if (is_array($result)) {
                    $responseContents = array_merge($responseContents, $result);
                }
                elseif (is_string($result)) {
                    $responseContents['result'] = $result;
                }
                elseif (is_object($result)) {
                    return $result;
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
                throw new AjaxException($responseContents);
            }
            catch (MassAssignmentException $ex) {
                throw new ApplicationException(Lang::get('backend::lang.model.mass_assignment_failed', ['attribute' => $ex->getMessage()]));
            }
            catch (Exception $ex) {
                throw $ex;
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

            if ($this->fatalError) {
                throw new SystemException($this->fatalError);
            }

            if (!isset($this->widget->{$widgetName})) {
                throw new SystemException(Lang::get('backend::lang.widget.not_bound', ['name'=>$widgetName]));
            }

            if (($widget = $this->widget->{$widgetName}) && $widget->methodExists($handlerName)) {
                $result = $this->runAjaxHandlerForWidget($widget, $handlerName);
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

            foreach ((array) $this->widget as $widget) {
                if ($widget->methodExists($handler)) {
                    $result = $this->runAjaxHandlerForWidget($widget, $handler);
                    return ($result) ?: true;
                }
            }
        }

        return false;
    }

    /**
     * Specific code for executing an AJAX handler for a widget.
     * This will append the widget view paths to the controller and merge the vars.
     * @return mixed
     */
    protected function runAjaxHandlerForWidget($widget, $handler)
    {
        $this->addViewPath($widget->getViewPaths());

        $result = call_user_func_array([$widget, $handler], $this->params);

        $this->vars = $widget->vars + $this->vars;

        return $result;
    }

    /**
     * Returns the controllers public actions.
     */
    public function getPublicActions()
    {
        return $this->publicActions;
    }

    /**
     * Returns a unique ID for the controller and route. Useful in creating HTML markup.
     */
    public function getId($suffix = null)
    {
        $id = class_basename(get_called_class()) . '-' . $this->action;
        if ($suffix !== null) {
            $id .= '-' . $suffix;
        }

        return $id;
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
     * Sets standard page variables in the case of a controller error.
     */
    public function handleError($exception)
    {
        $errorMessage = ErrorHandler::getDetailedMessage($exception);
        $this->fatalError = $errorMessage;
        $this->vars['fatalError'] = $errorMessage;
    }

    //
    // Hints
    //

    /**
     * Renders a hint partial, used for displaying informative information that
     * can be hidden by the user. If you don't want to render a partial, you can
     * supply content via the 'content' key of $params.
     * @param  string $name    Unique key name
     * @param  string $partial Reference to content (partial name)
     * @param  array  $params  Extra parameters
     * @return string
     */
    public function makeHintPartial($name, $partial = null, $params = [])
    {
        if (is_array($partial)) {
            $params = $partial;
            $partial = null;
        }

        if (!$partial) {
            $partial = array_get($params, 'partial', $name);
        }

        return $this->makeLayoutPartial('hint', [
            'hintName'    => $name,
            'hintPartial' => $partial,
            'hintContent' => array_get($params, 'content'),
            'hintParams'  => $params
        ] + $params);
    }

    /**
     * Ajax handler to hide a backend hint, once hidden the partial
     * will no longer display for the user.
     * @return void
     */
    public function onHideBackendHint()
    {
        if (!$name = post('name')) {
            throw new ApplicationException('Missing a hint name.');
        }

        $preferences = UserPreference::forUser();
        $hiddenHints = $preferences->get('backend::hints.hidden', []);
        $hiddenHints[$name] = 1;

        $preferences->set('backend::hints.hidden', $hiddenHints);
    }

    /**
     * Checks if a hint has been hidden by the user.
     * @param  string $name Unique key name
     * @return boolean
     */
    public function isBackendHintHidden($name)
    {
        $hiddenHints = UserPreference::forUser()->get('backend::hints.hidden', []);
        return array_key_exists($name, $hiddenHints);
    }

    //
    // Security
    //

    /**
     * Checks the request data / headers for a valid CSRF token.
     * Returns false if a valid token is not found. Override this
     * method to disable the check.
     * @return bool
     */
    protected function verifyCsrfToken()
    {
        if (!Config::get('cms.enableCsrfProtection')) {
            return true;
        }

        if (in_array(Request::method(), ['HEAD', 'GET', 'OPTIONS'])) {
            return true;
        }

        $token = Request::input('_token') ?: Request::header('X-CSRF-TOKEN');

        return Str::equals(
            Session::getToken(),
            $token
        );
    }

    /**
     * Checks if the back-end should force a secure protocol (HTTPS) enabled by config.
     * @return bool
     */
    protected function verifyForceSecure()
    {
        if (Request::secure() || Request::ajax()) {
            return true;
        }

        // @todo if year >= 2018 change default from false to null
        $forceSecure = Config::get('cms.backendForceSecure', false);
        if ($forceSecure === null) {
            $forceSecure = !Config::get('app.debug', false);
        }

        return !$forceSecure;
    }
}
