<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Specifies the default CMS theme
    |--------------------------------------------------------------------------
    |
    | This parameter value can be overridden by the CMS back-end settings.
    |
    */

    'activeTheme' => 'test',

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

    'parsedPageCacheTTL' => 1440,

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

    'enableRoutesCache' => true,

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

    'urlCacheTtl' => 1,

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
    | Disables Twig caching for unit tests
    |--------------------------------------------------------------------------
    */

    'twigNoCache' => true,

    /*
    |--------------------------------------------------------------------------
    | Convert Line Endings
    |--------------------------------------------------------------------------
    |
    | Determines if October should convert line endings from the windows style
    | \r\n to the unix style \n.
    |
    */

    'convertLineEndings' => true,

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

    'databaseTemplates' => true,

    /*
    |--------------------------------------------------------------------------
    | Local plugins path
    |--------------------------------------------------------------------------
    |
    | Specifies the absolute local plugins path.
    |
    */

    'pluginsPathLocal' => base_path('tests/fixtures/plugins'),

    /*
    |--------------------------------------------------------------------------
    | Local themes path
    |--------------------------------------------------------------------------
    |
    | Specifies the absolute local themes path.
    |
    */

    'themesPathLocal' => base_path('tests/fixtures/themes'),

];
