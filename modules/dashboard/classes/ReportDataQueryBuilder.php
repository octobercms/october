<?php namespace Dashboard\Classes;

use Db;
use Dashboard\Classes\ReportDataSourceBase;
use Illuminate\Database\Query\Builder as QueryBuilder;
use Carbon\Carbon;
use SystemException;

/**
 * ReportDataQueryBuilder helps building queries for report data sources.
 *
 * @deprecated Use ReportQueryBuilder instead, which provides a cleaner fluent interface.
 *
 * Example migration:
 *
 * Before:
 *     $builder = new ReportDataQueryBuilder(
 *         'table', $dimension, $metrics, $orderRule, $filters, $limit,
 *         $pagination, $interval, $hideEmpty, $dateStart, $dateEnd,
 *         $timestamp, 'date_col', null, $totalsOnly
 *     );
 *     return $builder->getFetchDataResult($config);
 *
 * After:
 *     return ReportQueryBuilder::fromFetchData($data, 'table')
 *         ->dateColumn('date_col')
 *         ->get($config);
 *
 * @see ReportQueryBuilder
 */
class ReportDataQueryBuilder
{
    /**
     * @var string
     */
    private $tableName;

    /**
     * @var ReportDimension
     */
    private $dimension;

    /**
     * @var ReportMetric[]
     */
    private $metrics;

    /**
     * @var ?int
     */
    private $limit;

    /**
     * @var ReportDataOrderRule
     */
    private $orderRule;

    /**
     * @var callable
     */
    private $metricsConfigurationCallback;

    /**
     * @var callable
     */
    private $metricConfigurationCallback;

    /**
     * @var callable
     */
    private $configureQueryCallback;

    /**
     * @var ?ReportDimensionFilter[]
     */
    private $dimensionFilters;

    /**
     * @var ?string
     */
    private $groupInterval;

    /**
     * @var bool
     */
    private $hideEmptyDimensionValues;

    /**
     * @var ?ReportDataPaginationParams
     */
    private $paginationParams;

    /**
     * @var ?Carbon
     */
    private $startDate;

    /**
     * @var ?Carbon
     */
    private $endDate;

    /**
     * @var ?int
     */
    private $startTimestamp;

    /**
     * @var ?string
     */
    private $dateColumnName;

    /**
     * @var ?string
     */
    private $timestampColumnName;

    /**
     * @var bool
     */
    private $totalsOnly;

