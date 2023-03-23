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
    | Database Themes
    |--------------------------------------------------------------------------
    |
    | Globally forces all themes to store template changes in the database,
    | instead of the file system. If this feature is enabled, changes will
    | not be stored in the file system.
    |
    | false - All theme templates are sourced from the filesystem.
    | true  - Source theme templates from the database with fallback to the filesystem.
    |
    */

    'database_templates' => env('CMS_DB_TEMPLATES', false),

    /*
    |--------------------------------------------------------------------------
    | Template Strictness
    |--------------------------------------------------------------------------
    |
    | When enabled, an error is thrown when a component, variable, or attribute
    | used does not exist. When disabled, a null value is returned instead.
    |
    */

    'strict_variables' => env('CMS_STRICT_VARIABLES', false),

    'strict_components' => env('CMS_STRICT_COMPONENTS', false),

    /*
    |--------------------------------------------------------------------------
    | Frontend Timezone
    |--------------------------------------------------------------------------
    |
    | This acts as the default setting for a frontend user's timezone used when
    | converting dates from the system setting, typically set to UTC.
    |
    */

    'timezone' => 'UTC',

    /*
    |--------------------------------------------------------------------------
    | Template Caching
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
    | Twig Cache
    |--------------------------------------------------------------------------
    |
    | Store a temporary cache of parsed Twig templates in the local filesystem.
    |
    */

    'enable_twig_cache' => env('CMS_TWIG_CACHE', true),

    /*
    |--------------------------------------------------------------------------
    | Determines if the routing caching is enabled.
    |--------------------------------------------------------------------------
    |
    | If the caching is enabled, the page URL map is saved in the cache. If a page
    | URL was changed on the disk, the old URL value could be still saved in the cache.
    | To update the cache the clear:cache command should be used. It is recommended
    | to disable the caching during the development, and enable it in the production mode.
    |
    */

    'enable_route_cache' => env('CMS_ROUTE_CACHE', true),

    /*
    |--------------------------------------------------------------------------
    | Time to live for the URL map.
    |--------------------------------------------------------------------------
    |
    | The URL map used in the CMS page routing process. By default
    | the map is updated every time when a page is saved in the backend or when the
    | interval, in minutes, specified with the url_cache_ttl parameter expires.
    |
    */

    'url_cache_ttl' => 60,

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

    'enable_asset_cache' => env('CMS_ASSET_CACHE', true),

    /*
    |--------------------------------------------------------------------------
    | Determines if the asset minification is enabled.
    |--------------------------------------------------------------------------
    |
    | If the minification is enabled, combined assets are compressed (minified).
    | It is recommended to disable the minification during development, and
    | enable it in production mode.
    |
    */

    'enable_asset_minify' => env('CMS_ASSET_MINIFY', false),

    /*
    |--------------------------------------------------------------------------
    | Check Import Timestamps When Combining Assets
    |--------------------------------------------------------------------------
    |
    | If deep hashing is enabled, the combiner cache will be reset when a change
    | is detected on imported files, in addition to those referenced directly.
    | This will cause slower page performance. If set to null, deep hashing
    | is used when debug mode (app.debug) is enabled.
    |
    */

    'enable_asset_deep_hashing' => env('CMS_ASSET_DEEP_HASHING', null),

    /*
    |--------------------------------------------------------------------------
    | Site Redirect Policy
    |--------------------------------------------------------------------------
    |
    | Controls the behavior when the root URL is opened without a matched site.
    |
    | detect    - detect the site based on the browser language
    | primary   - use the primary site
    | <site_id> - use a specific site identifier (id)
    |
    */

    'redirect_policy' => env('CMS_REDIRECT_POLICY', 'detect'),

    /*
    |--------------------------------------------------------------------------
    | Force Bytecode Invalidation
    |--------------------------------------------------------------------------
    |
    | When using Opcache with opcache.validate_timestamps set to 0 or APC
    | with apc.stat set to 0 and Twig cache enabled, clearing the template
    | cache won't update the cache, set to true to get around this.
    |
    */

    'force_bytecode_invalidation' => true,

    /*
    |--------------------------------------------------------------------------
    | Safe Mode
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
    | V1 Security Policy
    |--------------------------------------------------------------------------
    |
    | When using safe mode configuration, the Twig sandbox becomes very strict and
    | uses an allow-list to protect calling unapproved methods. Instead, you may
    | use V1, which is a more relaxed policy that uses a block-list, it blocks
    | most of the unsecure methods but is not as secure as an allow-list.
    |
    */

    'security_policy_v1' => env('CMS_SECURITY_POLICY_V1', false),

    /*
    |--------------------------------------------------------------------------
    | V1 Exception Policy
    |--------------------------------------------------------------------------
    |
    | When debug mode is off, throwing exceptions in AJAX will display a generic
    | message, except for specific exception types such as ApplicationException
    | and ValidationException (allow-list). Instead, you may use V1, which is
    | a more relaxed policy that allows all messages and blocks common exception
    | types (block-list) but may still leak information in rare cases.
    |
    */

    'exception_policy_v1' => env('CMS_EXCEPTION_POLICY_V1', false),

];
