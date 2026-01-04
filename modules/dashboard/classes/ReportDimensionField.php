<?php namespace Dashboard\Classes;

use SystemException;

/**
 * ReportDimensionField represents a report data source dimension field.
 */
class ReportDimensionField
{
    /**
     * @var string Specifies the field referral code.
     */
    private $code;

    /**
     * @var string Specifies the field name to use in reports.
     */
    private $displayName;

    /**
     * @var ?string Optional database column name.
     */
    private $columnName;

    /**
     * @var bool Specifies if the field is sortable.
     */
    private $sortable;

    /**
     * @var bool Specifies if the field is filterable
     */
    private $filterable;

    /**
     * Creates a new dimension field.
     * @param string $code Specifies the field referral code.
     * @param string $displayName Specifies the field name to use in reports.
     * @param ?string $columnName Optional database column name for filtering or sorting.
     * Provide the column name if the column added to the SELECT statement cannot be
     * used directly, such as when it involves an aggregation function.
     * @param bool $sortable Specifies if the field is sortable.
     * @param bool $filterable Specifies if the field is filterable.
     */
    public function __construct(
        string $code,
        string $displayName,
        ?string $columnName = null,
        bool $sortable = false,
        bool $filterable = false
    ) {
        if (!strlen($code)) {
            throw new SystemException('The dimension field code cannot be empty.');
        }

        self::validateCode($code);

        if (!strlen($displayName)) {
            throw new SystemException('Display name cannot be empty.');
        }

        $this->displayName = $displayName;
        $this->sortable = $sortable;
        $this->filterable = $filterable;
        $this->code = $code;
        $this->columnName = $columnName;
    }

    /**
     * Returns the dimension field code.
     * @return string Returns the dimension field code.
     */
    public function getCode(): string
    {
        return $this->code;
    }

    /**
     * Returns a query column name corresponding to this dimension field.
     * @return string
     */
    public function getDataSetColumnName(): string
    {
        return $this->getCode();
    }

    /**
     * @deprecated Use getDataSetColumnName() instead
     */
    public function getDataSetColumName(): string
    {
        return $this->getDataSetColumnName();
    }

    /**
     * Returns the database column name if it was provided in the constructor.
     * @return ?string
     */
    public function getColumnName(): ?string
    {
        return $this->columnName;
    }

    /**
     * Validates a dimension field code.
     * @throws SystemException if the code is invalid.
     */
    public static function validateCode(string $code)
    {
        if (!preg_match('/^oc_field_[a-z][a-zA-Z0-9_]*$/', $code)) {
            throw new SystemException('The dimension field code must have the oc_field_ prefix
                and can only contain Latin letters, numbers and underscores.');
        }
    }

    /**
     * Determines if the field is sortable
     * @return bool Returns true if the field is sortable.
     */
    public function getIsSortable()
    {
        return $this->sortable;
    }

    /**
     * Determines if the field is filterable
     * @return bool Returns true if the field is filterable
     */
    public function getIsFilterable()
    {
        return $this->filterable;
    }

    /**
     * Returns the dimension field display name.
     * @return string
     */
    public function getDisplayName(): string
    {
        return $this->displayName;
    }
}
