<?php namespace Backend\Behaviors;

use DB;
use Str;
use Lang;
use Event;
use Form as FormHelper;
use Backend\Classes\ControllerBehavior;
use System\Classes\ApplicationException;
use October\Rain\Database\Model;

/**
 * Relation Controller Behavior
 * Uses a combination of lists and forms for managing Model relations.
 *
 * @package october\backend
 * @author Alexey Bobkov, Samuel Georges
 */
class RelationController extends ControllerBehavior
{
    /**
     * @var const Postback parameter for the active relationship field.
     */
    const PARAM_FIELD = '_relation_field';

    /**
     * @var Backend\Classes\WidgetBase Reference to the search widget object.
     */
    protected $searchWidget;

    /**
     * @var Backend\Classes\WidgetBase Reference to the toolbar widget object.
     */
    protected $toolbarWidget;

    /**
     * @var Backend\Classes\WidgetBase Reference to the widget used for viewing (list or form).
     */
    protected $viewWidget;

    /**
     * @var Backend\Classes\WidgetBase Reference to the widget used for relation management.
     */
    protected $manageWidget;

    /**
     * @var Backend\Classes\WidgetBase Reference to widget for relations with pivot data.
     */
    protected $pivotWidget;

    /**
     * {@inheritDoc}
     */
    protected $requiredProperties = ['relationConfig'];

    /**
     * @var array Properties that must exist for each relationship definition.
     */
    protected $requiredRelationProperties = ['label'];

    /**
     * @var array Configuration values that must exist when applying the primary config file.
     */
    protected $requiredConfig = [];

    /**
     * @var array Original configuration values
     */
    protected $originalConfig;

    /**
     * @var bool Has the behavior been initialized.
     */
    protected $initialized = false;

    /**
     * @var string Relationship type
     */
    public $relationType;

    /**
     * @var string Relationship name
     */
    public $relationName;

    /**
     * @var Model Relationship model
     */
    public $relationModel;

    /**
     * @var Model Relationship object
     */
    public $relationObject;

    /**
     * @var Model The parent model of the relationship.
     */
    protected $model;

    /**
     * @var Model The relationship field as defined in the configuration.
     */
    protected $field;

    /**
     * @var string A unique alias to pass to widgets.
     */
    protected $alias;

    /**
     * @var string Relation has many (multi) or has one (single).
     */
    protected $viewMode;

    /**
     * @var string Management of relation as list, form, or pivot.
     */
    protected $manageMode;

    /**
     * @var int Primary id of an existing relation record.
     */
    protected $manageId;

    /**
     * @var string Active session key, used for deferred bindings.
     */
    public $sessionKey;

    /**
     * @var bool Disables the ability to add, update, delete or create relations.
     */
    public $readOnly = false;

    /**
     * Behavior constructor
     * @param Backend\Classes\Controller $controller
     * @return void
     */
    public function __construct($controller)
    {
        parent::__construct($controller);

        $this->addJs('js/october.relation.js', 'core');
        $this->addCss('css/relation.css', 'core');

        /*
         * Build configuration
         */
        $this->config = $this->originalConfig = $this->makeConfig($controller->relationConfig, $this->requiredConfig);
    }

    /**
     * Prepare the widgets used by this behavior
     * @param Model $model
     * @param string $field
     * @return void
     */
    public function initRelation($model, $field = null)
    {
        if ($field == null)
            $field = post(self::PARAM_FIELD);

        $this->config = $this->originalConfig;
        $this->model = $model;
        $this->field = $field;

        if ($field == null)
            return;

        if (!$this->model)
            throw new ApplicationException(Lang::get('backend::lang.relation.missing_model', ['class'=>get_class($this->controller)]));

        if (!$this->model instanceof Model)
            throw new ApplicationException(Lang::get('backend::lang.model.invalid_class', ['model'=>get_class($this->model), 'class'=>get_class($this->controller)]));

        if (!$this->getConfig($field))
            throw new ApplicationException(Lang::get('backend::lang.relation.missing_definition', compact('field')));

        $this->alias = camel_case('relation ' . $field);
        $this->config = $this->makeConfig($this->getConfig($field), $this->requiredRelationProperties);

        /*
         * Relationship details
         */
        $this->relationName = $field;
        $this->relationType = $this->model->getRelationType($field);
        $this->relationObject = $this->model->{$field}();
        $this->relationModel = $this->relationObject->getRelated();

        $this->readOnly = $this->getConfig('readOnly');
        $this->viewMode = $this->evalViewMode();
        $this->manageMode = $this->evalManageMode();
        $this->manageId = post('manage_id');

        /*
         * Toolbar widget
         */
        if ($this->toolbarWidget = $this->makeToolbarWidget())
            $this->toolbarWidget->bindToController();

        /*
         * View widget
         */
        if ($this->viewWidget = $this->makeViewWidget())
            $this->viewWidget->bindToController();

        /*
         * Manage widget
         */
        if ($this->manageWidget = $this->makeManageWidget())
            $this->manageWidget->bindToController();

        /*
         * Pivot widget
         */
        if ($this->manageMode == 'pivot') {
            if ($this->pivotWidget = $this->makePivotWidget())
                $this->pivotWidget->bindToController();
        }
    }

