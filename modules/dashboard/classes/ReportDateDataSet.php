<?php namespace Dashboard\Classes;

use Dashboard\Classes\ReportDataSourceBase;
use Carbon\CarbonPeriod;
use Carbon\Carbon;
use ApplicationException;
use stdClass;

/**
 * ReportDateDataSet represents a data set for a date dimension.
 */
class ReportDateDataSet
{
    /**
     * @var ReportDimension
     */
    private $dimension;

    /**
     * @var ReportMetric[]
     */
    private $metrics;

    /**
     * @var CarbonPeriod
     */
    private $range;

    /**
     * @var array
     */
    private $values;

    /**
     * @var ?ReportDataOrderRule
     */
    private $orderRule;

    /**
     * @var string
     */
    private $groupInterval;

    /**
     * @param ReportDimension $dimension Specifies the dimension of the data set.
     * @param ReportMetric[] $metrics Specifies the data metrics.
     * @param CarbonPeriod $range Specifies the date range.
     * @param string $groupInterval Specifies the group interval.
     * One of the ReportDataSourceBase::GROUP_INTERVAL_* constants.
     * @param array $values Data values.
     * @param ?ReportDataOrderRule $orderRule Specifies the data ordering rule.
     */
    public function __construct(
        ReportDimension $dimension,
        array $metrics,
        CarbonPeriod $range,
        ?ReportDataOrderRule $orderRule,
        string $groupInterval,
        array $values
    ) {
        $this->dimension = $dimension;
        $this->metrics = $metrics;
        $this->range = $range;
        $this->values = $values;
        $this->orderRule = $orderRule;
        $this->groupInterval = $groupInterval;
    }

    /**
     * Adds values to the dataset
     * @param array $values Data values to add.
     */
    public function addValues(array $values)
    {
        $this->values = [...$this->values, ...$values];
    }

    /**
     * Adds values loaded from a cache
     * @param array $values Values to add
     */
    public function addValuesFromCache(array $values)
    {
        foreach ($values as $valueArray) {
            $this->values[] = (object)$valueArray;
        }
    }

    /**
     * Adds missing data points and properties.
     * @return array Returns the normalized data.
     */
    public function getNormalizedData(): array
    {
        $result = [];

        $columnNames = $this->getColumnNames();

        foreach ($this->range as $date) {
            $reportDate = $date->toDateString();
            $dataPoint = $this->getDataPoint($reportDate);

            if ($dataPoint) {
                $dataPoint = $this->addMissingColumns($dataPoint, $columnNames);
            }
            else {
                if (!$this->isStartOfGroupInterval($date)) {
                    continue;
                }

                $dataPoint = $this->makeNoDataObject($columnNames, $reportDate);
            }

            $result[$reportDate] = $dataPoint;
        }

        if ($this->orderRule && $this->orderRule->getDataAttributeType() === ReportDataOrderRule::ATTR_TYPE_DIMENSION) {
            $orderRule = $this->orderRule;
            $dimensionColumnName = $this->dimension->getDataSetColumName();
            usort($result, function ($a, $b) use ($orderRule, $dimensionColumnName) {
                $valueA = $a->$dimensionColumnName;
                $valueB = $b->$dimensionColumnName;

                $result = strcmp($valueA, $valueB);
                if (!$orderRule->isAscending()) {
                    $result *= -1;
                }

                return $result;
            });
        }

        $this->sortDataArray($result);
        return $result;
    }

    /**
     * Aggregates metric values in the dataset.
     * @param string $groupInterval Specifies the group interval.
     * One of the ReportDataSourceBase::GROUP_INTERVAL_* constants.
     */
    public function aggregateData(string $groupInterval): array
    {
        $values = $this->getNormalizedData();
        if ($groupInterval === ReportDataSourceBase::GROUP_INTERVAL_DAY) {
            // Values are already aggregated by day.
            return $values;
        }

        $dimensionColumnName = $this->dimension->getDataSetColumName();
        $columnNames = $this->getColumnNames(true);
        $metricAggregateFunctions = $this->getMetricAggregateFunctions();

        $result = [];
        foreach ($values as $dataPoint) {
            $dimensionValue = $dataPoint->$dimensionColumnName;
            $dimensionDate = Carbon::parse($dimensionValue);
            $aggregationSetName = $this->getAggregationSetName($dimensionDate, $groupInterval);

            if (!array_key_exists($aggregationSetName, $result)) {
                $result[$aggregationSetName] = $this->makeNoDataObject($columnNames, $aggregationSetName);
            }

            $this->addMetricValuesToAggregationSet(
                $result[$aggregationSetName],
                $columnNames,
                $metricAggregateFunctions,
                $dataPoint
            );
        }

        return array_values($result);
    }

    private function getDataPoint(string $dimensionValue): ?object
    {
        $columnName = $this->dimension->getDataSetColumName();
        foreach ($this->values as $valueObject) {
            if ($valueObject->$columnName === $dimensionValue) {
                return $valueObject;
            }
        }

        return null;
    }

