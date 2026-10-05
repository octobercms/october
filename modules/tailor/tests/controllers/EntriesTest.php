<?php

use Tailor\Models\EntryRecord;
use Tailor\Controllers\Entries;
use Tailor\Classes\BlueprintIndexer;

require_once __DIR__.'/../../../backend/tests/fixtures/models/BackendUserFixture.php';

class EntriesTest extends PluginTestCase
{
    /**
     * @var bool autoMigrateTailor migrates the tailor blueprints once for the reused database
     */
    protected $autoMigrateTailor = true;

    /**
     * @var bool useTransactions isolates each test with a database transaction
     */
    protected $useTransactions = true;

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
     * testNonPublisherCannotSaveDraftableEntryDirectly ensures editors without the
     * publish permission cannot bypass the draft workflow by calling onSave.
     */
    public function testNonPublisherCannotSaveDraftableEntryDirectly()
    {
        $this->assertPublishedEntryProtected('onSave');
    }

    /**
     * testNonPublisherCannotCommitDraftToPublishedEntry ensures onCommitDraft without
     * a resolved draft cannot write to the published record.
     */
    public function testNonPublisherCannotCommitDraftToPublishedEntry()
    {
        $this->assertPublishedEntryProtected('onCommitDraft');
    }

    /**
     * testPublisherCanSaveDraftableEntryDirectly ensures the publish guard still lets publishers save.
     */
    public function testPublisherCanSaveDraftableEntryDirectly()
    {
        $post = $this->makePublishedPost();

        $controller = $this->makeDraftEditorController(['publish']);
        $this->postReplacedTitle($controller);

        $controller->onSave($post->getKey());

        $this->assertEquals('Replaced Title', EntryRecord::inSection('UnitTest\Post')->find($post->getKey())->title);
    }

    /**
     * assertPublishedEntryProtected calls a save handler on a published entry as a
     * non-publisher and asserts it is forbidden and the entry is unchanged.
     */
    protected function assertPublishedEntryProtected(string $handler): void
    {
        $post = $this->makePublishedPost();

        $controller = $this->makeDraftEditorController();
        $this->postReplacedTitle($controller);

        try {
            $controller->$handler($post->getKey());
            $this->fail('Expected ForbiddenException was not thrown');
        }
        catch (ForbiddenException) {
        }
        finally {
            $this->assertEquals('Live Title', EntryRecord::inSection('UnitTest\Post')->find($post->getKey())->title);
        }
    }

    /**
     * makePublishedPost saves a published entry with a known title.
     */
    protected function makePublishedPost(): EntryRecord
    {
        $post = $this->makePost();
        $post->title = 'Live Title';
        $post->slug = 'live-title';
        $post->save();

        return $post;
    }

    /**
     * postReplacedTitle posts a changed title using the controller's form array name.
     */
    protected function postReplacedTitle(Entries $controller): void
    {
        $arrayName = class_basename(self::getProtectedProperty($controller, 'modelInstance'));

        $this->mergePostback([$arrayName => ['title' => 'Replaced Title', 'slug' => 'live-title']]);
    }

    /**
     * makeDraftEditorController returns an update controller for a draftable section
     * acting as a user with the base section permission plus any extra permissions.
     */
    protected function makeDraftEditorController(array $extraPermissions = []): Entries
    {
        $section = BlueprintIndexer::instance()->findSectionByHandle('UnitTest\Post');
        $section->drafts = true;

        $permissions = [$section->getPermissionCodeName() => 1];
        foreach ($extraPermissions as $name) {
            $permissions[$section->getPermissionCodeName($name)] = 1;
        }

        $user = new BackendUserFixture;
        $this->actingAs($user->withPermission($permissions));

        $controller = new Entries;
        self::setProtectedProperty($controller, 'activeSource', $section);
        self::setProtectedProperty($controller, 'actionMethod', 'update');
        self::setProtectedProperty($controller, 'modelInstance', $section->newModelInstance());

        return $controller;
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
