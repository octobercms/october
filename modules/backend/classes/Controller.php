<?php namespace Backend\Classes;

use Site;
use Lang;
use View;
use Flash;
use Config;
use System;
use Request;
use Backend;
use Redirect;
use Response;
use BackendAuth;
use Backend\Models\UserPreference;
use Backend\Models\Preference as BackendPreference;
use October\Rain\Exception\SystemException;
use October\Rain\Exception\ValidationException;
use October\Rain\Exception\ApplicationException;
use October\Rain\Extension\Extendable;
use Illuminate\Database\Eloquent\MassAssignmentException;
use Larajax\Exceptions\ComponentNotFound;
use Larajax\Exceptions\HandlerNameInvalid;
use Larajax\Exceptions\HandlerNotFound;
use Larajax\Contracts\AjaxControllerInterface;
use ForbiddenException;
use Throwable;

/**
 * Controller is a backend base controller class used by all Backend controllers
 *
 * @package october\backend
 * @author Alexey Bobkov, Samuel Georges
 */
class Controller extends Extendable implements AjaxControllerInterface
{
    use \System\Traits\ViewMaker;
    use \System\Traits\AssetMaker;
    use \System\Traits\ConfigMaker;
    use \System\Traits\EventEmitter;
    use \System\Traits\ResponseMaker;
    use \System\Traits\DependencyMaker;
    use \System\Traits\SecurityController;
    use \Backend\Traits\VueMaker;
    use \Backend\Traits\ErrorMaker;
    use \Backend\Traits\WidgetMaker;
    use \Larajax\Traits\AjaxController;

    /**
     * @var object user reference to administrator.
     */
    protected $user;

    /**
     * @var \Larajax\Classes\ComponentContainer widget is a collection of WidgetBase classes used on this page.
     */
    public $widget;

    /**
     * @var bool suppressView prevents the automatic view display.
     */
    public $suppressView = false;

    /**
     * @var array params used by the router.
     */
    protected $params;

    /**
     * @var string action being called in the page
     */
    protected $action;

    /**
     * @var string actionView to render, defaults to action name
     */
    protected $actionView;

    /**
     * @var array publicActions available without authentication.
     */
    protected $publicActions = [];

    /**
     * @var array requiredPermissions to view this page.
     */
    protected $requiredPermissions = [];

    /**
     * @var string pageTitle
     */
    public $pageTitle;

    /**
     * @var mixed pageSize defines the maximum page size
     */
    public $pageSize;

    /**
     * @var string pageTitleTemplate
     */
    public $pageTitleTemplate;

    /**
     * @var string bodyClass property used for customizing the layout on a controller basis.
     */
    public $bodyClass;

    /**
     * @var mixed turboRouter for the AJAX framework. Supported values:
     * - true: enables turbo (outputs visit-control=enable)
     * - false: disables turbo (no turbo meta tags)
     * - string: shorthand for visit-control value, e.g. 'reload', 'disable'
     * - array: each key maps to a turbo-{key} meta tag, e.g. ['visit-control' => 'reload']
     */
    public $turboRouter;

    /**
     * @deprecated use $turboRouter instead
     */
    public $turboVisitControl;

    /**
     * @var array hiddenActions are methods that cannot be called as actions.
     */
    public $hiddenActions = [
        'run'
    ];

    /**
     * @var array guarded methods that cannot be called as actions.
     */
    protected $guarded = [];

    /**
     * __construct the controller.
     */
    public function __construct()
    {
        if (!is_array($this->implement)) {
            $this->implement = [];
        }

        // Establish component container
        $this->widget = $this->componentContainer = new \Larajax\Classes\ComponentContainer($this);

        // Allow early access to route data.
        $this->action = BackendController::$action;
        $this->params = BackendController::$params;

        // Apply $guarded methods to hidden actions
        $this->hiddenActions = array_merge($this->hiddenActions, $this->guarded);

        // Define layout and view paths
        $this->layout = $this->layout ?: 'default';
        $this->layoutPath = Skin::getActive()->getLayoutPaths();
        $this->viewPath = $this->configPath = $this->guessViewPath();

        // Add layout paths from the plugin / module context
        $relativePath = dirname(dirname(strtolower(str_replace('\\', '/', get_called_class()))));
        $this->layoutPath[] = "~/modules/{$relativePath}/layouts";
        $this->layoutPath[] = "~/plugins/{$relativePath}/layouts";

        // Enable turbo router
        if (Config::get('backend.turbo_router', false)) {
            $this->turboRouter ??= true;
        }

        // Create a new instance of the admin user
        $this->user = BackendAuth::getUser();

        // Site switcher
        if ($this->user && Site::hasAnyEditSite()) {
            (new \Backend\Widgets\SiteSwitcher($this))->bindToController();
        }

        // Impersonate backend role
        if ($this->user && BackendAuth::isRoleImpersonator()) {
            (new \Backend\Widgets\RoleImpersonator($this))->bindToController();
        }

        // Boot behavior constructors
        parent::__construct();
    }

