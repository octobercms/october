<?php namespace Backend\Controllers;

use Redirect;
use BackendAuth;
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
        if (BackendAuth::check()) {
            new ReportContainer($this);
        }
    }

    public function index()
    {
        if ($redirect = $this->checkPermissionRedirect())
            return $redirect;

        $this->pageTitle = 'backend::lang.dashboard.menu_label';
        BackendMenu::setContextMainMenu('dashboard');
    }

    /**
     * Custom permissions check that will redirect to the next
     * available menu item, if permission to this page is denied.
     */
    protected function checkPermissionRedirect()
    {
        if (!$this->user->hasAccess('backend.access_dashboard')) {
            $true = function(){ return true; };
            if ($first = array_first(BackendMenu::listMainMenuItems(), $true)) {
                return Redirect::intended($first->url);
            }
        }
    }
}
