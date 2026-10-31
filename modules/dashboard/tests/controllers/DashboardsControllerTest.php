<?php

use Dashboard\Models\Dashboard;
use Dashboard\Controllers\Index;
use Dashboard\Controllers\Dashboards;

require_once __DIR__.'/../../../backend/tests/fixtures/models/BackendUserFixture.php';
require_once __DIR__.'/../fixtures/DashboardRegistrationsFixture.php';

class DashboardsControllerTest extends PluginTestCase
{
    use DashboardRegistrationsFixture;

    /**
     * @var bool useTransactions isolates each test with a database transaction
     */
    protected $useTransactions = true;

    /**
     * testSystemDashboardOffersResetInsteadOfDelete ensures the popup of a system dashboard renders the reset button without delete.
     */
    public function testSystemDashboardOffersResetInsteadOfDelete()
    {
        Dashboard::syncAll(Index::class, ['sales' => ['name' => 'Sales']]);

        $buttons = $this->renderPopupButtons(Dashboard::where('code', 'sales')->first());

        $this->assertStringContainsString('onResetDefault', $buttons);
        $this->assertStringNotContainsString('onPopupDelete', $buttons);
    }

    /**
     * testRegularDashboardOffersDelete ensures the popup of a regular dashboard renders the delete button.
     */
    public function testRegularDashboardOffersDelete()
    {
        $dashboard = new Dashboard;
        $dashboard->name = 'My Sales';
        $dashboard->code = 'my-sales';
        $dashboard->owner_type = Index::class;
        $dashboard->save();

        $buttons = $this->renderPopupButtons($dashboard);

        $this->assertStringContainsString('onPopupDelete', $buttons);
        $this->assertStringNotContainsString('onResetDefault', $buttons);
    }

    /**
     * testSystemDashboardIntervalIsEditable ensures the interval setting of a system dashboard can be changed.
     */
    public function testSystemDashboardIntervalIsEditable()
    {
        Dashboard::syncAll(Index::class, ['sales' => ['name' => 'Sales', 'showInterval' => false]]);

        $controller = $this->makeUpdateController(Dashboard::where('code', 'sales')->first());

        $this->assertFalse((bool) $controller->formGetWidget()->getField('is_interval_hidden')->disabled);
    }

    /**
     * testResetDefaultRestoresDefinitionSettings ensures resetting a system dashboard restores the settings seeded from its definition.
     */
    public function testResetDefaultRestoresDefinitionSettings()
    {
        $definition = ['name' => 'Sales', 'icon' => 'ph ph-chart-bar', 'showInterval' => false, 'defaultStart' => 'month'];
        $this->registerDashboardsAs(['Acme.Sales' => ['sales' => $definition]]);
        Dashboard::syncAll(Index::class, ['sales' => $definition]);

        $dashboard = Dashboard::where('code', 'sales')->first();
        $dashboard->name = 'My Sales';
        $dashboard->icon = 'ph ph-globe';
        $dashboard->is_interval_hidden = false;
        $dashboard->default_start = 'year';
        $dashboard->is_custom = true;
        $dashboard->definition = [['widgets' => []]];
        $dashboard->save();

        $controller = $this->makeUpdateController($dashboard);
        request()->setMethod('POST');
        request()->request->replace(['form_record_id' => $dashboard->id]);

        try {
            $controller->onResetDefault();
        }
        finally {
            request()->setMethod('GET');
            request()->request->replace();
        }

        $dashboard = $dashboard->fresh();
        $this->assertEquals('Sales', $dashboard->name);
        $this->assertEquals('ph ph-chart-bar', $dashboard->icon);
        $this->assertTrue((bool) $dashboard->is_interval_hidden);
        $this->assertEquals('month', $dashboard->default_start);
        $this->assertFalse((bool) $dashboard->is_custom);
        $this->assertNull($dashboard->definition);
    }

    /**
     * testReorderRejectsAnotherUsersDashboard ensures a user without global management cannot reorder dashboards outside their list.
     */
    public function testReorderRejectsAnotherUsersDashboard()
    {
        $controller = $this->makeManagerController();
        $other = $this->makeOwnedDashboard('other-sales', 8);

        $this->expectException(ForbiddenException::class);

        $controller->listBeforeReorder($other);
    }

    /**
     * testReorderRejectsAnotherUsersDashboardInSortOrders ensures the posted ordering cannot include dashboards outside the user's list.
     */
    public function testReorderRejectsAnotherUsersDashboardInSortOrders()
    {
        $controller = $this->makeManagerController();
        $own = $this->makeOwnedDashboard('own-sales', 7);
        $other = $this->makeOwnedDashboard('other-sales', 8);

        request()->setMethod('POST');
        request()->request->add(['sort_orders' => [$own->id, $other->id]]);

        $this->expectException(ForbiddenException::class);

        $controller->listBeforeReorder($own);
    }

    /**
     * testReorderAllowsOwnDashboards ensures a user can still reorder the dashboards in their list.
     */
    public function testReorderAllowsOwnDashboards()
    {
        $controller = $this->makeManagerController();
        $first = $this->makeOwnedDashboard('first-sales', 7);
        $second = $this->makeOwnedDashboard('second-sales', 7);

        request()->setMethod('POST');
        request()->request->add(['sort_orders' => [$second->id, $first->id]]);

        $this->assertNull($controller->listBeforeReorder($first));
    }

    /**
     * makeManagerController returns the dashboards controller for a user with dashboard.manage but not global management.
     */
    protected function makeManagerController(): Dashboards
    {
        $user = (new BackendUserFixture)->withPermission(['dashboard.manage' => 1]);
        $user->forceFill(['id' => 7]);
        $this->actingAs($user);

        return new Dashboards;
    }

    /**
     * makeOwnedDashboard saves a dashboard created by the given user.
     */
    protected function makeOwnedDashboard(string $code, int $userId): Dashboard
    {
        $dashboard = new Dashboard;
        $dashboard->name = $code;
        $dashboard->code = $code;
        $dashboard->owner_type = Index::class;
        $dashboard->created_user_id = $userId;
        $dashboard->save();

        return $dashboard;
    }

    /**
     * tearDown clears the postback between tests.
     */
    public function tearDown(): void
    {
        request()->request->replace();

        parent::tearDown();
    }

    /**
     * renderPopupButtons renders the popup form buttons of a dashboard for a superuser.
     */
    protected function renderPopupButtons(Dashboard $dashboard): string
    {
        return $this->makeUpdateController($dashboard)->formRenderDesignButtons();
    }

    /**
     * makeUpdateController prepares the update form of a dashboard for a superuser.
     */
    protected function makeUpdateController(Dashboard $dashboard): Dashboards
    {
        $this->actingAs((new BackendUserFixture)->asSuperUser());

        $controller = new Dashboards;
        $controller->asExtension('FormController')->beforeDisplay();
        $controller->update($dashboard->id);

        return $controller;
    }
}
