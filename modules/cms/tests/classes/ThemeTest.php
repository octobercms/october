<?php

use Cms\Classes\Theme;

class ThemeTest extends TestCase
{
    public function setUp(): void
    {
        parent::setUp();

        Config::set('cms.active_theme', 'test');
        Event::forget('cms.theme.getActiveTheme');
        Theme::resetCache();
    }

    protected function countThemePages($path)
    {
        $result = 0;
        $it = new RecursiveIteratorIterator(new RecursiveDirectoryIterator($path));
        $it->setMaxDepth(5);
        $it->rewind();

        while ($it->valid()) {
            if (!$it->isDot() && !$it->isDir() && $it->getExtension() == 'htm') {
                $result++;
            }

            $it->next();
        }

        return $result;
    }

    public function testGetPath()
    {
        $theme = Theme::load('test');

        $this->assertEquals(base_path('modules/cms/tests/fixtures/themes/test'), $theme->getPath());
    }

    public function testHasSeedContentFromParentTheme()
    {
        $parentTheme = Theme::load('parenttest');
        $this->assertTrue($parentTheme->hasSeedContent());

        $childTheme = Theme::load('childtest');
        $this->assertTrue($childTheme->hasSeedContent());

        $theme = Theme::load('test');
        $this->assertFalse($theme->hasSeedContent());
    }

    public function testListPages()
    {
        $theme = Theme::load('test');

        $pageCollection = $theme->listPages();
        $pages = array_values($pageCollection->all());
        $this->assertIsArray($pages);

        $expectedPageNum = $this->countThemePages(base_path().'/modules/cms/tests/fixtures/themes/test/pages');
        $this->assertCount($expectedPageNum, $pages);

        $this->assertInstanceOf(\Cms\Classes\Page::class, $pages[0]);
        $this->assertNotEmpty($pages[0]->url);
        $this->assertInstanceOf(\Cms\Classes\Page::class, $pages[1]);
        $this->assertNotEmpty($pages[1]->url);
    }

    public function testGetActiveTheme()
    {
        $activeTheme = Theme::getActiveTheme();

        $this->assertNotNull($activeTheme);
        $this->assertEquals('test', $activeTheme->getDirName());
    }

    public function testNoActiveTheme()
    {
        $this->expectException(\October\Rain\Exception\SystemException::class);
        $this->expectExceptionMessage('The active theme is not set.');

        Config::set('cms.active_theme', null);
        Theme::getActiveTheme();
    }

    public function testApiTheme()
    {
        Event::forget('cms.theme.getActiveTheme');
        Event::listen('cms.theme.getActiveTheme', function () {
            return 'apitest';
        });

        $activeTheme = Theme::getActiveTheme();
        $this->assertNotNull($activeTheme);
        $this->assertEquals('apitest', $activeTheme->getDirName());
    }
}
