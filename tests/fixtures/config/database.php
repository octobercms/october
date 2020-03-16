<?php
// Fixture used for `october:env` unit tests in `tests/unit/system/console/OctoberEnvTest.php

return [
    'default' => 'mysql',
    'connections' => [
        'mysql' => [
            'host'       => 'localhost',
            'port'       => 3306,
            'database'   => 'data#base',
            'username'   => 'teal\'c',
            'password'   => 'test"quotes\'test',
        ],
    ],
    'useConfigForTesting' => false,
];
