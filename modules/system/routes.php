<?php

use Config;

/**
 * Register System routes before all user routes.
 */
App::before(function ($request) {
    /*
     * Combine JavaScript and StyleSheet assets
     */
    $_url = Config::get('cms.combineAssetsPath','/combine');
    $_url = parse_url($_url, PHP_URL_PATH);

    Route::any($_url.'/{file}', 'System\Classes\Controller@combine');
});
