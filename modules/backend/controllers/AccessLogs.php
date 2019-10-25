<?php namespace Backend\Controllers;

use Backend;
use BackendMenu;
use Backend\Classes\Controller;
use System\Classes\SettingsManager;

/**
 * Access Logs controller
 *
 * @package october\system
 * @author Alexey Bobkov, Samuel Georges
 */
class AccessLogs extends Controller
{
    /**
     * @var array Extensions implemented by this controller.
     */
    public $implement = [
        \Backend\Behaviors\ListController::class
    ];

    /**
     * @var array `ListController` configuration.
     */
    public $listConfig = 'config_list.yaml';

    /**
     * @var array Permissions required to view this page.
     */
    public $requiredPermissions = ['system.access_logs'];

    /**
     * Constructor.
     */
    public function __construct()
    {
        parent::__construct();

        BackendMenu::setContext('October.System', 'system', 'settings');
        SettingsManager::setContext('October.Backend', 'access_logs');
    }

    public function index_onRefresh()
    {
        return $this->listRefresh();
    }
}
