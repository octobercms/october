<?php

use Cms\Classes\Theme;
use Cms\Classes\Content;
use Cms\Classes\Controller;
use Cms\Classes\PageManager;

class ContentProcessingTest extends TestCase
{
    public function setUp(): void
    {
        parent::setUp();

        Config::set('cms.active_theme', 'test');
        Event::forget('cms.theme.getActiveTheme');
        Theme::resetCache();
    }

    public function testParsedMarkupResolvesLinksInHtmContent()
    {
        $theme = Theme::load('test');
        $content = Content::load($theme, 'link-test.htm');

        $result = $content->parsedMarkup;

        $this->assertStringNotContainsString('october://cms-page@link/index', $result);
        $this->assertStringContainsString('href="' . url('/') . '"', $result);

        // Unresolvable links are left untouched
        $this->assertStringContainsString('october://cms-page@link/missing-page', $result);
    }

    public function testLinksResolveOnAccessNotWhenCaching()
    {
        $theme = Theme::load('test');
        $resolved = 0;

        Event::listen('cms.pageLookup.resolveItem', function () use (&$resolved) {
            $resolved++;
        });

        // Loading and caching the file must not resolve links, their URLs depend on the request
        $content = Content::loadCached($theme, 'link-test.htm');

        $this->assertEquals(0, $resolved);
        $this->assertStringContainsString('october://cms-page@link/index', $content->getAttributes()['parsedMarkup']);

        // Links resolve once per instance when the parsed markup is read
        $content->parsedMarkup;
        $content->parsedMarkup;

        $this->assertEquals(2, $resolved);
        $this->assertStringContainsString('href="' . url('/') . '"', $content->parsedMarkup);
    }

    public function testLinkResolutionDoesNotRecurseWhenItLoadsContent()
    {
        $theme = Theme::load('test');
        $depth = $maxDepth = 0;

        // Simulates a lookup type that lists content files to resolve, like static pages building a menu
        Event::listen('cms.pageLookup.resolveItem', function () use ($theme, &$depth, &$maxDepth) {
            $maxDepth = max($maxDepth, ++$depth);

            if ($depth < 3) {
                Content::listInTheme($theme);
            }

            $depth--;
        });

        $content = Content::loadCached($theme, 'link-test.htm');

        $this->assertStringContainsString('href="' . url('/') . '"', $content->parsedMarkup);
        $this->assertEquals(1, $maxDepth);
    }

    public function testParsedMarkupResolvesLinksInHtmlContent()
    {
        $theme = Theme::load('test');
        $content = Content::load($theme, 'link-test.htm');

        // The same processing applies to both extensions
        $this->assertTrue($content->isMarkupProcessable());

        $html = Content::inTheme($theme);
        $html->fileName = 'anything.html';
        $this->assertTrue($html->isMarkupProcessable());

        $text = Content::inTheme($theme);
        $text->fileName = 'anything.txt';
        $this->assertFalse($text->isMarkupProcessable());
    }

    public function testParsedMarkupLeavesSnippetsUntouchedOutsideThePageLifecycle()
    {
        $theme = Theme::load('test');
        $content = Content::load($theme, 'snippet-test.htm');

        // No active page: parsing must not fail and must not consume the snippet
        $result = $content->parsedMarkup;

        $this->assertStringContainsString('data-snippet="testSnippet"', $result);
        $this->assertStringNotContainsString('october://cms-page@link/index', $result);
    }

    public function testProcessSnippetsIsSafeWithoutAPageContext()
    {
        $markup = '<figure data-snippet="testSnippet" data-component="Some\Component">Snippet</figure>';

        // A controller with no active page leaves the declaration untouched
        new Controller(Theme::load('test'));
        $this->assertEquals($markup, PageManager::processSnippets($markup));
    }

    public function testRenderContentSkipsSnippetsWithoutAPage()
    {
        $controller = new Controller(Theme::load('test'));

        $result = $controller->renderContent('snippet-test.htm');

        $this->assertStringContainsString('data-snippet="testSnippet"', $result);
        $this->assertStringContainsString('href="' . url('/') . '"', $result);
    }
}
