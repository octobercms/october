<?php namespace Tailor\Controllers;

use Arr;
use Lang;
use Flash;
use Backend;
use Redirect;
use BackendMenu;
use Tailor\Classes\RecordIndexer;
use Tailor\Classes\Blueprint;
use Tailor\Classes\BlueprintIndexer;
use Backend\Classes\WildcardController;
use Tailor\Classes\Blueprint\SingleBlueprint;
use Tailor\Classes\Blueprint\StructureBlueprint;
use ApplicationException;
use ForbiddenException;
use NotFoundException;

/**
 * Entries controller
 *
 * @package october\tailor
 * @author Alexey Bobkov, Samuel Georges
 */
class Entries extends WildcardController
{
    /**
     * @var array implement extensions
     */
    public $implement = [
        \Backend\Behaviors\ListController::class,
        \Backend\Behaviors\FormController::class,
        \Backend\Behaviors\RelationController::class,
        \Tailor\Behaviors\PreviewController::class,
        \Tailor\Behaviors\VersionController::class,
        \Tailor\Behaviors\DraftController::class
    ];

    /**
     * @var array listConfig is `ListController` configuration.
     */
    public $listConfig = 'config_list.yaml';

    /**
     * @var string formConfig is `FormController` configuration.
     */
    public $formConfig = 'config_form.yaml';

    /**
     * @var \Tailor\Classes\Blueprint\EntryBlueprint activeSource
     */
    protected $activeSource;

    /**
     * @var string actionMethod is the action method to call
     */
    protected $actionMethod;

    /**
     * @var \Model modelInstance is an instance of the blueprint model
     */
    protected $modelInstance;

    /**
     * @var array customMessages contains default messages that you can override
     */
    protected $customMessages = [
        'buttonCreate' => "Create :name",
        'buttonUpdate' => "Update :name",
        'titleIndexList' => "Manage :name Entries",
        'titlePreviewForm' => "Preview :name",
        'titleCreateForm' => "Create :name",
        'titleUpdateForm' => "Update :name",
    ];

    /**
     * beforeDisplay
     */
    public function beforeDisplay()
    {
        // Pop off first parameter as source handle
        $sourceHandle = array_shift($this->params);
        $this->makeBlueprintSource($sourceHandle);

        $validMethods = ['create'];
        $slug = $this->params[0] ?? null;

        if (in_array($slug, $validMethods)) {
            // Pop second parameter as action method
            $actionMethod = array_shift($this->params);

            $this->actionMethod = $this->actionView = $actionMethod;
        }
        elseif ($this->isSectionSingular() || $slug) {
            $this->actionMethod = $this->actionView = 'update';
        }

        if (!$this->activeSource) {
            throw new NotFoundException;
        }

        $this->modelInstance = $this->activeSource->newModelInstance();

        $this->checkSourcePermission();

        $this->setNavigationContext();

        $this->setPreviewPageContext('section', $this->activeSource);
    }

    /**
     * actionUrl returns a URL for this controller and supplied action.
     */
    public function actionUrl($action = null, $path = null)
    {
        $url = 'tailor/entries/'.$this->activeSource->handleSlug.'/'.$action;
        if ($path) {
            $url .= '/'.$path;
        }

        return Backend::url($url);
    }

    /**
     * index action
     */
    public function index()
    {
        if ($this->hasFatalError()) {
            return;
        }

        if ($this->actionMethod) {
            $this->addJs('/modules/tailor/assets/js/vue-entry-header-controls.js', ['type' => 'module']);
            $this->addJs('/modules/tailor/assets/js/vue-entry-document.js', ['type' => 'module']);

            $this->registerVueComponent(\Backend\VueComponents\Document::class);
            $this->registerVueComponent(\Backend\VueComponents\DropdownMenuButton::class);
            $this->registerVueComponent(\Tailor\VueComponents\PublishingControls::class);
            $this->registerVueComponent(\Tailor\VueComponents\PublishButton::class);
            $this->registerVueComponent(\Tailor\VueComponents\DraftNotes::class);

            return $this->{$this->actionMethod}(...$this->params);
        }

        $this->asExtension('ListController')->index();

        $this->setPageTitleFromMessage('titleIndexList', "Manage Entries");

        $this->prepareVars();
    }

