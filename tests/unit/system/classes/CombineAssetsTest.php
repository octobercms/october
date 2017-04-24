<?php

use Cms\Classes\Theme;
use System\Classes\CombineAssets;

class CombineAssetsTest extends TestCase 
{
    public function setUp()
    {
        parent::setUp();

        CombineAssets::resetCache();
    }

    //
    // Helpers
    //

    protected static function callProtectedMethod($object, $name, $params = [])
    {
        $className = get_class($object);
        $class = new ReflectionClass($className);
        $method = $class->getMethod($name);
        $method->setAccessible(true);
        return $method->invokeArgs($object, $params);
    }

    public static function getProtectedProperty($object, $name)
    {
        $className = get_class($object);
        $class = new ReflectionClass($className);
        $property = $class->getProperty($name);
        $property->setAccessible(true);
        return $property->getValue($object);
    }

    public static function setProtectedProperty($object, $name, $value)
    {
        $className = get_class($object);
        $class = new ReflectionClass($className);
        $property = $class->getProperty($name);
        $property->setAccessible(true);
        return $property->setValue($object, $value);
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
        $this->assertInternalType('array', $jsExt);

        $cssExt = self::getProtectedProperty($combiner, 'cssExtensions');
        $this->assertInternalType('array', $cssExt);

        /*
         * Check service methods
         */
        $this->assertTrue(method_exists($combiner, 'combine'));
        $this->assertTrue(method_exists($combiner, 'resetCache'));
    }

    public function testCombine()
    {
        $combiner = CombineAssets::instance();

        $url = $combiner->combine([
                'assets/css/style1.css',
                'assets/css/style2.css'
            ],
            base_path().'/tests/fixtures/themes/test'
        );
        $this->assertNotNull($url);
        $this->assertRegExp('/\w+[-]\d+/i', $url); // Must contain hash-number

        $url = $combiner->combine([
            'assets/js/script1.js',
            'assets/js/script2.js'
            ],
            base_path().'/tests/fixtures/themes/test'
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
        $samplePath = base_path().'/tests/fixtures/cms/themes/test';

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

}
