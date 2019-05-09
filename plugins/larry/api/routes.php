<?php
Route::group(['prefix' => 'api/v1'], function () {
    Route::resource('foo', 'Larry\Api\Controllers\FooController');
});
