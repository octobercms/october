<?php namespace Dashboard\Classes;

use Db;
use Carbon\Carbon;
use SystemException;
use Illuminate\Database\Query\Builder as QueryBuilder;

/**
 * ReportQueryBuilder provides a fluent interface for building dashboard report queries.
 *
 * This is the recommended way to build report queries. For backward compatibility,
 * the original ReportDataQueryBuilder class is still available.
 *
 * ## Basic Usage
 *
 * ```php
 * $result = ReportQueryBuilder::table('orders')
 *     ->dimension($dimension)
 *     ->metrics($metrics)
 *     ->orderBy($orderRule)
 *     ->groupByYear()
 *     ->hideEmptyValues()
 *     ->dateRange(Carbon::parse('2020-01-01'), now(), 'order_date')
 *     ->get($metricsConfiguration);
 * ```
 *
 * ## Using fromFetchData (recommended for data sources)
 *
 * ```php
 * protected function fetchData(ReportFetchData $data): ReportFetchDataResult
 * {
 *     return ReportQueryBuilder::fromFetchData($data, 'my_table')
 *         ->dateColumn('created_at')
 *         ->get($data->metricsConfiguration);
 * }
 * ```
 *
 * ## With Custom Query Logic
 *
 * ```php
 * $result = ReportQueryBuilder::fromFetchData($data, 'orders')
 *     ->dateColumn('order_date')
 *     ->onConfigureQuery(function ($query, $dimension, $metrics) {
 *         $query->where('status', 'completed');
 *         $query->join('customers', 'orders.customer_id', '=', 'customers.id');
 *     })
 *     ->get($data->metricsConfiguration);
 * ```
 *
 * ## Comparison with ReportDataQueryBuilder
 *
 * Old approach (15 constructor parameters):
 * ```php
 * $builder = new ReportDataQueryBuilder(
 *     'orders', $dimension, $metrics, $orderRule, $filters, 100, null,
 *     'year', true, Carbon::parse('2020-01-01'), now(), null, 'order_date', null, false
 * );
 * ```
 *
 * New approach (fluent interface):
 * ```php
 * $builder = ReportQueryBuilder::table('orders')
 *     ->dimension($dimension)
 *     ->metrics($metrics)
 *     ->orderBy($orderRule)
 *     ->filters($filters)
 *     ->limit(100)
 *     ->groupByYear()
 *     ->hideEmptyValues()
 *     ->dateRange(Carbon::parse('2020-01-01'), now(), 'order_date');
 * ```
 *
 * @package october\dashboard
 * @author Responsiv Pty Ltd
 */
class ReportQueryBuilder
{
    //
    // Properties (grouped logically)
    //

    /**
     * @var string Table name for the query
     */
    protected $tableName;

    /**
     * @var ReportDimension The dimension to query
     */
    protected $dimension;

    /**
     * @var ReportMetric[] Metrics to aggregate
     */
    protected $metrics = [];

    /**
     * @var ReportDataOrderRule|null Ordering rule
     */
    protected $orderRule;

    /**
     * @var ReportDimensionFilter[]|null Filters to apply
     */
    protected $filters;

    /**
     * @var int|null Result limit
     */
    protected $limit;

    /**
     * @var ReportDataPaginationParams|null Pagination parameters
     */
    protected $pagination;

    /**
     * @var string Group interval (day, week, month, quarter, year, full)
     */
    protected $groupInterval = ReportDataSourceBase::GROUP_INTERVAL_DAY;

    /**
     * @var bool Whether to hide null dimension values
     */
    protected $hideEmptyValues = false;

    /**
     * @var bool Only return totals, not rows
     */
    protected $totalsOnly = false;

    /**
     * @var Carbon|null Date range start
     */
    protected $dateStart;

    /**
     * @var Carbon|null Date range end
     */
    protected $dateEnd;

    /**
     * @var string|null Date column name for filtering
     */
    protected $dateColumn;

    /**
     * @var int|null Timestamp for relative intervals
     */
    protected $startTimestamp;

    /**
     * @var string|null Timestamp column for relative filtering
     */
    protected $timestampColumn;

    /**
     * @var callable|null Query configuration callback
     */
    protected $queryCallback;

    /**
     * @var callable|null Metrics configuration callback
     */
    protected $metricsCallback;

    /**
     * @var callable|null Single metric configuration callback
     */
    protected $metricCallback;

    //
    // Static Constructors
    //

