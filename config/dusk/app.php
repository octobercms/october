<?php

return [
    'providers' => array_merge(include(base_path('modules/system/providers.php')), [
        'System\ServiceProvider',
        \Laravel\Dusk\DuskServiceProvider::class
    ])
];