    /**
     * Determine the view mode based on the model relationship type.
     * @return string
     */
    protected function evalViewMode()
    {
        switch ($this->relationType) {
            case 'hasMany':
            case 'belongsToMany':
                return 'multi';

            case 'hasOne':
            case 'belongsTo':
                return 'single';
        }
    }

    /**
     * Determine the management mode based on the relation type and settings.
     * @return string
     */
    protected function evalManageMode()
    {
        switch ($this->relationType) {
            case 'belongsToMany':
                $mode = (isset($this->config->pivot)) ? 'pivot' : 'list';
                break;

            case 'hasOne':
            case 'hasMany':
            case 'belongsTo':
                $mode = 'form';
                break;
        }

        return $mode;
    }

    /**
     * Renders the relationship manager.
     * @param string $field The relationship field.
     * @param array $options
     * @return string Rendered HTML for the relationship manager.
     */
    public function relationRender($field, $options = [])
    {
        $field = $this->validateField($field);

        if (is_string($options)) $options = ['sessionKey' => $options];

        $this->prepareVars();

        /*
         * Session key
         */
        if (isset($options['sessionKey']))
            $this->sessionKey = $options['sessionKey'];

        /*
         * Determine the partial to use based on the supplied section option
         */
        $section = (isset($options['section'])) ? $options['section'] : null;
        switch (strtolower($section)) {
            case 'toolbar':
                return $this->toolbarWidget ? $this->toolbarWidget->render() : null;

            case 'view':
                return $this->relationMakePartial('view');

            default:
                return $this->relationMakePartial('container');
        }
    }

    /**
     * Refreshes the relation container only, useful for returning in custom AJAX requests.
     * @param  string $field Relation definition.
     * @return array The relation element selector as the key, and the relation view contents are the value.
     */
    public function relationRefresh($field)
    {
        $field = $this->validateField($field);
        return ['#'.$this->relationGetId('view') => $this->relationRenderView()];
    }

    /**
     * Renders the toolbar only.
     * @param string $field The relationship field.
     * @return string Rendered HTML for the toolbar.
     */
    public function relationRenderToolbar($field = null)
    {
        return $this->relationRender($field, ['section' => 'toolbar']);
    }

    /**
     * Renders the view only.
     * @param string $field The relationship field.
     * @return string Rendered HTML for the view.
     */
    public function relationRenderView($field = null)
    {
        return $this->relationRender($field, ['section' => 'view']);
    }

    /**
     * Validates the supplied field and initializes the relation manager.
     * @param string $field The relationship field.
     * @return string The active field name.
     */
    protected function validateField($field = null)
    {
        $field = $field ?: post(self::PARAM_FIELD);

        if ($field && $field != $this->field)
            $this->initRelation($this->model, $field);

        if (!$field && !$this->field)
            throw new ApplicationException(Lang::get('backend::lang.relation.missing_definition', compact('field')));

        return $field ?: $this->field;
    }

    /**
     * Prepares the view data.
     * @return void
     */
    public function prepareVars()
    {
        $this->vars['relationManageId'] = $this->manageId;
        $this->vars['relationLabel'] = $this->config->label ?: $this->field;
        $this->vars['relationField'] = $this->field;
        $this->vars['relationType'] = $this->relationType;
        $this->vars['relationSearchWidget'] = $this->searchWidget;
        $this->vars['relationToolbarWidget'] = $this->toolbarWidget;
        $this->vars['relationManageWidget'] = $this->manageWidget;
        $this->vars['relationViewWidget'] = $this->viewWidget;
        $this->vars['relationPivotWidget'] = $this->pivotWidget;
    }

