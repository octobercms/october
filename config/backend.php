<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Backend URI prefix
    |--------------------------------------------------------------------------
    |
    | Specifies the URL name used for accessing backend pages.
    | For example: backend -> http://localhost/backend
    |
    */

    'uri' => env('BACKEND_URI', 'backend'),

    /*
    |--------------------------------------------------------------------------
    | Backend Skin
    |--------------------------------------------------------------------------
    |
    | Specifies the backend skin class to use.
    |
    */

    'skin' => 'Backend\Skins\Standard',

    /*
    |--------------------------------------------------------------------------
    | Default Branding
    |--------------------------------------------------------------------------
    |
    | The default backend customization settings.
    |
    */

    'brand' => [
        'enabled' => false,
        'app_name' => 'October CMS',
        'tagline' => 'Getting Back to Basics',
        'primary_color' => '#6A6CF7',
        'secondary_color' => '#e67e22',
        'accent_color' => '#3498db',
        'menu_mode' => 'icon',
        'favicon_path' => '~/app/assets/images/logo.png',
        'logo_path' => '~/app/assets/images/logo.png',
        'stylesheet_path' => '~/app/assets/less/styles.less',
    ],

    /*
    |--------------------------------------------------------------------------
    | Force HTTPS security
    |--------------------------------------------------------------------------
    |
    | Use this setting to force a secure protocol when accessing any backend
    | pages, including the authentication pages. This is usually handled by
    | web server config, but can be handled by the app for added security.
    |
    */

    'force_secure' => false,

    /*
    |--------------------------------------------------------------------------
    | Remember Login
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

    'force_remember' => true,

    /*
    |--------------------------------------------------------------------------
    | Backend Timezone
    |--------------------------------------------------------------------------
    |
    | This acts as the default setting for a backend user's timezone. This can
    | be changed by the user at any time using the backend preferences. All
    | dates displayed in the backend will be converted to this timezone.
    |
    */

    'timezone' => 'UTC',

];
