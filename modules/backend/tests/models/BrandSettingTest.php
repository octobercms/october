<?php

use Backend\Models\BrandSetting;

class BrandSettingTest extends TestCase
{
    public function tearDown(): void
    {
        BrandSetting::clearInternalCache();

        parent::tearDown();
    }

    /**
     * @dataProvider importDirectiveProvider
     */
    public function testSafeModeStripsImportDirectivesFromCustomCss(string $css)
    {
        Config::set('cms.safe_mode', true);

        $model = new BrandSetting;
        $model->custom_css = $css;
        $model->beforeSave();

        $this->assertDoesNotMatchRegularExpression('/@\s*import?(?![\w-])/i', $model->custom_css);
    }

    public static function importDirectiveProvider(): array
    {
        return [
            ['@import (inline) "LICENSE.md";'],
            ['@IMPORT (inline) "LICENSE.md";'],
            ['@@import (inline) "LICENSE.md";'],
            ['@@@import (inline) "LICENSE.md";'],
            ['@impor (inline) "LICENSE.md";'],
            ['@@impor (inline) "LICENSE.md";'],
            ['@ import (inline) "LICENSE.md";'],
            ['@im@importport (inline) "LICENSE.md";'],
            ['@impo@imporr (inline) "LICENSE.md";'],
            ['body { color: red; } @@import (reference) "a.less"; @impor (inline) "b.css";'],
        ];
    }

    public function testSafeModeCustomCssDoesNotInlineFiles()
    {
        Config::set('cms.safe_mode', true);

        $probeFile = temp_path('brand-setting-import-probe.css');
        file_put_contents($probeFile, '.inlined-probe-rule{color:red}');

        try {
            $model = new BrandSetting;
            $model->custom_css = 'body { color: blue; } @@import (inline) "'.str_replace('\\', '/', $probeFile).'";';
            $model->beforeSave();

            $css = $this->compileLess($model->custom_css);
        }
        finally {
            @unlink($probeFile);
        }

        $this->assertStringNotContainsString('inlined-probe-rule', $css);
    }

    public function testSafeModeCustomCssDoesNotEmbedFilesViaFunctions()
    {
        Config::set('cms.safe_mode', true);

        $probeFile = temp_path('brand-setting-datauri-probe.css');
        file_put_contents($probeFile, '.embedded-probe-rule{color:red}');
        $probePath = str_replace('\\', '/', $probeFile);

        try {
            $model = new BrandSetting;
            $model->custom_css = 'body { background: data-uri("'.$probePath.'"); } a { width: DATA-URI ("'.$probePath.'"); }';
            $model->beforeSave();

            $css = $this->compileLess($model->custom_css);
        }
        finally {
            @unlink($probeFile);
        }

        $this->assertStringNotContainsStringIgnoringCase('data-uri', $model->custom_css);
        $this->assertStringNotContainsString(base64_encode('.embedded-probe-rule{color:red}'), $css);
    }

    /**
     * @dataProvider fileFunctionProvider
     */
    public function testSafeModeStripsFileFunctionsFromCustomCss(string $function)
    {
        Config::set('cms.safe_mode', true);

        $model = new BrandSetting;
        $model->custom_css = 'body { background: '.$function.'("/probe.css"); }';
        $model->beforeSave();

        $this->assertDoesNotMatchRegularExpression('/(data-?uri|image-?(size|width|height))\s*\(/i', $model->custom_css);
    }

    public static function fileFunctionProvider(): array
    {
        return [
            ['data-uri'],
            ['datauri'],
            ['DataUri'],
            ['datauri '],
            ['image-size'],
            ['imagesize'],
            ['image-width'],
            ['imagewidth'],
            ['image-height'],
            ['imageheight'],
            ['data-datauri(uri'],
        ];
    }

