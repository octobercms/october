<?php namespace Dashboard\Widgets;

use App;
use Lang;
use Backend\Classes\WidgetBase;
use Dashboard\Classes\DashReport;
use Dashboard\Classes\DashManager;
use Dashboard\Classes\ReportDataSourceBase;
use Dashboard\Classes\ReportDimension;
use Dashboard\Classes\ReportMetric;
use Dashboard\Models\Dashboard as DashboardModel;
use October\Rain\Element\ElementHolder;
use SystemException;

/**
 * Dash widget for building dashboards
 *
 * @package october\dashboard
 * @author Alexey Bobkov, Samuel Georges
 */
class Dash extends WidgetBase
{
    use \Dashboard\Widgets\Dash\HasWidgetData;
    use \Dashboard\Widgets\Dash\HasPropertyOptions;
    use \Dashboard\Widgets\Dash\ReportProcessor;
    use \Dashboard\Widgets\Dash\HasReportWidgets;

    const INTERVAL_TYPE_DASHBOARD = 'dashboard';
    const INTERVAL_TYPE_YEAR = 'year';
    const INTERVAL_TYPE_QUARTER = 'quarter';
    const INTERVAL_TYPE_MONTH = 'month';
    const INTERVAL_TYPE_WEEK = 'week';
    const INTERVAL_TYPE_DAYS = 'days';
    const INTERVAL_TYPE_HOUR = 'hour';

    //
    // Configurable Properties
    //

    /**
     * @var array name for the dash
     */
    public $name;

    /**
     * @var array code as a unique identifier for the dash
     */
    public $code;

    /**
     * @var array reports configuration
     */
    public $reports;

    /**
     * @var bool canCreateAndEdit the dash
     */
    public $canCreateAndEdit;

    /**
     * @var bool manageUrl for updating the dash
     */
    public $manageUrl;

    /**
     * @var bool isCustom is true when the reports configuration has come from
     * a saved/custom data source.
     */
    public $isCustom = false;

    //
    // Object Properties
    //

    /**
     * @inheritDoc
     */
    protected $defaultAlias = 'dash';

    /**
     * @var boolean reportsDefined determines if report definitions have been created.
     */
    protected $reportsDefined = false;

    /**
     * @var array allReports used in this dash.
     * @see \Backend\Classes\DashReport
     */
    protected $allReports = [];

    /**
     * @var array allRows used in this dash.
     */
    protected $allRows;

    /**
     * @inheritDoc
     */
    public function init()
    {
        $this->fillFromConfig([
            'name',
            'code',
            'reports',
            'isCustom',
            'manageUrl',
            'canCreateAndEdit',
        ]);

        $this->controller->registerVueComponent(\Backend\VueComponents\Inspector::class);
        $this->controller->registerVueComponent(\Dashboard\VueComponents\Dashboard::class);

        $widgetClasses = DashManager::instance()->listVueReportWidgetClasses();
        foreach ($widgetClasses as $widgetClassName) {
            $this->controller->registerVueComponent($widgetClassName);
        }

        $this->initReportWidgetsConcern();
    }

    /**
     * bindToController ensure reports are defined and report widgets are registered so they
     * can also be bound to the controller this allows their AJAX features to operate.
     * @return void
     */
    public function bindToController()
    {
        $this->defineDashReports();
        parent::bindToController();
    }

    /**
     * @inheritDoc
     */
    protected function loadAssets()
    {
        $this->addJs('js/classes/DashStore.js');
        $this->addJs('js/controls/control-dashwidget.js');
        $this->addJs('/modules/backend/assets/js/vendor/daterangepicker/daterangepicker.js');
        $this->addCss('/modules/backend/assets/js/vendor/daterangepicker/daterangepicker.css');
    }

    /**
     * render this widget along with its collection of report widgets.
     */
    public function render()
    {
        $this->prepareVars();

        return $this->makePartial('dash');
    }

    /**
     * prepareVars prepares the dash data
     */
    protected function prepareVars()
    {
        $this->vars['initialState'] = $this->loadInitialState();
    }