    /**
     * Creates a new instance of the query builder.
     * @param string $tableName Specifies the data source table name.
     * @param ReportDimension $dimension Specifies the dimension.
     * @param ReportMetric[] $metrics Specifies the metrics.
     * @param ReportDataOrderRule $orderRule Specifies the data ordering rule.
     * @param ?ReportDimensionFilter[] $dimensionFilters Specifies the filters to apply to the dimension values.
     * @param int $limit Specifies the maximum number of records.
     * @param ?ReportDataPaginationParams $paginationParams Specifies the pagination parameters.
     * Either $limit or $paginationParams or none can be set.
     * @param string $groupInterval Specifies the group interval.
     * One of the ReportDataSourceBase::GROUP_INTERVAL_* constants.
     * Only applies if the dimension is a date dimension.
     * If not specified, the default group interval GROUP_INTERVAL_DAY
     * will be used.
     * @param bool $hideEmptyDimensionValues Indicates whether empty dimension values must be removed from the dataset.
     * @param ?Carbon $startDate Specifies the start date.
     * @param ?Carbon $endDate Specifies the end date.
     * @param ?int $startTimestamp Optional. Specifies the starting timestamp for relative intervals.
     * Either $startTimestamp must be set, or both $startDate and $endDate.
     * @param ?string $dateColumnName Specifies the date column name in $tableName to apply the date interval filter.
     * If the parameter is null, the date interval filter won't be applied.
     * @param ?string $timestampColumnName Specifies the timestamp column name in $tableName to apply the relative time filter.
     * If the parameter is null, the relative time filter won't be applied.
     * @param bool $totalsOnly Indicates that the method should only return total values for metrics, and not rows.
     */
    public function __construct(
        string $tableName,
        ReportDimension $dimension,
        array $metrics,
        ReportDataOrderRule $orderRule,
        ?array $dimensionFilters,
        ?int $limit,
        ?ReportDataPaginationParams $paginationParams,
        ?string $groupInterval,
        bool $hideEmptyDimensionValues,
        ?Carbon $startDate,
        ?Carbon $endDate,
        ?int $startTimestamp,
        ?string $dateColumnName,
        ?string $timestampColumnName,
        bool $totalsOnly
    ) {
        if (($startDate || $endDate) && $startTimestamp !== null) {
            throw new SystemException('Start and end dates cannot be set if the start timestamp is also set.');
        }

        if (!$startDate && $startTimestamp === null) {
            throw new SystemException('Either the start and end dates or the start timestamp must be set.');
        }

        $this->tableName = $tableName;
        $this->metrics = $metrics;
        $this->dimension = $dimension;
        $this->limit = $limit;
        $this->orderRule = $orderRule;
        $this->dimensionFilters = $dimensionFilters;
        $this->groupInterval = $groupInterval;
        $this->hideEmptyDimensionValues = $hideEmptyDimensionValues;
        $this->paginationParams = $paginationParams;
        $this->startDate = $startDate;
        $this->endDate = $endDate;
        $this->dateColumnName = $dateColumnName;
        $this->totalsOnly = $totalsOnly;
        $this->startTimestamp = $startTimestamp;
        $this->timestampColumnName = $timestampColumnName;
    }

    /**
     * fromFetchData creates a new instance from ReportFetchData.
     * @param ReportFetchData $data The fetch data containing dimension, metrics, and query parameters.
     * @param string $tableName Specifies the data source table name.
     * @param ?string $dateColumnName Specifies the date column name in $tableName to apply the date interval filter.
     * @param ?string $timestampColumnName Specifies the timestamp column name in $tableName to apply the relative time filter.
     * @return static
     */
    public static function fromFetchData(
        ReportFetchData $data,
        string $tableName,
        ?string $dateColumnName = null,
        ?string $timestampColumnName = null
    ): static {
        return new static(
            $tableName,
            $data->dimension,
            $data->metrics,
            $data->orderRule,
            $data->dimensionFilters,
            $data->limit,
            $data->paginationParams,
            $data->groupInterval,
            $data->hideEmptyDimensionValues,
            $data->dateStart,
            $data->dateEnd,
            $data->startTimestamp,
            $dateColumnName,
            $timestampColumnName,
            $data->totalsOnly
        );
    }

    /**
     * initQuery initializes a Laravel query based on the provided configuration.
     */
    public function initQuery(): QueryBuilder
    {
        $query = $this->createQueryBuilder();

        if ($this->paginationParams) {
            $query->limit($this->paginationParams->getRecordsPerPage());
            $query->offset($this->paginationParams->getOffset());
        }

        $this->applyOrderRule($query);

        return $query;
    }

