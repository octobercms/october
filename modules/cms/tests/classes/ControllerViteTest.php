<?php

use Cms\Classes\Theme;
use Cms\Classes\Controller;
use October\Rain\Halcyon\Model;

class ControllerViteTest extends TestCase
{
    public function setUp(): void
    {
        parent::setUp();

        Model::clearBootedModels();
        Model::flushEventListeners();
    }

    public function testThemeViteRendersEntryPoints()
    {
        $controller = new Controller(Theme::load('vitetest'));

        $html = $controller->themeVite(['assets/css/theme.css', 'assets/js/app.js']);

        $this->assertStringContainsString('<link rel="stylesheet" href="'.url('/themes/vitetest/assets/dist/theme-B2xQ1h3a.css').'"', $html);
        $this->assertStringContainsString('<script type="module" src="'.url('/themes/vitetest/assets/dist/app-C9kD2fRe.js').'"', $html);
    }

    public function testThemeViteAcceptsSingleEntryPoint()
    {
        $controller = new Controller(Theme::load('vitetest'));

        $html = $controller->themeVite('assets/js/app.js');

        $this->assertStringContainsString('app-C9kD2fRe.js', $html);
        $this->assertStringNotContainsString('theme-B2xQ1h3a.css', $html);
    }

    public function testThemeViteUsesThemesAssetUrl()
    {
        Config::set('system.themes_asset_url', 'https://cdn.test/themes');

        $controller = new Controller(Theme::load('vitetest'));

        $html = $controller->themeVite('assets/js/app.js');

        $this->assertStringContainsString('src="https://cdn.test/themes/vitetest/assets/dist/app-C9kD2fRe.js"', $html);
    }

    public function testChildThemeUsesParentBuild()
    {
        $controller = new Controller(Theme::load('vitechildtest'));

        $html = $controller->themeVite('assets/js/app.js');

        $this->assertStringContainsString('src="'.url('/themes/vitetest/assets/dist/app-C9kD2fRe.js').'"', $html);
    }

    public function testMissingBuildNamesThemeDirectory()
    {
        $controller = new Controller(Theme::load('test'));

        $this->expectExceptionMessage('Vite manifest not found at: '.themes_path('test').'/assets/dist/manifest.json');

        $controller->themeVite('assets/js/app.js');
    }

    public function testViteTwigFunction()
    {
        $controller = new Controller(Theme::load('vitetest'));

        $content = $controller->run('/')->getContent();

        $this->assertStringContainsString('<link rel="stylesheet" href="'.url('/themes/vitetest/assets/dist/theme-B2xQ1h3a.css').'"', $content);
        $this->assertStringContainsString('<script type="module" src="'.url('/themes/vitetest/assets/dist/app-C9kD2fRe.js').'"', $content);
    }

    public function testViteTwigFunctionInChildTheme()
    {
        $controller = new Controller(Theme::load('vitechildtest'));

        $content = $controller->run('/')->getContent();

        $this->assertStringContainsString('src="'.url('/themes/vitetest/assets/dist/app-C9kD2fRe.js').'"', $content);
    }
}
