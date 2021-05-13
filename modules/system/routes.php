<?php

Route::any('/', [\System\Handlers\Installer::class, 'index']);
Route::any('/check', [\System\Handlers\Installer::class, 'check']);
Route::any('/setup', [\System\Handlers\Installer::class, 'setup']);
Route::any('/project', [\System\Handlers\Installer::class, 'project']);
Route::any('/install', [\System\Handlers\Installer::class, 'placeholder']);
// Route::any('/install', [\System\Handlers\Installer::class, 'install']);
// Route::any('/composer/update', [\System\Handlers\Composer::class, 'update']);
