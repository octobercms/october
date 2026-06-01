<?php namespace Dashboard\Widgets\Dash;

use Str;
use Lang;
use Dashboard\Classes\DashManager;
use Dashboard\Classes\ReportDataSourceBase;
use ApplicationException;

/**
 * HasPropertyOptions concern
 */
trait HasPropertyOptions
{
    /**
     * onInspectableGetOptions
     */
    public function onInspectableGetOptions()
    {
        // Disable asset broadcasting
        $this->flushAssets();

        $property = trim(post('inspectorProperty'));
        if (!$property) {
            throw new ApplicationException('The property name is not specified.');
        }

        $options = $this->getPropertyOptions($property);

        // Convert to array to retain the sort order in JavaScript
        $optionsArray = [];
        foreach ((array) $options as $value => $title) {
            $optionsArray[] = ['value' => $value, 'title' => Lang::get($title)];
        }

        return [
            'options' => $optionsArray
        ];
    }

    /**
     * getPropertyOptions returns options for multi-option properties (drop-downs, etc.)
     * @param string $property Specifies the property name
     * @return array Return an array of option values and descriptions
     */
    public function getPropertyOptions($property)
    {
        $allowedDimensionTypes = post('allowed_dimension_types');
        $allowedDimensionTypesArray = [];
        if (strlen($allowedDimensionTypes)) {
            $allowedDimensionTypesArray = explode(',', $allowedDimensionTypes);
        }

        if ($property === 'dataSource') {
            return $this->getDataSources($allowedDimensionTypesArray);
        }

        if ($property === 'dimension') {
            return $this->getDataSourceDimensions($allowedDimensionTypesArray);
        }

        if ($property === 'metric' || Str::endsWith($property, '_metric')) {
            return $this->getRequestedDataSourceDimensionMetrics();
        }

        if ($property === 'sortBy') {
            return $this->getDataSourceSortByOptions();
        }

        if ($property === 'dimension_fields') {
            return $this->getRequestedDataSourceDimensionFields();
        }

        if ($property === 'filter_attribute') {
            return $this->getRequestedDataSourceFilterAttributes();
        }

        return $this->getReportWidgetPropertyOptions($property);
    }

    /**
     * getReportWidgetPropertyOptions resolves dynamic options from a report widget class
     */
    private function getReportWidgetPropertyOptions(string $property): array
    {
        $className = post('widgetClass') ?: post('inspectorClassName');
        if (!$className || $className === 'undefined') {
            return [];
        }

        $traitFound = in_array(\System\Traits\PropertyContainer::class, class_uses_recursive($className));
        if (!$traitFound) {
            return [];
        }

        $obj = new $className($this->controller, null);
        $obj->setProperties(post());

        // Nested properties have names like object.property
        // Convert them to ObjectProperty
        $propertyMethodName = '';
        foreach (explode('.', $property) as $part) {
            $part = trim($part);
            if (strlen($part)) {
                $propertyMethodName .= ucfirst($part);
            }
        }

        // Find options method
        $propertyConfig = $obj->defineProperties()[$property] ?? [];
        $optionsMethod = $propertyConfig['optionsMethod'] ?? ($propertyConfig['options'] ?? null);
        $methodName = is_string($optionsMethod)
            ? $optionsMethod
            : 'get'.$propertyMethodName.'Options';

        if (method_exists($obj, $methodName)) {
            return $obj->$methodName();
        }

        return $obj->getPropertyOptions($property);
    }

    /**
     * getDataSources
     */
    private function getDataSources(array $allowedDimensionTypesArray)
    {
        $dataSourceManager = DashManager::instance();
        $dataSourceClasses = $dataSourceManager->listDataSourceClasses();

        $result = [];
        foreach ($dataSourceClasses as $className => $displayName) {
            $allowedDimensions = $this->getDataSourceDimensions($allowedDimensionTypesArray, $className);
            if (!count($allowedDimensions)) {
                continue;
            }

            $result[$className] = $displayName;
        }

        return $result;
    }

