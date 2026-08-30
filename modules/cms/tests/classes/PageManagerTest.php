<?php

use Cms\Classes\Theme;
use Cms\Classes\PageManager;

/**
 * PageManagerTest covers snippet extraction from static page markup.
 *
 * Markup that successfully extracts a snippet falls through to a snippet manager
 * lookup requiring the theme template database layer, so this suite covers the
 * rejection cases, which are the security-relevant part of the regex change.
 */
class PageManagerTest extends TestCase
{
    /**
     * extractSnippets invokes the protected extractSnippetsFromMarkup method.
     */
    protected function extractSnippets(string $markup): array
    {
        $theme = Theme::load('test');

        $method = new ReflectionMethod(PageManager::class, 'extractSnippetsFromMarkup');

        return $method->invoke(null, $markup, $theme);
    }

    public function testIgnoresSpanWithoutSnippetAttribute()
    {
        $markup = '<span class="regular">Just some inline text</span>';

        $this->assertCount(0, $this->extractSnippets($markup));
    }

    public function testDoesNotMatchMismatchedTags()
    {
        // The backreference requires the closing tag to match the opening tag,
        // so a figure opener with a span closer must not be extracted.
        $markup = '<figure data-snippet="mismatched">&nbsp;</span>';

        $this->assertCount(0, $this->extractSnippets($markup));
    }

    public function testIgnoresPlainMarkupWithoutSnippets()
    {
        $markup = '<p>Some content</p><span>inline</span><figure>block</figure>';

        $this->assertCount(0, $this->extractSnippets($markup));
    }
}