    /**
     * beforeDisplay is a method to override in your controller as a way to execute logic before
     * each action executes. It is preferred over placing logic in the constructor
     */
    public function beforeDisplay()
    {
    }

    /**
     * run executes the controller action
     * @param string $action The action name.
     * @param array $params Routing parameters to pass to the action.
     * @return mixed The action result.
     */
    public function run($action = null, $params = [])
    {
        $this->action = $action;
        $this->params = $params;

        // Check security token.
        // @see \System\Traits\SecurityController
        if (!$this->verifyCsrfToken()) {
            return Request::ajax()
                ? ajax()->error('', 403)->browserEvent('backend:token-mismatch', [
                        'message' => Lang::get('system::lang.page.invalid_token.label')
                    ])
                : Backend::redirectGuest('backend/auth');
        }

        // Check forced HTTPS protocol.
        // @see \System\Traits\SecurityController
        if (!$this->verifyForceSecure()) {
            return Redirect::secure(Request::path());
        }

        // Check that user is logged in and has permission to view this page
        if (!$this->isPublicAction($action)) {
            // Not logged in, redirect to login screen or show ajax error.
            if (!BackendAuth::check()) {
                return Request::ajax()
                    ? ajax()->error(Lang::get('backend::lang.page.access_denied.label'), 403)
                    : Backend::redirectGuest('backend/auth');
            }

            // Check general permission to backend
            if (!BackendAuth::userHasAccess('general.backend')) {
                throw new ForbiddenException;
            }

            // Check access groups against the page definition
            if ($this->requiredPermissions && !$this->user->hasAnyAccess($this->requiredPermissions)) {
                throw new ForbiddenException;
            }

            if (System::hasModule('Cms') && \Cms\Models\MaintenanceSetting::isEnabledForBackend()) {
                return View::make('backend::in_maintenance');
            }

            if ($this->user->hasPasswordExpired() && !$this instanceof \Backend\Controllers\AuthGates) {
                return Backend::redirect('backend/authgates/expired');
            }
        }

        // Logic hook for all actions
        if ($hook = $this->beforeDisplay()) {
            return $hook;
        }

        /**
         * @event backend.page.beforeDisplay
         * Provides an opportunity to override backend page content
         *
         * Example usage:
         *
         *     Event::listen('backend.page.beforeDisplay', function ((\Backend\Classes\Controller) $backendController, (string) $action, (array) $params) {
         *         traceLog('redirect all backend pages to google');
         *         return Redirect::to('https://google.com');
         *     });
         *
         * Or
         *
         *     $backendController->bindEvent('page.beforeDisplay', function ((string) $action, (array) $params) {
         *         traceLog('redirect all backend pages to google');
         *         return Redirect::to('https://google.com');
         *     });
         *
         */
        if ($event = $this->fireSystemEvent('backend.page.beforeDisplay', [$action, $params])) {
            return $event;
        }

        // Register Vue components used on every page
        $this->registerVueComponent(\Backend\VueComponents\Modal::class);

        // Set the admin preference locale
        BackendPreference::setAppLocale();
        BackendPreference::setAppFallbackLocale();

        // Execute page action or AJAX event
        if ($ajaxResponse = $this->execAjaxHandlers()) {
            $result = $ajaxResponse;
        }
        else {
            $result = $this->execPageAction($action, $params);
        }

        // Prepare and return response
        // @see \System\Traits\ResponseMaker
        return $this->makeResponse($result);
    }

