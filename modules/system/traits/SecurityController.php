<?php namespace System\Traits;

use Date;
use Crypt;
use Config;
use Request;
use Session;
use Symfony\Component\HttpFoundation\Cookie;

/**
 * SecurityController Trait
 * Adds cross-site scripting protection methods to a controller based class
 *
 * @package october\system
 * @author Alexey Bobkov, Samuel Georges
 */
trait SecurityController
{
    /**
     * makeXsrfCookie adds anti-CSRF cookie.
     * Adds a cookie with a token for CSRF checks to the response.
     */
    protected function makeXsrfCookie(): Cookie
    {
        $config = Config::get('session');

        return new Cookie(
            'XSRF-TOKEN',
            Session::token(),
            Date::now()->addMinutes((int) $config['lifetime'])->getTimestamp(),
            $config['path'],
            $config['domain'],
            $config['secure'],
            false,
            false,
            $config['same_site'] ?? null
        );
    }

    /**
     * verifyCsrfToken checks if the request requires verification first (not GET, HEAD, OPTIONS) and
     * then the request data / headers for a valid CSRF token. Returns false if a valid token is not
     * found. Override this method to disable the check.
     * @return bool
     */
    protected function verifyCsrfToken(): bool
    {
        if (!Config::get('system.enable_csrf_protection', true)) {
            return true;
        }

        if (in_array(Request::method(), ['HEAD', 'GET', 'OPTIONS'])) {
            return true;
        }

        $token = Request::input('_token') ?: Request::header('X-CSRF-TOKEN');

        if (!$token && $header = Request::header('X-XSRF-TOKEN')) {
            $token = Crypt::decrypt($header, false);
        }

        if (!is_string($token) || !strlen($token) || !strlen(Session::token())) {
            return false;
        }

        return hash_equals(
            Session::token(),
            $token
        );
    }

    /**
     * verifyForceSecure checks if the back-end should force a secure protocol
     * (HTTPS) enabled by config.
     * @return bool
     */
    protected function verifyForceSecure(): bool
    {
        if (Request::secure()) {
            return true;
        }

        return !Config::get('backend.force_secure', false);
    }
}
