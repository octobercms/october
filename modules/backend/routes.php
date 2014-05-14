<?php

/*
 * Back-end routes
 */

Route::group(['prefix' => Config::get('cms.backendUri', 'backend')], function() {
    Route::any('{slug}', 'Backend\Classes\BackendController@run')->where('slug', '(.*)?');
});


Route::any(Config::get('cms.backendUri', 'backend'), 'Backend\Classes\BackendController@run');