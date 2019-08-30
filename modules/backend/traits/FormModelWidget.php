<?php namespace Backend\Traits;

use Lang;
use ApplicationException;
use Exception;

/**
 * Form Model Widget Trait
 *
 * Special logic for for form widgets that use a database stored model.
 *
 * @package october\backend
 * @author Alexey Bobkov, Samuel Georges
 */

trait FormModelWidget
{

    /**
     * Returns the final model and attribute name of
     * a nested HTML array attribute.
     * Eg: list($model, $attribute) = $this->resolveModelAttribute($this->valueFrom);
     * @param  string $attribute.
     * @return array
     */
    public function resolveModelAttribute($attribute)
    {
        try {
            return $this->formField->resolveModelAttribute($this->model, $attribute);
        }
        catch (Exception $ex) {
            throw new ApplicationException(Lang::get('backend::lang.model.missing_relation', [
                'class' => get_class($this->model),
                'relation' => $attribute
            ]));
        }
    }

    /**
     * Returns the model of a relation type,
     * supports nesting via HTML array.
     * @return Relation
     */
    protected function getRelationModel()
    {
        list($model, $attribute) = $this->resolveModelAttribute($this->valueFrom);

        if (!$model) {
            throw new ApplicationException(Lang::get('backend::lang.model.missing_relation', [
                'class' => get_class($this->model),
                'relation' => $this->valueFrom
            ]));
        }

        if (!$model->hasRelation($attribute)) {
            throw new ApplicationException(Lang::get('backend::lang.model.missing_relation', [
                'class' => get_class($model),
                'relation' => $attribute
            ]));
        }

        return $model->makeRelation($attribute);
    }

    /**
     * Returns the value as a relation object from the model,
     * supports nesting via HTML array.
     * @return Relation
     */
    protected function getRelationObject()
    {
        list($model, $attribute) = $this->resolveModelAttribute($this->valueFrom);

        if (!$model) {
            throw new ApplicationException(Lang::get('backend::lang.model.missing_relation', [
                'class' => get_class($this->model),
                'relation' => $this->valueFrom
            ]));
        }

        if (!$model->hasRelation($attribute)) {
            throw new ApplicationException(Lang::get('backend::lang.model.missing_relation', [
                'class' => get_class($model),
                'relation' => $attribute
            ]));
        }

        return $model->{$attribute}();
    }

    /**
     * Returns the value as a relation type from the model,
     * supports nesting via HTML array.
     * @return Relation
     */
    protected function getRelationType()
    {
        list($model, $attribute) = $this->resolveModelAttribute($this->valueFrom);
        return $model->getRelationType($attribute);
    }
}
