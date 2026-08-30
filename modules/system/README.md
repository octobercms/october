# System Module

The System module is October CMS's core infrastructure layer, built on top of Laravel. It manages plugin lifecycle, database migrations, mail templates, settings, asset compilation, image resizing, multisite configuration, and the Twig markup engine. It bootstraps before all other modules and is required for the entire CMS to function. The System module is what makes October CMS a true plugin-based platform -- every feature beyond core infrastructure is delivered as a self-contained plugin with its own migrations, permissions, settings, and navigation, all discovered and managed automatically.

## Architecture Overview

The System module is responsible for:

- **Plugin management** - discovering, loading, registering, and booting plugins
- **Update management** - running migrations and communicating with the marketplace
- **Mail system** - Twig-based email templates with database overrides
- **Settings system** - plugin and module settings stored in the database
- **Asset compilation** - combining, minifying, and preprocessing CSS/JS
- **Image resizing** - on-demand thumbnail generation with caching
- **Multisite** - per-site configuration, routing, and content isolation
- **Twig engine** - the markup engine with custom functions, filters, and security

## Key Services

| Service | Class | Description |
|---------|-------|-------------|
| `system.plugins` | `System\Classes\PluginManager` | Plugin discovery, loading, and lifecycle |
| `system.updater` | `System\Classes\UpdateManager` | Migrations and marketplace updates |
| `system.versions` | `System\Classes\VersionManager` | Plugin version tracking |
| `system.mailer` | `System\Classes\MailManager` | Email template rendering |
| `system.settings` | `System\Classes\SettingsManager` | Settings page registry |
| `system.sites` | `System\Classes\SiteManager` | Multisite management |
| `system.combiner` | `System\Classes\CombineAssets` | CSS/JS asset compilation |
| `system.resizer` | `System\Classes\ResizeImages` | Image resize and thumbnailing |
| `system.markup` | `System\Classes\MarkupManager` | Twig extension registry |
| `system.manifest` | `System\Classes\ManifestCache` | Manifest file caching |

## Plugin System

### Plugin Lifecycle

Plugins are self-contained packages that live in `plugins/{author}/{name}/` and have a `Plugin.php` registration file extending `System\Classes\PluginBase`. Each plugin brings its own migrations, models, controllers, components, permissions, settings, and navigation -- installed by dropping it in a directory or running a single command. No service provider wiring, no manual route registration, no config publishing.

**Phase 1 - Discovery:** PluginManager scans the `plugins/` directory for `Plugin.php` files, respects the disabled list, and sorts by dependency order.

**Phase 2 - Registration:** For each plugin, the manager loads the composer autoloader, registers config/views/language namespaces, and calls `register()`.

**Phase 3 - Boot:** After all plugins are registered, the manager calls `boot()` on each plugin.

### PluginBase Methods

| Method | Description |
|--------|-------------|
| `register()` | Register services, listeners, and bindings |
| `boot()` | Boot logic after all plugins are registered |
| `registerComponents()` | CMS components |
| `registerMarkupTags()` | Twig functions and filters |
| `registerNavigation()` | Backend menu items |
| `registerPermissions()` | Permission definitions |
| `registerSettings()` | Settings pages |
| `registerMailTemplates()` | Mail template definitions |
| `registerMailPartials()` | Mail partials |
| `registerMailLayouts()` | Mail layouts |
| `registerFormWidgets()` | Form field widgets |
| `registerFilterWidgets()` | List filter widgets |
| `registerReportWidgets()` | Dashboard report widgets |
| `registerContentFields()` | Tailor content fields |
| `registerSchedule($schedule)` | Scheduled tasks |
| `registerConsoleCommand($key, $class)` | Artisan commands |

### Plugin Dependencies

Plugins declare dependencies with the `$require` property:

```php
public $require = ['Acme.User', 'Acme.Billing'];
```

The PluginManager resolves and sorts by dependency order automatically.

## Mail System

The mail system intercepts Laravel's mailer to render emails using Twig templates stored in the database.

### How it Works

1. Plugins register mail template codes mapped to view files
2. `MailTemplate::syncAll()` imports plugin templates into the database
3. Administrators can customize templates in the backend
4. When mail is sent, `MailManager` intercepts the content and renders the Twig template with the database-stored version (if customized)

### Components

| Component | Description |
|-----------|-------------|
| `MailTemplate` | Email template content (subject, body, code) |
| `MailLayout` | Wrapper template (default, system, or custom) |
| `MailPartial` | Reusable email components (header, footer, button, panel) |
| `MailSetting` | SMTP/mail driver configuration |

### Registering Templates

```php
public function registerMailTemplates()
{
    return [
        'acme.blog:new-post' => 'acme.blog::mail.new-post',
    ];
}
```

Features include CSS inlining for email clients and full Twig syntax support with custom token parsers.

## Settings System

### SettingModel

`System\Models\SettingModel` is the base class for plugin settings. Settings are stored in the `system_settings` table with per-site isolation for multisite.

```php
<?php namespace Acme\Blog\Models;

class Settings extends \System\Models\SettingModel
{
    public $settingsCode = 'acme_blog_settings';

    public $settingsFields = 'fields.yaml';
}
```

Read and write settings:

```php
Settings::get('api_key');
Settings::set('api_key', 'new-value');
```

### SettingsManager

The `SettingsManager` organizes settings pages into categories. Plugins register settings pages with `registerSettings()`:

