<?php
/*
| For additional options see
| https://github.com/octobercms/october/blob/master/config/cms.php
*/

return [
    'activeTheme' => env('CMS_ACTIVE_THEME', 'demo'),
    'edgeUpdates' => env('CMS_EDGE_UPDATES', false),
    'disableCoreUpdates' => env('CMS_DISABLE_CORE_UPDATES', true),
    'backendTimezone' => env('TZ', 'UTC'),
    'backendSkin' => env('CMS_BACKEND_SKIN', 'Backend\Skins\Standard'),
    'linkPolicy' => env('CMS_LINK_POLICY', 'detect'),
    'backendForceSecure' => env('CMS_BACKEND_FORCE_SECURE', false),
    'defaultMask' => [
        'file' => env('CMS_DEFAULT_MASK_FILE', '664'),
        'folder' =>  env('CMS_DEFAULT_MASK_FOLDER', '775'),
    ],
];
