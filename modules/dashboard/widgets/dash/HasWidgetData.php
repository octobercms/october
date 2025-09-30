<?php namespace Dashboard\Widgets\Dash;

use Str;
use Lang;
use Dashboard\Classes\DashReport;
use Dashboard\Classes\DashManager;
use Dashboard\Classes\ReportFetchData;
use Dashboard\Classes\ReportDataSourceBase;
use SystemException;

/**
 * HasWidgetData concern
 */
trait HasWidgetData
{
    /**
     * onGetWidgetData
     */
    public function onGetWidgetData()
    {
        $fetchData = new ReportFetchData;
        $fetchData->fillFromPost();

        $dataSource = $this->getRequestedDataSource(post('widget_config'));
        $fetchDataResult = $dataSource->getData($fetchData);
        // $fetchDataResult = $dataSource->getData(
        //     $dimensionCode,
        //     $metricCodes,
        //     $metricsConfiguration,
        //     $dateStart,
        //     $dateEnd,
        //     $startTimestamp,
        //     $filters,
        //     $aggregationInterval,
        //     $orderRule,
        //     $limit,
        //     $paginationParams,
        //     $hideEmptyDimensionValues,
        //     new ReportDataCache,
        //     false
        // );

        $prevIntervalFetchDataResult = null;
        if ($compareData = $fetchData->makeCompareData()) {
            $prevIntervalFetchDataResult = $dataSource->getData($compareData);
            // $prevIntervalFetchDataResult = $dataSource->getData(
            //     $dimensionCode,
            //     $metricCodes,
            //     $metricsConfiguration,
            //     $compareDateStart,
            //     $compareDateEnd,
            //     null,
            //     $filters,
            //     $aggregationInterval,
            //     $orderRule,
            //     $limit,
            //     $paginationParams,
            //     $hideEmptyDimensionValues,
            //     new ReportDataCache,
            //     false // Individual rows for previous periods are not yet supported
            // );
        }

        $metricsData = $this->getDataSourceDimensionMetricData($dataSource, $fetchData->dimensionCode);
        $dimensionData = $this->getDataSourceDimensionAndFields($dataSource, $fetchData->dimensionCode);
        $dimensionFieldsData = $this->getDataSourceDimensionFieldsData($dataSource, $fetchData->dimensionCode);

        $result = [
            'current' => [
                'widget_data' => $fetchDataResult->getRows(),
                'total_records' => $fetchDataResult->getTotalRecords(),
                'metric_totals' => $fetchDataResult->getMetricTotals(),
            ],
            'metrics_data' => $metricsData,
            'dimension_fields_data' => $dimensionFieldsData,
            'dimension_data' => $dimensionData
        ];

        if ($prevIntervalFetchDataResult) {
            $result['previous'] = [
                // 'widget_data' => $prevIntervalFetchDataResult->getRows(), // Not yet supported
                'total_records' => $prevIntervalFetchDataResult->getTotalRecords(),
                'metric_totals' => $prevIntervalFetchDataResult->getMetricTotals(),
            ];

            $result['prev_date_start'] = $fetchData->compareDateStart->toDateString();
            $result['prev_date_end'] = $fetchData->compareDateEnd->toDateString();
        }

        return $result;
    }

    /**
     * onGetWidgetCustomData
     */
    public function onGetWidgetCustomData()
    {
        $fetchData = new ReportFetchData;
        $fetchData->fillFromPost();

        $widgetClass = post('widget_config[widgetClass]');
        if (!$widgetClass) {
            throw new SystemException("Custom widget class [{$widgetClass}] is not set.");
        }

        $widget = DashManager::instance()->getVueReportWidget(
            $widgetClass,
            $this->controller
        );

        if (!$widget) {
            throw new SystemException("Widget class [{$widgetClass}] not registered.");
        }

        $data = $widget->getData($fetchData);
        // $data = $widget->getData(
        //     $widgetConfig,
        //     $dateStart,
        //     $dateEnd,
        //     $startTimestamp,
        //     $compareDateStart,
        //     $compareDateEnd,
        //     $aggregationInterval,
        //     $extraData
        // );

        return [
            'data' => $data
        ];
    }

