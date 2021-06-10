<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Specifies the default CMS theme.
    |--------------------------------------------------------------------------
    |
    | This parameter value can be overridden by the CMS back-end settings.
    |
    */

    'active_theme' => env('ACTIVE_THEME', 'demo'),

    /*
    |--------------------------------------------------------------------------
    | Determines if the routing caching is enabled.
    |--------------------------------------------------------------------------
    |
    | If the caching is enabled, the page URL map is saved in the cache. If a page
    | URL was changed on the disk, the old URL value could be still saved in the cache.
    | To update the cache the back-end Clear Cache feature should be used. It is recommended
    | to disable the caching during the development, and enable it in the production mode.
    |
    */

    'enable_route_cache' => env('CMS_ROUTE_CACHE', false),

    /*
    |--------------------------------------------------------------------------
    | Time to live for the URL map.
    |--------------------------------------------------------------------------
    |
    | The URL map used in the CMS page routing process. By default
    | the map is updated every time when a page is saved in the backend or when the
    | interval, in minutes, specified with the urlMapCacheTTL parameter expires.
    |
    */

    'url_cache_ttl' => 10,

    /*
    |--------------------------------------------------------------------------
    | Time to live for parsed CMS objects.
    |--------------------------------------------------------------------------
    |
    | Specifies the number of minutes the CMS object cache lives. After the interval
    | is expired item are re-cached. Note that items are re-cached automatically when
    | the corresponding template file is modified.
    |
    */

    'template_cache_ttl' => 1440,

    /*
    |--------------------------------------------------------------------------
    | Determines if the asset caching is enabled.
    |--------------------------------------------------------------------------
    |
    | If the caching is enabled, combined assets are cached. If a asset file
    | is changed on the disk, the old file contents could be still saved in the cache.
    | To update the cache the clear cache command should be used. It is recommended
    | to disable the caching during the development, and enable it in the production mode.
    |
    */

    'enable_asset_cache' => env('CMS_ASSET_CACHE', false),

    /*
    |--------------------------------------------------------------------------
    | Determines if the asset minification is enabled.
    |--------------------------------------------------------------------------
    |
    | If the minification is enabled, combined assets are compressed (minified).
    | It is recommended to disable the minification during development, and
    | enable it in production mode. If set to null, assets are minified
    | when debug mode (app.debug) is disabled.
    |
    */

    'enable_asset_minify' => null,

    /*
    |--------------------------------------------------------------------------
    | Check import timestamps when combining assets
    |--------------------------------------------------------------------------
    |
    | If deep hashing is enabled, the combiner cache will be reset when a change
    | is detected on imported files, in addition to those referenced directly.
    | This will cause slower page performance. If set to null, deep hashing
    | is used when debug mode (app.debug) is enabled.
    |
    */

    'enable_asset_deep_hashing' => null,

    /*
    |--------------------------------------------------------------------------
    | Force Database-driven Themes
    |--------------------------------------------------------------------------
    |
    | Globally sets all themes to store templates changes in the database.
    |
    | false - All theme templates are sourced from the filesystem.
    | true  - Source theme templates from the database with fallback to the filesytem.
    | null  - Setting equal to the inverse of app.debug: debug enabled, this disabled.
    |
    */

    'database_templates' => env('CMS_DB_TEMPLATES', false),

    /*
    |--------------------------------------------------------------------------
    | Safe mode
    |--------------------------------------------------------------------------
    |
    | If safe mode is enabled, the PHP code section is disabled in the CMS
    | for security reasons. If set to null, safe mode is enabled when
    | debug mode (app.debug) is disabled.
    |
    */

    'safe_mode' => env('CMS_SAFE_MODE', null),

    /*
    |--------------------------------------------------------------------------
    | Force bytecode invalidation
    |--------------------------------------------------------------------------
    |
    | When using OPcache with opcache.validate_timestamps set to 0 or APC
    | with apc.stat set to 0 and Twig cache enabled, clearing the template
    | cache won't update the cache, set to true to get around this.
    |
    */

    'force_bytecode_invalidation' => true,

    /*
    |--------------------------------------------------------------------------
    | Twig Cache
    |--------------------------------------------------------------------------
    |
    | Store a temporary cache of parsed Twig templates in the local filesystem.
    |
    */

    'enable_twig_cache' => env('CMS_TWIG_CACHE', true),

    /*
    |--------------------------------------------------------------------------
    | Twig Strict Variables
    |--------------------------------------------------------------------------
    |
    | If strict_variables is disabled, Twig will silently ignore invalid
    | variables (variables and or attributes/methods that do not exist) and
    | replace them with a null value. When enabled, Twig throws an exception
    | instead. If set to null, it is enabled when debug mode (app.debug) is
    | enabled.
    |
    */

    'enable_twig_strict_variables' => false,

    /*
    |--------------------------------------------------------------------------
    | Cache Key for the CMS' PHP code parser cache
    |--------------------------------------------------------------------------
    |
    | This option controls the cache key used by the CMS when storing generated
    | PHP from the theme PHP sections. Recommended to change this when multiple
    | servers running October CMS are connected to the same cache server to
    | prevent conflicts.
    |
    */

    'code_parser_cache_key' => 'cms-php-file-data',

];