    /**
     * actionExists is used internally to determines whether an action with the specified name exists.
     *
     * - Action must be a class public method.
     * - Action name can not be prefixed with the underscore character.
     * - Action name must be lowercase.
     * - Action must not appear in hiddenActions.
     *
     * @param string $name Specifies the action name.
     * @param bool $internal Allow protected actions.
     * @return bool
     */
    public function actionExists($name, $internal = false)
    {
        // Must have length, not start with underscore and actually exist
        if (!strlen($name) || substr($name, 0, 1) === '_' || !$this->methodExists($name)) {
            return false;
        }

        // Only allow lowercase actions
        if (strtolower($name) !== $name) {
            return false;
        }

        // Checks hidden actions
        foreach ($this->hiddenActions as $method) {
            if (strtolower($name) === strtolower($method)) {
                return false;
            }
        }

        // Internal method check
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
     * actionUrl returns a URL for this controller and supplied action.
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
     * pageAction invokes the current controller action without rendering a view.
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
            if (System::checkDebugMode()) {
                throw new SystemException(sprintf(
                    "Action %s is not found in the controller %s",
                    $actionName,
                    get_class($this)
                ));
            }
            else {
                Response::make(View::make('backend::404'), 404);
            }
        }

        // Execute the action
        $result = $this->makeCallMethod($this, $actionName, $parameters);

        // Expecting \Response and \RedirectResponse
        if ($result instanceof \Symfony\Component\HttpFoundation\Response) {
            return $result;
        }

        // No page title
        if (!$this->pageTitle) {
            $this->pageTitle = Lang::get('backend::lang.page.untitled');
        }

        // Load the view
        if (!$this->suppressView && $result === null) {
            return $this->makeView($this->actionView ?: $actionName);
        }