    /**
     * The controller action is responsible for supplying the parent model
     * so it's action must be fired. Additionally, each AJAX request must
     * supply the relation's field name (_relation_field).
     */
    protected function beforeAjax()
    {
        if ($this->initialized)
            return;

        $this->controller->pageAction();
        $this->validateField();
        $this->prepareVars();
        $this->initialized = true;
    }

    /**
     * Controller accessor for making partials within this behavior.
     * @param string $partial
     * @param array $params
     * @return string Partial contents
     */
    public function relationMakePartial($partial, $params = [])
    {
        $contents = $this->controller->makePartial('relation_'.$partial, $params + $this->vars, false);
        if (!$contents)
            $contents = $this->makePartial($partial, $params);

        return $contents;
    }

    /**
     * Returns a unique ID for this relation and field combination.
     * @param string $suffix A suffix to use with the identifier.
     * @return string
     */
    public function relationGetId($suffix = null)
    {
        $id = Str::getRealClass($this);
        if ($this->field)
            $id .= '-' . $this->field;

        if ($suffix !== null)
            $id .= '-' . $suffix;

        return $this->controller->getId($id);
    }

    /**
     * Returns the existing record IDs for the relation.
     */
    protected function findExistingRelationIds($checkIds = null)
    {
        $foreignKeyName = $this->relationModel->getKeyName();

        $results = $this->relationObject
            ->getBaseQuery()
            ->select($foreignKeyName);

        if ($checkIds !== null && is_array($checkIds) && count($checkIds))
            $results = $results->whereIn($foreignKeyName, $checkIds);

        return $results->lists($foreignKeyName);
    }

    //
    // AJAX
    //

    public function onRelationManageForm()
    {
        $this->beforeAjax();

        if ($this->manageMode == 'pivot' && $this->manageId)
            return $this->onRelationManagePivotForm();

        $view = 'manage_' . $this->manageMode;
        return $this->relationMakePartial($view);
    }

    /**
     * Create a new related model
     */
    public function onRelationManageCreate()
    {
        $this->beforeAjax();

        $saveData = $this->manageWidget->getSaveData();
        $this->relationObject->create($saveData, $this->relationGetSessionKey());

        return ['#'.$this->relationGetId('view') => $this->relationRenderView()];
    }

    /**
     * Updated an existing related model's fields
     */
    public function onRelationManageUpdate()
    {
        $this->beforeAjax();

        $saveData = $this->manageWidget->getSaveData();
        $this->relationObject->find($this->manageId)->save($saveData);

        return ['#'.$this->relationGetId('view') => $this->relationRenderView()];
    }

    /**
     * Delete an existing related model completely
     */
    public function onRelationManageDelete()
    {
        $this->beforeAjax();

        if (($checkedIds = post('checked')) && is_array($checkedIds)) {
            foreach ($checkedIds as $relationId) {
                if (!$obj = $this->relationObject->find($relationId))
                    continue;

                $obj->delete();
            }
        }

        return ['#'.$this->relationGetId('view') => $this->relationRenderView()];
    }

    /**
     * Add an existing related model to the primary model
     */
    public function onRelationManageAdd()
    {
        $this->beforeAjax();

        if ($this->viewMode != 'multi')
            throw new ApplicationException(Lang::get('backend::lang.relation.invalid_action_single'));

        if (($checkedIds = post('checked')) && is_array($checkedIds)) {
            /*
             * Remove existing relations from the array
             */
            $existingIds = $this->findExistingRelationIds($checkedIds);
            $checkedIds = array_diff($checkedIds, $existingIds);
            $foreignKeyName = $this->relationModel->getKeyName();

            $models = $this->relationModel->whereIn($foreignKeyName, $checkedIds)->get();
            foreach ($models as $model) {

                if ($this->model->exists)
                    $this->relationObject->add($model);
                else
                    $this->relationObject->add($model, $this->relationGetSessionKey());
            }
        }

        return ['#'.$this->relationGetId('view') => $this->relationRenderView()];
    }

    /**
     * Remove an existing related model from the primary model (join table only)
     */
    public function onRelationManageRemove()
    {
        $this->beforeAjax();

        if ($this->viewMode != 'multi')
            throw new ApplicationException(Lang::get('backend::lang.relation.invalid_action_single'));

        if (($checkedIds = post('checked')) && is_array($checkedIds)) {
            $this->relationObject->detach($checkedIds);
        }

        return ['#'.$this->relationGetId('view') => $this->relationRenderView()];
    }

