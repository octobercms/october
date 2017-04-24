<?php

use Cms\Classes\Theme;
use Cms\Classes\CmsObject;
use Cms\Classes\CmsCompoundObject;
use October\Rain\Halcyon\Model;

class TestCmsCompoundObject extends CmsCompoundObject
{
    protected $dirName = 'testobjects';

    protected function parseSettings() {}
}

class TestParsedCmsCompoundObject extends CmsCompoundObject
{
    protected $dirName = 'testobjects';
}

class TestTemporaryCmsCompoundObject extends CmsCompoundObject
{
    protected $dirName = 'temporary';

    protected function parseSettings() {}
}

class CmsCompoundObjectTest extends TestCase
{
    public function setUp()
    {
        parent::setUp();

        Model::clearBootedModels();
        Model::flushEventListeners();
    }

    public function testLoadFile()
    {
        $theme = Theme::load('test');

        $obj = TestCmsCompoundObject::load($theme, 'compound.htm');
        $this->assertContains("\$controller->data['something'] = 'some value'", $obj->code);
        $this->assertEquals('<p>This is a paragraph</p>', $obj->markup);
        $this->assertInternalType('array', $obj->settings);
        $this->assertArrayHasKey('var', $obj->settings);
        $this->assertEquals('value', $obj->settings['var']);

        $this->assertArrayHasKey('components', $obj->settings);

        $this->assertArrayHasKey('section', $obj->settings['components']);
        $this->assertInternalType('array', $obj->settings['components']['section']);
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
        $this->assertInternalType('array', $obj->settings['components']);
        $this->assertArrayHasKey('testArchive', $obj->settings['components']);
        $this->assertArrayHasKey('posts-per-page', $obj->settings['components']['testArchive']);
        $this->assertEquals(10, $obj->settings['components']['testArchive']['posts-per-page']);
    }

    public function testHasComponent()
    {
        $theme = Theme::load('test');

        $obj = TestCmsCompoundObject::load($theme, 'components.htm');
        $this->assertArrayHasKey('components', $obj->settings);

        $this->assertInternalType('array', $obj->settings['components']);
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
        if (file_exists($filePath))
            @unlink($filePath);

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
        $this->assertInternalType('array', $obj->settings);
        $this->assertArrayHasKey('var', $obj->settings);
        $this->assertEquals('value', $obj->settings['var']);

        $this->assertArrayHasKey('components', $obj->settings);

        $this->assertInternalType('array', $obj->settings['components']['section']);
        $this->assertArrayHasKey('version', $obj->settings['components']['section']);
        $this->assertEquals(10, $obj->settings['components']['section']['version']);

        $this->assertEquals('value', $obj->var);
        $this->assertInternalType('array', $obj->settings['components']['section']);
        $this->assertArrayHasKey('version', $obj->settings['components']['section']);
        $this->assertEquals(10, $obj->settings['components']['section']['version']);

        /*
         * Load the test object again, it should be loaded from the cache this time
         */

        CmsObject::clearInternalCache();
        $obj = TestTemporaryCmsCompoundObject::loadCached($theme, 'testcompound.htm');
        $this->assertTrue($obj->isLoadedFromCache());
        $this->assertEquals($testContent, $obj->getContent());
        $this->assertEquals('testcompound.htm', $obj->getFileName());
        $this->assertEquals('<p>This is a paragraph</p>', $obj->markup);
        $this->assertInternalType('array', $obj->settings);
        $this->assertArrayHasKey('var', $obj->settings);
        $this->assertEquals('value', $obj->settings['var']);

        $this->assertArrayHasKey('components', $obj->settings);

        $this->assertInternalType('array', $obj->settings['components']['section']);
        $this->assertArrayHasKey('version', $obj->settings['components']['section']);
        $this->assertEquals(10, $obj->settings['components']['section']['version']);

        $this->assertEquals('value', $obj->var);
        $this->assertInternalType('array', $obj->settings['components']['section']);
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
        if (file_exists($destFilePath))
            unlink($destFilePath);

        $this->assertFileNotExists($destFilePath);

        $obj = TestCmsCompoundObject::inTheme($theme);
        $obj->fill([
            'markup' => '<p>Hello, world!</p>',
            'fileName'=>'compound-markup'
        ]);
        $obj->save();

        $referenceFilePath = base_path().'/tests/fixtures/cms/reference/compound-markup.htm';
        $this->assertFileExists($referenceFilePath);

        $this->assertFileExists($destFilePath);
        $this->assertFileEqualsNormalized($referenceFilePath, $destFilePath);
    }

    public function testSaveMarkupAndSettings()
    {
        $theme = Theme::load('apitest');

        $destFilePath = $theme->getPath().'/testobjects/compound-markup-settings.htm';
        if (file_exists($destFilePath))
            unlink($destFilePath);

        $this->assertFileNotExists($destFilePath);

        $obj = TestCmsCompoundObject::inTheme($theme);
        $obj->fill([
            'settings'=>['var'=>'value'],
            'markup' => '<p>Hello, world!</p>',
            'fileName'=>'compound-markup-settings'
        ]);
        $obj->save();

        $referenceFilePath = base_path().'/tests/fixtures/cms/reference/compound-markup-settings.htm';
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

        $referenceFilePath = base_path().'/tests/fixtures/cms/reference/compound-full.htm';
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
        $this->assertInternalType('array', $obj->settings);
        $this->assertArrayHasKey('var', $obj->settings);
        $this->assertEquals('value', $obj->settings['var']);

        $this->assertArrayHasKey('components', $obj->settings);

        $this->assertArrayHasKey('viewBag', $obj->settings['components']);
        $this->assertInternalType('array', $obj->settings['components']['viewBag']);
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
