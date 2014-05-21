<?php

return array(

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
    | Determines which modules to load
    |--------------------------------------------------------------------------
    |
    | Specify which modules should be registered when using the application.
    |
    */
    'loadModules' => ['System', 'Backend', 'Cms'],

    /*
    |--------------------------------------------------------------------------
    | Sepcific plugins to disable
    |--------------------------------------------------------------------------
    |
    | Specify plugin codes which will always be disabled in the application.
    |
    */
    'disablePlugins' => [],

    /*
    |--------------------------------------------------------------------------
    | Back-end URI prefix
    |--------------------------------------------------------------------------
    |
    | Specifies the URI prefix used for accessing back-end pages.
    |
    */

    'backendUri' => 'backend',

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
    | Time to live for parsed CMS objects.
    |--------------------------------------------------------------------------
    |
    | Specifies the number of minutes the CMS object cache lives. After the interval 
    | is expired item are re-cached. Note that items are re-cached automatically when 
    | the corresponding template file is modified.
    |
    */

    'parsedPageCacheTTL' => 0,

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

    'enableRoutesCache' => false,

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
    | Determines if a friendly error page should be used.
    |--------------------------------------------------------------------------
    |
    | If this value is set to true, a friendly error page is used when an
    | exception is encountered. You must create a CMS page with route "/error"
    | to set the contents of this page. Otherwise the default error page is shown.
    |
    */

    'customErrorPage' => false,

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

    'enableAssetCache' => false,

    /*
    |--------------------------------------------------------------------------
    | Determines if the asset minification is enabled.
    |--------------------------------------------------------------------------
    |
    | If the minification is enabled, combined assets are compressed (minified).
    | It is recommended to disable the minification during the development, and
    | enable it in the production mode.
    |
    */

    'enableAssetMinify' => false,

    /*
    |--------------------------------------------------------------------------
    | Plugins directory
    |--------------------------------------------------------------------------
    |
    | Specifies the plugins directory relative to the application root directory.
    |
    */

    'pluginsDir' => '/plugins',

    /*
    |--------------------------------------------------------------------------
    | Themes directory
    |--------------------------------------------------------------------------
    |
    | Specifies the themes directory relative to the application root directory.
    |
    */

    'themesDir' => '/themes',

    /*
    |--------------------------------------------------------------------------
    | Uploads directory
    |--------------------------------------------------------------------------
    |
    | Specifies the uploads directory relative to the application root directory.
    |
    */

    'uploadsDir' => '/uploads',

    /*
    |--------------------------------------------------------------------------
    | Temporary directory
    |--------------------------------------------------------------------------
    |
    | Specifies a directory used by the application for temporarily storing files.
    |
    */

    'tempDir' => storage_path().'/temp',

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
    | Convert Line Endings
    |--------------------------------------------------------------------------
    |
    | Determines if October should convert line endings from the windows style
    | \r\n to the unix style \n.
    |
    */

    'convertLineEndings' => false,

);
