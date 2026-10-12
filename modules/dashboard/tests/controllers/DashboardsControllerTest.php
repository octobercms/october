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
