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
     * Service worker
     */
    Route::get(Backend::uri() . '/service-worker.js', [\Backend\Classes\ServiceWorkerController::class, 'index']);

    /*
     * Other pages
     */
    Route::group([
            'middleware' => Config::get('backend.middleware_group', 'web'),
            'prefix' => Backend::uri()
        ], function () {
            Route::any('{slug?}', [\Backend\Classes\BackendController::class, 'run'])
                ->where('slug', '(.*)?')
            ;
        })
    ;

    /*
     * Entry point
     */
    Route::any(Backend::uri(), [\Backend\Classes\BackendController::class, 'run'])
        ->middleware(Config::get('backend.middleware_group', 'web'))
    ;

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
