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
    | Cross Site Request Forgery (CSRF) Protection
    |--------------------------------------------------------------------------
    |
    | If the CSRF protection is enabled, all "postback" & AJAX requests are
    | checked for a valid security token.
    |
    */

    'enableCsrfProtection' => false,

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
