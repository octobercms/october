<?php namespace Backend\Widgets\Filter;

use BackendAuth;
use October\Rain\Html\Helper as HtmlHelper;

/**
 * ScopeProcessor concern
 */
trait ScopeProcessor
{
    /**
     * processFieldOptionValues sets the callback for retrieving options
     */
    protected function processFieldOptionValues(array $scopes): void
    {
        $optionModelTypes = ['dropdown'];

        foreach ($scopes as $scope) {
            if (!in_array($scope->type, $optionModelTypes, false)) {
                continue;
            }

            // Specified explicitly on the object already
            if ($scope->hasOptions()) {
                continue;
            }

            // Defer the execution of option data collection
            $scopeOptions = $scope->optionsMethod ?: $scope->options;
            $scope->options(function () use ($scope, $scopeOptions) {
                return $scope->getOptionsFromModel($this->model, $scopeOptions);
            });
        }
    }

    /**
     * processScopeModels creates associated models for scopes
     */
    protected function processScopeModels(array $scopes): void
    {
        foreach ($scopes as $scopeName => $scope) {
            if ($className = $scope->modelClass) {
                $model = new $className;
                $this->scopeModels[$scopeName] = $model;
            }
            elseif ($this->model) {
                [$nestedModel, $nestedField] = $this->makeNestedFilterModel($this->model, $scopeName);
                if ($nestedModel->hasRelation($nestedField)) {
                    $this->scopeModels[$scopeName] = $nestedModel->makeRelation($nestedField);
                }
            }
        }
    }

    /**
     * processPermissionCheck check if user has permissions to show the scope
     * and removes it if permission is denied
     */
    protected function processPermissionCheck(array $scopes): void
    {
        foreach ($scopes as $scopeName => $scope) {
            if (
                $scope->permissions &&
                !BackendAuth::userHasAccess($scope->permissions, false)
            ) {
                $this->removeScope($scopeName);
            }
        }
    }

    /**
     * processFilterWidgetScopes will mutate scopes types that are registered as widgets,
     * convert their type to 'widget' and internally allocate the widget object
     */
    protected function processFilterWidgetScopes(array $scopes): void
    {
        foreach ($scopes as $scope) {
            if (!$this->isFilterWidget((string) $scope->type)) {
                continue;
            }

            $newConfig = ['widget' => $scope->type];

            if (is_array($scope->attributes)) {
                $newConfig += $scope->attributes;
            }

            $scope->useConfig($newConfig)->displayAs('widget');

            // Create filter widget instance and bind to controller
            $this->makeFilterScopeWidget($scope)->bindToController();
        }
    }

    /**
     * processAutoOrder applies a default sort order to all scopes
     */
    protected function processAutoOrder(array &$scopes)
    {
        // Build before and after map
        $beforeMap = $afterMap = [];
        foreach ($scopes as $scope) {
            if ($scope->after && isset($scopes[$scope->after])) {
                $afterMap[$scope->scopeName] = $scopes[$scope->after]->scopeName;
            }
            elseif ($scope->before && isset($scopes[$scope->before])) {
                $beforeMap[$scope->scopeName] = $scopes[$scope->before]->scopeName;
            }
        }

        // Apply incremental default orders
        $orderCount = 0;
        foreach ($scopes as $scope) {
            if (
                $scope->order !== -1 ||
                isset($afterMap[$scope->scopeName]) ||
                isset($beforeMap[$scope->scopeName])
            ) {
                continue;
            }
            $scope->order = ($orderCount += 100);
        }

        // Apply before and after
        foreach ($beforeMap as $from => $to) {
            $scopes[$from]->order = $scopes[$to]->order - 1;
        }
        foreach ($afterMap as $from => $to) {
            $scopes[$from]->order = $scopes[$to]->order + 1;
        }

        // Sort scopes
        uasort($scopes, static function ($a, $b) {
            return $a->order - $b->order;
        });
    }

    /**
     * processLegacyDefinitions applies deprecated definitions for backwards compatibility
     */
    protected function processLegacyDefinitions(array $scopes): void
    {
        foreach ($scopes as $scope) {
            if ($scope->type === 'date') {
                $this->refitLegacyDateScope($scope);
            }
            elseif ($scope->type === 'number') {
                $this->refitLegacyNumberScope($scope);
            }
            elseif ($scope->type === 'numberrange') {
                $this->refitLegacyNumberRangeScope($scope);
            }
            elseif ($scope->type === 'daterange') {
                $this->refitLegacyDateRangeScope($scope);
            }
            elseif ($scope->type === 'text') {
                $this->refitLegacyTextScope($scope);
            }
            elseif ($scope->type === 'clear') {
                $this->refitLegacyClearScope($scope);
            }
            elseif ($scope->type === 'group') {
                $this->refitLegacyGroupScope($scope);
            }
            else {
                $this->refitLegacyDefaultScope($scope);
            }
        }
    }

    /**
     * makeNestedFilterModel resolves a relation based on a nested field name
     * E.g: model[relation1][relation2] → $model->relation1()->relation2()
     */
    protected function makeNestedFilterModel($model, $field)
    {
        if (strpos($field, '[') === false || strpos($field, ']') === false) {
            return [$model, $field];
        }

        $parts = HtmlHelper::nameToArray($field);
        $lastField = array_pop($parts);
        while ($rootField = array_shift($parts)) {
            $model = $model->$rootField()->getRelated();
        }

        return [$model, $lastField];
    }
}
