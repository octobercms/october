<?php namespace Backend\Behaviors;

use Lang;
use Flash;
use Request;
use Form as FormHelper;
use October\Rain\Html\Helper as HtmlHelper;
use Backend\Classes\FormField;
use Backend\Classes\ControllerBehavior;
use Illuminate\Database\Eloquent\Relations\HasOneOrMany;
use October\Rain\Database\Model;
use ApplicationException;

/**
 * RelationController uses a combination of lists and forms for managing Model relations.
 *
 * This behavior is implemented in the controller like so:
 *
 *     public $implement = [
 *         \Backend\Behaviors\RelationController::class,
 *     ];
 *
 *     public $relationConfig = 'config_relation.yaml';
 *
 * The `$relationConfig` property makes reference to the configuration
 * values as either a YAML file, located in the controller view directory,
 * or directly as a PHP array.
 *
 * @see https://docs.octobercms.com/4.x/extend/forms/relation-controller.html Relation Controller Documentation
 * @package october\backend
 * @author Alexey Bobkov, Samuel Georges
 */
class RelationController extends ControllerBehavior
{
    use \Backend\Traits\FormModelSaver;
    use \Backend\Behaviors\RelationController\HasOverrides;
    use \Backend\Behaviors\RelationController\HasViewMode;
    use \Backend\Behaviors\RelationController\HasManageMode;
    use \Backend\Behaviors\RelationController\HasPivotMode;
    use \Backend\Behaviors\RelationController\HasExtraConfig;
    use \Backend\Behaviors\RelationController\HasNestedRelations;

    /**
     * @var const PARAM_FIELD postback parameter for the active relationship field
     */
    const PARAM_FIELD = '_relation_field';

    /**
     * @var const PARAM_EXTRA_CONFIG postback parameter for read only mode
     */
    const PARAM_EXTRA_CONFIG = '_relation_extra_config';

    /**
     * @var Backend\Widgets\Search searchWidget
     */
    protected $searchWidget;

    /**
     * @var Backend\Widgets\Toolbar toolbarWidget
     */
    protected $toolbarWidget;

    /**
     * @var array requiredProperties
     */
    protected $requiredProperties = [];

    /**
     * @var array requiredRelationProperties that must exist for each relationship definition
     */
    protected $requiredRelationProperties = ['label'];

    /**
     * @var array requiredConfig that must exist when applying the primary config file
     */
    protected $requiredConfig = [];

    /**
     * @var array actions visible in context of the controller
     */
    protected $actions = [];

    /**
     * @var object originalConfig values
     */
    protected $originalConfig;

    /**
     * @var bool initialized informs if everything is ready
     */
    protected $initialized = false;

    /**
     * @var string relationType
     */
    public $relationType;

    /**
     * @var string relationName
     */
    public $relationName;

    /**
     * @var Model relationModel
     */
    public $relationModel;

    /**
     * @var Model relationParent
     */
    public $relationParent;

    /**
     * @var Model relationObject
     */
    public $relationObject;

    /**
     * @var Model model used as parent of the relationship
     */
    protected $model;

    /**
     * @var string field for the relationship as defined in the configuration
     */
    protected $field;

    /**
     * @var string alias is something unique to pass to widgets
     */
    protected $alias;

    /**
     * @var array toolbarButtons to display in view mode.
     */
    protected $toolbarButtons;

    /**
     * @var string eventTarget that triggered an AJAX event (button, list)
     */
    protected $eventTarget;

    /**
     * @var string sessionKey used by forms for deferred bindings
     */
    public $sessionKey;

    /**
     * @var string relationSessionKey used for binding relations
     */
    public $relationSessionKey;

    /**
     * @var bool|null readOnly disables the ability to add, update, delete or create relations
     */
    public $readOnly = null;

    /**
     * @var bool deferredBinding defers all binding actions using a session key
     */
    public $deferredBinding = false;

    /**
     * @var string popupSize as, either giant, huge, large, small, tiny or adaptive
     */
    public $popupSize = 'huge';

    /**
     * @var string externalToolbarAppState defines a mount point for the editor toolbar.
     * Must include a module name that exports the Vue application and a state element name.
     * Format: stateElementName
     * Only works in Vue applications and form document layouts.
     */
    public $externalToolbarAppState;

