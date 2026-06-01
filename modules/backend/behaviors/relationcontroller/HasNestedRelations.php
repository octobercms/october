<?php namespace Backend\Behaviors\RelationController;

use Form as FormHelper;
use October\Rain\Html\Helper as HtmlHelper;

/**
 * HasNestedRelations implements nested relation chains
 */
trait HasNestedRelations
{
    /**
     * @var array manageIds provided by the relationship chain
     */
    protected $manageIds = [];

    /**
     * @var array sessionKeys provided by the relationship chain
     */
    protected $sessionKeys = [];

    /**
     * getSessionKeysForField returns a session key for saving a form and for binding a relation,
     * the result is an array with [formSessionKey, relationSessionKey]
     */
    protected function getSessionKeysForField($field): array
    {
        if (isset($this->sessionKeys[$field])) {
            return $this->sessionKeys[$field];
        }

        if ($configSessionKey = $this->getConfig('sessionKey')) {
            return $this->sessionKeys[$field] = [$configSessionKey, $configSessionKey];
        }

        $sessionKey = post('_session_key', FormHelper::getSessionKey());
        $relationSessionKey = post('_relation_session_key', $sessionKey);

        return $this->sessionKeys[$field] = [$sessionKey, $relationSessionKey];
    }

    /**
     * getManageIdForField
     */
    protected function getManageIdForField($field)
    {
        // Field checksum for manage id
        if ($field === post('_relation_field') && ($manageId = post('manage_id', -1)) !== -1) {
            return $this->manageIds[$field] = $manageId;
        }

        if (isset($this->manageIds[$field])) {
            return $this->manageIds[$field];
        }

        return null;
    }

    /**
     * initNestedRelation checks the extra configuration for a relationship chain
     * and binds the manage forms to the controller, which may contain additional
     * relation definitions via the relation form widget.
     */
    protected function initNestedRelation($model, $parentField)
    {
        // Process session keys
        $sessionKeys = $this->extraConfig['sessionKeys'] ?? [];
        foreach ($sessionKeys as $field => $keys) {
            if (is_array($keys)) {
                $this->sessionKeys[$field] = $keys;
            }
        }

        // Process manage IDs
        $manageIds = $this->extraConfig['manageIds'] ?? [];
        foreach ($manageIds as $field => $id) {
            $this->manageIds[$field] = $id;
        }

        // Process nesting chain
        $checked = [];
        $checked[$parentField] = true;
        $chain = $this->extraConfig['chain'] ?? [];
        foreach ($chain as $field) {
            if (!$field || isset($checked[$field])) {
                continue;
            }

            $this->initRelationInternal($model, $field);
            $checked[$field] = true;
        }
    }

    /**
     * makeNestedRelationModel resolves a relation based on a nested field name
     * E.g: model[relation1][relation2] → $model->relation1()->relation2()
     */
    protected function makeNestedRelationModel($model, $field)
    {
        if (!str_contains($field, '[') || !str_contains($field, ']')) {
            return [$model, $field];
        }

        if ($result = $this->resolveNestedRelationModelFromManageId($model, $field)) {
            return $result;
        }

        if ($result = $this->resolveNestedRelationModelFromModelRelationship($model, $field)) {
            return $result;
        }

        // Fallback with an empty related model
        return $this->resolveNestedRelationModelFromDefault($model, $field);
    }

    /**
     * resolveNestedRelationModelFromModelRelationship returns a nested relation model
     * locating it using `array_get` to resolve the value
     */
    protected function resolveNestedRelationModelFromModelRelationship($model, $field): ?array
    {
        $parts = HtmlHelper::nameToArray($field);
        $lastField = array_pop($parts);

        // Custom array_get() function to look for [id:x] segments
        $arrayGet = function($model, $parts, $default = null) {
            foreach ($parts as $segment) {
                $isPrimaryKey = str_starts_with($segment, 'id:');
                if ($isPrimaryKey) {
                    $segment = ltrim($segment, 'id:');
                }

                if ($isPrimaryKey && $model instanceof \Illuminate\Support\Collection) {
                    $model = $model->find($segment);
                }
                else {
                    $model = array_get($model, $segment);
                }

                // Prevents an empty collection resolving as true here
                if ($model instanceof \Illuminate\Support\Collection && $model->isEmpty()) {
                    return $default;
                }

                if (!$model) {
                    return $default;
                }
            }

            return $model;
        };

        if ($lookupModel = $arrayGet($model, $parts)) {
            if ($lookupModel instanceof \Illuminate\Support\Collection) {
                $lookupModel = $lookupModel->first();
            }

            if ($lookupModel) {
                return [$lookupModel, $lastField];
            }
        }

        return null;
    }

    /**
     * resolveNestedRelationModelFromManageId returns a resolved relation with a single hop
     */
    protected function resolveNestedRelationModelFromManageId($model, $field): ?array
    {
        // Looking for a direct hop up, so pop off the end
        $parts = HtmlHelper::nameToArray($field);
        array_pop($parts);

        // Rebuild the field name with the end popped off
        $parentField = array_shift($parts);
        if ($parts) {
            $parentField .= '['.implode('][', $parts).']';
        }

        // Locate the parent in the manage IDs, populate the model if possible
        if (array_key_exists($parentField, $this->manageIds)) {
            [$lastModel, $lastField] = $this->resolveNestedRelationModelFromDefault($model, $field);

            if (
                ($parentId = $this->manageIds[$parentField]) &&
                ($manageModel = $lastModel->find($parentId))
            ) {
                $lastModel = $manageModel;
            }

            return [$lastModel, $lastField];
        }

        return null;
    }

    /**
     * resolveNestedRelationModelFromDefault
     */
    protected function resolveNestedRelationModelFromDefault($model, $field): array
    {
        $parts = array_filter(HtmlHelper::nameToArray($field), function($val) {
            return !is_numeric(ltrim($val, 'id:'));
        });

        $lastModel = $model;
        $lastField = array_pop($parts);
        while ($rootField = array_shift($parts)) {
            $lastModel = $lastModel->$rootField()->getRelated();
        }

        return [$lastModel, $lastField];
    }
}
