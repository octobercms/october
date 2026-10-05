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

        $this->assertDoesNotMatchRegularExpression('/@\s*impor/i', $model->custom_css);
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

    public function testCustomCssKeepsImportsOutsideSafeMode()
    {
        Config::set('cms.safe_mode', false);

        $model = new BrandSetting;
        $model->custom_css = '@import "theme.less";';
        $model->beforeSave();

        $this->assertSame('@import "theme.less";', $model->custom_css);
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
