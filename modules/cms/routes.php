<?php

/*
 * Register CMS routes before all user routes.
 */
App::before(function($request) {

    /*
     * Combine JavaScript and StyleSheet assets
     */
    Route::any('combine/{file}', 'Cms\Classes\Controller@combine');

    /*
     * The CMS module intercepts all URLs that were not 
     * handled by the back-end modules.
     */
    Route::any('{slug}', 'Cms\Classes\Controller@run')->where('slug', '(.*)?');

});
