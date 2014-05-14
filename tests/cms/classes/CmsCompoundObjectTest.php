<?php

use Cms\Classes\CmsCompoundObject;
use Cms\Classes\CmsObject;
use Cms\Classes\Theme;

class TestCmsCompoundObject extends CmsCompoundObject
{
    protected function parseSettings() {}

    public static function getObjectTypeDirName()
    {
        return 'testobjects';
    }
}

class TestTemporaryCmsCompoundObject extends CmsCompoundObject
{
    protected function parseSettings() {}

    public static function getObjectTypeDirName()
    {
        return 'temporary';
    }
}

class CmsCompoundObjectTest extends TestCase 
{
    public function testLoadFile()
    {
        $theme = new Theme();
        $theme->load('test');

        $obj = TestCmsCompoundObject::load($theme, 'compound.htm');
        $this->assertContains("\$controller->data['something'] = 'some value'", $obj->code);
        $this->assertEquals('<p>This is a paragraph</p>', $obj->markup);
        $this->assertInternalType('array', $obj->settings);
        $this->assertArrayHasKey('var', $obj->settings);
        $this->assertEquals('value', $obj->settings['var']);
        $this->assertArrayHasKey('section', $obj->settings);
        $this->assertInternalType('array', $obj->settings['section']);
        $this->assertArrayHasKey('version', $obj->settings['section']);
        $this->assertEquals(10, $obj->settings['section']['version']);

        $this->assertEquals('value', $obj->var);
        $this->assertInternalType('array', $obj->section);
        $this->assertArrayHasKey('version', $obj->section);
        $this->assertEquals(10, $obj->section['version']);
    }

    public function testParseComponentSettings()
    {
        $theme = new Theme();
        $theme->load('test');

        $obj = TestCmsCompoundObject::load($theme, 'component.htm');
        $this->assertArrayHasKey('components', $obj->settings);
        $this->assertInternalType('array', $obj->settings['components']);
        $this->assertArrayHasKey('testArchive', $obj->settings['components']);
        $this->assertArrayHasKey('posts-per-page', $obj->settings['components']['testArchive']);
        $this->assertEquals(10, $obj->settings['components']['testArchive']['posts-per-page']);
    }

    public function testCache()
    {
        $theme = new Theme();
        $theme->load('test');
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
        $this->assertArrayHasKey('section', $obj->settings);
        $this->assertInternalType('array', $obj->settings['section']);
        $this->assertArrayHasKey('version', $obj->settings['section']);
        $this->assertEquals(10, $obj->settings['section']['version']);

        $this->assertEquals('value', $obj->var);
        $this->assertInternalType('array', $obj->section);
        $this->assertArrayHasKey('version', $obj->section);
        $this->assertEquals(10, $obj->section['version']);

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
        $this->assertArrayHasKey('section', $obj->settings);
        $this->assertInternalType('array', $obj->settings['section']);
        $this->assertArrayHasKey('version', $obj->settings['section']);
        $this->assertEquals(10, $obj->settings['section']['version']);

        $this->assertEquals('value', $obj->var);
        $this->assertInternalType('array', $obj->section);
        $this->assertArrayHasKey('version', $obj->section);
        $this->assertEquals(10, $obj->section['version']);
    }

    public function testUndefinedProperty()
    {
        $theme = new Theme();
        $theme->load('test');

        $obj = new TestCmsCompoundObject($theme);
        $this->assertNull($obj->something);
    }

    public function testSaveMarkup()
    {
        $theme = new Theme();
        $theme->load('apitest');

        $destFilePath = $theme->getPath().'/testobjects/compound-markup.htm';
        if (file_exists($destFilePath))
            unlink($destFilePath);

        $this->assertFileNotExists($destFilePath);

        $obj = new TestCmsCompoundObject($theme);
        $obj->fill([
            'markup' => '<p>Hello, world!</p>',
            'fileName'=>'compound-markup'
        ]);
        $obj->save();

        $referenceFilePath = base_path().'/tests/fixtures/cms/reference/compound-markup.htm';
        $this->assertFileExists($referenceFilePath);

        $this->assertFileExists($destFilePath);
        $this->assertFileEquals($referenceFilePath, $destFilePath);
    }

    public function testSaveMarkupAndSettings()
    {
        $theme = new Theme();
        $theme->load('apitest');

        $destFilePath = $theme->getPath().'/testobjects/compound-markup-settings.htm';
        if (file_exists($destFilePath))
            unlink($destFilePath);

        $this->assertFileNotExists($destFilePath);

        $obj = new TestCmsCompoundObject($theme);
        $obj->fill([
            'settings'=>['var'=>'value'],
            'markup' => '<p>Hello, world!</p>',
            'fileName'=>'compound-markup-settings'
        ]);
        $obj->save();

        $referenceFilePath = base_path().'/tests/fixtures/cms/reference/compound-markup-settings.htm';
        $this->assertFileExists($referenceFilePath);

        $this->assertFileExists($destFilePath);
        $this->assertFileEquals($referenceFilePath, $destFilePath);
    }

    public function testSaveFull()
    {
        $theme = new Theme();
        $theme->load('apitest');

        $destFilePath = $theme->getPath().'/testobjects/compound.htm';
        if (file_exists($destFilePath))
            unlink($destFilePath);

        $this->assertFileNotExists($destFilePath);

        $obj = new TestCmsCompoundObject($theme);
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
        $this->assertFileEquals($referenceFilePath, $destFilePath);
    }
}