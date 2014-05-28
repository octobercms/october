<?php namespace Backend\Behaviors;

use DB;
use Str;
use Lang;
use Event;
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
     * @var Backend\Classes\WidgetBase Reference to the toolbar widget object.
     */
    private $toolbarWidget;

    /**
     * @var Backend\Classes\WidgetBase Reference to the widget used for viewing (list or form).
     */
    private $viewWidget;

    /**
     * @var Backend\Classes\WidgetBase Reference to the widget used for relation management.
     */
    private $manageWidget;

    /**
     * @var Backend\Classes\WidgetBase Reference to widget for relations with pivot data.
     */
    private $pivotWidget;

    /**
     * {@inheritDoc}
     */
    protected $requiredProperties = ['relationConfig'];

    /**
     * @var array Configuration values that must exist when applying the primary config file.
     */
    protected $requiredConfig = [];

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
     * @var bool Has the behavior been initialized.
     */
    protected $initialized = false;

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
     * Behavior constructor
     * @param Backend\Classes\Controller $controller
     * @return void
     */
    public function __construct($controller)
    {
        parent::__construct($controller);

        $this->addJs('js/october.relation.js', 'core');

        /*
         * Build configuration
         */
        $this->config = $this->makeConfig($controller->relationConfig, $this->requiredConfig);
    }

    /**
     * Prepare the widgets used by this behavior
     * @param Model $model
     * @param string $field
     * @return void
     */
    public function initRelation($model, $field = null)
    {
        $field = $field ?: post(self::PARAM_FIELD);

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
        $this->config = (object)$this->getConfig($field);

        /*
         * Relationship details
         */
        $this->relationName = $field;
        $this->relationType = $this->model->getRelationType($field);
        $this->relationObject = $this->model->{$field}();
        $this->relationModel = $this->relationObject->getRelated();

        $this->viewMode = $this->evalViewMode();
        $this->manageMode = $this->evalManageMode();
        $this->manageId = post('manage_id');

        /*
         * Toolbar widget
         */
        $this->toolbarWidget = $this->makeToolbarWidget();
        $this->toolbarWidget->bindToController();

        /*
         * View widget
         */
        $this->viewWidget = $this->makeViewWidget();
        $this->viewWidget->bindToController();

        /*
         * Manage widget
         */
        $this->manageWidget = $this->makeManageWidget();
        $this->manageWidget->bindToController();

        /*
         * Pivot widget
         */
        if ($this->manageMode == 'pivot') {
            $this->pivotWidget = $this->makePivotWidget();
            $this->pivotWidget->bindToController();
        }

        $this->initialized = true;
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

        $this->prepareVars();

        /*
         * Determine the partial to use based on the supplied section option
         */
        $section = (isset($options['section'])) ? $options['section'] : null;
        switch (strtolower($section)) {
            case 'toolbar':
                return $this->toolbarWidget->render();

            case 'view':
                return $this->makePartial('view');

            default:
                return $this->makePartial('container');
        }
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
    private function validateField($field)
    {
        if (!$this->initialized)
            $this->initRelation($this->model, $field);

        if ($field == null && !$this->initialized)
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
        $this->vars['relationViewWidget'] = $this->viewWidget;
        $this->vars['relationManageWidget'] = $this->manageWidget;
        $this->vars['relationToolbarWidget'] = $this->toolbarWidget;
        $this->vars['relationPivotWidget'] = $this->pivotWidget;
    }

    /**
     * The controller action is responsible for supplying the parent model
     * so it's action must be fired. Additionally, each AJAX request must
     * supply the relation's field name (_relation_field).
     */
    protected function beforeAjax()
    {
        if ($this->initialized) return;

        $this->controller->pageAction();
        $this->validateField(post(self::PARAM_FIELD));
        $this->prepareVars();
    }

    /**
     * Controller accessor for making partials within this behavior.
     * @param string $partial
     * @param array $params
     * @return string Partial contents
     */
    public function relationMakePartial($partial, $params = [])
    {
        return $this->makePartial($partial, $params);
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
    private function findExistingRelationIds($checkIds = null)
    {
        $results = $this->relationObject
            ->getBaseQuery()
            ->select('id');

        if ($checkIds !== null && is_array($checkIds) && count($checkIds))
            $results = $results->whereIn('id', $checkIds);

        return $results->lists('id');
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
        return $this->makePartial($view);
    }

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

            $models = $this->relationModel->whereIn('id', $checkedIds)->get();
            foreach ($models as $model) {
                $this->relationObject->add($model);
            }
        }

        return ['#'.$this->relationGetId('view') => $this->relationRenderView()];
    }

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

    public function onRelationManageCreate()
    {
        $this->beforeAjax();

        $saveData = $this->manageWidget->getSaveData();
        $this->relationObject->create($saveData);

        return ['#'.$this->relationGetId('view') => $this->relationRenderView()];
    }

    public function onRelationManageUpdate()
    {
        $this->beforeAjax();

        $saveData = $this->manageWidget->getSaveData();
        $this->relationObject->find($this->manageId)->save($saveData);

        return ['#'.$this->relationGetId('view') => $this->relationRenderView()];
    }

    public function onRelationManagePivotForm()
    {
        $this->beforeAjax();

        $this->vars['foreignId'] = post('foreign_id');
        return $this->makePartial('pivot_form');
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
        $existing = $this->relationObject->where('id', $foreignId)->count();

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

    protected function makeToolbarWidget()
    {
        $defaultConfig = [
            'buttons' => '@/modules/backend/behaviors/relationcontroller/partials/_toolbar.htm',
        ];
        $toolbarConfig = $this->makeConfig($this->getConfig('toolbar', $defaultConfig));
        $toolbarConfig->alias = $this->alias . 'Toolbar';
        return $this->makeWidget('Backend\Widgets\Toolbar', $toolbarConfig);
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
            $config->recordOnClick = sprintf("$.oc.relationBehavior.clickManageListRecord('%s', :id)", $this->field);
            $config->showCheckboxes = true;

            $widget = $this->makeWidget('Backend\Widgets\Lists', $config);
            $widget->bindEvent('list.extendQueryBefore', function($host, $query) {
                $this->relationObject->setQuery($query);
                $this->relationObject->addConstraints();
            });
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
        /*
         * Pivot
         */
        if ($this->manageMode == 'pivot') {
            $config = $this->makeConfig($this->config->list);
            $config->model = $this->relationModel;
            $config->alias = $this->alias . 'ManagePivotList';
            $config->showSetup = false;
            $config->recordOnClick = sprintf("$.oc.relationBehavior.clickManagePivotListRecord('%s', :id)", $this->field);
            $widget = $this->makeWidget('Backend\Widgets\Lists', $config);
        }
        /*
         * List
         */
        elseif ($this->manageMode == 'list') {
            $config = $this->makeConfig($this->config->list);
            $config->model = $this->relationModel;
            $config->alias = $this->alias . 'ManageList';
            $config->showSetup = false;
            $config->showCheckboxes = true;
            $widget = $this->makeWidget('Backend\Widgets\Lists', $config);
        }
        /*
         * Form
         */
        elseif ($this->manageMode == 'form') {
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

        /*
         * Exclude existing relationships
         */
        if ($this->manageMode == 'pivot' || $this->manageMode == 'list') {
            $widget->bindEvent('list.extendQueryBefore', function($host, $query) {

                /*
                 * Where not in the current list of related records
                 */
                $existingIds = $this->findExistingRelationIds();
                if (count($existingIds)) {
                    $query->whereNotIn('id', $existingIds);
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
}