    /**
     * table creates a new builder instance for the given table
     *
     * @param string $tableName
     * @return static
     */
    public static function table(string $tableName): static
    {
        $builder = new static;
        $builder->tableName = $tableName;
        return $builder;
    }

    /**
     * fromFetchData creates builder from ReportFetchData (backward compatible shorthand)
     *
     * @param ReportFetchData $data
     * @param string $tableName
     * @return static
     */
    public static function fromFetchData(ReportFetchData $data, string $tableName): static
    {
        return static::table($tableName)
            ->dimension($data->dimension)
            ->metrics($data->metrics)
            ->orderBy($data->orderRule)
            ->filters($data->dimensionFilters)
            ->when($data->limit, fn($b) => $b->limit($data->limit))
            ->when($data->paginationParams, fn($b) => $b->paginate($data->paginationParams))
            ->groupInterval($data->groupInterval)
            ->hideEmptyValues($data->hideEmptyDimensionValues)
            ->totalsOnly($data->totalsOnly)
            ->when($data->dateStart && $data->dateEnd, fn($b) => $b->dateRange($data->dateStart, $data->dateEnd))
            ->when($data->startTimestamp, fn($b) => $b->sinceTimestamp($data->startTimestamp));
    }

    //
    // Fluent Configuration Methods
    //

    /**
     * dimension sets the dimension to group by
     *
     * @param ReportDimension $dimension
     * @return $this
     */
    public function dimension(ReportDimension $dimension): static
    {
        $this->dimension = $dimension;
        return $this;
    }

    /**
     * metrics sets the metrics to aggregate
     *
     * @param ReportMetric[] $metrics
     * @return $this
     */
    public function metrics(array $metrics): static
    {
        $this->metrics = $metrics;
        return $this;
    }

    /**
     * addMetric adds a single metric
     *
     * @param ReportMetric $metric
     * @return $this
     */
    public function addMetric(ReportMetric $metric): static
    {
        $this->metrics[] = $metric;
        return $this;
    }

    /**
     * orderBy sets the ordering rule
     *
     * @param ReportDataOrderRule|null $rule
     * @return $this
     */
    public function orderBy(?ReportDataOrderRule $rule): static
    {
        $this->orderRule = $rule;
        return $this;
    }

    /**
     * filters sets dimension filters
     *
     * @param ReportDimensionFilter[]|null $filters
     * @return $this
     */
    public function filters(?array $filters): static
    {
        $this->filters = $filters;
        return $this;
    }

    /**
     * limit sets the maximum number of results
     *
     * @param int $limit
     * @return $this
     */
    public function limit(int $limit): static
    {
        $this->limit = $limit;
        return $this;
    }

    /**
     * paginate sets pagination parameters
     *
     * @param ReportDataPaginationParams $params
     * @return $this
     */
    public function paginate(ReportDataPaginationParams $params): static
    {
        $this->pagination = $params;
        return $this;
    }

    //
    // Group Interval Methods (semantic shortcuts)
    //

    /**
     * groupInterval sets the grouping interval
     *
     * @param string|null $interval One of GROUP_INTERVAL_* constants
     * @return $this
     */
    public function groupInterval(?string $interval): static
    {
        $this->groupInterval = $interval ?? ReportDataSourceBase::GROUP_INTERVAL_DAY;
        return $this;
    }

    /**
     * groupByDay groups results by day
     * @return $this
     */
    public function groupByDay(): static
    {
        return $this->groupInterval(ReportDataSourceBase::GROUP_INTERVAL_DAY);
    }

    /**
     * groupByWeek groups results by week
     * @return $this
     */
    public function groupByWeek(): static
    {
        return $this->groupInterval(ReportDataSourceBase::GROUP_INTERVAL_WEEK);
    }

    /**
     * groupByMonth groups results by month
     * @return $this
     */
    public function groupByMonth(): static
    {
        return $this->groupInterval(ReportDataSourceBase::GROUP_INTERVAL_MONTH);
    }

    /**
     * groupByQuarter groups results by quarter
     * @return $this
     */
    public function groupByQuarter(): static
    {
        return $this->groupInterval(ReportDataSourceBase::GROUP_INTERVAL_QUARTER);
    }

    /**
     * groupByYear groups results by year
     * @return $this
     */
    public function groupByYear(): static
    {
        return $this->groupInterval(ReportDataSourceBase::GROUP_INTERVAL_YEAR);
    }

    /**
     * withoutGrouping disables grouping (full interval)
     * @return $this
     */
    public function withoutGrouping(): static
    {
        return $this->groupInterval(ReportDataSourceBase::GROUP_INTERVAL_FULL);
    }

