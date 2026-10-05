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
     * testListUrlSaveCannotCreateEntry ensures onSave outside the create page never creates records.
     */
    public function testListUrlSaveCannotCreateEntry()
    {
        $this->assertCreateSaveForbidden('UnitTest\Author', null, ['create', 'publish']);
    }

    /**
     * testCreateSaveRequiresCreatePermission ensures the create page save checks the create permission.
     */
    public function testCreateSaveRequiresCreatePermission()
    {
        $this->assertCreateSaveForbidden('UnitTest\Author', 'create', ['publish']);
    }

    /**
     * testCreateSaveOnDraftableSectionRequiresPublish ensures non-publishers cannot skip the first draft.
     */
    public function testCreateSaveOnDraftableSectionRequiresPublish()
    {
        $this->assertCreateSaveForbidden('UnitTest\Post', 'create', ['create']);
    }

    /**
     * testCreatePageSaveCreatesEntry ensures creating from the create page still works.
     */
    public function testCreatePageSaveCreatesEntry()
    {
        $controller = $this->makeSectionController('UnitTest\Author', 'create', ['create']);
        $this->postNewTitle($controller);

        $controller->onSave();

        $this->assertEquals(1, EntryRecord::inSection('UnitTest\Author')->where('title', 'New Title')->count());
    }

    /**
     * testTranslationDisabledOnLockedPrimary ensures non-publishers cannot save translations of live records.
     */
    public function testTranslationDisabledOnLockedPrimary()
    {
        $post = $this->makePublishedPost();

        $controller = $this->makeDraftEditorController();
        $controller->initForm($post);

        $this->expectException(SystemException::class);
        $this->expectExceptionMessage('Translation is not enabled');

        $controller->formGetWidget()->onSaveTranslateField();
    }

    /**
     * testTranslationLockFollowsDraftStatus ensures only first drafts keep translations for non-publishers.
     */
    public function testTranslationLockFollowsDraftStatus()
    {
        $post = $this->makePublishedPost();
        $draft = $post->createNewDraft(['name' => 'Draft']);

        $firstDraft = $this->makePost();
        $firstDraft->title = 'First Draft';
        $firstDraft->saveAsFirstDraft();

        $controller = $this->makeDraftEditorController();
        $this->assertFalse($this->makeFormWidget($controller, $draft)->useTranslatable);
        $this->assertNull($this->makeFormWidget($controller, $firstDraft)->useTranslatable);

        $controller = $this->makeDraftEditorController(['publish']);
        $this->assertNull($this->makeFormWidget($controller, $post)->useTranslatable);
    }

    /**
     * testLockedPrimaryFormUsesPreviewMode ensures form widgets of live records cannot save for non-publishers.
     */
    public function testLockedPrimaryFormUsesPreviewMode()
    {
        $post = $this->makePublishedPost();
        $draft = $post->createNewDraft(['name' => 'Draft']);

        $controller = $this->makeDraftEditorController();
        $controller->initForm($post);
        $this->assertTrue($controller->formGetWidget()->previewMode);

        $this->assertFalse($this->makeFormWidget($controller, $draft)->previewMode);

        $controller = $this->makeDraftEditorController(['publish']);
        $controller->initForm($post);
        $this->assertFalse($controller->formGetWidget()->previewMode);
    }

    /**
     * testRelationReadOnlyOnLockedPrimary ensures relation managed children of live records are read only for non-publishers.
     */
    public function testRelationReadOnlyOnLockedPrimary()
    {
        $post = $this->makePublishedPost();
        $draft = $post->createNewDraft(['name' => 'Draft']);

        $config = (object) [];
        $this->makeDraftEditorController()->relationExtendConfig($config, 'field', $post);
        $this->assertTrue($config->readOnly);

        $config = (object) [];
        $this->makeDraftEditorController()->relationExtendConfig($config, 'field', $draft);
        $this->assertFalse(property_exists($config, 'readOnly'));

        $config = (object) [];
        $this->makeDraftEditorController(['publish'])->relationExtendConfig($config, 'field', $post);
        $this->assertFalse(property_exists($config, 'readOnly'));
    }

    /**
     * testRelationManageWidgetHidesPublishingFields ensures child entry popups respect the related publish permission.
     */
    public function testRelationManageWidgetHidesPublishingFields()
    {
        $controller = $this->makeSectionController('UnitTest\Author', 'update');
        $model = EntryRecord::inSection('UnitTest\Author');
        $widget = new \Backend\Widgets\Form($controller, ['model' => $model, 'fields' => []]);

        $controller->relationExtendManageWidget($widget, 'author', $model);
        $this->mergePostback(['title' => 'Child', 'is_enabled' => 1, 'published_at' => '2020-01-01']);
        $saveData = $widget->getSaveData();

        $this->assertFalse($model->is_enabled);
        $this->assertArrayHasKey('title', $saveData);
        $this->assertArrayNotHasKey('is_enabled', $saveData);
        $this->assertArrayNotHasKey('published_at', $saveData);

        $controller = $this->makeSectionController('UnitTest\Author', 'update', ['publish']);
        $model = EntryRecord::inSection('UnitTest\Author');
        $widget = new \Backend\Widgets\Form($controller, ['model' => $model, 'fields' => []]);

        $controller->relationExtendManageWidget($widget, 'author', $model);

        $this->assertArrayHasKey('is_enabled', $widget->getSaveData());
    }

    /**
     * testStructureReorderRequiresPublish ensures reordering live structure entries needs the publish permission.
     */
    public function testStructureReorderRequiresPublish()
    {
        $controller = $this->makeSectionController('UnitTest\Category', null);
        $section = self::getProtectedProperty($controller, 'activeSource');

        $config = $controller->listGetConfig('list');

        $this->assertEquals($section->getPermissionCodeName('publish'), $config->structure['permissions']);

        $category = EntryRecord::inSection('UnitTest\Category');
        $category->title = 'Live Category';
        $category->save();

        $widget = $controller->makeList('list');
        $this->mergePostback(['record_id' => $category->getKey()]);

        $this->expectException(ForbiddenException::class);

        $widget->onReorder();
    }

    /**
     * testRestoreRequiresDeletePermission ensures the edit page restore needs delete as well as publish.
     */
    public function testRestoreRequiresDeletePermission()
    {
        $post = $this->makeTrashedPost();

        $controller = $this->makeDraftEditorController(['publish']);

        try {
            $controller->onRestore($post->getKey());
            $this->fail('Expected ForbiddenException was not thrown');
        }
        catch (ForbiddenException) {
        }

        $this->assertTrue($this->findPostWithTrashed($post)->trashed());

        $controller = $this->makeDraftEditorController(['delete', 'publish']);
        $controller->onRestore($post->getKey());

        $this->assertFalse($this->findPostWithTrashed($post)->trashed());
    }

    /**
     * testBulkRestoreRequiresPublishPermission ensures the bulk restore needs publish as well as delete.
     */
    public function testBulkRestoreRequiresPublishPermission()
    {
        $post = $this->makeTrashedPost();

        $controller = $this->makeSectionController('UnitTest\Post', null, ['delete']);
        $this->mergePostback(['action' => 'restore', 'checked' => [$post->getKey()]]);

        try {
            $controller->index_onBulkAction();
            $this->fail('Expected ForbiddenException was not thrown');
        }
        catch (ForbiddenException) {
        }

        $this->assertTrue($this->findPostWithTrashed($post)->trashed());
    }

    /**
     * testVersionRowRejectedAsDraftTarget ensures a version history row cannot be treated as a draft.
     */
    public function testVersionRowRejectedAsDraftTarget()
    {
        $post = $this->makePublishedPost();
        $version = $post->saveVersionSnapshot();

        request()->query->add(['draft' => $version->getKey(), 'version' => $version->getKey()]);

        $controller = $this->makeDraftEditorController();

        try {
            $controller->onDiscardDraft($post->getKey());
            $this->fail('Expected the version row to be rejected');
        }
        catch (Exception $ex) {
            $this->assertStringContainsString('not a draft', $ex->getMessage());
        }
        finally {
            request()->query->remove('draft');
            request()->query->remove('version');
        }

        $this->assertNotNull(EntryRecord::inSection('UnitTest\Post')->newQuery()->withVersions()->find($version->getKey()));
    }

    /**
     * assertCreateSaveForbidden calls onSave for a new entry and asserts it is forbidden and nothing is created.
     */
    protected function assertCreateSaveForbidden(string $handle, ?string $actionMethod, array $extraPermissions): void
    {
        $controller = $this->makeSectionController($handle, $actionMethod, $extraPermissions);
        $this->postNewTitle($controller);

        try {
            $controller->onSave();
            $this->fail('Expected ForbiddenException was not thrown');
        }
        catch (ForbiddenException) {
        }
        finally {
            $this->assertEquals(0, EntryRecord::inSection($handle)->newQuery()->withDrafts()->where('title', 'New Title')->count());
        }
    }

    /**
     * postNewTitle posts a new entry title using the controller's form array name.
     */
    protected function postNewTitle(Entries $controller): void
    {
        $arrayName = class_basename(self::getProtectedProperty($controller, 'modelInstance'));

        $this->mergePostback([$arrayName => ['title' => 'New Title', 'slug' => 'new-title']]);
    }

    /**
     * makeFormWidget runs the controller form hooks for a model and returns the defined form widget.
     */
    protected function makeFormWidget(Entries $controller, EntryRecord $model): \Backend\Widgets\Form
    {
        $widget = new \Backend\Widgets\Form($controller, ['model' => $model, 'fields' => []]);
        $widget->bindEvent('form.extendFieldsBefore', function () use ($controller, $widget) {
            $controller->formExtendFieldsBefore($widget);
        });

        $widget->getSaveData();

        return $widget;
    }

    /**
     * makeTrashedPost saves a published entry and soft deletes it.
     */
    protected function makeTrashedPost(): EntryRecord
    {
        $post = $this->makePublishedPost();
        $post->delete();

        return $post;
    }

    /**
     * findPostWithTrashed reloads a post including trashed records.
     */
    protected function findPostWithTrashed(EntryRecord $post): EntryRecord
    {
        return EntryRecord::inSection('UnitTest\Post')->newQuery()->withTrashed()->find($post->getKey());
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
        return $this->makeSectionController('UnitTest\Post', 'update', $extraPermissions);
    }

    /**
     * makeSectionController returns a controller for a section and action method
     * acting as a user with the base section permission plus any extra permissions.
     */
    protected function makeSectionController(string $handle, ?string $actionMethod, array $extraPermissions = []): Entries
    {
        $section = BlueprintIndexer::instance()->findSectionByHandle($handle);

        $permissions = [$section->getPermissionCodeName() => 1];
        foreach ($extraPermissions as $name) {
            $permissions[$section->getPermissionCodeName($name)] = 1;
        }

        $user = new BackendUserFixture;
        $this->actingAs($user->withPermission($permissions));

        $controller = new Entries;
        self::setProtectedProperty($controller, 'activeSource', $section);
        self::setProtectedProperty($controller, 'actionMethod', $actionMethod);
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
