<?php namespace Backend\Middleware;

use Closure;
use Response;

/**
 * Clear the Cache and Cookies Before Signin
 * We are using the Cache-Control HTTP Header
 * For more details see here: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control
 * Relates to github Issue: https://github.com/octobercms/october/issues/3707
 *
 * @package october\backend
 * @author Alexey Bobkov, Samuel Georges
 */
 class ClearSiteDataSignIn
 {
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
     public function handle($request, Closure $next)
     {
         $response = $next($request);
         $response->headers->set('Cache-Control', 'no-cache, no-store, must-revalidate');
         return $response;
     }
 }