    /**
     * onGetWidgetStaticContent
     */
    public function onGetWidgetStaticContent()
    {
        $widgetConfig = (array) post('widget_config');
        $reportName = $widgetConfig['reportName'] ?? null;
        if (!isset($widgetConfig['type']) || $widgetConfig['type'] !== 'static') {
            return false;
        }

        $widget = $this->getConfiguredReportWidget();
        if (!$widget) {
            $reportName = post('widget_config.reportName');
            throw new SystemException("Report [{$reportName}] is not registered");
        }

        $properties = $this->getWidgetPropertiesForBrowser($widget);

        return [
            'result' => $widget->render(),
            'properties' => $properties
        ];
    }

    /**
     * getWidgetPropertiesForBrowser
     */
    protected function getWidgetPropertiesForBrowser($widget): array
    {
        $result = [];
        $properties = $widget->defineProperties();

        foreach ($properties as $name => $params) {
            $property = [
                'property' => $name,
                'title' => isset($params['title']) ? __($params['title']) : $name,
                'type' => $params['type'] ?? 'string'
            ];

            foreach ($params as $name => $value) {
                if (isset($property[$name])) {
                    continue;
                }

                $property[$name] = !is_array($value) ? __($value) : $value;
            }

            $result[] = $property;
        }

        return $result;
    }

    /**
     * getConfiguredReportWidget
     */
    protected function getConfiguredReportWidget()
    {
        $widgetConfig = (array) post('widget_config');

        $reportName = $widgetConfig['reportName']
            ?? 'custom_report_'.post('_unique_key', Str::random());

        $widget = $this->getReportWidget($reportName);

        if (!$widget) {
            $widget = $this->makeDashReportWidget(new DashReport([
                'reportName' => $reportName
            ] + $widgetConfig));
        }

        return $widget;
    }

    /**
     * getDataSourceDimensionMetricData
     */
    private function getDataSourceDimensionMetricData(ReportDataSourceBase $dataSource, string $dimensionCode): array
    {
        $result = [];
        $allMetrics = $this->listAllMetrics($dataSource, $dimensionCode);
        foreach ($allMetrics as $metric) {
            $result[$metric->getCode()] = [
                'label' => Lang::get($metric->getDisplayName()),
                'format_options' => $metric->getIntlFormatOptions()
            ];
        }

        return $result;
    }

    /**
     * getDataSourceDimensionFieldsData
     */
    private function getDataSourceDimensionFieldsData($dataSource, $dimensionCode)
    {
        $dimension = $this->findDimension($dataSource, $dimensionCode, false);
        if (!$dimension) {
            return [];
        }

        $fields = $dimension->getDimensionFields();
        $result = [];
        foreach ($fields as $field) {
            $result[$field->getCode()] = Lang::get($field->getDisplayName());
        }

        return $result;
    }

    /**
     * getDataSourceDimensionAndFields
     */
    private function getDataSourceDimensionAndFields(ReportDataSourceBase $dataSource, string $dimensionCode): array
    {
        $result = [];

        $dimension = $this->findDimension($dataSource, $dimensionCode, false);
        if ($dimension) {
            $result[$dimension->getDataSetColumName()] = Lang::get($dimension->getDisplayName());
        }

        return $result;
    }

    /**
     * getRequestedDataSource
     */
    protected function getRequestedDataSource(array $widgetConfig): ReportDataSourceBase
    {
        if (!isset($widgetConfig['dataSource'])) {
            throw new SystemException('Report widget data source class is not set');
        }

        return $this->makeDataSource($widgetConfig['dataSource']);
    }
}
