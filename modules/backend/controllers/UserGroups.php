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
    }
}
