<?php

use Cache;
use Cms\Classes\Theme;
use Cms\Models\ThemeData;
use Illuminate\Support\Facades\Schema;
use October\Rain\Database\Schema\Blueprint;

class ThemeDataTest extends TestCase
{
    public function setUp(): void
    {
        parent::setUp();

        Config::set('cms.active_theme', 'test');
        Config::set('cms.enable_data_cache', false);
        Event::forget('cms.theme.getActiveTheme');
        Theme::resetCache();

        $this->resetThemeDataInstances();
        $this->createThemeDataTable();
    }

    public function tearDown(): void
    {
        $this->resetThemeDataInstances();
        Schema::dropIfExists('cms_theme_data');

        parent::tearDown();
    }

    /**
     * testAutoJsonable
     */
    public function testAutoJsonable()
    {
        $theme = Theme::load('test')->getCustomData();

        $this->assertTrue($theme->isJsonable('nestedform'));
        $this->assertTrue($theme->isJsonable('breakdown'));
        $this->assertTrue($theme->isJsonable('nested'));
    }

    public function testForThemeDoesNotCacheWhenDisabled()
    {
        Config::set('cms.enable_data_cache', false);

        ThemeData::forTheme(Theme::load('test'));

        $this->assertNull(Cache::get(ThemeData::getCacheKey('test')));
    }

    public function testForThemeStoresRowAttributesWhenEnabled()
    {
        Config::set('cms.enable_data_cache', true);

        $themeData = ThemeData::forTheme(Theme::load('test'));
        $cached = Cache::get(ThemeData::getCacheKey('test'));

        $this->assertIsArray($cached);
        $this->assertSame($themeData->id, $cached['id']);
        $this->assertSame('test', $cached['theme']);
        $this->assertIsArray($cached['data']);
        $this->assertArrayHasKey('created_at', $cached);
        $this->assertArrayHasKey('updated_at', $cached);
    }

    public function testForThemeRehydratesFromCache()
    {
        Config::set('cms.enable_data_cache', true);

        $theme = Theme::load('test');
        $themeData = ThemeData::forTheme($theme);
        $themeData->position = 'top';
        $themeData->save();

        $this->resetThemeDataInstances();
        $warmed = ThemeData::forTheme($theme);
        $this->assertEquals('top', $warmed->position);
        $this->assertTrue($warmed->isJsonable('nestedform'));

        ThemeData::where('theme', 'test')->update([
            'data' => json_encode(['position' => 'left'])
        ]);

        $this->resetThemeDataInstances();
        $fromCache = ThemeData::forTheme($theme);

        $this->assertEquals('top', $fromCache->position);
        $this->assertTrue($fromCache->exists);
        $this->assertEquals($warmed->id, $fromCache->id);
    }

    public function testSaveBustsThemeDataCache()
    {
        Config::set('cms.enable_data_cache', true);

        $theme = Theme::load('test');
        $themeData = ThemeData::forTheme($theme);
        $themeData->position = 'top';
        $themeData->save();

        $this->resetThemeDataInstances();
        ThemeData::forTheme($theme);
        $this->assertNotNull(Cache::get(ThemeData::getCacheKey('test')));

        $themeData->position = 'left';
        $themeData->save();

        $this->assertNull(Cache::get(ThemeData::getCacheKey('test')));

        $this->resetThemeDataInstances();
        $reloaded = ThemeData::forTheme($theme);
        $this->assertEquals('left', $reloaded->position);
    }

    public function testDeleteBustsThemeDataCache()
    {
        Config::set('cms.enable_data_cache', true);

        $theme = Theme::load('test');
        $themeData = ThemeData::forTheme($theme);
        $themeData->position = 'top';
        $themeData->save();

        $this->resetThemeDataInstances();
        ThemeData::forTheme($theme);
        $this->assertNotNull(Cache::get(ThemeData::getCacheKey('test')));

        $themeData->delete();

        $this->assertNull(Cache::get(ThemeData::getCacheKey('test')));
    }

    public function testLegacyCachedModelIsIgnored()
    {
        Config::set('cms.enable_data_cache', true);

        $theme = Theme::load('test');
        $themeData = ThemeData::forTheme($theme);
        $themeData->position = 'top';
        $themeData->save();

        $this->resetThemeDataInstances();
        Cache::put(ThemeData::getCacheKey('test'), $themeData, now()->addMinutes(1440));

        $fromDatabase = ThemeData::forTheme($theme);

        $this->assertInstanceOf(ThemeData::class, $fromDatabase);
        $this->assertEquals('top', $fromDatabase->position);
        $this->assertIsArray(Cache::get(ThemeData::getCacheKey('test')));
    }

    protected function resetThemeDataInstances(): void
    {
        self::setProtectedProperty(new ThemeData, 'instances', []);
    }

    protected function createThemeDataTable(): void
    {
        Schema::dropIfExists('cms_theme_data');

        Schema::create('cms_theme_data', function (Blueprint $table) {
            $table->increments('id');
            $table->string('theme')->nullable()->index();
            $table->mediumText('data')->nullable();
            $table->timestamps();
        });
    }
}