    /**
     * @var array customMessages contains default messages that you can override
     */
    protected $customMessages = [
        'buttonCreate' => "Create :name",
        'buttonCreateForm' => "Create",
        'buttonCancelForm' => "Cancel",
        'buttonCloseForm' => "Close",
        'buttonUpdate' => "Update :name",
        'buttonUpdateForm' => "Update",
        'buttonAdd' => "Add :name",
        'buttonAddMany' => "Add Selected",
        'buttonAddForm' => "Add",
        'buttonLink' => "Link :name",
        'buttonDelete' => "Delete",
        'buttonDeleteMany' => "Delete Selected",
        'buttonRemove' => "Remove",
        'buttonRemoveMany' => "Remove Selected",
        'buttonUnlink' => "Unlink",
        'buttonUnlinkMany' => "Unlink Selected",
        'confirmDelete' => "Are you sure?",
        'confirmUnlink' => "Are you sure?",
        'titlePreviewForm' => "Preview :name",
        'titleCreateForm' => "Create :name",
        'titleUpdateForm' => "Update :name",
        'titleLinkForm' => "Link a New :name",
        'titleAddForm' => "Add a New :name",
        'titlePivotForm' => "Related :name Data",
        'flashCreate' => ":name Created",
        'flashUpdate' => ":name Updated",
        'flashDelete' => ":name Deleted",
        'flashAdd' => ":name Added",
        'flashLink' => ":name Linked",
        'flashRemove' => ":name Removed",
        'flashUnlink' => ":name Unlinked",
    ];

    /**
     * __construct the behavior
     * @param Backend\Classes\Controller $controller
     */
    public function __construct($controller)
    {
        parent::__construct($controller);

        // Build configuration
        $this->setConfig($controller->relationConfig ?? [], $this->requiredConfig);
    }

    /**
     * beforeDisplay fires before the page is displayed and AJAX is executed.
     */
    public function beforeDisplay()
    {
        $this->addJs('js/october.relation.js');
        $this->addCss('css/relation.css');
    }

    /**
     * validateField validates the supplied field and initializes the relation manager.
     * @param string $field The relationship field.
     * @return string The active field name.
     */
    protected function validateField($field = null)
    {
        $field = $field ?: post(self::PARAM_FIELD);

        if ($field && $field !== $this->field) {
            $this->initRelation($this->model, $field);
        }

        if (!$field && !$this->field) {
            throw new ApplicationException(Lang::get('backend::lang.relation.missing_definition', compact('field')));
        }

        return $field ?: $this->field;
    }

    /**
     * prepareVars for display
     */
    public function prepareVars()
    {
        $this->vars['relationLabel'] = $this->config->label ?: $this->field;
        $this->vars['relationField'] = $this->field;
        $this->vars['relationPopupSize'] = $this->popupSize;
        $this->vars['relationReadOnly'] = $this->readOnly;
        $this->vars['relationType'] = $this->relationType;
        $this->vars['relationSearchWidget'] = $this->searchWidget;
        $this->vars['relationToolbarWidget'] = $this->toolbarWidget;
        $this->vars['relationToolbarButtons'] = $this->toolbarButtons;
        $this->vars['relationSessionKey'] = $this->relationSessionKey;
        $this->vars['relationExtraConfig'] = $this->extraConfig;

        // Manage
        $this->vars['relationManageId'] = $this->manageId;
        $this->vars['relationManageTitle'] = $this->manageTitle;
        $this->vars['relationManageFilterWidget'] = $this->manageFilterWidget;
        $this->vars['relationManageFormWidget'] = $this->manageFormWidget;
        $this->vars['relationManageListWidget'] = $this->manageListWidget;
        $this->vars['relationManageModel'] = $this->manageModel;
        $this->vars['relationManageMode'] = $this->manageMode;

        // View
        $this->vars['relationViewFilterWidget'] = $this->viewFilterWidget;
        $this->vars['relationViewFormWidget'] = $this->viewFormWidget;
        $this->vars['relationViewListWidget'] = $this->viewListWidget;
        $this->vars['relationViewModel'] = $this->viewModel;
        $this->vars['relationViewMode'] = $this->viewMode;

        // Pivot
        $this->vars['relationPivotId'] = $this->pivotId;
        $this->vars['relationPivotTitle'] = $this->pivotTitle;
        $this->vars['relationPivotWidget'] = $this->pivotWidget;

        // Misc
        $this->vars['externalToolbarAppState'] = $this->externalToolbarAppState;
        $this->vars['formSessionKey'] = post('_form_session_key', post('_session_key', FormHelper::getSessionKey()));

        // @deprecated
        $this->vars['relationManageWidget'] = $this->relationGetManageWidget();
        $this->vars['relationViewWidget'] = $this->relationGetViewWidget();
    }

