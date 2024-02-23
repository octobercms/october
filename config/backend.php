<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Backend URI prefix
    |--------------------------------------------------------------------------
    |
    | Specifies the URL name used for accessing backend pages.
    | For example: admin -> http://localhost/admin
    |
    */

    'uri' => env('BACKEND_URI', 'admin'),

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
    | and remember to set the enabled value to true. Supported values:
    |
    | - menu_mode: inline, text, tile, collapse, icons, left
    | - color_mode: light, dark, auto
    | - color_palette: default, classic, oxford, console, valentino, punch
    | - login_background_type: color, wallpaper, october_ai_images
    | - login_background_wallpaper_size: auto, cover
    | - login_image_type: autumn_images, custom
    |
    */

    'brand' => [
        'enabled' => false,
        'app_name' => env('APP_NAME', 'October CMS'),
        'tagline' => 'Administration Panel',
        'menu_mode' => 'icons',
        'color_mode' => 'light',
        'color_palette' => 'default',
        'logo_path' => '~/app/assets/images/logo.png',
        'favicon_path' => '~/app/assets/images/favicon.png',
        'menu_logo_path' => '~/app/assets/images/menu_logo.png',
        'dashboard_icon_path' => '~/app/assets/images/dashboard_icon.png',
        'stylesheet_path' => '~/app/assets/css/brand_styles.css',
        'login_background_type' => 'color',
        'login_background_color' => '#fef6eb',
        'login_background_wallpaper' => '~/app/assets/images/login_wallpaper.png',
        'login_background_wallpaper_size' => 'auto',
        'login_image_type' => 'autumn_images',
        'login_custom_image' => '~/app/assets/images/loginimage.png',
    ],

    /*
    |--------------------------------------------------------------------------
    | Turbo Router
    |--------------------------------------------------------------------------
    |
    | Enhance the backend experience using PJAX (push state and AJAX) so when
    | you click a link, the page is automatically swapped client-side without
    | the cost of a full page load.
    |
    */

    'turbo_router' => env('BACKEND_TURBO_ROUTER', false),

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
    | true  - session never expires (cookie expiration in 5 years)
    | false - session has a limited time (see session.lifetime)
    | null  - the form login displays a checkbox that allow user to choose
    |
    */

    'force_remember' => null,

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
    | Force Mail Setting
    |--------------------------------------------------------------------------
    |
    | Use this setting to remove the option to configure the mail settings
    | via the backend. This can be used in developer environments to prevent
    | accidentally sending mail via the configured database.
    |
    */

    'force_mail_setting' => false,

    /*
    |--------------------------------------------------------------------------
    | Password Policy
    |--------------------------------------------------------------------------
    |
    | Specify the password policy for backend administrators.
    |
    | allow_reset       - Allow administrators to reset their own passwords via self service
    | min_length        - Password minimum length between 4 - 128 chars
    | require_uppercase - Require at least one uppercase letter (A–Z)
    | require_lowercase - Require at least one lowercase letter (a–z)
    | require_number    - Require at least one number
    | require_nonalpha  - Require at least one non-alphanumeric character
    | expire_days       - Enable password expiration after number of days, false to disable
    |
    */

    'password_policy' => [
        'allow_reset' => true,
        'min_length' => 4,
        'require_uppercase' => false,
        'require_lowercase' => false,
        'require_number' => false,
        'require_nonalpha' => false,
        'expire_days' => false,
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

    /*
    |--------------------------------------------------------------------------
    | Backend Locale
    |--------------------------------------------------------------------------
    |
    | This acts as the default setting for a backend user's locale. This can
    | be changed by the user at any time using the backend preferences.
    |
    */

    'locale' => env('APP_LOCALE', 'en'),

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
    | Middleware Group
    |--------------------------------------------------------------------------
    |
    | The name of the middleware group to apply to all backend application routes.
    | You may use this to apply your own middleware definition.
    |
    */

    'middleware_group' => 'web',

];
