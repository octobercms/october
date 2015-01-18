<?php namespace Backend\Controllers;

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

    public $requiredPermissions = ['backend.access_dashboard'];

    /**
     * Constructor.
     */
    public function __construct()
    {
        parent::__construct();

        BackendMenu::setContextOwner('October.Backend');
        new ReportContainer($this);
    }

    public function index()
    {
        $this->pageTitle = 'backend::lang.dashboard.menu_label';
        BackendMenu::setContextMainMenu('dashboard');
    }
}
