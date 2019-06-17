<?php namespace Backend\Controllers;

use View;
use Response;
use BackendMenu;
use Backend\Classes\Controller;
use System\Classes\SettingsManager;

/**
 * Backend user groups controller
 *
 * @package october\backend
 * @author Alexey Bobkov, Samuel Georges
 *
 */
class UserRoles extends Controller
{
    /**
     * @var array Extensions implemented by this controller.
     */
    public $implement = [
        \Backend\Behaviors\FormController::class,
        \Backend\Behaviors\ListController::class
    ];

    /**
     * @var array `FormController` configuration.
     */
    public $formConfig = 'config_form.yaml';

    /**
     * @var array `ListController` configuration.
     */
    public $listConfig = 'config_list.yaml';

    /**
     * @var array Permissions required to view this page.
     */
    public $requiredPermissions = ['backend.manage_users'];

    /**
     * @var Service Worker in backend
     */
    protected $serviceWorker = config('cms.enableBackendServiceWorkers');

    /**
     * Constructor.
     */
    public function __construct()
    {
        parent::__construct();

        BackendMenu::setContext('October.System', 'system', 'users');
        SettingsManager::setContext('October.System', 'administrators');

        /*
         * Only super users can access
         */
        $this->bindEvent('page.beforeDisplay', function() {
            if (!$this->user->isSuperUser()) {
                return Response::make(View::make('backend::access_denied'), 403);
            }
        });

        // Allow option to turn Service Workers on and off in the backend, see github: #4384
        if ($serviceWorker === 'true') {
            // Add JS File to un-install SW to avoid Cookie Cache Issues when Signin, see github issue: #3707
            $this->addJs(url("/modules/backend/assets/js/october.uninstall-sw.js"));
        }		
    }

    /**
     * Add available permission fields to the Role form.
     */
    public function formExtendFields($form)
    {
        /*
         * Add permissions tab
         */
        $form->addTabFields($this->generatePermissionsField());
    }

    /**
     * Adds the permissions editor widget to the form.
     * @return array
     */
    protected function generatePermissionsField()
    {
        return [
            'permissions' => [
                'tab' => 'backend::lang.user.permissions',
                'type' => 'Backend\FormWidgets\PermissionEditor',
                'mode' => 'checkbox'
            ]
        ];
    }
}
