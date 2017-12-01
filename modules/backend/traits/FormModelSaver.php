<?php namespace Backend\Traits;

use Str;
use Backend\Classes\FormField;
use October\Rain\Halcyon\Model as HalcyonModel;
use October\Rain\Database\Model as DatabaseModel;

/**
 * Implements special logic for processing form data, typically from from postback, and
 * filling the model attributes and attributes of any related models. This is a
 * customized, safer and simplified version of `$model->push()`.
 *
 * @package october\backend
 * @author Alexey Bobkov, Samuel Georges
 */

trait FormModelSaver
{
    /**
     * @var array List of prepared models that require saving.
     */
    protected $modelsToSave = [];

    /**
     * Takes a model and fills it with data from a multidimensional array.
     * If an attribute is found to be a relationship, that relationship
     * is also filled.
     *
     *     $modelsToSave = $this->prepareModelsToSave($model, [...]);
     *
     *     foreach ($modelsToSave as $modelToSave) {
     *         $modelToSave->save();
     *     }
     *
     * @param \October\Rain\Database\Model $model Model to fill.
     * @param array $saveData Attribute values to fill model.
     * @return array The collection of models to save.
     */
    protected function prepareModelsToSave($model, $saveData)
    {
        $this->modelsToSave = [];
        $this->setModelAttributes($model, $saveData);
        return $this->modelsToSave;
    }

    /**
     * Sets a data collection to a model attributes, relations will also be set.
     * @return void
     */
    protected function setModelAttributes($model, $saveData)
    {
        $this->modelsToSave[] = $model;

        if (!is_array($saveData)) {
            return;
        }

        if ($model instanceof HalcyonModel) {
            $model->fill($saveData);
            return;
        }

        $attributesToPurge = [];
        $singularTypes = ['belongsTo', 'hasOne', 'morphOne'];

        foreach ($saveData as $attribute => $value) {
            $isNested = $attribute == 'pivot' || (
                $model->hasRelation($attribute) &&
                in_array($model->getRelationType($attribute), $singularTypes)
            );

            if ($isNested && is_array($value)) {
                $this->setModelAttributes($model->{$attribute}, $value);
            }
            elseif ($value !== FormField::NO_SAVE_DATA) {
                if (Str::startsWith($attribute, '_')) {
                    $attributesToPurge[] = $attribute;
                }
                $model->{$attribute} = $value;
            }
        }

        if ($attributesToPurge) {
            $this->deferPurgedSaveAttributes($model, $attributesToPurge);
        }
    }

    protected function deferPurgedSaveAttributes($model, $attributesToPurge)
    {
        if (!is_array($attributesToPurge)) {
            return;
        }

        /*
         * Compatibility with Purgeable trait:
         * This will give the ability to restore purged attributes
         * and make them available again if necessary.
         */
        if (method_exists($model, 'getPurgeableAttributes')) {
            $model->addPurgeable($attributesToPurge);
        }
        else {
            $model->bindEventOnce('model.saveInternal', function () use ($model, $attributesToPurge) {
                foreach ($attributesToPurge as $attribute) {
                    unset($model->attributes[$attribute]);
                }
            });
        }
    }
}
