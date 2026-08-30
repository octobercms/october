<?php

use Cms\Classes\Page;
use Cms\Classes\Theme;
use Cms\Classes\Layout;
use Cms\Classes\CmsObject;
use Cms\Classes\CmsCompoundObject;
use October\Rain\Halcyon\Model;

class TestCmsCompoundObject extends CmsCompoundObject
{
    protected $dirName = 'testobjects';

    protected function parseSettings()
    {
    }
}

class TestParsedCmsCompoundObject extends CmsCompoundObject
{
    protected $dirName = 'testobjects';
}

class TestTemporaryCmsCompoundObject extends CmsCompoundObject
{
    protected $dirName = 'temporary';

    protected function parseSettings()
    {
    }
}

class CmsCompoundObjectTest extends TestCase
{
    public function setUp(): void
    {
        parent::setUp();
        Model::clearBootedModels();
        Model::flushEventListeners();
        require_once base_path('/modules/system/tests/fixtures/plugins/october/tester/components/Archive.php');
        require_once base_path('/modules/system/tests/fixtures/plugins/october/tester/components/Post.php');
    }

    public function testLoadFile()
    {
        $theme = Theme::load('test');

        $obj = TestCmsCompoundObject::load($theme, 'compound.htm');
        $this->assertStringContainsString("\$controller->data['something'] = 'some value'", $obj->code);
        $this->assertEquals('<p>This is a paragraph</p>', $obj->markup);
        $this->assertIsArray($obj->settings);
        $this->assertArrayHasKey('var', $obj->settings);
        $this->assertEquals('value', $obj->settings['var']);

        $this->assertArrayHasKey('components', $obj->settings);

        $this->assertArrayHasKey('section', $obj->settings['components']);
        $this->assertIsArray($obj->settings['components']['section']);
        $this->assertArrayHasKey('version', $obj->settings['components']['section']);
        $this->assertEquals(10, $obj->settings['components']['section']['version']);

        $this->assertEquals('value', $obj->var);

        $this->assertArrayHasKey('version', $obj->settings['components']['section']);
        $this->assertEquals(10, $obj->settings['components']['section']['version']);
    }

    public function testParseComponentSettings()
    {
        $theme = Theme::load('test');

        $obj = TestCmsCompoundObject::load($theme, 'component.htm');
        $this->assertArrayHasKey('components', $obj->settings);
        $this->assertIsArray($obj->settings['components']);
        $this->assertArrayHasKey('testArchive', $obj->settings['components']);
        $this->assertArrayHasKey('posts-per-page', $obj->settings['components']['testArchive']);
        $this->assertEquals(10, $obj->settings['components']['testArchive']['posts-per-page']);
    }

    public function testHasComponent()
    {
        $theme = Theme::load('test');

        $obj = TestCmsCompoundObject::load($theme, 'components.htm');
        $this->assertArrayHasKey('components', $obj->settings);

        $this->assertIsArray($obj->settings['components']);
        $this->assertArrayHasKey('testArchive firstAlias', $obj->settings['components']);
        $this->assertArrayHasKey('October\Tester\Components\Post secondAlias', $obj->settings['components']);

        // Explicit
        $this->assertEquals('testArchive firstAlias', $obj->hasComponent('testArchive'));
        $this->assertEquals('October\Tester\Components\Post secondAlias', $obj->hasComponent('October\Tester\Components\Post'));

        // Resolved
        $this->assertEquals('testArchive firstAlias', $obj->hasComponent('October\Tester\Components\Archive'));
        $this->assertEquals('October\Tester\Components\Post secondAlias', $obj->hasComponent('testPost'));

        // Negative test
        $this->assertFalse($obj->hasComponent('yooHooBigSummerBlowOut'));
        $this->assertFalse($obj->hasComponent('October\Tester\Components\BigSummer'));
    }

    public function testGetComponentProperties()
    {
        $theme = Theme::load('test');

        $obj = TestCmsCompoundObject::load($theme, 'components.htm');

        $properties = $obj->getComponentProperties('October\Tester\Components\Post');
        $emptyProperties = $obj->getComponentProperties('October\Tester\Components\Archive');
        $notExistingProperties = $obj->getComponentProperties('This\Is\Not\Component');
        $this->assertIsArray($properties);
        $this->assertArrayHasKey('show-featured', $properties);
        $this->assertTrue((bool)$properties['show-featured']);
        $this->assertEquals('true', $properties['show-featured']);
        $this->assertCount(1, $properties);
        $this->assertCount(0, $emptyProperties);
        $this->assertCount(0, $notExistingProperties);
    }

