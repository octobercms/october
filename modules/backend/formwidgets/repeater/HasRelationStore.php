<?php namespace Backend\FormWidgets\Repeater;

use Backend\Classes\FormField;
use October\Rain\Database\Model;
use October\Rain\Exception\ValidationException;
use October\Rain\Html\Helper as HtmlHelper;

/**
 * HasRelationStore contains logic for related repeater items
 */
trait HasRelationStore
{
    /**
     * processRelationMode
     */
    protected function processRelationMode()
    {
        [$model, $attribute] = $this->nearestModelAttribute($this->valueFrom);

        if ($model instanceof Model && $model->hasRelation($attribute)) {
            $this->useRelation = true;
        }
    }

    /**
     * getModelFromIndex returns the model at a given index
     * @param int|string $index
     */
    protected function getModelFromIndex($index)
    {
        return $this->getLoadValueFromRelation()[$index] ?? $this->getRelationModel();
    }

    /**
     * getLoadValueFromRelation
     */
    protected function getLoadValueFromRelation()
    {
        if ($this->relatedRecords !== null) {
            return $this->relatedRecords;
        }

        $records = $this->getRelationObject()
            ->withDeferred($this->getSessionKey())
            ->get();

        if ($first = $records->first()) {
            $records = $records->keyBy($first->getKeyName())->all();
        }
        else {
            $records = [];
        }

        // Store the results locally on the model to make it available to the
        // RelationController via the initNestedRelation method
        if ($records) {
            [$model, $attribute] = $this->resolveModelAttribute($this->valueFrom);
            $model->setRelation($attribute, $model->newCollection($records));
        }

        return $this->relatedRecords = $records;
    }

    /**
     * getRelationQuery
     */
    protected function getRelationQuery()
    {
        $query = $this->getRelationModel()->newQuery();

        $this->getRelationObject()->addDefinedConstraintsToQuery($query);

        return $query;
    }

    /**
     * createRelationAtIndex prepares an empty model and adds it to the index
     * @param ?string $groupCode
     */
    protected function createRelationAtIndex($groupCode = null, ?array $attributes = null)
    {
        $model = $this->getRelationModel();

        if ($attributes !== null) {
            $model->forceFill($attributes);

            if ($this->useGroups && $groupCode === null) {
                $groupCode = $this->getGroupCodeFromRelation($model);
            }
        }

        if ($this->useGroups) {
            $this->setGroupCodeOnRelation($model, $groupCode);
        }

        $model->save(['force' => true]);

        $this->getRelationObject()->add($model, $this->getSessionKey());

        $this->relatedRecords[$model->getKey()] = $model;

        return $model;
    }

    /**
     * duplicateRelationAtIndex
     * @param int|string $fromIndex
     * @param string $groupCode
     */
    protected function duplicateRelationAtIndex($fromIndex, $groupCode = null)
    {
        $model = $this->getModelFromIndex($fromIndex)->replicateWithRelations();

        if ($this->useGroups) {
            $this->setGroupCodeOnRelation($model, $groupCode);
        }

        $model->save(['force' => true]);

        $this->getRelationObject()->add($model, $this->getSessionKey());

        $this->relatedRecords[$model->getKey()] = $model;

        return $model;
    }

    /**
     * deleteRelationAtIndex
     * @param int|string $index
     */
    protected function deleteRelationAtIndex($index)
    {
        $model = $this->getModelFromIndex($index);
        if (!$model->exists) {
            return;
        }

        $this->getRelationObject()->remove($model, $this->getSessionKey());
    }

    /**
     * processItemsForRelation processes data and applies it to the form widgets
     */
    protected function processItemsForRelation()
    {
        $currentValue = $this->getLoadValueFromRelation();

        // Apply default values on first load, under very specific conditions
        if (
            !$this->model->exists &&
            !$this->isLoaded &&
            !$currentValue &&
            is_array($this->formField->defaults)
        ) {
            $currentValue = [];
            foreach ($this->formField->defaults as $attributes) {
                if (is_array($attributes)) {
                    $currentValue[] = $attributes;
                }
            }
        }

        // Pad current value with minimum items and disable for groups,
        // which cannot predict their item types
        if (!$this->useGroups && $this->minItems > 0) {
            if (!is_array($currentValue)) {
                $currentValue = [];
            }

            if (count($currentValue) < $this->minItems) {
                $currentValue = array_pad($currentValue, $this->minItems, []);
            }
        }

        if (!is_array($currentValue)) {
            return;
        }

        // Load up the necessary form widgets
        foreach ($currentValue as $value) {
            if (is_array($value)) {
                $value = $this->createRelationAtIndex(null, $value);
            }

            $this->makeItemFormWidget(
                $value->getKey(),
                $this->getGroupCodeFromRelation($value)
            );
        }
    }

    /**
     * processSaveForRelation
     */
    protected function processSaveForRelation($value)
    {
        if (!is_array($value) || !$value) {
            return FormField::NO_SAVE_DATA;
        }

        $sortCount = 0;

        foreach ($value as $index => $data) {
            if (!isset($this->formWidgets[$index])) {
                continue;
            }

            // Give repeated form field widgets an opportunity to process the data.
            $widget = $this->formWidgets[$index];
            $saveData = $widget->getSaveData();

            // Save data to the model
            $model = $widget->getModel();

            $modelsToSave = $this->prepareModelsToSave($model, $saveData);

            if ($this->useGroups) {
                $this->setGroupCodeOnRelation($model, $data[$this->groupKeyFrom] ?? '');
            }

            if ($model->isClassInstanceOf(\October\Contracts\Database\SortableInterface::class)) {
                $this->processSortOrderForSortable($model, ++$sortCount);
            }

            foreach ($modelsToSave as $attrChain => $modelToSave) {
                try {
                    $modelToSave->save(['sessionKey' => $widget->getSessionKeyWithSuffix()]);
                }
                catch (ValidationException $ve) {
                    $ve->setFieldPrefix(array_merge(
                        HtmlHelper::nameToArray($this->valueFrom),
                        [$index],
                        $attrChain ? explode('.', $attrChain) : []
                    ));
                    throw $ve;
                }
            }
        }

        return FormField::NO_SAVE_DATA;
    }

    /**
     * processSortOrderForSortable
     */
    protected function processSortOrderForSortable($model, $sortOrder)
    {
        $orderColumn = $model->getSortOrderColumn();

        $model->$orderColumn = $sortOrder;
    }

    /**
     * getGroupCodeFromRelation
     */
    protected function getGroupCodeFromRelation($model)
    {
        $attrName = $this->groupKeyFrom;

        return $model->$attrName;
    }

    /**
     * setGroupCodeOnRelation
     */
    protected function setGroupCodeOnRelation($model, $groupCode)
    {
        $attrName = $this->groupKeyFrom;

        $model->$attrName = $groupCode;
    }
}