    /**
     * beforeAjax is needed because each AJAX request must initialize the
     * relation's field name (_relation_field).
     */
    protected function beforeAjax()
    {
        if ($this->initialized) {
            return;
        }

        if ($fatalError = $this->controller->getFatalError()) {
            throw new ApplicationException($fatalError);
        }

        $this->validateField();
        $this->setExtraConfigForChain();
        $this->prepareVars();
        $this->initialized = true;
    }

    //
    // Interface
    //

    /**
     * initRelation prepares the widgets used by this behavior
     * @param Model $model
     * @param string $field
     * @return void
     */
    public function initRelation($model, $field = null)
    {
        if ($extraConfig = post(self::PARAM_EXTRA_CONFIG)) {
            $this->setExtraConfig($extraConfig);
            $this->initNestedRelation($model, $field);
        }

        $this->initRelationInternal($model, $field);
    }

    /**
     * initRelationInternal is an internal method for initRelation
     * @param Model $model
     * @param string $field
     * @return void
     */
    protected function initRelationInternal($model, $field = null)
    {
        if ($this->originalConfig === null) {
            $this->originalConfig = $this->controller->relationGetConfig();
        }

        if ($field === null) {
            $field = post(self::PARAM_FIELD);
        }

        $this->config = $this->originalConfig;
        $this->model = $model;
        $this->field = $field;

        if (!$field) {
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

        // Configuration details
        if (!$this->relationHasField($field)) {
            throw new ApplicationException(Lang::get('backend::lang.relation.missing_definition', compact('field')));
        }

        $this->applyExtraConfig($field);
        $this->alias = camel_case('relation ' . HtmlHelper::nameToId($field));
        $this->config = $this->makeConfig($this->originalConfig->{$field}, $this->requiredRelationProperties);
        $this->controller->relationExtendConfig($this->config, $this->field, $this->model);
        $this->manageId = $this->getManageIdForField($field);
        $this->pivotId = post('pivot_id');
        $this->foreignId = post('foreign_id');
        [$this->sessionKey, $this->relationSessionKey] = $this->getSessionKeysForField($field);

        // Relationship details
        [$nestedModel, $nestedField] = $this->makeNestedRelationModel($this->model, $this->config->valueFrom ?? $field);
        if (!$nestedModel->hasRelation($nestedField)) {
            throw new ApplicationException(Lang::get('backend::lang.model.missing_relation', ['class' => get_class($nestedModel), 'relation' => $nestedField]));
        }

        $this->relationParent = $nestedModel;
        $this->relationName = $nestedField;
        $this->relationType = $nestedModel->getRelationType($nestedField);
        $this->relationObject = $nestedModel->{$nestedField}();
        $this->relationModel = $this->relationObject instanceof HasOneOrMany
            ? $this->relationObject->make()
            : $this->relationObject->getRelated();

        $this->readOnly = $this->getConfig('readOnly');
        $this->popupSize = $this->getConfig('popupSize', 950);
        $this->externalToolbarAppState = $this->getConfig('externalToolbarAppState');
        $this->eventTarget = $this->evalEventTarget();
        $this->deferredBinding = $this->evalDeferredBinding();
        $this->viewMode = $this->evalViewMode();
        $this->manageMode = $this->evalManageMode();
        $this->manageTitle = $this->evalManageTitle();
        $this->pivotTitle = $this->evalPivotTitle();
        $this->toolbarButtons = $this->evalToolbarButtons();

        // Toolbar widget
        if ($this->toolbarWidget = $this->makeToolbarWidget()) {
            $this->toolbarWidget->bindToController();
        }

        // Search widget
        if ($this->searchWidget = $this->makeSearchWidget()) {
            $this->searchWidget->bindToController();
        }

        // View widgets
        if ($this->viewFilterWidget = $this->makeFilterWidgetFor('view')) {
            $this->controller->relationExtendViewFilterWidget($this->viewFilterWidget, $this->field, $this->model);
            $this->viewFilterWidget->bindToController();
        }

        if ($this->viewListWidget = $this->makeViewListWidget()) {
            $this->controller->relationExtendViewListWidget($this->viewListWidget, $this->field, $this->model);
            $this->controller->relationExtendViewWidget($this->viewListWidget, $this->field, $this->model);
            $this->viewListWidget->bindToController();
        }

        if ($this->viewFormWidget = $this->makeViewFormWidget()) {
            $this->controller->relationExtendViewFormWidget($this->viewFormWidget, $this->field, $this->model);
            $this->controller->relationExtendViewWidget($this->viewFormWidget, $this->field, $this->model);
            $this->viewFormWidget->bindToController();
        }

        // Manage widgets
        if ($this->manageFilterWidget = $this->makeFilterWidgetFor('manage')) {
            $this->controller->relationExtendManageFilterWidget($this->manageFilterWidget, $this->field, $this->model);
            $this->manageFilterWidget->bindToController();
        }

        if ($this->manageListWidget = $this->makeManageListWidget()) {
            $this->controller->relationExtendManageListWidget($this->manageListWidget, $this->field, $this->model);
            $this->controller->relationExtendManageWidget($this->manageListWidget, $this->field, $this->model);
            $this->manageListWidget->bindToController();
        }

        if ($this->manageFormWidget = $this->makeManageFormWidget()) {
            $this->controller->relationExtendManageFormWidget($this->manageFormWidget, $this->field, $this->model);
            $this->controller->relationExtendManageWidget($this->manageFormWidget, $this->field, $this->model);
            $this->manageFormWidget->bindToController();
        }

        // Pivot widget
        if ($this->pivotWidget = $this->makePivotFormWidget()) {
            $this->controller->relationExtendPivotFormWidget($this->pivotWidget, $this->field, $this->model);
            $this->controller->relationExtendPivotWidget($this->pivotWidget, $this->field, $this->model);
            $this->pivotWidget->bindToController();
        }
    }

    /**
     * relationHasField
     */
    public function relationHasField(string $field): bool
    {
        if ($this->originalConfig === null) {
            $this->config = $this->originalConfig = $this->controller->relationGetConfig();
        }

        return (bool) ($this->originalConfig->{$field} ?? false);
    }

    /**
     * relationRegisterField registers a new relation dynamically
     */
    public function relationRegisterField(string $relationName, array $config)
    {
        if ($this->originalConfig === null) {
            $this->config = $this->originalConfig = $this->controller->relationGetConfig();
        }

        $this->originalConfig->{$relationName} = $config;
    }

    /**
     * relationRender renders the relationship manager.
     * @param string $field The relationship field.
     * @param array $options
     * @return string Rendered HTML for the relationship manager.
     */
    public function relationRender($field = null, $options = [])
    {
        if ($field === null) {
            $field = $this->field;
        }

        // Session key
        if (is_string($options)) {
            $options = ['sessionKey' => $options];
        }

        if (isset($options['sessionKey'])) {
            $this->sessionKey = $options['sessionKey'];
        }

        // Apply options and extra config
        $allowConfig = ['readOnly', 'readOnlyDefault', 'recordUrl', 'recordOnClick'];
        $extraConfig = array_only($options, $allowConfig);
        $this->setExtraConfigForRender($extraConfig);
        $this->applyExtraConfig($field);

        // Initialize
        $this->validateField($field);
        $this->prepareVars();

        // Determine the partial to use based on the supplied section option
        $section = strtolower($options['section'] ?? '');
        return match ($section) {
            'toolbar' => $this->toolbarWidget?->render(),
            'view' => $this->relationMakePartial('view'),
            default => $this->relationMakePartial('container'),
        };
    }

    /**
     * relationRefresh refreshes the relation container only, useful for returning in custom AJAX requests.
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
     * relationRenderToolbar renders the toolbar only.
     * @param string $field The relationship field.
     * @return string Rendered HTML for the toolbar.
     */
    public function relationRenderToolbar($field = null)
    {
        return $this->relationRender($field, ['section' => 'toolbar']);
    }

    /**
     * relationRenderView renders the view only.
     * @param string $field The relationship field.
     * @return string Rendered HTML for the view.
     */
    public function relationRenderView($field = null)
    {
        return $this->relationRender($field, ['section' => 'view']);
    }

    /**
     * relationMakePartial is a controller accessor for making partials within this behavior.
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
     * relationGetId returns a unique ID for this relation and field combination.
     * @param string $suffix A suffix to use with the identifier.
     * @return string
     */
    public function relationGetId($suffix = null)
    {
        $id = class_basename($this);
        if ($this->field) {
            $id .= '-' . HtmlHelper::nameToId($this->field);
        }

        if ($suffix !== null) {
            $id .= '-' . $suffix;
        }

        return $this->controller->getId($id);
    }

    /**
     * relationGetSessionKey returns the active session key for relation binding.
     */
    public function relationGetSessionKey()
    {
        return $this->relationSessionKey;
    }

    /**
     * relationGetConfig returns the configuration used by this behavior. You may override this
     * method in your controller as an alternative to defining a relationConfig property.
     * @return object
     */
    public function relationGetConfig()
    {
        return $this->config;
    }

    /**
     * relationGetMessage is a public API for accessing custom messages
     */
    public function relationGetMessage(string $code): string
    {
        return $this->getCustomLang($code);
    }

    //
    // Widgets
    //

    /**
     * makeFilterWidgetFor
     * @param $type string Either 'manage' or 'view'
     * @return \Backend\Classes\WidgetBase|null
     */
    protected function makeFilterWidgetFor($type)
    {
        if (!$this->getConfig($type . '[filter]')) {
            return null;
        }

        $filterConfig = $this->makeConfig($this->getConfig("{$type}[filter]"));
        $filterConfig->model = $this->relationModel;
        $filterConfig->alias = $this->alias . ucfirst($type) . 'Filter';
        $filterConfig->customPageName = $this->getConfig("{$type}[customPageName]", false);
        $filterWidget = $this->makeWidget(\Backend\Widgets\Filter::class, $filterConfig);

        return $filterWidget;
    }

    /**
     * makeToolbarWidget
     */
    protected function makeToolbarWidget()
    {
        $defaultConfig = [];

        // Add buttons to toolbar
        $defaultButtons = null;

        if (!$this->readOnly && $this->toolbarButtons) {
            $defaultButtons = '~/modules/backend/behaviors/relationcontroller/partials/_toolbar.php';
        }

        $defaultConfig['buttons'] = $this->getConfig('view[toolbarPartial]', $defaultButtons);

        // Make config
        $toolbarConfig = $this->makeConfig($this->getConfig('toolbar', $defaultConfig));
        $toolbarConfig->alias = $this->alias . 'Toolbar';

        // Add search to toolbar
        $useSearch = $this->viewMode === 'multi' && $this->getConfig('view[showSearch]');

        if ($useSearch) {
            $toolbarConfig->search = [
                'prompt' => 'backend::lang.list.search_prompt'
            ];
        }

        // No buttons, no search should mean no toolbar
        if (empty($toolbarConfig->search) && empty($toolbarConfig->buttons)) {
            return;
        }

        $toolbarWidget = $this->makeWidget(\Backend\Widgets\Toolbar::class, $toolbarConfig);
        $toolbarWidget->cssClasses[] = 'list-header';

        return $toolbarWidget;
    }

    /**
     * makeSearchWidget
     */
    protected function makeSearchWidget()
    {
        if (!$this->getConfig('manage[showSearch]')) {
            return null;
        }

        $config = $this->makeConfig();
        $config->alias = $this->alias . 'ManageSearch';
        $config->growable = false;
        $config->prompt = 'backend::lang.list.search_prompt';
        $widget = $this->makeWidget(\Backend\Widgets\Search::class, $config);
        $widget->cssClasses[] = 'recordfinder-search';

        // Persist the search term across AJAX requests only
        if (!Request::ajax()) {
            $widget->setActiveTerm(null);
        }

        return $widget;
    }

    //
    // Helpers
    //

    /**
     * findExistingRelationIds returns the existing record IDs for the relation.
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

        return $results->pluck($foreignKeyName)->all();
    }

    /**
     * evalDeferredBinding
     */
    protected function evalDeferredBinding(): bool
    {
        if ($this->relationType === 'hasManyThrough') {
            return false;
        }

        return $this->getConfig('deferredBinding') || !$this->relationParent->exists;
    }

    /**
     * evalToolbarButtons determines the default buttons based on the model relationship type.
     */
    protected function evalToolbarButtons(): array
    {
        $buttons = $this->getConfig('view[toolbarButtons]');

        if ($buttons === false) {
            return [];
        }
        elseif (is_string($buttons)) {
            return array_map('trim', explode('|', $buttons));
        }
        elseif (is_array($buttons)) {
            return $buttons;
        }

        if ($this->manageMode === 'pivot') {
            return ['add', 'remove'];
        }

        switch ($this->relationType) {
            case 'hasMany':
            case 'morphMany':
                return ['create', 'delete'];

            case 'belongsToMany':
            case 'morphedByMany':
            case 'morphToMany':
                return ['create', 'add', 'delete', 'remove'];

            case 'hasOne':
            case 'morphOne':
            case 'belongsTo':
                return ['create', 'update', 'link', 'delete', 'unlink'];

            case 'hasManyThrough':
                return [];
        }

        return [];
    }

    /**
     * evalFormContext determines supplied form context
     */
    protected function evalFormContext($mode = 'manage', $exists = false)
    {
        $config = $this->config->{$mode} ?? [];

        $context = FormField::CONTEXT_CREATE;

        if ($exists) {
            $context = FormField::CONTEXT_UPDATE;
        }

        if ($this->readOnly) {
            $context = FormField::CONTEXT_PREVIEW;
        }

        if ($configContext = array_get($config, 'context')) {
            $context = is_array($configContext)
                ? array_get($configContext, $context, $context)
                : $configContext;
        }

        return $context;
    }

    /**
     * makeConfigForMode returns the configuration for a mode (view, manage, pivot) for an
     * expected type (list, form) and uses fallback configuration
     */
    protected function makeConfigForMode($mode = 'view', $type = 'list')
    {
        $config = null;

        // Look for $this->config->view['list']
        if (
            isset($this->config->{$mode}) &&
            array_key_exists($type, $this->config->{$mode})
        ) {
            $config = $this->config->{$mode}[$type];
        }
        // Look for $this->config->list
        elseif (isset($this->config->{$type})) {
            $config = $this->config->{$type};
        }

        // Apply substitutes:
        // - view.list => manage.list
        if ($config === null) {
            if ($mode === 'manage' && $type === 'list') {
                return $this->makeConfigForMode('view', $type);
            }

            return false;
        }

        return $this->makeConfig($config);
    }

    /**
     * getCustomLang parses custom messages provided by the config
     */
    protected function getCustomLang(string $name, ?string $default = null, array $extras = []): string
    {
        $foundKey = $this->getConfig("customMessages[{$name}]");

        if ($foundKey === null) {
            $foundKey = $this->originalConfig->customMessages[$name] ?? null;
        }

        if ($foundKey === null) {
            $foundKey = $default;
        }

        if ($foundKey === null) {
            $foundKey = $this->customMessages[$name] ?? '???';
        }

        $vars = $extras + [
            'name' => Lang::get($this->getConfig('label', $this->field))
        ];

        return Lang::get($foundKey, $vars);
    }

    /**
     * showFlashMessage displays a flash message if its found
     */
    protected function showFlashMessage(string $message): void
    {
        if (!$this->useFlashMessages()) {
            return;
        }

        if ($message = $this->getCustomLang($message)) {
            Flash::success($message);
        }
    }

    /**
     * useFlashMessages determines if flash messages should be used
     */
    protected function useFlashMessages(): bool
    {
        $useFlash = $this->getConfig('showFlash');

        if ($useFlash === null) {
            $useFlash = $this->originalConfig->showFlash ?? null;
        }

        if ($useFlash === null) {
            $useFlash = true;
        }

        return $useFlash;
    }
}
