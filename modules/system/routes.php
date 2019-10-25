<?php

/**
 * Register System routes before all user routes.
 */
App::before(function ($request) {
    /*
     * Combine JavaScript and StyleSheet assets
     */
    Route::any('combine/{file}', 'System\Classes\SystemController@combine');
});