    /**
     * defineDashReports creates a flat array of dash reports from the configuration
     * and slots reports in to their respective tabs
     */
    protected function defineDashReports()
    {
        if ($this->reportsDefined) {
            return;
        }

        /**
         * @event backend.dash.extendReportsBefore
         * Called before the dash reports are defined
         *
         * Example usage:
         *
         *     Event::listen('backend.dash.extendReportsBefore', function ((\Dashboard\Widgets\Dash) $widget) {
         *         // You should always check to see if you're extending correct model/controller
         *         if (!$widget->model instanceof \Foo\Example\Models\Bar) {
         *             return;
         *         }
         *
         *         // Add a new report named example_report
         *         $widget->addReport('example_report', [
         *             'label' => 'Example report',
         *             'type' => 'text'
         *         ]);
         *     });
         *
         * Or
         *
         *     $dashWidget->bindEvent('dash.extendReportsBefore', function () use ((\Dashboard\Widgets\Dash $dashWidget)) {
         *         // You should always check to see if you're extending correct model/controller
         *         if (!$widget->model instanceof \Foo\Example\Models\Bar) {
         *             return;
         *         }
         *
         *         // Add a new report named example_report
         *         $widget->addReport('example_report', [
         *             'label' => 'Example report',
         *             'type' => 'text'
         *         ]);
         *     });
         *
         */
        $this->fireSystemEvent('backend.dash.extendReportsBefore');

        if (!isset($this->reports) || !is_array($this->reports)) {
            $this->reports = [];
        }

        if ($this->isCustom) {
            $this->addReportsFromCustomDataSource($this->reports);
        }
        else {
            $this->addReports($this->reports);
        }

        /**
         * @event backend.dash.extendReports
         * Called after the dash reports are defined
         *
         * Example usage:
         *
         *     Event::listen('backend.dash.extendReports', function ((\Dashboard\Widgets\Dash) $widget) {
         *         // Only for the User controller
         *         if (!$widget->getController() instanceof \RainLab\User\Controllers\Users) {
         *             return;
         *         }
         *
         *         // Only for the User model
         *         if (!$widget->model instanceof \RainLab\User\Models\User) {
         *             return;
         *         }
         *
         *         // Add an extra birthday report
         *         $widget->addReports([
         *             'birthday' => [
         *                 'label'   => 'Birthday',
         *                 'type'    => 'datepicker'
         *             ]
         *         ]);
         *
         *         // Remove a Surname report
         *         $widget->removeReport('surname');
         *     });
         *
         * Or
         *
         *     $dashWidget->bindEvent('dash.extendReports', function () use ((\Dashboard\Widgets\Dash $dashWidget)) {
         *         // Only for the User controller
         *         if (!$widget->getController() instanceof \RainLab\User\Controllers\Users) {
         *             return;
         *         }
         *
         *         // Only for the User model
         *         if (!$widget->model instanceof \RainLab\User\Models\User) {
         *             return;
         *         }
         *
         *         // Add an extra birthday report
         *         $widget->addReports([
         *             'birthday' => [
         *                 'label'   => 'Birthday',
         *                 'type'    => 'datepicker'
         *             ]
         *         ]);
         *
         *         // Remove a Surname report
         *         $widget->removeReport('surname');
         *     });
         *
         */
        $this->fireSystemEvent('backend.dash.extendReports', [$this->allReports]);

        // Apply post processing
        $this->processPermissionCheck($this->allReports);
        $this->processDashWidgetReports($this->allReports);
        $this->processCustomDataDashRows($this->allReports);
        $this->processReportRows($this->allReports);

        $this->reportsDefined = true;
    }

    /**
     * addReports programmatically, used internally and for extensibility
     * @param array $reports
     */
    public function addReports(array $reports): ElementHolder
    {
        $built = [];

        foreach ($reports as $name => $config) {
            $reportObj = $built[$name] = $this->makeDashReport($name, $config);

            $this->allReports[$name] = $reportObj;
        }

        return new ElementHolder($built);
    }

    /**
     * removeField programmatically
     */
    public function removeField($name): bool
    {
        if (!isset($this->allReports[$name])) {
            return false;
        }

        unset($this->allReports[$name]);

        return true;
    }

    /**
     * addReportsFromCustomDataSource extracts the reports from a custom data source
     */
    protected function addReportsFromCustomDataSource(array $reports)
    {
        foreach ($reports as $reportRow) {
            $widgets = $reportRow['widgets'] ?? [];
            foreach ($widgets as $widget) {
                $name = $widget['reportName'] ?? 'custom_report_' . str_random();
                $this->allReports[$name] = $this->makeDashReport((string) $name, $widget);
            }
        }
    }

    /**
     * makeDashReport creates a dash report object from name and configuration
     */
    protected function makeDashReport(string $name, $config = []): DashReport
    {
        $report = new DashReport([
            'reportName' => $name,
            'label' => $config['label'] ?? null,
        ]);

        $reportType = $config['type'] ?? null;
        if (!is_string($reportType) && $reportType !== null) {
            throw new SystemException(Lang::get(
                'backend::lang.field.invalid_type',
                ['type' => gettype($reportType)]
            ));
        }

        if ($config) {
            $report->useConfig($config);
        }

        if ($reportType) {
            $report->displayAs($reportType);
        }

        return $report;
    }

