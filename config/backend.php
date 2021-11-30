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
    | Backend Timezone
    |--------------------------------------------------------------------------
    |
    | This acts as the default setting for a backend user's timezone. This can
    | be changed by the user at any time using the backend preferences. All
    | dates displayed in the backend will be converted to this timezone.
    |
    */

    'timezone' => 'UTC',

    /*
    |--------------------------------------------------------------------------
    | Backend Skin
    |--------------------------------------------------------------------------
    |
    | Specifies the backend skin class to use.
    |
    */

    'skin' => Backend\Skins\Standard::class,

    /*
    |--------------------------------------------------------------------------
    | Default Branding
    |--------------------------------------------------------------------------
    |
    | The default backend customization settings. These values are all optional
    | and remember to set the enabled value to true.
    |
    */

    'brand' => [
        'enabled' => false,
        'app_name' => 'October CMS',
        'tagline' => 'Getting Back to Basics',
        'menu_mode' => 'icons',
        'favicon_path' => '~/app/assets/images/logo.png',
        'logo_path' => '~/app/assets/images/logo.png',
        'stylesheet_path' => '~/app/assets/less/styles.less',
        'login_background_type' => 'color',
        'login_background_color' => '#fef6eb',
        'login_background_wallpaper_size' => 'auto',
        'login_image_type' => 'autumn_images',
        'login_custom_image' => '~/app/assets/images/loginimage.png',
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
    | Force Single Session
    |--------------------------------------------------------------------------
    |
    | Use this setting to prevent concurrent sessions. When enabled, backend
    | users cannot sign in to multiple devices at the same time. When a new
    | sign in occurs, all other sessions for that user are invalidated.
    |
    */

    'force_single_session' => false,

    /*
    |--------------------------------------------------------------------------
    | Password Policy
    |--------------------------------------------------------------------------
    |
    | Specify the password policy for backend administrators.
    |
    | min_length        - Password minimum length between 4 - 128 chars
    | require_uppercase - Require at least one uppercase letter (A–Z)
    | require_lowercase - Require at least one lowercase letter (a–z)
    | require_number    - Require at least one number
    | require_nonalpha  - Require at least one nonalphanumeric character
    | expire_days       - Enable password expiration after number of days (@todo)
    |
    */

    'password_policy' => [
        'min_length' => 4,
        'require_uppercase' => false,
        'require_lowercase' => false,
        'require_number' => false,
        'require_nonalpha' => false,
    ],


    /*
    |--------------------------------------------------------------------------
    | Default Avatar
    |--------------------------------------------------------------------------
    |
    | The default avatar used for backend accounts that have no avatar defined.
    |
    | local    - Use a local default image of a user
    | gravatar - Use the Gravatar service to generate a unique image
    | <url>    - Specify a custom URL to a default avatar
    |
    */

    'default_avatar' => 'gravatar',

];
