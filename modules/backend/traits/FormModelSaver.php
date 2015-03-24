<?php namespace Backend\Traits;

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
     * @param Model $model Model to save to
     * @return array The collection of models to save.
     */
    protected function setModelAttributes($model, $saveData)
    {
        $this->modelsToSave[] = $model;

        if (!is_array($saveData)) {
            return;
        }

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
                $model->{$attribute} = $value;
            }
        }
    }

}
