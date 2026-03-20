<?php namespace Backend\Behaviors\RelationController;

use Request;
use October\Rain\Database\Model;
use Backend\Widgets\Form as FormWidget;
use Backend\Widgets\Lists as ListWidget;
use Backend\Widgets\ListStructure as ListStructureWidget;

/**
 * HasViewMode contains logic for viewing related records
 */
trait HasViewMode
{
    /**
     * @var ListWidget|null viewListWidget used for viewing as a list
     */
    protected $viewListWidget;

    /**
     * @var FormWidget|null viewFormWidget used for viewing as a form
     */
    protected $viewFormWidget;

    /**
     * @var \Backend\Widgets\Filter viewFilterWidget
     */
    protected $viewFilterWidget;

    /**
     * @var Model viewModel is a reference to the model used for viewing (form only)
     */
    protected $viewModel;

    /**
     * @var string viewMode if relation has many (multi) or has one (single)
     */
    protected $viewMode;

    /**
     * relationGetManageFormWidget returns the manage form widget used by this behavior
     */
    public function relationGetViewFormWidget(): ?FormWidget
    {
        return $this->viewFormWidget;
    }

    /**
     * relationGetViewListWidget returns the manage list widget used by this behavior
     */
    public function relationGetViewListWidget(): ?ListWidget
    {
        return $this->viewListWidget;
    }

    /**
     * relationGetViewWidget returns the view widget used by this behavior
     * @deprecated use relationGetViewListWidget or relationGetViewFormWidget
     * @return \Backend\Classes\WidgetBase
     */
    public function relationGetViewWidget()
    {
        // Multiple (has many, belongs to many)
        if ($this->viewMode === 'multi') {
            return $this->viewListWidget;
        }

        // Single (belongs to, has one)
        if ($this->viewMode === 'single') {
            return $this->viewFormWidget;
        }

        return null;
    }

