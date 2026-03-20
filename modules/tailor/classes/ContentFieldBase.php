<?php namespace Tailor\Classes;

use October\Contracts\Element\ListElement;
use October\Contracts\Element\FormElement;
use October\Contracts\Element\FilterElement;
use October\Rain\Element\Form\FieldDefinition;

/**
 * ContentFieldBase class for content fields
 *
 * @method ContentFieldBase column(array $config) column configuration
 * @method ContentFieldBase scope(array $config) scope configuration
 *
 * @package october\tailor
 * @author Alexey Bobkov, Samuel Georges
 */
abstract class ContentFieldBase extends FieldDefinition
{
    /**
     * defineConfig for the field
     */
    public function defineConfig(array $config)
    {
    }

    /**
     * validateConfig for the field
     */
    public function validateConfig()
    {
    }

    /**
     * extendModelObject
     */
    public function extendModelObject($model)
    {
    }

    /**
     * extendBatchModelObject is used for import/export context
     */
    public function extendBatchModelObject($model)
    {
    }

    /**
     * extendDatabaseTable
     */
    public function extendDatabaseTable($table)
    {
    }

    /**
     * defineListColumn
     */
    public function defineListColumn(ListElement $list, $context = null)
    {
    }

    /**
     * defineBatchListColumn is used for import/export context
     */
    public function defineBatchListColumn(ListElement $list, $context = null)
    {
    }

    /**
     * defineFormField
     */
    public function defineFormField(FormElement $form, $context = null)
    {
    }

    /**
     * defineBatchFormField is used for import/export context
     */
    public function defineBatchFormField(FormElement $form, $context = null)
    {
    }

    /**
     * defineFilterScope
     */
    public function defineFilterScope(FilterElement $filter, $context = null)
    {
    }

    /**
     * extendModel
     */
    public function extendModel($model)
    {
        $this->extendModelObject($model);
        $this->extendModelValidation($model);
        $this->extendModelMultisite($model);
    }

    /**
     * extendModelValidation
     */
    public function extendModelValidation($model)
    {
        if ($this->validation) {
            $model->rules[$this->fieldName] = $this->validation;
        }
        elseif ($this->validation === false) {
            unset($model->rules[$this->fieldName]);
        }

        if ($this->validationName) {
            $model->attributeNames[$this->fieldName] = $this->validationName;
        }

        if ($this->validationMessages) {
            foreach ($this->validationMessages as $rule => $message) {
                $model->customMessages[$this->fieldName.'.'.$rule] = $message;
            }
        }
    }

    /**
     * extendModelMultisite flags relations as propagatable and must come after
     * the extendModelObject call
     */
    public function extendModelMultisite($model)
    {
        if ($this->translatable === false || $this->propagatable === true) {
            if (method_exists($model, 'addPropagatable')) {
                $model->addPropagatable($this->fieldName);
            }
        }
    }

    /**
     * evalConfig from an array and apply them to the object
     */
    public function evalConfig(array $config)
    {
        $this->defineConfig($config);
    }

    /**
     * validate
     */
    public function validate()
    {
        $this->validateConfig();
    }

    /**
     * transferConfig is used to reuse base configuration on a secondary definition,
     * such as a list column or filter scope.
     */
    protected function transferConfig($toElement, array $transferable)
    {
        foreach ($transferable as $name) {
            if ($this->{$name} !== null) {
                $toElement->{$name}($this->{$name});
            }
        }
    }
}
