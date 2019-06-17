<?php namespace Backend\Controllers;

use Redirect;
use BackendMenu;
use Backend\Classes\Controller;
use Backend\Widgets\ReportContainer;

/**
 * Dashboard controller
 *
 * @package october\backend
 * @author Alexey Bobkov, Samuel Georges
 *
 */
class Index extends Controller
{
    use \Backend\Traits\InspectableContainer;

    /**
     * @var array Permissions required to view this page.
     * @see checkPermissionRedirect()
     */
    public $requiredPermissions = [];

    /**
     * Constructor.
     */
    public function __construct()
    {
        parent::__construct();

        BackendMenu::setContextOwner('October.Backend');

        $this->addCss('/modules/backend/assets/css/dashboard/dashboard.css', 'core');

        // Allow option to turn Service Workers on and off in the backend, see github: #4384
        $serviceWorker = config('cms.enableBackendServiceWorkers');
        if (!empty($serviceWorker === 'false')) {
            // Add JS File to un-install SW to avoid Cookie Cache Issues when Signin, see github issue: #3707
            $this->addJs(url("/modules/backend/assets/js/october.uninstall-sw.js"));
        }
    }

    public function index()
    {
        if ($redirect = $this->checkPermissionRedirect()) {
            return $redirect;
        }

        $this->initReportContainer();

        $this->pageTitle = 'backend::lang.dashboard.menu_label';

        BackendMenu::setContextMainMenu('dashboard');
    }

    public function index_onInitReportContainer()
    {
        $this->initReportContainer();

        return ['#dashReportContainer' => $this->widget->reportContainer->render()];
    }

    /**
     * Prepare the report widget used by the dashboard
     * @param Model $model
     * @return void
     */
    protected function initReportContainer()
    {
        new ReportContainer($this, 'config_dashboard.yaml');
    }

    /**
     * Custom permissions check that will redirect to the next
     * available menu item, if permission to this page is denied.
     */
    protected function checkPermissionRedirect()
    {
        if (!$this->user->hasAccess('backend.access_dashboard')) {
            $true = function () { return true; };
            if ($first = array_first(BackendMenu::listMainMenuItems(), $true)) {
                return Redirect::intended($first->url);
            }
        }
    }
}
