# CMS Module

The CMS module is October CMS's frontend template engine. It renders pages using file-based themes with Twig templating, provides a component system for reusable page logic, handles routing from URLs to pages, and integrates with the Editor module for visual template editing. Unlike frameworks that couple you to a specific frontend stack, October CMS themes are pure HTML and Twig -- no build step required, no JavaScript framework mandated. Developers keep full control of their markup while getting the productivity of a component system and a well-defined page lifecycle.

## Architecture Overview

The CMS processes incoming requests through this pipeline:

1. **Router** matches the URL to a page file using pattern-based routes
2. **Controller** executes the page lifecycle (init, AJAX handlers, start, component run, render, end)
3. **Twig** renders the markup with layouts, partials, and components
4. The result is returned as an HTTP response

All templates are file-based and stored in themes under the `themes/` directory.

## Key Services

| Service | Class | Description |
|---------|-------|-------------|
| `cms.helper` | `Cms\Helpers\Cms` | URL generation and CMS utilities |
| `cms.components` | `Cms\Classes\ComponentManager` | Component registry |
| `cms.snippets` | `Cms\Classes\SnippetManager` | Snippet management |
| `cms.themes` | `Cms\Classes\ThemeManager` | Theme operations |

## Theme Structure

```
themes/mytheme/
├── theme.yaml          # Theme configuration (name, description, author)
├── pages/              # Routable pages
├── layouts/            # Page structure templates
├── partials/           # Reusable template fragments
├── content/            # Static content files (HTML, Markdown, text)
├── assets/             # CSS, JS, images
└── lang/               # Translation strings
```

## Template Format

CMS templates use a multi-section file format that keeps configuration, logic, and markup together in a single file -- no separate route definitions, no controller classes, no Blade directives to learn:

```
title = "Blog Post"
url = "/blog/:slug"
layout = "default"

[blogPost]
slug = "{{ :slug }}"
==
<?php
function onStart()
{
    $this['activeMenu'] = 'blog';
}
?>
==
<h1>{{ blogPost.title }}</h1>
{{ blogPost.content_html|raw }}
```

The three sections separated by `==` are:

1. **INI settings** - metadata, component declarations, properties
2. **PHP code** - server-side logic executed during the page lifecycle
3. **Twig markup** - the rendered template

## Template Types

### Pages

Pages are routable templates with URL patterns. URLs support parameters:

- `/blog/:slug` - required parameter
- `/blog/:slug?` - optional parameter
- `/blog/:post_id|^[0-9]+$` - parameter with regex validation

Access parameters in code with `$this->param('slug')` or in Twig with `{{ :slug }}`.

### Layouts

Layouts wrap pages and define the common structure (HTML head, navigation, footer). A layout uses `{% page %}` to render the page content:

```twig
<html>
<body>
    {% partial 'header' %}
    {% page %}
    {% partial 'footer' %}
</body>
</html>
```

### Partials

Partials are reusable template fragments rendered with `{% partial 'name' %}`. They can accept variables:

```twig
{% partial 'card' title="Hello" body=post.content %}
```

### Content Files

Static content files in HTML, Markdown (`.md`), or plain text (`.txt`) format, rendered with:

```twig
{% content 'welcome.md' %}
```

## Page Lifecycle

1. `onInit()` - layout and page components initialize
2. AJAX handler execution (if AJAX request)
3. `onStart()` - layout code section
4. `onStart()` - page code section
5. Component `onRun()` - each component executes
6. `onEnd()` - page code section
7. `onEnd()` - layout code section
8. Twig markup renders

## Component System

Components are reusable PHP classes that attach to pages, layouts, or partials. They encapsulate server-side logic, inject template variables, provide AJAX handlers, and render default markup. This is how October CMS avoids the complexity of separate API endpoints and frontend state management -- components bring data directly to the template where it's needed.

### Creating a Component

```php
<?php namespace Acme\Blog\Components;

use Cms\Classes\ComponentBase;

class BlogPosts extends ComponentBase
{
    public function componentDetails()
    {
        return [
            'name' => 'Blog Posts',
            'description' => 'Displays a list of blog posts',
        ];
    }

    public function defineProperties()
    {
        return [
            'postsPerPage' => [
                'title' => 'Posts per page',
                'type' => 'string',
                'default' => '10',
                'validationPattern' => '^[0-9]+$',
            ],
        ];
    }

    public function onRun()
    {
        $this->page['posts'] = $this->loadPosts();
    }

    public function onLoadMore()
    {
        // AJAX handler
        return ['#posts' => $this->renderPartial('@more-posts')];
    }

    protected function loadPosts()
    {
        return Post::paginate($this->property('postsPerPage'));
    }
}
```

### Registering Components

