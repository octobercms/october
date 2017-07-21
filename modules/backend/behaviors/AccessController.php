<?php namespace Backend\Behaviors;

use Backend;
use BackendAuth;
use Backend\Classes\BackendController;
use Backend\Classes\ControllerBehavior;
use Event;
use October\Rain\Router\Helper as RouterHelper;
use Request;
use Response;
use View;

/**
 * Access Controller Behavior
 * Helps manage accesses.
 *
 * Usage:
 *
 * In the model class definition:
 *
 *   public $implement = ['Backend.Behaviors.AccessController'];
 *   public $accessConfig = 'config_access.yaml';
 *
 *
 * In config file (config_access.yaml):
 *
 * access:
 *    index: acme.demo.access_clients
 *    update:
 *        permission: acme.demo.update_clients
 *        redirectUrl: acme/demo/clients/preview/:id
 *    onDelete: delete_clients
 *
 *
 * @package october\backend
 * @author Matiss Janis Aboltins
 */
class AccessController extends ControllerBehavior
{
    /**
     * {@inheritDoc}
     */
    protected $requiredProperties = ['accessConfig'];

    /**
     * Behavior constructor
     * @param Backend\Classes\Controller $controller
     */
    public function __construct($controller)
    {
        parent::__construct($controller);

        /*
         * Build configuration
         */
        $this->config = $this->makeConfig($controller->accessConfig);

        Event::listen('backend.page.beforeDisplay', function ($controller, $action) {
            return $this->checkAccess($controller, $action);
        });
    }

    /**
     * Check if the current backend user has access to the
     * selected page.
     */
    public function checkAccess($controller, $action)
    {
        // Handle AJAX
        if ($handler = $controller->getAjaxHandler()) {
            $action = $handler;
        }

        $data = $this->getConfig('access[' . $action . ']');

        // If no configuration exists for this object then simply allow access to it
        if ($data === null) {
            return;
        }

        // If this is not an array.. build..
        if (is_array($data) === false) {
            $data = [
                'permission' => $data,
            ];
        }

        $this->config = $this->makeConfig($data);
        $user         = BackendAuth::getUser();

        // Check if the user has access to this page
        if ($user === null || $user->hasAccess($this->getConfig('permission')) === false) {

            // If redirection is defined - perform the redirect
            if (Request::ajax() === false && $redirectUrl = $this->getConfig('redirectUrl')) {

                $params = BackendController::$params;
                $data   = [];

                if (count($params) > 0) {
                    $data = [
                        'id' => $params[0],
                    ];
                }

                $redirectUrl = RouterHelper::parseValues($data, ['id'], $redirectUrl);

                return redirect(Backend::url($redirectUrl));
            }

            return Response::make(View::make('backend::access_denied'), 403);
        }
    }
}
