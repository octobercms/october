<?php namespace Dashboard\Widgets\Dash;

use Lang;
use Dashboard\Classes\DashReport;
use Dashboard\Classes\DashManager;
use October\Rain\Html\Helper as HtmlHelper;
use SystemException;

/**
 * HasDashWidgets concern
 */
trait HasReportWidgets
{
    /**
     * @var array reportWidgets collection of all reports widgets used in this dash.
     */
    protected $reportWidgets = [];

    /**
     * @var \Backend\Classes\DashManager dashManager
     */
    protected $dashManager;

    /**
     * initReportWidgetsConcern
     */
    protected function initReportWidgetsConcern()
    {
        $this->dashManager = DashManager::instance();
    }

    /**
     * makeDashReportWidget object from a dash report object
     */
    protected function makeDashReportWidget(DashReport $report)
    {
        if (isset($this->reportWidgets[$report->reportName])) {
            return $this->reportWidgets[$report->reportName];
        }

        // Create dash widget instance
        $widgetProps = $report->config;
        $widgetProps['alias'] = $this->alias . studly_case($this->nameToId($report->reportName));

        $widgetClass = $widgetProps['widget'] ?? ($widgetProps['widgetClass'] ?? null);
        $widgetClass = $this->dashManager->resolveReportWidget($widgetClass);
        if (!class_exists($widgetClass)) {
            throw new SystemException(Lang::get(
                'backend::lang.widget.not_registered',
                ['name' => $widgetClass]
            ));
        }

        $widget = new $widgetClass($this->controller, $report, $widgetProps);

        return $this->reportWidgets[$report->reportName] = $widget;
    }

    /**
     * isReportWidget checks if a report type is a widget or not
     */
    protected function isReportWidget(string $reportType): bool
    {
        if (!$reportType) {
            return false;
        }

        if (strpos($reportType, '\\')) {
            return true;
        }

        $widgetClass = $this->dashManager->resolveReportWidget($reportType);
        if (!class_exists($widgetClass)) {
            return false;
        }

        if (
            is_subclass_of($widgetClass, \Dashboard\Classes\ReportWidgetBase::class) ||
            is_subclass_of($widgetClass, \Dashboard\Classes\VueReportWidgetBase::class)
        ) {
            return true;
        }

        return false;
    }

    /**
     * isVueReportWidget returns true if the widget is a vue report widget
     */
    protected function isVueReportWidget(string $reportType): bool
    {
        return $this->isReportWidget($reportType) &&
            $this->dashManager->isVueReportWidget($reportType);
    }

    /**
     * getReportWidgets for the instance
     */
    public function getReportWidgets(): array
    {
        return $this->reportWidgets;
    }

    /**
     * getReportWidget returns a specified report widget
     * @param string $report
     */
    public function getReportWidget($report)
    {
        if (isset($this->reportWidgets[$report])) {
            return $this->reportWidgets[$report];
        }

        return null;
    }

    /**
     * nameToId is a helper method to convert a report name to a valid ID attribute
     * @param $input
     * @return string
     */
    public function nameToId($input)
    {
        return HtmlHelper::nameToId($input);
    }
}
