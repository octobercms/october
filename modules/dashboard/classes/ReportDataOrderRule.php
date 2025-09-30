<?php namespace Dashboard\Classes;

use Str;
use SystemException;

/**
 * ReportDataOrderRule represents a report data order rule.
 */
class ReportDataOrderRule
{
    const ATTR_TYPE_DIMENSION = 'dimension';
    const ATTR_TYPE_METRIC = 'metric';
    const ATTR_TYPE_DIMENSION_FIELD = 'dimension_field';

    private $dataAttributeType;
    private $attributeName;
    private $isAscending;

    /**
     * __construct a report data order rule.
     * @param string $dataAttributeType Specifies the data attribute type.
     * One of the ATTR_TYPE_* constants.
     * @param string $attributeName Specifies the attribute name, e.g. a metric code.
     * Must not be null if the data attribute type is ATTR_TYPE_DIMENSION_FIELD or ATTR_TYPE_METRIC.
     * Must be null if the data attribute type is ATTR_TYPE_DIMENSION.
     * @param bool $isAscending Specifies if the order is ascending or descending.
     */
    public function __construct(string $dataAttributeType, ?string $attributeName = null, bool $isAscending = true)
    {
        $knownAttributeTypes = [
            self::ATTR_TYPE_DIMENSION,
            self::ATTR_TYPE_METRIC,
            self::ATTR_TYPE_DIMENSION_FIELD
        ];
        if (!in_array($dataAttributeType, $knownAttributeTypes)) {
            throw new SystemException('Invalid data attribute type. Supported types: ' . implode(', ', $knownAttributeTypes));
        }

        if (!$attributeName && $dataAttributeType !== self::ATTR_TYPE_DIMENSION) {
            throw new SystemException('Attribute name cannot be empty for ' . $dataAttributeType . ' data attribute type.');
        }

        if ($attributeName && $dataAttributeType === self::ATTR_TYPE_DIMENSION) {
            throw new SystemException('Attribute name must be empty for ' . self::ATTR_TYPE_DIMENSION . ' data attribute type.');
        }

        if ($dataAttributeType === self::ATTR_TYPE_DIMENSION_FIELD) {
            ReportDimensionField::validateCode($attributeName);
        }

        $this->dataAttributeType = $dataAttributeType;
        $this->attributeName = $attributeName;
        $this->isAscending = $isAscending;
    }

    /**
     * Creates the order rule from a widget configuration.
     * @param string $sortOrder Specifies the sort order, the allowed values are "asc", "desc".
     * @param string $sortBy Specifies the data attribute type and code, e.g. "oc_dimension" or "oc_metric-[metric-code]"
     */
    public static function createFromWidgetConfig(string $sortOrder, string $sortBy)
    {
        $isAscending = $sortOrder === 'asc';
        $dataAttributeType = self::ATTR_TYPE_DIMENSION;
        $attributeName = null;

        if (Str::startsWith($sortBy, 'oc_metric-')) {
            $dataAttributeType = self::ATTR_TYPE_METRIC;
            $attributeName = substr($sortBy, 10);
        }

        if (Str::startsWith($sortBy, 'oc_field_')) {
            $dataAttributeType = self::ATTR_TYPE_DIMENSION_FIELD;
            $attributeName = $sortBy;
        }

        return new self($dataAttributeType, $attributeName, $isAscending);
    }

    /**
     * Returns the data attribute type.
     * @return string
     */
    public function getDataAttributeType()
    {
        return $this->dataAttributeType;
    }

    /**
     * Returns the attribute name.
     * @return string
     */
    public function getAttributeName()
    {
        return $this->attributeName;
    }

    /**
     * Returns if the order is ascending or descending.
     * @return bool
     */
    public function isAscending()
    {
        return $this->isAscending;
    }
}
