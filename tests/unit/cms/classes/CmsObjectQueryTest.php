<?php

use Cms\Classes\Page;
use Cms\Classes\Layout;

class CmsObjectQueryTest extends TestCase
{
    public function testWhere()
    {
        $page = Page::where('layout', 'caramba')->first();
        $this->assertEquals('/no-layout', $page->url);
    }

    public function testWhereComponent()
    {
        $pages = Page::whereComponent('testArchive', 'posts-per-page', '6');
        $this->assertCount(1, $pages->all());

        $page = $pages->first();
        $this->assertEquals('/with-components', $page->url);
    }

    public function testWithComponent()
    {
        $pages = Page::withComponent('testArchive')->all();
        $this->assertCount(2, $pages);
        foreach ($pages as $page) {
            $this->assertTrue(!!$page->hasComponent('testArchive'));
        }
    }

    public function testWithComponentCallback()
    {
        include_once base_path() . '/tests/fixtures/plugins/october/tester/components/Archive.php';

        $pages = Page::withComponent('testArchive', function($component) {
            return $component->property('posts-per-page') == '69';
        })->all();

        $this->assertCount(1, $pages);
    }

    public function testLists()
    {
        // Default theme: test
        $pages = Page::lists('baseFileName');
        sort($pages);

        $this->assertEquals([
            "404",
            "a/a-page",
            "ajax-test",
            "authors",
            "b/b-page",
            "blog-archive",
            "blog-post",
            "code-namespaces",
            "component-custom-render",
            "component-partial",
            "component-partial-nesting",
            "component-partial-override",
            "cycle-test",
            "index",
            "no-component",
            "no-component-class",
            "no-layout",
            "no-partial",
            "optional-full-php-tags",
            "optional-short-php-tags",
            "throw-php",
            "with-component",
            "with-components",
            "with-content",
            "with-layout",
            "with-partials",
            "with-placeholder",
        ], $pages);

        $layouts = Layout::lists('baseFileName');
        sort($layouts);

        $this->assertEquals([
            "a/a-layout",
            "ajax-test",
            "content",
            "cycle-test",
            "no-php",
            "partials",
            "php-parser-test",
            "placeholder",
            "sidebar",
        ], $layouts);

        $pages = Page::inTheme('NON_EXISTENT_THEME')->lists('baseFileName');
        $this->assertEmpty($pages);
    }
}