    //
    // Date Range Methods
    //

    /**
     * dateRange sets the date range and column for filtering
     *
     * @param Carbon $start
     * @param Carbon $end
     * @param string|null $column Column name to filter on
     * @return $this
     */
    public function dateRange(Carbon $start, Carbon $end, ?string $column = null): static
    {
        $this->dateStart = $start;
        $this->dateEnd = $end;

        if ($column !== null) {
            $this->dateColumn = $column;
        }

        return $this;
    }

    /**
     * dateColumn sets the date column name
     *
     * @param string $column
     * @return $this
     */
    public function dateColumn(string $column): static
    {
        $this->dateColumn = $column;
        return $this;
    }

    /**
     * sinceTimestamp sets relative timestamp filtering
     *
     * @param int $timestamp
     * @param string|null $column Column name to filter on
     * @return $this
     */
    public function sinceTimestamp(int $timestamp, ?string $column = null): static
    {
        $this->startTimestamp = $timestamp;

        if ($column !== null) {
            $this->timestampColumn = $column;
        }

        return $this;
    }

    /**
     * timestampColumn sets the timestamp column name
     *
     * @param string $column
     * @return $this
     */
    public function timestampColumn(string $column): static
    {
        $this->timestampColumn = $column;
        return $this;
    }

    //
    // Boolean Flags
    //

    /**
     * hideEmptyValues hides null dimension values from results
     *
     * @param bool $hide
     * @return $this
     */
    public function hideEmptyValues(bool $hide = true): static
    {
        $this->hideEmptyValues = $hide;
        return $this;
    }

    /**
     * totalsOnly returns only aggregated totals, no rows
     *
     * @param bool $totals
     * @return $this
     */
    public function totalsOnly(bool $totals = true): static
    {
        $this->totalsOnly = $totals;
        return $this;
    }

    //
    // Callback Registration (kept for advanced customization)
    //

    /**
     * onConfigureQuery registers a callback for query customization
     *
     * @param callable $callback fn(QueryBuilder $query, ReportDimension $dimension, array $metrics): void
     * @return $this
     */
    public function onConfigureQuery(callable $callback): static
    {
        $this->queryCallback = $callback;
        return $this;
    }

    /**
     * onConfigureMetrics registers a callback for metrics customization
     *
     * @param callable $callback fn(QueryBuilder $query, ReportDimension $dimension, array $metrics): void
     * @return $this
     */
    public function onConfigureMetrics(callable $callback): static
    {
        $this->metricsCallback = $callback;
        return $this;
    }

    /**
     * onConfigureMetric registers a callback for individual metric customization
     *
     * @param callable $callback fn(QueryBuilder $query, ReportMetric $metric, ReportDimension $dimension, array $metrics): bool
     * @return $this
     */
    public function onConfigureMetric(callable $callback): static
    {
        $this->metricCallback = $callback;
        return $this;
    }

    //
    // Conditional Helper
    //

    /**
     * when conditionally applies configuration
     *
     * @param mixed $condition
     * @param callable $callback fn(static $builder): void
     * @return $this
     */
    public function when($condition, callable $callback): static
    {
        if ($condition) {
            $callback($this);
        }
        return $this;
    }

    //
    // Query Execution
    //

    /**
     * get executes the query and returns results
     *
     * @param array $metricsConfiguration
     * @param string|null $recordUrlTemplate
     * @return ReportFetchDataResult
     */
    public function get(array $metricsConfiguration = [], ?string $recordUrlTemplate = null): ReportFetchDataResult
    {
        $this->validate();

        $query = $this->buildQuery();

        if ($recordUrlTemplate) {
            $tableName = $this->evalDbObjectName($this->tableName);
            $query->addSelect(Db::raw("MAX({$tableName}.id) as oc_id"));
        }

        $records = [];
        if (!$this->totalsOnly) {
            $records = $query->get()->toArray();

            if ($recordUrlTemplate) {
                foreach ($records as $record) {
                    $record->oc_record_url = str_replace('{id}', $record->oc_id, $recordUrlTemplate);
                }
            }
        }

        $result = new ReportFetchDataResult($records);

        if ($this->pagination) {
            $result->setTotalRecords($this->getTotalRecords());
        }

        $result->setMetricTotals($this->getMetricTotals($metricsConfiguration));

        return $result;
    }

