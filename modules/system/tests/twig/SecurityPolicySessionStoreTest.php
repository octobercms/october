<?php

use Illuminate\Session\Store;
use Illuminate\Session\ArraySessionHandler;
use System\Twig\SecurityPolicy\SafeSessionStore;
use System\Twig\SecurityPolicy;
use Twig\Sandbox\SecurityNotAllowedMethodError;

/**
 * SecurityPolicySessionStoreTest covers SecurityPolicy's handling of
 * Illuminate\Session\Store. Raw stores must no longer be directly
 * allowlisted, and castMethodObjectToSafeObject must wrap them in
 * SafeSessionStore for safe Twig exposure.
 */
class SecurityPolicySessionStoreTest extends TestCase
{
    protected SecurityPolicy $policy;

    public function setUp(): void
    {
        parent::setUp();
        $this->policy = new SecurityPolicy();
    }

    protected function makeStore(): Store
    {
        return new Store('october_test', new ArraySessionHandler(60));
    }

    public function testRawSessionStoreIsNotDirectlyAllowlisted()
    {
        $store = $this->makeStore();

        $this->expectException(SecurityNotAllowedMethodError::class);

        $this->policy->checkMethodAllowed($store, 'put');
    }

    public function testCastWrapsSessionStoreInSafeProxy()
    {
        $store = $this->makeStore();
        $cast = $this->policy->castMethodObjectToSafeObject($store);

        $this->assertInstanceOf(SafeSessionStore::class, $cast);
    }

    public function testCastedProxyPassesMethodAllowedCheck()
    {
        $proxy = $this->policy->castMethodObjectToSafeObject($this->makeStore());

        // SafeSessionStore implements CallsAnyMethod, so the policy
        // must accept any method name on it without throwing. The
        // proxy's own __call enforces the real restrictions.
        $this->policy->checkMethodAllowed($proxy, 'put');
        $this->policy->checkMethodAllowed($proxy, 'get');
        $this->policy->checkMethodAllowed($proxy, 'invalidate');

        $this->assertTrue(true);
    }
}
