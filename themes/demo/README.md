# Demo Theme

The Demo theme is a production-quality reference implementation for October CMS. It demonstrates how to build a complete website using file-based theming, Tailor content management, the AJAX framework, and API endpoints -- all without writing a single plugin or traditional controller. The theme ships with a blog, wiki, contact form, and JSON API, showing how October CMS lets developers build full-featured sites using only Twig templates, YAML blueprints, and a few lines of inline PHP.

October CMS themes are deliberately build-tool-free. There is no webpack, no Vite, no compilation step required to start developing. Templates are plain HTML with Twig syntax, styles are plain CSS, and scripts are vanilla JavaScript loaded with standard `<script>` tags. This is an intentional architectural decision -- themes should be immediately editable by any developer without installing Node.js or learning a bundler. When a project does need asset compilation, October CMS provides a built-in server-side combiner with LESS and SCSS support.

## Theme Structure

```
themes/demo/
├── theme.yaml              ← Theme configuration
├── blueprints/             ← Tailor content definitions
│   ├── blog/               ← Blog posts, authors, categories, config
│   ├── pages/              ← About page, wiki articles
│   ├── fields/             ← Reusable field mixins
│   ├── blocks/             ← Content block types
│   └── site/               ← Navigation menus
├── layouts/                ← Page structure templates (6)
├── pages/                  ← Routable pages (22)
│   ├── api/                ← JSON API endpoints
│   ├── blog/               ← Blog section
│   └── wiki/               ← Wiki section
├── partials/               ← Reusable template fragments (37)
│   ├── blocks/             ← Content block renderers
│   ├── blog/               ← Blog-specific partials
│   ├── controls/           ← Interactive UI controls
│   ├── elements/           ← Shared UI elements
│   ├── site/               ← Header, footer, navigation, modals
│   └── wiki/               ← Wiki sidebar and TOC
├── content/                ← Static content files
├── assets/                 ← CSS, JS, images, vendor libraries
└── meta/                   ← Seed data for demo content
```

## Layouts

The theme uses six layouts to serve different page contexts. Each layout is a standalone HTML document that renders the page content with `{% page %}`:

| Layout | Description |
|--------|-------------|
| `default` | Standard content pages with full header, footer, OG meta tags, and mobile navigation |
| `home` | Homepage with simplified inline navbar and hero section |
| `blog` | Two-column layout (8/4 grid) with sticky sidebar for archives, categories, and search |
| `wiki` | Two-column layout (4/8 grid) with sidebar table of contents on the left |
| `api` | Headless JSON layout with CORS headers, content-type, and OPTIONS preflight handling |
| `external` | Minimal layout with simplified header and footer |

The `api` layout demonstrates how October CMS pages can serve as API endpoints. It sets `is_priority = 1` to run before the page, uses the `[resources]` component to declare response headers, and handles CORS preflight -- no route files or middleware classes needed.

## Pages

### Core Pages

| Page | URL | Description |
|------|-----|-------------|
| `index` | `/` | Homepage with latest blog posts and feature overview |
| `about` | `/about` | Dynamic about page rendering content blocks from Tailor |
| `contact` | `/contact` | Contact form with AJAX submission and email notification |
| `ajax` | `/ajax` | AJAX framework demo with a calculator example |
| `components` | `/components` | CMS component demo using the `demoTodo` plugin component |
| `sitemap` | `/sitemap` | XML sitemap |
| `404` | `/404` | Error page |

### Blog Pages

| Page | URL | Description |
|------|-----|-------------|
| `blog/index` | `/blog` | Paginated post listing with archive sidebar |
| `blog/post` | `/blog/post/:slug/:id` | Single post with author panel, gallery, comments |
| `blog/category` | `/blog/category/:slug` | Posts filtered by category |
| `blog/author` | `/blog/author/:slug` | Author profile with their posts |
| `blog/archive` | `/blog/archive/:year/:month` | Monthly archive |
| `blog/search` | `/blog/search` | Full-text search results |
| `blog/rss` | `/blog/rss` | RSS feed |

### API Pages

The theme includes a complete JSON API built entirely with CMS pages and the `api` layout:

