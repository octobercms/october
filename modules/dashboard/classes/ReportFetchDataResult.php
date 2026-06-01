<?php namespace Dashboard\Classes;

/**
 * Represents the result of fetching report data.
 */
class ReportFetchDataResult
{
    /**
     * @var int totalRecords specifies the number of records on all pages of a paginated data set.
     */
    private $totalRecords = 0;

    /**
     * @var array rows contains objects representing the data.
     */
    private $rows = [];

    /**
     * @var array metricTotals holds metric codes in keys and totals in values.
     */
    private $metricTotals = [];

    /**
     * @var bool preAggregated indicates the data has already been aggregated by the
     * date group interval at the query level, so the framework should only normalize
     * (gap-fill) the data without re-aggregating metric values.
     */
    private $preAggregated = false;

    /**
     * Constructs a new ReportFetchDataResult instance.
     * @param array $rows An array of row objects to initialize the result dataset
     */
    public function __construct(array $rows = [])
    {
        $this->setRows($rows);
    }

    /**
     * Sets the number of records on all pages of a paginated data set.
     * @param int $totalRecords
     * @return ReportFetchDataResult The current instance of the class
     */
    public function setTotalRecords(int $totalRecords): ReportFetchDataResult
    {
        $this->totalRecords = $totalRecords;
        return $this;
    }

    /**
     * Sets metric totals.
     * @param array $metricTotals An array containing metric codes in keys and totals in values.
     */
    public function setMetricTotals(array $metricTotals): void
    {
        $this->metricTotals = $metricTotals;
    }

    /**
     * Sets the result dataset rows.
     * This method overrides rows set previously.
     * @param array $rows Array of row objects
     * The expected row object properties are:
     * - oc_dimension - dimension value
     * - oc_metric_[metric_code] - metric value
     * - oc_field_[field_code] - dimension field value
     * - oc_record_url - optional URL for table row links
     * @return ReportFetchDataResult The current instance of the class
     */
    public function setRows(array $rows): ReportFetchDataResult
    {
        $this->rows = array_map([$this, 'normalizeRow'], $rows);
        return $this;
    }

    /**
     * Adds a row to the result dataset.
     * @param object $row Specifies the row object.
     * The expected row object properties are:
     * - oc_dimension - dimension value
     * - oc_metric_[metric_code] - metric value
     * - oc_field_[field_code] - dimension field value
     * - oc_record_url - optional URL for table row links
     * @return ReportFetchDataResult The current instance of the class
     */
    public function addRow(object $row): ReportFetchDataResult
    {
        $this->rows[] = $this->normalizeRow($row);
        return $this;
    }

    /**
     * Returns the dataset rows.
     * @return array Array of row objects
     */
    public function getRows(): array
    {
        return $this->rows;
    }

    /**
     * Returns the number of records on all pages of a paginated data set.
     * @return int
     */
    public function getTotalRecords(): int
    {
        return $this->totalRecords;
    }

    /**
     * Retrieves metric totals.
     * @return array An array containing metric codes as keys and totals as values.
     */
    public function getMetricTotals(): array
    {
        return $this->metricTotals;
    }

    /**
     * Sets the pre-aggregated flag indicating the data has already been aggregated
     * by the date group interval at the query level.
     */
    public function setPreAggregated(bool $preAggregated = true): ReportFetchDataResult
    {
        $this->preAggregated = $preAggregated;
        return $this;
    }

    /**
     * Returns whether the data has been pre-aggregated by the date group interval.
     */
    public function isPreAggregated(): bool
    {
        return $this->preAggregated;
    }

    /**
     * Normalizes a row, ensuring it is an object.
     * @param mixed $row The row to normalize
     * @return object The normalized row object
     */
    private function normalizeRow(mixed $row)
    {
        if (is_object($row)) {
            return $row;
        }

        return (object) $row;
    }
}
