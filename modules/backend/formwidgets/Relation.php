<?php namespace Backend\FormWidgets;

use DbDongle;
use Backend\Classes\FormField;
use Backend\Classes\FormWidgetBase;
use October\Rain\Html\Helper as HtmlHelper;
use SystemException;

/**
 * Relation renders a field pre-populated with a belongsTo and belongsToHasMany relation
 *
 * @package october\backend
 * @author Alexey Bobkov, Samuel Georges
 */
class Relation extends FormWidgetBase
{
    use \Backend\Traits\FormModelWidget;

    //
    // Configurable Properties
    //

    /**
     * @var bool readOnly if the sensitive field cannot be edited, but can be toggled
     */
    public $readOnly = false;

    /**
     * @var string nameFrom is the model column to use for the name reference
     */
    public $nameFrom = 'name';

    /**
     * @var string sqlSelect is the custom SQL column selection to use for the name reference
     */
    public $sqlSelect;

    /**
     * @var string emptyOption to use if the relation is singular (belongsTo)
     */
    public $emptyOption;

    /**
     * @var string modelScope method for the list query.
     */
    public $modelScope;

    /**
     * @var string conditions filters the relation using a raw where query statement.
     */
    public $conditions;

    /**
     * @var mixed defaultSort column to look for.
     */
    public $defaultSort;

    /**
     * @var mixed excludeFrom identifiers from the specified model attribute.
     */
    public $excludeFrom;

    /**
     * @var bool useController to completely replace this widget the `RelationController` behavior.
     */
    public $useController;

    /**
     * @var array useControllerConfig manually configures the `RelationController` behavior.
     */
    public $useControllerConfig;

    //
    // Object Properties
    //

    /**
     * @inheritDoc
     */
    protected $defaultAlias = 'relation';

    /**
     * @var FormField renderFormField object used for rendering a simple field type
     */
    public $renderFormField;

    /**
     * @inheritDoc
     */
    public function init()
    {
        $this->fillFromConfig([
            'readOnly',
            'nameFrom',
            'emptyOption',
            'defaultSort',
            'excludeFrom',
            'modelScope',
            'conditions',
        ]);

        if (isset($this->config->select)) {
            $this->sqlSelect = $this->config->select;
        }

        if (isset($this->config->scope)) {
            $this->modelScope = $this->config->scope;
        }

        $this->useControllerConfig = (array) ($this->config->controller ?? []);

        $this->useController = $this->evalUseController($this->config->useController ?? true);
    }

    /**
     * bindToController ensures manual relation controller configuration is applied.
     */
    public function bindToController()
    {
        $this->defineRelationControllerConfig();
        parent::bindToController();
    }

    /**
     * @inheritDoc
     */
    public function render()
    {
        $this->prepareVars();

        return $this->makePartial('relation');
    }

    /**
     * prepareVars for display
     */
    public function prepareVars()
    {
        $this->vars['field'] = $this->makeRenderFormField();
    }

    /**
     * makeRenderFormField for rendering a simple field type
     */
    protected function makeRenderFormField()
    {
        if ($this->useController) {
            return null;
        }

        $field = clone $this->formField;
        [$model, $attribute] = $this->resolveModelAttribute($this->valueFrom);

        $relationObject = $this->getRelationObject();
        $relationType = $model->getRelationType($attribute);
        $relationModel = $model->makeRelation($attribute);
        $query = $relationModel->newQuery();

        if (in_array($relationType, ['belongsToMany', 'morphedByMany', 'morphToMany', 'hasMany'])) {
            $field->type = 'checkboxlist';
        }
        elseif (in_array($relationType, ['belongsTo', 'hasOne', 'morphOne'])) {
            $field->type = 'dropdown';
        }
        else {
            throw new SystemException("Could not translate relation type '{$relationType}' to a valid field type");
        }

        // Sort the query using configuration
        if ($this->defaultSort) {
            $this->applyDefaultSortToQuery($query);
        }

        // Exclude values from the specified parent model attribute
        if ($this->excludeFrom) {
            $query->whereNotIn($relationModel->getKeyName(), (array) $model->{$this->excludeFrom});
        }
        // It is safe to assume that if the model and related model are of
        // the exact same class, then it cannot be related to itself
        elseif ($model->exists && ($relationModel->getTable() === $model->getTable())) {
            $query->where($relationModel->getKeyName(), '<>', $model->getKey());
        }

        if ($sqlConditions = $this->conditions) {
            $query->whereRaw(DbDongle::parse($sqlConditions, $model->attributes));
        }
        elseif ($scopeMethod = $this->modelScope) {
            if ($callableMethod = $this->formField->getCallableMethodFromValue($scopeMethod)) {
                $callableMethod($query, $model);
            }
            elseif (is_string($scopeMethod)) {
                $query->$scopeMethod($model);
            }
        }
        else {
            $relationObject->addDefinedConstraintsToQuery($query);

            // Reset any orders that come from the definition since they may
            // reference the pivot table that isn't included in this query
            if (in_array($relationType, ['belongsToMany', 'morphedByMany', 'morphToMany'])) {
                $query->getQuery()->reorder();
            }
        }

        // Determine if the model uses a tree trait
        $usesTree = $relationModel->isClassInstanceOf(\October\Contracts\Database\TreeInterface::class);

        // The "sqlSelect" config takes precedence over "nameFrom".
        // A virtual column called "selection" will contain the result.
        // Tree models must select all columns to return parent columns, etc.
        if ($this->sqlSelect) {
            $nameFrom = 'selection';
            $selectColumn = $usesTree ? '*' : $relationModel->getKeyName();
            $selectSql = $this->sqlSelect;
            $result = $query->select($selectColumn, DbDongle::raw($selectSql . ' as ' . $nameFrom));
        }
        else {
            // If the attribute is a getter, load all the models in to memory so it
            // can be retrieved. This impacts performance so we try to avoid it.
            // Otherwise, assume the name is taken from a database column.
            $nameFrom = $this->nameFrom;
            if ($relationModel->hasGetMutator($nameFrom) || $relationModel->hasAttributeMutator($nameFrom)) {
                $result = $query->get();
            }
            else {
                $result = $query;
            }
        }

        // Relations can specify a custom local or foreign "other" key,
        // which can be detected and implemented here automatically.
        if (in_array($relationType, ['belongsTo'])) {
            $primaryKeyName = $relationObject->getOwnerKeyName();
        }
        elseif (in_array($relationType, ['hasMany', 'hasOne', 'belongsToMany', 'morphedByMany', 'morphToMany'])) {
            $primaryKeyName = $relationObject->getRelatedKeyName();
        }
        else {
            $primaryKeyName = $relationModel->getKeyName();
        }

        // Set options on form field
        if ($usesTree) {
            $field->options = $this->makeFieldOptionsForTree(
                $result,
                $nameFrom,
                $primaryKeyName
            );
        }
        else {
            $field->options = $result->pluck($nameFrom, $primaryKeyName)->all();
        }

        return $this->renderFormField = $field;
    }

