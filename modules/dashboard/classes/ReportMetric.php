<?php namespace Dashboard\Classes;

use SystemException;

/**
 * ReportMetric represents a report data source metric.
 */
class ReportMetric
{
    const AGGREGATE_SUM = 'sum';
    const AGGREGATE_AVG = 'avg';
    const AGGREGATE_MIN = 'min';
    const AGGREGATE_MAX = 'max';
    const AGGREGATE_COUNT = 'count';
    const AGGREGATE_NONE = 'none';
    const AGGREGATE_COUNT_DISTINCT = 'count_distinct';
    const AGGREGATE_COUNT_DISTINCT_NOT_NULL = 'count_distinct_not_null';

    /**
     * @var string Specifies the metric referral code.
     */
    private $code;

    /**
     * @var string Specifies the column name in the data source table.
     */
    private $databaseColumnName;

    /**
     * @var string Specifies the report metric name used in reports.
     */
    private $displayName;

    /**
     * @var string Specifies the aggregate function for the metric.
     * One of the AGGREGATE_* constants.
     */
    private $aggregateFunction;

    /**
     * @var ?array Client-side data formatting options.
     */
    private $intlFormatOptions;

    /**
     * @var ?callable Server-side formatter for human-readable display values.
     */
    private $displayFormatter;

    /**
     * __construct a new metric instance.
     * @param string $code Specifies the metric referral code.
     * @param string $databaseColumnName Specifies the column name in the data source table.
     * @param string $displayName Specifies the metric name used in reports.
     * @param string $aggregateFunction Specifies the aggregate function for the metric.
     * @param ?array $intlFormatOptions Client-side formatting options, compatible with the Intl.NumberFormat() constructor options argument.
     * Skip the argument to use the default formatting options.
     */
    public function __construct(string $code, string $databaseColumnName, string $displayName, string $aggregateFunction, ?array $intlFormatOptions = null)
    {
        if (!strlen($code)) {
            throw new SystemException('The metric code cannot be empty.');
        }

        if (!preg_match('/^[a-z][a-z0-9_]+$/i', $code)) {
            throw new SystemException('The metric code can only contain Latin letters, numbers and underscore. The first character must be a letter');
        }

        if (!strlen($databaseColumnName)) {
            throw new SystemException('The database column name cannot be empty.');
        }

        if (!strlen($displayName)) {
            throw new SystemException('The display name cannot be empty.');
        }

        if (!strlen($aggregateFunction)) {
            throw new SystemException('The aggregate function cannot be empty.');
        }

        $knownAggregateFunctions = [
            self::AGGREGATE_SUM,
            self::AGGREGATE_AVG,
            self::AGGREGATE_MIN,
            self::AGGREGATE_MAX,
            self::AGGREGATE_COUNT,
            self::AGGREGATE_NONE,
            self::AGGREGATE_COUNT_DISTINCT,
            self::AGGREGATE_COUNT_DISTINCT_NOT_NULL
        ];

        if (!in_array($aggregateFunction, $knownAggregateFunctions)) {
            throw new SystemException('The aggregate function is not supported: ' . $aggregateFunction);
        }

        $this->code = $code;
        $this->databaseColumnName = $databaseColumnName;
        $this->displayName = $displayName;
        $this->aggregateFunction = $aggregateFunction;
        $this->intlFormatOptions = $intlFormatOptions;
    }

    /**
     * Returns the metric code.
     * @return string Returns the metric code.
     */
    public function getCode(): string
    {
        return $this->code;
    }

    /**
     * Returns the metric display name.
     * @return string
     */
    public function getDisplayName(): string
    {
        return $this->displayName;
    }

    /**
     * Returns the metric aggregate function.
     * @return string Returns the metric aggregate function, one of the AGGREGATE_* constants.
     */
    public function getAggregateFunction(): string
    {
        return $this->aggregateFunction;
    }

    /**
     * Returns client-side data formatting options.
     * @return ?array
     */
    public function getIntlFormatOptions(): ?array
    {
        return $this->intlFormatOptions;
    }

    /**
     * Sets a server-side display formatter callback for human-readable display strings.
     * The callback receives the raw value and should return a formatted string.
     * Used for non-graph displays (tables, indicators) where custom formatting is needed (e.g., durations).
     * @param callable $formatter The formatter callback
     * @return static
     */
    public function setDisplayFormatter(callable $formatter): static
    {
        $this->displayFormatter = $formatter;
        return $this;
    }

    /**
     * Returns whether this metric has a custom display formatter.
     * @return bool
     */
    public function hasDisplayFormatter(): bool
    {
        return $this->displayFormatter !== null;
    }

    /**
     * Formats a value using the display formatter callback.
     * Returns null if no formatter is set.
     * @param mixed $value The raw value to format
     * @return ?string The formatted display string or null
     */
    public function formatDisplayValue($value): ?string
    {
        if ($this->displayFormatter === null) {
            return null;
        }

        return ($this->displayFormatter)($value);
    }

    /**
     * Returns the database column name for this metric.
     * @return string Returns the database column name.
     */
    public function getDatabaseColumnName(): string
    {
        return $this->databaseColumnName;
    }

    /**
     * Finds a metric by its code.
     * @param ReportMetric[] $availableMetrics
     * @param string $metricCode
     * @return ReportMetric|null Returns the metric or null if not found.
     */
    public static function findMetricByCode(array $availableMetrics, string $metricCode)
    {
        $metric = array_filter(
            $availableMetrics,
            fn($item) => $item->getCode() === $metricCode
        );

        if (!count($metric)) {
            return null;
        }

        return end($metric);
    }

    /**
     * Finds a metric by its code. Throws an exception if the metric is not found.
     * @param ReportMetric[] $availableMetrics
     * @param string $metricCode
     * @param bool $throw Throw exception if the metric doesn't exist.
     * @return ?ReportMetric
     */
    public static function findMetricByCodeStrict(array $availableMetrics, string $metricCode, $throw = true): ?ReportMetric
    {
        $metric = self::findMetricByCode($availableMetrics, $metricCode);
        if (!$metric && $throw) {
            throw new SystemException('Unknown metric: '.$metricCode);
        }

        return $metric;
    }

    /**
     * Returns code unique for this metric to be used as a part of a cache key.
     * @return string
     */
    public function getCacheUniqueCode(): string
    {
        return $this->getCode() . $this->getDatabaseColumnName() . $this->getAggregateFunction();
    }

    /**
     * Returns a query column name corresponding to this metric.
     * @return string
     */
    public function getDataSetColumnName(): string
    {
        return 'oc_metric_' . $this->getCode();
    }

    /**
     * @deprecated Use getDataSetColumnName() instead
     */
    public function getDataSetColumName(): string
    {
        return $this->getDataSetColumnName();
    }
}
