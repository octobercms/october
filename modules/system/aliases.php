<?php

return [

    /*
     * Laravel aliases
     */
    'App'       => Illuminate\Support\Facades\App::class,
    'Artisan'   => Illuminate\Support\Facades\Artisan::class,
    'Bus'       => Illuminate\Support\Facades\Bus::class,
    'Cache'     => Illuminate\Support\Facades\Cache::class,
    'Cookie'    => Illuminate\Support\Facades\Cookie::class,
    'Crypt'     => Illuminate\Support\Facades\Crypt::class,
    'Db'        => Illuminate\Support\Facades\DB::class, // Preferred
    'DB'        => Illuminate\Support\Facades\DB::class,
    'Eloquent'  => Illuminate\Database\Eloquent\Model::class,
    'Event'     => Illuminate\Support\Facades\Event::class,
    'Hash'      => Illuminate\Support\Facades\Hash::class,
    'Lang'      => Illuminate\Support\Facades\Lang::class,
    'Log'       => Illuminate\Support\Facades\Log::class,
    'Queue'     => Illuminate\Support\Facades\Queue::class,
    'Redirect'  => Illuminate\Support\Facades\Redirect::class,
    'Redis'     => Illuminate\Support\Facades\Redis::class,
    'Request'   => Illuminate\Support\Facades\Request::class,
    'Response'  => Illuminate\Support\Facades\Response::class,
    'Route'     => Illuminate\Support\Facades\Route::class,
    'Session'   => Illuminate\Support\Facades\Session::class,
    'Storage'   => Illuminate\Support\Facades\Storage::class,
    'Url'       => Illuminate\Support\Facades\URL::class, // Preferred
    'URL'       => Illuminate\Support\Facades\URL::class,
    'View'      => Illuminate\Support\Facades\View::class,

    /*
     * October aliases
     */
    'AjaxException'        => October\Rain\Exception\AjaxException::class,
    'ApplicationException' => October\Rain\Exception\ApplicationException::class,
    'BackendAuth'          => Backend\Facades\BackendAuth::class,
    'Backend'              => Backend\Facades\Backend::class,
    'BackendMenu'          => Backend\Facades\BackendMenu::class,
    'Block'                => October\Rain\Support\Facades\Block::class,
    'Cms'                  => Cms\Facades\Cms::class,
    'Config'               => October\Rain\Support\Facades\Config::class,
    'DbDongle'             => October\Rain\Support\Facades\DbDongle::class,
    'File'                 => October\Rain\Support\Facades\File::class,
    'Flash'                => October\Rain\Support\Facades\Flash::class,
    'Form'                 => October\Rain\Support\Facades\Form::class,
    'Html'                 => October\Rain\Support\Facades\Html::class,
    'Http'                 => October\Rain\Support\Facades\Http::class,
    'Ini'                  => October\Rain\Support\Facades\Ini::class,
    'Input'                => October\Rain\Support\Facades\Input::class,
    'Mail'                 => October\Rain\Support\Facades\Mail::class,
    'Markdown'             => October\Rain\Support\Facades\Markdown::class,
    'Model'                => October\Rain\Database\Model::class,
    'Schema'               => October\Rain\Support\Facades\Schema::class,
    'Seeder'               => October\Rain\Database\Updates\Seeder::class,
    'Str'                  => October\Rain\Support\Facades\Str::class,
    'SystemException'      => October\Rain\Exception\SystemException::class,
    'Twig'                 => October\Rain\Support\Facades\Twig::class,
    'ValidationException'  => October\Rain\Exception\ValidationException::class,
    'Validator'            => October\Rain\Support\Facades\Validator::class,
    'Yaml'                 => October\Rain\Support\Facades\Yaml::class,

    /*
     * Fallback aliases
     */
    // Input facade was removed in Laravel 6 - we are keeping it in the Rain library for backwards compatibility.
    'Illuminate\Support\Facades\Input' => October\Rain\Support\Facades\Input::class,

    // Illuminate's HtmlDumper was "dumped" in Laravel 6 - we'll route this to Symfony's HtmlDumper as Laravel have done.
    'Illuminate\Support\Debug\HtmlDumper' => Symfony\Component\VarDumper\Dumper\HtmlDumper::class,
];
