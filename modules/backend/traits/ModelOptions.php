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
     * @param $fieldOptions
     * @return mixed
     */
    protected function getOptionsFromModel($field, $fieldOptions)
    {
        /*
         * Advanced usage, supplied options are callable
         * [\Path\To\Class, methodName]
         */
        if (is_array($fieldOptions) && is_callable($fieldOptions)) {
            $fieldOptions = call_user_func($fieldOptions, $this, $field);
        }

        /*
         * Refer to the model method or any of its behaviors
         */
        if (!is_array($fieldOptions) && !$fieldOptions) {
            try {
                list($model, $attribute) = $field->resolveModelAttribute($this->model, $field->fieldName);
                if (!$model) {
                    throw new Exception();
                }
            }
            catch (Exception $ex) {
                throw new ApplicationException(Lang::get('backend::lang.field.options_method_invalid_model', [
                    'model' => get_class($this->model),
                    'field' => $field->fieldName
                ]));
            }

            $methodName = 'get'.studly_case($attribute).'Options';
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
            // \Path\To\Class::staticMethodOptions
            if (str_contains($fieldOptions, '::')) {
                $options = explode('::', $fieldOptions);
                if (count($options) === 2 && class_exists($options[0]) && method_exists($options[0], $options[1])) {
                    $result = $options[0]::{$options[1]}($this, $field);
                    if (!is_array($result)) {
                        throw new ApplicationException(Lang::get('backend::lang.field.options_static_method_invalid_value', [
                            'class' => $options[0],
                            'method' => $options[1]
                        ]));
                    }
                    return $result;
                }
            }

            // $model->{$fieldOptions}()
            if (!$this->objectMethodExists($this->model, $fieldOptions)) {
                throw new ApplicationException(Lang::get('backend::lang.field.options_method_not_exists', [
                    'model'  => get_class($this->model),
                    'method' => $fieldOptions,
                    'field'  => $field->fieldName
                ]));
            }

            $fieldOptions = $this->model->$fieldOptions($field->value, $field->fieldName, $this->data);
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
