<?php

use Backend\Classes\WidgetManager;
use Dashboard\Classes\DashManager;
use Dashboard\Classes\CmsReportDataSource;

require_once __DIR__.'/../../../backend/tests/fixtures/models/BackendUserFixture.php';
require_once __DIR__.'/../fixtures/DashboardRegistrationsFixture.php';
require_once __DIR__.'/../fixtures/SalesVueWidgetFixture.php';
require_once __DIR__.'/../fixtures/SalesDataSourceFixture.php';

class DashManagerRegistrationTest extends PluginTestCase
{
    use DashboardRegistrationsFixture;

    /**
     * testPlainArrayRegistersDashboards ensures a plain array is read as dashboards keyed by code.
     */
    public function testPlainArrayRegistersDashboards()
    {
        $this->registerDashboardsAs([
            'Acme.Plain' => ['plain-dashboard' => ['name' => 'Plain']]
        ]);

        $manager = DashManager::instance();

        $this->assertEquals(['plain-dashboard' => ['name' => 'Plain']], $manager->listRegistrations('dashboards'));
        $this->assertEquals([], $manager->listRegistrations('widgets'));
        $this->assertEquals([], $manager->listRegistrations('dataSources'));
    }

    /**
     * testGroupedArrayRegistersEachGroup ensures the dashboards, widgets and dataSources keys are read separately.
     */
    public function testGroupedArrayRegistersEachGroup()
    {
        $this->registerDashboardsAs([
            'Acme.Grouped' => [
                'dashboards' => ['grouped-dashboard' => ['name' => 'Grouped']],
                'widgets' => ['Acme\Grouped\ReportWidgets\Sales' => ['label' => 'Sales']],
                'dataSources' => ['Acme\Grouped\Classes\SalesDataSource' => ['label' => 'Sales Data']]
            ]
        ]);

        $manager = DashManager::instance();

        $this->assertEquals(['grouped-dashboard'], array_keys($manager->listRegistrations('dashboards')));
        $this->assertEquals(['Acme\Grouped\ReportWidgets\Sales'], array_keys($manager->listRegistrations('widgets')));
        $this->assertEquals('Sales Data', $manager->listDataSourceClasses()['Acme\Grouped\Classes\SalesDataSource'] ?? null);
    }

    /**
     * testWidgetOnlyRegistrationRegistersNoDashboards ensures a grouped array without the dashboards key is not read as dashboards.
     */
    public function testWidgetOnlyRegistrationRegistersNoDashboards()
    {
        $this->registerDashboardsAs([
            'Acme.Widgets' => ['widgets' => ['Acme\Widgets\ReportWidgets\Sales' => ['label' => 'Sales']]]
        ]);

        $this->assertEquals([], DashManager::instance()->listDashboardDefinitions());
    }

    /**
     * testDashboardDefinitionsLoadYamlFiles ensures path definitions are loaded from YAML while arrays are used as is.
     */
    public function testDashboardDefinitionsLoadYamlFiles()
    {
        $this->registerDashboardsAs([
            'Acme.Sales' => [
                'sales' => '~/modules/dashboard/tests/fixtures/dashboards/sales.yaml',
                'inline' => ['name' => 'Inline']
            ]
        ]);

        $definitions = DashManager::instance()->listDashboardDefinitions();

        $this->assertEquals('Sales', $definitions['sales']['name']);
        $this->assertFalse($definitions['sales']['showInterval']);
        $this->assertArrayHasKey('sales_title', $definitions['sales']['reports']);
        $this->assertEquals(['name' => 'Inline'], $definitions['inline']);
    }

    /**
     * testMissingDashboardFileThrows ensures a mistyped definition path is reported.
     */
    public function testMissingDashboardFileThrows()
    {
        $this->registerDashboardsAs([
            'Acme.Missing' => ['missing' => '~/modules/dashboard/tests/fixtures/dashboards/missing.yaml']
        ]);

        $this->expectException(SystemException::class);

        DashManager::instance()->listDashboardDefinitions();
    }

    /**
     * testDashboardAccessFollowsPermissions ensures registered permissions gate access while other dashboards stay available.
     */
    public function testDashboardAccessFollowsPermissions()
    {
        $this->registerDashboardsAs([
            'Acme.Sales' => ['sales' => '~/modules/dashboard/tests/fixtures/dashboards/sales.yaml']
        ]);

        $manager = DashManager::instance();

        $this->assertFalse($manager->hasDashboardAccess('sales', new BackendUserFixture));
        $this->assertTrue($manager->hasDashboardAccess('sales', (new BackendUserFixture)->withPermission('acme.sales.view')));
        $this->assertTrue($manager->hasDashboardAccess('sales', (new BackendUserFixture)->asSuperUser()));
        $this->assertTrue($manager->hasDashboardAccess('system', new BackendUserFixture));
    }

