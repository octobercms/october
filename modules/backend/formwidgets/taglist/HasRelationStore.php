<?php namespace Backend\FormWidgets\TagList;

use Illuminate\Support\Collection;
use October\Rain\Database\Relations\Relation as RelationBase;
use SystemException;

/**
 * HasRelationStore contains logic for related tag items
 */
trait HasRelationStore
{
    /**
     * getLoadValueFromRelation
     */
    protected function getLoadValueFromRelation($names)
    {
        // Take value from options
        if ($this->useOptions) {
            if (!$names) {
                return [];
            }

            $result = (new Collection($this->formField->options()))
                ->reject(function($value, $key) use ($names) {
                    return !in_array($key, $names);
                })
                ->all();
        }
        // Take existing relationship
        else {
            $keyName = $this->useKey
                ? $this->getRelationModel()->getQualifiedKeyName()
                : $this->nameFrom;

            $result = $this->getRelationObject()->pluck($keyName)->all();
        }

        // Default value
        if (!$result && !$this->model->exists) {
            return $names;
        }

        return $result;
    }

    /**
     * getFieldOptionsForRelation
     */
    protected function getFieldOptionsForRelation()
    {
        return RelationBase::noConstraints(function () {
            $query = $this->getRelationObject()->newQuery();

            // Even though "no constraints" is applied, belongsToMany constrains the query
            // by joining its pivot table. Remove all joins from the query.
            $query->getQuery()->getQuery()->joins = [];

            $keyName = $this->getRelationModel()->getQualifiedKeyName();

            return $query->pluck($this->nameFrom, $keyName)->all();
        });
    }

    /**
     * processSaveForRelation
     */
    protected function processSaveForRelation($values)
    {
        if (!$values) {
            return $values;
        }

        $relationModel = $this->getRelationModel();

        // Options from form field
        if ($this->useOptions) {
            $existingTags = (new Collection($this->formField->options()))
                ->reject(function($value, $key) use ($values) {
                    return !in_array($value, $values);
                })
                ->all()
            ;
        }
        // Options from model, useKey uses IDs directly
        elseif ($this->useKey) {
            return $values;
        }
        // Options from model, lookup by name
        else {
            $existingTags = $relationModel
                ->whereIn($this->nameFrom, $values)
                ->pluck($this->nameFrom, $relationModel->getKeyName())
                ->all()
            ;
        }

        // Allow custom tags (only applicable when useKey is false)
        if ($this->customTags) {
            $newTags = array_diff($values, $existingTags);

            // Cannot create new tags when read-only options are supplied
            if ($newTags && $this->useOptions) {
                throw new SystemException("[{$this->valueFrom}] Options are read-only so new tags cannot be created. Try setting customTags: false in the field configuration.");
            }

            foreach ($newTags as $newTag) {
                $newModel = $relationModel->newInstance();
                $newModel->{$this->nameFrom} = $newTag;
                $newModel->save(['force' => true]);

                $existingTags[$newModel->getKey()] = $newTag;
            }
        }

        return array_keys($existingTags);
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
}
