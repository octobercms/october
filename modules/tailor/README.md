# Tailor Module

Tailor is October CMS's headless content engine. It allows developers to define content structures using YAML blueprints, and October automatically generates the database tables, backend forms, lists, navigation, and permissions -- no PHP code, no migrations, no controllers. Where traditional CMS platforms require writing models, controllers, and admin views for every content type, Tailor lets you define a complete content management interface in a single YAML file. Content is queryable via Eloquent models, renderable with CMS components, and fully extensible through the plugin system.

## Architecture Overview

The Tailor workflow:

1. **Define** content structures in YAML blueprint files
2. **Migrate** - Tailor creates database tables and columns from the blueprint definitions
3. **Manage** - backend controllers are auto-generated for content entry
4. **Display** - CMS components render content on the frontend

## Blueprint Types

Blueprints are YAML files stored in `app/blueprints/` (or plugin blueprint directories). Each blueprint defines a content structure.

| Type | Description |
|------|-------------|
| `entry` | Collection of items (e.g. blog posts, products, team members) |
| `stream` | Chronological entries (e.g. news feed, timeline, changelog) |
| `structure` | Hierarchical tree (e.g. categories, navigation menus, documentation) |
| `single` | Single editable record (e.g. about page, homepage content) |
| `global` | Site-wide settings (e.g. company info, social links, contact details) |
| `submission` | User-submitted content (e.g. contact forms, comments, applications) |
| `mixin` | Reusable field groups included by other blueprints (no database table) |

### Blueprint Example

This single YAML file produces a fully functional blog post manager in the backend -- complete with a database table, form fields, list columns, navigation menu entry, and CRUD permissions:

```yaml
uuid: edcd102e-0525-4e4d-b07e-633ae6d3b7de
handle: Blog\Post
type: entry
name: Blog Post

fields:
    title:
        label: Title
        type: text

    content:
        label: Content
        type: richeditor

    featured_image:
        label: Featured Image
        type: fileupload
        mode: image
        maxItems: 1

    category:
        label: Category
        type: entries
        source: Blog\Category
        maxItems: 1

navigation:
    parent: Blog
    icon: icon-file-text-o
    order: 100
```

### Mixins

Mixins define reusable field groups that can be included in other blueprints:

```yaml
# Mixin definition
uuid: ...
handle: Fields\Seo
type: mixin
name: SEO Fields

fields:
    meta_title:
        label: Meta Title
        type: text
    meta_description:
        label: Meta Description
        type: textarea
```

```yaml
# Usage in another blueprint
fields:
    seo:
        type: mixin
        source: Fields\Seo
```

## Content Field Types

Content fields extend `Tailor\Classes\ContentFieldBase` and map blueprint field definitions to form widgets and database columns.

| Field | Description |
|-------|-------------|
| `EntriesField` | Relationship to other blueprint entries |
| `RepeaterField` | Repeating groups of fields |
| `RichEditorField` | WYSIWYG HTML editor |
| `MarkdownField` | Markdown editor |
| `FileUploadField` | File and image attachments |
| `MediaFinderField` | Media library file selector |
| `PageFinderField` | CMS page link selector |
| `DataTableField` | Spreadsheet-style data |
| `NestedFormField` | Embedded sub-form (stored as JSON) |
| `NestedItemsField` | Nested repeating items |
| `DatePickerField` | Date and time picker |
| `NumberField` | Numeric input |
| `TagListField` | Tag input |
| `RecordFinderField` | Record lookup popup |
| `MixinField` | Includes fields from a mixin blueprint |
| `GenericField` | Passthrough for standard form widget types |
| `FallbackField` | Fallback for unrecognized field types |

### Registering Custom Content Fields

In your plugin's `Plugin.php`:

```php
public function registerContentFields()
{
    return [
        \Acme\Blog\ContentFields\MyField::class => 'myfield',
    ];
}
```

Custom content fields extend `Tailor\Classes\ContentFieldBase` and implement methods for defining the database column, configuring the form widget, and configuring the list column.

## CMS Components

Tailor provides four CMS components for rendering content on the frontend:

| Component | Alias | Description |
|-----------|-------|-------------|
| `SectionComponent` | `section` | Display a single entry (page, post detail) |
| `CollectionComponent` | `collection` | List entries with pagination and nesting |
| `GlobalComponent` | `global` | Access global record fields |
| `SubmissionComponent` | `submission` | Accept user-submitted content via forms |

