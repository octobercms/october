<?php

/**
 * Register Backend routes before all user routes.
 */

/*
* Extensibility
*/
Event::fire('backend.beforeRoute');

/*
* Other pages
*/
Route::group([
        'middleware' => ['web'],
        'prefix' => Config::get('cms.backendUri', 'backend')
    ], function () {
        Route::any('{slug}', 'Backend\Classes\BackendController@run')->where('slug', '(.*)?');
    })
;

/*
* Entry point
*/
Route::any(Config::get('cms.backendUri', 'backend'), 'Backend\Classes\BackendController@run')->middleware('web');

/*
* Extensibility
*/
Event::fire('backend.route');
 