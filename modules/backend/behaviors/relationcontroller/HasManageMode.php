<?php namespace Backend\Behaviors\RelationController;

use Lang;
use Request;
use Illuminate\Database\Eloquent\Relations\HasOneOrMany;
use Backend\Widgets\Form as FormWidget;
use Backend\Widgets\Lists as ListWidget;
use ApplicationException;

/**
 * HasManageMode contains logic for managing related records
 */
trait HasManageMode
{
    /**
     * @var ListWidget|null manageListWidget used for managing as a list
     */
    protected $manageListWidget;

    /**
     * @var FormWidget|null manageFormWidget used for managing as a form
     */
    protected $manageFormWidget;

    /**
     * @var Model manageModel is a reference to the model used for manage form
     */
    protected $manageModel;

    /**
     * @var \Backend\Widgets\Filter manageFilterWidget
     */
    protected $manageFilterWidget;

    /**
     * @var string manageTitle used for the manage popup
     */
    protected $manageTitle;

    /**
     * @var string manageMode of relation as list, form, or pivot
     */
    protected $manageMode;

    /**
     * @var int manageId is the primary id of an existing relation record
     */
    protected $manageId;

    /**
     * relationGetManageFormWidget returns the manage form widget used by this behavior
     */
    public function relationGetManageFormWidget(): ?FormWidget
    {
        return $this->manageFormWidget;
    }

    /**
     * relationGetManageListWidget returns the manage list widget used by this behavior
     */
    public function relationGetManageListWidget(): ?ListWidget
    {
        return $this->manageListWidget;
    }

    /**
     * relationGetManageWidget returns the manage widget used by this behavior
     * @deprecated use relationGetManageListWidget or relationGetManageFormWidget
     * @return \Backend\Classes\WidgetBase
     */
    public function relationGetManageWidget()
    {
        // Multiple (has many, belongs to many)
        if ($this->manageMode === 'list' || $this->manageMode === 'pivot') {
            return $this->manageListWidget;
        }

        // Single (belongs to, has one)
        if ($this->manageMode === 'form') {
            return $this->manageFormWidget;
        }

        return null;
    }

    /**
     * makeManageListWidget prepares the list widget for management
     */
    protected function makeManageListWidget(): ?ListWidget
    {
        if (!$config = $this->makeConfigForMode('manage', 'list')) {
            return null;
        }

        $this->manageModel = $this->relationModel;

        $isPivot = $this->manageMode === 'pivot';

        $config->model = $this->manageModel;
        $config->alias = $this->alias . 'ManageList';
        $config->showSetup = $this->getConfig('manage[showSetup]', false);
        $config->showCheckboxes = $this->getConfig('manage[showCheckboxes]', !$isPivot);
        $config->showSorting = $this->getConfig('manage[showSorting]', !$isPivot);
        $config->defaultSort = $this->getConfig('manage[defaultSort]');
        $config->recordsPerPage = $this->getConfig('manage[recordsPerPage]');
        $config->customPageName = $this->getConfig('manage[customPageName]', false);
        $config->recordOnClick = $this->getConfig('manage[recordOnClick]');

        if ($this->viewMode === 'single') {
            $config->showCheckboxes = false;
            $config->recordOnClick ??= sprintf(
                "oc.relationBehavior.clickManageListRecord(this, ':%s', '%s', '%s')",
                $this->manageModel->getKeyName(),
                $this->relationGetId(),
                $this->relationSessionKey
            );
        }
        elseif ($config->showCheckboxes) {
            $config->recordOnClick ??= "oc.relationBehavior.toggleListCheckbox(this)";
        }
        elseif ($isPivot) {
            $config->recordOnClick ??= sprintf(
                "oc.relationBehavior.clickManagePivotListRecord(this, ':%s', '%s', '%s')",
                $this->manageModel->getKeyName(),
                $this->relationGetId(),
                $this->relationSessionKey
            );
        }

        $widget = $this->makeWidget(ListWidget::class, $config);

        // Apply defined constraints
        if ($sqlConditions = $this->getConfig('manage[conditions]')) {
            $widget->bindEvent('list.extendQueryBefore', function ($query) use ($sqlConditions) {
                $query->whereRaw($sqlConditions);
            });
        }
        elseif ($scopeMethod = $this->getConfig('manage[scope]')) {
            $widget->bindEvent('list.extendQueryBefore', function ($query) use ($scopeMethod) {
                $query->$scopeMethod($this->relationParent);
            });
        }
        else {
            $widget->bindEvent('list.extendQueryBefore', function ($query) {
                $this->relationObject->addDefinedConstraintsToQuery($query);

                // Reset any orders that come from the definition since they may
                // reference the pivot table that isn't included in this query
                if (in_array($this->relationType, ['belongsToMany', 'morphedByMany', 'morphToMany'])) {
                    $query->getQuery()->reorder();
                }
            });
        }

        // Link the Search Widget to the List Widget
        if ($this->searchWidget) {
            $this->searchWidget->bindEvent('search.submit', function () use ($widget) {
                $widget->setSearchTerm($this->searchWidget->getActiveTerm());
                return $widget->onRefresh();
            });

            // Pass search options
            $widget->setSearchOptions([
                'mode' => $this->getConfig('manage[searchMode]'),
                'scope' => $this->getConfig('manage[searchScope]'),
            ]);

            // Persist the search term across AJAX requests only
            if (Request::ajax()) {
                $widget->setSearchTerm($this->searchWidget->getActiveTerm());
            }
        }

        // Link the Filter Widget to the List Widget
        if ($this->manageFilterWidget) {
            $this->manageFilterWidget->bindEvent('filter.update', function () use ($widget) {
                return $widget->onFilter();
            });

            // Apply predefined filter values
            $widget->addFilter([$this->manageFilterWidget, 'applyAllScopesToQuery']);
        }

        // Exclude existing relationships for non-incrementing pivots
        if (!$this->isPivotIncrementing()) {
            $widget->bindEvent('list.extendQuery', function ($query) {
                if (count($existingIds = $this->findExistingRelationIds())) {
                    $query->whereNotIn($this->manageModel->getQualifiedKeyName(), $existingIds);
                }
            });
        }

        return $widget;
    }