    /**
     * index_onBulkAction
     */
    public function index_onBulkAction()
    {
        if (
            ($bulkAction = post('action')) &&
            ($checkedIds = post('checked')) &&
            is_array($checkedIds) &&
            count($checkedIds)
        ) {
            foreach ($checkedIds as $modelId) {
                if (!$model = $this->formFindModelObject($modelId)) {
                    continue;
                }

                switch ($bulkAction) {
                    case 'disable':
                        $this->checkSourcePermission('publish');
                        $model->is_enabled = false;
                        $model->save();
                        Flash::success(__('Entries have been disabled'));
                        break;

                    case 'enable':
                        $this->checkSourcePermission('publish');
                        $model->is_enabled = true;
                        $model->save();
                        Flash::success(__('Entries have been enabled'));
                        break;

                    case 'delete':
                        $this->checkSourcePermission('delete');
                        if (!$model->isSoftDeleteEnabled() || !$model->trashed()) {
                            $model->delete();
                        }
                        Flash::success(__('Entries have been deleted'));
                        break;

                    case 'restore':
                        $this->checkSourcePermission('delete');
                        $model->restore();
                        Flash::success(__('Entries have been restored'));
                        break;

                    case 'forceDelete':
                        $this->checkSourcePermission('delete');
                        $model->forceDelete();
                        Flash::success(__('Entries have been deleted'));
                        break;

                    case 'duplicate':
                        $this->checkSourcePermission('create');
                        $model->duplicateRecord()->save(['propagate' => true]);
                        Flash::success(__('Entries have been duplicated'));
                        break;
                }
            }
        }

        return $this->listRefresh();
    }

    /**
     * create action
     */
    public function create()
    {
        $this->checkSourcePermission('create');

        if ($this->isSectionDraftable()) {
            return $this->asExtension('DraftController')->create();
        }

        $this->bodyClass = 'compact-container';

        $this->setPageTitleFromMessage('titleCreateForm', "Create Entry");

        $this->asExtension('FormController')->create();

        $this->prepareVars();

        $this->vars['initialState']['isCreateAction'] = true;
    }

    /**
     * update action
     */
    public function update($recordId = null)
    {
        $this->bodyClass = 'compact-container';

        $this->setPageTitleFromMessage('titleUpdateForm', "Update Entry");

        if ($this->isVersionMode()) {
            $response = $this->asExtension('VersionController')->update($recordId);
        }
        elseif ($this->isDraftMode()) {
            $response = $this->asExtension('DraftController')->update($recordId);
        }
        else {
            $response = $this->asExtension('FormController')->update($recordId);
        }

        if ($response) {
            return $response;
        }

        $model = $this->formGetModel();

        // Record not found or some error happened
        if (!$model) {
            return;
        }

        // Helpful redirect to active draft for non-publishers
        if (!$this->hasSourcePermission('publish') && ($redirect = $this->makeDraftRedirectToClosest($model))) {
            return $redirect;
        }

        if ($model->isVersionStatus()) {
            $this->actionView = 'version';
        }

        $this->prepareVars();
    }

    /**
     * prepareVars
     */
    protected function prepareVars()
    {
        $model = $this->getPrimaryModel();

        $this->vars['primaryModel'] = $model;
        $this->vars['entityName'] = $this->activeSource->name ?? '';
        $this->vars['activeSource'] = $this->activeSource;
        $this->vars['initialState'] = $this->makeInitialState($model);
        $this->vars['langState'] = $this->makeLangState();
    }

