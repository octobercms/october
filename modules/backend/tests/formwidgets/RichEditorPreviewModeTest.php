<?php

use Backend\Widgets\Form;
use October\Rain\Database\Model;

require_once __DIR__.'/../fixtures/models/BackendUserFixture.php';

/**
 * RichEditorPreviewModeModel is a plain model holding rich content in memory.
 */
class RichEditorPreviewModeModel extends Model
{
    public $timestamps = false;
}

/**
 * RichEditorPreviewModeTest ensures stored rich content cannot run script when rendered in preview mode.
 */
class RichEditorPreviewModeTest extends PluginTestCase
{
    /**
     * testPreviewModeStripsScript ensures event handlers, script tags and script links are removed from preview markup.
     */
    public function testPreviewModeStripsScript()
    {
        $html = $this->renderRichEditor(
            '<p>Safe</p><img src="x" onerror="alert(1)"><script>alert(2)</script><a href="javascript:alert(3)">link</a><svg onload="alert(4)"></svg>',
            true
        );

        $this->assertStringContainsString('<p>Safe</p>', $html);
        $this->assertStringNotContainsString('onerror', $html);
        $this->assertStringNotContainsString('alert(2)', $html);
        $this->assertStringNotContainsString('javascript:', $html);
        $this->assertStringNotContainsString('onload', $html);
    }

    /**
     * testPreviewModeKeepsSafeMarkup ensures ordinary content, links and relative media still display.
     */
    public function testPreviewModeKeepsSafeMarkup()
    {
        $html = $this->renderRichEditor(
            '<h2>Title</h2><p><strong>Bold</strong> <a href="/about">About</a></p><img src="/storage/app/media/a.jpg" alt="A">',
            true
        );

        $this->assertStringContainsString('<h2>Title</h2>', $html);
        $this->assertStringContainsString('<strong>Bold</strong>', $html);
        $this->assertStringContainsString('<a href="/about">About</a>', $html);
        $this->assertStringContainsString('src="/storage/app/media/a.jpg"', $html);
    }

    /**
     * testPreviewModeAllowsEmptyValue ensures a field without a value renders in preview mode.
     */
    public function testPreviewModeAllowsEmptyValue()
    {
        $html = $this->renderRichEditor(null, true);

        $this->assertStringContainsString('<div class="form-control"></div>', $html);
    }

    /**
     * testPreviewModeRendersValueVerbatimWhenSafeModeDisabled ensures fields opting out of safe mode keep full editor formatting.
     */
    public function testPreviewModeRendersValueVerbatimWhenSafeModeDisabled()
    {
        $content = '<p style="text-align: center;">Title</p><img class="fr-dib" src="/storage/app/media/a.jpg">';

        $html = $this->renderRichEditor($content, true, ['safeMode' => false]);

        $this->assertStringContainsString('<div class="form-control">' . $content . '</div>', $html);
    }

    /**
     * testEditModeValueIsEscaped ensures the editable path still passes the original value escaped to the editor.
     */
    public function testEditModeValueIsEscaped()
    {
        $html = $this->renderRichEditor('<img src="x" onerror="alert(1)">', false);

        $this->assertStringContainsString('&lt;img src=&quot;x&quot; onerror=&quot;alert(1)&quot;&gt;', $html);
        $this->assertStringNotContainsString('<img src="x"', $html);
    }

    /**
     * renderRichEditor renders a form holding the given rich content, optionally in preview mode.
     */
    protected function renderRichEditor(?string $content, bool $previewMode, array $fieldConfig = []): string
    {
        $this->actingAs(new BackendUserFixture);

        $model = new RichEditorPreviewModeModel;
        $model->content = $content;

        $form = new Form(new \Backend\Classes\Controller, [
            'model' => $model,
            'arrayName' => 'RichEditorPreviewModeModel',
            'previewMode' => $previewMode,
            'fields' => [
                'content' => ['type' => 'richeditor'] + $fieldConfig,
            ],
        ]);

        return $form->render();
    }
}
