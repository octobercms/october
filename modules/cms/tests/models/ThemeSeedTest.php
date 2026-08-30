<?php

use Cms\Classes\Theme;
use Cms\Models\ThemeSeed;

class ThemeSeedTest extends TestCase
{
    public function setUp(): void
    {
        parent::setUp();

        Config::set('cms.active_theme', 'test');
        Event::forget('cms.theme.getActiveTheme');
        Theme::resetCache();
    }

    public function testFindSeedPathUsesParentTheme()
    {
        $model = new ThemeSeed;

        $path = self::callProtectedMethod($model, 'findSeedPath', [Theme::load('childtest')]);
        $this->assertEquals(themes_path('parenttest'), $path);

        $path = self::callProtectedMethod($model, 'findSeedPath', [Theme::load('parenttest')]);
        $this->assertEquals(themes_path('parenttest'), $path);

        $path = self::callProtectedMethod($model, 'findSeedPath', [Theme::load('test')]);
        $this->assertEquals(themes_path('test'), $path);
    }
}
