<?php

use Backend\Classes\Controller;
use Backend\Classes\WidgetManager;
use Backend\Widgets\ReportContainer;
use Dashboard\Classes\ReportFetchData;
use Dashboard\Classes\ReportWidgetBase;
use Dashboard\Classes\VueReportWidgetBase;

require_once __DIR__.'/../fixtures/models/BackendUserFixture.php';

class ReportContainerTest extends PluginTestCase
{
    /**
     * @var bool useTransactions isolates each test with a database transaction
     */
    protected $useTransactions = true;

    /**
     * setUp test case
     */
    public function setUp(): void
    {
        parent::setUp();

        WidgetManager::instance()->registerReportWidgets(function ($manager) {
            $manager->registerReportWidget(ReportContainerTestWidget::class, ['label' => 'Static Widget']);
            $manager->registerReportWidget(ReportContainerTestVueWidget::class, ['label' => 'Vue Widget']);
        });
    }

    /**
     * testRendersDefaultWidgets ensures widgets from the default layout are created and rendered.
     */
    public function testRendersDefaultWidgets()
    {
        $this->actingAs((new BackendUserFixture)->asSuperUser());

        $html = $this->makeContainer([
            'defaultWidgets' => [
                'sales' => [
                    'class' => ReportContainerTestWidget::class,
                    'sortOrder' => 1,
                    'configuration' => ['title' => 'Sales', 'ocWidgetWidth' => 12]
                ]
            ]
        ])->render();

        $this->assertStringContainsString('report widget: Sales', $html);
    }

    /**
     * testAddPopupListsStaticWidgetsOnly ensures Vue report widgets, which the container cannot render, are not offered.
     */
    public function testAddPopupListsStaticWidgetsOnly()
    {
        $this->actingAs((new BackendUserFixture)->asSuperUser());

        $html = $this->makeContainer()->onLoadAddPopup();

        $this->assertStringContainsString('Static Widget', $html);
        $this->assertStringNotContainsString('Vue Widget', $html);
    }

    /**
     * testAddWidgetRejectsUnregisteredClass ensures a posted class name must be a registered report widget.
     */
    public function testAddWidgetRejectsUnregisteredClass()
    {
        $this->actingAs((new BackendUserFixture)->asSuperUser());
        Request::merge(['className' => \Backend\Models\User::class, 'size' => 6]);

        $this->expectException(ApplicationException::class);

        $this->makeContainer()->onAddWidget();
    }

    /**
     * testAddWidgetSavesRegisteredWidget ensures a registered widget is rendered when added and kept in the user layout.
     */
    public function testAddWidgetSavesRegisteredWidget()
    {
        $user = (new BackendUserFixture)->asSuperUser();
        $user->forceSave();
        $this->actingAs($user);

        Request::merge(['className' => ReportContainerTestWidget::class, 'size' => 6]);

        $result = $this->makeContainer()->onAddWidget();

        $this->assertStringContainsString('report widget: Default title', implode('', $result));
        $this->assertStringContainsString('report widget: Default title', $this->makeContainer()->render());
    }

    /**
     * makeContainer returns a report container widget with the given configuration.
     */
    protected function makeContainer(array $config = []): ReportContainer
    {
        return new ReportContainer(new Controller, $config);
    }
}

/**
 * ReportContainerTestWidget is a static report widget used by the report container tests.
 */
class ReportContainerTestWidget extends ReportWidgetBase
{
    /**
     * defineProperties for the widget.
     */
    public function defineProperties()
    {
        return [
            'title' => ['title' => 'Title', 'default' => 'Default title', 'type' => 'string']
        ];
    }

    /**
     * render the widget title.
     */
    public function render()
    {
        return 'report widget: '.$this->property('title');
    }
}

/**
 * ReportContainerTestVueWidget is a Vue report widget used by the report container tests.
 */
class ReportContainerTestVueWidget extends VueReportWidgetBase
{
    /**
     * getData returns no data for this fixture.
     */
    public function getData(ReportFetchData $data): mixed
    {
        return null;
    }
}
