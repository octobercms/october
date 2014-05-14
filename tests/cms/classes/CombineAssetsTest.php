<?php

use Cms\Classes\Theme;
use Cms\Classes\CombineAssets;

class CombineAssetsTest extends TestCase 
{
    public function setUp()
    {
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
        $combiner = new CombineAssets;

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
        $combiner = new CombineAssets;
        $url = $combiner->combine(['assets/css/style1.css', 'assets/css/style2.css'], '/tests/fixtures/Cms/themes/test');
        $this->assertNotNull($url);
        $this->assertRegExp('/\.css$/i', $url);         // Must end in .css
        $this->assertRegExp('/\w+[-]\d+/i', $url);      // Must contain hash-number

        $url = $combiner->combine(['assets/js/script1.js', 'assets/js/script2.js'], '/tests/fixtures/Cms/themes/test');
        $this->assertNotNull($url);
        $this->assertRegExp('/\.js$/i', $url);          // Must end in .js
        $this->assertRegExp('/\w+[-]\d+/i', $url);      // Must contain hash-number
    }

    public function testPrepareRequest()
    {
        $this->markTestIncomplete('TODO');
    }

    public function testGetCombinedUrl()
    {
        $this->markTestIncomplete('TODO');
    }

    public function testGetContents()
    {
        $this->markTestIncomplete('TODO');
    }

    public function testPrepareCombiner()
    {
        $this->markTestIncomplete('TODO');
    }

    public function testPutCache()
    {
        $sampleId = md5('testhash');
        $sampleStore = ['version' => 12345678];
        $samplePath = '/tests/fixtures/Cms/themes/test';

        $combiner = new CombineAssets;
        $value = self::callProtectedMethod($combiner, 'putCache', [$sampleId, $sampleStore]);

        $this->assertTrue($value);
    }

    public function testGetCache()
    {
        $this->markTestIncomplete('TODO');
    }

    public function testMakeCacheId()
    {
        $sampleResources = ['assets/css/style1.css', 'assets/css/style2.css'];
        $samplePath = '/tests/fixtures/Cms/themes/test';

        $combiner = new CombineAssets;
        self::setProtectedProperty($combiner, 'path', $samplePath);

        $value = self::callProtectedMethod($combiner, 'makeCacheId', [$sampleResources]);
        $this->assertEquals(md5($samplePath.implode('|', $sampleResources)), $value);
    }

    public function testResetCache()
    {
        $combiner = new CombineAssets;
        $this->assertNull($combiner->resetCache());
    }

    public function testPutCacheIndex()
    {
        $this->markTestIncomplete('TODO');
    }

    public function testRegisterFilter()
    {
        $this->markTestIncomplete('TODO');
    }

    public function testResetFilter()
    {
        $this->markTestIncomplete('TODO');
    }

    public function testGetFilters()
    {
        $this->markTestIncomplete('TODO');
    }

    public function testCombinerNotFound()
    {
        $this->markTestIncomplete('Unfinished.');

        $theme = new Theme();
        $theme->load('test');
        $controller = new Controller($theme);
        $response = $controller->run('/combine/xxxxxxxxx');

        $this->assertEquals("The combiner file 'xxx' is not found.", $response->getOriginalContent());
    }
}