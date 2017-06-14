<?php

$api = app('Dingo\Api\Routing\Router');
/* Sample API route */
$api->version('v1', function ($api) {
    $api->get('/', function () use ($api) {
        return json_encode(['version' => 'v1']);
    });
});