    /**
     * makeManageFormWidget prepares the form widget for management
     */
    protected function makeManageFormWidget(): ?FormWidget
    {
        if (!$config = $this->makeConfigForMode('manage', 'form')) {
            return null;
        }

        $this->manageModel = $this->relationModel;

        // Existing record
        if ($this->manageId) {
            $this->manageModel = $this->findManageModelObject($this->manageId);

            if (!$this->manageModel) {
                throw new ApplicationException(Lang::get('backend::lang.model.not_found', [
                    'class' => get_class($this->relationModel),
                    'id' => $this->manageId,
                ]));
            }
        }

        $config->model = $this->manageModel;
        $config->arrayName = class_basename($this->relationModel);
        $config->context = $this->evalFormContext('manage', !!$this->manageId);
        $config->alias = $this->alias . 'ManageForm';
        $config->parentFieldName = $this->field;

        $widget = $this->makeWidget(FormWidget::class, $config);

        return $widget;
    }

    /**
     * onRelationManageForm
     */
    public function onRelationManageForm()
    {
        // The form should not share its session key with the parent
        $this->bumpSessionKeys = true;

        $this->beforeAjax();

        if ($this->manageMode === 'form' && !$this->manageFormWidget) {
            throw new ApplicationException("Missing configuration for [manage.{$this->manageMode}] in RelationController definition [{$this->field}].");
        }

        if ($this->manageMode !== 'form' && !$this->manageListWidget) {
            throw new ApplicationException("Missing configuration for [manage.{$this->manageMode}] in RelationController definition [{$this->field}].");
        }

        // Updating an existing record
        if ($this->manageMode === 'pivot' && ($this->manageId || $this->pivotId)) {
            return $this->onRelationManagePivotForm();
        }

        $this->vars['newSessionKey'] = $this->sessionKey;

        return $this->relationMakePartial('manage_' . $this->manageMode);
    }

