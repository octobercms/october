<?php namespace Dashboard\Classes\DashManager;

use Lang;
use SystemException;
use Dashboard\Classes\ReportDataSourceBase;

/**
 * HasDataSources
 *
 * @package october\dashboard
 * @author Alexey Bobkov, Samuel Georges
 */
trait HasDataSources
{
    /**
     * @var string[]
     */
    protected $dataSources = [];

    /**
     * registerDataSourceClass registers a report data source.
     * @param string $className A class name of a data source.
     * The class must extend Dashboard\Classes\ReportDataSourceBase
     * @param string $displayName The data source name to display in the user interface.
     */
    public function registerDataSourceClass(string $className, string $displayName): void
    {
        $this->dataSources[$className] = [
            'displayName' => $displayName
        ];
    }

    /**
     * getDataSource returns a data source instance by its class name.
     * @throws SystemException if the provided class name is not a subclass Dashboard\Classes\ReportDataSourceBase.
     * @param string $className A data source class name.
     * @return ?ReportDataSourceBase Returns the data source instance or null.
     */
    public function getDataSource(string $className): ?ReportDataSourceBase
    {
        if (!array_key_exists($className, $this->dataSources)) {
            return null;
        }

        if (!is_subclass_of($className, ReportDataSourceBase::class)) {
            throw new SystemException("The provided class is not a report data source: " . $className);
        }

        return new $className();
    }

    /**
     * listDataSourceClasses returns class and display names of registered data sources.
     * @return array
     */
    public function listDataSourceClasses(): array
    {
        $result = [];
        foreach ($this->dataSources as $className => $info) {
            $result[$className] = $info['displayName'];
        }
        return $result;
    }

    /**
     * getDefaultWidgetConfigs returns the default widget configuration for data source dimensions that have a defined type.
     * @return array
     */
    public function getDefaultWidgetConfigs(): array
    {
        $result = [];
        $dataSourceClasses = $this->listDataSourceClasses();
        foreach ($dataSourceClasses as $className => $displayName) {
            $dataSource = $this->getDataSource($className);
            if (!$dataSource) {
                continue;
            }

            $dimensions = $dataSource->getAvailableDimensions();

            foreach ($dimensions as $dimension) {
                $type = $dimension->getDimensionType();
                if (!$type) {
                    continue;
                }

                $defaultConfig = $dimension->getDefaultWidgetConfig();
                $defaultConfig['dimension'] = $dimension->getCode();
                $defaultConfig['dataSource'] = $className;

                $dataSourceName = Lang::get($displayName);
                $menuItemData = [
                    'config' => $defaultConfig,
                    'dimension' => Lang::get($dimension->getDisplayName()),
                ];

                $result[$type] ??= [];
                $result[$type][$dataSourceName] ??= [];
                $result[$type][$dataSourceName][] = $menuItemData;
            }
        }

        return $result;
    }
}
