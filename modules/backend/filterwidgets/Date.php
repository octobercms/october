<?php namespace Backend\FilterWidgets;

use Db;
use DbDongle;
use Date as DateFacade;
use Backend\Classes\FilterWidgetBase;
use Exception;

/**
 * Date filter
 *
 * @package october\backend
 * @author Alexey Bobkov, Samuel Georges
 */
class Date extends FilterWidgetBase
{
    const CONDITION_EQUALS = 'equals';
    const CONDITION_NOT_EQUALS = 'notEquals';
    const CONDITION_BETWEEN = 'between';
    const CONDITION_BEFORE = 'before';
    const CONDITION_AFTER = 'after';

    /**
     * init
     */
    public function init()
    {
        $scope = $this->filterScope;

        if (!$scope->conditions) {
            $scope->conditions = [
                self::CONDITION_EQUALS => true,
                self::CONDITION_NOT_EQUALS => true,
                self::CONDITION_BETWEEN => true,
                self::CONDITION_BEFORE => true,
                self::CONDITION_AFTER => true
            ];
        }

        if (!$scope->minDate) {
            $scope->minDate = '1970-01-01';
        }

        if (!$scope->maxDate) {
            $scope->maxDate = '2199-12-31';
        }

        if (!$scope->firstDay) {
            $scope->firstDay = 0;
        }

        if (!$scope->yearRange) {
            $scope->yearRange = 10;
        }

        if ($scope->useTimezone === null) {
            $scope->useTimezone = true;
        }
    }

    /**
     * @inheritDoc
     */
    protected function loadAssets()
    {
        $this->addJs('js/datefilter.js', ['type' => 'module']);
    }

    /**
     * @inheritDoc
     */
    public function render()
    {
        $this->prepareVars();
        return $this->makePartial('date');
    }

    /**
     * renderForm the form to use for filtering
     */
    public function renderForm()
    {
        $this->prepareVars();
        return $this->makePartial('date_form');
    }

    /**
     * prepareVars for display
     */
    public function prepareVars()
    {
        $this->vars['scope'] = $this->filterScope;
    }

    /**
     * getActiveValue
     */
    public function getActiveValue()
    {
        if (post('clearScope')) {
            return null;
        }

        $value = post('Filter');
        $condition = post('Filter[condition]');

        if ($condition === self::CONDITION_BETWEEN) {
            if (!$this->hasPostValue('beforeRaw') && !$this->hasPostValue('afterRaw')) {
                return null;
            }

            if (!$this->hasPostValue('beforeRaw')) {
                $value['value'] = post('Filter[after]');
                $value['valueRaw'] = post('Filter[afterRaw]');
                $value['condition'] = self::CONDITION_AFTER;
            }
            elseif (!$this->hasPostValue('afterRaw')) {
                $value['value'] = post('Filter[before]');
                $value['valueRaw'] = post('Filter[beforeRaw]');
                $value['condition'] = self::CONDITION_BEFORE;
            }
        }
        else {
            if (!$this->hasPostValue('valueRaw')) {
                return null;
            }
        }

        return $value;
    }

    /**
     * applyScopeToQuery
     */
    public function applyScopeToQuery($query)
    {
        $scope = $this->filterScope;

        // Scope
        if ($scope->modelScope) {
            $scope->applyScopeMethodToQuery($query);
            return;
        }

        // Condition
        $scopeConditions = (array) $scope->conditions;
        $activeCondition = $scope->condition;

        // Raw SQL query
        $sqlCondition = $scopeConditions[$activeCondition] ?? null;
        if (is_string($sqlCondition)) {
            // @deprecated adapt legacy format
            $sqlCondition = str_replace(["':filtered'", "':value'", "':valueDate'", "':after'", "':afterDate'", "':before'", "':beforeDate'"], [':value', ':value', ':valueDate', ':after', ':afterDate', ':before', ':beforeDate'], $sqlCondition);

            $query->whereRaw(DbDongle::parse($sqlCondition, [
                'value' => $this->parseDate($scope->value),
                'valueDate' => $this->parseDate($scope->value, ['isDateOnly' => true]),
                'after' => $this->parseDate($scope->after),
                'afterDate' => $this->parseDate($scope->after, ['isDateOnly' => true]),
                'before' => $this->parseDate($scope->before),
                'beforeDate' => $this->parseDate($scope->before, ['isDateOnly' => true]),
            ]));
            return;
        }

        // Default query
        if ($activeCondition === self::CONDITION_EQUALS) {
            $query
                ->where($this->valueFrom, '>=', $this->parseDate($scope->value, ['returnObject' => true]))
                ->where($this->valueFrom, '<=', $this->parseDate($scope->value, ['returnObject' => true, 'isEndOfDay' => true]));
            return;
        }

        if ($activeCondition === self::CONDITION_NOT_EQUALS) {
            $query
                ->where(function($query) use ($scope) {
                    $query
                        ->where($this->valueFrom, '>', $this->parseDate($scope->value, ['returnObject' => true, 'isEndOfDay' => true]))
                        ->orWhere($this->valueFrom, '<', $this->parseDate($scope->value, ['returnObject' => true]));
                });
            return;
        }

        if ($activeCondition === self::CONDITION_BETWEEN) {
            $query
                ->where($this->valueFrom, '>=', $this->parseDate($scope->after, ['returnObject' => true]))
                ->where($this->valueFrom, '<=', $this->parseDate($scope->before, ['returnObject' => true]));
            return;
        }

        if ($activeCondition === self::CONDITION_AFTER) {
            $query->where($this->valueFrom, '>=', $this->parseDate($scope->value, ['returnObject' => true]));
            return;
        }

        if ($activeCondition === self::CONDITION_BEFORE) {
            $query->where($this->valueFrom, '<=', $this->parseDate($scope->value, ['returnObject' => true]));
            return;
        }
    }

    /**
     * parseDate for SQL
     */
    public function parseDate($value, array $options = [])
    {
        extract(array_merge([
            'isDateOnly' => false,
            'isEndOfDay' => false,
            'returnObject' => false,
        ], $options));

        try {
            if (is_int($value)) {
                $date = DateFacade::createFromTimestamp($value);
            }
            elseif (strtolower($value) === 'now') {
                $date = DateFacade::now()->startOfDay();
            }
            else {
                $date = DateFacade::parse($value);
            }

            if ($isEndOfDay) {
                $date = $date->copy()->addDay()->addMinutes(-1);
            }

            if ($returnObject) {
                return $date;
            }

            if ($isDateOnly) {
                return $date->format('Y-m-d');
            }

            return $date->format('Y-m-d H:i:s');
        }
        catch (Exception $ex) {
            if ($returnObject) {
                return $value;
            }

            return Db::getPdo()->quote($value);
        }
    }

    /**
     * getConditionLang
     */
    public function getConditionLang($condition)
    {
        switch ($condition) {
            case self::CONDITION_EQUALS:
                return __('is equal to');

            case self::CONDITION_NOT_EQUALS:
                return __('not equal to');

            case self::CONDITION_BETWEEN:
                return __('is between');

            case self::CONDITION_BEFORE:
                return __('is before');

            case self::CONDITION_AFTER:
                return __('is after');
        }
    }
}
