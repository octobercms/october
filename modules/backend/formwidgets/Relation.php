<?php namespace Backend\FormWidgets;

use Lang;
use Backend\Classes\FormWidgetBase;
use System\Classes\SystemException;

/**
 * Form Relationship
 * Renders a field prepopulated with a belongsTo and belongsToHasMany relation.
 *
 * @package october\backend
 * @author Alexey Bobkov, Samuel Georges
 */
class Relation extends FormWidgetBase
{
    /**
     * {@inheritDoc}
     */
    public $defaultAlias = 'relation';

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
     * @var string Model column to use for the name reference
     */
    public $nameColumn = 'name';

    /**
     * @var string Model column to use for the description reference
     */
    public $descriptionColumn = 'description';

    /**
     * @var string Empty value to use if the relation is singluar (belongsTo)
     */
    public $emptyOption;

    /**
     * {@inheritDoc}
     */
    public function init()
    {
        $this->relationName = $this->formField->columnName;
        $this->relationType = $this->model->getRelationType($this->relationName);

        $this->nameColumn = $this->getConfig('nameColumn', $this->nameColumn);
        $this->descriptionColumn = $this->getConfig('descriptionColumn', $this->descriptionColumn);
        $this->emptyOption = $this->getConfig('emptyOption');

        if (!$this->model->hasRelation($this->relationName))
            throw new SystemException(Lang::get('backend::lang.model.missing_relation', ['class'=>get_class($this->controller), 'relation'=>$this->relationName]));
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
         $field = clone $this->formField;
         $relationObj = $this->model->{$this->relationName}();
         $relatedObj = $this->model->makeRelation($this->relationName);
         $query = $relatedObj->newQuery();

         if (in_array($this->relationType, ['belongsToMany', 'morphToMany', 'morphedByMany'])) {
            $field->type = 'checkboxlist';
            $field->value = $relationObj->getRelatedIds();
         }
         else if ($this->relationType == 'belongsTo') {
            $field->type = 'dropdown';
            $field->placeholder = $this->emptyOption;
            $foreignKey = $relationObj->getForeignKey();
            $field->value = $this->model->$foreignKey;
         }
        
         // It is safe to assume that if the model and related model are of 
         // the exact same class, then it cannot be related to itself
         if ($this->model->exists && (get_class($this->model) == get_class($relatedObj))) {
            $query->where($relatedObj->getKeyName(), '<>', $this->model->id);
         }

         if ($relatedObj->isClassExtendedWith('October.Rain.Database.Behaviors.NestedSetModel'))
            $field->options = $query->orderByNested()->listsNested($this->nameColumn, $relatedObj->getKeyName());
         else
            $field->options = $query->lists($this->nameColumn, $relatedObj->getKeyName());

         return $this->renderFormField = $field;
    }

    /**
     * {@inheritDoc}
     */
    public function getSaveData($value)
    {
        if (is_string($value) && !strlen($value))
            return null;

        if (is_array($value) && !count($value))
            return null;

        return $value;
    }
}