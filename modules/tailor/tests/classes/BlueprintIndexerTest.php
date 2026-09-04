<?php

use Cms\Classes\Theme;
use Tailor\Classes\Blueprint;
use Tailor\Classes\BlueprintIndexer;

class BlueprintIndexerTest extends TestCase
{
    public function setUp(): void
    {
        parent::setUp();
        Blueprint::setDefaultDatasource(base_path('modules/tailor/tests/fixtures/blueprints'));

        // Neutralize any ambient .env value, these tests cover the filesystem pathway
        Config::set('cms.database_templates', false);
    }

    public function tearDown(): void
    {
        BlueprintIndexer::instance()->setThemeContext(null);
        Config::set('cms.active_theme', 'test');
        Theme::resetCache();
        Blueprint::resetDatasourceCache();

        parent::tearDown();
    }

    /**
     * testListingBlueprints
     */
    public function testListingBlueprints()
    {
        $this->markTestSkipped('Needs refactor to isolate blueprint paths');
        return;

        $sections = BlueprintIndexer::instance()->listSections();
        $this->assertCount(8, $sections);

        $mixins = BlueprintIndexer::instance()->listMixins();
        $this->assertCount(12, $mixins);

        $globals = BlueprintIndexer::instance()->listGlobals();
        $this->assertCount(1, $globals);
    }

    /**
     * testActiveThemeDatasourcesWithChildTheme checks a child theme inherits the parent theme datasource
     */
    public function testActiveThemeDatasourcesWithChildTheme()
    {
        Config::set('cms.active_theme', 'childtest');
        Theme::resetCache();

        $indexer = BlueprintIndexer::instance();

        $this->assertTrue(self::callProtectedMethod($indexer, 'isActiveThemeDatasource', [null]));
        $this->assertTrue(self::callProtectedMethod($indexer, 'isActiveThemeDatasource', ['childtest']));
        $this->assertTrue(self::callProtectedMethod($indexer, 'isActiveThemeDatasource', ['parenttest']));
        $this->assertFalse(self::callProtectedMethod($indexer, 'isActiveThemeDatasource', ['test']));
    }

    /**
     * testFindSectionByHandleWithChildTheme checks parent theme blueprints resolve for a child theme
     */
    public function testFindSectionByHandleWithChildTheme()
    {
        Config::set('cms.active_theme', 'childtest');
        Theme::resetCache();
        Blueprint::resetDatasourceCache();

        $blueprint = BlueprintIndexer::instance()->findSectionByHandle('Webinar');
        $this->assertNotNull($blueprint);
        $this->assertEquals('3328c303-6b62-4a2c-8a5b-84e69b56e708', $blueprint->uuid);

        // The same blueprint is filtered out when the active theme is unrelated
        Config::set('cms.active_theme', 'test');
        Theme::resetCache();
        Blueprint::resetDatasourceCache();

        $blueprint = BlueprintIndexer::instance()->findSectionByHandle('Webinar');
        $this->assertNull($blueprint);
    }

    /**
     * testThemeContextResolvesInactiveThemeBlueprint checks a theme context lets
     * an inactive theme's blueprint resolve, as needed when seeding that theme.
     */
    public function testThemeContextResolvesInactiveThemeBlueprint()
    {
        Config::set('cms.active_theme', 'test');
        Theme::resetCache();
        Blueprint::resetDatasourceCache();

        $indexer = BlueprintIndexer::instance();

        // Filtered out while the unrelated theme is active
        $this->assertNull($indexer->findSectionByHandle('Webinar'));
        $this->assertSame('', $indexer->hasSection('Webinar'));

        // The theme context makes the parent theme count as active
        $indexer->setThemeContext('parenttest');

        $blueprint = $indexer->findSectionByHandle('Webinar');
        $this->assertNotNull($blueprint);
        $this->assertEquals('3328c303-6b62-4a2c-8a5b-84e69b56e708', $blueprint->uuid);
        $this->assertSame('3328c303-6b62-4a2c-8a5b-84e69b56e708', $indexer->hasSection('Webinar'));

        // Clearing the context restores the active theme filtering
        $indexer->setThemeContext(null);
        $this->assertNull($indexer->findSectionByHandle('Webinar'));
    }
}
