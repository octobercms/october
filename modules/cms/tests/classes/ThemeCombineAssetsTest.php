<?php

use System\Classes\CombineAssets;
use Illuminate\Support\Facades\Cache;

class ThemeCombineAssetsTest extends TestCase
{
    public function setUp(): void
    {
        parent::setUp();

        CombineAssets::resetCache();
    }

    //
    // Tests
    //

    public function testCombiner()
    {
        $combiner = CombineAssets::instance();

        /*
         * Supported file extensions should exist
         */
        $jsExt = $cssExt = self::getProtectedProperty($combiner, 'jsExtensions');
        $this->assertIsArray($jsExt);

        $cssExt = self::getProtectedProperty($combiner, 'cssExtensions');
        $this->assertIsArray($cssExt);

        /*
         * Check service methods
         */
        $this->assertTrue(method_exists($combiner, 'combine'));
        $this->assertTrue(method_exists($combiner, 'resetCache'));
    }

    public function testCombine()
    {
        $combiner = CombineAssets::instance();

        $url = $combiner->combine(
            [
                'assets/css/style1.css',
                'assets/css/style2.css'
            ],
            base_path().'/modules/cms/tests/fixtures/themes/test'
        );
        $this->assertNotNull($url);
        $this->assertRegExp('/\w+[-]\d+/i', $url); // Must contain hash-number

        $url = $combiner->combine(
            [
                'assets/js/script1.js',
                'assets/js/script2.js'
            ],
            base_path().'/modules/cms/tests/fixtures/themes/test'
        );
        $this->assertNotNull($url);
        $this->assertRegExp('/\w+[-]\d+/i', $url); // Must contain hash-number
    }

    public function testPutCache()
    {
        $sampleId = md5('testhash');
        $sampleStore = ['version' => 12345678];
        $samplePath = '/tests/fixtures/Cms/themes/test';

        $combiner = CombineAssets::instance();
        $value = self::callProtectedMethod($combiner, 'putCache', [$sampleId, $sampleStore]);

        $this->assertTrue($value);
    }

    public function testGetTargetPath()
    {
        $combiner = CombineAssets::instance();

        $value = self::callProtectedMethod($combiner, 'getTargetPath', ['/combine']);
        $this->assertEquals('combine/', $value);

        $value = self::callProtectedMethod($combiner, 'getTargetPath', ['/index.php/combine']);
        $this->assertEquals('index-php/combine/', $value);
    }

    public function testMakeCacheId()
    {
        $sampleResources = ['assets/css/style1.css', 'assets/css/style2.css'];
        $samplePath = base_path('/modules/cms/tests/fixtures/themes/test');

        $combiner = CombineAssets::instance();
        self::setProtectedProperty($combiner, 'localPath', $samplePath);

        $value = self::callProtectedMethod($combiner, 'getCacheKey', [$sampleResources]);
        $this->assertEquals(md5($samplePath.implode('|', $sampleResources)), $value);
    }

    public function testResetCache()
    {
        $combiner = CombineAssets::instance();
        $this->assertNull($combiner->resetCache());
    }

    public function testResetCacheInvalidatesForAllInstances()
    {
        $info = ['version' => 'abc-1'];

        $combiner = CombineAssets::instance();
        self::callProtectedMethod($combiner, 'putCache', ['abc', $info]);
        $this->assertEquals($info, self::callProtectedMethod($combiner, 'getCache', ['abc']));

        // Another instance sees the entry through the shared store
        $otherInstance = new CombineAssets();
        $this->assertEquals($info, self::callProtectedMethod($otherInstance, 'getCache', ['abc']));

        // Any instance resets the cache, the generation bump makes old
        // entries invisible everywhere, including this request
        CombineAssets::resetCache();

        $this->assertFalse(self::callProtectedMethod($combiner, 'getCache', ['abc']));
        $this->assertFalse(self::callProtectedMethod($otherInstance, 'getCache', ['abc']));

        // New entries store and read under the new generation
        self::callProtectedMethod($combiner, 'putCache', ['abc', $info]);
        $this->assertEquals($info, self::callProtectedMethod($otherInstance, 'getCache', ['abc']));
    }

    public function testResetCachePurgesLegacyIndex()
    {
        $legacyKey = 'combiner.' . md5('legacy-item');
        Cache::forever($legacyKey, base64_encode(json_encode(['version' => 'x'])));
        Cache::forever('combiner.index', base64_encode(json_encode([$legacyKey])));

        CombineAssets::resetCache();

        $this->assertNull(Cache::get($legacyKey));
        $this->assertNull(Cache::get('combiner.index'));
    }
}
