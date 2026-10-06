<?php

use Dashboard\Widgets\Dash;

require_once __DIR__.'/../../../backend/tests/fixtures/models/BackendUserFixture.php';
require_once __DIR__.'/../fixtures/DashboardRegistrationsFixture.php';
require_once __DIR__.'/../fixtures/SalesDataSourceFixture.php';

class DashWidgetDataTest extends PluginTestCase
{
    use DashboardRegistrationsFixture;

    /**
     * setUp registers the sales data source behind a permission and requests its data.
     */
    public function setUp(): void
    {
        parent::setUp();

        $this->registerDashboardsAs([
            'Acme.Sales' => ['dataSources' => [
                SalesDataSourceFixture::class => ['label' => 'Sales', 'permissions' => ['acme.sales.view']]
            ]]
        ]);

        request()->setMethod('POST');
        request()->request->add([
            'widget_config' => ['dataSource' => SalesDataSourceFixture::class],
            'dimension' => 'product',
            'metrics' => ['amount']
        ]);
    }

    /**
     * testWidgetDataRequiresDataSourcePermission ensures a posted data source class cannot be read without its permission.
     */
    public function testWidgetDataRequiresDataSourcePermission()
    {
        $this->actingAs(new BackendUserFixture);

        $this->expectException(SystemException::class);

        $this->makeDashWidget()->onGetWidgetData();
    }

    /**
     * testWidgetDataLoadsPermittedDataSource ensures the data source rows are returned to users with the permission.
     */
    public function testWidgetDataLoadsPermittedDataSource()
    {
        $this->actingAs((new BackendUserFixture)->withPermission('acme.sales.view'));

        /** @var array $result */
        $result = $this->makeDashWidget()->onGetWidgetData()->toResponse(request());

        $this->assertEquals('Widget', $result['current']['widget_data'][0]->oc_dimension);
        $this->assertEquals(42, $result['current']['widget_data'][0]->oc_metric_amount);
    }

    /**
     * makeDashWidget creates a Dash widget instance without running the constructor.
     */
    protected function makeDashWidget(): Dash
    {
        return (new ReflectionClass(Dash::class))->newInstanceWithoutConstructor();
    }
}