    /**
     * getDataSourceDimensions
     */
    private function getDataSourceDimensions(array $allowedDimensionTypesArray, ?string $dataSourceClass = null)
    {
        $dataSourceClass = $dataSourceClass ?? post('dataSource');
        if (!strlen($dataSourceClass)) {
            return [];
        }

        $dimensionsLimited = count($allowedDimensionTypesArray) > 0;
        $dataSource = $this->makeDataSource($dataSourceClass);
        $dimensions = $dataSource->getAvailableDimensions();
        $result = [];
        foreach ($dimensions as $dimension) {
            $dimensionType = $dimension->getDimensionType();
            if (
                $dimensionsLimited &&
                (strlen($dimensionType) && !in_array($dimensionType, $allowedDimensionTypesArray))
            ) {
                continue;
            }

            if (!$dimensionsLimited && strlen($dimensionType)) {
                continue;
            }

            $result[$dimension->getCode()] = $dimension->getDisplayName();
        }

        return $result;
    }

    /**
     * getRequestedDataSourceDimensionMetrics
     */
    private function getRequestedDataSourceDimensionMetrics()
    {
        $dataSourceClass = post('dataSource');
        $dimensionCode = post('dimension');

        if (!strlen($dataSourceClass) || !strlen($dimensionCode)) {
            return [];
        }

        $dataSource = $this->makeDataSource($dataSourceClass);
        return $this->getDataSourceDimensionMetrics($dataSource, $dimensionCode);
    }

    /**
     * getDataSourceDimensionMetrics
     */
    private function getDataSourceDimensionMetrics(ReportDataSourceBase $dataSource, string $dimensionCode): array
    {
        $allMetrics = $this->listAllMetrics($dataSource, $dimensionCode);
        $result = [];
        foreach ($allMetrics as $metric) {
            $result[$metric->getCode()] = Lang::get($metric->getDisplayName());
        }

        return $result;
    }

    /**
     * getDataSourceSortByOptions
     */
    private function getDataSourceSortByOptions()
    {
        $dimensionCode = post('dimension');
        $metricsConfig = post('metrics');
        $dataSourceClass = post('dataSource');

        if (!$dimensionCode || !$metricsConfig) {
            return [];
        }

        $dataSource = $this->makeDataSource($dataSourceClass);
        $dimension = $this->findDimension($dataSource, $dimensionCode, false);
        if (!$dimension) {
            return [];
        }

        $result = [
            'oc_dimension' => Lang::get($dimension->getDisplayName()),
        ];

        if ($dimension->isDate()) {
            return $result;
        }

        foreach ($metricsConfig as $metricConfig) {
            $metric = $this->findMetric($dataSource, $dimension, $metricConfig['metric']);
            $result['oc_metric-' . $metric->getCode()] = Lang::get($metric->getDisplayName());
        }

        $fields = $dimension->getDimensionFields();
        foreach ($fields as $field) {
            $result[$field->getCode()] = Lang::get($field->getDisplayName());
        }

        return $result;
    }


    /**
     * getRequestedDataSourceFilterAttributes
     */
    private function getRequestedDataSourceFilterAttributes()
    {
        $dataSourceClass = post('dataSource');
        $dimensionCode = post('dimension');
        $dataSource = $this->makeDataSource($dataSourceClass);
        $dimension = $this->findDimension($dataSource, $dimensionCode, false);
        if (!$dimension) {
            return [];
        }

        $result = [];
        if (!$dimension->isDate()) {
            // Date dimensions can't be filtered. They must use the
            // dashboard or widget interval settings.
            $result['oc_dimension'] = Lang::get($dimension->getDisplayName());
        }

        $dimensionFields = $this->getRequestedDataSourceDimensionFields(true);
        foreach ($dimensionFields as $code => $title) {
            $result[$code] = $title;
        }

        return $result;
    }

    /**
     * getRequestedDataSourceDimensionFields
     */
    private function getRequestedDataSourceDimensionFields($filterableOnly = false)
    {
        $dataSourceClass = post('dataSource');
        $dimensionCode = post('dimension');

        if (!strlen($dataSourceClass) || !strlen($dimensionCode)) {
            return [];
        }

        $dataSource = $this->makeDataSource($dataSourceClass);
        $dimension = $this->findDimension($dataSource, $dimensionCode, false);
        if (!$dimension) {
            return [];
        }

        $fields = $dimension->getDimensionFields();
        $result = [];
        foreach ($fields as $field) {
            if (!($filterableOnly && !$field->getIsFilterable())) {
                $result[$field->getCode()] = Lang::get($field->getDisplayName());
            }
        }

        return $result;
    }
}
