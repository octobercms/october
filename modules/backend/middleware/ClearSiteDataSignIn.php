<?php namespace Backend\Middleware;

use Closure;
use Symfony\Component\HttpFoundation\Response as SymfonyResponse;
use Response;

/**
 * Clear the Cache and Cookies Before Signin
 * We are using the W3c Clear Site Data API Header
 * For more details see here: https://www.w3.org/TR/clear-site-data/
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

        if (!$response instanceof SymfonyResponse) {
            $response = new Response($response);
        }

        $response->headers->set('Clear-Site-Data', 'cache, cookies');
		
        return $response;

    }
}