    /**
     * toQuery returns the underlying Laravel query builder
     *
     * Use this for advanced customization or when you need direct access
     * to the query. For most cases, use get() instead.
     *
     * @return QueryBuilder
     */
    public function toQuery(): QueryBuilder
    {
        $this->validate();
        return $this->buildQuery();
    }

    /**
     * toSql returns the SQL query string (for debugging)
     *
     * @return string
     */
    public function toSql(): string
    {
        return $this->buildQuery()->toSql();
    }

    /**
     * getTotalRecords returns the total unpaginated count
     *
     * @return int
     */
    public function getTotalRecords(): int
    {
        $query = $this->buildQuery(skipPagination: true);

        $wrappedQuery = Db::table(Db::raw("({$query->toSql()}) as subquery"))
            ->mergeBindings($query);

        return $wrappedQuery->count();
    }

    /**
     * getMetricTotals returns totals for specified metrics
     *
     * @param ReportMetricConfiguration[] $metricsConfiguration
     * @return array
     */
    public function getMetricTotals(array $metricsConfiguration): array
    {
        $metricsForTotals = [];
        foreach ($metricsConfiguration as $metricCode => $configuration) {
            if ($configuration->getDisplayTotals() || $configuration->getDisplayRelativeBar()) {
                $metric = ReportMetric::findMetricByCode($this->metrics, $metricCode);
                if ($metric) {
                    $metricsForTotals[] = $metric;
                }
            }
        }

        if (empty($metricsForTotals)) {
            return [];
        }

        $query = $this->buildQuery(skipGrouping: true, forceMetrics: $metricsForTotals);
        $rows = $query->get()->toArray();

        if (empty($rows)) {
            return [];
        }

        $row = $rows[0];
        $result = [];
        foreach ($metricsForTotals as $metric) {
            $columnName = $metric->getDataSetColumName();
            $result[$metric->getCode()] = $row->{$columnName};
        }

        return $result;
    }

    //
    // Internal Query Building
    //

    /**
     * validate ensures required properties are set
     *
     * @throws SystemException
     */
    protected function validate(): void
    {
        if (!$this->tableName) {
            throw new SystemException('Table name is required.');
        }

        if (!$this->dimension) {
            throw new SystemException('Dimension is required.');
        }

        if (($this->dateStart || $this->dateEnd) && $this->startTimestamp !== null) {
            throw new SystemException('Cannot use both date range and timestamp filtering.');
        }

        if (!$this->dateStart && $this->startTimestamp === null) {
            throw new SystemException('Either date range or start timestamp is required.');
        }

        if ($this->limit !== null && $this->pagination !== null) {
            throw new SystemException('Cannot use both limit and pagination.');
        }
    }

    /**
     * buildQuery constructs the query builder
     *
     * @param bool $skipGrouping
     * @param bool $skipPagination
     * @param array $forceMetrics
     * @return QueryBuilder
     */
    protected function buildQuery(
        bool $skipGrouping = false,
        bool $skipPagination = false,
        array $forceMetrics = []
    ): QueryBuilder {
        $query = Db::table($this->tableName);

        $shouldSkipGrouping = $skipGrouping ||
            ($this->dimension->isDate() && $this->groupInterval === ReportDataSourceBase::GROUP_INTERVAL_FULL);

        $columns = [];

        if (!$shouldSkipGrouping) {
            $columns = array_merge($columns, $this->buildDimensionColumns($query));
        }

        $columns = array_merge($columns, $this->buildMetricColumns($query, $forceMetrics ?: $this->metrics));

        // Apply callbacks
        if ($this->metricsCallback) {
            call_user_func($this->metricsCallback, $query, $this->dimension, $this->metrics);
        }

        if ($this->queryCallback) {
            call_user_func($this->queryCallback, $query, $this->dimension, $this->metrics);
        }

        $query->addSelect($columns);

        // Grouping
        if (!$shouldSkipGrouping) {
            $query->groupBy(Db::raw($this->dimension->getDataSetColumName()));
        }

        // Pagination / Limit
        if (!$skipPagination) {
            if ($this->pagination) {
                $query->limit($this->pagination->getRecordsPerPage());
                $query->offset($this->pagination->getOffset());
            } elseif ($this->limit) {
                $query->limit($this->limit);
            }
        }

        // Filtering
        $this->applyFilters($query);
        $this->applyDateFilters($query);

        // Ordering
        if ($this->orderRule && !$skipPagination) {
            $this->applyOrderRule($query);
        }

        return $query;
    }

