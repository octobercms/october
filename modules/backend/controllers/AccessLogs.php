<?php namespace Backend\Controllers;

use Str;
use Lang;
use File;
use Flash;
use Backend;
use Redirect;
use BackendMenu;
use Backend\Classes\Controller;
use ApplicationException;
use System\Classes\SettingsManager;
use Exception;

/**
 * Access Logs controller
 *
 * @package october\system
 * @author Alexey Bobkov, Samuel Georges
 *
 */
class AccessLogs extends Controller
{
    public $implement = [
        'Backend.Behaviors.ListController'
    ];

    public $requiredPermissions = ['system.access_logs'];

    public $listConfig = 'config_list.yaml';

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
