<?php namespace Backend\Traits;

/**
 * Model Options Trait
 * Implements helper methods useful to extract the options from a given field
 * that is used in the List and Form widgets.
 */

trait ModelOptions
{
    /**
     * Looks at the model for defined options.
     *
     * @param $field
     * @param $fieldOptions
     * @return mixed
     */
    protected function getOptionsFromModel($field, $fieldOptions, $fieldName = '')
    {
        /*
         * Advanced usage, supplied options are callable
         */
        if (is_array($fieldOptions) && is_callable($fieldOptions)) {
            $fieldOptions = call_user_func($fieldOptions, $this, $field);
        }
        /*
         * Refer to the model method or any of its behaviors
         */
        if (!is_array($fieldOptions) && !$fieldOptions) {
            if(empty($fieldName)) {
                try {
                    list($model, $attribute) = $field->resolveModelAttribute($this->model, $field->fieldName);
                }
                catch (Exception $ex) {
                    throw new ApplicationException(Lang::get('backend::lang.field.options_method_invalid_model', [
                        'model' => get_class($model),
                        'field' => $field->fieldName
                    ]));
                }
            } else {
                $methodName = 'get' . studly_case($fieldName) . 'Options';
                $model = $this -> model;
            }

            if (
                !$this->objectMethodExists($model, $methodName) &&
                !$this->objectMethodExists($model, 'getDropdownOptions')
            ) {
                throw new ApplicationException(Lang::get('backend::lang.field.options_method_not_exists', [
                    'model'  => get_class($model),
                    'method' => $methodName,
                    'field'  => $field->fieldName
                ]));
            }
            if ($this->objectMethodExists($model, $methodName)) {
                $fieldOptions = $model->$methodName($field->value, $this->data);
            }
            else {
                $fieldOptions = $model->getDropdownOptions($attribute, $field->value, $this->data);
            }
        }
        /*
         * Field options are an explicit method reference
         */
        elseif (is_string($fieldOptions)) {
            if (!$this->objectMethodExists($model, $fieldOptions)) {
                throw new ApplicationException(Lang::get('backend::lang.field.options_method_not_exists', [
                    'model'  => get_class($model),
                    'method' => $fieldOptions,
                    'field'  => $field->fieldName
                ]));
            }
            $fieldOptions = $model->$fieldOptions($field->value, $field->fieldName, $this->data);
        }
        return $fieldOptions;
    }

    /**
     * Internal helper for method existence checks.
     *
     * @param  object $object
     * @param  string $method
     * @return boolean
     */
    protected function objectMethodExists($object, $method)
    {
        if (method_exists($object, 'methodExists')) {
            return $object->methodExists($method);
        }
        return method_exists($object, $method);
    }
}
