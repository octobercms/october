<?php namespace Dashboard\Classes\DashManager;

use SystemException;
use Backend\Classes\Controller;
use Backend\Classes\WidgetManager;
use Dashboard\Classes\VueReportWidgetBase;

/**
 * HasVueReportWidgets
 *
 * @package october\dashboard
 * @author Alexey Bobkov, Samuel Georges
 */
trait HasVueReportWidgets
{
    /**
     * listVueReportWidgetClasses returns class names and registration parameters of registered dashboard widgets.
     */
    public function listVueReportWidgetClasses(): array
    {
        return array_keys($this->listVueReportWidgets());
    }

    /**
     * listVueReportWidgets returns the Vue report widgets available to the current user, keyed by class name.
     * @return array
     */
    public function listVueReportWidgets()
    {
        $widgets = [];
        foreach (WidgetManager::instance()->listReportWidgets() as $className => $widgetInfo) {
            if (is_subclass_of($className, VueReportWidgetBase::class)) {
                $widgets[$className] = $widgetInfo;
            }
        }

        return $widgets;
    }

    /**
     * isVueReportWidget
     */
    public function isVueReportWidget($widgetCodeOrClass): bool
    {
        $widgetClass = WidgetManager::instance()->resolveReportWidget($widgetCodeOrClass);

        return is_subclass_of($widgetClass, VueReportWidgetBase::class);
    }

    /**
     * getWidget returns a dashboard widget instance by its class name.
     * @throws SystemException if the provided class name is not a subclass Dashboard\Classes\VueReportWidgetBase.
     * @param string $className A dashboard widget class name.
     * @param Controller $controller Parent controller instance.
     * @return ?VueReportWidgetBase Returns the dashboard widget instance or null.
     */
    public function getVueReportWidget(string $className, Controller $controller): ?VueReportWidgetBase
    {
        if (!array_key_exists($className, $this->listVueReportWidgets())) {
            return null;
        }

        if (!is_subclass_of($className, VueReportWidgetBase::class)) {
            throw new SystemException("The provided class is not a dashboard widget: {$className}");
        }

        return new $className($controller);
    }
}
