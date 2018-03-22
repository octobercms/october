<?php

return [

    /*
     * Laravel providers
     */
    Illuminate\Broadcasting\BroadcastServiceProvider::class,
    Illuminate\Bus\BusServiceProvider::class,
    Illuminate\Cache\CacheServiceProvider::class,
    Illuminate\Cookie\CookieServiceProvider::class,
    Illuminate\Encryption\EncryptionServiceProvider::class,
    Illuminate\Foundation\Providers\FoundationServiceProvider::class,
    Illuminate\Hashing\HashServiceProvider::class,
    Illuminate\Pagination\PaginationServiceProvider::class,
    Illuminate\Pipeline\PipelineServiceProvider::class,
    Illuminate\Queue\QueueServiceProvider::class,
    Illuminate\Redis\RedisServiceProvider::class,
    Illuminate\Session\SessionServiceProvider::class,
    Illuminate\Validation\ValidationServiceProvider::class,
    Illuminate\View\ViewServiceProvider::class,
    Laravel\Tinker\TinkerServiceProvider::class,

    /*
     * October Rain providers
     */
    October\Rain\Foundation\Providers\ConsoleSupportServiceProvider::class,
    October\Rain\Database\DatabaseServiceProvider::class,
    October\Rain\Halcyon\HalcyonServiceProvider::class,
    October\Rain\Filesystem\FilesystemServiceProvider::class,
    October\Rain\Parse\ParseServiceProvider::class,
    October\Rain\Html\HtmlServiceProvider::class,
    October\Rain\Html\UrlServiceProvider::class,
    October\Rain\Network\NetworkServiceProvider::class,
    October\Rain\Scaffold\ScaffoldServiceProvider::class,
    October\Rain\Flash\FlashServiceProvider::class,
    October\Rain\Mail\MailServiceProvider::class,
    October\Rain\Argon\ArgonServiceProvider::class,

];