    public function testSafeModeCustomCssDoesNotEmbedFilesViaFunctionAliases()
    {
        Config::set('cms.safe_mode', true);

        // File functions resolve rooted paths against the document root, which is empty on the console
        $documentRoot = $_SERVER['DOCUMENT_ROOT'] ?? null;
        $_SERVER['DOCUMENT_ROOT'] = temp_path();

        $probeFile = temp_path('brand-setting-alias-probe.css');
        file_put_contents($probeFile, '.embedded-probe-rule{color:red}');

        try {
            $model = new BrandSetting;
            $model->custom_css = 'body { background: datauri("text/plain;base64", "/brand-setting-alias-probe.css"); }';
            $model->beforeSave();

            $css = $this->compileLess($model->custom_css);
        }
        finally {
            @unlink($probeFile);
            $_SERVER['DOCUMENT_ROOT'] = $documentRoot;
        }

        $this->assertStringNotContainsString(base64_encode('.embedded-probe-rule{color:red}'), $css);
    }

    public function testSafeModeKeepsVariablesThatStartWithImport()
    {
        Config::set('cms.safe_mode', true);

        $css = '@important-color: red; @imports: 2; a { color: @important-color; }';

        $model = new BrandSetting;
        $model->custom_css = $css;
        $model->beforeSave();

        $this->assertSame($css, $model->custom_css);
        $this->assertSame('a{color:red}', $this->compileLess($model->custom_css));
    }

    public function testCustomCssKeepsImportsOutsideSafeMode()
    {
        Config::set('cms.safe_mode', false);

        $model = new BrandSetting;
        $model->custom_css = '@import "theme.less";';
        $model->beforeSave();

        $this->assertSame('@import "theme.less";', $model->custom_css);
    }

    public function testCustomPaletteColorsAreCleanedForLess()
    {
        $vars = (new BrandSetting)->getPaletteStyleVarsFor('custom', 'light', [
            'primary' => '#123456',
            'secondary' => 'rgb(1, 2, 3)',
            'selection' => '#fff; @import (inline) "LICENSE.md"',
            'link_color' => ['#fff'],
            'x: 1; @import (inline) "LICENSE.md"; @y' => '#fff',
        ]);

        $this->assertSame('#123456', $vars['brand-primary']);
        $this->assertSame('rgb(1, 2, 3)', $vars['brand-secondary']);
        $this->assertSame('#6bc48d', $vars['brand-selection']);
        $this->assertSame('#3498db', $vars['brand-link-color']);

        foreach ($vars as $name => $value) {
            $this->assertMatchesRegularExpression('/^[a-z0-9-]+$/', $name);
            $this->assertStringNotContainsString('@', $value);
        }
    }

    public function testPresetPaletteColorsAreUnchanged()
    {
        $vars = (new BrandSetting)->getPaletteStyleVarsFor('classic', 'light');

        $this->assertSame('#1991d1', $vars['brand-primary']);
        $this->assertSame('#3498db', $vars['brand-link-color']);
    }

    public function testCompiledCssDoesNotInlineFilesViaSettings()
    {
        $markerFile = str_replace('\\', '/', temp_path('brand-setting-marker.css'));
        file_put_contents($markerFile, '.brand-setting-marker{color:red}');
        $inject = '; @import (inline) "'.$markerFile.'"; @unused: 1';

        try {
            $model = BrandSetting::instance();
            $model->login_background_color = '#fff'.$inject;
            $model->login_background_wallpaper_size = 'cover'.$inject;
            $model->color_palette = [
                'preset' => 'custom',
                'light' => ['primary' => '#123456'.$inject],
                'dark' => ['primary' => '#123456'.$inject],
            ];

            $css = BrandSetting::compileCss();
        }
        finally {
            @unlink($markerFile);
        }

        $this->assertStringNotContainsString('brand-setting-marker', $css);
        $this->assertStringContainsString(BrandSetting::DEFAULT_LOGIN_COLOR, $css);
    }

    /**
     * compileLess parses the custom CSS as BrandSetting::compileCss does and returns any parser error as text.
     */
    protected function compileLess(string $css): string
    {
        try {
            $parser = new Less_Parser(['compress' => true]);
            $parser->parse($css);

            return $parser->getCss();
        }
        catch (Exception $ex) {
            return $ex->getMessage();
        }
    }
}
