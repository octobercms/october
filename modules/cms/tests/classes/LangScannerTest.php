<?php

use Cms\Classes\Theme;
use Cms\Classes\LangScanner;

class LangScannerTest extends TestCase
{
    public function setUp(): void
    {
        parent::setUp();

        Theme::resetCache();
    }

    public function testScanFindsMessagesAcrossThemeTemplates()
    {
        $messages = LangScanner::scan(Theme::load('langscannertest'));

        $this->assertEquals([
            'Apple|Apples',
            'Confirm Action',
            'Contact Us',
            'Copyright Notice',
            'Read More',
            'Site Title',
            'Styled Message',
            'Welcome Message',
            'You have :count items',
        ], $messages);
    }

    public function testParseContentExtractsFilterUsage()
    {
        $scanner = new LangScanner(Theme::load('test'));

        $this->assertEquals(['Hello'], $scanner->parseContent("{{ 'Hello'|_ }}"));
        $this->assertEquals(['Hello'], $scanner->parseContent('{{ "Hello"|_ }}'));
        $this->assertEquals(['Hello'], $scanner->parseContent("{{ 'Hello'|__ }}"));
        $this->assertEquals(['Hello'], $scanner->parseContent("{{ 'Hello'|trans }}"));
        $this->assertEquals(['Apple|Apples'], $scanner->parseContent("{{ 'Apple|Apples'|trans_choice(2) }}"));
        $this->assertEquals(['Hi :name'], $scanner->parseContent("{{ 'Hi :name'|_({name: user.name}) }}"));
        $this->assertEquals(['Hello'], $scanner->parseContent("{{ 'Hello'|_|upper }}"));
        $this->assertEquals(['Hello'], $scanner->parseContent("{% set greeting = 'Hello'|trans %}"));
    }

    public function testParseContentExtractsFunctionUsage()
    {
        $scanner = new LangScanner(Theme::load('test'));

        $this->assertEquals(['Hello'], $scanner->parseContent("{{ __('Hello') }}"));
        $this->assertEquals(['Hello'], $scanner->parseContent("{{ trans('Hello') }}"));
        $this->assertEquals(['Apple|Apples'], $scanner->parseContent("{{ trans_choice('Apple|Apples', 2) }}"));
        $this->assertEquals(['Hello'], $scanner->parseContent('{% set greeting = __("Hello") %}'));
    }

    public function testParseContentIgnoresNonTranslationUsage()
    {
        $scanner = new LangScanner(Theme::load('test'));

        // Non-translation filters and functions
        $this->assertEquals([], $scanner->parseContent("{{ helper('Decoy')|raw }}"));
        $this->assertEquals([], $scanner->parseContent("{{ ['A', 'B']|join(', ') }}"));
        $this->assertEquals([], $scanner->parseContent("{{ 'Decoy'|transRaw }}"));
        $this->assertEquals([], $scanner->parseContent("{{ myTrans('Decoy') }}"));

        // Variables are not string literals
        $this->assertEquals([], $scanner->parseContent('{{ someVar|_ }}'));

        // Calls outside Twig expressions
        $this->assertEquals([], $scanner->parseContent("<script>i18n.__('Decoy');</script>"));

        // Empty content
        $this->assertEquals([], $scanner->parseContent(null));
        $this->assertEquals([], $scanner->parseContent(''));
    }
}
