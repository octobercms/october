<?php

use Illuminate\Http\Request;
use System\Twig\SecurityPolicy\SafeRequest;
use Twig\Sandbox\SecurityNotAllowedMethodError;

/**
 * SafeRequestTest covers the Twig-safe request proxy.
 */
class SafeRequestTest extends TestCase
{
    protected function makeRequest(): Request
    {
        return Request::create('http://example.test/foo/bar?q=hi', 'GET', ['extra' => 'val']);
    }

    public function testCommonReadMethodsForwardThrough()
    {
        $proxy = new SafeRequest($this->makeRequest());

        $this->assertSame('http://example.test/foo/bar', $proxy->url());
        $this->assertSame('foo/bar', $proxy->path());
        $this->assertSame('GET', $proxy->method());
        $this->assertSame('hi', $proxy->input('q'));
        $this->assertSame('val', $proxy->input('extra'));
        $this->assertTrue($proxy->has('q'));
    }

    public function testServerMethodIsBlocked()
    {
        $proxy = new SafeRequest($this->makeRequest());

        $this->expectException(SecurityNotAllowedMethodError::class);
        $this->expectExceptionMessage('server');

        $proxy->server('APP_KEY');
    }

    public function testHeaderMethodIsBlocked()
    {
        $proxy = new SafeRequest($this->makeRequest());

        $this->expectException(SecurityNotAllowedMethodError::class);

        $proxy->header('Authorization');
    }

    public function testCookieMethodIsBlocked()
    {
        $proxy = new SafeRequest($this->makeRequest());

        $this->expectException(SecurityNotAllowedMethodError::class);

        $proxy->cookie('session');
    }

    public function testBearerTokenIsBlocked()
    {
        $proxy = new SafeRequest($this->makeRequest());

        $this->expectException(SecurityNotAllowedMethodError::class);

        $proxy->bearerToken();
    }

    public function testGetContentIsBlocked()
    {
        $proxy = new SafeRequest($this->makeRequest());

        $this->expectException(SecurityNotAllowedMethodError::class);

        $proxy->getContent();
    }

    public function testSessionMethodIsBlocked()
    {
        $proxy = new SafeRequest($this->makeRequest());

        $this->expectException(SecurityNotAllowedMethodError::class);

        $proxy->session();
    }

    public function testUserMethodIsBlocked()
    {
        $proxy = new SafeRequest($this->makeRequest());

        $this->expectException(SecurityNotAllowedMethodError::class);

        $proxy->user();
    }

    public function testPropertyAccessForAllowedMethods()
    {
        $proxy = new SafeRequest($this->makeRequest());

        // Twig accesses properties before falling back to methods, so
        // {{ this.request.url }} (no parens) must resolve.
        $this->assertSame('http://example.test/foo/bar', $proxy->url);
        $this->assertSame('foo/bar', $proxy->path);
        $this->assertSame('GET', $proxy->method);
        $this->assertTrue(isset($proxy->url));
    }

    public function testPropertyAccessForBlockedKeysReturnsNull()
    {
        $proxy = new SafeRequest($this->makeRequest());

        $this->assertNull($proxy->server);
        $this->assertFalse(isset($proxy->server));
    }
}
