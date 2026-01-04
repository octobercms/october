<?php namespace Dashboard\Controllers;

use Backend;
use Request;
use Redirect;
use BackendAuth;
use BackendMenu;
use Backend\Classes\WildcardController;
use Dashboard\Models\Dashboard;

/**
 * Index controller for the dashboard
 *
 * @package october\dashboard
 * @author Alexey Bobkov, Samuel Georges
 */
class Index extends WildcardController
{
    /**
     * @var array Extensions implemented by this controller.
     */
    public $implement = [
        \Dashboard\Behaviors\DashController::class,
    ];

    /**
     * @var array `DashController` configuration.
     */
    public $dashConfig = 'config_dash.yaml';

    /**
     * @var array requiredPermissions to view this page.
     * @see checkPermissionRedirect()
     */
    public $requiredPermissions = [];

    /**
     * @var bool turboVisitControl
     */
    public $turboVisitControl = 'reload';

    /**
     * @var object listAllDashboardsCache
     */
    protected $listAllDashboardsCache;

    /**
     * __construct the controller
     */
    public function __construct()
    {
        parent::__construct();

        BackendMenu::setContext('October.Dashboard', 'dashboard');
    }

    /**
     * index controller action
     */
    public function index($code = null)
    {
        if ($redirect = $this->checkPermissionRedirect()) {
            return $redirect;
        }

        $this->bodyClass = 'compact-container sidenav-responsive';
        $this->pageTitle = 'backend::lang.dashboard.menu_label';

        $this->syncAllDashboards();

        $dashboards = $this->listAllDashboards();
        $this->vars['dashboards'] = $dashboards;
        $this->vars['dashboard'] = $code
            ? $dashboards->where('code', $code)->first()
            : $dashboards->first();

        $this->initDash();
    }

    /**
     * checkPermissionRedirect custom permissions check that will redirect to the next
     * available menu item, if permission to this page is denied.
     */
    protected function checkPermissionRedirect()
    {
        if ($this->user->hasAnyAccess(['dashboard', 'dashboard.*'])) {
            return;
        }

        if ($first = array_first(BackendMenu::listMainMenuItems())) {
            return Redirect::intended($first->url);
        }
    }

    /**
     * syncAllDashboards
     */
    protected function syncAllDashboards()
    {
        if (!Request::ajax()) {
            Dashboard::syncAll(
                $this,
                (array) $this->asExtension('DashController')->dashGetConfig()
            );
        }
    }

    /**
     * dashGetConfig dynamically specifies the dash widget config from the dashboard
     * model configuration.
     */
    public function dashGetConfig()
    {
        $allDashboards = $this->listAllDashboards()->keyBy('code')->all();

        $config = $this->mergeConfig(
            array_fill_keys(array_keys($allDashboards), []),
            $this->makeConfig($this->dashConfig)
        );

        // Post processing
        foreach ($config as &$definition) {
            $definition['manageUrl'] = BackendAuth::userHasAccess('dashboard.manage') ? Backend::url('dashboard/dashboards') : null;
        }

        // Transfer dynamic config
        foreach ($allDashboards as $code => $dashboard) {
            $config->$code['name'] = $dashboard->name;
            $config->$code['showInterval'] = !$dashboard->is_interval_hidden;

            // If its global and I have customized it...
            if ($dashboard->is_global) {
                $config->$code['canMakeDefault'] = true;
                $config->$code['canResetLayout'] = true;
            }
        }

        return $config;
    }

    /**
     * listAllDashboards
     */
    protected function listAllDashboards()
    {
        return $this->listAllDashboardsCache ??= Dashboard::listDashboards($this);
    }
}