    /**
     * makeFieldOptionsForTree
     */
    protected function makeFieldOptionsForTree($items, $nameFrom, $primaryKeyName)
    {
        if ($items instanceof \October\Rain\Database\TreeCollection) {
            $items = $items->toNested();
        }
        elseif (!$items instanceof \Illuminate\Database\Eloquent\Collection) {
            $items = $items->getNested();
        }

        $options = [];

        foreach ($items as $item) {
            $newItem = [
                'label' => $item->{$nameFrom},
                'value' => $item->{$primaryKeyName},
            ];

            $childItems = $item->getChildren();
            if ($childItems->count() > 0) {
                $newItem['children'] = $this->makeFieldOptionsForTree(
                    $childItems,
                    $nameFrom,
                    $primaryKeyName
                );
            }

            $options[$item->{$primaryKeyName}] = $newItem;
        }

        return $options;
    }

    /**
     * applyDefaultSortToQuery
     */
    protected function applyDefaultSortToQuery($query)
    {
        if (is_string($this->defaultSort)) {
            $query->orderBy($this->defaultSort, 'desc');
        }
        elseif (is_array($this->defaultSort) && isset($this->defaultSort['column'])) {
            $query->orderBy($this->defaultSort['column'], $this->defaultSort['direction'] ?? 'desc');
        }
    }

    /**
     * evalUseController determines if the relation controller is usable and returns the default
     * preference if it can be used.
     */
    protected function evalUseController(bool $defaultPref): bool
    {
        if ($this->useControllerConfig) {
            return true;
        }

        if (!$this->controller->isClassExtendedWith(\Backend\Behaviors\RelationController::class)) {
            return false;
        }

        if (!is_string($this->valueFrom)) {
            return false;
        }

        if (!$this->controller->relationHasField($this->getRelationControllerFieldName())) {
            return false;
        }

        return $defaultPref;
    }

    /**
     * defineRelationControllerConfig
     */
    protected function defineRelationControllerConfig()
    {
        if (!$this->useController || !$this->useControllerConfig) {
            return;
        }

        if (!$this->controller->isClassExtendedWith(\Backend\Behaviors\RelationController::class)) {
            $this->controller->extendClassWith(\Backend\Behaviors\RelationController::class);
            $this->controller->asExtension('RelationController')->beforeDisplay();
        }

        $controllerConfig = $this->useControllerConfig;

        if (!isset($controllerConfig['readOnly']) && $this->readOnly === true) {
            $controllerConfig['readOnly'] = $this->readOnly;
        }

        if (!isset($controllerConfig['sessionKey'])) {
            $controllerConfig['sessionKey'] = $this->getParentForm()?->getSessionKeyWithSuffix();
        }

        $this->controller->relationRegisterField($this->getRelationControllerFieldName(), $controllerConfig);
    }

    /**
     * getRelationControllerFieldName
     */
    protected function getRelationControllerFieldName()
    {
        $relationName = $this->valueFrom;

        if ($parentFieldName = $this->getParentForm()?->parentFieldName) {
            $relationName = $parentFieldName . '['.implode('][', HtmlHelper::nameToArray($relationName)).']';
        }

        return $relationName;
    }

    /**
     * @inheritDoc
     */
    public function getSaveValue($value)
    {
        if (is_string($value) && !strlen($value)) {
            return null;
        }

        if (is_array($value) && !count($value)) {
            return null;
        }

        return $value;
    }

    /**
     * resetFormValue from the form field
     */
    public function resetFormValue()
    {
        // Transfer approved config
        $this->modelScope = $this->formField->modelScope ?: $this->formField->scope;
        $this->conditions = $this->formField->conditions;
        $this->defaultSort = $this->formField->defaultSort;
    }
}