```php
public function registerSettings()
{
    return [
        'settings' => [
            'label' => 'Blog Settings',
            'description' => 'Configure the blog plugin',
            'category' => 'Blog',
            'icon' => 'icon-pencil',
            'class' => \Acme\Blog\Models\Settings::class,
            'order' => 500,
        ],
    ];
}
```

## Asset Compilation

The `CombineAssets` class combines and minifies CSS/JS files:

- **Combining** - groups multiple files into a single request
- **Minification** - optional whitespace removal
- **Preprocessing** - LESS, SCSS, and Sass support
- **Caching** - ETags and deep hashing for change detection
- **Bundles** - pre-compiled asset groups defined in config

## Image Resizing

The `ResizeImages` class generates thumbnails on demand:

- URL-based resizing with safe encoding to prevent abuse
- Options: mode (auto/crop/exact), quality, sharpen, interlace
- Cached to `storage/app/resources/resize/`

## Multisite

The `SiteManager` handles multisite routing and configuration:

- **SiteDefinition** - per-site config (domain, language, locale, URL prefix)
- **Routing** - automatic site detection from hostname or URL prefix
- **Settings** - per-site setting values via `SettingModel`
- **Content** - per-site content isolation in Tailor and CMS

## Twig / Markup Engine

The `MarkupManager` registers Twig extensions from modules and plugins.

### Built-in Functions

Over 40 functions including: `input()`, `post()`, `get()`, `url()`, `route()`, `asset()`, `config()`, `env()`, `session()`, `trans()`, `str_*()`, `md()` (markdown), `html_*()`, `time_since()`, `time_tense()`, `collect()`, `carbon()`, `dump()`

### Adding Custom Markup

Plugins register Twig functions and filters via `registerMarkupTags()`:

```php
public function registerMarkupTags()
{
    return [
        'functions' => [
            'myFunction' => [$this, 'myFunctionHandler'],
        ],
        'filters' => [
            'myFilter' => [$this, 'myFilterHandler'],
        ],
    ];
}
```

### Security Policy

The Twig security policy (`System\Twig\SecurityPolicy`) prevents dangerous operations in templates, controlling which methods and properties can be accessed.

## Console Commands

### System Commands

| Command | Description |
|---------|-------------|
| `october:migrate` | Run all pending migrations |
| `october:update` | Check for and apply updates |
| `october:fresh` | Reset the demo theme |
| `october:up` | Bring the application online |
| `october:down` | Put the application into maintenance mode |
| `october:passwd` | Change an admin password |
| `october:mirror` | Mirror public files for symlink-free hosting |
| `october:optimize` | Optimize the application |
| `october:util` | Utility commands |
| `october:about` | Display application information |

### Plugin Commands

| Command | Description |
|---------|-------------|
| `plugin:install` | Install a plugin |
| `plugin:remove` | Remove a plugin |
| `plugin:enable` | Enable a disabled plugin |
| `plugin:disable` | Disable a plugin |
| `plugin:refresh` | Re-run a plugin's migrations |
| `plugin:seed` | Run a plugin's seeder |
| `plugin:list` | List installed plugins |
| `plugin:check` | Check plugin dependencies |
| `plugin:test` | Run a plugin's tests |

## Models

| Model | Description |
|-------|-------------|
| `File` | File attachments (used by `$attachOne` / `$attachMany`) |
| `MailTemplate` | Email template content |
| `MailLayout` | Email layout wrappers |
| `MailPartial` | Reusable email components |
| `MailSetting` | Mail driver configuration |
| `Parameter` | Internal key-value store |
| `EventLog` | System event and error log |
| `PluginVersion` | Plugin version tracking |
| `SiteDefinition` | Multisite configuration |

## Important Traits

| Trait | Description |
|-------|-------------|
| `AssetMaker` | Register CSS/JS assets in controllers and widgets |
| `ViewMaker` | Render partials and views with variable injection |
| `ConfigMaker` | Parse YAML configuration files |
| `ResponseMaker` | Create AJAX and redirect responses |
| `EventEmitter` | Fire and listen to local events on objects |

## Key Database Tables

| Table | Description |
|-------|-------------|
| `system_files` | File attachments |
| `system_settings` | Plugin and module settings |
| `system_parameters` | Internal parameters |
| `system_plugin_versions` | Installed plugin versions |
| `system_plugin_history` | Migration history per plugin |
| `system_mail_templates` | Email templates |
| `system_mail_layouts` | Email layouts |
| `system_mail_partials` | Email partials |
| `system_event_logs` | Error and event log |
| `system_request_logs` | HTTP request log |
| `system_site_definitions` | Multisite definitions |
| `system_site_groups` | Site groups |
| `deferred_bindings` | Temporary model relationships |

## Extension Points

### Events

| Event | Description |
|-------|-------------|
| `system.settings.extendItems` | Extend settings pages |
| `system.updater.migrate` | After migrations complete |
| `mailer.beforeAddContent` | Override email content rendering |
| `exception.beforeReport` | Before an exception is reported |
| `exception.beforeRender` | Before an exception is rendered |
| `backend.ajax.beforeRunHandler` | Before AJAX handler execution |
| `console.schedule` | Register scheduled tasks |

### Module Bootstrap Order

1. System module registers and loads all other modules
2. All plugins are registered (in dependency order)
3. System module boots
4. All plugins are booted