    /**
     * makeViewListWidget prepares the list widget for viewing
     */
    protected function makeViewListWidget(): ?ListWidget
    {
        if ($this->viewMode !== 'multi') {
            return null;
        }

        if (!$config = $this->makeConfigForMode('view', 'list')) {
            return null;
        }

        $this->viewModel = $this->relationModel;

        $isPivot = in_array($this->relationType, ['belongsToMany', 'morphedByMany', 'morphToMany']);
        $isPivotIncrementing = $this->isPivotIncrementing();

        $config->model = $this->viewModel;
        $config->alias = $this->alias . 'ViewList';
        $config->showSetup = $this->getConfig('view[showSetup]', false);
        $config->showSorting = $this->getConfig('view[showSorting]', true);
        $config->defaultSort = $this->getConfig('view[defaultSort]');
        $config->recordsPerPage = $this->getConfig('view[recordsPerPage]');
        $config->showCheckboxes = $this->getConfig('view[showCheckboxes]', !$this->readOnly);
        $config->recordUrl = $this->getConfig('view[recordUrl]', null);
        $config->customViewPath = $this->getConfig('view[customViewPath]', null);
        $config->customPageName = $this->getConfig('view[customPageName]', camel_case(class_basename($this->relationModel).'Page'));
        $config->pivotMode = $isPivotIncrementing;

        if ($isPivotIncrementing) {
            $defaultOnClick = sprintf(
                "oc.relationBehavior.clickViewPivotListRecord(this, ':%s', '%s', '%s')",
                $isPivotIncrementing,
                $this->relationGetId(),
                $this->relationSessionKey
            );
        }
        else {
            $defaultOnClick = sprintf(
                "oc.relationBehavior.clickViewListRecord(this, ':%s', '%s', '%s')",
                $this->viewModel->getKeyName(),
                $this->relationGetId(),
                $this->relationSessionKey
            );
        }

        if ($config->recordUrl) {
            $defaultOnClick = null;
        }
        elseif (
            !$this->makeConfigForMode('manage', 'form') &&
            !$this->makeConfigForMode('pivot', 'form')
        ) {
            $defaultOnClick = null;
        }

        $config->recordOnClick = $this->getConfig('view[recordOnClick]', $defaultOnClick);

        if ($emptyMessage = $this->getConfig('emptyMessage')) {
            $config->noRecordsMessage = $emptyMessage;
        }

        if ($isPivot) {
            $this->viewModel->setRelation('pivot', $this->relationObject->newPivot());
        }

        // Make structure enabled widget
        $structureConfig = $this->makeListStructureConfig($config);
        if ($structureConfig) {
            $widget = $this->makeWidget(ListStructureWidget::class, $structureConfig);
        }
        else {
            $widget = $this->makeWidget(ListWidget::class, $config);
        }

        // Linkage for JS plugins
        if ($this->toolbarWidget) {
            $this->toolbarWidget->listWidgetId = $widget->getId();

            // Pass the list setup AJAX handler to the toolbar
            if ($config->showSetup) {
                $this->toolbarWidget->setupHandler = $widget->getEventHandler('onLoadSetup');
            }
        }

        // Custom structure reordering logic
        if (
            $this->relationParent->isClassInstanceOf(\October\Contracts\Database\SortableRelationInterface::class) &&
            $this->relationParent->isSortableRelation($this->relationName)
        ) {
            $widget->bindEvent('list.beforeReorderStructure', function () {
                // Set sort orders in deferred bindings as well
                if ($this->deferredBinding) {
                    $this->relationParent->sessionKey = $this->relationSessionKey;
                }
                $this->relationParent->setSortableRelationOrder($this->relationName, post('sort_orders'), true);
                return false;
            }, -1);
        }

        // Apply defined constraints
        if ($sqlConditions = $this->getConfig('view[conditions]')) {
            $widget->bindEvent('list.extendQueryBefore', function ($query) use ($sqlConditions) {
                $query->whereRaw($sqlConditions);
            });
        }
        elseif ($scopeMethod = $this->getConfig('view[scope]')) {
            $widget->bindEvent('list.extendQueryBefore', function ($query) use ($scopeMethod) {
                $query->$scopeMethod($this->relationParent);
            });
        }
        else {
            $widget->bindEvent('list.extendQueryBefore', function ($query) {
                $this->relationObject->addDefinedConstraintsToQuery($query);
            });
        }

        // Constrain the query by the relationship and deferred items
        $widget->bindEvent('list.extendQuery', function (&$query) use ($isPivot) {
            $this->relationObject->setQuery($query);

            $sessionKey = $this->deferredBinding ? $this->relationSessionKey : null;
            if ($sessionKey) {
                $this->relationObject->withDeferredQuery(null, $sessionKey);
            }
            elseif ($this->relationParent->exists) {
                $this->relationObject->addConstraints();
            }

            // Allows pivot data to enter the fray by replacing the query
            if ($isPivot) {
                $this->relationObject->setQuery($query->getQuery());
                $query = $this->relationObject;
            }
        });

        // Constrain the list by the search widget, if available
        if (
            $this->toolbarWidget &&
            $this->getConfig('view[showSearch]') &&
            $searchWidget = $this->toolbarWidget->getSearchWidget()
        ) {
            $searchWidget->bindEvent('search.submit', function () use ($widget, $searchWidget) {
                $widget->setSearchTerm($searchWidget->getActiveTerm());
                return $widget->onRefresh();
            });

            // Pass search options
            $widget->setSearchOptions([
                'mode' => $this->getConfig('view[searchMode]'),
                'scope' => $this->getConfig('view[searchScope]'),
            ]);

            // Persist the search term across AJAX requests only
            if (Request::ajax()) {
                $widget->setSearchTerm($searchWidget->getActiveTerm());
            }
            else {
                $searchWidget->setActiveTerm(null);
            }
        }

        // Link the Filter Widget to the List Widget
        if ($this->viewFilterWidget) {
            $this->viewFilterWidget->bindEvent('filter.update', function () use ($widget) {
                return $widget->onFilter();
            });

            // Apply predefined filter values
            $widget->addFilter([$this->viewFilterWidget, 'applyAllScopesToQuery']);
        }

        return $widget;
    }