### Usage Example

```ini
[section post]
handle = "Blog\Post"
slug = "{{ :slug }}"
==
<h1>{{ post.title }}</h1>
{{ post.content_html|raw }}
```

```ini
[collection posts]
handle = "Blog\Post"
postsPerPage = 10
==
{% for post in posts %}
    <h2>{{ post.title }}</h2>
{% endfor %}
{{ posts.render|raw }}
```

## Models

| Model | Description |
|-------|-------------|
| `EntryRecord` | Base for entry-type content (supports drafts, versions, soft delete, multisite) |
| `StreamRecord` | Chronological entries (extends EntryRecord) |
| `StructureRecord` | Hierarchical entries (extends EntryRecord) |
| `SingleRecord` | Single record (extends EntryRecord) |
| `SubmissionRecord` | User submissions (extends EntryRecord) |
| `GlobalRecord` | Site-wide settings (no drafts, multisite support) |
| `RepeaterItem` | Items within repeater fields |
| `RecordImport` | Bulk import handler |
| `RecordExport` | Bulk export handler |

### Querying Entries

```php
use Tailor\Classes\BlueprintIndexer;

// Get the model class for a blueprint
$model = BlueprintIndexer::instance()->findSectionModel('Blog\Post');

// Query entries
$posts = $model->where('is_enabled', true)->orderBy('published_at', 'desc')->get();
$post = $model->where('slug', $slug)->first();
```

## Key Features

All of these features are available automatically for every blueprint -- no additional configuration or code required:

- **Drafts and Versions** - full draft/publish workflow with change history
- **Multisite** - content per-site with sync options
- **Soft Delete** - trash and restore functionality
- **Search and Filter** - built-in list filtering and search
- **Bulk Actions** - publish, delete, and export multiple items
- **Import/Export** - batch operations via CSV/JSON

## Key Classes

| Class | Description |
|-------|-------------|
| `Blueprint` | Base blueprint class; loads and validates YAML definitions |
| `BlueprintIndexer` | Central registry for all blueprints; generates navigation and permissions |
| `BlueprintModel` | Base for models driven by blueprints; handles dynamic field extension |
| `FieldManager` | Registry for content field types |
| `ContentFieldBase` | Base class for custom content fields |
| `SchemaBuilder` | Builds and migrates database tables from blueprint definitions |
| `EditorExtension` | Editor IDE integration for blueprint editing |

## Auto-Generated Navigation and Permissions

Blueprints can define their backend navigation placement:

```yaml
navigation:
    parent: Content          # Primary nav item
    icon: icon-file-text-o
    order: 100

# Or as a settings page
navigation:
    category: Content
    icon: icon-cog
```

Permissions are auto-generated per blueprint:

- `{handle}.read` - View entries
- `{handle}.create` - Create entries
- `{handle}.update` - Edit entries
- `{handle}.delete` - Delete entries
- `{handle}.publish` - Publish/unpublish entries

## Database

Tailor creates one table per blueprint (except mixins). Table names follow the pattern `tailor_{type}_{handle}`, with join tables for relationships and repeater tables for repeater fields.

The `SchemaBuilder` class handles all table creation and migration. Running `BlueprintIndexer::instance()->migrate()` (or `php artisan october:migrate`) applies any pending schema changes.

## Extension Points

### Events

| Event | Description |
|-------|-------------|
| `model.extendBlueprint` | Fired when a model is extended with blueprint fields |

### Custom Content Fields

Extend `Tailor\Classes\ContentFieldBase` and register via `registerContentFields()` in your plugin. A content field controls:

- Database column creation (`extendDatabaseTable`)
- Form widget configuration (`extendFormField`)
- List column configuration (`extendTableColumn`)
- Validation rules (`extendValidationRules`)

### Extending Models

```php
Event::listen('model.extendBlueprint', function ($model, $blueprint) {
    if ($blueprint->handle === 'Blog\Post') {
        $model->addDynamicMethod('scopeFeatured', function ($query) {
            return $query->where('is_featured', true);
        });
    }
});
```

## Editor Integration

Tailor registers an Editor extension for editing blueprint YAML files directly in the October Editor IDE, with schema validation and intellisense for field types.
