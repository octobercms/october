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

        $this->assertDoesNotMatchRegularExpression('/@\s*impor/i', $model->html_custom_styles);
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
