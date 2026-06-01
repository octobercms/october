<?php namespace System\Twig\SecurityPolicy;

use Illuminate\Session\Store;
use October\Contracts\Twig\CallsAnyMethod;
use Twig\Sandbox\SecurityNotAllowedMethodError;

/**
 * SafeSessionStore is a session proxy class that is safe for use in Twig.
 *
 * It exposes a stable, explicit subset of read/write methods to theme
 * templates and rejects writes to session keys reserved by the framework
 * for authentication, CSRF, and other internal state.
 *
 * @package october\system
 * @author Alexey Bobkov, Samuel Georges
 */
class SafeSessionStore implements CallsAnyMethod
{
    /**
     * @var \Illuminate\Session\Store session instance being proxied
     */
    protected $session;

    /**
     * @var array allowedMethods is the explicit Twig surface of the session.
     * Anything not in this list is blocked, including session lifecycle
     * methods (start, save, invalidate, regenerate, migrate, setId,
     * setHandler, replace).
     */
    protected $allowedMethods = [
        // reads
        'get', 'pull', 'all', 'only', 'except',
        'has', 'hasAny', 'exists', 'missing',
        'token', 'previousUrl', 'previousUri', 'hasPreviousUri',
        'hasOldInput', 'getOldInput',

        // writes (filtered by reservedKeyPrefixes below)
        'put', 'push', 'increment', 'decrement', 'remove', 'forget',

        // flash data (filtered by reservedKeyPrefixes below)
        'flash', 'now', 'reflash', 'keep',
    ];

    /**
     * @var array writeMethods take a key as their first argument and must
     * have that key validated against $reservedKeyPrefixes.
     */
    protected $writeMethods = [
        'put', 'push', 'increment', 'decrement', 'remove', 'forget',
        'flash', 'now',
    ];

    /**
     * @var array reservedKeyPrefixes that themes cannot write to or forget.
     * Reserved for authentication, CSRF, and Laravel framework internals.
     */
    protected $reservedKeyPrefixes = [
        '_',                  // Laravel framework internals (_token, _flash, _previous, _old_input, ...)
        'admin_auth',         // Backend\Classes\AuthManager session key
        'october_auth',       // October\Rain\Auth\Manager session key
        'login_',             // Illuminate guard session keys (login_web_*, login_admin_*, ...)
        'password_hash_',     // Laravel password rehash session keys
        'PHPDEBUGBAR_',       // Debugbar internals
        'url',                // Laravel previous-url storage namespace
        'errors',             // Validation error bag
        'widget.',            // Backend SessionMaker widget state (consumed by unserialize)
    ];

    /**
     * __construct
     */
    public function __construct(Store $session)
    {
        $this->session = $session;
    }

    /**
     * __call magic
     */
    public function __call($method, $parameters)
    {
        if (!in_array($method, $this->allowedMethods, true)) {
            throw new SecurityNotAllowedMethodError(
                sprintf('Calling "%s" method on a session is blocked in Safe Mode.', $method),
                Store::class,
                $method
            );
        }

        if (in_array($method, $this->writeMethods, true)) {
            $this->assertKeyAllowed($method, $parameters[0] ?? null);
        }

        return $this->session->{$method}(...$parameters);
    }

    /**
     * assertKeyAllowed rejects writes to reserved session key prefixes.
     * Arrays (e.g. put(['k' => 'v'], ...)) and dot-notation keys are
     * normalized to their top-level segment before checking.
     */
    protected function assertKeyAllowed(string $method, $key): void
    {
        if (is_array($key)) {
            foreach (array_keys($key) as $k) {
                $this->assertKeyAllowed($method, $k);
            }
            return;
        }

        if (!is_string($key) || $key === '') {
            return;
        }

        $topKey = strstr($key, '.', true) ?: $key;

        foreach ($this->reservedKeyPrefixes as $prefix) {
            if (str_starts_with($topKey, $prefix)) {
                throw new SecurityNotAllowedMethodError(
                    sprintf('Writing to reserved session key "%s" is blocked in Safe Mode.', $key),
                    Store::class,
                    $method
                );
            }
        }
    }
}
