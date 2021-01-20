<?php namespace Backend\Traits;

use Lang;
use ApplicationException;
use October\Rain\Html\Helper as HtmlHelper;

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
     * @param \October\Rain\Halcyon\Model|\October\Rain\Database\Model $model The model in use in the form or list.
     * @param \Backend\Classes\FormField|\Backend\Classes\ListColumn $field The field configuration.
     * @param array $options The options as specified in the field configuration.
     * @param array $formData The form data.
     * @return array
     */
    protected function getOptionsFromModel($model, $field, $options = [], $formData = [])
    {
        /*
         * Advanced usage, supplied options are callable
         * [\Path\To\Class, methodName]
         */
        if (is_array($options) && is_callable($options)) {
            $options = call_user_func($options, $this, $field);

            if (!is_array($options)) {
                throw new ApplicationException(Lang::get('backend::lang.field.options_method_invalid_value', [
                    'class' => $options[0],
                    'method' => $options[1]
                ]));
            }

            return $options;
        }

        $fieldName = $this->resolveFieldName($field);
        $fieldValue = $this->resolveFieldValue($model, $field);

        /*
        * Field options are an explicit method reference
        */
        if (is_string($options)) {
            // \Path\To\Class::staticMethodOptions
            if (str_contains($options, '::')) {
                $options = explode('::', $options);
                if (count($options) === 2 && class_exists($options[0]) && method_exists($options[0], $options[1])) {
                    $result = $options[0]::{$options[1]}($fieldName, $fieldValue, $formData);
                    if (!is_array($result)) {
                        throw new ApplicationException(Lang::get('backend::lang.field.options_static_method_invalid_value', [
                            'class' => $options[0],
                            'method' => $options[1]
                        ]));
                    }
                    return $result;
                }
            }

            // $model->{$options}()
            if (!$this->objectMethodExists($model, $options)) {
                throw new ApplicationException(Lang::get('backend::lang.field.options_method_not_exists', [
                    'model'  => get_class($model),
                    'method' => $options,
                    'field'  => $fieldName
                ]));
            }

            $options = $this->model->$options($fieldName, $fieldValue, $formData);
        }
        /*
         * Refer to the model method or any of its behaviors
         */
        elseif (!is_array($options) || !count($options)) {
            try {
                list($relatedModel, $attribute) = $this->resolveModelAttribute($model, $fieldName);
                if (!$relatedModel) {
                    throw new Exception();
                }
            }
            catch (Exception $e) {
                throw new ApplicationException(Lang::get('backend::lang.field.options_method_invalid_model', [
                    'model' => get_class($model),
                    'field' => $fieldName
                ]));
            }

            $model = $relatedModel;

            $methodName = 'get' . studly_case($attribute) . 'Options';

            if ($this->objectMethodExists($model, $methodName)) {
                $options = $model->$methodName($fieldValue, $formData);
            } elseif ($this->objectMethodExists($model, 'getDropdownOptions')) {
                $options = $model->getDropdownOptions($attribute, $fieldValue, $formData);
            } else {
                throw new ApplicationException(Lang::get('backend::lang.field.options_method_not_exists', [
                    'model'  => get_class($model),
                    'method' => $methodName,
                    'field'  => $attribute
                ]));
            }
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

    /**
     * Returns the field name based on the type of field in use.
     *
     * @param \Backend\Classes\FormField|\Backend\Classes\ListColumn $field
     * @return string
     */
    protected function resolveFieldName($field)
    {
        return ($field instanceof \Backend\Classes\FormField)
            ? $field->fieldName
            : $field->columnName;
    }

    /**
     * Returns the field's value based on the type of field in use.
     *
     * @param \October\Rain\Halcyon\Model|\October\Rain\Database\Model $model The model in use in the form or list.
     * @param \Backend\Classes\FormField|\Backend\Classes\ListColumn $field
     * @return string|null
     */
    protected function resolveFieldValue($model, $field)
    {
        if ($field instanceof \Backend\Classes\FormField) {
            return $field->value;
        }

        $fieldName = $this->resolveFieldName($field);
        try {
            list($model, $attribute) = $this->resolveModelAttribute($model, $fieldName);
            if (!$model) {
                throw new Exception();
            }
        }
        catch (Exception $e) {
            throw new ApplicationException(Lang::get('backend::lang.field.options_method_invalid_model', [
                'model' => get_class($model),
                'field' => $fieldName
            ]));
        }

        return $model->{$attribute};
    }

    /**
     * Returns the final model and attribute name of a nested attribute. Eg:
     *
     *     list($model, $attribute) = $this->resolveAttribute('person[phone]');
     *
     * @param \October\Rain\Halcyon\Model|\October\Rain\Database\Model $model
     * @param string|array $attribute
     * @return array
     */
    public function resolveModelAttribute($model, $attribute)
    {
        $parts = is_array($attribute) ? $attribute : HtmlHelper::nameToArray($attribute);
        $last = array_pop($parts);

        foreach ($parts as $part) {
            $model = $model->{$part} ?? null;

            if (is_null($model)) {
                return null;
            }
        }

        return [$model, $last];
    }
}