    /**
     * buildDimensionColumns builds dimension select columns
     *
     * @param QueryBuilder $query
     * @return array
     */
    protected function buildDimensionColumns(QueryBuilder $query): array
    {
        $columns = [];

        $dimensionColumnName = $this->dimension->getDatabaseColumnName();
        $dimensionColumnName = $this->evalDbObjectName($dimensionColumnName);
        $dimensionColumnName = $this->makeDateGroupingExpression($dimensionColumnName);

        $columns[] = Db::raw($dimensionColumnName . ' AS ' . $this->dimension->getDataSetColumName());

        if ($this->hideEmptyValues) {
            $query->whereRaw("$dimensionColumnName is not null");
        }

        // Handle dimension label column
        $labelColumn = $this->dimension->getLabelColumnName();
        if ($labelColumn !== null) {
            $labelColumn = $this->evalDbObjectName($labelColumn);

            // For date dimensions with grouping, wrap in MAX() to avoid GROUP BY error
            if ($this->dimension->isDate() && $this->groupInterval !== ReportDataSourceBase::GROUP_INTERVAL_FULL) {
                $columns[] = Db::raw('MAX(' . $labelColumn . ') AS oc_dimension_label');
            } else {
                $columns[] = Db::raw($labelColumn . ' AS oc_dimension_label');
            }
        }

        return $columns;
    }

    /**
     * buildMetricColumns builds metric select columns
     *
     * @param QueryBuilder $query
     * @param array $metrics
     * @return array
     */
    protected function buildMetricColumns(QueryBuilder $query, array $metrics): array
    {
        $columns = [];

        foreach ($metrics as $metric) {
            // Allow callback to handle metric manually
            if ($this->metricCallback) {
                $handled = call_user_func(
                    $this->metricCallback,
                    $query,
                    $metric,
                    $this->dimension,
                    $this->metrics
                );
                if ($handled) {
                    continue;
                }
            }

            $aggregateFunction = $this->getAggregateSql($metric->getAggregateFunction());
            $columnName = $this->evalDbObjectName($metric->getDatabaseColumnName());
            $metricColumnName = $this->evalDbObjectName($metric->getDataSetColumName());
            $aggregateExpression = sprintf($aggregateFunction, $columnName);

            $columns[] = Db::raw(sprintf('%s as %s', $aggregateExpression, $metricColumnName));
        }

        return $columns;
    }

    /**
     * makeDateGroupingExpression creates SQL expression for date grouping
     *
     * @param string $column
     * @return string
     */
    protected function makeDateGroupingExpression(string $column): string
    {
        if (!$this->dimension->isDate()) {
            return $column;
        }

        $driver = Db::getDriverName();

        return match ($this->groupInterval) {
            ReportDataSourceBase::GROUP_INTERVAL_DAY => $driver === 'pgsql'
                ? "$column::date"
                : "DATE(`$column`)",

            ReportDataSourceBase::GROUP_INTERVAL_WEEK => $this->dimension->getWeekGroupingField()
                ?? "DATE_FORMAT(DATE_ADD(`$column`, INTERVAL -WEEKDAY(`$column`) DAY), '%Y-%m-%d')",

            ReportDataSourceBase::GROUP_INTERVAL_MONTH => $this->dimension->getMonthGroupingField()
                ?? "DATE_FORMAT(`$column`, '%Y-%m-01')",

            ReportDataSourceBase::GROUP_INTERVAL_QUARTER => $this->dimension->getQuarterGroupingField()
                ?? "MAKEDATE(YEAR(`$column`), 1) + INTERVAL (QUARTER(`$column`) - 1) QUARTER",

            ReportDataSourceBase::GROUP_INTERVAL_YEAR => $this->dimension->getYearGroupingField()
                ?? "DATE_FORMAT(`$column`, '%Y-01-01')",

            default => $column
        };
    }

    /**
     * getAggregateSql returns SQL template for aggregate function
     *
     * @param string $function
     * @return string
     */
    protected function getAggregateSql(string $function): string
    {
        return match ($function) {
            ReportMetric::AGGREGATE_AVG => 'avg(%1$s)',
            ReportMetric::AGGREGATE_COUNT => 'count(%1$s)',
            ReportMetric::AGGREGATE_MAX => 'max(%1$s)',
            ReportMetric::AGGREGATE_MIN => 'min(%1$s)',
            ReportMetric::AGGREGATE_SUM => 'sum(%1$s)',
            ReportMetric::AGGREGATE_COUNT_DISTINCT => 'count(distinct %1$s)',
            ReportMetric::AGGREGATE_COUNT_DISTINCT_NOT_NULL => 'count(distinct case when %1$s is not null then %1$s end)',
            ReportMetric::AGGREGATE_NONE => '%1$s',
            default => throw new SystemException('Invalid aggregate function: ' . $function)
        };
    }

