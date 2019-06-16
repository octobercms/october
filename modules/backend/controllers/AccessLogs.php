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
     * @var Service Worker in backend
     */
    protected $serviceworker = config('cms.enableBackendServiceWorkers');	

    /**
     * Constructor.
     */
    public function __construct()
    {
        parent::__construct();

        BackendMenu::setContext('October.System', 'system', 'settings');
        SettingsManager::setContext('October.Backend', 'access_logs');

        // Allow option to turn Service Workers on and off in the backend, see github: #4384
        if ($serviceworker === 'true') {
            // Add JS File to un-install SW to avoid Cookie Cache Issues when Signin, see github issue: #3707
            $this->addJs(url("/modules/backend/assets/js/october.uninstall-sw.js"));
        }		
    }

    public function index_onRefresh()
    {
        return $this->listRefresh();
    }
}
