<?php namespace System\Twig\SecurityPolicy;

use Illuminate\Http\Request;
use October\Contracts\Twig\CallsAnyMethod;
use Twig\Sandbox\SecurityNotAllowedMethodError;

/**
 * SafeRequest is a request proxy class that is safe for use in Twig.
 *
 * It exposes an explicit subset of read-only methods to theme templates
 * and blocks methods that expose server environment variables, request
 * headers (which carry authentication credentials), cookies, or the raw
 * request body. The underlying Illuminate\Http\Request is otherwise
 * fully populated and would leak .env secrets, bearer tokens, and
 * session cookies if exposed without restriction.
 *
 * @package october\system
 * @author Alexey Bobkov, Samuel Georges
 */
class SafeRequest implements CallsAnyMethod
{
    /**
     * @var \Illuminate\Http\Request request instance being proxied
     */
    protected $request;

    /**
     * @var array allowedMethods is the explicit Twig surface of the request.
     * Anything not in this list is blocked, including server(), header(),
     * cookie(), getContent(), bearerToken(), getPassword(), getUser(),
     * session(), and user().
     */
    protected $allowedMethods = [
        // URL / routing
        'url', 'fullUrl', 'fullUrlWithQuery', 'fullUrlWithoutQuery',
        'path', 'decodedPath', 'segment', 'segments',
        'host', 'httpHost', 'schemeAndHttpHost', 'getHost', 'getHttpHost',
        'root', 'getBaseUrl', 'getRequestUri',
        'is', 'fullUrlIs', 'routeIs',

        // Method / type
        'method', 'getMethod', 'isMethod',
        'ajax', 'pjax', 'pjaxCached', 'prefetch', 'wantsJson', 'expectsJson',
        'secure', 'isSecure', 'getScheme',
        'isJson', 'getContentTypeFormat',

        // User-supplied input (safe: it's the attacker's own input)
        'input', 'query', 'post', 'all', 'only', 'except', 'collect',
        'has', 'hasAny', 'hasAll', 'filled', 'anyFilled', 'missing',
        'string', 'str', 'boolean', 'integer', 'float', 'date', 'enum',
        'isNotFilled', 'whenHas', 'whenFilled', 'whenMissing',

        // Network metadata (low-sensitivity)
        'ip', 'ips', 'userAgent',

        // Locale
        'getLocale', 'getPreferredLanguage', 'getLanguages', 'getDefaultLocale',
    ];

    /**
     * __construct
     */
    public function __construct(Request $request)
    {
        $this->request = $request;
    }

    /**
     * __call magic
     */
    public function __call($method, $parameters)
    {
        if (!in_array($method, $this->allowedMethods, true)) {
            throw new SecurityNotAllowedMethodError(
                sprintf('Calling "%s" method on a request is blocked in Safe Mode.', $method),
                Request::class,
                $method
            );
        }

        return $this->request->{$method}(...$parameters);
    }

    /**
     * __get proxies property access. Twig may access common request fields
     * (e.g. {{ this.request.url }}) which Twig resolves via property access
     * before falling back to a method call. We only expose method-call
     * results, never the raw $server/$cookies/$headers bag properties.
     */
    public function __get($key)
    {
        if (in_array($key, $this->allowedMethods, true)) {
            return $this->request->{$key}();
        }

        return null;
    }

    /**
     * __isset is needed for Twig's defined check on property access.
     */
    public function __isset($key)
    {
        return in_array($key, $this->allowedMethods, true);
    }
}
