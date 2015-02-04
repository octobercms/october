<?php

return [

    /*
     * Laravel providers
     */
    // 'Illuminate\Foundation\Providers\ArtisanServiceProvider',
    // 'Illuminate\Cache\CacheServiceProvider',
    // 'Illuminate\Session\CommandsServiceProvider',
    // 'Illuminate\Foundation\Providers\ConsoleSupportServiceProvider',
    // 'Illuminate\Routing\ControllerServiceProvider',
    // 'Illuminate\Cookie\CookieServiceProvider',
    // 'Illuminate\Encryption\EncryptionServiceProvider',
    // 'Illuminate\Hashing\HashServiceProvider',
    // 'Illuminate\Log\LogServiceProvider',
    // 'Illuminate\Database\MigrationServiceProvider',
    // 'Illuminate\Foundation\Providers\OptimizeServiceProvider',
    // 'Illuminate\Pagination\PaginationServiceProvider',
    // 'Illuminate\Queue\QueueServiceProvider',
    // 'Illuminate\Redis\RedisServiceProvider',
    // 'Illuminate\Remote\RemoteServiceProvider',
    // 'Illuminate\Database\SeedServiceProvider',
    // 'Illuminate\Foundation\Providers\ServerServiceProvider',
    // 'Illuminate\Session\SessionServiceProvider',
    // 'Illuminate\Validation\ValidationServiceProvider',
    // 'Illuminate\View\ViewServiceProvider',

    'Illuminate\Foundation\Providers\ArtisanServiceProvider',
    // 'Illuminate\Auth\AuthServiceProvider',
    'Illuminate\Bus\BusServiceProvider',
    'Illuminate\Cache\CacheServiceProvider',
    'Illuminate\Foundation\Providers\ConsoleSupportServiceProvider',
    'Illuminate\Routing\ControllerServiceProvider',
    'Illuminate\Cookie\CookieServiceProvider',
    // 'Illuminate\Database\DatabaseServiceProvider',**
    'Illuminate\Encryption\EncryptionServiceProvider',
    // 'Illuminate\Filesystem\FilesystemServiceProvider',**
    'Illuminate\Foundation\Providers\FoundationServiceProvider',
    'Illuminate\Hashing\HashServiceProvider',
    // 'Illuminate\Mail\MailServiceProvider',**
    'Illuminate\Pagination\PaginationServiceProvider',
    'Illuminate\Pipeline\PipelineServiceProvider',
    'Illuminate\Queue\QueueServiceProvider',
    'Illuminate\Redis\RedisServiceProvider',
    // 'Illuminate\Auth\Passwords\PasswordResetServiceProvider',
    'Illuminate\Session\SessionServiceProvider',
    // 'Illuminate\Translation\TranslationServiceProvider',
    'Illuminate\Validation\ValidationServiceProvider',
    'Illuminate\View\ViewServiceProvider',

    /*
     * October Rain providers
     */
    'October\Rain\Cron\CronServiceProvider',
    'October\Rain\Database\DatabaseServiceProvider',
    'October\Rain\Filesystem\FilesystemServiceProvider',
    // 'October\Rain\Config\ConfigServiceProvider',
    'October\Rain\Html\HtmlServiceProvider',
    'October\Rain\Network\NetworkServiceProvider',
    'October\Rain\Translation\TranslationServiceProvider',
    'October\Rain\Scaffold\ScaffoldServiceProvider',
    'October\Rain\Flash\FlashServiceProvider',
    'October\Rain\Mail\MailServiceProvider',
    'October\Rain\Parse\ParseServiceProvider',

    /*
     * Vendor providers
     */
    'Indatus\Dispatcher\ServiceProvider',

];
