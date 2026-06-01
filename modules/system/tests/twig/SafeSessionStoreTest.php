<?php

use Illuminate\Session\Store;
use Illuminate\Session\ArraySessionHandler;
use System\Twig\SecurityPolicy\SafeSessionStore;
use Twig\Sandbox\SecurityNotAllowedMethodError;

/**
 * SafeSessionStoreTest covers the Twig-safe session proxy.
 */
class SafeSessionStoreTest extends TestCase
{
    protected function makeStore(): Store
    {
        return new Store('october_test', new ArraySessionHandler(60));
    }

    public function testReadMethodsAreAllowed()
    {
        $store = $this->makeStore();
        $store->put('cart_count', 3);
        $store->put('_token', 'abc');

        $proxy = new SafeSessionStore($store);

        $this->assertSame(3, $proxy->get('cart_count'));
        $this->assertTrue($proxy->has('cart_count'));
        $this->assertSame('abc', $proxy->get('_token'));
        $this->assertSame(['cart_count' => 3], $proxy->only(['cart_count']));
    }

    public function testNonReservedWritesAreAllowed()
    {
        $store = $this->makeStore();
        $proxy = new SafeSessionStore($store);

        $proxy->put('cat_sort_all', 'name');
        $proxy->push('basket', 42);
        $proxy->increment('view_count');
        $proxy->forget('cat_sort_all');

        $this->assertSame([42], $store->get('basket'));
        $this->assertSame(1, $store->get('view_count'));
        $this->assertNull($store->get('cat_sort_all'));
    }

    public function testWritingAdminAuthIsBlocked()
    {
        $proxy = new SafeSessionStore($this->makeStore());

        $this->expectException(SecurityNotAllowedMethodError::class);
        $this->expectExceptionMessage('reserved session key "admin_auth"');

        $proxy->put('admin_auth', [3, 'fake_persist_code']);
    }

    public function testWritingOctoberAuthIsBlocked()
    {
        $proxy = new SafeSessionStore($this->makeStore());

        $this->expectException(SecurityNotAllowedMethodError::class);

        $proxy->put('october_auth', [3, 'fake_persist_code']);
    }

    public function testForgettingAdminAuthIsBlocked()
    {
        $store = $this->makeStore();
        $store->put('admin_auth', [3, 'real_persist_code']);
        $proxy = new SafeSessionStore($store);

        $this->expectException(SecurityNotAllowedMethodError::class);

        $proxy->forget('admin_auth');
    }

    public function testDotNotationBypassIsBlocked()
    {
        $proxy = new SafeSessionStore($this->makeStore());

        $this->expectException(SecurityNotAllowedMethodError::class);

        $proxy->put('admin_auth.user_id', 3);
    }

    public function testArrayKeyBypassIsBlocked()
    {
        $proxy = new SafeSessionStore($this->makeStore());

        $this->expectException(SecurityNotAllowedMethodError::class);

        $proxy->put(['cart' => 1, 'admin_auth' => [3, 'x']], null);
    }

    public function testUnderscorePrefixedKeysAreBlocked()
    {
        $proxy = new SafeSessionStore($this->makeStore());

        $this->expectException(SecurityNotAllowedMethodError::class);

        $proxy->put('_token', 'forged-token');
    }

    public function testLifecycleMethodsAreBlocked()
    {
        $proxy = new SafeSessionStore($this->makeStore());

        foreach (['invalidate', 'regenerate', 'migrate', 'flush', 'save', 'setId', 'setHandler'] as $method) {
            try {
                $proxy->{$method}();
                $this->fail("Expected {$method}() to be blocked");
            }
            catch (SecurityNotAllowedMethodError $e) {
                $this->assertStringContainsString($method, $e->getMessage());
            }
        }
    }
}
