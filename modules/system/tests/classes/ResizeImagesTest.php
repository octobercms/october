<?php

use System\Classes\ResizeImages;

/**
 * ResizeImagesTest covers the external image host validation that
 * gates server-side fetches in getSourcePathForResize(). This is the
 * defense-in-depth SSRF guard: requests to non-http(s) schemes and to
 * loopback, private, link-local, and reserved IP ranges must be rejected
 * before file_get_contents() is called.
 */
class ResizeImagesTest extends TestCase
{
    protected ResizeImages $resizer;

    public function setUp(): void
    {
        parent::setUp();
        $this->resizer = new ResizeImages();
    }

    public function testHttpAndHttpsSchemesAreAccepted()
    {
        $this->assertTrue($this->callValidate('http://93.184.216.34/img.jpg'));
        $this->assertTrue($this->callValidate('https://93.184.216.34/img.jpg'));
    }

    public function testNonHttpSchemesAreRejected()
    {
        foreach (['file:///etc/passwd', 'ftp://example.com/img.jpg', 'gopher://1.2.3.4/img.jpg', 'data:image/jpeg;base64,xxx'] as $url) {
            $this->assertFalse(
                $this->callValidate($url),
                "Expected scheme in {$url} to be rejected"
            );
        }
    }

    public function testLoopbackAddressesAreRejected()
    {
        foreach (['http://127.0.0.1/img.jpg', 'http://127.0.0.1:8000/admin.jpg', 'http://[::1]/img.jpg'] as $url) {
            $this->assertFalse(
                $this->callValidate($url),
                "Expected loopback {$url} to be rejected"
            );
        }
    }

    public function testLinkLocalMetadataAddressIsRejected()
    {
        // AWS / GCP / Azure cloud metadata service
        $this->assertFalse($this->callValidate('http://169.254.169.254/latest/meta-data/img.jpg'));
    }

    public function testRfc1918PrivateRangesAreRejected()
    {
        foreach (['http://10.0.0.1/img.jpg', 'http://172.16.0.1/img.jpg', 'http://192.168.1.1/img.jpg'] as $url) {
            $this->assertFalse(
                $this->callValidate($url),
                "Expected private-range {$url} to be rejected"
            );
        }
    }

    public function testIpv6PrivateRangesAreRejected()
    {
        foreach (['http://[fc00::1]/img.jpg', 'http://[fe80::1]/img.jpg'] as $url) {
            $this->assertFalse(
                $this->callValidate($url),
                "Expected IPv6 private-range {$url} to be rejected"
            );
        }
    }

    public function testPublicIpsAreAccepted()
    {
        $this->assertTrue($this->callValidate('http://93.184.216.34/img.jpg'));
        $this->assertTrue($this->callValidate('http://[2606:2800:220:1:248:1893:25c8:1946]/img.jpg'));
    }

    public function testMalformedUrlIsRejected()
    {
        foreach (['', 'not-a-url', 'http://', '://nohost/img.jpg'] as $url) {
            $this->assertFalse(
                $this->callValidate($url),
                "Expected malformed {$url} to be rejected"
            );
        }
    }

    public function testResetCacheInvalidatesForAllInstances()
    {
        $info = ['version' => 'abc-1', 'path' => '/tmp/source.jpg', 'extension' => 'jpg'];

        self::callProtectedMethod($this->resizer, 'putCache', ['abc', $info]);
        $this->assertEquals($info, self::callProtectedMethod($this->resizer, 'getCache', ['abc']));

        // Another instance sees the entry through the shared store
        $otherInstance = new ResizeImages();
        $this->assertEquals($info, self::callProtectedMethod($otherInstance, 'getCache', ['abc']));

        // Any instance resets the cache, the generation bump makes old
        // entries invisible everywhere, including this request
        ResizeImages::resetCache();

        $this->assertFalse(self::callProtectedMethod($this->resizer, 'getCache', ['abc']));
        $this->assertFalse(self::callProtectedMethod($otherInstance, 'getCache', ['abc']));

        // New entries store and read under the new generation
        self::callProtectedMethod($this->resizer, 'putCache', ['abc', $info]);
        $this->assertEquals($info, self::callProtectedMethod($otherInstance, 'getCache', ['abc']));
    }

    public function testResetCachePurgesLegacyIndex()
    {
        $legacyKey = 'resizer.' . md5('legacy-item');
        Cache::forever($legacyKey, base64_encode(json_encode(['version' => 'x'])));
        Cache::forever('resizer.index', base64_encode(json_encode([$legacyKey])));

        ResizeImages::resetCache();

        $this->assertNull(Cache::get($legacyKey));
        $this->assertNull(Cache::get('resizer.index'));
    }

    /**
     * callValidate invokes the protected validateExternalImageHost method.
     */
    protected function callValidate(string $url): bool
    {
        return self::callProtectedMethod($this->resizer, 'validateExternalImageHost', [$url]);
    }
}