    public function onRelationManagePivotForm()
    {
        $this->beforeAjax();

        $this->vars['foreignId'] = post('foreign_id');
        return $this->relationMakePartial('pivot_form');
    }

    public function onRelationManagePivotCreate()
    {
        $this->beforeAjax();

        $foreignId = post('foreign_id');
        $foreignModel = $this->relationModel->find($foreignId);
        $saveData = $this->pivotWidget->getSaveData();

        /*
         * Check for existing relation
         */
        $foreignKeyName = $this->relationModel->getKeyName();
        $existing = $this->relationObject->where($foreignKeyName, $foreignId)->count();

        if (!$existing)
            $this->relationObject->add($foreignModel, null, $saveData);

        return ['#'.$this->relationGetId('view') => $this->relationRenderView()];
    }

    public function onRelationManagePivotUpdate()
    {
        $this->beforeAjax();

        $saveData = $this->pivotWidget->getSaveData();
        $this->relationObject->updateExistingPivot($this->manageId, $saveData, true);

        return ['#'.$this->relationGetId('view') => $this->relationRenderView()];
    }

    //
    // Widgets
    //

    protected function makeSearchWidget()
    {
        $config = $this->makeConfig();
        $config->alias = $this->alias . 'ManageSearch';
        $config->growable = false;
        $config->prompt = 'backend::lang.list.search_prompt';
        $widget = $this->makeWidget('Backend\Widgets\Search', $config);
        $widget->cssClasses[] = 'recordfinder-search';
        return $widget;
    }

    protected function makeToolbarWidget()
    {
        if ($this->readOnly)
            return;

        $defaultConfig = [
            'buttons' => '@/modules/backend/behaviors/relationcontroller/partials/_toolbar.htm',
        ];
        $toolbarConfig = $this->makeConfig($this->getConfig('toolbar', $defaultConfig));
        $toolbarConfig->alias = $this->alias . 'Toolbar';

        /*
         * Add search to toolbar
         */
        if ($this->viewMode == 'multi' && $this->getConfig('view[showSearch]')) {
            $toolbarConfig->search = [
                'prompt' => 'backend::lang.list.search_prompt'
            ];
        }

        $toolbarWidget = $this->makeWidget('Backend\Widgets\Toolbar', $toolbarConfig);
        $toolbarWidget->cssClasses[] = 'list-header';

        return $toolbarWidget;
    }

    protected function makeViewWidget()
    {
        /*
         * Multiple (has many, belongs to many)
         */
        if ($this->viewMode == 'multi') {
            $config = $this->makeConfig($this->config->list);
            $config->model = $this->relationModel;
            $config->alias = $this->alias . 'ViewList';
            $config->showSorting = $this->getConfig('view[showSorting]', true);
            $config->defaultSort = $this->getConfig('view[defaultSort]');
            $config->recordsPerPage = $this->getConfig('view[recordsPerPage]');

            if (!$this->readOnly) {
                $config->recordOnClick = sprintf("$.oc.relationBehavior.clickManageListRecord(:id, '%s', '%s')", $this->field, $this->relationGetSessionKey());
                $config->showCheckboxes = true;
            }

            if ($emptyMessage = $this->getConfig('emptyMessage'))
                $config->noRecordsMessage = $emptyMessage;

            /*
             * Constrain the query by the relationship and deferred items
             */
            $widget = $this->makeWidget('Backend\Widgets\Lists', $config);
            $widget->bindEvent('list.extendQuery', function($query) {
                $this->relationObject->setQuery($query);
                if ($this->model->exists) {
                    $this->relationObject->addConstraints();
                }
                if ($sessionKey = $this->relationGetSessionKey()) {
                    $this->relationObject->withDeferred($sessionKey);
                }
            });

            /*
             * Constrain the list by the search widget, if available
             */
            if ($this->toolbarWidget && $this->getConfig('view[showSearch]')) {
                if ($searchWidget = $this->toolbarWidget->getSearchWidget()) {
                    $searchWidget->bindEvent('search.submit', function() use ($widget, $searchWidget) {
                        $widget->setSearchTerm($searchWidget->getActiveTerm());
                        return $widget->onRefresh();
                    });

                    $searchWidget->setActiveTerm(null);
                }
            }
        }
        /*
         * Single (belongs to, has one)
         */
        elseif ($this->viewMode == 'single') {
            $config = $this->makeConfig($this->config->form);
            $config->model = $this->relationModel;
            $config->arrayName = Str::getRealClass($this->relationModel);
            $config->context = 'relation';
            $config->alias = $this->alias . 'ViewForm';

            $widget = $this->makeWidget('Backend\Widgets\Form', $config);
        }

        return $widget;
    }

