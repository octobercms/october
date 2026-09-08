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
