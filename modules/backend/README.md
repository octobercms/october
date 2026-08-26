# Backend Module

The Backend module is October CMS's administration panel. It provides user authentication, a complete CRUD framework driven by YAML configuration, reusable widgets, navigation management, and Vue-based components for building rich admin interfaces. Where most frameworks require writing boilerplate controllers, form templates, and validation logic for every model, October CMS generates fully functional admin pages from a few lines of YAML -- with sorting, searching, filtering, relationships, and file uploads all handled automatically.

## Architecture Overview

The backend is built around **controllers**, **behaviors**, and **widgets**. This architecture eliminates repetitive CRUD development while remaining fully customizable when you need to go beyond the defaults:

- **Controllers** handle routes and render pages. All backend controllers extend `Backend\Classes\Controller`.
- **Behaviors** add CRUD patterns to controllers (forms, lists, relations) via the `$implement` property and YAML configuration files. A single controller can combine multiple behaviors to get a complete admin interface with zero hand-written HTML.
- **Widgets** are self-contained UI components (form fields, filters, toolbars) that can be embedded in any controller. Over 15 form widgets ship out of the box, from code editors to file uploaders to repeating field groups.

## Key Services

The module registers these singletons in the container:

| Service | Class | Description |
|---------|-------|-------------|
| `backend.helper` | `Backend\Helpers\Backend` | URL generation and backend utilities |
| `backend.auth` | `Backend\Classes\AuthManager` | Administrator authentication |
| `backend.menu` | `Backend\Classes\NavigationManager` | Backend menu system |
| `backend.roles` | `Backend\Classes\RoleManager` | Role and permission management |
| `backend.widgets` | `Backend\Classes\WidgetManager` | Widget registry |

## Facades

| Facade | Resolves to |
|--------|-------------|
| `Backend` | `Backend\Helpers\Backend` |
| `BackendAuth` | `Backend\Classes\AuthManager` |
| `BackendMenu` | `Backend\Classes\NavigationManager` |
| `BackendUi` | `Backend\Classes\UiFactory` |

## Controllers

Backend controllers extend `Backend\Classes\Controller` which provides AJAX handling, view rendering, widget management, and authentication. Built-in controllers:

| Controller | Purpose |
|------------|---------|
| `Auth` | Login, password reset, sign out |
| `AuthGates` | Two-factor and authentication gates |
| `Users` | Administrator management |
| `UserRoles` | Role management |
| `UserGroups` | Group management |
| `Preferences` | User preferences |
| `AccessLogs` | Access log viewer |
| `Index` | Backend dashboard redirect |
| `Files` | Secure file downloads |

## Behaviors

Behaviors are attached to controllers via the `$implement` property. They add complete CRUD functionality driven by YAML configuration.

### FormController

Provides create, update, and preview actions with YAML-configured form fields.

```php
class Posts extends \Backend\Classes\Controller
{
    public $implement = [
        \Backend\Behaviors\FormController::class,
    ];

    public $formConfig = 'config_form.yaml';
}
```

Configuration file (`config_form.yaml`) defines the model class, form fields file, and page titles. Fields are defined in a separate `fields.yaml` file with field types, labels, spans, and options.

### ListController

Provides an index action with sortable, searchable, filterable lists.

```php
public $implement = [
    \Backend\Behaviors\ListController::class,
];

public $listConfig = 'config_list.yaml';
```

Configuration defines columns (`columns.yaml`), default sort order, records per page, and available scopes (`scopes.yaml`) for filtering.

### RelationController

Manages model relationships (hasMany, belongsToMany, morphMany, etc.) with inline forms and lists.

```php
public $implement = [
    \Backend\Behaviors\RelationController::class,
];

public $relationConfig = 'config_relation.yaml';
```

### ImportExportController

Bulk import and export in CSV and JSON formats. Uses `ImportModel` and `ExportModel` base classes.

### ReorderController

Drag-and-drop reordering for sortable models.

## Widgets

### Core Widgets

| Widget | Description |
|--------|-------------|
| `Form` | Renders form fields from YAML configuration |
| `Lists` | Renders data tables with sorting and pagination |
| `ListStructure` | Tree-structured list with drag-and-drop |
| `Filter` | Scope-based list filtering |
| `Toolbar` | Button toolbar with search integration |
| `Search` | Search input widget |
| `Table` | Spreadsheet-style data editor |
| `ReportContainer` | Dashboard report widget container |
| `SiteSwitcher` | Multisite selector |
| `RoleImpersonator` | Permission testing via role impersonation |

### Form Widgets

Form widgets extend `Backend\Classes\FormWidgetBase` and provide specialized form field types:

| Widget | Description |
|--------|-------------|
| `CodeEditor` | Syntax-highlighted code editor |
| `RichEditor` | WYSIWYG HTML editor |
| `MarkdownEditor` | Markdown editor with preview |
| `FileUpload` | File attachment with drag-and-drop |
| `Relation` | Dropdown/list for model relationships |
| `DatePicker` | Date and time selection |
| `ColorPicker` | Color selection |
| `DataTable` | Editable spreadsheet |
| `RecordFinder` | Popup record selector |
| `Repeater` | Repeating field groups |
| `TagList` | Tag input |
| `NestedForm` | Embedded sub-forms |
| `Sensitive` | Masked input for secrets |
| `PermissionEditor` | Permission checkbox matrix |
| `PaletteEditor` | Color palette editor |

