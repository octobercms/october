<?php

return [
    'default' => 'sqlite_testing',
    'connections' => [
        'sqlite_testing' => [
            'driver' => 'sqlite',
            'database' => storage_path('testing.sqlite'),
        ]
    ]
];