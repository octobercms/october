<?php

use Dashboard\Models\Dashboard;
use Dashboard\Controllers\Index;

class DashboardSyncTest extends PluginTestCase
{
    /**
     * @var bool useTransactions isolates each test with a database transaction
     */
    protected $useTransactions = true;

    /**
     * testSyncAcceptsOwnerClassName ensures the owner can be supplied as a class name.
     */
    public function testSyncAcceptsOwnerClassName()
    {
        Dashboard::syncAll(Index::class, ['sales' => ['name' => 'Sales']]);

        $dashboard = $this->findDashboard('sales');

        $this->assertNotNull($dashboard);
        $this->assertTrue((bool) $dashboard->is_system);
        $this->assertFalse((bool) $dashboard->is_custom);
        $this->assertEquals('Sales', $dashboard->name);
    }

    /**
     * testSyncRemovesEveryUndefinedDashboard ensures all uncustomized dashboards without a definition are removed in one pass.
     */
    public function testSyncRemovesEveryUndefinedDashboard()
    {
        Dashboard::syncAll(Index::class, ['sales' => ['name' => 'Sales'], 'orders' => ['name' => 'Orders']]);
        Dashboard::syncAll(Index::class, []);

        $this->assertNull($this->findDashboard('sales'));
        $this->assertNull($this->findDashboard('orders'));
    }

    /**
     * testSyncKeepsCustomizedDashboardAsRegularDashboard ensures a customized dashboard outlives its definition and becomes deletable.
     */
    public function testSyncKeepsCustomizedDashboardAsRegularDashboard()
    {
        Dashboard::syncAll(Index::class, ['sales' => ['name' => 'Sales']]);
        (new Dashboard)->updateDashboard(Index::class, 'sales', [['widgets' => []]]);

        Dashboard::syncAll(Index::class, []);

        $this->assertNotNull($this->findDashboard('sales'));
        $this->assertFalse((bool) $this->findDashboard('sales')->is_system);

        Dashboard::syncAll(Index::class, ['sales' => ['name' => 'Sales']]);

        $this->assertEquals(1, Dashboard::applyOwner(Index::class)->where('code', 'sales')->count());
        $this->assertTrue((bool) $this->findDashboard('sales')->is_system);
    }

    /**
     * testSyncSkipsCodeUsedByAnotherDashboard ensures a definition does not duplicate the code of an existing dashboard.
     */
    public function testSyncSkipsCodeUsedByAnotherDashboard()
    {
        $dashboard = new Dashboard;
        $dashboard->name = 'My Sales';
        $dashboard->code = 'sales';
        $dashboard->owner_type = Index::class;
        $dashboard->is_custom = true;
        $dashboard->save();

        Dashboard::syncAll(Index::class, ['sales' => ['name' => 'Sales']]);

        $this->assertEquals(1, Dashboard::applyOwner(Index::class)->where('code', 'sales')->count());
        $this->assertEquals('My Sales', $this->findDashboard('sales')->name);
    }

    /**
     * testSyncFollowsDefinitionIntervalSetting ensures the interval setting of a system dashboard follows its definition.
     */
    public function testSyncFollowsDefinitionIntervalSetting()
    {
        Dashboard::syncAll(Index::class, ['sales' => ['name' => 'Sales']]);

        $this->assertFalse((bool) $this->findDashboard('sales')->is_interval_hidden);

        Dashboard::syncAll(Index::class, ['sales' => ['name' => 'Sales', 'showInterval' => false]]);

        $this->assertTrue((bool) $this->findDashboard('sales')->is_interval_hidden);
    }

    /**
     * findDashboard returns the main dashboard with the given code.
     */
    protected function findDashboard(string $code): ?Dashboard
    {
        return Dashboard::applyOwner(Index::class)->where('code', $code)->first();
    }
}
