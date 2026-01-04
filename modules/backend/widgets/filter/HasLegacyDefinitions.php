<?php namespace Backend\Widgets\Filter;

use Date;
use Exception;

/**
 * HasLegacyDefinitions concern
 */
trait HasLegacyDefinitions
{
    /**
     * setScopeValue
     * @deprecated see putScopeValue
     */
    public function setScopeValue($scope, $value)
    {
        $this->putScopeValue($scope, ['value' => $value]);
    }

    /**
     * refitLegacyDateScope
     */
    protected function refitLegacyDateScope($scope)
    {
        $condition = $scope->conditions;

        if (is_string($condition)) {
            if (strpos('>', $condition)) {
                $scope->conditions = [
                    'after' => $condition
                ];
            }
            elseif (strpos('<', $condition)) {
                $scope->conditions = [
                    'before' => $condition
                ];
            }
            else {
                $scope->conditions = [
                    'equals' => $condition
                ];
            }
        }

        if (!$scope->modelScope && ($scopeName = $scope->scope)) {
            $scope->modelScope = function($query, $scope) use ($scopeName) {
                return $query->$scopeName(
                    $this->refitLegacyDateParse($scope->value)
                );
            };
        }
    }

    /**
     * refitLegacyDateRangeScope
     */
    protected function refitLegacyDateRangeScope($scope)
    {
        $condition = $scope->conditions;

        $scope->type = 'date';
        $scope->conditions = ['between' => $condition];

        if (!$scope->modelScope && ($scopeName = $scope->scope)) {
            $scope->modelScope = function($query, $scope) use ($scopeName) {
                return $query->$scopeName(
                    $this->refitLegacyDateParse($scope->after),
                    $this->refitLegacyDateParse($scope->before)
                );
            };
        }
    }

    /**
     * refitLegacyDateParse
     */
    protected function refitLegacyDateParse($value)
    {
        try {
            return is_int($value)
                ? Date::createFromTimestamp($value)
                : Date::parse($value);
        }
        catch (Exception $ex) {
            return $value;
        }
    }

    /**
     * refitLegacyNumberScope
     */
    protected function refitLegacyNumberScope($scope)
    {
        $condition = $scope->conditions;

        if (is_string($condition)) {
            if (strpos('>', $condition)) {
                $scope->conditions = [
                    'greater' => $condition
                ];
            }
            elseif (strpos('<', $condition)) {
                $scope->conditions = [
                    'lesser' => $condition
                ];
            }
            else {
                $scope->conditions = [
                    'equals' => $condition
                ];
            }
        }

        if (!$scope->modelScope && ($scopeName = $scope->scope)) {
            $scope->modelScope = function($query, $scope) use ($scopeName) {
                return $query->$scopeName($scope->value);
            };
        }
    }

    /**
     * refitLegacyNumberRangeScope
     */
    protected function refitLegacyNumberRangeScope($scope)
    {
        $condition = $scope->conditions;

        $scope->type = 'number';
        $scope->conditions = ['between' => $condition];

        if (!$scope->modelScope && ($scopeName = $scope->scope)) {
            $scope->modelScope = function($query, $scope) use ($scopeName) {
                return $query->$scopeName($scope->min, $scope->max);
            };
        }
    }

    /**
     * refitLegacyTextScope
     */
    protected function refitLegacyTextScope($scope)
    {
        $condition = $scope->conditions;

        if (is_string($condition)) {
            $scope->conditions = [
                'equals' => $condition
            ];
        }

        if (!$scope->modelScope && ($scopeName = $scope->scope)) {
            $scope->modelScope = function($query, $scope) use ($scopeName) {
                return $query->$scopeName($scope->value);
            };
        }
    }

    /**
     * refitLegacyClearScope
     */
    protected function refitLegacyClearScope($scope)
    {
        $this->removeScope($scope->scopeName);
    }

    /**
     * refitLegacyGroupScope
     */
    protected function refitLegacyGroupScope($scope)
    {
        if (!$scope->modelScope && ($scopeName = $scope->scope)) {
            $scope->modelScope = function($query, $scope) use ($scopeName) {
                return $query->$scopeName($scope->value, $scope->mode ?? null);
            };
        }
    }

    /**
     * refitLegacyDefaultScope
     */
    protected function refitLegacyDefaultScope($scope)
    {
        if (!$scope->modelScope && ($scopeName = $scope->scope)) {
            $scope->modelScope = function($query, $scope) use ($scopeName) {
                return $query->$scopeName($scope->value);
            };
        }
    }
}