In your plugin's `Plugin.php`:

```php
public function registerComponents()
{
    return [
        \Acme\Blog\Components\BlogPosts::class => 'blogPosts',
    ];
}
```

### Using Components

In a page or layout INI section:

```ini
[blogPosts]
postsPerPage = 5
```

In Twig markup:

```twig
{% component 'blogPosts' %}
```

### Built-in Components

| Component | Description |
|-----------|-------------|
| `ViewBag` | Arbitrary page variables (used by Tailor and other modules) |
| `Resources` | Register additional CSS/JS assets on a page |
| `SitePicker` | Multisite language/site selector |

## Twig Extensions

### Functions

`partial()`, `content()`, `component()`, `page()`, `placeholder()`, `ajaxHandler()`, `flash()`, `response()`, `redirect()`, `abort()`

### Filters

`page` (generate page URL), `theme` (theme asset URL), `content` (render content file)

### Tags

```twig
{% page %}              {# Render page inside layout #}
{% partial 'name' %}    {# Render a partial #}
{% component 'name' %}  {# Render component default markup #}
{% content 'file' %}    {# Render content file #}
{% placeholder name %}  {# Define a placeholder #}
{% put name %}          {# Push content to a placeholder #}
{% scripts %}           {# Render registered scripts #}
{% styles %}            {# Render registered styles #}
{% meta %}              {# Render registered meta tags #}
{% framework %}         {# Include the AJAX framework #}
{% flash %}             {# Render flash messages #}
{% cache %}             {# Cache a template block #}
```

## Routing

The `Cms\Classes\Router` matches incoming URLs against page URL patterns. Pages are matched in specificity order - static segments take priority over parameters.

### Route Parameters

Parameters are defined in page URLs with a colon prefix:

```
url = "/blog/:category/:slug"
```

Access in PHP:

```php
$slug = $this->param('slug');
```

Access in Twig:

```twig
{{ :slug }}
```

## Key Classes

| Class | Description |
|-------|-------------|
| `Controller` | Primary frontend controller; handles the full page lifecycle |
| `CmsController` | Laravel route entry point; detects site and delegates to Controller |
| `CmsCompoundObject` | Base for multi-section template files (Page, Layout, Partial) |
| `CmsObject` | File-based model base using Halcyon datasource |
| `Page` | Represents a CMS page file |
| `Layout` | Represents a CMS layout file |
| `Partial` | Represents a CMS partial file |
| `Content` | Represents a CMS content file |
| `Asset` | Represents a CMS asset file |
| `ComponentBase` | Base class for all CMS components |
| `ComponentManager` | Registry for all available components |
| `Router` | URL-to-page matching |
| `Theme` | Represents a theme directory |
| `ThemeManager` | Theme installation, activation, deletion |
| `PageManager` | URL resolution and content processing |
| `CodeParser` | Parses PHP code sections in templates |
| `SnippetManager` | Manages partial snippets for the rich editor |

## Extension Points

### Events

| Event | Description |
|-------|-------------|
| `cms.page.beforeDisplay` | Override the rendered page before display |
| `cms.page.display` | After page is rendered |
| `cms.router.beforeRoute` | Override routing logic |
| `cms.component.beforeRunAjaxHandler` | Before component AJAX handler |
| `cms.component.runAjaxHandler` | After component AJAX handler |
| `cms.extendTwig` | Register custom Twig extensions |
| `cms.theme.getActiveTheme` | Override the active theme |
| `cms.content.postProcessMarkup` | Post-process rendered content |
| `cms.pageLookup.listTypes` | Register page link types |
| `cms.pageLookup.getTypeInfo` | Provide page link type info |
| `cms.pageLookup.resolveItem` | Resolve a page link item to a URL |

### Extending the CMS Controller

```php
\Cms\Classes\Controller::extend(function ($controller) {
    // Add middleware, modify behavior
});
```

### Adding Twig Functions

In your plugin's `Plugin.php`:

```php
public function registerMarkupTags()
{
    return [
        'functions' => [
            'myFunction' => function ($arg) { return strtoupper($arg); },
        ],
        'filters' => [
            'myFilter' => function ($value) { return str_slug($value); },
        ],
    ];
}
```

## Editor Integration

The CMS module registers an Editor extension (`Cms\Classes\EditorExtension`) that provides an IDE experience for editing templates. It supports these document types:

- `cms-page` - Pages
- `cms-layout` - Layouts
- `cms-partial` - Partials
- `cms-content` - Content files
- `cms-asset` - Asset files
- `cms-lang` - Language files

## File-Based Storage

CMS templates use the Halcyon datasource (from the October Rain library) rather than database tables. Templates can be stored on the filesystem or in the database, with a caching layer for performance. Each theme is isolated in its own directory.