        return $this->makeViewContent($result);
    }

    /**
     * onAjax generic handler
     */
    public function onAjax()
    {
    }

    /**
     * getAjaxHandler returns the AJAX handler for the current request, if available.
     * @return string
     */
    public function getAjaxHandler()
    {
        $request = $this->getAjaxRequest();

        if ($request->hasAjaxHandler()) {
            return $request->qualifiedHandler;
        }

        return null;
    }

    /**
     * makePartialForAjax proxies to makePartial
     * @see \Larajax\Traits\AjaxController
     */
    protected function makePartialForAjax($partial)
    {
        if (!preg_match('/^(?!.*\/\/)[a-z0-9\_][a-z0-9\_\-\/]*$/i', $partial)) {
            throw new ApplicationException(Lang::get('backend::lang.partial.invalid_name', ['name'=>e($partial)]));
        }

        return $this->makePartial($partial);
    }

    /**
     * makeCallForAjax proxies to makeCallMethod
     * @see \Larajax\Traits\AjaxController
     */
    protected function makeCallForAjax($callable, $parameters)
    {
        [$instance, $method] = $callable;

        if ($instance instanceof \Backend\Classes\WidgetBase) {
            $this->addViewPath($instance->getViewPaths());

            $result = $this->makeCallMethod($instance, $method, $parameters);

            $this->vars = $instance->vars + $this->vars;

            return $result;
        }

        return $this->makeCallMethod($instance, $method, $parameters);
    }

    /**
     * execAjaxHandlers is used internally and invokes a controller event handler and
     * loads the supplied partials.
     */
    protected function execAjaxHandlers()
    {
        $handler = $this->getAjaxHandler();
        if (!$handler) {
            return null;
        }

        try {
            try {
                // Execute the page action so behaviors and widgets are initialized
                $this->pageAction();

                if ($this->fatalError) {
                    throw new ApplicationException($this->fatalError);
                }

                /**
                 * @event backend.ajax.beforeRunHandler
                 * Provides an opportunity to modify an AJAX request
                 *
                 * The parameter provided is `$handler` (the requested AJAX handler to be run)
                 *
                 * Example usage (forwards AJAX handlers to a backend widget):
                 *
                 *     Event::listen('backend.ajax.beforeRunHandler', function ((\Backend\Classes\Controller) $controller, (string) $handler) {
                 *         if (strpos($handler, '::')) {
                 *             [$componentAlias, $handlerName] = explode('::', $handler);
                 *             if ($componentAlias === $this->getBackendWidgetAlias()) {
                 *                 return $this->backendControllerProxy->runAjaxHandler($handler);
                 *             }
                 *         }
                 *     });
                 *
                 * Or
                 *
                 *     $this->controller->bindEvent('ajax.beforeRunHandler', function ((string) $handler) {
                 *         if (strpos($handler, '::')) {
                 *             [$componentAlias, $handlerName] = explode('::', $handler);
                 *             if ($componentAlias === $this->getBackendWidgetAlias()) {
                 *                 return $this->backendControllerProxy->runAjaxHandler($handler);
                 *             }
                 *         }
                 *     });
                 *
                 */
                if ($event = $this->fireSystemEvent('backend.ajax.beforeRunHandler', [$handler])) {
                    $response = ajax()::wrap($event);
                }
                else {
                    $response = $this->callAjaxAction($this->action, $this->params);
                }
            }
            catch (ComponentNotFound $ex) {
                throw new ApplicationException(Lang::get('backend::lang.widget.not_bound', ['name'=>$this->getAjaxRequest()->component]));
            }
            catch (HandlerNameInvalid $ex) {
                throw new ApplicationException(Lang::get('backend::lang.ajax_handler.invalid_name', ['name'=>$handler]));
            }
            catch (HandlerNotFound $ex) {
                throw new ApplicationException(Lang::get('backend::lang.ajax_handler.not_found', ['name'=>e($handler)]));
            }
            catch (MassAssignmentException $ex) {
                throw new ApplicationException(Lang::get('backend::lang.model.mass_assignment_failed', ['attribute' => $ex->getMessage()]));
            }
        }
        catch (ValidationException $ex) {
            Flash::error($ex->getMessage());
            $response = ajax()->invalidFields($ex->errors());
        }
        catch (Throwable $ex) {
            report($ex);
            $response = ajax()->exception($ex);
        }

        if ($this->hasAssetsDefined()) {
            foreach ($this->getAssetPathsWithAttributes() as $type => $paths) {
                $response->asset($type, $paths);
            }
        }

        $response = $this->outputVueComponentsForAjax($response);

        if (!$response->isRedirect() && Flash::check()) {
            $response->update([
                '#layout-flash-messages' => $this->makeLayoutPartial('flash_messages')
            ]);
        }

        return $response;
    }

    //
    // Getters
    //

    /**
     * getParams returns the action parameters
     */
    public function getParams()
    {
        return $this->params;
    }

    /**
     * getAction returns the action name
     */
    public function getAction()
    {
        return $this->action;
    }

    /**
     * getPublicActions returns the controllers public actions
     */
    public function getPublicActions()
    {
        return $this->publicActions;
    }

    /**
     * isPublicAction returns true if the current action is public
     */
    public function isPublicAction(?string $action): bool
    {
        if (!$action) {
            return false;
        }

        return in_array($action, $this->publicActions);
    }

    /**
     * getId returns a unique ID for the controller and route. Useful in creating HTML markup.
     */
    public function getId($suffix = null)
    {
        $id = class_basename(get_called_class()) . '-' . $this->action;
        if ($suffix !== null) {
            $id .= '-' . $suffix;
        }

        return $id;
    }

    //
    // Hints
    //

    /**
     * makeHintPartial renders a hint partial, used for displaying informative information that
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
            'hintName' => $name,
            'hintPartial' => $partial,
            'hintContent' => array_get($params, 'content'),
            'hintParams' => $params
        ] + $params);
    }

    /**
     * onHideBackendHint ajax handler to hide a backend hint, once hidden the partial
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
     * isBackendHintHidden checks if a hint has been hidden by the user.
     * @param  string $name Unique key name
     * @return bool
     */
    public function isBackendHintHidden($name)
    {
        $hiddenHints = UserPreference::forUser()->get('backend::hints.hidden', []);
        return array_key_exists($name, $hiddenHints);
    }

    //
    // Turbo
    //

    /**
     * getTurboMetaTags returns an array of turbo meta tag definitions
     * based on the $turboRouter property configuration.
     */
    public function getTurboMetaTags(): array
    {
        $turboRouter = $this->turboRouter;

        // Fallback to deprecated property
        if ($turboRouter === null && $this->turboVisitControl !== null) {
            $turboRouter = $this->turboVisitControl === 'disable'
                ? false
                : ['visit-control' => $this->turboVisitControl];
        }

        // Disabled
        if ($turboRouter === null || $turboRouter === false) {
            return [];
        }

        // Simple enable
        if ($turboRouter === true) {
            $turboRouter = ['visit-control' => 'enable'];
        }

        // String shorthand, e.g. 'reload' → ['visit-control' => 'reload']
        if (is_string($turboRouter)) {
            $turboRouter = ['visit-control' => $turboRouter];
        }

        // Default turbo-root
        if (!isset($turboRouter['root'])) {
            $turboRouter['root'] = \Backend::baseUrl();
        }

        // Build meta tags
        $tags = [];
        foreach ($turboRouter as $key => $value) {
            $tags[] = ['name' => "turbo-{$key}", 'content' => $value];
        }

        return $tags;
    }
}
