<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Application Debug Mode
    |--------------------------------------------------------------------------
    |
    | When your application is in debug mode, detailed error messages with
    | stack traces will be shown on every error that occurs within your
    | application. If disabled, a simple generic error page is shown.
    |
    | You can create a CMS page with route "/error" to set the contents
    | of this page. Otherwise a default error page is shown.
    |
    */

    'debug' => true,

    /*
    |--------------------------------------------------------------------------
    | Application Name
    |--------------------------------------------------------------------------
    |
    | This value is the name of your application. This value is used when the
    | framework needs to place the application's name in a notification or
    | any other location as required by the application or its packages.
    */

    'name' => 'October CMS',

    /*
    |--------------------------------------------------------------------------
    | Application URL
    |--------------------------------------------------------------------------
    |
    | This URL is used by the console to properly generate URLs when using
    | the Artisan command line tool. You should set this to the root of
    | your application so that it is used when running Artisan tasks.
    |
    */

    'url' => 'http://localhost',

    /*
    |--------------------------------------------------------------------------
    | Application Timezone
    |--------------------------------------------------------------------------
    |
    | Here you may specify the default timezone for your application, which
    | will be used by the PHP date and date-time functions. We have gone
    | ahead and set this to a sensible default for you out of the box.
    |
    |
    | -------- STOP! --------
    | Before you change this value, consider carefully if that is actually
    | what you want to do. It is HIGHLY recommended that this is always set
    | to UTC (as your server & DB timezone should be as well) and instead you
    | use cms.backendTimezone to set the default timezone used in the backend
    | to display dates & times.
    |
    */

    'timezone' => 'UTC',

    /*
    |--------------------------------------------------------------------------
    | Application Locale Configuration
    |--------------------------------------------------------------------------
    |
    | The application locale determines the default locale that will be used
    | by the translation service provider. You are free to set this value
    | to any of the locales which will be supported by the application.
    |
    | WARNING: Avoid setting this to a locale that is not supported by the
    | backend yet, as this can cause issues in the backend.
    |
    | Currently supported backend locales are listed in
    | Backend\Models\Preference->getLocaleOptions())
    |
    */

    'locale' => 'en',

    /*
    |--------------------------------------------------------------------------
    | Application Fallback Locale
    |--------------------------------------------------------------------------
    |
    | The fallback locale determines the locale to use when the current one
    | is not available. You may change the value to correspond to any of
    | the language folders that are provided through your application.
    |
    */

    'fallback_locale' => 'en',

    /*
    |--------------------------------------------------------------------------
    | Encryption Key
    |--------------------------------------------------------------------------
    |
    | This key is used by the Illuminate encrypter service and should be set
    | to a random, 32 character string, otherwise these encrypted strings
    | will not be safe. Please do this before deploying an application!
    |
    */

    'key' => 'CHANGE_ME!!!!!!!!!!!!!!!!!!!!!!!',

    'cipher' => 'AES-256-CBC',

    /*
    |--------------------------------------------------------------------------
    | Autoloaded Service Providers
    |--------------------------------------------------------------------------
    |
    | The service providers listed here will be automatically loaded on the
    | request to your application. Feel free to add your own services to
    | this array to grant expanded functionality to your applications.
    |
    */

    'providers' => array_merge(include(base_path('modules/system/providers.php')), [

        // 'Illuminate\Html\HtmlServiceProvider', // Example

        'System\ServiceProvider',
    ]),

    /*
    |--------------------------------------------------------------------------
    | Load automatically discovered packages
    |--------------------------------------------------------------------------
    |
    | By default, October CMS disables the loading of discovered packages
    | through Laravel's package discovery service, in order to allow packages
    | used by plugins to be disabled if the plugin itself is disabled.
    |
    | Set this to `true` to enable automatic loading of these packages. This
    | will result in packages being loaded, even if the plugin using them is
    | disabled. This is NOT RECOMMENDED.
    |
    | Please note that packages defined in `app.providers` will still be loaded
    | even if discovery is disabled.
    |
    */

    'loadDiscoveredPackages' => false,
    
    /*
    |--------------------------------------------------------------------------
    | Class Aliases
    |--------------------------------------------------------------------------
    |
    | This array of class aliases will be registered when this application
    | is started. However, feel free to register as many as you wish as
    | the aliases are "lazy" loaded so they don't hinder performance.
    |
    */

    'aliases' => array_merge(include(base_path('modules/system/aliases.php')), [

        // 'Str' => 'Illuminate\Support\Str', // Example

    ]),

];
