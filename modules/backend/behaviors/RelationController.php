<?php namespace Backend\Behaviors;

use Db;
use Lang;
use Request;
use Form as FormHelper;
use Backend\Classes\ControllerBehavior;
use October\Rain\Database\Model;
use ApplicationException;

/**
 * Uses a combination of lists and forms for managing Model relations.
 *
 * This behavior is implemented in the controller like so:
 *
 *     public $implement = [
 *         'Backend.Behaviors.RelationController',
 *     ];
 *
 *     public $relationConfig = 'config_relation.yaml';
 *
 * The `$relationConfig` property makes reference to the configuration
 * values as either a YAML file, located in the controller view directory,
 * or directly as a PHP array.
 *
 * @package october\backend
 * @author Alexey Bobkov, Samuel Georges
 */
class RelationController extends ControllerBehavior
{
    use \Backend\Traits\FormModelSaver;

    /**
     * @var const Postback parameter for the active relationship field.
     */
    const PARAM_FIELD = '_relation_field';

    /**
     * @var const Postback parameter for the active management mode.
     */
    const PARAM_MODE = '_relation_mode';

    /**
     * @var const Postback parameter for read only mode.
     */
    const PARAM_EXTRA_CONFIG = '_relation_extra_config';

    /**
     * @var Backend\Widgets\Search Reference to the search widget object.
     */
    protected $searchWidget;

    /**
     * @var Backend\Widgets\Toolbar Reference to the toolbar widget object.
     */
    protected $toolbarWidget;

    /**
     * @var Backend\Classes\WidgetBase Reference to the widget used for viewing (list or form).
     */
    protected $viewWidget;

    /**
     * @var \Backend\Widgets\Filter Reference to the view filter widget.
     */
    protected $viewFilterWidget;

    /**
     * @var Backend\Classes\WidgetBase Reference to the widget used for relation management.
     */
    protected $manageWidget;

    /**
     * @var \Backend\Widgets\Filter Reference to the manage filter widget.
     */
    protected $manageFilterWidget;

    /**
     * @var Backend\Classes\WidgetBase Reference to widget for relations with pivot data.
     */
    protected $pivotWidget;

    /**
     * @inheritDoc
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
     * @var array Visible actions in context of the controller
     */
    protected $actions = [];

    /**
     * @var array Original configuration values
     */
    protected $originalConfig;

    /**
     * @var array Config provided by the relationRender method
     */
    protected $extraConfig;

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
     * @var array The set of buttons to display in view mode.
     */
    protected $toolbarButtons;

    /**
     * @var Model Reference to the model used for viewing (form only).
     */
    protected $viewModel;

    /**
     * @var string Relation has many (multi) or has one (single).
     */
    protected $viewMode;

    /**
     * @var string The title used for the manage popup.
     */
    protected $manageTitle;

    /**
     * @var string Management of relation as list, form, or pivot.
     */
    protected $manageMode;

    /**
     * @var string Force a certain view mode.
     */
    protected $forceViewMode;

    /**
     * @var string Force a certain manage mode.
     */
    protected $forceManageMode;

    /**
     * @var string The target that triggered an AJAX event (button, list)
     */
    protected $eventTarget;

    /**
     * @var int Primary id of an existing relation record.
     */
    protected $manageId;

    /**
     * @var int Foeign id of a selected pivot record.
     */
    protected $foreignId;

    /**
     * @var string Active session key, used for deferred bindings.
     */
    public $sessionKey;

    /**
     * @var bool Disables the ability to add, update, delete or create relations.
     */
    public $readOnly = false;

    /**
     * @var bool Defers all binding actions using a session key when it is available.
     */
    public $deferredBinding = false;

    /**
     * Behavior constructor
     * @param Backend\Classes\Controller $controller
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
     * Validates the supplied field and initializes the relation manager.
     * @param string $field The relationship field.
     * @return string The active field name.
     */
    protected function validateField($field = null)
    {
        $field = $field ?: post(self::PARAM_FIELD);

        if ($field && $field != $this->field) {
            $this->initRelation($this->model, $field);
        }

        if (!$field && !$this->field) {
            throw new ApplicationException(Lang::get('backend::lang.relation.missing_definition', compact('field')));
        }

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
        $this->vars['relationManageTitle'] = $this->manageTitle;
        $this->vars['relationField'] = $this->field;
        $this->vars['relationType'] = $this->relationType;
        $this->vars['relationSearchWidget'] = $this->searchWidget;
        $this->vars['relationManageFilterWidget'] = $this->manageFilterWidget;
        $this->vars['relationViewFilterWidget'] = $this->viewFilterWidget;
        $this->vars['relationToolbarWidget'] = $this->toolbarWidget;
        $this->vars['relationManageMode'] = $this->manageMode;
        $this->vars['relationManageWidget'] = $this->manageWidget;
        $this->vars['relationToolbarButtons'] = $this->toolbarButtons;
        $this->vars['relationViewMode'] = $this->viewMode;
        $this->vars['relationViewWidget'] = $this->viewWidget;
        $this->vars['relationViewModel'] = $this->viewModel;
        $this->vars['relationPivotWidget'] = $this->pivotWidget;
        $this->vars['relationSessionKey'] = $this->relationGetSessionKey();
        $this->vars['relationExtraConfig'] = $this->extraConfig;
    }

    /**
     * The controller action is responsible for supplying the parent model
     * so it's action must be fired. Additionally, each AJAX request must
     * supply the relation's field name (_relation_field).
     */
    protected function beforeAjax()
    {
        if ($this->initialized) {
            return;
        }

        $this->controller->pageAction();
        if ($fatalError = $this->controller->getFatalError()) {
            throw new ApplicationException($fatalError);
        }

        $this->validateField();
        $this->prepareVars();
        $this->initialized = true;
    }