### Filter Widgets

Filter widgets extend `Backend\Classes\FilterWidgetBase` and provide list filter types:

| Widget | Description |
|--------|-------------|
| `Text` | Text/string filter |
| `Date` | Date range filter |
| `Number` | Numeric range filter |
| `Group` | Group/checkbox filter |

### Form Designs

Form designs control the visual layout of forms:

| Design | Description |
|--------|-------------|
| `BasicDesign` | Standard stacked form |
| `DocumentDesign` | Document-style with header and body |
| `PopupDesign` | Modal/popup form |
| `SidebarDesign` | Form with sidebar panel |
| `SurveyDesign` | Survey/wizard-style form |

## Vue Components

The backend provides reusable Vue 3 components that extend `Backend\Classes\VueComponentBase`:

| Component | Description |
|-----------|-------------|
| `Autocomplete` | Typeahead input |
| `CodeEditor` | Code editor wrapper |
| `MonacoEditor` | Monaco-based code editor |
| `RichEditor` | Rich text editor |
| `DocumentMarkdownEditor` | Markdown editor for documents |
| `Document` | Document layout frame |
| `Dropdown` | Dropdown selector |
| `DropdownMenu` | Context menu |
| `DropdownMenuButton` | Button with dropdown |
| `Modal` | Modal dialog |
| `Popover` | Popover tooltip |
| `Tabs` | Tabbed interface |
| `TreeView` | Hierarchical tree |
| `Splitter` | Resizable split panels |
| `ScrollablePanel` | Scrollable container |
| `Spreadsheet` | Spreadsheet editor |
| `Uploader` | File upload handler |
| `Inspector` | Property editor / inspector |
| `InfoTable` | Key-value display table |
| `LoadingIndicator` | Loading spinner |

## Models

| Model | Description |
|-------|-------------|
| `User` | Backend administrator accounts |
| `UserRole` | Permission roles |
| `UserGroup` | User groups |
| `UserPreference` | Per-user preferences |
| `BrandSetting` | Backend branding (colors, logo) |
| `EditorSetting` | Code editor preferences |
| `Preference` | Global backend preferences |
| `AccessLog` | Login/access audit log |
| `ImportModel` | Base class for CSV/JSON import |
| `ExportModel` | Base class for CSV/JSON export |

## Creating a Backend Controller

This controller class -- combined with two YAML config files for form fields and list columns -- produces a complete admin CRUD interface with create, update, delete, search, sort, pagination, and permission checks:

```php
<?php namespace Acme\Blog\Controllers;

use Backend\Classes\Controller;

class Posts extends Controller
{
    public $implement = [
        \Backend\Behaviors\FormController::class,
        \Backend\Behaviors\ListController::class,
    ];

    public $formConfig = 'config_form.yaml';
    public $listConfig = 'config_list.yaml';

    public $requiredPermissions = ['acme.blog.manage_posts'];
}
```

The controller's YAML config files and view partials live in a subdirectory matching the controller name (e.g., `controllers/posts/`). Every aspect of the generated interface can be overridden with PHP hooks or custom view partials when the defaults are not enough.

## Creating Custom Widgets

### Form Widget

```php
<?php namespace Acme\Blog\FormWidgets;

use Backend\Classes\FormWidgetBase;

class MyWidget extends FormWidgetBase
{
    public function render()
    {
        $this->prepareVars();
        return $this->makePartial('mywidget');
    }

    public function prepareVars()
    {
        $this->vars['value'] = $this->getLoadValue();
    }

    public function getSaveValue($value)
    {
        return $value;
    }
}
```

Register in your plugin:

```php
public function registerFormWidgets()
{
    return [
        \Acme\Blog\FormWidgets\MyWidget::class => 'mywidget',
    ];
}
```

### Filter Widget

Extend `Backend\Classes\FilterWidgetBase` and register via `registerFilterWidgets()`.

## Extension Points

### Events

| Event | Description |
|-------|-------------|
| `backend.menu.extendItems` | Extend backend navigation menu |
| `backend.roles.extendPermissions` | Add custom permissions |
| `backend.list.extendQueryBefore` | Modify list query before execution |
| `backend.list.extendRecords` | Modify list results |
| `backend.list.refresh` | After list refresh |
| `backend.user.login` | After successful login |
| `backend.layout.extendHead` | Add markup to backend `<head>` |
| `backend.layout.extendFooter` | Add markup before `</body>` |
| `backend.beforeRoute` | Before backend route resolution |
| `backend.route` | Custom backend route handling |

### Extending Controllers

```php
\Acme\Blog\Controllers\Posts::extend(function ($controller) {
    // Add extra behavior, modify config, etc.
});
```

### Extending Models

```php
\Backend\Models\User::extend(function ($model) {
    $model->hasMany['posts'] = \Acme\Blog\Models\Post::class;
});
```

## Skinning

The backend supports theming via `Backend\Classes\Skin`. The active skin is configured with `config('backend.skin')`. Skins are located in `modules/backend/skins/`.