    /**
     * loadInitialState for the dashboards
     */
    protected function loadInitialState()
    {
        $widgetManager = DashManager::instance();
        $defaultWidgetConfigs = $widgetManager->getDefaultWidgetConfigs();

        return [
            'locale' => App::getLocale(),
            'alias' => $this->alias,
            'colors' => [
                '#ef4444' => Lang::get('system::lang.colors.red'),
                '#f97316' => Lang::get('system::lang.colors.orange'),
                '#f59e0b' => Lang::get('system::lang.colors.amber'),
                '#84cc16' => Lang::get('system::lang.colors.lime'),
                '#22c55e' => Lang::get('system::lang.colors.green'),
                '#14b8a6' => Lang::get('system::lang.colors.teal'),
                '#06b6d4' => Lang::get('system::lang.colors.cyan'),
                '#0ea5e9' => Lang::get('system::lang.colors.sky'),
                '#3b82f6' => Lang::get('system::lang.colors.blue'),
                '#6366f1' => Lang::get('system::lang.colors.indigo'),
                '#8b5cf6' => Lang::get('system::lang.colors.violet'),
                '#ec4899' => Lang::get('system::lang.colors.pink'),
                '#f43f5e' => Lang::get('system::lang.colors.rose'),
                '#64748b' => Lang::get('system::lang.colors.slate')
            ],
            'dashboard' => [
                'name' => $this->name,
                'code' => $this->code,
                'rows' => $this->allRows,
            ],
            'manageUrl' => $this->manageUrl,
            'canCreateAndEdit' => $this->canCreateAndEdit,
            'defaultWidgetConfigs' => $defaultWidgetConfigs,
            'customWidgetGroups' => $widgetManager->listAllReportWidgetGroups(),
        ];
    }

    /**
     * onSaveDashboard handler
     */
    public function onSaveDashboard()
    {
        $definition = json_decode(post('definition'), true);
        if (!$definition) {
            return;
        }

        $definition = $this->cleanDefinitionForSave($definition);

        DashboardModel::updateDashboard(
            $this->controller,
            $this->code,
            $definition
        );
    }

    /**
     * onRunDataSourceHandler handler
     */
    public function onRunDataSourceHandler()
    {
        $handlerName = (string) post('handler');
        $widgetConfig = (array) post('widget_config');

        $dataSource = $this->getRequestedDataSource($widgetConfig);

        return $dataSource->runHandler($handlerName);
    }

    /**
     * onRunCustomWidgetHandler handler
     */
    public function onRunCustomWidgetHandler()
    {
        $handlerName = post('handler');
        $widgetConfig = post('widget_config');
        $extraData = post('extra_data', []);

        $widgetClass = $widgetConfig['widgetClass'];
        if (!$widgetClass) {
            throw new SystemException("Custom widget class [{$widgetClass}] is not set.");
        }

        $widget = DashManager::instance()->getVueReportWidget($widgetClass, $this->controller);
        if (!$widget) {
            throw new SystemException("Widget class [{$widgetClass}] not registered.");
        }

        $result = $widget->runHandler(
            $widgetConfig,
            $handlerName,
            $extraData
        );

        return $result;
    }

    /**
     * makeDataSource
     */
    protected function makeDataSource(string $dataSourceClass): ReportDataSourceBase
    {
        $dataSourceManager = DashManager::instance();
        $dataSource = $dataSourceManager->getDataSource($dataSourceClass);
        if (!$dataSource) {
            throw new SystemException("Data source [{$dataSourceClass}] class is not registered.");
        }

        return $dataSource;
    }

    /**
     * findDimension
     */
    protected function findDimension(ReportDataSourceBase $dataSource, string $dimensionCode, bool $strict): ?ReportDimension
    {
        return ReportDimension::findDimensionByCode($dataSource->getAvailableDimensions(), $dimensionCode, $strict);
    }

    /**
     * listAllMetrics
     */
    protected function listAllMetrics(ReportDataSourceBase $dataSource, string $dimensionCode): array
    {
        $metrics = $dataSource->getAvailableMetrics();
        if (strlen($dimensionCode)) {
            $dimension = $this->findDimension($dataSource, $dimensionCode, false);
            if ($dimension) {
                $dimensionMetrics = $dimension->getAvailableMetrics();
                $metrics = array_merge($metrics, $dimensionMetrics);
            }
        }

        return $metrics;
    }

    /**
     * findMetric
     */
    protected function findMetric(ReportDataSourceBase $dataSource, ReportDimension $dimension, string $metricCode): ReportMetric
    {
        $metric = ReportMetric::findMetricByCodeStrict($dimension->getAvailableMetrics(), $metricCode, false);
        if ($metric) {
            return $metric;
        }

        return ReportMetric::findMetricByCodeStrict($dataSource->getAvailableMetrics(), $metricCode, true);
    }

    /**
     * cleanDefinitionForSave removes meta data from the definition
     * since it is not needed for storage
     */
    protected function cleanDefinitionForSave($definition)
    {
        foreach ($definition as &$row) {
            unset($row['_unique_key']);

            if (isset($row['widgets']) && is_array($row['widgets'])) {
                foreach ($row['widgets'] as &$widget) {
                    unset($widget['_unique_key']);
                    unset($widget['configuration']['_dash_definition']);
                }
            }
        }

        return $definition;
    }
}
