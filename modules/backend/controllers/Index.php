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

    public $requiredPermissions = ['backend.access_dashboard'];

    /**
     * Constructor.
     */
    public function __construct()
    {
        parent::__construct();

        BackendMenu::setContextOwner('October.Backend');
        new ReportContainer($this);

        /* @todo Remove line if year >= 2015 */ if (\Schema::hasColumn('backend_users', 'activated')) \Schema::table('backend_users', function($table) { $table->renameColumn('activated', 'is_activated'); });
        /* @todo Remove line if year >= 2015 */ if (\Schema::hasColumn('backend_user_throttle', 'suspended')) \Schema::table('backend_user_throttle', function($table) { $table->renameColumn('suspended', 'is_suspended'); });
        /* @todo Remove line if year >= 2015 */ if (\Schema::hasColumn('backend_user_throttle', 'banned')) \Schema::table('backend_user_throttle', function($table) { $table->renameColumn('banned', 'is_banned'); });
        /* @todo Remove line if year >= 2015 */ if (\Schema::hasColumn('deferred_bindings', 'bind')) \Schema::table('deferred_bindings', function($table) { $table->renameColumn('bind', 'is_bind'); });
        /* @todo Remove line if year >= 2015 */ if (\Schema::hasColumn('system_files', 'public')) \Schema::table('system_files', function($table) { $table->renameColumn('public', 'is_public'); });
    }

    public function index()
    {
        $this->pageTitle = trans('backend::lang.dashboard.menu_label');
        BackendMenu::setContextMainMenu('dashboard');
    }
}