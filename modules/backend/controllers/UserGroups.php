<?php namespace Backend\Controllers;

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
class UserGroups extends Controller
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
     * Constructor.
     */
    public function __construct()
    {
        parent::__construct();

        BackendMenu::setContext('October.System', 'system', 'users');
        SettingsManager::setContext('October.System', 'administrators');

        // Allow option to turn Service Workers on and off in the backend, see github: #4384
        $serviceWorker = config('cms.enableBackendServiceWorkers');
        if (!empty($serviceWorker === 'false')) {
            // Add JS File to un-install SW to avoid Cookie Cache Issues when Signin, see github issue: #3707
            $this->addJs(url("/modules/backend/assets/js/october.uninstall-sw.js"));
        }
    }
}
