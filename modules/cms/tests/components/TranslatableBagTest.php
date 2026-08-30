<?php

use Cms\Components\TranslatableBag;
use System\Models\SiteDefinition;
use System\Classes\SiteCollection;

class TranslatableBagTest extends TestCase
{
    public function testPropertyBracketSyntax()
    {
        $component = new TranslatableBag(null, [
            'locales' => [
                'fr' => ['url' => '/home-fr', 'title' => 'Home FR'],
                'ru' => ['url' => '/home-ru']
            ]
        ]);

        $this->assertEquals('/home-fr', $component->property('locales[fr][url]'));
        $this->assertEquals('/home-ru', $component->property('locales.ru.url'));
        $this->assertEquals('Home FR', $component->property('locales[fr][title]'));
        $this->assertNull($component->property('locales[de][url]'));
        $this->assertEquals(['url' => '/home-fr', 'title' => 'Home FR'], $component->property('locales[fr]'));
    }

    public function testSitePropertyMatchesLocale()
    {
        $component = new TranslatableBag(null, [
            'locales' => [
                'fr' => ['url' => '/home-fr']
            ]
        ]);

        $site = $this->makeSite(['code' => 'french', 'name' => 'French', 'locale' => 'fr']);

        $this->assertEquals('/home-fr', $component->siteProperty('url', $site));
        $this->assertNull($component->siteProperty('title', $site));
        $this->assertEquals('Home', $component->siteProperty('title', $site, 'Home'));
    }

    public function testSitePropertyFallsBackToLanguage()
    {
        $component = new TranslatableBag(null, [
            'locales' => [
                'en-AU' => ['url' => '/contact-au'],
                'en' => ['url' => '/contact-en', 'title' => 'Contact Us']
            ]
        ]);

        $site = $this->makeSite(['code' => 'australia', 'name' => 'Australia', 'locale' => 'en-AU']);

        $this->assertEquals('/contact-au', $component->siteProperty('url', $site));
        $this->assertEquals('Contact Us', $component->siteProperty('title', $site));

        $site = $this->makeSite(['code' => 'britain', 'name' => 'Britain', 'locale' => 'en-GB']);

        $this->assertEquals('/contact-en', $component->siteProperty('url', $site));
    }

    public function testSitePropertyUsesFallbackLocale()
    {
        $component = new TranslatableBag(null, [
            'locales' => [
                'en' => ['url' => '/contact-en']
            ]
        ]);

        $site = $this->makeSite([
            'code' => 'australia',
            'name' => 'Australia',
            'locale' => 'en-AU',
            'fallback_locale' => 'en'
        ]);

        $this->assertEquals('/contact-en', $component->siteProperty('url', $site));
    }

    public function testSitePropertiesMergesKeyChain()
    {
        $component = new TranslatableBag(null, [
            'locales' => [
                'en-AU' => ['url' => '/contact-au'],
                'en' => ['url' => '/contact-en', 'title' => 'Contact Us']
            ]
        ]);

        $site = $this->makeSite(['code' => 'australia', 'name' => 'Australia', 'locale' => 'en-AU']);

        $this->assertEquals([
            'url' => '/contact-au',
            'title' => 'Contact Us'
        ], $component->siteProperties($site));
    }

    public function testDefinePropertiesBuildsObjectList()
    {
        $this->swapSiteManager(true, new SiteCollection([
            $this->makeSite(['code' => 'english', 'name' => 'English', 'locale' => 'en']),
            $this->makeSite(['code' => 'french', 'name' => 'French', 'locale' => 'fr'])
        ]));

        $component = new TranslatableBag(null, []);
        $properties = $component->defineProperties();

        $this->assertArrayHasKey('locales', $properties);
        $this->assertEquals('objectList', $properties['locales']['type']);
        $this->assertEquals('locale', $properties['locales']['keyProperty']);
        $this->assertEquals('locale', $properties['locales']['titleProperty']);

        $itemNames = array_column($properties['locales']['itemProperties'], 'property');
        $this->assertEquals(['locale', 'url', 'title', 'description', 'meta_title', 'meta_description'], $itemNames);

        $localeProperty = $properties['locales']['itemProperties'][0];
        $this->assertStringContainsString('en, fr', $localeProperty['description']);
    }

    public function testDefinePropertiesListsSharedLocalesOnce()
    {
        $this->swapSiteManager(true, new SiteCollection([
            $this->makeSite(['code' => 'en-au', 'name' => 'Australia', 'locale' => 'en']),
            $this->makeSite(['code' => 'en-gb', 'name' => 'Britain', 'locale' => 'en'])
        ]));

        $component = new TranslatableBag(null, []);
        $properties = $component->defineProperties();

        $localeProperty = $properties['locales']['itemProperties'][0];
        $this->assertStringContainsString('Available: en', $localeProperty['description']);
        $this->assertStringNotContainsString('en, en', $localeProperty['description']);
    }

    public function testDefinePropertiesPreservesManualProperties()
    {
        $this->swapSiteManager(false, new SiteCollection);

        $component = new TranslatableBag(null, [
            'locales' => [
                'fr' => ['url' => '/home-fr']
            ],
            'fr' => ['meta_title' => 'Meta FR'],
            'custom' => 'value'
        ]);

        $properties = $component->defineProperties();

        $this->assertArrayHasKey('locales', $properties);
        $this->assertArrayHasKey('fr[meta_title]', $properties);
        $this->assertArrayHasKey('custom', $properties);
    }

    /**
     * swapSiteManager replaces the site manager facade with a stub.
     */
    protected function swapSiteManager(bool $hasMultiSite, SiteCollection $sites): void
    {
        Site::swap(new class($hasMultiSite, $sites) {
            public function __construct(public bool $hasMultiSite, public SiteCollection $sites)
            {
            }

            public function hasMultiSite(): bool
            {
                return $this->hasMultiSite;
            }

            public function listEnabled(): SiteCollection
            {
                return $this->sites;
            }
        });
    }

    /**
     * makeSite builds an unsaved site definition from attributes.
     */
    protected function makeSite(array $attributes): SiteDefinition
    {
        $site = new SiteDefinition;
        $site->attributes = $attributes;
        $site->syncOriginal();

        return $site;
    }
}
