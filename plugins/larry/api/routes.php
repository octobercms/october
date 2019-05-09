<?php
Route::group(['prefix' => 'api/v1'], function () {
    Route::resource('foo', 'Larry\Api\Controllers\FooController');
    Route::get('/auth', 'Larry\Api\Controllers\FooController@auth');
});