    /**
     * makeInitialState
     */
    public function makeInitialState($model): array
    {
        if (!$model) {
            return [];
        }

        $initialState = [
            'primaryRecordUrl' => $this->actionUrl($model->getKey()),
            'entryTypeOptions' => $model->getContentGroupOptions(),
            'draftable' => $this->isSectionDraftable(),
            'contentGroup' => $model->content_group,
            'isDraft' => $this->isSectionDraftable() && $this->formGetModel()->isDraftStatus(),
            'isSingular' => $this->isSectionSingular(),
            'isDeleted' => $model->trashed(),
            'drafts' => $model->getDraftRecords(),
            'statusCode' => $model->status_code,
            'hasPreviewPage' => $this->hasPreviewPage(),
            'statusCodeOptions' => Arr::trans($model->getStatusCodeOptions()),
            'showTreeControls' => $this->isSectionStructured() && $this->activeSource->hasTree() && !$model->trashed(),
            'fullSlug' => $model->fullslug,
            'canDelete' => $this->hasSourcePermission('delete'),
            'canPublish' => $this->hasSourcePermission('publish'),
            'canRestore' => $model->trashed(),
        ];

        if ($initialState['isDraft']) {
            $formModel = $this->formGetModel();
            $initialState['isFirstDraft'] = $formModel->isFirstDraftStatus();
            $initialState['draftNotes'] = $formModel->getDraftNotes();
            $initialState['draftName'] = $formModel->getDraftName();
            $initialState['currentDraftId'] = $formModel->getDraftId();
        }

        $showEntryTypeSelector = isset($initialState['entryTypeOptions']) && $initialState['entryTypeOptions'];
        if ($initialState['isDraft'] && !$initialState['isFirstDraft']) {
            $showEntryTypeSelector = false;
        }

        if ($initialState['isDeleted']) {
            $showEntryTypeSelector = false;
        }

        $initialState['showEntryTypeSelector'] = $showEntryTypeSelector;

        return $initialState;
    }

    /**
     * makeLangState
     */
    public function makeLangState()
    {
        return [
            'form_save' => e(Lang::get('backend::lang.form.save')),
            'form_delete' => e(Lang::get('backend::lang.form.delete')),
            'form_restore' => e(Lang::get('backend::lang.form.restore')),
            'form_error' => e(Lang::get('backend::lang.form.error')),
            'form_confirm_delete' => e(Lang::get('backend::lang.form.confirm_delete')),
            'form_save_close' => __("Save & Close"),
            'force_delete' => __("Delete Forever"),
            'force_delete_confirm' => __("Do you really want to delete this permanently?"),
            'save_draft' => __("Save Draft"),
            'discard_draft' => __("Discard Draft"),
            'discard_draft_confirm' => __("Do you really want to discard the draft?"),
            'save_apply_draft' => __("Save & Apply Draft"),
            'delete_entry_confirm' => __("Do you really want to delete the record? It will also delete all drafts if any exist."),
            'create_draft' => __("Create New Draft"),
            'select_draft' => __("Select Draft to Edit"),
            'edit_primary_record' => __("Edit the Primary Record"),
            'draft_notes' => __("Notes"),
            'confirm_create_draft' => __("The document has unsaved changes. Do you want to discard them and proceed with creating a new draft?"),
            'preview' => __("Preview"),
            'unnamed_draft' => __("Unnamed Draft"),
        ];
    }

    /**
     * prepareAjaxResponseVars
     */
    protected function prepareAjaxResponseVars()
    {
        $model = $this->formGetModel();

        return [
            'result' => [
                'drafts' => $model->getDraftRecords(),
                'versions' => $model->getVersionRecords(),
                'statusCode' => $model->status_code,
                'fullSlug' => $model->fullslug
            ]
        ];
    }

    /**
     * getPrimaryModel
     */
    protected function getPrimaryModel()
    {
        if ($this->isVersionMode()) {
            return $this->versionGetPrimaryModel();
        }

        if ($this->isDraftMode()) {
            return $this->draftGetPrimaryModel();
        }

        return $this->formGetModel();
    }

