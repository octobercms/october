<?php namespace Dashboard\Controllers;

use BackendMenu;
use Backend\Classes\Controller;
use Dashboard\Models\Dashboard;
use ForbiddenException;

/**
 * Dashboards controller for the dashboard
 *
 * @package october\dashboard
 * @author Alexey Bobkov, Samuel Georges
 *
 */
class Dashboards extends Controller
{
    use \Backend\Traits\InspectableContainer;

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
     * @var array requiredPermissions to view this page.
     */
    public $requiredPermissions = ['dashboard.manage'];

    /**
     * __construct the controller
     */
    public function __construct()
    {
        parent::__construct();

        BackendMenu::setContext('October.Dashboard', 'dashboard');
    }

    /**
     * index
     */
    public function index()
    {
        $this->asExtension('ListController')->index();

        $this->bodyClass = 'compact-container sidenav-responsive';

        $this->vars['dashboards'] = Dashboard::listDashboards(\Dashboard\Controllers\Index::class);
    }

    /**
     * formBeforeSave
     */
    public function formBeforeSave($model)
    {
        $model->is_custom = true;
        $model->owner_type = \Dashboard\Controllers\Index::class;

        if ($model->owner_field) {
            $model->code = $model->owner_field;
        }

        // Sharing dashboards with other users requires an elevated permission
        if (!$this->user->hasAccess('dashboard.manage_global')) {
            $model->is_global = false;
            $model->roles = [];
        }
    }

    /**
     * onResetDefault
     */
    public function onResetDefault()
    {
        if (!$this->formCheckPermission('modelDelete')) {
            throw new ForbiddenException;
        }

        if ($model = $this->formFindModelObject(post('form_record_id'))) {
            $model->is_custom = false;
            $model->definition = null;
            $model->save();
        }

        return $this->listRefresh();
    }

    /**
     * formExtendFields
     */
    public function formExtendFields($form)
    {
        $model = $form->getModel();

        if ($model->is_system) {
            $form->getField('code')->disabled();
            $form->getField('is_global')->disabled();
            $form->getField('is_interval_hidden')->disabled();
        }
        else {
            $form->getField('_system_definition_hint')->hidden();
        }

        if (!$this->user->hasAccess('dashboard.manage_global')) {
            $form->getField('is_global')->hidden();
            $form->getField('roles')->hidden();
        }
    }

    /**
     * listExtendQuery
     */
    public function listExtendQuery($query)
    {
        $query->applyOwner(Index::class);

        // Without elevated permissions, users may only manage their own dashboards
        if ($this->user->hasAccess('dashboard.manage_global')) {
            $query->applyCreatedUserOrSystem();
        }
        else {
            $query->where('created_user_id', $this->user->id);
        }
    }

    /**
     * formExtendQuery
     */
    public function formExtendQuery($query)
    {
        $this->listExtendQuery($query);
    }

    /**
     * listExtendRefreshResults refreshes the sidenav on every list update
     */
    public function listExtendRefreshResults($host, $result, $definition = null)
    {
        $this->vars['dashboards'] = Dashboard::listDashboards(Index::class);

        return ['#dashboardSidenav' => $this->makePartial('~/modules/dashboard/controllers/index/_dash_sidenav.php')];
    }
}
