Demo Theme
==========

October CMS demo theme that demonstrates the basic core functionality and utilizes the accompanying demo plugin. It is a great theme to copy when building a site from scratch.

The theme acts as a reference implementation for default component markup when distributing plugins.

Have fun!

## Combining CSS and JavaScript

This theme doesn't combine assets for performance reasons. To combine the stylesheets, replace the following lines in the default layout. When combining with this theme, we recommend enabling the config `enableAssetDeepHashing` in the file **config/cms.php**.

Uncombined stylesheets:

```twig
<link href="{{ 'assets/css/vendor.css'|theme }}" rel="stylesheet">
<link href="{{ 'assets/css/theme.css'|theme }}" rel="stylesheet">
```

Combined stylesheets:

```twig
<link href="{{ [
    '@framework.extras',
    'assets/less/vendor.less',
    'assets/less/theme.less'
]|theme }}" rel="stylesheet">
```

> **Note**: October also includes an SCSS compiler, if you prefer.

Uncombined JavaScript:

```twig
<script src="{{ 'assets/vendor/jquery.js'|theme }}"></script>
<script src="{{ 'assets/vendor/bootstrap.js'|theme }}"></script>
<script src="{{ 'assets/javascript/app.js'|theme }}"></script>
{% framework extras turbo %}
```

Combined JavaScript:

```twig
<script src="{{ [
    '@jquery',
    '@framework',
    '@framework.extras',
    'assets/vendor/bootstrap.js',
    'assets/javascript/app.js'
]|theme }}"></script>
```

> **Important**: Make sure you keep the `{% styles %}` and `{% scripts %}` placeholder tags as these are used by plugins for injecting assets.
