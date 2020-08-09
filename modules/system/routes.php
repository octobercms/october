<?php

/**
 * Register System routes before all user routes.
 */
App::before(function ($request) {
    /*
     * Combine JavaScript and StyleSheet assets
     */
    Route::any('combine/{file}', 'System\Classes\SystemController@combine');

    /*
     * Resize image assets
     * Requires ?t={encodedUrl} to be present
     */
    Route::get('resizer/{identifier}', 'System\Classes\SystemController@resizer');
});