    private function getColumnNames($excludeDimension = false): array
    {
        $result = [];
        if (!$excludeDimension) {
            $result[] = $this->dimension->getDataSetColumName();
        }

        foreach ($this->metrics as $metric) {
            $result[] = $metric->getDataSetColumName();
        }

        return $result;
    }

    private function addMissingColumns(object $value, array $columnNames): object
    {
        $result = $value;

        foreach ($columnNames as $columnName) {
            if (!property_exists($value, $columnName)) {
                $result->$columnName = null;
            }
        }

        return $result;
    }

    private function makeNoDataObject(array $columnNames, string $dimensionValue): object
    {
        $result = new stdClass();
        foreach ($columnNames as $column) {
            $result->$column = null;
        }

        $dimensionColumnName = $this->dimension->getDataSetColumName();
        $result->$dimensionColumnName = $dimensionValue;

        return $result;
    }

    private function sortDataArray(array &$result)
    {
        if (!$this->orderRule || $this->orderRule->getDataAttributeType() !== ReportDataOrderRule::ATTR_TYPE_DIMENSION) {
            return;
        }

        $orderRule = $this->orderRule;
        $dimensionColumnName = $this->dimension->getDataSetColumName();
        usort($result, function ($a, $b) use ($orderRule, $dimensionColumnName) {
            $valueA = $a->$dimensionColumnName;
            $valueB = $b->$dimensionColumnName;

            $cmp = strcmp($valueA, $valueB);
            if (!$orderRule->isAscending()) {
                $cmp *= -1;
            }

            return $cmp;
        });
    }

    private function getAggregationSetName(Carbon $date, string $interval)
    {
        switch ($interval) {
            case ReportDataSourceBase::GROUP_INTERVAL_FULL:
                return 'all';
            case ReportDataSourceBase::GROUP_INTERVAL_DAY:
                return $date->toDateString();
            case ReportDataSourceBase::GROUP_INTERVAL_WEEK:
                $date->startOfWeek(Carbon::MONDAY);
                return $date->toDateString();
            case ReportDataSourceBase::GROUP_INTERVAL_MONTH:
                return $date->startOfMonth()->toDateString();
            case ReportDataSourceBase::GROUP_INTERVAL_QUARTER:
                return $date->startOfQuarter()->toDateString();
            case ReportDataSourceBase::GROUP_INTERVAL_YEAR:
                return $date->startOfYear()->toDateString();
            default:
                throw new ApplicationException('Invalid interval: '.$interval);
        }
    }

    private function getMetricAggregateFunctions(): array
    {
        $result = [];
        foreach ($this->metrics as $metric) {
            $function = $metric->getAggregateFunction();
            $result[$metric->getDataSetColumName()] = $function;
        }

        return $result;
    }

    private function addMetricValuesToAggregationSet(
        object $aggregationSet,
        array $columnNames,
        array $metricAggregateFunctions,
        object $dataPoint
    ) {
        foreach ($columnNames as $columnName) {
            $aggregatedValue = $aggregationSet->$columnName;
            $metricValue = $dataPoint->$columnName;

            if (!array_key_exists($columnName, $metricAggregateFunctions)) {
                throw new ApplicationException('Invalid metric column name: '.$columnName);
            }

            $aggregateFunction = $metricAggregateFunctions[$columnName];
            switch ($aggregateFunction) {
                case ReportMetric::AGGREGATE_COUNT:
                    if ($metricValue !== null) {
                        $aggregatedValue = $aggregatedValue === null ? 1 : $aggregatedValue + 1;
                    }
                    break;
                case ReportMetric::AGGREGATE_MAX:
                        $aggregatedValue = $aggregatedValue === null ? $metricValue : max($aggregatedValue, $metricValue);
                    break;
                case ReportMetric::AGGREGATE_MIN:
                        $aggregatedValue = $aggregatedValue === null ? $metricValue : min($aggregatedValue, $metricValue);
                    break;
                case ReportMetric::AGGREGATE_SUM:
                        $aggregatedValue = $aggregatedValue === null ? $metricValue : $aggregatedValue + $metricValue;
                    break;
                default:
                    throw new ApplicationException('Invalid aggregate function: '.$aggregateFunction);
            }

            $aggregationSet->$columnName = $aggregatedValue;
        }
    }

    private function isStartOfGroupInterval(Carbon $date): bool
    {
        if ($this->groupInterval === ReportDataSourceBase::GROUP_INTERVAL_WEEK) {
            return $date->dayOfWeek === Carbon::MONDAY;
        }

        if ($this->groupInterval === ReportDataSourceBase::GROUP_INTERVAL_MONTH) {
            return $date->day === 1;
        }

        if ($this->groupInterval === ReportDataSourceBase::GROUP_INTERVAL_QUARTER) {
            return $date->day == 1 && in_array($date->month, [1, 4, 7, 10]);
        }

        if ($this->groupInterval === ReportDataSourceBase::GROUP_INTERVAL_YEAR) {
            return $date->month === 1 && $date->day === 1;
        }

        return true;
    }
}
