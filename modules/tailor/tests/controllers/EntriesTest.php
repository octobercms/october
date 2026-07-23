<?php

use Tailor\Models\EntryRecord;
use Tailor\Controllers\Entries;

class EntriesTest extends PluginTestCase
{
    public function setUp(): void
    {
        parent::setUp();

        $this->migrateTailor();
    }

    /**
     * testFormExtendModelPreservesPostedContentGroup covers a regression where AJAX
     * requests from widgets inside a non-default content group failed with "A widget
     * has not been bound to the controller". The postback carries the unsaved entry
     * type in _content_group_value and the form model must honor it during init.
     */
    public function testFormExtendModelPreservesPostedContentGroup()
    {
        $controller = new Entries;

        // No postback leaves the default group untouched
        $model = $this->makePost();
        $controller->formExtendModel($model);
        $this->assertEquals('regular_post', $model->content_group);

        // AJAX postback preserves the unsaved entry type
        $model = $this->makePost();
        $this->mergePostback(['_content_group_value' => 'markdown_post']);
        $controller->formExtendModel($model);
        $this->assertEquals('markdown_post', $model->content_group);

        // Switching always wins over the current value
        $model = $this->makePost();
        $this->mergePostback([
            '_content_group_switch' => 'regular_post',
            '_content_group_value' => 'markdown_post',
        ]);
        $controller->formExtendModel($model);
        $this->assertEquals('regular_post', $model->content_group);

        // Foreign values from another form fall back to the default group
        $model = $this->makePost();
        $this->mergePostback(['_content_group_value' => 'invalid_group']);
        $controller->formExtendModel($model);
        $this->assertEquals('regular_post', $model->content_group);
    }

    /**
     * testRelationManageWidgetIgnoresParentContentGroup covers the parent content
     * group leaking to child items where opening a create popup serializes the
     * parent form, so its posted value must not transfer to the new child record.
     */
    public function testRelationManageWidgetIgnoresParentContentGroup()
    {
        $controller = new Entries;

        // Opening a popup posts the parent form value, child keeps its default group
        $model = $this->makePost();
        $widget = new \Backend\Widgets\Form(null, ['model' => $model, 'fields' => []]);
        $this->mergePostback(['_content_group_value' => 'markdown_post']);
        $controller->relationExtendManageWidget($widget, 'field', $model);
        $this->assertEquals('regular_post', $model->content_group);

        // Popup postbacks carry the child form value and must be preserved
        $model = $this->makePost();
        $widget = new \Backend\Widgets\Form(null, ['model' => $model, 'fields' => []]);
        $this->mergePostback([
            '_form_session_key' => 'abc123',
            '_content_group_value' => 'markdown_post',
        ]);
        $controller->relationExtendManageWidget($widget, 'field', $model);
        $this->assertEquals('markdown_post', $model->content_group);
    }

    /**
     * makePost
     */
    protected function makePost(): EntryRecord
    {
        request()->request->replace();

        $post = EntryRecord::inSection('UnitTest\Post');
        $post->setDefaultContentGroup();

        return $post;
    }

    /**
     * mergePostback
     */
    protected function mergePostback(array $data): void
    {
        request()->setMethod('POST');
        request()->request->add($data);
    }
}
