<?php namespace Backend\Traits;

use Str;
use Backend\Classes\FormField;

/**
 * Form Model Saver Trait
 *
 * Special logic for applying form data (usually from postback) and
 * applying it to a model and its relationships. This is a customized,
 * safer and simplified version of $model->push().
 *
 * Usage:
 *
 *    $modelsToSave = $this->prepareModelsToSave($model, [...]);
 * 
 *    foreach ($modelsToSave as $modelToSave) {
 *        $modelToSave->save();
 *    }
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

    protected function prepareModelsToSave($model, $saveData)
    {
        $this->modelsToSave = [];
        $this->setModelAttributes($model, $saveData);
        return $this->modelsToSave;
    }

    /**
     * Sets a data collection to a model attributes, relations will also be set.
     * @param array $saveData Data to save.
     * @param \October\Rain\Database\Model $model Model to save to
     * @return array The collection of models to save.
     */
    protected function setModelAttributes($model, $saveData)
    {
        $this->modelsToSave[] = $model;

        if (!is_array($saveData)) {
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
            $model->bindEventOnce('model.saveInternal', function() use ($model, $attributesToPurge) {
                foreach ($attributesToPurge as $attribute) {
                    unset($model->attributes[$attribute]);
                }
            });
        }
    }
}