    /**
     * onRelationManageCreate a new related model
     */
    public function onRelationManageCreate()
    {
        $this->beforeAjax();

        $saveData = $this->manageFormWidget->getSaveData();
        $sessionKey = $this->deferredBinding ? $this->relationSessionKey : null;
        $parentModel = $this->relationObject->getParent();
        $newModel = $this->relationModel;

        $this->controller->relationBeforeSave($this->field, $newModel);
        $this->controller->relationBeforeCreate($this->field, $newModel);

        $modelsToSave = $this->prepareModelsToSave($newModel, $saveData);
        foreach ($modelsToSave as $modelToSave) {
            $modelToSave->save(['sessionKey' => $this->manageFormWidget->getSessionKey(), 'propagate' => true]);
        }

        // No need to add relationships that have a valid association via HasOneOrMany::make
        if (!$this->relationObject instanceof HasOneOrMany || !$parentModel->exists) {
            $this->relationObject->add($newModel, $sessionKey);
        }

        // Belongs To won't save when using add() so it should occur if the conditions are right.
        if ($this->relationType === 'belongsTo' && $parentModel->exists && !$this->deferredBinding) {
            $parentModel->save();
        }

        // Display updated form
        if ($this->viewMode === 'single') {
            $this->viewFormWidget->model = $newModel;
            $this->viewFormWidget->setFormValues($saveData);
        }

        $this->controller->relationAfterSave($this->field, $newModel);
        $this->controller->relationAfterCreate($this->field, $newModel);

        $this->showFlashMessage('flashCreate');

        return $this->relationRefresh();
    }

    /**
     * onRelationManageUpdate an existing related model's fields
     */
    public function onRelationManageUpdate()
    {
        $this->beforeAjax();

        $saveData = $this->manageFormWidget->getSaveData();

        $this->controller->relationBeforeSave($this->field, $this->manageModel);
        $this->controller->relationBeforeUpdate($this->field, $this->manageModel);

        $modelsToSave = $this->prepareModelsToSave($this->manageModel, $saveData);
        foreach ($modelsToSave as $modelToSave) {
            $modelToSave->save(['sessionKey' => $this->manageFormWidget->getSessionKey(), 'propagate' => true]);
        }

        // Display updated form
        if ($this->viewMode === 'single') {
            $this->viewFormWidget->setFormValues($saveData);
        }

        $this->controller->relationAfterSave($this->field, $this->manageModel);
        $this->controller->relationAfterUpdate($this->field, $this->manageModel);

        $this->showFlashMessage('flashUpdate');

        return $this->relationRefresh();
    }

    /**
     * onRelationManageDelete an existing related model completely
     */
    public function onRelationManageDelete()
    {
        $this->beforeAjax();

        $deletedModels = [];

        // Multiple (has many, belongs to many)
        if ($this->viewMode === 'multi') {
            if (($checkedIds = post('checked')) && is_array($checkedIds)) {
                foreach ($checkedIds as $relationId) {
                    if ($pivotKey = $this->isPivotIncrementing()) {
                        $obj = $this->relationObject->wherePivot($pivotKey, $relationId)->first();
                    }
                    else {
                        $obj = $this->findManageModelObject($relationId);
                    }

                    if (!$obj) {
                        continue;
                    }

                    $obj->delete();
                    $deletedModels[] = $obj;
                }
            }
        }
        // Single (belongs to, has one)
        elseif ($this->viewMode === 'single') {
            $relatedModel = $this->viewModel;
            if ($relatedModel->exists) {
                $relatedModel->delete();
                $deletedModels[] = $relatedModel;
            }

            $this->resetViewWidgetModel();
            $this->viewModel = $this->relationModel;
        }

        $this->controller->relationAfterDelete($this->field, $deletedModels);

        $this->showFlashMessage('flashDelete');

        return $this->relationRefresh();
    }

    /**
     * onRelationManageAdd an existing related model to the primary model
     */
    public function onRelationManageAdd()
    {
        $this->beforeAjax();

        $recordId = post('record_id');
        $sessionKey = $this->deferredBinding ? $this->relationSessionKey : null;

        // Add
        if ($this->viewMode === 'multi') {
            $checkedIds = $recordId ? [$recordId] : $this->manageListWidget->getAllCheckedIds();

            if (is_array($checkedIds)) {
                // Remove existing relations from the array
                $existingIds = $this->findExistingRelationIds($checkedIds);
                $checkedIds = array_diff($checkedIds, $existingIds);
                $foreignKeyName = $this->relationModel->getKeyName();

                $models = $this->relationModel->whereIn($foreignKeyName, $checkedIds)->get();

                $this->controller->relationBeforeAdd($this->field, $models);

                foreach ($models as $model) {
                    $this->relationObject->add($model, $sessionKey);
                }

                $this->controller->relationAfterAdd($this->field, $models);
            }

            $this->showFlashMessage('flashAdd');
        }
        // Link
        elseif ($this->viewMode === 'single') {
            if ($recordId && ($model = $this->findManageModelObject($recordId))) {
                $this->relationObject->add($model, $sessionKey);
                $this->viewFormWidget->setFormValues($model->attributes);

                // Belongs To won't save when using add() so it should occur if the conditions are right.
                if ($this->relationType === 'belongsTo' && !$this->deferredBinding) {
                    $parentModel = $this->relationObject->getParent();
                    if ($parentModel->exists) {
                        $parentModel->save();
                    }
                }
            }

            $this->showFlashMessage('flashLink');
        }

        return $this->relationRefresh();
    }

