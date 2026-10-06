<?php

use Dashboard\Models\Dashboard;
use Dashboard\Controllers\Index;

require_once __DIR__.'/../../../backend/tests/fixtures/models/BackendUserFixture.php';
require_once __DIR__.'/../fixtures/DashboardRegistrationsFixture.php';

class DashboardIndexControllerTest extends PluginTestCase
{
    use DashboardRegistrationsFixture;

    /**
     * @var bool useTransactions isolates each test with a database transaction
     */
    protected $useTransactions = true;

    /**
     * testRegisteredDashboardIsListedAfterSystemDashboard ensures a registered dashboard is synced without replacing the landing dashboard.
     */
    public function testRegisteredDashboardIsListedAfterSystemDashboard()
    {
        $controller = $this->makeIndexController((new BackendUserFixture)->asSuperUser());
        $controller->index();

        $this->assertEquals(['system', 'sales'], $controller->vars['dashboards']->pluck('code')->all());
        $this->assertEquals('system', $controller->vars['dashboard']->code);
        $this->assertTrue((bool) $controller->vars['dashboards']->last()->is_system);
    }

    /**
     * testRegisteredDashboardSuppliesReports ensures the dash config carries the reports of the registered definition.
     */
    public function testRegisteredDashboardSuppliesReports()
    {
        $controller = $this->makeIndexController((new BackendUserFixture)->asSuperUser());
        $controller->index();

        $config = $controller->dashGetConfig();

        $this->assertArrayHasKey('sales_title', $config->sales['reports']);
        $this->assertFalse($config->sales['showInterval']);
    }

    /**
     * testRegisteredDashboardRequiresPermission ensures users without the permission cannot list or load the dashboard, and their visit keeps it.
     */
    public function testRegisteredDashboardRequiresPermission()
    {
        $controller = $this->makeIndexController((new BackendUserFixture)->withPermission('dashboard'));
        $controller->index();

        $this->assertNotContains('sales', $controller->vars['dashboards']->pluck('code')->all());
        $this->assertFalse($controller->dashHasDefinition('sales'));
        $this->assertTrue(Dashboard::applyOwner(Index::class)->where('code', 'sales')->exists());
    }

    /**
     * testRegisteredDashboardShownWithPermission ensures users with the permission can list and load the dashboard.
     */
    public function testRegisteredDashboardShownWithPermission()
    {
        $user = (new BackendUserFixture)->withPermission(['dashboard' => 1, 'acme.sales.view' => 1]);

        $controller = $this->makeIndexController($user);
        $controller->index();

        $this->assertContains('sales', $controller->vars['dashboards']->pluck('code')->all());
        $this->assertTrue($controller->dashHasDefinition('sales'));
    }

    /**
     * makeIndexController returns a dashboard controller for the user, with the sales dashboard registered.
     */
    protected function makeIndexController(BackendUserFixture $user): Index
    {
        $this->registerDashboardsAs([
            'Acme.Sales' => ['sales' => '~/modules/dashboard/tests/fixtures/dashboards/sales.yaml']
        ]);

        $this->actingAs($user);

        return new Index;
    }
}
