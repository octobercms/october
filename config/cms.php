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

    'activeTheme' => 'demo',

    /*
    |--------------------------------------------------------------------------
    | Bleeding edge updates
    |--------------------------------------------------------------------------
    |
    | If you are developing with October, it is important to have the latest
    | code base. Set this value to 'true' to tell the platform to download
    | and use the development copies of core files and plugins.
    |
    */

    'edgeUpdates' => false,

    /*
    |--------------------------------------------------------------------------
    | Back-end URI prefix
    |--------------------------------------------------------------------------
    |
    | Specifies the URL name used for accessing back-end pages.
    | For example: backend -> http://localhost/backend
    |
    */

    'backendUri' => 'backend',

    /*
    |--------------------------------------------------------------------------
    | Back-end force HTTPS security
    |--------------------------------------------------------------------------
    |
    | Use this setting to force a secure protocol when accessing any back-end
    | pages, including the authentication pages. This is usually handled by
    | web server config, but can be handled by the app for added security.
    |
    */

    'backendForceSecure' => false,

    /*
    |--------------------------------------------------------------------------
    | Back-end login remember
    |--------------------------------------------------------------------------
    |
    | Define live duration of backend sessions:
    |
    | true  - session never expire (cookie expiration in 5 years)
    |
    | false - session have a limited time (see session.lifetime)
    |
    | null  - The form login display a checkbox that allow user to choose
    |         wanted behavior
    |
    */

    'backendForceRemember' => true,

    /*
    |--------------------------------------------------------------------------
    | Back-end timezone
    |--------------------------------------------------------------------------
    |
    | This acts as the default setting for a back-end user's timezone. This can
    | be changed by the user at any time using the backend preferences. All
    | dates displayed in the back-end will be converted to this timezone.
    |
    */

    'backendTimezone' => 'UTC',

    /*
    |--------------------------------------------------------------------------
    | Back-end Skin
    |--------------------------------------------------------------------------
    |
    | Specifies the back-end skin to use.
    |
    */

    'backendSkin' => 'Backend\Skins\Standard',

    /*
    |--------------------------------------------------------------------------
    | Automatically run migrations on login
    |--------------------------------------------------------------------------
    |
    | If value is true, UpdateManager will be run on logging in to the backend.
    | It's recommended to set this value to 'null' in production enviroments
    | because it clears the cache every time a user logs in to the backend.
    | If set to null, this setting is enabled when debug mode (app.debug) is enabled
    | and disabled when debug mode is disabled.
    |
    */

    'runMigrationsOnLogin' => null,

    /*
    |--------------------------------------------------------------------------
    | Determines which modules to load
    |--------------------------------------------------------------------------
    |
    | Specify which modules should be registered when using the application.
    |
    */

    'loadModules' => ['System', 'Backend', 'Cms'],

    /*
    |--------------------------------------------------------------------------
    | Prevents application updates
    |--------------------------------------------------------------------------
    |
    | If using composer or git to download updates to the core files, set this
    | value to 'true' to prevent the update gateway from trying to download
    | these files again as part of the application update process. Plugins
    | and themes will still be downloaded.
    |
    */

    'disableCoreUpdates' => false,

    /*
    |--------------------------------------------------------------------------
    | Specific plugins to disable
    |--------------------------------------------------------------------------
    |
    | Specify plugin codes which will always be disabled in the application.
    |
    */

    'disablePlugins' => [],

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

    'enableRoutesCache' => env('ROUTES_CACHE', false),

    /*
    |--------------------------------------------------------------------------
    | Time to live for the URL map.
    |--------------------------------------------------------------------------
    |
    | The URL map used in the CMS page routing process. By default
    | the map is updated every time when a page is saved in the back-end or when the
    | interval, in minutes, specified with the urlMapCacheTTL parameter expires.
    |
    */

    'urlCacheTtl' => 10,

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

    'parsedPageCacheTTL' => 10,

    /*
    |--------------------------------------------------------------------------
    | Determines if the asset caching is enabled.
    |--------------------------------------------------------------------------
    |
    | If the caching is enabled, combined assets are cached. If a asset file
    | is changed on the disk, the old file contents could be still saved in the cache.
    | To update the cache the back-end Clear Cache feature should be used. It is recommended
    | to disable the caching during the development, and enable it in the production mode.
    |
    */

    'enableAssetCache' => env('ASSET_CACHE', false),

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

    'enableAssetMinify' => null,

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

    'enableAssetDeepHashing' => null,

    /*
    |--------------------------------------------------------------------------
    | Database-driven Themes
    |--------------------------------------------------------------------------
    |
    | Stores theme templates in the database instead of the filesystem.
    |
    | false - All theme templates are sourced from the filesystem.
    |
    | true  - Source theme templates from the database with fallback to the filesytem.
    |
    | null  - Setting equal to the inverse of app.debug: debug enabled, this disabled.
    |
    | The database layer stores all modified CMS files in the database. Files that are
    | not modified continue to be loaded from the filesystem. The `theme:sync $themeDir`
    | console command is available to populate the database from the filesystem with
    | the `--toFile` flag to sync in the other direction (database to filesystem) and
    | the `--paths="/path/to/file.md,/path/to/file2.md" flag to sync only specific files.
    |
    | Files modified in the database are cached to indicate that they should be loaded
    | from the database.
    |
    */

    'databaseTemplates' => env('DATABASE_TEMPLATES', false),

    /*
    |--------------------------------------------------------------------------
    | Public plugins path
    |--------------------------------------------------------------------------
    |
    | Specifies the public plugins path relative to the application base URL,
    | or you can specify a full URL path.
    |
    */

    'pluginsPath' => '/plugins',

    /*
    |--------------------------------------------------------------------------
    | Public themes path
    |--------------------------------------------------------------------------
    |
    | Specifies the public themes path relative to the application base URL,
    | or you can specify a full URL path.
    |
    */

    'themesPath' => '/themes',

    /*
    |--------------------------------------------------------------------------
    | Resource storage
    |--------------------------------------------------------------------------
    |
    | Specifies the configuration for resource storage, such as media and
    | upload files. These resources are used:
    |
    | media   - generated by the media manager.
    | uploads - generated by attachment model relationships.
    |
    | For each resource you can specify:
    |
    | disk   - filesystem disk, as specified in filesystems.php config.
    | folder - a folder prefix for storing all generated files inside.
    | path   - the public path relative to the application base URL,
    |          or you can specify a full URL path.
    |
    | Optionally, you can specify how long temporary URLs to protected files
    | in cloud storage (ex. AWS, RackSpace) are valid for by setting
    | temporaryUrlTTL to a value in seconds to define a validity period. This
    | is only used for the 'uploads' config when using a supported cloud disk
    */

    'storage' => [

        'uploads' => [
            'disk'            => 'local',
            'folder'          => 'uploads',
            'path'            => '/storage/app/uploads',
            'temporaryUrlTTL' => 3600,
        ],

        'media' => [
            'disk'   => 'local',
            'folder' => 'media',
            'path'   => '/storage/app/media',
        ],

    ],

    /*
    |--------------------------------------------------------------------------
    | Convert Line Endings
    |--------------------------------------------------------------------------
    |
    | Determines if October should convert line endings from the windows style
    | \r\n to the unix style \n.
    |
    */

    'convertLineEndings' => false,

    /*
    |--------------------------------------------------------------------------
    | Linking policy
    |--------------------------------------------------------------------------
    |
    | Controls how URL links are generated throughout the application.
    |
    | detect   - detect hostname and use the current schema
    | secure   - detect hostname and force HTTPS schema
    | insecure - detect hostname and force HTTP schema
    | force    - force hostname and schema using app.url config value
    |
    */

    'linkPolicy' => env('LINK_POLICY', 'detect'),

    /*
    |--------------------------------------------------------------------------
    | Default permission mask
    |--------------------------------------------------------------------------
    |
    | Specifies a default file and folder permission for newly created objects.
    |
    */

    'defaultMask' => ['file' => null, 'folder' => null],

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

    'enableSafeMode' => null,

    /*
    |--------------------------------------------------------------------------
    | Cross Site Request Forgery (CSRF) Protection
    |--------------------------------------------------------------------------
    |
    | If the CSRF protection is enabled, all "postback" & AJAX requests are
    | checked for a valid security token.
    |
    */

    'enableCsrfProtection' => env('ENABLE_CSRF', true),

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

    'forceBytecodeInvalidation' => true,

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

    'enableTwigStrictVariables' => false,

    /*
    |--------------------------------------------------------------------------
    | Base Directory Restriction
    |--------------------------------------------------------------------------
    |
    | Restricts loading backend template and config files to within the base
    | directory of the application.
    |
    | WARNING: This should always be enabled for security reasons. However, in
    | some cases you may need to disable this; for instance when developing
    | plugins that are stored elsewhere in the filesystem for organizational
    | reasons and then symlinked into the application plugins/ directory.
    |
    | NEVER have this disabled in production.
    |
    */

    'restrictBaseDir' => true,

    /*
    |--------------------------------------------------------------------------
    | Backend Service Worker
    |--------------------------------------------------------------------------
    |
    | Allow plugins to run Service Workers in the backend.
    |
    | WARNING: This should always be disabled for security reasons as Service
    | Workers can be hijacked and used to run XSS into the backend. Turning
    | this feature on can create a conflict if you have a frontend Service
    | Worker running. The 'scope' needs to be correctly set and not have a
    | duplicate subfolder structure on the frontend, otherwise it will run
    | on both the frontend and backend of your website.
    |
    | true  - allow service workers to run in the backend
    |
    | false - disallow service workers to run in the backend
    |
    */

    'enableBackendServiceWorkers' => false,

];
