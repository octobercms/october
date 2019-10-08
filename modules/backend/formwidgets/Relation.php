<?php namespace Backend\FormWidgets;

use Db;
use Backend\Classes\FormField;
use Backend\Classes\FormWidgetBase;
use October\Rain\Database\Relations\Relation as RelationBase;

/**
 * Form Relationship
 * Renders a field prepopulated with a belongsTo and belongsToHasMany relation.
 *
 * @package october\backend
 * @author Alexey Bobkov, Samuel Georges
 */
class Relation extends FormWidgetBase
{
    use \Backend\Traits\FormModelWidget;

    //
    // Configurable properties
    //

    /**
     * @var string Model column to use for the name reference
     */
    public $nameFrom = 'name';

    /**
     * @var mixed Custom SQL column selection to use for the name reference
     * If array, values will be concatenated together. If string, it will be
     * be used directly in the query.
     */
    public $sqlSelect;

    /**
     * @var string Empty value to use if the relation is singluar (belongsTo)
     */
    public $emptyOption;

    /**
     * @var string Use a custom scope method for the list query.
     */
    public $scope;

    //
    // Object properties
    //

    /**
     * @inheritDoc
     */
    protected $defaultAlias = 'relation';

    /**
     * @var FormField Object used for rendering a simple field type
     */
    public $renderFormField;

    /**
     * @inheritDoc
     */
    public function init()
    {
        $this->fillFromConfig([
            'nameFrom',
            'emptyOption',
            'scope',
        ]);

        if (isset($this->config->select)) {
            $this->sqlSelect = $this->config->select;
        }

        if (isset($this->config->selectConcat)) {
            $this->selectConcat = $this->config->selectConcat;
        }
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
     * Prepares the view data
     */
    public function prepareVars()
    {
        $this->vars['field'] = $this->makeRenderFormField();
    }

    /**
     * Makes the form object used for rendering a simple field type
     */
    protected function makeRenderFormField()
    {
        return $this->renderFormField = RelationBase::noConstraints(function () {

            $field = clone $this->formField;
            $relationObject = $this->getRelationObject();
            $query = $relationObject->newQuery();

            list($model, $attribute) = $this->resolveModelAttribute($this->valueFrom);
            $relationType = $model->getRelationType($attribute);
            $relationModel = $model->makeRelation($attribute);

            if (in_array($relationType, ['belongsToMany', 'morphToMany', 'morphedByMany', 'hasMany'])) {
                $field->type = 'checkboxlist';
            }
            elseif (in_array($relationType, ['belongsTo', 'hasOne'])) {
                $field->type = 'dropdown';
            }

            // It is safe to assume that if the model and related model are of
            // the exact same class, then it cannot be related to itself
            if ($model->exists && (get_class($model) == get_class($relationModel))) {
                $query->where($relationModel->getKeyName(), '<>', $model->getKey());
            }

            if ($scopeMethod = $this->scope) {
                $query->$scopeMethod($model);
            }

            // Even though "no constraints" is applied, belongsToMany constrains the query
            // by joining its pivot table. Remove all joins from the query.
            $query->getQuery()->getQuery()->joins = [];

            // Determine if the model uses a tree trait
            $treeTraits = ['October\Rain\Database\Traits\NestedTree', 'October\Rain\Database\Traits\SimpleTree'];
            $usesTree = count(array_intersect($treeTraits, class_uses($relationModel))) > 0;

            // The "sqlSelect" config takes precedence over "nameFrom".
            // A virtual column called "selection" will contain the result.
            // Tree models must select all columns to return parent columns, etc.
            if ($this->sqlSelect) {
                $nameFrom = 'selection';
                $selectColumn = $usesTree ? '*' : $relationModel->getKeyName();
                $select = is_array($this->sqlSelect) ? $this->getConcat($this->sqlSelect) : $this->sqlSelect;
                $result = $query->select($selectColumn, Db::raw($select . ' AS ' . $nameFrom));
            }
            else {
                $nameFrom = $this->nameFrom;
                $result = $query->getQuery()->get();
            }

            // Some simpler relations can specify a custom local or foreign "other" key,
            // which can be detected and implemented here automagically.
            $primaryKeyName = in_array($relationType, ['hasMany', 'belongsTo', 'hasOne'])
                ? $relationObject->getOtherKey()
                : $relationModel->getKeyName();

            $field->options = $usesTree
                ? $result->listsNested($nameFrom, $primaryKeyName)
                : $result->lists($nameFrom, $primaryKeyName);

            return $field;
        });
    }

    /**
     * Gets a concatenation string to be used in a query depending on database driver
     * @var array Values to be concatenated together
     */
    protected function getConcat($values)
    {
        switch (config("database.connections.".config('database.default').".driver")) {
            case 'sqlite':
                return implode(' || ', $values);
            default:
                return 'CONCAT(' . implode(', ', $values) . ')';
        }
    }

    /**
     * @inheritDoc
     */
    public function getSaveValue($value)
    {
        if ($this->formField->disabled || $this->formField->hidden) {
            return FormField::NO_SAVE_DATA;
        }

        if (is_string($value) && !strlen($value)) {
            return null;
        }

        if (is_array($value) && !count($value)) {
            return null;
        }

        return $value;
    }
}