    /**
     * applyDateFilters applies date range or timestamp filtering
     *
     * @param QueryBuilder $query
     */
    protected function applyDateFilters(QueryBuilder $query): void
    {
        if ($this->dateColumn && $this->dateStart !== null) {
            $query->whereBetween($this->dateColumn, [
                $this->dateStart->startOfDay()->toDateTimeString(),
                $this->dateEnd->endOfDay()->toDateTimeString()
            ]);
        }

        if ($this->timestampColumn && $this->startTimestamp !== null) {
            $startTimestampDate = gmdate('Y-m-d H:i:s', $this->startTimestamp);
            $query->where($this->timestampColumn, '>=', $startTimestampDate);
        }
    }

    /**
     * applyFilters applies dimension filters
     *
     * @param QueryBuilder $query
     */
    protected function applyFilters(QueryBuilder $query): void
    {
        if (!$this->filters) {
            return;
        }

        foreach ($this->filters as $filter) {
            $this->applyFilter($query, $filter);
        }
    }

    /**
     * applyFilter applies a single filter
     *
     * @param QueryBuilder $query
     * @param ReportDimensionFilter $filter
     */
    protected function applyFilter(QueryBuilder $query, ReportDimensionFilter $filter): void
    {
        $columnName = match ($filter->getDataAttributeType()) {
            ReportDimensionFilter::ATTR_TYPE_DIMENSION =>
                $this->dimension->getLabelColumnName() ?? $this->dimension->getDatabaseColumnName(),
            ReportDimensionFilter::ATTR_TYPE_DIMENSION_FIELD =>
                $this->dimension->findDimensionFieldByCode($filter->getAttributeName())->getColumnName()
                    ?? $filter->getAttributeName(),
            default => throw new SystemException('Invalid filter attribute type')
        };

        $columnName = $this->evalDbObjectName($columnName);
        $operation = $filter->getOperation();
        $value = $filter->getValue();

        match ($operation) {
            ReportDimensionFilter::OPERATION_EQUALS,
            ReportDimensionFilter::OPERATION_MORE_OR_EQUALS,
            ReportDimensionFilter::OPERATION_LESS_OR_EQUALS,
            ReportDimensionFilter::OPERATION_MORE,
            ReportDimensionFilter::OPERATION_LESS => $query->where($columnName, $operation, $value),

            ReportDimensionFilter::OPERATION_STARTS_WITH => $query->where($columnName, 'like', $value . '%'),
            ReportDimensionFilter::OPERATION_STRING_INCLUDES => $query->where($columnName, 'like', '%' . $value . '%'),
            ReportDimensionFilter::OPERATION_ONE_OF => $query->whereIn($columnName, $value),

            default => throw new SystemException('Invalid filter operation: ' . $operation)
        };
    }

    /**
     * applyOrderRule applies ordering
     *
     * @param QueryBuilder $query
     */
    protected function applyOrderRule(QueryBuilder $query): void
    {
        $columnName = match ($this->orderRule->getDataAttributeType()) {
            ReportDataOrderRule::ATTR_TYPE_DIMENSION =>
                ($this->dimension->isDate() && $this->groupInterval !== ReportDataSourceBase::GROUP_INTERVAL_FULL)
                    ? $this->dimension->getDataSetColumName()
                    : ($this->dimension->getLabelColumnName() ?? $this->dimension->getDatabaseColumnName()),

            ReportDataOrderRule::ATTR_TYPE_METRIC =>
                ReportMetric::findMetricByCodeStrict($this->metrics, $this->orderRule->getAttributeName())
                    ->getDataSetColumName(),

            ReportDataOrderRule::ATTR_TYPE_DIMENSION_FIELD =>
                $this->dimension->findDimensionFieldByCode($this->orderRule->getAttributeName())->getCode(),

            default => throw new SystemException('Invalid order rule type')
        };

        $query->orderBy(
            $this->evalDbObjectName($columnName),
            $this->orderRule->isAscending() ? 'asc' : 'desc'
        );
    }

    /**
     * evalDbObjectName validates and trims a database object name
     *
     * @param string $name
     * @return string
     */
    protected function evalDbObjectName(string $name): string
    {
        return trim($name);
    }
}
