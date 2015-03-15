<?php namespace Backend\FormWidgets;

use Lang;
use Backend\Classes\FormWidgetBase;
use SystemException;
use Illuminate\Database\Eloquent\Relations\Relation as RelationBase;

/**
 * Form Relationship
 * Renders a field prepopulated with a belongsTo and belongsToHasMany relation.
 *
 * @package october\backend
 * @author Alexey Bobkov, Samuel Georges
 */
class Relation extends FormWidgetBase
{
    //
    // Configurable properties
    //

    /**
     * @var string Model column to use for the name reference
     */
    public $nameFrom = 'name';

    /**
     * @var string Model column to use for the description reference
     */
    public $descriptionFrom = 'description';

    /**
     * @var string Empty value to use if the relation is singluar (belongsTo)
     */
    public $emptyOption;

    //
    // Object properties
    //

    /**
     * {@inheritDoc}
     */
    protected $defaultAlias = 'relation';

    /**
     * @var string Relationship type
     */
    public $relationType;

    /**
     * @var string Relationship name
     */
    public $relationName;

    /**
     * @var FormField Object used for rendering a simple field type
     */
    public $renderFormField;

    /**
     * {@inheritDoc}
     */
    public function init()
    {
        $this->fillFromConfig([
            'nameFrom',
            'descriptionFrom',
            'emptyOption',
        ]);

        $this->relationName = $this->valueFrom;
        $this->relationType = $this->model->getRelationType($this->relationName);

        if (!$this->model->hasRelation($this->relationName)) {
            throw new SystemException(Lang::get(
                'backend::lang.model.missing_relation',
                ['class'=>get_class($this->model), 'relation'=>$this->relationName]
            ));
        }
    }

    /**
     * {@inheritDoc}
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

            list($model, $attribute) = $this->resolveModelAttribute($this->relationName);
            $relatedObj = $model->makeRelation($attribute);
            $query = $model->{$attribute}()->newQuery();

            if (in_array($this->relationType, ['belongsToMany', 'morphToMany', 'morphedByMany', 'hasMany'])) {
                $field->type = 'checkboxlist';
            }
            elseif (in_array($this->relationType, ['belongsTo', 'hasOne'])) {
                $field->type = 'dropdown';
            }

            $field->placeholder = $this->emptyOption;

            // It is safe to assume that if the model and related model are of
            // the exact same class, then it cannot be related to itself
            if ($model->exists && (get_class($model) == get_class($relatedObj))) {
                $query->where($relatedObj->getKeyName(), '<>', $model->getKey());
            }

            // Even though "no constraints" is applied, belongsToMany constrains the query
            // by joining its pivot table. Remove all joins from the query.
            $query->getQuery()->getQuery()->joins = [];

            $treeTraits = ['October\Rain\Database\Traits\NestedTree', 'October\Rain\Database\Traits\SimpleTree'];
            if (count(array_intersect($treeTraits, class_uses($relatedObj))) > 0) {
                $field->options = $query->listsNested($this->nameFrom, $relatedObj->getKeyName());
            }
            else {
                $field->options = $query->lists($this->nameFrom, $relatedObj->getKeyName());
            }

            return $field;
        });
    }

    /**
     * {@inheritDoc}
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
}