| Page | URL | Description |
|------|-----|-------------|
| `api/posts` | `/api/blog/posts` | Paginated posts with search, category filter, and sorting |
| `api/post` | `/api/blog/post/:id` | Single post detail |
| `api/authors` | `/api/blog/authors` | Author listing |
| `api/categories` | `/api/blog/categories` | Category listing |

API pages accept query parameters (`?search=`, `?category=`, `?sort=`, `?per_page=`), build Eloquent queries in Twig using Tailor's collection component, and return JSON with `{% do response({...}) %}`. This shows how October CMS can serve as a headless backend without any custom PHP classes.

### Wiki Pages

| Page | URL | Description |
|------|-----|-------------|
| `wiki/index` | `/wiki` | Article listing with banner and external links |
| `wiki/article` | `/wiki/:slug` | Single article with breadcrumb and TOC |
| `wiki/search` | `/wiki/search` | Wiki search |

## Tailor Blueprints

The theme defines its entire content model using Tailor YAML blueprints in the `blueprints/` directory. No migrations, models, or controllers are written -- Tailor generates everything automatically.

### Content Types

| Blueprint | Handle | Type | Description |
|-----------|--------|------|-------------|
| Blog Post | `Blog\Post` | stream | Blog entries with two entry types: rich editor and markdown |
| Blog Author | `Blog\Author` | entry | Author profiles with avatar, social links |
| Blog Category | `Blog\Category` | entry | Post categories |
| Blog Config | `Blog\Config` | global | Blog-wide settings (name, about text, social links) |
| About Page | `Page\About` | single | About page with dynamic content blocks |
| Wiki Article | `Page\Article` | structure | Hierarchical documentation articles |
| Site Menus | `Site\Menus` | entry | Navigation menu definitions |

### Field Mixins

| Mixin | Handle | Description |
|-------|--------|-------------|
| Blog Content | `Fields\BlogContent` | Shared fields for blog posts (banner, author, categories, featured text, gallery) |
| Content Blocks | `Fields\Blocks` | Page builder with 5 block types (image slice, paragraph, detailed, scoreboard, team) |
| Social Links | `Fields\SocialLinks` | Social media profile URLs |

### Content Blocks

The about page uses a block builder pattern. Each block type is a mixin blueprint (`Blocks\ImageSlice`, `Blocks\ParagraphBlock`, etc.) and renders through a matching partial:

```twig
{% for block in aboutpage.blocks %}
    {% partial 'blocks/' ~ str_slug(block.type) block=block %}
{% endfor %}
```

## Key Patterns

### AJAX Framework

The contact page demonstrates October CMS's AJAX framework with form validation and email sending:

```twig
{% ajaxPartial 'about/contact-form' %}
```

The handler validates input with Laravel's validation rules and sends mail to a backend user group -- all in inline PHP within the page file.

### Tailor Queries in Twig

Pages query content directly in Twig using Tailor's collection and section components:

```twig
{# Paginated posts with search and category filter #}
{% set result = posts.searchWhere(term, ['title', 'content']) %}
{% set result = result.whereRelation('categories', 'slug', categorySlug) %}
{% set result = result.orderBy(sortField, sortDirection).paginate(perPage) %}
```

This gives templates the full power of Eloquent query building without writing PHP model classes.

### Entry Type Variants

Blog posts support two entry types (rich editor and markdown) with conditional rendering:

```twig
{% if post.entry_type == 'markdown_post' %}
    {{ post.content|md|content }}
{% else %}
    {{ post.content|content }}
{% endif %}
```

### API Responses

API pages use the `response()` function to return JSON with standard pagination metadata:

```twig
{% do response({
    data: data,
    links: pager.links,
    meta: pager.meta
}) %}
```

### Placeholder System

Layouts define content regions that pages can fill:

```twig
{# In layout #}
{% placeholder headerAfter %}

{# In page #}
{% put headerAfter %}
    <div class="custom-header-content">...</div>
{% endput %}
```

## Partials

### Site Structure

