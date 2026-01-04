<?php namespace Dashboard\Classes;

use Dashboard\Widgets\Dash;
use Dashboard\Classes\DashReport;
use Dashboard\Classes\ReportDataOrderRule;
use Dashboard\Classes\ReportDataPaginationParams;
use Dashboard\Classes\ReportDateDataSet;
use Dashboard\Classes\ReportDimension;
use Dashboard\Classes\ReportDimensionFilter;
use Dashboard\Classes\ReportPeriodCalculator;
use Dashboard\Classes\ReportFetchDataResult;
use Dashboard\Classes\ReportMetric;
use Dashboard\Classes\ReportMetricConfiguration;
use Dashboard\Models\ReportDataCache;
use Carbon\CarbonPeriod;
use Carbon\Carbon;
use SystemException;

/**
 * ReportFetchData represents the report data for fetching.
 */
class ReportFetchData
{
    /**
     * @var DashReport dashReport element
     */
    public $dashReport;

    /**
     * @var array widgetConfig
     */
    public $widgetConfig;

    /**
     * @var array extraData
     */
    public $extraData;

    /**
     * @var ReportDimension dimension specifies the dimension to group the data by.
     */
    public $dimension;

    /**
     * @var string dimensionCode specifies the dimension to group the data by.
     */
    public $dimensionCode;

    /**
     * @var ReportMetric[] metrics specifies the metrics to return.
     */
    public $metrics;

    /**
     * @var array metricCodes specifies the metrics to return.
     */
    public $metricCodes;

    /**
     * @var ReportMetricConfiguration[] metricsConfiguration specifies the report metrics configuration.
     */
    public $metricsConfiguration;

    /**
     * @var Carbon dateStart specifies the start date.
     */
    public $dateStart;

    /**
     * @var Carbon dateEnd specifies the end date.
     */
    public $dateEnd;

    /**
     * @var Carbon dateStart specifies the start date.
     */
    public $compareDateStart;

    /**
     * @var Carbon dateEnd Specifies the end date.
     */
    public $compareDateEnd;

    /**
     * @var int startTimestamp Optional. Specifies the starting timestamp for relative intervals.
     * Either $startTimestamp must be set, or both $dateStart and $dateEnd.
     */
    public $startTimestamp;

    /**
     * @var ReportDimensionFilter[] dimensionFilters specifies the filters to apply to the dimension values.
     */
    public $dimensionFilters;

    /**
     * @var string groupInterval specifies the group interval.
     * One of the GROUP_INTERVAL_* constants.
     * Only applies if the dimension is a date dimension.
     * If not specified, the default group interval GROUP_INTERVAL_DAY will be used.
     */
    public $groupInterval;

    /**
     * @var ReportDataOrderRule orderRule specifies the data ordering rule.
     */
    public $orderRule;

    /**
     * @var int limit specifies the maximum number of records to return.
     */
    public $limit;

    /**
     * @var ReportDataPaginationParams paginationParams specifies the pagination parameters.
     * Either $limit or $paginationParams or none can be set.
     */
    public $paginationParams;

    /**
     * @var bool hideEmptyDimensionValues indicates whether empty dimension values must be
     * removed from the dataset.
     */
    public $hideEmptyDimensionValues;

    /**
     * @var ReportDataCache reportDataCache specifies the cache to use.
     */
    public $reportDataCache;

    /**
     * @var bool totalsOnly indicates that the method should only return total values
     * for metrics, and not rows.
     */
    public $totalsOnly = false;

    /**
     * @var bool resetCache indicates that the cache should be reset.
     */
    public $resetCache = false;

    /**
     * fillFromPost
     */
    public function fillFromPost()
    {
        $this->widgetConfig = (array) post('widget_config');
        $this->extraData = (array) post('extra_data', []);

        $this->dimensionCode = post('dimension');
        $this->metricCodes = post('metrics');
        $this->groupInterval = post('aggregation_interval');
        $this->resetCache = (bool) post('reset_cache');

        $this->limit = !empty($this->widgetConfig['limit']) ? (int) $this->widgetConfig['limit'] : null;
        $this->hideEmptyDimensionValues = $this->widgetConfig['empty_dimension_values'] ?? null === 'hide';

        [$this->dateStart, $this->dateEnd, $this->startTimestamp] = $this->getRequestedDateInterval(post('date_start'), post('date_end'));
        [$this->compareDateStart, $this->compareDateEnd] = $this->getRequestedCompareInterval(post('compare'));

        $this->orderRule = $this->makeRequestedOrderRule();
        $this->paginationParams = $this->getRequestedPaginationParams();
        $this->metricsConfiguration = $this->getRequestedMetricsConfiguration();
        $this->dimensionFilters = $this->getRequestedWidgetFilters();

        $this->reportDataCache = new ReportDataCache;
    }

    /**
     * makeCompareData
     */
    public function makeCompareData()
    {
        if (!$this->compareDateStart || !$this->compareDateEnd) {
            return null;
        }

        $compare = clone $this;
        $compare->dateStart = $this->compareDateStart;
        $compare->dateEnd = $this->compareDateEnd;
        return $compare;
    }