    /**
     * testRegisteredWidgetsJoinReportWidgets ensures widgets from the registration method are listed as report widgets.
     */
    public function testRegisteredWidgetsJoinReportWidgets()
    {
        $this->registerDashboardsAs([
            'Acme.Widgets' => ['widgets' => ['Acme\Widgets\ReportWidgets\Sales' => ['label' => 'Sales']]]
        ]);

        $this->actingAs((new BackendUserFixture)->asSuperUser());

        $widgets = WidgetManager::instance()->listReportWidgets();

        $this->assertEquals('Sales', $widgets['Acme\Widgets\ReportWidgets\Sales']['label'] ?? null);
    }

    /**
     * testVueWidgetsFollowEachRequestUser ensures the singleton manager does not reuse the widget list of an earlier request, as under Octane.
     */
    public function testVueWidgetsFollowEachRequestUser()
    {
        $this->registerDashboardsAs([
            'Acme.Widgets' => ['widgets' => [
                SalesVueWidgetFixture::class => ['label' => 'Sales', 'permissions' => ['acme.sales.view']]
            ]]
        ]);

        $this->actingAs(new BackendUserFixture);
        $this->assertNotContains(SalesVueWidgetFixture::class, DashManager::instance()->listVueReportWidgetClasses());

        $this->app->forgetScopedInstances();
        $this->actingAs((new BackendUserFixture)->withPermission('acme.sales.view'));
        $this->assertContains(SalesVueWidgetFixture::class, DashManager::instance()->listVueReportWidgetClasses());

        $this->app->forgetScopedInstances();
        $this->actingAs(new BackendUserFixture);
        $this->assertNotContains(SalesVueWidgetFixture::class, DashManager::instance()->listVueReportWidgetClasses());
        $this->assertNull(DashManager::instance()->getVueReportWidget(SalesVueWidgetFixture::class, new \Backend\Classes\Controller));
    }

    /**
     * testCoreDataSourcesUseRegistrationMethod ensures the dashboard module registers its own data sources with registerDashboards.
     */
    public function testCoreDataSourcesUseRegistrationMethod()
    {
        $manager = DashManager::instance();

        $this->assertEquals('Traffic Information', $manager->listDataSourceClasses()[CmsReportDataSource::class] ?? null);
        $this->assertInstanceOf(CmsReportDataSource::class, $manager->getDataSource(CmsReportDataSource::class));
    }

    /**
     * testRegisterDataSourceClassOverridesRegistration ensures data sources registered on the manager are listed and take precedence.
     */
    public function testRegisterDataSourceClassOverridesRegistration()
    {
        $manager = DashManager::instance();
        $manager->registerDataSourceClass('Acme\Legacy\Classes\LegacyDataSource', 'Legacy');
        $manager->registerDataSourceClass(CmsReportDataSource::class, 'Visits');

        $dataSources = $manager->listDataSourceClasses();

        $this->assertEquals('Legacy', $dataSources['Acme\Legacy\Classes\LegacyDataSource'] ?? null);
        $this->assertEquals('Visits', $dataSources[CmsReportDataSource::class] ?? null);
    }

    /**
     * testDataSourcePermissionsFollowEachRequestUser ensures registered data source permissions are checked for each request user, as under Octane.
     */
    public function testDataSourcePermissionsFollowEachRequestUser()
    {
        $this->registerDashboardsAs([
            'Acme.Sales' => ['dataSources' => [
                SalesDataSourceFixture::class => ['label' => 'Sales', 'permissions' => ['acme.sales.view']]
            ]]
        ]);

        $manager = DashManager::instance();

        $this->actingAs(new BackendUserFixture);
        $this->assertArrayNotHasKey(SalesDataSourceFixture::class, $manager->listDataSourceClasses());
        $this->assertNull($manager->getDataSource(SalesDataSourceFixture::class));

        $this->app->forgetScopedInstances();
        $this->actingAs((new BackendUserFixture)->withPermission('acme.sales.view'));
        $this->assertEquals('Sales', $manager->listDataSourceClasses()[SalesDataSourceFixture::class] ?? null);
        $this->assertInstanceOf(SalesDataSourceFixture::class, $manager->getDataSource(SalesDataSourceFixture::class));

        $this->app->forgetScopedInstances();
        $this->actingAs(new BackendUserFixture);
        $this->assertNull($manager->getDataSource(SalesDataSourceFixture::class));
    }

    /**
     * testRegisterDataSourceClassAcceptsPermissions ensures permissions passed to the manager gate the data source.
     */
    public function testRegisterDataSourceClassAcceptsPermissions()
    {
        $manager = DashManager::instance();
        $manager->registerDataSourceClass(SalesDataSourceFixture::class, 'Sales', ['acme.sales.view']);

        $this->actingAs(new BackendUserFixture);
        $this->assertArrayNotHasKey(SalesDataSourceFixture::class, $manager->listDataSourceClasses());

        $this->actingAs((new BackendUserFixture)->asSuperUser());
        $this->assertArrayHasKey(SalesDataSourceFixture::class, $manager->listDataSourceClasses());
    }
}
