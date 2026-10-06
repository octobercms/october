<?php

use Dashboard\Models\Dashboard;
use Dashboard\Controllers\Index;
use Dashboard\Controllers\Dashboards;

require_once __DIR__.'/../../../backend/tests/fixtures/models/BackendUserFixture.php';

class DashboardsControllerTest extends PluginTestCase
{
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
     * renderPopupButtons renders the popup form buttons of a dashboard for a superuser.
     */
    protected function renderPopupButtons(Dashboard $dashboard): string
    {
        $this->actingAs((new BackendUserFixture)->asSuperUser());

        $controller = new Dashboards;
        $controller->asExtension('FormController')->beforeDisplay();
        $controller->update($dashboard->id);

        return $controller->formRenderDesignButtons();
    }
}