    protected function makeManageWidget()
    {
        $widget = null;
        /*
         * Pivot
         */
        if ($this->manageMode == 'pivot' && isset($this->config->list)) {
            $config = $this->makeConfig($this->config->list);
            $config->model = $this->relationModel;
            $config->alias = $this->alias . 'ManagePivotList';
            $config->showSetup = false;
            $config->recordOnClick = sprintf("$.oc.relationBehavior.clickManagePivotListRecord(:id, '%s', '%s')", $this->field, $this->relationGetSessionKey());
            $widget = $this->makeWidget('Backend\Widgets\Lists', $config);
        }
        /*
         * List
         */
        elseif ($this->manageMode == 'list' && isset($this->config->list)) {
            $config = $this->makeConfig($this->config->list);
            $config->model = $this->relationModel;
            $config->alias = $this->alias . 'ManageList';
            $config->showSetup = false;
            $config->showCheckboxes = true;
            $config->showSorting = $this->getConfig('manage[showSorting]', true);
            $config->defaultSort = $this->getConfig('manage[defaultSort]');
            $config->recordsPerPage = $this->getConfig('manage[recordsPerPage]');
            $widget = $this->makeWidget('Backend\Widgets\Lists', $config);

            /*
             * Link the Search Widget to the List Widget
             */
            if ($this->getConfig('manage[showSearch]')) {
                $this->searchWidget = $this->makeSearchWidget();
                $this->searchWidget->bindToController();
                $this->searchWidget->bindEvent('search.submit', function() use ($widget) {
                    $widget->setSearchTerm($this->searchWidget->getActiveTerm());
                    return $widget->onRefresh();
                });

                $this->searchWidget->setActiveTerm(null);
            }

        }
        /*
         * Form
         */
        elseif ($this->manageMode == 'form' && isset($this->config->form)) {
            $config = $this->makeConfig($this->config->form);
            $config->model = $this->relationModel;
            $config->arrayName = Str::getRealClass($this->relationModel);
            $config->context = 'relation';
            $config->alias = $this->alias . 'ManageForm';

            /*
             * Existing record
             */
            if ($this->manageId) {
                $config->model = $config->model->find($this->manageId);
                if (!$config->model) {
                    throw new ApplicationException(Lang::get('backend::lang.model.not_found', [
                        'class' => get_class($config->model), 'id' => $this->manageId
                    ]));
                }
            }

            $widget = $this->makeWidget('Backend\Widgets\Form', $config);
        }

        if (!$widget)
            return null;

        /*
         * Exclude existing relationships
         */
        if ($this->manageMode == 'pivot' || $this->manageMode == 'list') {
            $widget->bindEvent('list.extendQuery', function($query) {

                /*
                 * Where not in the current list of related records
                 */
                $existingIds = $this->findExistingRelationIds();
                if (count($existingIds)) {
                    $query->whereNotIn($this->relationModel->getQualifiedKeyName(), $existingIds);
                }

            });
        }

        return $widget;
    }

    protected function makePivotWidget()
    {
        $config = $this->makeConfig($this->config->pivot);
        $config->model = $this->relationModel;
        $config->arrayName = Str::getRealClass($this->relationModel);
        $config->context = 'relation';
        $config->alias = $this->alias . 'ManagePivotForm';

        /*
         * Existing record
         */
        if ($this->manageId) {
            $relations = $this->model->{$this->field};
            $config->model = $relations->find($this->manageId);

            if (!$config->model) {
                throw new ApplicationException(Lang::get('backend::lang.model.not_found', [
                    'class' => get_class($config->model), 'id' => $this->manageId
                ]));
            }

            $config->data = $config->model->pivot;
        }

        $widget = $this->makeWidget('Backend\Widgets\Form', $config);
        return $widget;
    }

    /**
     * Returns the active session key.
     */
    public function relationGetSessionKey()
    {
        if ($this->sessionKey)
            return $this->sessionKey;

        if (post('_session_key'))
            return $this->sessionKey = post('_session_key');

        return $this->sessionKey = FormHelper::getSessionKey();
    }

}