| Partial | Description |
|---------|-------------|
| `site/header` | Navbar with logo, navigation links, and hamburger toggle |
| `site/footer` | Footer with navigation, social icons, and copyright |
| `site/nav-links` | Main navigation menu |
| `site/nav-footer` | Footer navigation |
| `site/nav-mobile` | Mobile slide-out navigation |
| `site/flash-messages` | Flash message alerts |
| `site/how-its-made` | Development info panel |
| `site/head/*` | Head section partials (meta, links, scripts, analytics) |
| `site/modals/*` | Alert, password, and AJAX modals |

### Content Partials

| Partial | Description |
|---------|-------------|
| `blog/post-card` | Blog post card with banner, categories, and metadata |
| `blog/sidebar` | Blog sidebar with search, about, categories, and archives |
| `blog/comment-form` | Comment submission form |
| `blog/comment-list` | Comment display |
| `blocks/*` | Content block renderers (image-slice, paragraph-block, etc.) |
| `controls/gallery-slider` | Image gallery with lightbox |
| `elements/share-button` | Social share buttons |
| `elements/social-links` | Social media icon links |
| `elements/user-panel*` | Author and team member panels |
| `wiki/sidebar` | Wiki navigation with table of contents |
| `wiki/breadcrumb` | Breadcrumb navigation |

## Assets

The theme uses Bootstrap 5 for its grid system, components, and utility classes. Bootstrap is chosen deliberately as the default frontend foundation for October CMS themes -- it provides a well-documented, widely-understood CSS framework that works with plain HTML and requires no build pipeline. Developers can inspect elements, tweak classes, and see changes immediately without a compilation step. This makes October CMS themes accessible to the widest range of developers and keeps the frontend stack independent of any JavaScript framework.

| Library | Purpose |
|---------|---------|
| Bootstrap 5 | Grid, components, utilities |
| Bootstrap Icons | Icon font |
| Slick Carousel | Image and card sliders |
| PhotoSwipe | Lightbox gallery with captions |
| CodeBlocks | Code syntax highlighting |

CSS is organized by function (`elements/`, `controls/`, `blocks/`, `layouts/`, `pages/`) with a main `theme.css` entry point and a `vendor.css` for third-party styles. All stylesheets are plain CSS -- no preprocessor is required to work with the theme, though October CMS's built-in combiner supports LESS and SCSS when needed.

## Combining CSS and JavaScript

This theme doesn't combine assets by default. To combine the stylesheets, replace the individual link tags with October CMS's asset combiner. When combining with this theme, we recommend enabling `enable_asset_deep_hashing` in `config/cms.php`.

Uncombined stylesheets:

```twig
<link href="{{ 'assets/css/vendor.css'|theme }}" rel="stylesheet">
<link href="{{ 'assets/css/theme.css'|theme }}" rel="stylesheet">
```

Combined stylesheets:

```twig
<link href="{{ [
    '@framework.extras',
    'assets/css/vendor.css',
    'assets/css/theme.css'
]|theme }}" rel="stylesheet">
```

> **Note**: October CMS also includes a LESS (`.less`) or SCSS (`.scss`) compiler, if you prefer to use these extensions.

Uncombined JavaScript:

```twig
{% framework extras %}
<script src="{{ 'assets/js/controls/alert-dialog.js'|theme }}"></script>
<script src="{{ 'assets/js/controls/password-dialog.js'|theme }}"></script>
<script src="{{ 'assets/js/controls/gallery-slider.js'|theme }}"></script>
<script src="{{ 'assets/js/controls/card-slider.js'|theme }}"></script>
<script src="{{ 'assets/js/controls/quantity-input.js'|theme }}"></script>
<script src="{{ 'assets/js/app.js'|theme }}"></script>
```

Combined JavaScript:

```twig
<script src="{{ [
    '@framework.extras',
    'assets/js/controls/alert-dialog.js',
    'assets/js/controls/password-dialog.js',
    'assets/js/controls/gallery-slider.js',
    'assets/js/controls/card-slider.js',
    'assets/js/controls/quantity-input.js',
    'assets/js/app.js'
]|theme }}"></script>
```

> **Important**: Make sure you keep the `{% styles %}` and `{% scripts %}` placeholder tags as these are used by plugins for injecting assets.