    public function testComponentPropertiesCacheUnderIndependentKeys()
    {
        $theme = Theme::load('test');

        $this->resetComponentPropertyRequestCache();

        $objA = TestCmsCompoundObject::load($theme, 'components.htm');
        $objB = TestCmsCompoundObject::load($theme, 'component.htm');

        // Every object caches under its own key
        $keyA = self::callProtectedMethod($objA, 'makeComponentPropertyCacheKey', [$theme]);
        $keyB = self::callProtectedMethod($objB, 'makeComponentPropertyCacheKey', [$theme]);
        $this->assertNotEquals($keyA, $keyB);

        $objA->getComponentProperties('October\Tester\Components\Post');
        $storedA = Cache::get($keyA);
        $this->assertNotNull($storedA);

        // Reading another object, as a concurrent request on another server
        // would, never rewrites this object's entry
        $objB->getComponentProperties('testArchive');
        $this->assertEquals($storedA, Cache::get($keyA));
        $this->assertNotNull(Cache::get($keyB));

        // Both entries resolve for fresh objects, as on a later request
        $this->resetComponentPropertyRequestCache();

        $properties = TestCmsCompoundObject::load($theme, 'components.htm')
            ->getComponentProperties('October\Tester\Components\Post');
        $this->assertEquals('true', $properties['show-featured'] ?? null);

        $properties = TestCmsCompoundObject::load($theme, 'component.htm')
            ->getComponentProperties('testArchive');
        $this->assertEquals(10, $properties['posts-per-page'] ?? null);
    }

    public function testClearCacheInvalidatesComponentPropertiesForAllInstances()
    {
        $theme = Theme::load('test');

        $this->resetComponentPropertyRequestCache();

        $obj = TestCmsCompoundObject::load($theme, 'components.htm');
        $obj->getComponentProperties('October\Tester\Components\Post');

        $key = self::callProtectedMethod($obj, 'makeComponentPropertyCacheKey', [$theme]);
        $this->assertNotNull(Cache::get($key));

        // Any instance clears the cache, the generation bump makes old entries
        // unreachable everywhere, including this request
        CmsCompoundObject::clearCache($theme);

        $newKey = self::callProtectedMethod($obj, 'makeComponentPropertyCacheKey', [$theme]);
        $this->assertNotEquals($key, $newKey);
        $this->assertNull(Cache::get($newKey));

        // Properties still resolve, rebuilt under the new generation
        $properties = $obj->getComponentProperties('October\Tester\Components\Post');
        $this->assertEquals('true', $properties['show-featured'] ?? null);
        $this->assertNotNull(Cache::get($newKey));
    }

    public function testSameBaseFileNameObjectsDoNotShareCacheEntries()
    {
        $theme = Theme::load('test');

        $this->resetComponentPropertyRequestCache();

        // A page and a layout sharing a base file name collided in the old
        // blob keyed by getBaseFileName()
        $page = Page::load($theme, 'ajax-test.htm');
        $layout = Layout::load($theme, 'ajax-test.htm');
        $this->assertEquals($page->getBaseFileName(), $layout->getBaseFileName());

        $pageKey = self::callProtectedMethod($page, 'makeComponentPropertyCacheKey', [$theme]);
        $layoutKey = self::callProtectedMethod($layout, 'makeComponentPropertyCacheKey', [$theme]);
        $this->assertNotEquals($pageKey, $layoutKey);
    }

    public function testClearCacheIsScopedToTheme()
    {
        $theme = Theme::load('test');
        $otherTheme = Theme::load('apitest');

        $this->resetComponentPropertyRequestCache();

        $obj = TestCmsCompoundObject::load($theme, 'components.htm');
        $obj->getComponentProperties('October\Tester\Components\Post');

        $key = self::callProtectedMethod($obj, 'makeComponentPropertyCacheKey', [$theme]);
        $this->assertNotNull(Cache::get($key));

        // Clearing another theme leaves this theme's generation and entries intact
        CmsCompoundObject::clearCache($otherTheme);

        $this->assertEquals($key, self::callProtectedMethod($obj, 'makeComponentPropertyCacheKey', [$theme]));
        $this->assertNotNull(Cache::get($key));
    }

