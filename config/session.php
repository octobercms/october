<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Default Session Driver
    |--------------------------------------------------------------------------
    |
    | This option controls the default session "driver" that will be used on
    | requests. By default, we will use the lightweight native driver but
    | you may specify any of the other wonderful drivers provided here.
    |
    | Supported: "file", "cookie", "database", "apc",
    |            "memcached", "redis", "array"
    |
    */

    'driver' => 'file',

    /*
    |--------------------------------------------------------------------------
    | Session Lifetime
    |--------------------------------------------------------------------------
    |
    | Here you may specify the number of minutes that you wish the session
    | to be allowed to remain idle for it is expired. If you want them
    | to immediately expire when the browser closes, set it to zero.
    |
    */

    'lifetime' => 120,

    'expire_on_close' => false,

    /*
    |--------------------------------------------------------------------------
    | Session Encryption
    |--------------------------------------------------------------------------
    |
    | This option allows you to easily specify that all of your session data
    | should be encrypted before it is stored. All encryption will be run
    | automatically by Laravel and you can use the Session like normal.
    |
    */

    'encrypt' => false,

    /*
    |--------------------------------------------------------------------------
    | Session File Location
    |--------------------------------------------------------------------------
    |
    | When using the native session driver, we need a location where session
    | files may be stored. A default has been set for you but a different
    | location may be specified. This is only needed for file sessions.
    |
    */

    'files' => storage_path('framework/sessions'),

    /*
    |--------------------------------------------------------------------------
    | Session Database Connection
    |--------------------------------------------------------------------------
    |
    | When using the "database" or "redis" session drivers, you may specify a
    | connection that should be used to manage these sessions. This should
    | correspond to a connection in your database configuration options.
    |
    */

    'connection' => null,

    /*
    |--------------------------------------------------------------------------
    | Session Database Table
    |--------------------------------------------------------------------------
    |
    | When using the "database" session driver, you may specify the table we
    | should use to manage the sessions. Of course, a sensible default is
    | provided for you; however, you are free to change this as needed.
    |
    */

    'table' => 'sessions',

    /*
    |--------------------------------------------------------------------------
    | Session Sweeping Lottery
    |--------------------------------------------------------------------------
    |
    | Some session drivers must manually sweep their storage location to get
    | rid of old sessions from storage. Here are the chances that it will
    | happen on a given request. By default, the odds are 2 out of 100.
    |
    */

    'lottery' => [2, 100],

    /*
    |--------------------------------------------------------------------------
    | Session Cookie Name
    |--------------------------------------------------------------------------
    |
    | Here you may change the name of the cookie used to identify a session
    | instance by ID. The name specified here will get used every time a
    | new session cookie is created by the framework for every driver.
    |
    */

    'cookie' => 'october_session',


    /*
    |--------------------------------------------------------------------------
    | Session Cookie Prefix
    |--------------------------------------------------------------------------
    |
    | This feature adds a set of restrictions upon the names which may be used
    | for cookies with specific properties. These restrictions enable user
    | agents to smuggle cookie state to the server within the confines of the
    | existing `Cookie` request header syntax and limits the ways in which
    | cookies may be abused.
    |
    | It is ideal to make secure cookies writable only from `secure origins`.
    | Cookie prefixes make it possible to flag your cookies to have different
    | behaviour, in a backward compatible way. It uses a dirty trick to put a
    | flag in the name of the cookie. When a cookie name starts with this
    | flag, it triggers additional browser policies on the cookie in
    | supporting browsers.
    |
    | The `__Secure-` prefix makes a cookie accessible from HTTPS sites only.
    | A HTTP site can not read or update a cookie if the name starts with
    | `__Secure-`. This protects against the cookie smuggling attack, where
    | an attacker uses a forged insecure site to overwrite a secure cookie.
    |
    | The `__Host-` prefix does the same as the `__Secure-` prefix and more.
    | A `__Host-` prefixed cookie is only accessible by the same domain it is
    | set on. This means that a 'subdomain can no longer overwrite the cookie
    | value'.
    |
    | Supported: "secure", "host" and "none"
    |
    | Secure - Requires `https`, cookie `session.secure` set to `true` and 
    | can be used with subdomains. This is the `default` setting.
    |
    | Host - Requires `https`, cookie `session.secure` set to `true`, can't
    | be used with subdomains and the `session.path` has a value of `/`.
    |
    | None - Don't turn this security feature on. Not recommended.
    |
    */

    'cookie_prefix' => 'secure',


    /*
    |--------------------------------------------------------------------------
    | Session Cookie Path
    |--------------------------------------------------------------------------
    |
    | The session cookie path determines the path for which the cookie will
    | be regarded as available. Typically, this will be the root path of
    | your application but you are free to change this when necessary.
    |
    */

    'path' => '/',

    /*
    |--------------------------------------------------------------------------
    | Session Cookie Domain
    |--------------------------------------------------------------------------
    |
    | Here you may change the domain of the cookie used to identify a session
    | in your application. This will determine which domains the cookie is
    | available to in your application. A sensible default has been set.
    |
    */

    'domain' => null,

    /*
    |--------------------------------------------------------------------------
    | HTTP Access Only
    |--------------------------------------------------------------------------
    |
    | Setting this value to true will prevent JavaScript from accessing the
    | value of the cookie and the cookie will only be accessible through
    | the HTTP protocol. You are free to modify this option if needed.
    |
    */
    
    'http_only' => true,

    /*
    |--------------------------------------------------------------------------
    | HTTPS Only Cookies
    |--------------------------------------------------------------------------
    |
    | By setting this option to true, session cookies will only be sent back
    | to the server if the browser has a HTTPS connection. This will keep
    | the cookie from being sent to you if it can not be done securely.
    |
    */

    'secure' => false,

    /*
    |--------------------------------------------------------------------------
    | Same-Site Cookies
    |--------------------------------------------------------------------------
    |
    | This option determines how your cookies behave when cross-site requests
    | take place and can be used to mitigate CSRF attacks.
    |
    | Cookies that match the domain of the current site, i.e. what's displayed
    | in the browser's address bar, are referred to as first-party cookies.
    | Similarly, cookies from domains other than the current site are referred
    | to as third-party cookies.
    |
    | Cookies without a SameSite attribute will be treated as `SameSite=Lax`,
    | meaning the default behaviour will be to restrict cookies to first party
    | contexts only.
    |
    | Cookies for cross-site usage must specify `same_site` as 'None' and `secure`
    | as `true` to work correctly.
    |
    | Lax - Cookies are allowed to be sent with top-level navigations and will
    | be sent along with GET request initiated by third party website.
    | This is the default value in modern browsers.
    |
    | Strict - Cookies will only be sent in a first-party context and not be
    | sent along with requests initiated by third party websites.
    |
    | Supported: "Lax", "Strict" and "None"
    |
    */

    'same_site' => 'Lax',

];
