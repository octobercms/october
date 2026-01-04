<?php namespace Dashboard\Classes;

use Dashboard\Classes\ReportDataOrderRule;
use Dashboard\Classes\ReportDataPaginationParams;
use Dashboard\Classes\ReportDateDataSet;
use Dashboard\Classes\ReportDimension;
use Dashboard\Classes\ReportDimensionFilter;
use Dashboard\Classes\ReportFetchDataResult;
use Dashboard\Classes\ReportFetchData;
use Dashboard\Classes\ReportMetric;
use Dashboard\Classes\ReportMetricConfiguration;
use Dashboard\Models\ReportDataCache;
use Carbon\CarbonPeriod;
use Carbon\Carbon;
use SystemException;

/**
 * ReportDataSourceBase class are used by report widgets to get their data.
 *
 * @package october\dashboard
 * @author Alexey Bobkov, Samuel Georges
 */
abstract class ReportDataSourceBase
{
    use \System\Traits\ViewMaker;

    const GROUP_INTERVAL_DAY = 'day';
    const GROUP_INTERVAL_WEEK = 'week';
    const GROUP_INTERVAL_MONTH = 'month';
    const GROUP_INTERVAL_QUARTER = 'quarter';
    const GROUP_INTERVAL_YEAR = 'year';
    const GROUP_INTERVAL_FULL = 'full';

    private $knownGroupIntervals = [
        self::GROUP_INTERVAL_DAY,
        self::GROUP_INTERVAL_WEEK,
        self::GROUP_INTERVAL_MONTH,
        self::GROUP_INTERVAL_QUARTER,
        self::GROUP_INTERVAL_YEAR,
        self::GROUP_INTERVAL_FULL
    ];

    /**
     * @var ReportDimension[]|null Cache of registered dimensions.
     */
    private $dimensions = null;

    /**
     * @var ReportMetric[] Cache of common registered metrics.
     */
    private $metrics = [];

    /**
     * getData returns the data for the specified report.
     */
    public function getData(ReportFetchData $data): ReportFetchDataResult
    {
        if ($data->limit !== null && $data->paginationParams) {
            throw new SystemException('Limit and pagination parameters cannot be both set.');
        }

        if (($data->dateStart || $data->dateEnd) && $data->startTimestamp !== null) {
            throw new SystemException('Start and end dates cannot be set if the start timestamp is also set.');
        }

        if (!$data->dateStart && $data->startTimestamp === null) {
            throw new SystemException('Either the start and end dates or the start timestamp must be set.');
        }

        $dimension = ReportDimension::findDimensionByCode(
            $this->getAvailableDimensions(),
            $data->dimensionCode
        );

        $metrics = [];
        foreach ($data->metricCodes as $metricCode) {
            $metric = ReportMetric::findMetricByCodeStrict(
                $dimension->getAvailableMetrics(),
                $metricCode,
                false
            );

            if (!$metric) {
                $metric = ReportMetric::findMetricByCodeStrict(
                    $this->getAvailableMetrics(),
                    $metricCode
                );
            }

            $metrics[] = $metric;
        }

        $this->assertValidOrderRule($data->orderRule, $dimension);
        $this->assertValidFilters($data->dimensionFilters, $dimension);

        $groupInterval = $this->validateDateGroupInterval($data->groupInterval, $dimension);

        $data->metrics = $metrics;
        $data->dimension = $dimension;
        $data->groupInterval = $groupInterval;

        $fetchResult = $this->fetchData($data);

        if ($dimension->isDate() && $data->dateStart) {
            $range = CarbonPeriod::create($data->dateStart, $data->dateEnd);
            $dataset = new ReportDateDataSet($dimension, $metrics, $range, $data->orderRule, $groupInterval, $fetchResult->getRows());
            $rows = $dataset->aggregateData($groupInterval);
            $fetchResult->setRows($rows);
        }

        return $fetchResult;
    }

    /**
     * getAvailableDimensions returns the available dimensions for this data source.
     * Dimensions are attributes of data, e.g. date or "page_path".
     * @return ReportDimension[]
     */
    public function getAvailableDimensions(): array
    {
        if ($this->dimensions === null) {
            throw new SystemException('The dimensions are not registered in ' . get_class($this));
        }

        return $this->dimensions;
    }

    /**
     * getAvailableMetrics returns the available metrics for this data source.
     * Metrics are measures of data, e.g. "page views".
     * @return ReportMetric[]
     */
    public function getAvailableMetrics(): array
    {
        return $this->metrics;
    }

    /**
     * runHandler runs a data source event handler.
     * @param string $handlerName The name of the handler.
     * @return mixed The data to pass to the client-side handler caller.
     */
    public function runHandler(string $handlerName)
    {
        if (!preg_match('/^on/i', $handlerName)) {
            throw new SystemException('Invalid data source handler name ' . $handlerName);
        }

        if (!method_exists($this, $handlerName)) {
            throw new SystemException('Data source handler method doesn\'t exist ' . $handlerName);
        }

        return $this->$handlerName();
    }

