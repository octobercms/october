<?php namespace Dashboard\Classes;

use App;
use Backend\Classes\WidgetManager;
use System\Classes\PluginManager;
use SystemException;

/**
 * DashManager manages dashboards, report data sources and widgets.
 *
 * @package october\dashboard
 * @author Alexey Bobkov, Samuel Georges
 */
class DashManager
{
    use \System\Traits\ConfigMaker;
    use \Dashboard\Classes\DashManager\HasDashboards;
    use \Dashboard\Classes\DashManager\HasDataSources;
    use \Dashboard\Classes\DashManager\HasVueReportWidgets;

    /**
     * instance creates a new instance of this singleton
     */
    public static function instance(): static
    {
        return App::make('dashboard.dashboards');
    }

    /**
     * listRegistrations returns the items registered with the registerDashboards method for the
     * dashboards, widgets or dataSources group, where a plain array registers dashboards only
     */
    public function listRegistrations(string $group): array
    {
        $result = [];

        $bundles = PluginManager::instance()->getRegistrationMethodValues('registerDashboards');
        foreach ($bundles as $items) {
            if (!is_array($items)) {
                continue;
            }

            if (!array_intersect_key($items, array_flip(['dashboards', 'widgets', 'dataSources']))) {
                $items = ['dashboards' => $items];
            }

            foreach ((array) ($items[$group] ?? []) as $key => $value) {
                $result[$key] = $value;
            }
        }

        return $result;
    }

    /**
     * listAllReportWidgetGroups
     */
    public function listAllReportWidgetGroups()
    {
        $groups = [];
        foreach (WidgetManager::instance()->listReportWidgets() as $className => $widgetInfo) {
            $group = __($widgetInfo['group'] ?? "Widgets");
            $groups[$group] ??= [];

            $isVueReport = is_subclass_of($className, \Dashboard\Classes\VueReportWidgetBase::class);
            if ($isVueReport) {
                $componentName = $this->resolveVueComponentName($className);
                $groups[$group][] = [
                    'type' => 'widget',
                    'label' => __($widgetInfo['label'] ?? "Unknown"),
                    'widgetClass' => $className,
                    'componentName' => $componentName
                ];
            }
            else {
                $groups[$group][] = [
                    'type' => 'static',
                    'label' => __($widgetInfo['label'] ?? "Unknown"),
                    'widgetClass' => $className
                ];
            }
        }

        return $groups;
    }

    /**
     * resolveVueComponentName reads the $componentName property from a Vue widget class
     * without instantiating it. Falls back to deriving the name from the class name.
     */
    protected function resolveVueComponentName(string $className): string
    {
        $defaults = (new \ReflectionClass($className))->getDefaultProperties();

        return $defaults['componentName']
            ?? strtolower(str_replace('\\', '-', $className));
    }

    /**
     * resolveReportWidget returns a class name from a report widget code
     * Normalizes a class name or converts an code to its class name.
     * Returns the class name resolved, or the original name.
     * @param string $name
     * @return string
     */
    public function resolveReportWidget($name)
    {
        return WidgetManager::instance()->resolveReportWidget($name);
    }
}
