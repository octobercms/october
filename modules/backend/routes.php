<?php

/**
 * Register Backend routes before all user routes.
 */
App::before(function ($request) {

    /**
     * @event backend.beforeRoute
     * Fires before backend routes get added
     *
     * Example usage:
     *
     *     Event::listen('backend.beforeRoute', function () {
     *         // your code here
     *     });
     *
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

    /**
     * @event backend.route
     * Fires after backend routes have been added
     *
     * Example usage:
     *
     *     Event::listen('backend.route', function () {
     *         // your code here
     *     });
     *
     */
    Event::fire('backend.route');
});