    public function testClearCachePurgesLegacyComponentPropertyMap()
    {
        $theme = Theme::load('test');
        $legacyKey = 'cms_component_props_' . md5($theme->getPath());

        Cache::forever($legacyKey, base64_encode(serialize(['components' => []])));

        CmsCompoundObject::clearCache($theme);

        $this->assertNull(Cache::get($legacyKey));
    }

    /**
     * resetComponentPropertyRequestCache empties the request level map so the next
     * lookup goes to the cache store, as it would on a fresh request.
     */
    protected function resetComponentPropertyRequestCache(): void
    {
        $property = (new ReflectionClass(CmsCompoundObject::class))
            ->getProperty('objectComponentPropertyMap');

        $property->setAccessible(true);
        $property->setValue(null, []);
    }

    public function testCache()
    {
        $theme = Theme::load('test');
        $themePath = $theme->getPath();

        /*
         * Prepare the test file
         */

        $srcPath = $themePath.'/testobjects/compound.htm';
        $this->assertFileExists($srcPath);
        $testContent = file_get_contents($srcPath);
        $this->assertNotEmpty($testContent);

        $filePath = $themePath .= '/temporary/testcompound.htm';
        if (file_exists($filePath)) {
            @unlink($filePath);
        }

        $this->assertFileNotExists($filePath);
        file_put_contents($filePath, $testContent);

        /*
         * Load the test object to initialize the cache
         */

        $obj = TestTemporaryCmsCompoundObject::loadCached($theme, 'testcompound.htm');
        $this->assertFalse($obj->isLoadedFromCache());
        $this->assertEquals($testContent, $obj->getContent());
        $this->assertEquals('testcompound.htm', $obj->getFileName());
        $this->assertEquals('<p>This is a paragraph</p>', $obj->markup);
        $this->assertIsArray($obj->settings);
        $this->assertArrayHasKey('var', $obj->settings);
        $this->assertEquals('value', $obj->settings['var']);

        $this->assertArrayHasKey('components', $obj->settings);

        $this->assertIsArray($obj->settings['components']['section']);
        $this->assertArrayHasKey('version', $obj->settings['components']['section']);
        $this->assertEquals(10, $obj->settings['components']['section']['version']);

        $this->assertEquals('value', $obj->var);
        $this->assertIsArray($obj->settings['components']['section']);
        $this->assertArrayHasKey('version', $obj->settings['components']['section']);
        $this->assertEquals(10, $obj->settings['components']['section']['version']);

        /*
         * Load the test object again, it should be loaded from the cache this time
         */

        $obj = TestTemporaryCmsCompoundObject::loadCached($theme, 'testcompound.htm');
        $this->assertTrue($obj->isLoadedFromCache());
        $this->assertEquals($testContent, $obj->getContent());
        $this->assertEquals('testcompound.htm', $obj->getFileName());
        $this->assertEquals('<p>This is a paragraph</p>', $obj->markup);
        $this->assertIsArray($obj->settings);
        $this->assertArrayHasKey('var', $obj->settings);
        $this->assertEquals('value', $obj->settings['var']);

        $this->assertArrayHasKey('components', $obj->settings);

        $this->assertIsArray($obj->settings['components']['section']);
        $this->assertArrayHasKey('version', $obj->settings['components']['section']);
        $this->assertEquals(10, $obj->settings['components']['section']['version']);

        $this->assertEquals('value', $obj->var);
        $this->assertIsArray($obj->settings['components']['section']);
        $this->assertArrayHasKey('version', $obj->settings['components']['section']);
        $this->assertEquals(10, $obj->settings['components']['section']['version']);
    }

    public function testUndefinedProperty()
    {
        $obj = new TestCmsCompoundObject;
        $this->assertNull($obj->something);
    }