    /**
     * onRelationManageRemove an existing related model from the primary model
     */
    public function onRelationManageRemove()
    {
        $this->beforeAjax();

        $recordId = post('record_id');
        $sessionKey = $this->deferredBinding ? $this->relationSessionKey : null;
        $relatedModel = $this->relationModel;

        // Remove
        if ($this->viewMode === 'multi') {
            $checkedIds = $recordId ? [$recordId] : post('checked');

            if (is_array($checkedIds)) {
                if ($pivotKey = $this->isPivotIncrementing()) {
                    $models = $this->relationObject->wherePivotIn($pivotKey, $checkedIds)->get();
                }
                else {
                    $foreignKeyName = $relatedModel->getKeyName();
                    $models = $relatedModel->whereIn($foreignKeyName, $checkedIds)->get();
                }

                $this->controller->relationBeforeRemove($this->field, $models);

                foreach ($models as $model) {
                    $this->relationObject->remove($model, $sessionKey);
                }

                $this->controller->relationAfterRemove($this->field, $models);
            }

            $this->showFlashMessage('flashRemove');
        }
        // Unlink
        elseif ($this->viewMode === 'single') {
            if ($this->relationType === 'belongsTo') {
                $this->relationObject->dissociate();
                $this->relationObject->getParent()->save();
            }
            elseif ($this->relationType === 'hasOne' || $this->relationType === 'morphOne') {
                if ($obj = $this->findManageModelObject($recordId)) {
                    $this->relationObject->remove($obj, $sessionKey);
                }
                elseif ($this->viewModel->exists) {
                    $this->relationObject->remove($this->viewModel, $sessionKey);
                }
            }

            $this->resetViewWidgetModel();

            $this->showFlashMessage('flashUnlink');
        }

        return $this->relationRefresh();
    }

    /**
     * evalManageTitle determines the management mode popup title
     */
    protected function evalManageTitle(): string
    {
        if ($customTitle = $this->getConfig('manage[title]')) {
            return Lang::get($customTitle);
        }

        switch ($this->manageMode) {
            case 'pivot':
            case 'list':
                if ($this->eventTarget === 'button-link') {
                    return $this->getCustomLang('titleLinkForm');
                }
                else {
                    return $this->getCustomLang('titleAddForm');
                }
            case 'form':
                if ($this->readOnly) {
                    return $this->getCustomLang('titlePreviewForm');
                }
                elseif ($this->manageId) {
                    return $this->getCustomLang('titleUpdateForm');
                }
                else {
                    return $this->getCustomLang('titleCreateForm');
                }
        }

        return '';
    }

    /**
     * evalManageMode determines the management mode based on the relation type and settings
     * @return string
     */
    protected function evalManageMode()
    {
        switch ($this->eventTarget) {
            case 'button-create':
            case 'button-update':
                return 'form';

            case 'button-link':
                return 'list';
        }

        switch ($this->relationType) {
            case 'belongsTo':
                return 'list';

            case 'morphToMany':
            case 'morphedByMany':
            case 'belongsToMany':
                if (isset($this->config->pivot)) {
                    return 'pivot';
                }
                elseif ($this->eventTarget === 'list') {
                    return 'form';
                }
                else {
                    return 'list';
                }

            case 'hasOne':
            case 'morphOne':
            case 'hasMany':
            case 'morphMany':
            case 'hasManyThrough':
                if ($this->eventTarget === 'button-add') {
                    return 'list';
                }

                return 'form';
        }
    }

    /**
     * findManageModelObject for the current field
     */
    protected function findManageModelObject($recordId)
    {
        if (!strlen($recordId)) {
            return null;
        }

        $query = $this->relationModel->newQuery();

        $this->controller->relationExtendManageFormQuery($this->field, $query);

        return $query->find($recordId);
    }
}
