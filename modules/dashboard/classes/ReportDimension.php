<?php namespace Dashboard\Classes;

use SystemException;

/**
 * ReportDimension represents a report data source dimension.
 */
class ReportDimension
{
    /**
     * @var string CODE_DATE date code must be used for date-based dimensions
     */
    const CODE_DATE = 'date';

    /**
     * @var string TYPE_INDICATOR defines a dimension to be used with the Indicator dashboard widget.
     * Dimensions of this type have metrics that can fully configure the Indicator widget.
     * Indicator dimensions cannot be used with widget types other than the Indicator.
     */
    const TYPE_INDICATOR = 'indicator';

    /**
     * @var string Specifies the dimension referral code.
     */
    private $code;

    /**
     * @var string Specifies the column name in the data source table.
     */
    private $databaseColumnName;

    /**
     * @var string Specifies the dimension name used in reports.
     */
    private $displayName;

    /**
     * @var ReportDimensionField[] Specifies the fields in this dimension.
     */
    private $dimensionFields = [];

    /**
     * @var ReportMetric[] Metrics belonging to the data source.
     */
    private $metrics = [];

    /**
     * @var ?string Optional dimension type
     */
    private $dimensionType;

    /**
     * The name of the column containing week start dates.
     *
     * @var ?string
     */
    private $weekGroupingField;

    /**
     * The name of the column containing month start dates.
     *
     * @var ?string
     */
    private $monthGroupingField;

    /**
     * The name of the column containing quarter start dates.
     *
     * @var ?string
     */
    private $quarterGroupingField;

    /**
     * The name of the column containing year start dates.
     *
     * @var ?string
     */
    private $yearGroupingField;

    /**
     * Holds the default configuration values for widgets.
     *
     * @var array
     */
    private $defaultWidgetConfig = [];

    /**
     * @var ?string Specifies the dimension label column name.
     */
    private $labelColumnName;

    /**
     * Creates a new dimension instance.
     * @param string $code Specifies the dimension referral code.
     * For special dimension types, the code should begin with the respective type prefix,
     * for instance, `indicator@`. These special dimension types are defined by the
     * ReportDimension::TYPE_XXX constants.
     * @param string $databaseColumnName Specifies the column name in the data source table.
     * Dimension columns typically match the primary key in the dimension table.
     * @param string $displayName Specifies the dimension name used in reports, e.g., "Product".
     * @param ?string $labelColumnName Specifies the name of the column for the dimension label.
     * Use this column to provide a user-friendly label for the dimension, e.g., "product_name".
     * If this argument is not provided, the value of $databaseColumnName is used as the dimension label.
     */
    public function __construct(
        string $code,
        string $databaseColumnName,
        string $displayName,
        ?string $labelColumnName = null
    ) {
        if (!strlen($code)) {
            throw new SystemException('The dimension code cannot be empty.');
        }

        if (!strlen($databaseColumnName)) {
            throw new SystemException('The database column name cannot be empty.');
        }

        if (!strlen($displayName)) {
            throw new SystemException('The display name cannot be empty.');
        }

        $knownTypes = [
            ReportDimension::TYPE_INDICATOR
        ];

        $dimensionType = null;
        $codeParts = explode('@', $code);
        if (count($codeParts) === 2) {
            $dimensionType = $codeParts[0];
        }

        if ($dimensionType !== null && !in_array($dimensionType, $knownTypes)) {
            throw new SystemException('Unknown dimension type: ' . $dimensionType);
        }

        $this->code = $code;
        $this->databaseColumnName = $databaseColumnName;
        $this->displayName = $displayName;
        $this->dimensionType = $dimensionType;
        $this->labelColumnName = $labelColumnName;
    }

    /**
     * Adds a field to this dimension.
     * @param ReportDimensionField $field Specifies the field to add.
     * @return $this Returns the dimension object for method chaining.
     */
    public function addDimensionField(ReportDimensionField $field): ReportDimension
    {
        if ($this->isDate()) {
            throw new SystemException('Date dimensions cannot have fields.');
        }

        $this->dimensionFields[] = $field;
        return $this;
    }

    /**
     * Allows setting of custom field names for building queries that group data by week, month, quarter, and year intervals.
     * If the fields are not set, ReportDataQueryBuilder will use SQL functions to deduce interval start dates
     * from the dimension column value. This approach is less efficient than using indexed columns.
     * The names specified in the arguments must refer to columns containing start dates for the corresponding
     * intervals in the YYYY-MM-DD format. For example, the year column should contain values like 2023-01-01, 2024-01-01, etc.
     *
     * @param string $weekField The name of the column containing week start dates.
     * @param string $monthField The name of the column containing month start dates.
     * @param string $quarterField The name of the column containing quarter start dates.
     * @param string $yearField The name of the column containing year start dates.
     */
    public function setDateIntervalGroupingFields(string $weekField, string $monthField, string $quarterField, string $yearField)
    {
        $this->weekGroupingField = $weekField;
        $this->monthGroupingField = $monthField;
        $this->quarterGroupingField = $quarterField;
        $this->yearGroupingField = $yearField;
    }

    /**
     * Gets the name of the column containing week start dates.
     *
     * @return string
     */
    public function getWeekGroupingField(): ?string
    {
        return $this->weekGroupingField;
    }

    /**
     * Gets the name of the column containing month start dates.
     *
     * @return string
     */
    public function getMonthGroupingField(): ?string
    {
        return $this->monthGroupingField;
    }

    /**
     * Gets the name of the column containing quarter start dates.
     *
     * @return string
     */
    public function getQuarterGroupingField(): ?string
    {
        return $this->quarterGroupingField;
    }

