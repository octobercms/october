<?php

use Cms\Classes\Theme;
use Cms\Classes\Content;
use Cms\Classes\Controller;
use System\Classes\SiteCollection;
use System\Models\SiteDefinition;

class ContentTranslatableTest extends TestCase
{
    protected static $theme = null;

    public function setUp(): void
    {
        parent::setUp();

        self::$theme = Theme::load('translatabletest');
    }

    public function testFindLocalizedResolvesLocaleDirectory()
    {
        $this->applyActiveSite('fr');

        $content = Content::findLocalized(self::$theme, 'welcome.htm');
        $this->assertNotNull($content);
        $this->assertEquals('fr/welcome.htm', $content->getFileName());
        $this->assertStringContainsString('Bienvenue', $content->markup);
    }

    public function testFindLocalizedFallsBackToBaseFile()
    {
        $this->applyActiveSite('fr');

        $content = Content::findLocalized(self::$theme, 'about.htm');
        $this->assertNotNull($content);
        $this->assertEquals('about.htm', $content->getFileName());
        $this->assertStringContainsString('About Us', $content->markup);
    }

    public function testFindLocalizedResolvesNestedPath()
    {
        $this->applyActiveSite('fr');

        $content = Content::findLocalized(self::$theme, 'blog/intro.htm');
        $this->assertNotNull($content);
        $this->assertEquals('fr/blog/intro.htm', $content->getFileName());
        $this->assertStringContainsString('Intro du blogue', $content->markup);
    }

    public function testFindLocalizedDegradesRegionalLocale()
    {
        $this->applyActiveSite('fr-CA');

        $content = Content::findLocalized(self::$theme, 'welcome.htm');
        $this->assertNotNull($content);
        $this->assertEquals('fr/welcome.htm', $content->getFileName());
    }

    public function testFindLocalizedAcceptsLocaleString()
    {
        $this->applyActiveSite('en');

        $content = Content::findLocalized(self::$theme, 'welcome.htm', 'fr');
        $this->assertNotNull($content);
        $this->assertEquals('fr/welcome.htm', $content->getFileName());
    }

    public function testFindLocalizedIgnoresUnmatchedLocale()
    {
        $this->applyActiveSite('en');

        $content = Content::findLocalized(self::$theme, 'welcome.htm');
        $this->assertNotNull($content);
        $this->assertEquals('welcome.htm', $content->getFileName());
        $this->assertStringContainsString('Welcome', $content->markup);
    }

    public function testLocaleDirectoryRemainsAddressable()
    {
        $this->applyActiveSite('en');

        $content = Content::findLocalized(self::$theme, 'fr/welcome.htm');
        $this->assertNotNull($content);
        $this->assertEquals('fr/welcome.htm', $content->getFileName());
    }

    public function testRenderContentUsesLocalizedFile()
    {
        $this->applyActiveSite('fr');

        $controller = new Controller(self::$theme);
        $this->assertStringContainsString('Bienvenue', $controller->renderContent('welcome.htm'));

        $this->applyActiveSite('en');

        $controller = new Controller(self::$theme);
        $this->assertStringContainsString('Welcome', $controller->renderContent('welcome.htm'));
    }

    public function testBeforeRenderContentEventTakesPrecedence()
    {
        $this->applyActiveSite('fr');

        Event::listen('cms.page.beforeRenderContent', function ($controller, $name) {
            return Content::loadCached(self::$theme, 'about.htm');
        });

        $controller = new Controller(self::$theme);
        $this->assertStringContainsString('About Us', $controller->renderContent('welcome.htm'));
    }

    /**
     * makeSite builds an unsaved site definition for a locale.
     */
    protected function makeSite(string $locale): SiteDefinition
    {
        $site = new SiteDefinition;
        $site->attributes = [
            'code' => 'test-'.strtolower($locale),
            'name' => 'Test Site',
            'locale' => $locale
        ];
        $site->syncOriginal();

        return $site;
    }

    /**
     * applyActiveSite swaps the site manager with a stub returning a site for the locale.
     */
    protected function applyActiveSite(string $locale): void
    {
        $site = $this->makeSite($locale);

        Site::swap(new class(App::make('system.sites'), $site, new SiteCollection([$site])) {
            public function __construct(public $manager, public $site, public $sites)
            {
            }

            public function getActiveSite()
            {
                return $this->site;
            }

            public function listEnabled()
            {
                return $this->sites;
            }

            public function __call($name, $params)
            {
                return $this->manager->$name(...$params);
            }
        });
    }
}
