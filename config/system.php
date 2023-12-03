<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Load Specified Modules
    |--------------------------------------------------------------------------
    |
    | Specify which modules should be registered when using the application.
    |
    | LOAD_MODULES="System,Backend,Editor,Cms,Media"
    |
    */

    'load_modules' => env('LOAD_MODULES'),

    /*
    |--------------------------------------------------------------------------
    | Disable Specified Plugins
    |--------------------------------------------------------------------------
    |
    | Specify plugin codes which will always be disabled in the application.
    |
    | DISABLE_PLUGINS="October.Demo,RainLab.Blog"
    |
    */

    'disable_plugins' => env('DISABLE_PLUGINS'),

    /*
    |--------------------------------------------------------------------------
    | Link Policy
    |--------------------------------------------------------------------------
    |
    | Controls how URL links are generated throughout the application.
    |
    | detect   - detect hostname and use the current schema
    | secure   - detect hostname and force HTTPS schema
    | insecure - detect hostname and force HTTP schema
    | force    - force hostname and schema using app.url config value
    |
    | By default most links use their fully qualified URLs or reference their
    | CDN location. In some cases you may prefer relative links where possible
    | if so, set the relative_links value to true.
    |
    */

    'link_policy' => env('LINK_POLICY', 'detect'),

    'relative_links' => env('RELATIVE_LINKS', false),

    /*
    |--------------------------------------------------------------------------
    | System Paths
    |--------------------------------------------------------------------------
    |
    | Specify location to core system paths. Local paths are relative if they
    | do not have a leading slash. URLs can be relative to the base application
    | URL or you can specify a full path URL.
    |
    | PLUGINS_PATH="plugins"
    | PLUGINS_ASSET_URL="/plugins"
    |
    | THEMES_PATH="/absolute/path/to/themes"
    | THEMES_ASSET_URL="http://localhost/themes"
    |
    */

    'plugins_path' => env('PLUGINS_PATH'),

    'plugins_asset_url' => env('PLUGINS_ASSET_URL'),

    'themes_path' => env('THEMES_PATH'),

    'themes_asset_url' => env('THEMES_ASSET_URL'),

    'storage_path' => env('STORAGE_PATH'),

    'cache_path' => env('CACHE_PATH'),

    /*
    |--------------------------------------------------------------------------
    | Default Permission Masks
    |--------------------------------------------------------------------------
    |
    | Specifies a default file and folder permission as a string (eg: "755") for
    | created files and directories in the system paths. It is recommended
    | to use file as "644" and folder as "755".
    |
    */

    'default_mask' => [
        'file' => env('DEFAULT_FILE_MASK'),
        'folder' => env('DEFAULT_FOLDER_MASK'),
    ],

    /*
    |--------------------------------------------------------------------------
    | Cross Site Request Forgery (CSRF) Protection
    |--------------------------------------------------------------------------
    |
    | If the CSRF protection is enabled, all "postback" & AJAX requests are
    | checked for a valid security token.
    |
    */

    'enable_csrf_protection' => env('ENABLE_CSRF', true),

    /*
    |--------------------------------------------------------------------------
    | Convert Line Endings
    |--------------------------------------------------------------------------
    |
    | Determines if October CMS should convert line endings from the Windows
    | style \r\n to the Unix style \n.
    |
    */

    'convert_line_endings' => env('CONVERT_LINE_ENDINGS', false),

    /*
    |--------------------------------------------------------------------------
    | Cookie Encryption
    |--------------------------------------------------------------------------
    |
    | October CMS encrypts/decrypts cookies by default. You can specify cookies
    | that should not be encrypted or decrypted here. This is useful, for
    | example, when you want to pass data from frontend to server side backend
    | via cookies, and vice versa.
    |
    */

    'unencrypt_cookies' => env('UNENCRYPT_COOKIES', [
        // 'my_cookie',
    ]),

    /*
    |--------------------------------------------------------------------------
    | Automatically Mirror to Public Directory
    |--------------------------------------------------------------------------
    |
    | Performed after a composer update.
    |
    | true   - automatically mirror asset to the public directory
    | false  - never mirror assets to public directory
    | null   - only mirror assets when debug mode is OFF (in production)
    |
    */

    'auto_mirror_public' => env('AUTO_MIRROR_PUBLIC', false),

    /*
    |--------------------------------------------------------------------------
    | Automatically Rollback Plugins
    |--------------------------------------------------------------------------
    |
    | Attempt to automatically reverse database migrations for a plugin when
    | they are uninstalled using composer. This is disabled by default
    | to prevent data loss.
    |
    */

    'auto_rollback_plugins' => env('AUTO_ROLLBACK_PLUGINS', false),

    /*
    |--------------------------------------------------------------------------
    | Base Directory Restriction
    |--------------------------------------------------------------------------
    |
    | Restricts loading backend template and config files to within the base
    | directory of the application. For example, when using the symlink option
    | in composer for local packages.
    |
    | Warning: This should never be disabled in production for security reasons.
    |
    */

    'restrict_base_dir' => env('RESTRICT_BASE_DIR', true),

];
