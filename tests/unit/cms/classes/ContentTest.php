<?php

use Cms\Classes\Theme;
use Cms\Classes\Content;

class ContentTest extends TestCase
{

    public function testMarkdownContent()
    {
        $theme = Theme::load('test');
        $content = Content::load($theme, 'markdown-content.md');

        $this->assertEquals('Be brave, be **bold**, live *italic*', $content->markup);
        $this->assertEquals('<p>Be brave, be <strong>bold</strong>, live <em>italic</em></p>', $content->parsedMarkup);
    }

    public function testTextContent()
    {
        $theme = Theme::load('test');
        $content = Content::load($theme, 'text-content.txt');

        $this->assertEquals('Pen is <mightier> than the sword, HTML is <richer> than the text', $content->markup);
        $this->assertEquals('Pen is &lt;mightier&gt; than the sword, HTML is &lt;richer&gt; than the text', $content->parsedMarkup);
    }

    public function testHtmlContent()
    {
        $theme = Theme::load('test');
        $content = Content::load($theme, 'html-content.htm');

        $this->assertEquals('<a href="#">Stephen Saucier</a> changed his profile picture &mdash; <small>7 hrs ago</small></div>', $content->markup);
        $this->assertEquals('<a href="#">Stephen Saucier</a> changed his profile picture &mdash; <small>7 hrs ago</small></div>', $content->parsedMarkup);
    }
}
