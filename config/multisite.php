<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Enable Multisite
    |--------------------------------------------------------------------------
    |
    | Allows the creation of multiple site definitions in the same installation.
    | Disabling this will lock any existing site definitions.
    |
    */

    'enabled' => true,

    /*
    |--------------------------------------------------------------------------
    | Multisite Features
    |--------------------------------------------------------------------------
    |
    | Use multisite for the features defined below. Be sure to clear the application
    | cache after modifying these settings.
    |
    */

    'features' => [
        'backend_mail_setting' => false,
    ],

];
