<?php

use Backend\Models\EditorSetting;

class EditorSettingTest extends TestCase
{
    public function tearDown(): void
    {
        EditorSetting::clearInternalCache();

        parent::tearDown();
    }

    public function testStyleClassNamesAreStillCleaned()
    {
        $model = new EditorSetting;
        $model->html_style_paragraph = [
            ['class_name' => 'oc-text" onmouseover="x', 'class_label' => 'Label'],
        ];

        $model->beforeSave();

        $this->assertSame('oc-textonmouseoverx', $model->html_style_paragraph[0]['class_name']);
    }

    /**
     * @dataProvider importDirectiveProvider
     */
    public function testSafeModeStripsImportDirectivesFromCustomStyles(string $css)
    {
        Config::set('cms.safe_mode', true);

        $model = new EditorSetting;
        $model->html_custom_styles = $css;
        $model->beforeSave();

        $this->assertDoesNotMatchRegularExpression('/@\s*import?(?![\w-])/i', $model->html_custom_styles);
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
            ['p { color: red; } @@import (reference) "a.less"; @impor (inline) "b.css";'],
        ];
    }

    public function testSafeModeCustomStylesDoNotInlineFiles()
    {
        Config::set('cms.safe_mode', true);

        $probeFile = temp_path('editor-setting-import-probe.css');
        file_put_contents($probeFile, '.inlined-probe-rule{color:red}');

        try {
            $model = new EditorSetting;
            $model->html_custom_styles = 'p { color: blue; } @@import (inline) "'.str_replace('\\', '/', $probeFile).'";';
            $model->beforeSave();

            $css = $this->compileLess($model->html_custom_styles);
        }
        finally {
            @unlink($probeFile);
        }

        $this->assertStringNotContainsString('inlined-probe-rule', $css);
    }

    /**
     * @dataProvider fileFunctionProvider
     */
    public function testSafeModeStripsFileFunctionsFromCustomStyles(string $function)
    {
        Config::set('cms.safe_mode', true);

        $model = new EditorSetting;
        $model->html_custom_styles = 'p { background: '.$function.'("/probe.css"); }';
        $model->beforeSave();

        $this->assertDoesNotMatchRegularExpression('/(data-?uri|image-?(size|width|height))\s*\(/i', $model->html_custom_styles);
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

    public function testSafeModeCustomStylesDoNotEmbedFilesViaFunctionAliases()
    {
        Config::set('cms.safe_mode', true);

        // File functions resolve rooted paths against the document root, which is empty on the console
        $documentRoot = $_SERVER['DOCUMENT_ROOT'] ?? null;
        $_SERVER['DOCUMENT_ROOT'] = temp_path();

        $probeFile = temp_path('editor-setting-alias-probe.css');
        file_put_contents($probeFile, '.embedded-probe-rule{color:red}');

        try {
            $model = new EditorSetting;
            $model->html_custom_styles = 'p { background: datauri("text/plain;base64", "/editor-setting-alias-probe.css"); }';
            $model->beforeSave();

            $css = $this->compileLess($model->html_custom_styles);
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

        $styles = '@important-color: red; @imports: 2; a { color: @important-color; }';

        $model = new EditorSetting;
        $model->html_custom_styles = $styles;
        $model->beforeSave();

        $this->assertSame($styles, $model->html_custom_styles);
        $this->assertSame('.fr-view a{color:red}', $this->compileLess($model->html_custom_styles));
    }

    public function testCustomStylesKeepImportsOutsideSafeMode()
    {
        Config::set('cms.safe_mode', false);

        $model = new EditorSetting;
        $model->html_custom_styles = '@import "theme.less";';
        $model->beforeSave();

        $this->assertSame('@import "theme.less";', $model->html_custom_styles);
    }

    /**
     * compileLess mirrors EditorSetting::compileCss and returns any parser error as text.
     */
    protected function compileLess(string $styles): string
    {
        try {
            $parser = new Less_Parser(['compress' => true]);
            $parser->parse('.fr-view {' . $styles . '}');

            return $parser->getCss();
        }
        catch (Exception $ex) {
            return $ex->getMessage();
        }
    }
}