    /**
     * Gets the name of the column containing year start dates.
     *
     * @return string
     */
    public function getYearGroupingField(): ?string
    {
        return $this->yearGroupingField;
    }

    /**
     * Registers a dimension metric.
     * @param ReportMetric $metric A metric to add.
     * @return ReportDimension Returns the dimension object for chaining.
     */
    public function addDimensionMetric(ReportMetric $metric): ReportDimension
    {
        $knownMetric = array_filter(
            $this->metrics,
            fn ($item) => $item->getCode() === $metric->getCode()
        );

        if (count($knownMetric)) {
            throw new SystemException('The dimension metric is already registered: ' . $metric->getCode());
        }

        $this->metrics[] = $metric;
        return $this;
    }

    /**
     * A shorthand version of addDimensionMetric.
     * Adds a calculated metric that doesn't work with the database.
     * @param string $displayName Metric display name for the UI.
     * @return ReportDimension Returns the dimension object for chaining.
     */
    public function addCalculatedMetric(string $metricCode, string $displayName): ReportDimension
    {
        return $this->addDimensionMetric(new ReportMetric(
            $metricCode,
            $metricCode,
            $displayName,
            ReportMetric::AGGREGATE_NONE
        ));
    }

    /**
     * Returns the available metrics for this dimension.
     * @return ReportMetric[]
     */
    public function getAvailableMetrics(): array
    {
        return $this->metrics;
    }

    /**
     * Returns the dimension display name.
     * @return string
     */
    public function getDisplayName(): string
    {
        return $this->displayName;
    }

    /**
     * Returns the dimension type.
     * @return ?string
     */
    public function getDimensionType(): ?string
    {
        return $this->dimensionType;
    }

    /**
     * Returns fields of the dimension.
     * @return ReportDimensionField[] Returns fields of the dimension.
     */
    public function getDimensionFields(): array
    {
        return $this->dimensionFields;
    }

    /**
     * Returns the dimension code.
     * @return string Returns the dimension code.
     */
    public function getCode(): string
    {
        return $this->code;
    }

    /**
     * Checks if this is a date dimension.
     * @return bool Returns true if this is a date dimension.
     */
    public function isDate(): bool
    {
        return $this->code === self::CODE_DATE;
    }

    /**
     * Returns the database column name for this dimension.
     * @return string Returns the database column name.
     */
    public function getDatabaseColumnName(): string
    {
        return $this->databaseColumnName;
    }

    /**
     * Returns the dimension label column name.
     * @return ?string Returns the dimension label column name.
     */
    public function getLabelColumnName(): ?string
    {
        return $this->labelColumnName;
    }

    /**
     * Finds a dimension by its code.
     * @param ReportDimension[] $availableDimensions Specifies the list of available dimensions.
     * @param string $dimensionCode The code of the dimension to find.
     * @param ?bool $strict If true, throws an exception when the dimension cannot be found. Defaults to true.
     * @return ?ReportDimension Returns the found dimension.
     */
    public static function findDimensionByCode(array $availableDimensions, string $dimensionCode, ?bool $strict = true): ?ReportDimension
    {
        $dimension = array_filter(
            $availableDimensions,
            fn($item) => $item->getCode() === $dimensionCode
        );

        if (!count($dimension)) {
            if ($strict) {
                throw new SystemException('Unknown dimension specified: '.$dimensionCode);
            }

            return null;
        }

        return array_shift($dimension);
    }

    /**
     * Finds a dimension field by its code.
     * @param string $dimensionFieldCode
     * @return ReportDimensionField
     */
    public function findDimensionFieldByCode(string $dimensionFieldCode): ReportDimensionField
    {
        $dimension = array_filter(
            $this->dimensionFields,
            fn($item) => $item->getCode() === $dimensionFieldCode
        );

        if (!count($dimension)) {
            throw new SystemException('Unknown dimension field specified: '.$dimensionFieldCode);
        }

        return array_shift($dimension);
    }

    /**
     * Returns code unique for this dimension to be used as a part of a cache key.
     * @return string
     */
    public function getCacheUniqueCode(): string
    {
        $result = $this->getCode() . $this->getDatabaseColumnName();
        foreach ($this->dimensionFields as $field) {
            $result .= $field->getCode();
        }

        return $result;
    }

    /**
     * Returns a query column name corresponding to this dimension.
     * @return string
     */
    public function getDataSetColumnName(): string
    {
        return 'oc_dimension';
    }

    /**
     * @deprecated Use getDataSetColumnName() instead
     */
    public function getDataSetColumName(): string
    {
        return $this->getDataSetColumnName();
    }

    /**
     * Allows setting default widget configuration values.
     * The configuration is used for widgets created from this dimension
     * through the quick widget creation feature. Currently, the future supports
     * indicator-type dimensions only.
     *
     * @param array $config A name-value list of configuration parameters.
     * All property names should be strings, and values should be scalar. The currently
     * supported parameters are:
     * - icon: Sets the default indicator icon CSS class.
     * - title: Sets the default widget title.
     * - link_text: Sets the default indicator link text.
     * @return ReportDimension Returns the dimension object for chaining.
     */
    public function setDefaultWidgetConfig(array $config)
    {
        foreach ($config as $key => $value) {
            if (!is_string($key) || empty($key) || !is_scalar($value)) {
                throw new SystemException("Invalid configuration. All keys must be non-empty strings and values must be scalar.");
            }
        }

        $this->defaultWidgetConfig = $config;
        return $this;
    }

    /**
     * getDefaultWidgetConfig returns the default widget configuration.
     */
    public function getDefaultWidgetConfig(): array
    {
        return $this->defaultWidgetConfig;
    }
}
