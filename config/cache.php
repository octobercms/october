<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Default Cache Store
    |--------------------------------------------------------------------------
    |
    | This option controls the default cache connection that gets used while
    | using this caching library. This connection is used when another is
    | not explicitly specified when executing a given caching function.
    |
    */

    'default' => env('CACHE_DRIVER', 'file'),

    /*
    |--------------------------------------------------------------------------
    | Cache Stores
    |--------------------------------------------------------------------------
    |
    | Here you may define all of the cache "stores" for your application as
    | well as their drivers. You may even define multiple stores for the
    | same cache driver to group types of items stored in your caches.
    |
    */

    'stores' => [

        'apc' => [
            'driver' => 'apc'
        ],

        'array' => [
            'driver' => 'array'
        ],

        'database' => [
            'driver' => 'database',
            'table'  => 'cache',
            'connection' => null,
        ],

        'file' => [
            'driver' => 'file',
            'path'   => storage_path('framework/cache'),
        ],

        'memcached' => [
            'driver'  => 'memcached',
            'servers' => [
                [
                    'host'   => '127.0.0.1',
                    'port'   => 11211,
                    'weight' => 100,
                ],
            ],
        ],

        'redis' => [
            'driver' => 'redis',
            'connection' => 'default',
        ],

    ],

    /*
    |--------------------------------------------------------------------------
    | Cache Key Prefix
    |--------------------------------------------------------------------------
    |
    | When utilizing a RAM based store such as APC or Memcached, there might
    | be other applications utilizing the same cache. So, we'll specify a
    | value to get prefixed to all our keys so we can avoid collisions.
    |
    */

    'prefix' => 'october',

    /*
    |--------------------------------------------------------------------------
    | Cache Key for the CMS' PHP code parser cache
    |--------------------------------------------------------------------------
    |
    | This option controls the cache key used by the CMS when storing generated
    | PHP from the theme PHP sections. Recommended to change this when multiple
    | servers running OctoberCMS are connected to the same cache server to
    | prevent conflicts.
    |
    */

    'codeParserDataCacheKey' => 'cms-php-file-data',

    /*
    |--------------------------------------------------------------------------
    | Disable Request Cache
    |--------------------------------------------------------------------------
    |
    | The request cache stores cache retrievals from the cache store
    | in memory to speed up consecutive retrievals within the same request.
    |
    | true  - always disable this in-memory request cache
    |
    | false - always enable; be aware that long-running console commands
    |         (including queue workers) may retain cache entries in memory that
    |         have been changed in other processes or would have otherwise
    |         expired, causing issues with the `queue:restart` command, for
    |         example
    |
    | null  - enable for HTTP requests, disable when running in CLI
    |
    */

    'disableRequestCache' => null,
];
