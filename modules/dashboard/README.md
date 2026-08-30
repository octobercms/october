# Dashboard Module

The Dashboard module provides customizable admin dashboards with report widgets, data visualizations, traffic analytics, and system health indicators. Dashboards can be assigned to roles and personalized per user. The module includes a data source abstraction that separates data retrieval from presentation, so plugins can expose their own metrics and have them rendered as charts, tables, or indicators without building any frontend UI.

## Architecture Overview

The dashboard system is built around three concepts:

- **Data sources** provide raw data (dimensions and metrics) from the database or external services.
- **Report widgets** visualize data source output as charts, tables, indicators, and other formats.
- **Dashboards** are named collections of report widgets with layout configuration, assignable to user roles.

## Key Services

| Service | Class | Description |
|---------|-------|-------------|
| `DashManager` | `Dashboard\Classes\DashManager` | Central registry for data sources and widgets |

## Controllers

| Controller | Route | Description |
|------------|-------|-------------|
| `Index` | `/dashboard` | Displays the user's active dashboard |
| `Dashboards` | `/dashboard/dashboards` | CRUD for dashboard definitions |
| `DashboardSettings` | `/dashboard/dashboardsettings` | Traffic statistics configuration |

## Dashboard Resolution

When a user visits the dashboard, the system resolves which dashboard to show:

1. User's personal dashboard (if they have customized one)
2. Role-assigned dashboard (matching the user's role)
3. System default dashboard

Users can personalize their dashboard layout without affecting the original definition.

## Data Sources

Data sources extend `Dashboard\Classes\ReportDataSourceBase` and define available dimensions and metrics. Plugins only need to declare what data they can provide -- the dashboard handles all chart rendering, date grouping, comparison, and layout:

```php
<?php namespace Acme\Analytics\Classes;

use Dashboard\Classes\ReportDataSourceBase;

class SalesDataSource extends ReportDataSourceBase
{
    public function registerDimensions(): array
    {
        return [
            'date' => ['title' => 'Date', 'type' => 'date'],
            'product' => ['title' => 'Product', 'type' => 'string'],
        ];
    }

    public function registerMetrics(): array
    {
        return [
            'revenue' => ['title' => 'Revenue', 'type' => 'currency'],
            'orders' => ['title' => 'Orders', 'type' => 'number'],
        ];
    }

    public function fetchData(ReportFetchData $fetchData): ReportFetchDataResult
    {
        // Query database and return results
    }
}
```

### Built-in Data Sources

| Data Source | Description |
|-------------|-------------|
| `SystemReportDataSource` | System health, versions, warnings, permissions |
| `CmsReportDataSource` | Website traffic (page views, unique visitors, grouped by date/path/referrer) |
| `CmsStatusDataSource` | Website status (online/maintenance mode indicator) |

### Registering a Data Source

```php
use Dashboard\Classes\DashManager;

public function boot()
{
    DashManager::instance()->registerDataSourceClass(
        'sales',
        \Acme\Analytics\Classes\SalesDataSource::class
    );
}
```

## Report Widgets

Report widgets extend `Dashboard\Classes\VueReportWidgetBase` and render data from data sources.

### Built-in Widget Types

- **Chart** - Line, bar, pie, and other chart types
- **Table** - Tabular data display
- **Indicator** - Single metric with comparison
- **Static** - Static content
- **Section Title** - Section heading
- **Text Notice** - Informational text
- **Error** - Error display

### Registering a Report Widget

In your plugin's `Plugin.php`:

```php
public function registerReportWidgets()
{
    return [
        \Acme\Analytics\Widgets\SalesChart::class => [
            'label' => 'Sales Chart',
            'context' => 'dashboard',
        ],
    ];
}
```

## DashController Behavior

Any backend controller can embed a dashboard by implementing the `DashController` behavior:

```php
class MyController extends \Backend\Classes\Controller
{
    public $implement = [
        \Dashboard\Behaviors\DashController::class,
    ];

    public $dashConfig = 'config_dash.yaml';
}
```

## Extension Points

### Events

| Event | Description |
|-------|-------------|
| `backend.dash.extendReportsBefore` | Before reports are loaded |
| `backend.dash.extendReports` | Add or remove reports from a dashboard |

### Extending Dashboards

```php
Event::listen('backend.dash.extendReports', function ($dashWidget) {
    $dashWidget->addReports([/* ... */]);
    $dashWidget->removeReport('some-report-id');
});
```

## Traffic Logging

The `TrafficLogger` class records page views from the CMS frontend. Statistics are stored in the `dashboard_traffic_stats_pageviews` table and queried by `CmsReportDataSource` for traffic analytics widgets.

## Database Tables

| Table | Description |
|-------|-------------|
| `dashboard_dashboards` | Dashboard definitions and configuration |
| `dashboard_dashboards_roles` | Role assignments for dashboards |
| `dashboard_traffic_stats_pageviews` | Page view tracking data |
| `dashboard_report_data_caches` | Query result caching |

## Permissions

| Permission | Description |
|------------|-------------|
| `dashboard` | Access the dashboard |
| `dashboard.manage` | Create and edit dashboards |
| `dashboard.internal_traffic_statistics` | Configure traffic statistics settings |