    /**
     * onCommitDraft is saving a draft without publishing it
     */
    public function onCommitDraft($recordId = null)
    {
        $redirect = $this->asExtension('DraftController')->onCommitDraft($recordId);
        if (post('close')) {
            return $redirect;
        }

        return $this->prepareAjaxResponseVars();
    }

    /**
     * onSave
     */
    public function onSave($recordId = null)
    {
        if ($this->actionMethod === 'update') {
            $redirect = $this->asExtension('FormController')->update_onSave($recordId);
            if (post('close')) {
                return $redirect;
            }

            return $this->prepareAjaxResponseVars();
        }
        else {
            return $this->asExtension('FormController')->create_onSave();
        }
    }

    /**
     * onDelete
     */
    public function onDelete($recordId = null)
    {
        $this->checkSourcePermission('delete');

        if ($this->actionMethod === 'update') {
            return $this->asExtension('FormController')->update_onDelete($recordId);
        }
    }

    /**
     * onRestore
     */
    public function onRestore($recordId = null)
    {
        $this->checkSourcePermission('publish');

        if ($model = $this->formFindModelObject($recordId)) {
            $model->restore();

            Flash::success(Lang::get('backend::lang.form.restore_success', [
                'name' => Lang::get($this->asExtension('FormController')->getConfig('name', 'backend::lang.model.name'))
            ]));

            return Redirect::refresh();
        }
    }

    /**
     * onForceDelete
     */
    public function onForceDelete($recordId = null)
    {
        $this->checkSourcePermission('delete');

        if ($model = $this->formFindModelObject($recordId)) {
            $model->forceDelete();

            Flash::success(__(":name Deleted", [
                'name' => Lang::get($this->asExtension('FormController')->getConfig('name', 'backend::lang.model.name'))
            ]));

            if ($redirect = $this->makeRedirect('delete', $model)) {
                return $redirect;
            }
        }
    }

    /**
     * onChangeEntryType
     */
    public function onChangeEntryType()
    {
        // Relation Controller
        if (post('_relation_field')) {
            $widget = $this->relationGetManageFormWidget();
            $this->onRelationManageForm();
            $widget->setFormValues();
            return ['#'.$widget->getId('managePopup') => $this->relationMakePartial('manage_form')];
        }

        $this->formGetWidget()->setFormValues();
        return ['#entryPrimaryTabs' => $this->makePartial('primary_tabs')];
    }

    /**
     * onResetStructure
     */
    public function onResetStructure()
    {
        if (!$this->isSectionStructured()) {
            throw new ForbiddenException;
        }

        $model = $this->listGetWidget()->getModel();
        $model->resetTreeNesting();
        $model->resetTreeOrphans();

        Flash::success(__("Structure has been reset"));

        return $this->listRefresh();
    }

    /**
     * listGetConfig
     */
    public function listGetConfig($definition)
    {
        $section = $this->activeSource;

        $config = $this->asExtension('ListController')->listGetConfig($definition);

        // Structure config
        if ($this->isSectionStructured()) {
            $config->structure = [
                'maxDepth' => $section->getMaxDepth(),
                'showTree' => $section->hasTree(),
            ] + ((array) $section->structure);
        }

        // Default sorting
        if ($section->defaultSort) {
            $config->defaultSort = $section->defaultSort;
        }

        // Each source needs its own session store
        $config->widgetAlias = camel_case(
            $definition . '-' . $section->handleSlug
        );

        // Model class
        $config->modelClass = $this->modelInstance::class;

        return $config;
    }

    /**
     * relationExtendManageWidget
     */
    public function relationExtendManageWidget($widget, $field, $model)
    {
        $model = $widget->getModel();

        // Entry type switching, existing records already have content_group
        if (
            !$model->exists &&
            $model instanceof \Tailor\Classes\BlueprintModel &&
            ($entryType = post('EntryRecord[content_group]'))
        ) {
            $model->setBlueprintGroup($entryType);
        }

        // Disable adaptive fields
        $widget->bindEvent('form.extendFields', function ($fields) {
            foreach ($fields as $field) {
                if ($field->span === 'adaptive') {
                    $field->span('full')->externalToolbarAppState(null);
                }
            }
        });
    }

