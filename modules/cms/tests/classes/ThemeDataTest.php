<?php

use Cms\Classes\Theme;
use Cms\Models\ThemeData;
use October\Rain\Database\Schema\Blueprint;

class ThemeDataTest extends TestCase
{
    public function setUp(): void
    {
        parent::setUp();

        ThemeData::flushEventListeners();
        ThemeData::clearInternalCache();

        if (!Schema::hasTable('cms_theme_data')) {
            Schema::create('cms_theme_data', function (Blueprint $table) {
                $table->increments('id');
                $table->string('theme')->nullable()->index();
                $table->mediumText('data')->nullable();
                $table->timestamps();
            });
        }
    }

    public function tearDown(): void
    {
        ThemeData::whereIn('theme', ['test', 'formonlytest'])->delete();
        ThemeData::clearInternalCache();

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

    public function testForThemeDoesNotCreateRow()
    {
        $this->assertNull(ThemeData::where('theme', 'test')->first());

        $themeData = Theme::load('test')->getCustomData();

        $this->assertFalse($themeData->exists);
        $this->assertEquals('test', $themeData->theme);
        $this->assertNull(ThemeData::where('theme', 'test')->first());
    }

    public function testForThemeUsesYamlDefaultsWhenUnsaved()
    {
        $themeData = Theme::load('formonlytest')->getCustomData();

        $this->assertFalse($themeData->exists);
        $this->assertEquals('October', $themeData->site_name);
        $this->assertNull(ThemeData::where('theme', 'formonlytest')->first());
    }

    public function testForThemeReturnsSavedRow()
    {
        $saved = Theme::load('formonlytest')->getCustomData();
        $saved->site_name = 'Custom';
        $saved->save();

        $this->assertTrue($saved->exists);
        ThemeData::clearInternalCache();

        $themeData = Theme::load('formonlytest')->getCustomData();

        $this->assertTrue($themeData->exists);
        $this->assertEquals('Custom', $themeData->site_name);
    }

    public function testCombinerSkipsThemesWithoutAssetVariables()
    {
        Config::set('cms.active_theme', 'formonlytest');
        Event::forget('cms.theme.getActiveTheme');
        Theme::resetCache();

        $this->assertSame('', ThemeData::getCombinerCacheKey());
        ThemeData::applyAssetVariablesToCombinerFilters([]);

        $this->assertNull(ThemeData::where('theme', 'formonlytest')->first());
    }

    public function testCombinerCacheKeyUsesSavedUpdatedAt()
    {
        Config::set('cms.active_theme', 'test');
        Event::forget('cms.theme.getActiveTheme');
        Theme::resetCache();

        $this->assertSame('', ThemeData::getCombinerCacheKey());
        $this->assertNull(ThemeData::where('theme', 'test')->first());

        $saved = Theme::load('test')->getCustomData();
        $saved->position = 'left';
        $saved->save();

        ThemeData::clearInternalCache();

        $this->assertEquals((string) $saved->updated_at, ThemeData::getCombinerCacheKey());
    }

    public function testDeleteDoesNotRecreateRow()
    {
        $saved = Theme::load('formonlytest')->getCustomData();
        $saved->site_name = 'Custom';
        $saved->save();

        $this->assertTrue((bool) $saved->delete());
        $this->assertNull(ThemeData::where('theme', 'formonlytest')->first());

        $reloaded = Theme::load('formonlytest')->getCustomData();

        $this->assertFalse($reloaded->exists);
        $this->assertEquals('October', $reloaded->site_name);
    }
}