    public function testSaveMarkup()
    {
        $theme = Theme::load('apitest');

        $destFilePath = $theme->getPath().'/testobjects/compound-markup.htm';
        if (file_exists($destFilePath)) {
            unlink($destFilePath);
        }

        $this->assertFileNotExists($destFilePath);

        $obj = TestCmsCompoundObject::inTheme($theme);
        $obj->fill([
            'markup' => '<p>Hello, world!</p>',
            'fileName'=>'compound-markup'
        ]);
        $obj->save();

        $referenceFilePath = base_path('/modules/cms/tests/fixtures/reference/compound-markup.htm');
        $this->assertFileExists($referenceFilePath);

        $this->assertFileExists($destFilePath);
        $this->assertFileEqualsNormalized($referenceFilePath, $destFilePath);
    }

    public function testSaveMarkupAndSettings()
    {
        $theme = Theme::load('apitest');

        $destFilePath = $theme->getPath().'/testobjects/compound-markup-settings.htm';
        if (file_exists($destFilePath)) {
            unlink($destFilePath);
        }

        $this->assertFileNotExists($destFilePath);

        $obj = TestCmsCompoundObject::inTheme($theme);
        $obj->fill([
            'settings'=>['var'=>'value'],
            'markup' => '<p>Hello, world!</p>',
            'fileName'=>'compound-markup-settings'
        ]);
        $obj->save();

        $referenceFilePath = base_path('/modules/cms/tests/fixtures/reference/compound-markup-settings.htm');
        $this->assertFileExists($referenceFilePath);

        $this->assertFileExists($destFilePath);
        $this->assertFileEqualsNormalized($referenceFilePath, $destFilePath);
    }

    public function testSaveFull()
    {
        $theme = Theme::load('apitest');

        $destFilePath = $theme->getPath().'/testobjects/compound.htm';
        if (file_exists($destFilePath)) {
            unlink($destFilePath);
        }

        $this->assertFileNotExists($destFilePath);

        $obj = TestCmsCompoundObject::inTheme($theme);
        $obj->fill([
            'fileName'=>'compound',
            'settings'=>['var'=>'value'],
            'code' => 'function a() {return true;}',
            'markup' => '<p>Hello, world!</p>'
        ]);
        $obj->save();

        $referenceFilePath = base_path('/modules/cms/tests/fixtures/reference/compound-full.htm');
        $this->assertFileExists($referenceFilePath);

        $this->assertFileExists($destFilePath);
        $this->assertFileEqualsNormalized($referenceFilePath, $destFilePath);
    }

    public function testGetViewBagPopulated()
    {
        $theme = Theme::load('test');

        $obj = TestParsedCmsCompoundObject::load($theme, 'viewbag.htm');
        $this->assertNull($obj->code);
        $this->assertEquals('<p>Chop Suey!</p>', $obj->markup);
        $this->assertIsArray($obj->settings);
        $this->assertArrayHasKey('var', $obj->settings);
        $this->assertEquals('value', $obj->settings['var']);

        $this->assertArrayHasKey('components', $obj->settings);

        $this->assertArrayHasKey('viewBag', $obj->settings['components']);
        $this->assertIsArray($obj->settings['components']['viewBag']);
        $this->assertArrayHasKey('title', $obj->settings['components']['viewBag']);
        $this->assertEquals('Toxicity', $obj->settings['components']['viewBag']['title']);

        $viewBag = $obj->getViewBag();
        $properties = $viewBag->getProperties();
        $this->assertCount(1, $properties);
        $this->assertEquals($obj->viewBag, $properties);
        $this->assertInstanceOf('Cms\Components\ViewBag', $viewBag);
        $this->assertArrayHasKey('title', $properties);
        $this->assertEquals('Toxicity', $properties['title']);
    }

    public function testGetViewBagEmpty()
    {
        $theme = Theme::load('test');

        $obj = TestParsedCmsCompoundObject::load($theme, 'compound.htm');

        $viewBag = $obj->getViewBag();
        $this->assertInstanceOf('Cms\Components\ViewBag', $viewBag);
        $properties = $viewBag->getProperties();
        $this->assertEmpty($properties);
        $this->assertEquals($obj->viewBag, $properties);
    }

    //
    // Helpers
    //

    protected function assertFileEqualsNormalized($expected, $actual)
    {
        $expected = file_get_contents($expected);
        $expected = preg_replace('~\R~u', PHP_EOL, $expected); // Normalize EOL

        $actual = file_get_contents($actual);
        $actual = preg_replace('~\R~u', PHP_EOL, $actual); // Normalize EOL

        $this->assertEquals($expected, $actual);
    }
}