    /**
     * listExtendModel
     */
    public function listExtendModel($model)
    {
        $model->extendWithBlueprint($this->activeSource->uuid);

        return $model;
    }

    /**
     * listExtendQuery
     */
    public function listExtendQuery($query)
    {
        if ($this->isSectionDraftable()) {
            $query->withSavedDrafts();
        }
    }

    /**
     * listExtendRecords
     */
    public function listExtendRecords($records)
    {
        $this->eagerLoadRelationsForList($this->listGetWidget(), $records);
    }

    /**
     * listOverrideRecordUrl
     */
    public function listOverrideRecordUrl($record, $definition = null)
    {
        return "tailor/entries/{$this->activeSource->handleSlug}/{$record->id}";
    }

    /**
     * listAfterReorder
     */
    public function listAfterReorder($record, $definition = null)
    {
        // Reload the new record position
        $record = $record->newQueryWithoutScopes()->find($record->getKey());

        RecordIndexer::instance()->process($record);
    }

    /**
     * listExtendRefreshResults updates bulk actions when the list changes
     */
    public function listExtendRefreshResults($filter, $result)
    {
        return ['#listBulkActions' => $this->makePartial('list_bulk_actions')];
    }

    /**
     * eagerLoadRelations
     */
    protected function eagerLoadRelationsForList($list, $models)
    {
        if (!$models->count()) {
            return;
        }

        $definitions = $models->first()->getRelationDefinitions();

        foreach ($definitions as $type => $relations) {
            foreach ($relations as $name => $options) {
                if (!$list->isColumnVisible($name)) {
                    continue;
                }

                $models->loadMissing($name);
            }
        }
    }

    /**
     * formBeforeSave
     */
    public function formBeforeSave($model)
    {
        if ($this->isSectionVersionable()) {
            $this->asExtension('VersionController')->versionBeforeSave($model);
        }
    }

    /**
     * formAfterSave
     */
    public function formAfterSave($model)
    {
        RecordIndexer::instance()->process($model);
    }

    /**
     * formFindModelObject
     */
    public function formFindModelObject($recordId)
    {
        if (!$recordId && $this->isSectionSingular()) {
            $recordId = $this->findSingularModelObjectWithFallback()->getKey();
        }

        $model = $this->modelInstance::inSection($this->activeSource->handle);

        // Remove multisite restriction
        if ($this->formHasMultisite($model)) {
            $model = $model->withSites();
        }

        if ($this->isVersionMode()) {
            $model = $model->withVersions();
        }

        if ($this->isDraftMode()) {
            $model = $model->withDrafts();
        }
        else {
            $model = $model->withSavedDrafts();
        }

        // Include deleted records
        $model = $model->withTrashed()->find($recordId);

        if (!$model) {
            throw new ApplicationException(__("Form record with an ID of :id could not be found.", [
                'class' => $this->modelInstance::class, 'id' => $recordId
            ]));
        }

        // Mimic parent method
        $this->formExtendModel($model);

        return $model;
    }

    /**
     * formGetRedirectUrl
     */
    public function formGetRedirectUrl($context = null, $model = null): string
    {
        if (post('close') || $this->isSectionSingular() || $context === 'delete') {
            $url = 'tailor/entries/'.$this->activeSource->handleSlug;
        }
        else {
            $url = 'tailor/entries/'.$this->activeSource->handleSlug.'/'.$model->getKey();
        }

        return $url;
    }

    /**
     * formCreateModelObject
     */
    public function formCreateModelObject()
    {
        $model = $this->modelInstance;

        $model->extendWithBlueprint($this->activeSource->uuid);

        $model->setDefaultContentGroup(get('entry_type'));

        // Without publish permission, enabled should be default false
        if (!$this->hasSourcePermission('publish')) {
            $model->is_enabled = false;
        }

        return $model;
    }

