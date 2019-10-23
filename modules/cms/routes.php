<?php

/**
 * Register CMS routes before all user routes.
 */

/*
* Extensibility
*/
Event::fire('cms.beforeRoute');

/*
* The CMS module intercepts all URLs that were not
* handled by the back-end modules.
*/
Route::any('{slug}', 'Cms\Classes\CmsController@run')->where('slug', '(.*)?')->middleware('web');

/*
* Extensibility
*/
Event::fire('cms.route');
