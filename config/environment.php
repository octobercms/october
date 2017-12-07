<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Default Application Environment
    |--------------------------------------------------------------------------
    |
    | This value determines the "environment" your application is currently
    | running in. This may determine how you prefer to configure various
    | services your application utilizes. Set this in your ".env" file.
    |
    */

    'default' => 'development',

    /*
    |--------------------------------------------------------------------------
    | Environment Multitenancy
    |--------------------------------------------------------------------------
    |
    | You may specify a different environment according to the hostname that
    | is provided with the HTTP request. This is useful if you want to use
    | different configuration, such as database and theme, per hostname.
    |
    */

    'hosts' => [

        'localhost' => 'dev',

    ],

];
