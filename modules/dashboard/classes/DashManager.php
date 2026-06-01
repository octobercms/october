<?php namespace Dashboard\Classes;

use App;
use Backend\Classes\WidgetManager;
use SystemException;

/**
 * DashManager manages report data sources and widgets.
 *
 * @package october\dashboard
 * @author Alexey Bobkov, Samuel Georges
 */
class DashManager
{
    use \Dashboard\Classes\DashManager\HasDataSources;
    use \Dashboard\Classes\DashManager\HasVueReportWidgets;

    /**
     * @var \System\Classes\WidgetManager widgetManager
     */
    protected $widgetManager;

    /**
     * __construct this class
     */
    public function __construct()
    {
        $this->widgetManager = WidgetManager::instance();
    }

    /**
     * instance creates a new instance of this singleton
     */
    public static function instance(): static
    {
        return App::make('dashboard.dashboards');
    }

    /**
     * listAllReportWidgetGroups
     */
    public function listAllReportWidgetGroups()
    {
        $groups = [];
        foreach ($this->widgetManager->listReportWidgets() as $className => $widgetInfo) {
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
        return $this->widgetManager->resolveReportWidget($name);
    }
}
