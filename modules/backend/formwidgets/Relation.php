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
     * {@inheritDoc}
     */
    public function init()
    {
        $this->relationName = $this->formField->columnName;
        $this->relationType = $this->model->getRelationType($this->relationName);

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

         if ($this->relationType == 'belongsToMany') {
            $field->type = 'checkboxlist';
            $field->value = $relationObj->getRelatedIds();
         }
         else if ($this->relationType == 'belongsTo') {
            $field->type = 'dropdown';
            $foreignKey = $relationObj->getForeignKey();
            $field->value = $this->model->$foreignKey;
         }

         // @todo Should be configurable
         $field->options = $relatedObj->all()->lists('name', 'id');

         return $this->renderFormField = $field;
    }

}