    /**
     * formExtendModel
     */
    public function formExtendModel($model)
    {
        // Entry type switching
        if ($entryType = post('EntryRecord[content_group]')) {
            $model->setBlueprintGroup($entryType);
        }
    }

    /**
     * formExtendFields
     */
    public function formExtendFields($widget)
    {
        if (!$this->hasSourcePermission('publish')) {
            $widget->getField('is_enabled')->hidden();
            $widget->getField('published_at')->hidden();
            $widget->getField('expired_at')->hidden();
        }
    }

    /**
     * isSectionActive
     */
    protected function isSectionActive(Blueprint $section): bool
    {
        return $this->activeSource->uuid === $section->uuid;
    }

    /**
     * isSectionDraftable
     */
    protected function isSectionDraftable(): bool
    {
        return $this->activeSource && $this->activeSource->useDrafts();
    }

    /**
     * isSectionVersionable
     */
    protected function isSectionVersionable(): bool
    {
        return $this->activeSource && $this->activeSource->useVersions();
    }

    /**
     * isSectionSingular
     */
    protected function isSectionSingular(): bool
    {
        return $this->activeSource && $this->activeSource instanceof SingleBlueprint;
    }

    /**
     * isSectionMultisite
     */
    protected function isSectionMultisite(): bool
    {
        return $this->activeSource && $this->activeSource->useMultisite();
    }

    /**
     * isSectionStructure
     */
    protected function isSectionStructured(): bool
    {
        return $this->activeSource && $this->activeSource instanceof StructureBlueprint;
    }

    /**
     * makeBlueprintSource
     */
    protected function makeBlueprintSource($activeSource = null): void
    {
        $this->activeSource = $activeSource
            ? BlueprintIndexer::instance()->findSectionByHandle($activeSource)
            : null;
    }

    /**
     * checkSourcePermission
     */
    protected function checkSourcePermission($names = null, $throwException = true)
    {
        if ($names) {
            $permissionNames = array_map(function($name) {
                return $this->activeSource->getPermissionCodeName($name);
            }, (array) $names);
        }
        else {
            $permissionNames = [$this->activeSource->getPermissionCodeName()];
        }

        $hasPermission = $this->user->hasAnyAccess($permissionNames);

        if (!$hasPermission && $throwException) {
            throw new ForbiddenException;
        }

        return $hasPermission;
    }

    /**
     * hasSourcePermission
     */
    protected function hasSourcePermission(...$names)
    {
        return $this->checkSourcePermission($names, false);
    }

    /**
     * setNavigationContext
     */
    protected function setNavigationContext()
    {
        $item = BlueprintIndexer::instance()->findSecondaryNavigation($this->activeSource->uuid);
        if ($item) {
            $item->setBackendControllerContext();
        }
        else {
            BackendMenu::setContext('October.Tailor', 'tailor');
        }
    }

    /**
     * setPageTitleMessage
     */
    protected function setPageTitleFromMessage(string $message, string $defaultMessage = 'Tailor')
    {
        $section = $this->activeSource;

        if (!$section) {
            $this->pageTitle = $defaultMessage;
            return;
        }

        $vars = [
            'name' => $section->name
        ];

        $this->pageTitle = $section->getMessage(
            $message,
            $this->customMessages[$message] ?? $defaultMessage,
            $vars
        );
    }

    /**
     * findSingularModelObjectWithFallback
     */
    protected function findSingularModelObjectWithFallback()
    {
        $uuid = $this->activeSource->uuid;

        if (!$this->isSectionMultisite()) {
            return $this->modelInstance::findSingleForSectionUuid($uuid);
        }

        // Check site context first
        $record = $this->modelInstance::inSectionUuid($uuid)->first();
        if ($record) {
            return $record;
        }

        // Try by removing the multisite restriction
        $record = $this->modelInstance::inSectionUuid($uuid)->withSites()->first();
        if ($record) {
            return $record;
        }

        // Time to create a new record
        return $this->modelInstance::findSingleForSectionUuid($uuid);
    }
}
