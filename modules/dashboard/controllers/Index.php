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
     * @var string turboRouter
     */
    public $turboRouter = 'reload';

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
        $this->pageTitle = "Dashboard";

        $this->syncAllDashboards();

        $dashboards = $this->listAllDashboards();
        $this->vars['dashboards'] = $dashboards;
        $this->vars['dashboard'] = $code
            ? $dashboards->where('code', $code)->first()
            : $this->resolveDefaultDashboard($dashboards);

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

            // Allow personalization of global and role-based dashboards
            if ($dashboard->is_global || $dashboard->roles->isNotEmpty()) {
                $config->$code['canMakeDefault'] = true;
                $config->$code['canResetLayout'] = true;
            }
        }

        return $config;
    }

    /**
     * resolveDefaultDashboard applies 3-tier resolution:
     * 1. User's personal dashboard
     * 2. Role-based dashboard
     * 3. Global/system dashboard (fallback)
     */
    protected function resolveDefaultDashboard($dashboards)
    {
        $user = BackendAuth::user();
        $userRoleId = $user?->role_id;

        // Tier 1: User's own personal dashboard
        $personal = $dashboards->first(function($d) use ($user) {
            return $d->created_user_id === $user?->id
                && !$d->is_global
                && !$d->is_system;
        });

        if ($personal) {
            return $personal;
        }

        // Tier 2: Role-based dashboard
        if ($userRoleId) {
            $roleBased = $dashboards->first(function($d) use ($userRoleId) {
                return $d->roles->contains('id', $userRoleId);
            });

            if ($roleBased) {
                return $roleBased;
            }
        }

        // Tier 3: First available (global/system)
        return $dashboards->first();
    }

    /**
     * listAllDashboards
     */
    protected function listAllDashboards()
    {
        return $this->listAllDashboardsCache ??= Dashboard::listDashboards($this);
    }
}