    /**
     * makeViewFormWidget prepares the form widget for viewing
     */
    protected function makeViewFormWidget(): ?FormWidget
    {
        if ($this->viewMode !== 'single') {
            return null;
        }

        if (!$config = $this->makeConfigForMode('view', 'form')) {
            return null;
        }

        $this->viewModel = $this->relationObject->getResults()
            ?: $this->relationModel;

        $config->model = $this->viewModel;
        $config->arrayName = class_basename($this->relationModel);
        $config->context = 'relation';
        $config->alias = $this->alias . 'ViewForm';

        $widget = $this->makeWidget(FormWidget::class, $config);
        $widget->previewMode = true;

        return $widget;
    }

    /**
     * makeListStructureConfig
     */
    protected function makeListStructureConfig(object $config): ?object
    {
        $structureConfig = $this->makeConfigForMode('view', 'structure');
        if (!$structureConfig) {
            return null;
        }

        if (
            $this->relationParent->isClassInstanceOf(\October\Contracts\Database\SortableRelationInterface::class) &&
            $this->relationParent->isSortableRelation($this->relationName)
        ) {
            $structureConfig->includeSortOrders = true;
        }

        return $this->mergeConfig($config, $structureConfig);
    }

    //
    // AJAX (Buttons)
    //

    /**
     * onRelationButtonAdd
     */
    public function onRelationButtonAdd()
    {
        return $this->onRelationManageForm();
    }

    /**
     * onRelationButtonCreate
     */
    public function onRelationButtonCreate()
    {
        return $this->onRelationManageForm();
    }

    /**
     * onRelationButtonDelete
     */
    public function onRelationButtonDelete()
    {
        return $this->onRelationManageDelete();
    }

    /**
     * onRelationButtonLink
     */
    public function onRelationButtonLink()
    {
        return $this->onRelationManageForm();
    }

    /**
     * onRelationButtonUnlink
     */
    public function onRelationButtonUnlink()
    {
        return $this->onRelationManageRemove();
    }

    /**
     * onRelationButtonRemove
     */
    public function onRelationButtonRemove()
    {
        return $this->onRelationManageRemove();
    }

    /**
     * onRelationButtonUpdate
     */
    public function onRelationButtonUpdate()
    {
        return $this->onRelationManageForm();
    }

    //
    // AJAX (List events)
    //

    /**
     * onRelationClickManageList
     */
    public function onRelationClickManageList()
    {
        return $this->onRelationManageAdd();
    }

    /**
     * onRelationClickManageListPivot
     */
    public function onRelationClickManageListPivot()
    {
        return $this->onRelationManagePivotForm();
    }

    /**
     * onRelationClickViewList
     */
    public function onRelationClickViewList()
    {
        return $this->onRelationManageForm();
    }

    /**
     * onRelationClickViewListPivot
     */
    public function onRelationClickViewListPivot()
    {
        return $this->onRelationManageForm();
    }

    /**
     * evalEventTarget determines the source of an AJAX event used for determining
     * the manage mode state. See the `evalManageMode` method.
     * @return string
     */
    protected function evalEventTarget()
    {
        switch ($this->controller->getAjaxHandler()) {
            case 'onRelationButtonAdd':
                return 'button-add';

            case 'onRelationButtonCreate':
                return 'button-create';

            case 'onRelationButtonLink':
                return 'button-link';

            case 'onRelationButtonUpdate':
                return 'button-update';

            case 'onRelationClickViewList':
                return 'list';

            default:
                return '';
        }
    }

    /**
     * evalViewMode determines the view mode based on the model relationship type
     * @return string
     */
    protected function evalViewMode()
    {
        if ($viewMode = $this->getConfig('manage[viewMode]')) {
            return $viewMode;
        }

        switch ($this->relationType) {
            case 'hasMany':
            case 'morphMany':
            case 'morphToMany':
            case 'morphedByMany':
            case 'belongsToMany':
            case 'hasManyThrough':
                return 'multi';

            case 'hasOne':
            case 'morphOne':
            case 'belongsTo':
                return 'single';

            default:
                return '';
        }
    }

    /**
     * resetViewWidgetModel is an internal method used when deleting singular relationships
     */
    protected function resetViewWidgetModel()
    {
        $this->viewFormWidget->model = $this->relationModel;
        $this->viewFormWidget->setFormValues([]);
    }
}
