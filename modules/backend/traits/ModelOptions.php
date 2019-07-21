<?php namespace Backend\Traits;

use Lang;
use ApplicationException;

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
     * @param $options
     * @return mixed
     */
    protected function getOptionsFromModel($field, $options, $fieldName = '')
    {
        /*
         * Advanced usage, supplied options are callable
         */
        if (is_array($options) && is_callable($options)) {
            $options = call_user_func($options, $this, $field);
        }

        /*
         * Refer to the model method or any of its behaviors
         */
        if (!is_array($options) && !$options) {
            if (empty($fieldName)) {
                try {
                    list($this->model, $attribute) = $field->resolveModelAttribute($this->model, $field->fieldName);
                    $fieldName = $field->fieldName;
                }
                catch (Exception $ex) {
                    throw new ApplicationException(Lang::get('backend::lang.field.options_method_invalid_model', [
                        'model' => get_class($this->model),
                        'field' => $field->fieldName
                    ]));
                }
            }

            $methodName = 'get' . studly_case($fieldName) . 'Options';

            if (
                !$this->objectMethodExists($this->model, $methodName) &&
                !$this->objectMethodExists($this->model, 'getDropdownOptions')
            ) {
                throw new ApplicationException(Lang::get('backend::lang.field.options_method_not_exists', [
                    'model'  => get_class($this->model),
                    'method' => $methodName,
                    'field'  => $fieldName
                ]));
            }
            if ($this->objectMethodExists($this->model, $methodName)) {
                $options = $this->model->$methodName($field->getValueFromData($this->data), $this->data);
            }
            else {
                $options = $this->model->getDropdownOptions($fieldName, $field->getValueFromData($this->data), $this->data);
            }
        }
        /*
         * Field options are an explicit method reference
         */
        elseif (is_string($options)) {
            if (!$this->objectMethodExists($this->model, $options)) {
                throw new ApplicationException(Lang::get('backend::lang.field.options_method_not_exists', [
                    'model'  => get_class($this->model),
                    'method' => $options,
                    'field'  => $field->fieldName
                ]));
            }
            $options = $this->model->$options($field->getValueFromData($this->data), $fieldName, $this->data);
        }
        return $options;
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
