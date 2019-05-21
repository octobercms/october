<?php
/*
| For additional options see
| https://github.com/octobercms/october/blob/master/config/database.php
|
| When using a container to serve a database, the host value will need to be
|  set as the service name defined in your docker-compose.yml
*/

return [
    'default' => env('DB_TYPE','sqlite'), // sqlite, mysql, etc
    'connections' => [
        'sqlite' => [
            'database' => env('DB_PATH_SQLITE','storage/database.sqlite'),
        ],
        'mysql' => [
            'host'      => env('DB_HOST','mysql'),
            'port'      => env('DB_PORT'),
            'database'  => env('DB_DATABASE'),
            'username'  => env('DB_USERNAME'),
            'password'  => env('DB_PASSWORD'),
        ],
        'pgsql' => [
            'host'     => env('DB_HOST'),
            'port'     => env('DB_PORT'),
            'database' => env('DB_DATABASE'),
            'username' => env('DB_USERNAME'),
            'password' => env('DB_PASSWORD'),
        ],
    ],
    'redis' => [
        'default' => [
            'host'     => env('DB_REDIS_HOST','redis'),
            'password' => env('DB_REDIS_PASSWORD',null),
            'port'     => env('DB_REDIS_PORT',6379),
        ],
    ],
];
