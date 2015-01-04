<?php

/**
 * Register CMS routes before all user routes.
 */
App::before(function ($request) {
    /*
     * The CMS module intercepts all URLs that were not
     * handled by the back-end modules.
     */
    Route::any('{slug}', 'Cms\Classes\Controller@run')->where('slug', '(.*)?');
});