    /**
     * Fetches the report data based on the initialized query and configuration.
     *
     * This method does the following:
     * 1. Initializes a query using the initQuery method.
     * 2. Executes the database queries and constructs a ReportFetchDataResult object.
     * 3. If pagination is set, it also calculates the total number of records.
     * 4. Computes metric totals based on the given metric configuration.
     *
     * This method should be used if no extra configuration is required on the query
     * returned by the initQuery method. If additional configurations are needed,
     * create and configure the ReportFetchDataResult object directly, instead of using this method.
     *
     * @param ReportMetricConfiguration[] $metricsConfiguration The configuration for the metrics to be fetched.
     * @param ?string $recordUrlTemplate An optional template for record URLs.
     * Record URLs are formatted based on the `id` column value of the table specified in the query builder constructor.
     * A format must have the {id} placeholder, for example, /admin/author/plugin/records/preview/{id}.
     * The template is used to create the `record_url` column in the result dataset.
     * @return ReportFetchDataResult A configured object containing the fetched data and additional information about the metrics.
     */
    public function getFetchDataResult(array $metricsConfiguration, ?string $recordUrlTemplate = null): ReportFetchDataResult
    {
        $query = $this->initQuery();

        if ($recordUrlTemplate) {
            $tableName = $this->evalDbObjectName($this->tableName);
            // Using the MAX here to avoid the only_full_group_by error when the
            // id column is not functionally dependent on columns in GROUP BY clause
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
        if ($this->paginationParams) {
            $result->setTotalRecords($this->getTotalRecords());
        }

        $result->setMetricTotals($this->getMetricTotals($metricsConfiguration));

        return $result;
    }

    /**
     * getTotalRecords returns the total number of unpaginated records.
     */
    public function getTotalRecords(): int
    {
        $query = $this->createQueryBuilder();

        $wrappedQuery = Db::table(Db::raw("({$query->toSql()}) as subquery"))
            ->mergeBindings($query)
        ;

        return $wrappedQuery->count();
    }

    /**
     * getMetricTotals returns totals for metric with the metric totals or the relative bar enabled.
     * @param ReportMetricConfiguration[] $metricsConfiguration
     * @return array Returns an array of metric total values
     */
    public function getMetricTotals(array $metricsConfiguration): array
    {
        // Totals use the same query as for dimensions but without grouping or pagination.

        $metrics = [];
        foreach ($metricsConfiguration as $metricCode => $configuration) {
            if ($configuration->getDisplayTotals() || $configuration->getDisplayRelativeBar()) {
                $metric = ReportMetric::findMetricByCode($this->metrics, $metricCode);
                if (!$metric) {
                    throw new SystemException("Metric not found: $metricCode");
                }

                $metrics[] = $metric;
            }
        }

        if (!count($metrics)) {
            return [];
        }

        $query = $this->createQueryBuilder(true, $metrics);
        $rows = $query->get()->toArray();
        if (!count($rows)) {
            return [];
        }

        $row = $rows[0];
        $result = [];
        foreach ($metrics as $metric) {
            $columnName = $metric->getDataSetColumName();
            $result[$metric->getCode()] = $row->{$columnName};
        }

        return $result;
    }

    /**
     * Registers a callback to be called when the query is being built to configure metrics.
     * Use this method to add joins to the query for metrics that belong to
     * tables other than the one specified in the constructor.
     *
     * @param callable $callback The callback function to register.
     * The function should have the following signature:
     *   function(
     *      Illuminate\Database\Query\Builder $query,
     *      Backend\Classes\ReportDimension $dimension,
     *      array $metrics
     *  ): void
     */
    public function onConfigureMetrics(callable $callback)
    {
        $this->metricsConfigurationCallback = $callback;
    }

    /**
     * Registers a callback to be called when the query is being built to configure a specific metric.
     * Use this method to a metric column to the query. The added metric column name
     * must have the format oc_metric_[metric code]
     *
     * If the callback returns true, the report data query builder doesn't add
     * any additional SQL for the metric.
     *
     * @param callable $callback The callback function to register.
     * The function should have the following signature:
     *   function(
     *      Illuminate\Database\Query\Builder $query,
     *      Illuminate\Database\Query\ReportMetric $metric,
     *      Backend\Classes\ReportDimension $dimension,
     *      array $metrics
     *  ): bool
     */
    public function onConfigureMetric(callable $callback)
    {
        $this->metricConfigurationCallback = $callback;
    }

    /**
     * Registers a callback for the final query configuration.
     * Use this method to add dimension fields or filters to the query.
     * The callback must not add pagination filters. The same callback
     * is used for calculating the total number of unpaginated records.
     *
     * @param callable $callback The callback function to register.
     * The function should have the following signature:
     *   function(
     *      Illuminate\Database\Query\Builder $query,
     *      Backend\Classes\ReportDimension $dimension,
     *      array $metrics
     *  ): void
     */
    public function onConfigureQuery(callable $callback)
    {
        $this->configureQueryCallback = $callback;
    }

    /**
     * aggregateFunctionToSql
     */
    protected function aggregateFunctionToSql(string $function): string
    {
        switch ($function) {
            case ReportMetric::AGGREGATE_AVG:
                return 'avg(%1$s)';
                break;
            case ReportMetric::AGGREGATE_COUNT:
                return 'count(%1$s)';
                break;
            case ReportMetric::AGGREGATE_MAX:
                return 'max(%1$s)';
                break;
            case ReportMetric::AGGREGATE_MIN:
                return 'min(%1$s)';
                break;
            case ReportMetric::AGGREGATE_SUM:
                return 'sum(%1$s)';
                break;
            case ReportMetric::AGGREGATE_COUNT_DISTINCT:
                return 'count(distinct %1$s)';
                break;
            case ReportMetric::AGGREGATE_COUNT_DISTINCT_NOT_NULL:
                return 'count(distinct case when %1$s is not null then %1$s end)';
                break;
            case ReportMetric::AGGREGATE_NONE:
                return '%1$s';
                break;
            default:
                throw new SystemException('Invalid aggregate function: ' . $function);
        }
    }

    /**
     * evalDbObjectName is a point to check object names for validity
     */
    protected function evalDbObjectName(string $name)
    {
        return trim($name);
    }

    /**
     * applyOrderRule
     */
    protected function applyOrderRule(QueryBuilder $query)
    {
        $columnName = null;
        $dataAttributeType = $this->orderRule->getDataAttributeType();
        switch ($dataAttributeType) {
            case ReportDataOrderRule::ATTR_TYPE_DIMENSION:
                $columnName = $this->dimension->getLabelColumnName() ?: $this->dimension->getDatabaseColumnName();

                // In case date grouping is used we need to use the aliased column name (i.e. oc_dimension)
                if ($this->dimension->isDate() && $this->groupInterval !== ReportDataSourceBase::GROUP_INTERVAL_FULL) {
                    $columnName = $this->dimension->getDataSetColumName();
                }
                break;
            case ReportDataOrderRule::ATTR_TYPE_METRIC:
                $metric = ReportMetric::findMetricByCodeStrict(
                    $this->metrics,
                    $this->orderRule->getAttributeName()
                );
                $columnName = $metric->getDataSetColumName();
                break;
            case ReportDataOrderRule::ATTR_TYPE_DIMENSION_FIELD:
                $field = $this->dimension->findDimensionFieldByCode(
                    $this->orderRule->getAttributeName()
                );

                $columnName = $field->getCode();

                break;
            default:
                throw new SystemException('Invalid order rule data attribute type: ' . $dataAttributeType);
                break;
        }

        $query->orderBy($this->evalDbObjectName($columnName), $this->orderRule->isAscending() ? 'asc' : 'desc');
    }

    /**
     * applyFilters
     */
    protected function applyFilters(QueryBuilder $query)
    {
        if (!$this->dimensionFilters) {
            return;
        }

        foreach ($this->dimensionFilters as $dimensionFilter) {
            $this->applyFilter($query, $dimensionFilter);
        }
    }

    /**
     * applyFilter
     */
    protected function applyFilter(QueryBuilder $query, ReportDimensionFilter $dimensionFilter)
    {
        $columnName = null;
        switch ($dimensionFilter->getDataAttributeType()) {
            case ReportDimensionFilter::ATTR_TYPE_DIMENSION:
                $columnName = $this->dimension->getLabelColumnName();
                if ($columnName === null) {
                    $columnName = $this->dimension->getDatabaseColumnName();
                }

                break;
            case ReportDimensionFilter::ATTR_TYPE_DIMENSION_FIELD:
                $field = $this->dimension->findDimensionFieldByCode(
                    $dimensionFilter->getAttributeName()
                );

                $fieldDbColumnName = $field->getColumnName();
                if ($fieldDbColumnName === null) {
                    $fieldDbColumnName = $field->getCode();
                }

                $columnName = $fieldDbColumnName;
                break;
        }

        $columnName = $this->evalDbObjectName($columnName);
        $operation = $dimensionFilter->getOperation();

        $relationalOperations = [
            ReportDimensionFilter::OPERATION_EQUALS,
            ReportDimensionFilter::OPERATION_MORE_OR_EQUALS,
            ReportDimensionFilter::OPERATION_LESS_OR_EQUALS,
            ReportDimensionFilter::OPERATION_MORE,
            ReportDimensionFilter::OPERATION_LESS,
        ];

        if (in_array($operation, $relationalOperations)) {
            $query->where($columnName, $operation, $dimensionFilter->getValue());
            return;
        }

        if ($operation === ReportDimensionFilter::OPERATION_STARTS_WITH) {
            $query->where($columnName, 'like', $dimensionFilter->getValue() . '%');
            return;
        }

        if ($operation === ReportDimensionFilter::OPERATION_STRING_INCLUDES) {
            $query->where($columnName, 'like', '%' . $dimensionFilter->getValue() . '%');
            return;
        }

        if ($operation === ReportDimensionFilter::OPERATION_ONE_OF) {
            $query->whereIn($columnName, $dimensionFilter->getValue());
            return;
        }

        throw new SystemException('Invalid filter operation: ' . $operation);
    }

    /**
     * createQueryBuilder
     */
    protected function createQueryBuilder(bool $forceSkipGrouping = false, array $forceMetrics = []): QueryBuilder
    {
        $query = Db::table($this->tableName);

        $skipGrouping =
            $forceSkipGrouping ||
            ($this->dimension->isDate() && $this->groupInterval === ReportDataSourceBase::GROUP_INTERVAL_FULL);

        $columns = [];
        if (!$skipGrouping) {
            $dimensionColumnName = $this->dimension->getDatabaseColumnName();
            $dimensionColumnName = $this->evalDbObjectName($dimensionColumnName);
            $dimensionColumnName = $this->makeDateDimensionGroupingColumnName($dimensionColumnName);

            $columns[] = Db::raw(
                $dimensionColumnName . ' AS ' . $this->dimension->getDataSetColumName()
            );

            if ($this->hideEmptyDimensionValues) {
                // We need to use whereRaw here to avoid escaping the column name in case it is a complex expression (e.g. when date grouping is used)
                $query->whereRaw("$dimensionColumnName is not null");
            }

            $dimensionLabelColumnName = $this->dimension->getLabelColumnName();
            if ($dimensionLabelColumnName !== null) {
                $dimensionLabelColumnName = $this->evalDbObjectName($dimensionLabelColumnName);

                // For date dimensions with interval grouping, wrap in MAX() to avoid
                // ONLY_FULL_GROUP_BY error since the label column isn't in GROUP BY
                if ($this->dimension->isDate() && $this->groupInterval !== ReportDataSourceBase::GROUP_INTERVAL_FULL) {
                    $columns[] = Db::raw(
                        'MAX(' . $dimensionLabelColumnName . ') AS oc_dimension_label'
                    );
                }
                else {
                    $columns[] = Db::raw(
                        $dimensionLabelColumnName . ' AS oc_dimension_label'
                    );
                }
            }
        }

        $metrics = $forceMetrics ? $forceMetrics : $this->metrics;

        foreach ($metrics as $metric) {
            $metricConfiguredManually = false;
            if ($this->metricConfigurationCallback) {
                $metricConfiguredManually = call_user_func(
                    $this->metricConfigurationCallback,
                    $query,
                    $metric,
                    $this->dimension,
                    $this->metrics
                );
            }

            if ($metricConfiguredManually) {
                continue;
            }

            $aggregateFunction = $this->aggregateFunctionToSql($metric->getAggregateFunction());
            $columnName = $metric->getDatabaseColumnName();
            $columnName = $this->evalDbObjectName($columnName);
            $metricColumnName = $this->evalDbObjectName($metric->getDataSetColumName());
            $aggregateFunctionFinal = sprintf($aggregateFunction, $columnName);
            $columns[] = Db::raw(
                sprintf(
                    '%s as %s',
                    $aggregateFunctionFinal,
                    $metricColumnName
                )
            );
        }

        if ($this->metricsConfigurationCallback) {
            call_user_func($this->metricsConfigurationCallback, $query, $this->dimension, $this->metrics);
        }

        if ($this->configureQueryCallback) {
            call_user_func($this->configureQueryCallback, $query, $this->dimension, $this->metrics);
        }

        $query->addSelect($columns);

        if (!$skipGrouping) {
            $query->groupBy(Db::raw($this->dimension->getDataSetColumName()));
        }

        if ($this->limit !== null && $this->paginationParams) {
            throw new SystemException('Limit and pagination parameters cannot be both set.');
        }

        if ($this->limit) {
            $query->limit($this->limit);
        }

        $this->applyFilters($query);

        if ($this->dateColumnName && $this->startDate !== null) {
            $query->whereBetween($this->dateColumnName, [
                $this->startDate->startOfDay()->toDateTimeString(),
                $this->endDate->endOfDay()->toDateTimeString()
            ]);
        }

        if ($this->timestampColumnName && $this->startTimestamp !== null) {
            $startTimestampDate = gmdate('Y-m-d H:i:s', $this->startTimestamp);
            $query->where($this->timestampColumnName, '>=', $startTimestampDate);
        }

        return $query;
    }

    /**
     * makeDateDimensionGroupingColumnName
     */
    protected function makeDateDimensionGroupingColumnName(string $dimensionColumnName): string
    {
        if (!$this->dimension->isDate()) {
            return $dimensionColumnName;
        }

        $driver = Db::getDriverName();

        switch ($this->groupInterval) {
            case ReportDataSourceBase::GROUP_INTERVAL_DAY:
                return $driver === 'pgsql'
                    ?  "$dimensionColumnName::date"
                    : "DATE(`$dimensionColumnName`)";

            case ReportDataSourceBase::GROUP_INTERVAL_WEEK:
                $field = $this->dimension->getWeekGroupingField();
                if ($field !== null) {
                    return $this->evalDbObjectName($field);
                }
                return "DATE_FORMAT(DATE_ADD(`$dimensionColumnName`, INTERVAL -WEEKDAY(`$dimensionColumnName`) DAY), '%Y-%m-%d')";

            case ReportDataSourceBase::GROUP_INTERVAL_MONTH:
                $field = $this->dimension->getMonthGroupingField();
                if ($field !== null) {
                    return $this->evalDbObjectName($field);
                }
                return "DATE_FORMAT(`$dimensionColumnName`, '%Y-%m-01')";

            case ReportDataSourceBase::GROUP_INTERVAL_QUARTER:
                $field = $this->dimension->getQuarterGroupingField();
                if ($field !== null) {
                    return $this->evalDbObjectName($field);
                }
                return "MAKEDATE(YEAR(`$dimensionColumnName`), 1) + INTERVAL (QUARTER(`$dimensionColumnName`) - 1) QUARTER";

            case ReportDataSourceBase::GROUP_INTERVAL_YEAR:
                $field = $this->dimension->getYearGroupingField();
                if ($field !== null) {
                    return $this->evalDbObjectName($field);
                }
                return "DATE_FORMAT(`$dimensionColumnName`, '%Y-01-01')";
        }

        return $dimensionColumnName;
    }
}
