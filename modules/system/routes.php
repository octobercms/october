<?php

/**
 * Register System routes before all user routes.
 */

/*
* Combine JavaScript and StyleSheet assets
*/
Route::any('combine/{file}', 'System\Classes\SystemController@combine');