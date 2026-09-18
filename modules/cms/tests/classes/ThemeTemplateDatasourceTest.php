<?php

use Cms\Classes\Theme;
use Cms\Classes\ThemeManager;
use Cms\Classes\ThemeTemplateDatasource;
use October\Rain\Database\Schema\Blueprint;
use October\Rain\Halcyon\Datasource\DbDatasource;

class ThemeTemplateDatasourceTest extends TestCase
{
    public function setUp(): void
    {
        parent::setUp();

        Config::set('cms.database_templates', false);
        ThemeTemplateDatasource::clearCache('test');
        $this->createTemplatesTable();
    }

    public function tearDown(): void
    {
        ThemeTemplateDatasource::clearCache('test');
        Schema::dropIfExists('cms_theme_templates');
        Config::set('cms.database_templates', false);

        parent::tearDown();
    }

    public function testThemeRegistersCachedDatasource()
    {
        Config::set('cms.database_templates', true);
        $this->forgetRegisteredDatasource('test');

        try {
            $theme = Theme::load('test');
            $primary = $this->getProtectedProperty($theme->getDatasource(), 'primaryDatasource');

            $this->assertInstanceOf(ThemeTemplateDatasource::class, $primary);
        }
        finally {
            $this->forgetRegisteredDatasource('test');
            Config::set('cms.database_templates', false);
        }
    }

    public function testIndexesAreReusedBetweenRequests()
    {
        $datasource = $this->makeDatasource();
        $datasource->insert('pages', 'index', 'htm', 'url = "/"');
        $datasource->tombstone('pages', 'hidden', 'htm');

        $mtime = $datasource->lastModified('pages', 'index', 'htm');
        $this->assertNotNull($mtime);
        $this->assertTrue($datasource->isTemplateTrashed('pages', 'hidden', 'htm'));
        $this->assertTrue(Cache::has(ThemeTemplateDatasource::cacheKey('test')));

        $this->resetRequestCache();

        Db::flushQueryLog();
        Db::enableQueryLog();

        $this->assertSame($mtime, $datasource->lastModified('pages', 'index', 'htm'));
        $this->assertNull($datasource->lastModified('pages', 'hidden', 'htm'));
        $this->assertTrue($datasource->isTemplateTrashed('pages', 'hidden', 'htm'));
        $this->assertFalse($datasource->isTemplateTrashed('pages', 'index', 'htm'));
        $this->assertCount(0, $this->templateQueries());
    }

    public function testWritesBustIndexCache()
    {
        $datasource = $this->makeDatasource();
        $datasource->lastModified('pages', 'index', 'htm');
        $datasource->isTemplateTrashed('pages', 'index', 'htm');

        $cacheKey = ThemeTemplateDatasource::cacheKey('test');
        $this->assertTrue(Cache::has($cacheKey));

        $datasource->insert('pages', 'extra', 'htm', 'url = "/extra"');

        $this->assertFalse(Cache::has($cacheKey));

        Db::flushQueryLog();
        Db::enableQueryLog();
        $this->assertNotNull($datasource->lastModified('pages', 'extra', 'htm'));
        $this->assertNotCount(0, $this->templateQueries());
    }

    public function testPurgeBustsIndexCache()
    {
        $datasource = $this->makeDatasource();
        $datasource->insert('pages', 'index', 'htm', 'url = "/"');
        $datasource->lastModified('pages', 'index', 'htm');
        $datasource->isTemplateTrashed('pages', 'index', 'htm');

        ThemeManager::instance()->purgeDatabaseTemplates('test');

        $this->assertFalse(Cache::has(ThemeTemplateDatasource::cacheKey('test')));
    }

    protected function makeDatasource(): ThemeTemplateDatasource
    {
        return new ThemeTemplateDatasource('test', 'cms_theme_templates');
    }

    protected function templateQueries(): array
    {
        return array_values(array_filter(Db::getQueryLog(), function ($query) {
            return str_contains($query['query'], 'cms_theme_templates');
        }));
    }

    /**
     * resetRequestCache drops process memory and the request memo map, leaving
     * the persistent store in place.
     */
    protected function resetRequestCache(): void
    {
        foreach (['pathCache', 'mtimeCache', 'trashedPathCache'] as $propertyName) {
            $property = new ReflectionProperty(DbDatasource::class, $propertyName);
            $property->setValue(null, []);
        }

        $store = Cache::memo()->getStore();
        $property = new ReflectionProperty($store, 'cache');
        $property->setValue($store, []);
    }

    protected function forgetRegisteredDatasource(string $name): void
    {
        $resolver = App::make('halcyon');
        $property = new ReflectionProperty($resolver, 'datasources');
        $datasources = $property->getValue($resolver);
        unset($datasources[$name]);
        $property->setValue($resolver, $datasources);
    }

    protected function createTemplatesTable(): void
    {
        Schema::dropIfExists('cms_theme_templates');

        Schema::create('cms_theme_templates', function (Blueprint $table) {
            $table->increments('id');
            $table->string('source')->index();
            $table->string('path')->index();
            $table->longText('content');
            $table->integer('file_size')->unsigned();
            $table->dateTime('updated_at')->nullable();
            $table->dateTime('deleted_at')->nullable();
        });
    }
}