    //
    // Interface
    //

    /**
     * Prepare the widgets used by this behavior
     * @param Model $model
     * @param string $field
     * @return void
     */
    public function initRelation($model, $field = null)
    {
        if ($field == null) {
            $field = post(self::PARAM_FIELD);
        }

        $this->config = $this->originalConfig;
        $this->model = $model;
        $this->field = $field;

        if ($field == null) {
            return;
        }

        if (!$this->model) {
            throw new ApplicationException(Lang::get('backend::lang.relation.missing_model', [
                'class' => get_class($this->controller),
            ]));
        }

        if (!$this->model instanceof Model) {
            throw new ApplicationException(Lang::get('backend::lang.model.invalid_class', [
                'model' => get_class($this->model),
                'class' => get_class($this->controller),
            ]));
        }

        if (!$this->getConfig($field)) {
            throw new ApplicationException(Lang::get('backend::lang.relation.missing_definition', compact('field')));
        }

        if ($extraConfig = post(self::PARAM_EXTRA_CONFIG)) {
            $this->applyExtraConfig($extraConfig);
        }

        $this->alias = camel_case('relation ' . $field);
        $this->config = $this->makeConfig($this->getConfig($field), $this->requiredRelationProperties);
        $this->controller->relationExtendConfig($this->config, $this->field, $this->model);

        /*
         * Relationship details
         */
        $this->relationName = $field;
        $this->relationType = $this->model->getRelationType($field);
        $this->relationObject = $this->model->{$field}();
        $this->relationModel = $this->relationObject->getRelated();

        $this->manageId = post('manage_id');
        $this->foreignId = post('foreign_id');
        $this->readOnly = $this->getConfig('readOnly');
        $this->deferredBinding = $this->getConfig('deferredBinding') || !$this->model->exists;
        $this->viewMode = $this->evalViewMode();
        $this->manageMode = $this->evalManageMode();
        $this->manageTitle = $this->evalManageTitle();
        $this->toolbarButtons = $this->evalToolbarButtons();

        /*
         * Toolbar widget
         */
        if ($this->toolbarWidget = $this->makeToolbarWidget()) {
            $this->toolbarWidget->bindToController();
        }

        /*
         * Search widget
         */
        if ($this->searchWidget = $this->makeSearchWidget()) {
            $this->searchWidget->bindToController();
        }

        /*
         * Filter widgets (optional)
         */
        if ($this->manageFilterWidget = $this->makeFilterWidget('manage')) {
            $this->controller->relationExtendManageFilterWidget($this->manageFilterWidget, $this->field, $this->model);
            $this->manageFilterWidget->bindToController();
        }

        if ($this->viewFilterWidget = $this->makeFilterWidget('view')) {
            $this->controller->relationExtendViewFilterWidget($this->viewFilterWidget, $this->field, $this->model);
            $this->viewFilterWidget->bindToController();
        }

        /*
         * View widget
         */
        if ($this->viewWidget = $this->makeViewWidget()) {
            $this->controller->relationExtendViewWidget($this->viewWidget, $this->field, $this->model);
            $this->viewWidget->bindToController();
        }

        /*
         * Manage widget
         */
        if ($this->manageWidget = $this->makeManageWidget()) {
            $this->controller->relationExtendManageWidget($this->manageWidget, $this->field, $this->model);
            $this->manageWidget->bindToController();
        }

        /*
         * Pivot widget
         */
        if ($this->manageMode == 'pivot' && $this->pivotWidget = $this->makePivotWidget()) {
            $this->controller->relationExtendPivotWidget($this->pivotWidget, $this->field, $this->model);
            $this->pivotWidget->bindToController();
        }
    }