    /**
     * registerDimension registers a new dimension.
     * @param ReportDimension $dimension Dimension to register
     * @return ReportDimension Returns the added dimension, for chaining
     */
    protected function registerDimension(ReportDimension $dimension): ReportDimension
    {
        if ($this->dimensions === null) {
            $this->dimensions = [];
        }

        $knownDimension = array_filter(
            $this->dimensions,
            fn ($item) => $item->getCode() === $dimension->getCode()
        );

        if (count($knownDimension)) {
            throw new SystemException('The dimension is already registered: ' . $dimension->getCode());
        }

        return $this->dimensions[] = $dimension;
    }

    /**
     * addCalculatedDimension is a shorthand version of registerDimension.
     * Adds a calculated dimension that doesn't have a corresponding database column.
     * @param string $code Specifies the dimension referral code.
     * For special dimension types, the code should begin with the respective type prefix,
     * for instance, `indicator@`. These special dimension types are defined by the
     * ReportDimension::TYPE_XXX constants.
     * @param string $displayName Specifies the dimension name used in reports.
     * @return ReportDimension Returns the added dimension, for chaining.
     */
    protected function addCalculatedDimension(string $code, string $displayName)
    {
        return $this->registerDimension(new ReportDimension(
            $code,
            $code,
            $displayName
        ));
    }

    /**
     * registerMetric registers a new common metric.
     * Common metrics can be used with any dimension provided by the data source.
     */
    protected function registerMetric(ReportMetric $metric)
    {
        $knownMetric = array_filter(
            $this->metrics,
            fn ($item) => $item->getCode() === $metric->getCode()
        );

        if (count($knownMetric)) {
            throw new SystemException('The metric is already registered: ' . $metric->getCode());
        }

        $this->metrics[] = $metric;
    }

    /**
     * fetchData returns the data for the specified report.
     */
    abstract protected function fetchData(ReportFetchData $data): ReportFetchDataResult;

    /**
     * makeResultRow helps format a result row expected in the fetchData return value.
     * @param ReportDimension $dimension Dimension corresponding to the data row.
     * @param array $metricsAndValues An associative array of metric codes and values.
     * The array key is the metric code. The method doesn't check if dimensions exist
     * in the data source.
     * @return array Returns a properly formatted data row
     */
    protected function makeResultRow(ReportDimension $dimension, array $metricsAndValues)
    {
        $result = [
            'oc_dimension' => $dimension->getCode()
        ];

        foreach ($metricsAndValues as $metricCode => $value) {
            if (!is_string($metricCode)) {
                throw new SystemException('Metric code must be a string.');
            }

            $result['oc_metric_'.$metricCode] = $value;
        }

        return [(object) $result];
    }

    /**
     * Validates the specified group interval.
     * @param string $groupInterval Specifies the group interval.
     * @param ReportDimension $dimension Specifies the dimension to group the data by.
     * @return ?string Returns the validated group interval.
     */
    private function validateDateGroupInterval(?string $groupInterval, ReportDimension $dimension): ?string
    {
        if (!$groupInterval && $dimension->isDate()) {
            $groupInterval = self::GROUP_INTERVAL_DAY;
        }

        if ($groupInterval && !$dimension->isDate()) {
            return null;
        }

        if ($groupInterval && !in_array($groupInterval, $this->knownGroupIntervals)) {
            throw new SystemException("Invalid group interval: {$groupInterval}");
        }

        return $groupInterval;
    }

    /**
     * assertValidOrderRule
     */
    private function assertValidOrderRule(?ReportDataOrderRule $orderRule, ReportDimension $dimension)
    {
        if ($orderRule && $orderRule->getDataAttributeType() === ReportDataOrderRule::ATTR_TYPE_DIMENSION_FIELD) {
            $dimensionField = $dimension->findDimensionFieldByCode($orderRule->getAttributeName());
            if (!$dimensionField->getIsSortable()) {
                $fieldCode = $dimensionField->getCode();
                throw new SystemException("Dimension field {$fieldCode} is not sortable.");
            }
        }
    }

    /**
     * assertValidFilters
     */
    private function assertValidFilters(array $filters, ReportDimension $dimension)
    {
        foreach ($filters as $filter) {
            if ($filter->getDataAttributeType() !== ReportDataOrderRule::ATTR_TYPE_DIMENSION_FIELD) {
                continue;
            }

            $dimensionField = $dimension->findDimensionFieldByCode($filter->getAttributeName());
            if (!$dimensionField->getIsFilterable()) {
                $fieldCode = $dimensionField->getCode();
                throw new SystemException("Dimension field {$fieldCode} is not filterable.");
            }
        }
    }
}
