<?php namespace Dashboard;

use Backend;
use Dashboard\Models\Dashboard;
use October\Rain\Support\ModuleServiceProvider;
use Dashboard\Classes\CmsReportDataSource;
use Dashboard\Classes\CmsStatusDataSource;
use Dashboard\Classes\SystemReportDataSource;
use System\Classes\SettingsManager;

/**
 * ServiceProvider for Backend module
 */
class ServiceProvider extends ModuleServiceProvider
{
    /**
     * register the service provider.
     */
    public function register()
    {
        parent::register('dashboard');

        $this->registerSingletons();

        // Backend specific
        if ($this->app->runningInBackend()) {
            $this->registerDashboardDatasource();
        }
    }

    /**
     * boot the module events.
     */
    public function boot()
    {
        parent::boot('backend');
    }

    /**
     * registerSingletons
     */
    protected function registerSingletons()
    {
        $this->app->singleton('dashboard.dashboards', \Dashboard\Classes\DashManager::class);
        $this->app->singleton('dashboard.demos.traffic', \Dashboard\Classes\CmsDemoTrafficDataGenerator::class);
        $this->app->singleton('dashboard.traffic.logger', \Dashboard\Classes\TrafficLogger::class);
    }

    /**
     * registerNavigation
     */
    public function registerNavigation()
    {
        return [
            'dashboard' => [
                'label' => 'backend::lang.dashboard.menu_label',
                'icon' => 'icon-dashboard',
                'iconSvg' => 'modules/backend/assets/images/dashboard-icon.svg',
                'url' => Backend::url('dashboard'),
                'permissions' => ['dashboard.*', 'dashboard'],
                'order' => 10
            ]
        ];
    }

    /**
     * registerPermissions
     */
    public function registerPermissions()
    {
        return [
            // Dashboard
            'dashboard' => [
                'label' => 'Access the Dashboard',
                'comment' => 'backend::lang.permissions.access_dashboard',
                'tab' => 'Dashboard',
                'order' => 600
            ],
            'dashboard.manage' => [
                'label' => 'Manage Dashboards',
                'comment' => 'backend::lang.permissions.create_edit_dashboards',
                'tab' => 'Dashboard',
                'order' => 600
            ],
            'dashboard.internal_traffic_statistics' => [
                'label' => "Manage Traffic Settings and Data",
                'tab' => 'Internal Traffic Statistics',
                'order' => 1000
            ]
        ];
    }

    /**
     * registerSettings
     */
    public function registerSettings()
    {
        return [
            'dash_settings' => [
                'label' => "Internal Traffic Statistics",
                'description' => "Manage the Internal Traffic Statistics data",
                'category' => SettingsManager::CATEGORY_CMS,
                'icon' => 'icon-line-chart',
                'url' => Backend::url('dashboard/dashboardsettings'),
                'permissions' => ['dashboard.internal_traffic_statistics'],
                'order' => 1000
            ],
        ];
    }

    /**
     * registerDashboardDatasource
     */
    protected function registerDashboardDatasource()
    {
        $this->callAfterResolving('dashboard.dashboards', function($manager) {
            $manager->registerDataSourceClass(
                SystemReportDataSource::class,
                'system::lang.dashboard.report_data_source.data_source_name'
            );

            $manager->registerDataSourceClass(
                CmsReportDataSource::class,
                "Traffic Information"
            );

            $manager->registerDataSourceClass(
                CmsStatusDataSource::class,
                "Website Status"
            );
        });
    }
}
