<?php namespace Dashboard\Widgets\Dash;

use BackendAuth;
use Backend\Classes\WidgetManager;
use Dashboard\Models\Dashboard as DashboardModel;

/**
 * ReportProcessor concern
 */
trait ReportProcessor
{
    /**
     * processOverrideFromDatabase
     */
    protected function processOverrideFromDatabase()
    {
        // @todo check if dash can be customized, if this is actually
        // enabled and allowed i.e not a static dash

        $this->isCustom = false;
        $this->allRows = null;

        $savedDash = (new DashboardModel)->fetchDashboard(
            $this->controller,
            $this->code
        );

        if ($savedDash && $savedDash->definition) {
            $this->reports = $this->allRows = $savedDash->definition;
            $this->isCustom = true;
        }
    }

    /**
     * processPermissionCheck check if user has permissions to show the report
     * and removes it if permission is denied
     */
    protected function processPermissionCheck(array $reports)
    {
        // For custom dashboards, get the list of permitted widgets once
        // listReportWidgets() filters widgets by permission
        $permittedWidgets = $this->isCustom
            ? WidgetManager::instance()->listReportWidgets()
            : null;

        foreach ($reports as $reportName => $report) {
            // Check explicit report permissions
            if (
                $report->permissions &&
                !BackendAuth::userHasAccess($report->permissions, false)
            ) {
                $this->removeReport($reportName);
                continue;
            }

            // For custom dashboards, also check widget class permissions
            if ($permittedWidgets !== null) {
                $widgetClass = $report->configuration['widgetClass'] ?? null;
                if ($widgetClass && !isset($permittedWidgets[$widgetClass])) {
                    $this->removeReport($reportName);
                }
            }
        }
    }

    /**
     * processDashWidgetReports processes dash widgets from flexible source (yaml or custom)
     */
    protected function processDashWidgetReports(array $reports)
    {
        if ($this->isCustom) {
            $this->processDashWidgetReportsFromCustomData($reports);
        }
        else {
            $this->processDashWidgetReportsFromYaml($reports);
        }
    }

    /**
     * processDashWidgetReportsFromCustom locates dash widgets from a custom data source
     */
    protected function processDashWidgetReportsFromCustomData(array $reports)
    {
        foreach ($reports as $report) {
            $newConfig = [
                'label' => $report->configuration['title'] ?? null,
                ...(array) $report->configuration
            ];

            $report->useConfig($newConfig);

            if (!in_array((string) $report->type, ['static', 'widget'])) {
                continue;
            }

            // Create form widget instance and bind to controller
            $this->makeDashReportWidget($report)->bindToController();
        }
    }

    /**
     * processDashWidgetReports will mutate reports types that are registered as widgets,
     * convert their type to 'widget' and internally allocate the widget object
     */
    protected function processDashWidgetReportsFromYaml(array $reports)
    {
        foreach ($reports as $report) {
            // Types static and widget are reserved
            if (
                in_array($report->type, ['static', 'widget']) ||
                !$this->isReportWidget((string) $report->type)
            ) {
                continue;
            }

            $newConfig = ['widget' => $report->type];

            if (is_array($report->config)) {
                $newConfig += $report->config;
            }

            $widgetType = $this->isVueReportWidget($report->type)
                ? 'widget'
                : 'static';

            $report->useConfig($newConfig)->displayAs($widgetType);

            // Create form widget instance and bind to controller
            $this->makeDashReportWidget($report)->bindToController();
        }
    }

    /**
     * processReportRows
     */
    protected function processReportRows(array $reports)
    {
        // Already loaded from saved dash
        if ($this->allRows) {
            return;
        }

        $rows = [];

        foreach ($reports as $report) {
            $extraConfig = [
                'metrics' => $this->processReportRowWidgetMetrics((array) $report->metrics),
                'widgetClass' => $report->widget,
            ];

            if ($report->type === 'widget') {
                $extraConfig['componentName'] = strtolower(str_replace('\\', '-', $report->widget));
            }

            $report->configuration($extraConfig + $report->config);

            $rows[$report->row]['widgets'][] = $report;
        }

        $this->allRows = array_values($rows);
    }

    /**
     * processReportRowWidgetMetrics
     */
    protected function processReportRowWidgetMetrics($metrics)
    {
        $result = [];

        foreach ($metrics as $name => $config) {
            $result[] = ['metric' => $name] + $config;
        }

        return $result;
    }
}