    /**
     * Renders the relationship manager.
     * @param string $field The relationship field.
     * @param array $options
     * @return string Rendered HTML for the relationship manager.
     */
    public function relationRender($field, $options = [])
    {
        /*
         * Session key
         */
        if (is_string($options)) {
            $options = ['sessionKey' => $options];
        }

        if (isset($options['sessionKey'])) {
            $this->sessionKey = $options['sessionKey'];
        }

        /*
         * Apply options and extra config
         */
        $allowConfig = ['readOnly', 'recordUrl', 'recordOnClick'];
        $extraConfig = array_only($options, $allowConfig);
        $this->extraConfig = $extraConfig;
        $this->applyExtraConfig($extraConfig, $field);

        /*
         * Initialize
         */
        $this->validateField($field);
        $this->prepareVars();

        /*
         * Determine the partial to use based on the supplied section option
         */
        $section = $options['section'] ?? null;
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
    public function relationRefresh($field = null)
    {
        $field = $this->validateField($field);

        $result = ['#'.$this->relationGetId('view') => $this->relationRenderView($field)];
        if ($toolbar = $this->relationRenderToolbar($field)) {
            $result['#'.$this->relationGetId('toolbar')] = $toolbar;
        }

        if ($eventResult = $this->controller->relationExtendRefreshResults($field)) {
            $result = $eventResult + $result;
        }

        return $result;
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
     * Controller accessor for making partials within this behavior.
     * @param string $partial
     * @param array $params
     * @return string Partial contents
     */
    public function relationMakePartial($partial, $params = [])
    {
        $contents = $this->controller->makePartial('relation_'.$partial, $params + $this->vars, false);
        if (!$contents) {
            $contents = $this->makePartial($partial, $params);
        }

        return $contents;
    }

    /**
     * Returns a unique ID for this relation and field combination.
     * @param string $suffix A suffix to use with the identifier.
     * @return string
     */
    public function relationGetId($suffix = null)
    {
        $id = class_basename($this);
        if ($this->field) {
            $id .= '-' . $this->field;
        }

        if ($suffix !== null) {
            $id .= '-' . $suffix;
        }

        return $this->controller->getId($id);
    }

    /**
     * Returns the active session key.
     */
    public function relationGetSessionKey($force = false)
    {
        if ($this->sessionKey && !$force) {
            return $this->sessionKey;
        }

        if (post('_relation_session_key')) {
            return $this->sessionKey = post('_relation_session_key');
        }

        if (post('_session_key')) {
            return $this->sessionKey = post('_session_key');
        }

        return $this->sessionKey = FormHelper::getSessionKey();
    }

    //
    // Widgets
    //

    /**
     * Initialize a filter widget
     *
     * @param $type string Either 'manage' or 'view'
     * @return \Backend\Classes\WidgetBase|null
     */
    protected function makeFilterWidget($type)
    {
        if (!$this->getConfig($type . '[filter]')) {
            return null;
        }

        $filterConfig = $this->makeConfig($this->getConfig($type . '[filter]'));
        $filterConfig->alias = $this->alias . ucfirst($type) . 'Filter';
        $filterWidget = $this->makeWidget('Backend\Widgets\Filter', $filterConfig);

        return $filterWidget;
    }


    protected function makeToolbarWidget()
    {
        $defaultConfig = [];

        /*
         * Add buttons to toolbar
         */
        $defaultButtons = null;

        if (!$this->readOnly && $this->toolbarButtons) {
            $defaultButtons = '~/modules/backend/behaviors/relationcontroller/partials/_toolbar.htm';
        }

        $defaultConfig['buttons'] = $this->getConfig('view[toolbarPartial]', $defaultButtons);

        /*
         * Make config
         */
        $toolbarConfig = $this->makeConfig($this->getConfig('toolbar', $defaultConfig));
        $toolbarConfig->alias = $this->alias . 'Toolbar';

        /*
         * Add search to toolbar
         */
        $useSearch = $this->viewMode == 'multi' && $this->getConfig('view[showSearch]');

        if ($useSearch) {
            $toolbarConfig->search = [
                'prompt' => 'backend::lang.list.search_prompt'
            ];
        }

        /*
         * No buttons, no search should mean no toolbar
         */
        if (empty($toolbarConfig->search) && empty($toolbarConfig->buttons)) {
            return;
        }

        $toolbarWidget = $this->makeWidget('Backend\Widgets\Toolbar', $toolbarConfig);
        $toolbarWidget->cssClasses[] = 'list-header';

        return $toolbarWidget;
    }

    protected function makeSearchWidget()
    {
        if (!$this->getConfig('manage[showSearch]')) {
            return null;
        }

        $config = $this->makeConfig();
        $config->alias = $this->alias . 'ManageSearch';
        $config->growable = false;
        $config->prompt = 'backend::lang.list.search_prompt';
        $widget = $this->makeWidget('Backend\Widgets\Search', $config);
        $widget->cssClasses[] = 'recordfinder-search';

        /*
         * Persist the search term across AJAX requests only
         */
        if (!Request::ajax()) {
            $widget->setActiveTerm(null);
        }

        return $widget;
    }

    protected function makeViewWidget()
    {
        $widget = null;

        /*
         * Multiple (has many, belongs to many)
         */
        if ($this->viewMode == 'multi') {
            $config = $this->makeConfigForMode('view', 'list');
            $config->model = $this->relationModel;
            $config->alias = $this->alias . 'ViewList';
            $config->showSorting = $this->getConfig('view[showSorting]', true);
            $config->defaultSort = $this->getConfig('view[defaultSort]');
            $config->recordsPerPage = $this->getConfig('view[recordsPerPage]');
            $config->showCheckboxes = $this->getConfig('view[showCheckboxes]', !$this->readOnly);
            $config->recordUrl = $this->getConfig('view[recordUrl]', null);
            $config->customViewPath = $this->getConfig('view[customViewPath]', null);

            $defaultOnClick = sprintf(
                "$.oc.relationBehavior.clickViewListRecord(':%s', '%s', '%s')",
                $this->relationModel->getKeyName(),
                $this->relationGetId(),
                $this->relationGetSessionKey()
            );

            if ($config->recordUrl) {
                $defaultOnClick = null;
            }
            elseif (
                !$this->makeConfigForMode('manage', 'form', false) &&
                !$this->makeConfigForMode('pivot', 'form', false)
            ) {
                $defaultOnClick = null;
            }

            $config->recordOnClick = $this->getConfig('view[recordOnClick]', $defaultOnClick);

            if ($emptyMessage = $this->getConfig('emptyMessage')) {
                $config->noRecordsMessage = $emptyMessage;
            }

            $widget = $this->makeWidget('Backend\Widgets\Lists', $config);

            /*
             * Apply defined constraints
             */
            if ($sqlConditions = $this->getConfig('view[conditions]')) {
                $widget->bindEvent('list.extendQueryBefore', function ($query) use ($sqlConditions) {
                    $query->whereRaw($sqlConditions);
                });
            }
            elseif ($scopeMethod = $this->getConfig('view[scope]')) {
                $widget->bindEvent('list.extendQueryBefore', function ($query) use ($scopeMethod) {
                    $query->$scopeMethod($this->model);
                });
            }
            else {
                $widget->bindEvent('list.extendQueryBefore', function ($query) use ($widget) {
                    $this->relationObject->addDefinedConstraintsToQuery($query);
                    if ($widget->getSortColumn()) {
                        $query->getQuery()->orders = [];
                    }
                });
            }

            /*
             * Constrain the query by the relationship and deferred items
             */
            $widget->bindEvent('list.extendQuery', function ($query) {
                $this->relationObject->setQuery($query);

                $sessionKey = $this->deferredBinding ? $this->relationGetSessionKey() : null;

                if ($sessionKey) {
                    $this->relationObject->withDeferred($sessionKey);
                }
                elseif ($this->model->exists) {
                    $this->relationObject->addConstraints();
                }

                /*
                 * Allows pivot data to enter the fray
                 */
                if ($this->relationType == 'belongsToMany'
                    || $this->relationType == 'morphToMany'
                    || $this->relationType == 'morphedByMany'
                ) {
                    $this->relationObject->setQuery($query->getQuery());
                    return $this->relationObject;
                }
            });

            /*
             * Constrain the list by the search widget, if available
             */
            if ($this->toolbarWidget && $this->getConfig('view[showSearch]')
                && $searchWidget = $this->toolbarWidget->getSearchWidget()
            ) {
                $searchWidget->bindEvent('search.submit', function () use ($widget, $searchWidget) {
                    $widget->setSearchTerm($searchWidget->getActiveTerm());
                    return $widget->onRefresh();
                });

                /*
                 * Persist the search term across AJAX requests only
                 */
                if (Request::ajax()) {
                    $widget->setSearchTerm($searchWidget->getActiveTerm());
                }
                else {
                    $searchWidget->setActiveTerm(null);
                }
            }

            /*
             * Link the Filter Widget to the List Widget
             */
            if ($this->viewFilterWidget) {
                $this->viewFilterWidget->bindEvent('filter.update', function () use ($widget) {
                    return $widget->onFilter();
                });

                // Apply predefined filter values
                $widget->addFilter([$this->viewFilterWidget, 'applyAllScopesToQuery']);
            }
        }
        /*
         * Single (belongs to, has one)
         */
        elseif ($this->viewMode == 'single') {
            $this->viewModel = $this->relationObject->getResults()
                ?: $this->relationModel;

            $config = $this->makeConfigForMode('view', 'form');
            $config->model = $this->viewModel;
            $config->arrayName = class_basename($this->relationModel);
            $config->context = 'relation';
            $config->alias = $this->alias . 'ViewForm';

            $widget = $this->makeWidget('Backend\Widgets\Form', $config);
            $widget->previewMode = true;
        }

        return $widget;
    }

    protected function makeManageWidget()
    {
        $widget = null;

        /*
         * List / Pivot
         */
        if ($this->manageMode == 'list' || $this->manageMode == 'pivot') {
            $isPivot = $this->manageMode == 'pivot';

            $config = $this->makeConfigForMode('manage', 'list');
            $config->model = $this->relationModel;
            $config->alias = $this->alias . 'ManageList';
            $config->showSetup = false;
            $config->showCheckboxes = $this->getConfig('manage[showCheckboxes]', !$isPivot);
            $config->showSorting = $this->getConfig('manage[showSorting]', !$isPivot);
            $config->defaultSort = $this->getConfig('manage[defaultSort]');
            $config->recordsPerPage = $this->getConfig('manage[recordsPerPage]');

            if ($this->viewMode == 'single') {
                $config->showCheckboxes = false;
                $config->recordOnClick = sprintf(
                    "$.oc.relationBehavior.clickManageListRecord(':%s', '%s', '%s')",
                    $this->relationModel->getKeyName(),
                    $this->relationGetId(),
                    $this->relationGetSessionKey()
                );
            }
            elseif ($config->showCheckboxes) {
                $config->recordOnClick = "$.oc.relationBehavior.toggleListCheckbox(this)";
            }
            elseif ($isPivot) {
                $config->recordOnClick = sprintf(
                    "$.oc.relationBehavior.clickManagePivotListRecord(':%s', '%s', '%s')",
                    $this->relationModel->getKeyName(),
                    $this->relationGetId(),
                    $this->relationGetSessionKey()
                );
            }

            $widget = $this->makeWidget('Backend\Widgets\Lists', $config);

            /*
             * Apply defined constraints
             */
            if ($sqlConditions = $this->getConfig('manage[conditions]')) {
                $widget->bindEvent('list.extendQueryBefore', function ($query) use ($sqlConditions) {
                    $query->whereRaw($sqlConditions);
                });
            }
            elseif ($scopeMethod = $this->getConfig('manage[scope]')) {
                $widget->bindEvent('list.extendQueryBefore', function ($query) use ($scopeMethod) {
                    $query->$scopeMethod($this->model);
                });
            }
            else {
                $widget->bindEvent('list.extendQueryBefore', function ($query) use ($widget) {
                    $this->relationObject->addDefinedConstraintsToQuery($query);
                    if ($widget->getSortColumn()) {
                        $query->getQuery()->orders = [];
                    }
                });
            }

            /*
             * Link the Search Widget to the List Widget
             */
            if ($this->searchWidget) {
                $this->searchWidget->bindEvent('search.submit', function () use ($widget) {
                    $widget->setSearchTerm($this->searchWidget->getActiveTerm());
                    return $widget->onRefresh();
                });

                /*
                 * Persist the search term across AJAX requests only
                 */
                if (Request::ajax()) {
                    $widget->setSearchTerm($this->searchWidget->getActiveTerm());
                }
            }

            /*
             * Link the Filter Widget to the List Widget
             */
            if ($this->manageFilterWidget) {
                $this->manageFilterWidget->bindEvent('filter.update', function () use ($widget) {
                    return $widget->onFilter();
                });

                // Apply predefined filter values
                $widget->addFilter([$this->manageFilterWidget, 'applyAllScopesToQuery']);
            }
        }
        /*
         * Form
         */
        elseif ($this->manageMode == 'form') {
            if (!$config = $this->makeConfigForMode('manage', 'form', false)) {
                return null;
            }

            $config->model = $this->relationModel;
            $config->arrayName = class_basename($this->relationModel);
            $config->context = $this->evalFormContext('manage', !!$this->manageId);
            $config->alias = $this->alias . 'ManageForm';

            /*
             * Existing record
             */
            if ($this->manageId) {
                $model = $config->model->find($this->manageId);
                if ($model) {
                    $config->model = $model;
                } else {
                    throw new ApplicationException(Lang::get('backend::lang.model.not_found', [
                        'class' => get_class($config->model),
                        'id' => $this->manageId,
                    ]));
                }
            }

            $widget = $this->makeWidget('Backend\Widgets\Form', $config);
        }

        if (!$widget) {
            return null;
        }

        /*
         * Exclude existing relationships
         */
        if ($this->manageMode == 'pivot' || $this->manageMode == 'list') {
            $widget->bindEvent('list.extendQuery', function ($query) {
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
        $config = $this->makeConfigForMode('pivot', 'form');
        $config->model = $this->relationModel;
        $config->arrayName = class_basename($this->relationModel);
        $config->context = $this->evalFormContext('pivot', !!$this->manageId);
        $config->alias = $this->alias . 'ManagePivotForm';

        $foreignKeyName = $this->relationModel->getQualifiedKeyName();

        /*
         * Existing record
         */
        if ($this->manageId) {
            $hydratedModel = $this->relationObject->where($foreignKeyName, $this->manageId)->first();

            if ($hydratedModel) {
                $config->model = $hydratedModel;
            } else {
                throw new ApplicationException(Lang::get('backend::lang.model.not_found', [
                    'class' => get_class($config->model),
                    'id' => $this->manageId,
                ]));
            }
        }
        /*
         * New record
         */
        else {
            if ($this->foreignId) {
                $foreignModel = $this->relationModel
                    ->whereIn($foreignKeyName, (array) $this->foreignId)
                    ->first();

                if ($foreignModel) {
                    $foreignModel->exists = false;
                    $config->model = $foreignModel;
                }
            }

            $pivotModel = $this->relationObject->newPivot();
            $config->model->setRelation('pivot', $pivotModel);
        }

        return $this->makeWidget('Backend\Widgets\Form', $config);
    }

    //
    // AJAX (Buttons)
    //

    public function onRelationButtonAdd()
    {
        $this->eventTarget = 'button-add';

        return $this->onRelationManageForm();
    }

    public function onRelationButtonCreate()
    {
        $this->eventTarget = 'button-create';

        return $this->onRelationManageForm();
    }

    public function onRelationButtonDelete()
    {
        return $this->onRelationManageDelete();
    }

    public function onRelationButtonLink()
    {
        $this->eventTarget = 'button-link';

        return $this->onRelationManageForm();
    }

    public function onRelationButtonUnlink()
    {
        return $this->onRelationManageRemove();
    }

    public function onRelationButtonRemove()
    {
        return $this->onRelationManageRemove();
    }

    public function onRelationButtonUpdate()
    {
        $this->eventTarget = 'button-update';

        return $this->onRelationManageForm();
    }

    //
    // AJAX (List events)
    //

    public function onRelationClickManageList()
    {
        return $this->onRelationManageAdd();
    }

    public function onRelationClickManageListPivot()
    {
        return $this->onRelationManagePivotForm();
    }

    public function onRelationClickViewList()
    {
        $this->eventTarget = 'list';
        return $this->onRelationManageForm();
    }

    //
    // AJAX
    //

    public function onRelationManageForm()
    {
        $this->beforeAjax();

        if ($this->manageMode == 'pivot' && $this->manageId) {
            return $this->onRelationManagePivotForm();
        }

        // The form should not share its session key with the parent
        $this->vars['newSessionKey'] = str_random(40);

        $view = 'manage_' . $this->manageMode;

        return $this->relationMakePartial($view);
    }

    /**
     * Create a new related model
     */
    public function onRelationManageCreate()
    {
        $this->forceManageMode = 'form';
        $this->beforeAjax();
        $saveData = $this->manageWidget->getSaveData();
        $sessionKey = $this->deferredBinding ? $this->relationGetSessionKey(true) : null;

        if ($this->viewMode == 'multi') {
            $newModel = $this->relationModel;

            /*
             * In special cases, has one/many will require a foreign key set
             * to pass any constraints imposed by the database. This emulates
             * the "create" method on the relation object.
             */
            if (in_array($this->relationType, ['hasOne', 'hasMany'])) {
                $newModel->setAttribute(
                    $this->relationObject->getForeignKeyName(),
                    $this->relationObject->getParentKey()
                );
            }

            $modelsToSave = $this->prepareModelsToSave($newModel, $saveData);
            foreach ($modelsToSave as $modelToSave) {
                $modelToSave->save(null, $this->manageWidget->getSessionKey());
            }

            $this->relationObject->add($newModel, $sessionKey);
        }
        elseif ($this->viewMode == 'single') {
            $newModel = $this->manageWidget->model;
            $this->viewWidget->setFormValues($saveData);

            /*
             * Has one relations will save as part of the add() call.
             */
            if ($this->deferredBinding || $this->relationType != 'hasOne') {
                $newModel->save(null, $this->manageWidget->getSessionKey());
            }

            $this->relationObject->add($newModel, $sessionKey);

            /*
             * Belongs to relations won't save when using add() so
             * it should occur if the conditions are right.
             */
            if (!$this->deferredBinding && $this->relationType == 'belongsTo') {
                $parentModel = $this->relationObject->getParent();
                if ($parentModel->exists) {
                    $parentModel->save();
                }
            }
        }

        return $this->relationRefresh();
    }

    /**
     * Updated an existing related model's fields
     */
    public function onRelationManageUpdate()
    {
        $this->forceManageMode = 'form';
        $this->beforeAjax();
        $saveData = $this->manageWidget->getSaveData();

        if ($this->viewMode == 'multi') {
            $model = $this->manageWidget->model;
            $modelsToSave = $this->prepareModelsToSave($model, $saveData);
            foreach ($modelsToSave as $modelToSave) {
                $modelToSave->save(null, $this->manageWidget->getSessionKey());
            }
        }
        elseif ($this->viewMode == 'single') {
            $this->viewModel = $this->manageWidget->model;

            $this->viewWidget->setFormValues($saveData);
            $this->viewModel->save(null, $this->manageWidget->getSessionKey());
        }

        return $this->relationRefresh();
    }

    /**
     * Delete an existing related model completely
     */
    public function onRelationManageDelete()
    {
        $this->beforeAjax();

        /*
         * Multiple (has many, belongs to many)
         */
        if ($this->viewMode == 'multi') {
            if (($checkedIds = post('checked')) && is_array($checkedIds)) {
                foreach ($checkedIds as $relationId) {
                    if (!$obj = $this->relationModel->find($relationId)) {
                        continue;
                    }

                    $obj->delete();
                }
            }
        }
        /*
         * Single (belongs to, has one)
         */
        elseif ($this->viewMode == 'single') {
            $relatedModel = $this->viewModel;
            if ($relatedModel->exists) {
                $relatedModel->delete();
            }

            // Reinitialise the form with a blank model
            $this->initRelation($this->model);

            $this->viewWidget->setFormValues([]);
            $this->viewModel = $this->relationModel;
        }

        return $this->relationRefresh();
    }

    /**
     * Add an existing related model to the primary model
     */
    public function onRelationManageAdd()
    {
        $this->beforeAjax();

        $recordId = post('record_id');
        $sessionKey = $this->deferredBinding ? $this->relationGetSessionKey() : null;

        /*
         * Add
         */
        if ($this->viewMode == 'multi') {
            $checkedIds = $recordId ? [$recordId] : post('checked');

            if (is_array($checkedIds)) {
                /*
                 * Remove existing relations from the array
                 */
                $existingIds = $this->findExistingRelationIds($checkedIds);
                $checkedIds = array_diff($checkedIds, $existingIds);
                $foreignKeyName = $this->relationModel->getKeyName();

                $models = $this->relationModel->whereIn($foreignKeyName, $checkedIds)->get();
                foreach ($models as $model) {
                    $this->relationObject->add($model, $sessionKey);
                }
            }
        }
        /*
         * Link
         */
        elseif ($this->viewMode == 'single') {
            if ($recordId && ($model = $this->relationModel->find($recordId))) {
                $this->relationObject->add($model, $sessionKey);
                $this->viewWidget->setFormValues($model->attributes);

                /*
                 * Belongs to relations won't save when using add() so
                 * it should occur if the conditions are right.
                 */
                if (!$this->deferredBinding && $this->relationType == 'belongsTo') {
                    $parentModel = $this->relationObject->getParent();
                    if ($parentModel->exists) {
                        $parentModel->save();
                    }
                }
            }
        }

        return $this->relationRefresh();
    }

    /**
     * Remove an existing related model from the primary model
     */
    public function onRelationManageRemove()
    {
        $this->beforeAjax();

        $recordId = post('record_id');
        $sessionKey = $this->deferredBinding ? $this->relationGetSessionKey() : null;
        $relatedModel = $this->relationModel;

        /*
         * Remove
         */
        if ($this->viewMode == 'multi') {
            $checkedIds = $recordId ? [$recordId] : post('checked');

            if (is_array($checkedIds)) {
                $foreignKeyName = $relatedModel->getKeyName();

                $models = $relatedModel->whereIn($foreignKeyName, $checkedIds)->get();
                foreach ($models as $model) {
                    $this->relationObject->remove($model, $sessionKey);
                }
            }
        }
        /*
         * Unlink
         */
        elseif ($this->viewMode == 'single') {
            if ($this->relationType == 'belongsTo') {
                $this->relationObject->dissociate();
                $this->relationObject->getParent()->save();

                // If the relation manager isn't using deferred binding, reinitialise the form with a blank model
                if (is_null($sessionKey)) {
                    $this->model->refresh();
                    $this->initRelation($this->model);
                }
            }
            elseif ($this->relationType == 'hasOne' || $this->relationType == 'morphOne') {
                if ($obj = $relatedModel->find($recordId)) {
                    $this->relationObject->remove($obj, $sessionKey);
                }
                elseif ($this->viewModel->exists) {
                    $this->relationObject->remove($this->viewModel, $sessionKey);
                }
            }

            $this->viewWidget->setFormValues([]);
        }

        return $this->relationRefresh();
    }

    /**
     * Add multiple items using a single pivot form.
     */
    public function onRelationManageAddPivot()
    {
        return $this->onRelationManagePivotForm();
    }

    public function onRelationManagePivotForm()
    {
        $this->beforeAjax();

        $this->vars['foreignId'] = $this->foreignId ?: post('checked');

        return $this->relationMakePartial('pivot_form');
    }

    public function onRelationManagePivotCreate()
    {
        $this->beforeAjax();

        /*
         * If the pivot model fails for some reason, abort the sync
         */
        Db::transaction(function () {
            /*
             * Add the checked IDs to the pivot table
             */
            $foreignIds = (array) $this->foreignId;
            $this->relationObject->sync($foreignIds, false);

            /*
             * Save data to models
             */
            $foreignKeyName = $this->relationModel->getQualifiedKeyName();
            $hydratedModels = $this->relationObject->whereIn($foreignKeyName, $foreignIds)->get();
            $saveData = $this->pivotWidget->getSaveData();

            foreach ($hydratedModels as $hydratedModel) {
                $modelsToSave = $this->prepareModelsToSave($hydratedModel, $saveData);
                foreach ($modelsToSave as $modelToSave) {
                    $modelToSave->save(null, $this->pivotWidget->getSessionKey());
                }
            }
        });

        return ['#'.$this->relationGetId('view') => $this->relationRenderView()];
    }

    public function onRelationManagePivotUpdate()
    {
        $this->beforeAjax();

        $foreignKeyName = $this->relationModel->getQualifiedKeyName();
        $hydratedModel = $this->pivotWidget->model;
        $saveData = $this->pivotWidget->getSaveData();

        $modelsToSave = $this->prepareModelsToSave($hydratedModel, $saveData);
        foreach ($modelsToSave as $modelToSave) {
            $modelToSave->save(null, $this->pivotWidget->getSessionKey());
        }

        return ['#'.$this->relationGetId('view') => $this->relationRenderView()];
    }

    //
    // Overrides
    //

    /**
     * Provides an opportunity to manipulate the field configuration.
     * @param object $config
     * @param string $field
     * @param \October\Rain\Database\Model $model
     */
    public function relationExtendConfig($config, $field, $model)
    {
    }

    /**
     * Provides an opportunity to manipulate the view widget.
     * @param Backend\Classes\WidgetBase $widget
     * @param string $field
     * @param \October\Rain\Database\Model $model
     */
    public function relationExtendViewWidget($widget, $field, $model)
    {
    }

    /**
     * Provides an opportunity to manipulate the manage widget.
     * @param Backend\Classes\WidgetBase $widget
     * @param string $field
     * @param \October\Rain\Database\Model $model
     */
    public function relationExtendManageWidget($widget, $field, $model)
    {
    }

    /**
     * Provides an opportunity to manipulate the pivot widget.
     * @param Backend\Classes\WidgetBase $widget
     * @param string $field
     * @param \October\Rain\Database\Model $model
     */
    public function relationExtendPivotWidget($widget, $field, $model)
    {
    }

    /**
     * Provides an opportunity to manipulate the manage filter widget.
     * @param \Backend\Widgets\Filter $widget
     * @param string $field
     * @param \October\Rain\Database\Model $model
     */
    public function relationExtendManageFilterWidget($widget, $field, $model)
    {
    }

    /**
     * Provides an opportunity to manipulate the view filter widget.
     * @param \Backend\Widgets\Filter $widget
     * @param string $field
     * @param \October\Rain\Database\Model $model
     */
    public function relationExtendViewFilterWidget($widget, $field, $model)
    {
    }

    /**
     * The view widget is often refreshed when the manage widget makes a change,
     * you can use this method to inject additional containers when this process
     * occurs. Return an array with the extra values to send to the browser, eg:
     *
     * return ['#myCounter' => 'Total records: 6'];
     *
     * @param string $field
     * @return array
     */
    public function relationExtendRefreshResults($field)
    {
    }

    //
    // Helpers
    //

    /**
     * Returns the existing record IDs for the relation.
     */
    protected function findExistingRelationIds($checkIds = null)
    {
        $foreignKeyName = $this->relationModel->getQualifiedKeyName();

        $results = $this->relationObject
            ->getBaseQuery()
            ->select($foreignKeyName);

        if ($checkIds !== null && is_array($checkIds) && count($checkIds)) {
            $results = $results->whereIn($foreignKeyName, $checkIds);
        }

        return $results->lists($foreignKeyName);
    }

    /**
     * Determine the default buttons based on the model relationship type.
     * @return array|null
     */
    protected function evalToolbarButtons()
    {
        $buttons = $this->getConfig('view[toolbarButtons]');

        if (!is_array($buttons)) {
            if ($buttons === false) {
                return null;
            } elseif (is_string($buttons)) {
                $buttons = array_map('trim', explode('|', $buttons));
            } elseif ($this->manageMode === 'pivot') {
                $buttons = ['add', 'remove'];
            } else {
                switch ($this->relationType) {
                    case 'hasMany':
                    case 'morphMany':
                    case 'morphToMany':
                    case 'morphedByMany':
                    case 'belongsToMany':
                        $buttons = ['create', 'add', 'delete', 'remove'];
                        break;

                    case 'hasOne':
                    case 'morphOne':
                    case 'belongsTo':
                        $buttons = ['create', 'update', 'link', 'delete', 'unlink'];
                        break;
                }
            }
        }

        $buttonText = [];

        foreach ($buttons as $type => $text) {
            if (is_numeric($type) || !$text) {
                if (is_numeric($type) && $text) {
                    $type = $text;
                }

                switch ($type) {
                    case 'create':
                        $text = 'backend::lang.relation.create_name';
                        break;

                    case 'update':
                        $text = 'backend::lang.relation.update_name';
                        break;

                    case 'delete':
                        $text = 'backend::lang.relation.delete';
                        break;

                    case 'add':
                        $text = 'backend::lang.relation.add_name';
                        break;

                    case 'remove':
                        $text = 'backend::lang.relation.remove';
                        break;

                    case 'link':
                        $text = 'backend::lang.relation.link_name';
                        break;

                    case 'unlink':
                        $text = 'backend::lang.relation.unlink';
                        break;
                }
            }

            $buttonText[$type] = $text;
        }

        return $buttonText;
    }

    /**
     * Determine the view mode based on the model relationship type.
     * @return string
     */
    protected function evalViewMode()
    {
        if ($this->forceViewMode) {
            return $this->forceViewMode;
        }

        switch ($this->relationType) {
            case 'hasMany':
            case 'morphMany':
            case 'morphToMany':
            case 'morphedByMany':
            case 'belongsToMany':
                return 'multi';

            case 'hasOne':
            case 'morphOne':
            case 'belongsTo':
                return 'single';
        }
    }

    /**
     * Determine the management mode popup title.
     * @return string
     */
    protected function evalManageTitle()
    {
        $customTitle = $this->getConfig('manage[title]');

        if (is_string($customTitle)) {
            return $customTitle;
        }

        $customTitles = is_array($customTitle) ? $customTitle : [];

        switch ($this->manageMode) {
            case 'pivot':
                if (array_key_exists('pivot', $customTitles)) {
                    return $customTitles['pivot'];
                } elseif ($this->eventTarget === 'button-link') {
                    return 'backend::lang.relation.link_a_new';
                }

                return 'backend::lang.relation.add_a_new';
            case 'list':
                if (array_key_exists('list', $customTitles)) {
                    return $customTitles['list'];
                } elseif ($this->eventTarget === 'button-link') {
                    return 'backend::lang.relation.link_a_new';
                }

                return 'backend::lang.relation.add_a_new';
            case 'form':
                if (array_key_exists('form', $customTitles)) {
                    return $customTitles['form'];
                } elseif ($this->readOnly) {
                    return 'backend::lang.relation.preview_name';
                } elseif ($this->manageId) {
                    return 'backend::lang.relation.update_name';
                }

                return 'backend::lang.relation.create_name';
        }
    }

    /**
     * Determine the management mode based on the relation type and settings.
     * @return string
     */
    protected function evalManageMode()
    {
        if ($mode = post(self::PARAM_MODE)) {
            return $mode;
        }

        if ($this->forceManageMode) {
            return $this->forceManageMode;
        }

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
                elseif ($this->eventTarget == 'list') {
                    return 'form';
                }
                else {
                    return 'list';
                }

            case 'hasOne':
            case 'morphOne':
            case 'hasMany':
            case 'morphMany':
                if ($this->eventTarget == 'button-add') {
                    return 'list';
                }

                return 'form';
        }
    }

    /**
     * Determine supplied form context.
     */
    protected function evalFormContext($mode = 'manage', $exists = false)
    {
        $config = $this->config->{$mode} ?? [];

        if (($context = array_get($config, 'context')) && is_array($context)) {
            $context = $exists
                ? array_get($context, 'update')
                : array_get($context, 'create');
        }

        if (!$context) {
            $context = $exists ? 'update' : 'create';
        }

        return $context;
    }

    /**
     * Apply extra configuration
     */
    protected function applyExtraConfig($config, $field = null)
    {
        if (!$field) {
            $field = $this->field;
        }

        if (!$config || !isset($this->originalConfig->{$field})) {
            return;
        }

        if (
            !is_array($config) &&
            (!$config = @json_decode(@base64_decode($config), true))
        ) {
            return;
        }

        $parsedConfig = array_only($config, ['readOnly']);
        $parsedConfig['view'] = array_only($config, ['recordUrl', 'recordOnClick']);

        $this->originalConfig->{$field} = array_replace_recursive(
            $this->originalConfig->{$field},
            $parsedConfig
        );
    }

    /**
     * Returns the configuration for a mode (view, manage, pivot) for an
     * expected type (list, form). Uses fallback configuration.
     */
    protected function makeConfigForMode($mode = 'view', $type = 'list', $throwException = true)
    {
        $config = null;

        /*
         * Look for $this->config->view['list']
         */
        if (
            isset($this->config->{$mode}) &&
            array_key_exists($type, $this->config->{$mode})
        ) {
            $config = $this->config->{$mode}[$type];
        }
        /*
         * Look for $this->config->list
         */
        elseif (isset($this->config->{$type})) {
            $config = $this->config->{$type};
        }

        /*
         * Apply substitutes:
         *
         * - view.list => manage.list
         */
        if (!$config) {
            if ($mode == 'manage' && $type == 'list') {
                return $this->makeConfigForMode('view', $type);
            }

            if ($throwException) {
                throw new ApplicationException('Missing configuration for '.$mode.'.'.$type.' in RelationController definition '.$this->field);
            }

            return false;
        }

        return $this->makeConfig($config);
    }

    /**
     * Returns the manage widget used by this behavior.
     *
     * @return \Backend\Classes\WidgetBase
     */
    public function relationGetManageWidget()
    {
        return $this->manageWidget;
    }

    /**
     * Returns the view widget used by this behavior.
     *
     * @return \Backend\Classes\WidgetBase
     */
    public function relationGetViewWidget()
    {
        return $this->viewWidget;
    }
}