    /**
     * getRequestedDateInterval
     */
    protected function getRequestedDateInterval(?string $dashboardDateStart, ?string $dashboardDateEnd): array
    {
        $widgetInterval = isset($this->widgetConfig['date_interval'])
            ? $this->widgetConfig['date_interval']
            : Dash::INTERVAL_TYPE_DASHBOARD;

        $dateStart = null;
        $startTimestamp = null;
        $dateEnd = Carbon::now();

        switch ($widgetInterval) {
            case Dash::INTERVAL_TYPE_DASHBOARD:
                $dateStart = Carbon::parse($dashboardDateStart);
                $dateEnd = Carbon::parse($dashboardDateEnd);
                break;
            case Dash::INTERVAL_TYPE_YEAR:
                $dateStart = Carbon::now()->startOfYear();
                break;
            case Dash::INTERVAL_TYPE_QUARTER:
                $dateStart = Carbon::now()->startOfQuarter();
                break;
            case Dash::INTERVAL_TYPE_MONTH:
                $dateStart = Carbon::now()->startOfMonth();
                break;
            case Dash::INTERVAL_TYPE_WEEK:
                $dateStart = Carbon::now()->startOfWeek(Carbon::MONDAY); // TODO
                break;
            case Dash::INTERVAL_TYPE_HOUR:
                $dateEnd = null;
                $startTimestamp = time() - 3600;
                break;
            case Dash::INTERVAL_TYPE_DAYS:
                $days = isset($this->widgetConfig['date_interval_days'])
                    ? $this->widgetConfig['date_interval_days']
                    : 1;
                $dateStart = Carbon::now()->subDays($days - 1);
                break;
            default:
                throw new SystemException("Unknown widget report interval {$widgetInterval}");
        }

        return [
            $dateStart,
            $dateEnd,
            $startTimestamp
        ];
    }

    /**
     * getRequestedCompareInterval
     */
    protected function getRequestedCompareInterval(?string $compare): array
    {
        if (!$compare) {
            return [null, null];
        }

        if (!$this->dateStart && $this->dateEnd) {
            return [null, null];
        }

        if (!in_array($compare, ['prev-period', 'prev-year'])) {
            throw new SystemException('Invalid compare specifier');
        }

        $periodCalculator = new ReportPeriodCalculator;

        if ($compare === 'prev-period') {
            $range = $periodCalculator->getPreviousPeriod($this->dateStart, $this->dateEnd);
        }
        else {
            $range = $periodCalculator->getPreviousPeriodLastYear($this->dateStart, $this->dateEnd);
        }

        if (!$range) {
            return [null, null];
        }

        return [$range->getStartDate(), $range->getEndDate()];
    }

    /**
     * makeRequestedOrderRule
     */
    protected function makeRequestedOrderRule(): ReportDataOrderRule
    {
        if (
            !array_key_exists('sortBy', $this->widgetConfig) ||
            !array_key_exists('sortOrder', $this->widgetConfig)
        ) {
            return new ReportDataOrderRule(ReportDataOrderRule::ATTR_TYPE_DIMENSION);
        }

        $sortBy = $this->widgetConfig['sortBy'];
        $sortOrder = $this->widgetConfig['sortOrder'];
        return ReportDataOrderRule::createFromWidgetConfig($sortOrder, $sortBy);
    }

    /**
     * getRequestedPaginationParams
     */
    protected function getRequestedPaginationParams(): ?ReportDataPaginationParams
    {
        if (empty($this->widgetConfig['records_per_page'])) {
            return null;
        }

        if (!array_key_exists('current_page', $this->extraData)) {
            throw new SystemException('Current page is not set for a paginated query');
        }

        return new ReportDataPaginationParams(
            (int) $this->widgetConfig['records_per_page'],
            (int) $this->extraData['current_page']
        );
    }

    /**
     * getRequestedMetricsConfiguration
     */
    protected function getRequestedMetricsConfiguration(): array
    {
        if (!$this->metricCodes) {
            return [];
        }

        $result = [];

        foreach ($this->metricCodes as $metricCode) {
            $result[$metricCode] = $this->findMetricInWidgetConfig($metricCode, $this->widgetConfig);
        }

        return $result;
    }

    /**
     * findMetricInWidgetConfig
     */
    protected function findMetricInWidgetConfig(string $code): ?ReportMetricConfiguration
    {
        if (!isset($this->widgetConfig['metrics'])) {
            return new ReportMetricConfiguration(false, false);
        }

        foreach ($this->widgetConfig['metrics'] as $metricData) {
            $metricCode = isset($metricData['metric']) ? $metricData['metric'] : null;
            if (!$metricCode || $metricCode !== $code) {
                continue;
            }

            $displayTotals = isset($metricData['displayTotals']) ? $metricData['displayTotals'] : false;
            $displayRelativeBar = isset($metricData['displayRelativeBar']) ? $metricData['displayRelativeBar'] : false;

            return new ReportMetricConfiguration($displayTotals, $displayRelativeBar);
        }

        return new ReportMetricConfiguration(false, false);
    }

    /**
     * getRequestedWidgetFilters
     */
    protected function getRequestedWidgetFilters(): array
    {
        if (!array_key_exists('filters', $this->widgetConfig)) {
            return [];
        }

        $filters = $this->widgetConfig['filters'];
        if (!is_array($filters)) {
            return [];
        }

        $result = [];
        foreach ($filters as $filterConfig) {
            $attribute = $filterConfig['filter_attribute'];
            $attributeType = $attribute === 'oc_dimension'
                ? ReportDimensionFilter::ATTR_TYPE_DIMENSION
                : ReportDimensionFilter::ATTR_TYPE_DIMENSION_FIELD;

            $attrName = $attributeType !== ReportDimensionFilter::ATTR_TYPE_DIMENSION
                ? $attribute
                : null;

            $operation = $filterConfig['operation'];
            $value = null;
            if ($operation !== ReportDimensionFilter::OPERATION_ONE_OF) {
                $value = $filterConfig['value_scalar'];
            }
            else {
                $value = $filterConfig['value_array'];
                $value = array_filter(array_map('trim', explode("\n", $value)), 'strlen');
            }

            $filter = new ReportDimensionFilter(
                $attributeType,
                $attrName,
                $operation,
                $value
            );

            $result[] = $filter;
        }

        return $result;
    }
}
