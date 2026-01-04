<?php namespace Dashboard\Controllers;

use Str;
use Lang;
use Flash;
use Backend;
use Backend\Classes\SettingsController;
use Dashboard\Models\TrafficStatisticsPageview;
use Dashboard\Classes\TrafficLogger;
use Dashboard\Classes\CmsDemoTrafficDataGenerator;
use Dashboard\Models\DashboardSetting;

/**
 * DashboardSettings controller
 *
 * @package october\dashboard
 * @author Alexey Bobkov, Samuel Georges
 */
class DashboardSettings extends SettingsController
{
    /**
     * @var array Extensions implemented by this controller.
     */
    public $implement = [
        \Backend\Behaviors\FormController::class,
    ];

    /**
     * @var array `FormController` configuration.
     */
    public $formConfig = 'config_form.yaml';

    /**
     * @var array requiredPermissions required to view this page.
     */
    public $requiredPermissions = ['dashboard.internal_traffic_statistics'];

    /**
     * @var string settingsItemCode determines the settings code
     */
    public $settingsItemCode = 'dash_settings';

    /**
     * index
     */
    public function index()
    {
        $this->pageTitle = "Internal Traffic Statistics";
        $this->pageSize = Backend::sizeToPixels('large') ?: null;

        $this->vars['recordsTotal'] = Str::shortNumber(TrafficStatisticsPageview::count());

        $this->update();
    }

    /**
     * index_onSave
     */
    public function index_onSave()
    {
        return $this->update_onSave();
    }

    /**
     * index_onPurgeData
     */
    public function index_onPurgeData()
    {
        TrafficStatisticsPageview::purgeAllRecords();

        $this->vars['recordsTotal'] = 0;

        Flash::success(Lang::get('dashboard::lang.internal_traffic_statistics.purge_success'));
    }

    /**
     * update_onResetDefault AJAX handler
     */
    public function index_onResetDefault()
    {
        DashboardSetting::instance()->resetDefault();

        Flash::success(Lang::get('backend::lang.form.reset_success'));

        return Backend::redirect('dashboard/dashboardsettings');
    }

    /**
     * index_onGenerateDemoData AJAX handler
     */
    public function index_onGenerateDemoData()
    {
        CmsDemoTrafficDataGenerator::instance()->generate();

        Flash::success("Demo Traffic Data has been generated");

        return Backend::redirect('dashboard/dashboardsettings');
    }

    /**
     * formFindModelObject always returns the dash setting instance
     */
    public function formFindModelObject($recordId)
    {
        return DashboardSetting::instance();
    }
}
