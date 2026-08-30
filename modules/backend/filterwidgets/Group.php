<?php namespace Backend\FilterWidgets;

use Db;
use Str;
use Lang;
use DbDongle;
use Backend\Classes\FilterWidgetBase;
use October\Rain\Element\ElementHolder;
use October\Rain\Html\Helper as HtmlHelper;
use ApplicationException;

/**
 * Group filter
 *
 * @package october\backend
 * @author Alexey Bobkov, Samuel Georges
 */
class Group extends FilterWidgetBase
{
    const MODE_EXCLUDE = 'exclude';
    const MODE_INCLUDE = 'include';

    /**
     * @inheritDoc
     */
    protected function loadAssets()
    {
        $this->addJs('js/groupfilter.js', ['type' => 'module']);
    }

    /**
     * @inheritDoc
     */
    public function render()
    {
        $this->prepareVars();
        return $this->makePartial('group');
    }

    /**
     * renderForm the form to use for filtering
     */
    public function renderForm()
    {
        $this->prepareVars();
        return $this->makePartial('group_form');
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
        if (!$this->hasPostValue('value')) {
            return null;
        }

        $value['value'] = json_decode($value['value'], true);
        if (!$value['value']) {
            return null;
        }

        // @deprecated this is to keep support with v1 API where values were inside the keys
        $value['value'] = array_combine($value['value'], $value['value']);

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

        // Active value
        $activeValue = (array) $scope->value;
        if (!count($activeValue)) {
            return;
        }

        // Raw SQL query
        $sqlCondition = $scope->conditions;
        if (is_string($sqlCondition)) {
            $filtered = implode(',', array_build($activeValue, function ($key, $_value) {
                return [$key, Db::getPdo()->quote($_value)];
            }));

            $query->whereRaw(DbDongle::parse(strtr($sqlCondition, [
                ':filtered' => $filtered,
                ':value' => $filtered,
            ])));
            return;
        }

        // Check for null existence check
        if (($nullKey = array_search(null, $activeValue)) !== false) {
            unset($activeValue[$nullKey]);
        }

        // Default query
        $activeField = HtmlHelper::nameToDot($this->valueFrom);
        if ($this->model) {
            $action = $scope->mode === static::MODE_EXCLUDE ? 'whereDoesntHave' : 'whereHas';
            $query->{$action}($activeField, function($q) use ($activeValue) {
                $q->whereIn($q->getModel()->getQualifiedKeyName(), $activeValue);
            });

            if ($nullKey !== false) {
                $query->orDoesntHave($activeField);
            }
        }
        elseif ($this->isJsonable) {
            $action = $scope->mode === static::MODE_EXCLUDE ? 'whereJsonDoesntContain' : 'whereJsonContains';
            $query->{$action}($this->valueFrom, array_values($activeValue));
        }
        else {
            $action = $scope->mode === static::MODE_EXCLUDE ? 'whereNotIn' : 'whereIn';
            $query->{$action}($this->valueFrom, $activeValue);

            if ($nullKey !== false) {
                $query->orWhereNull($this->valueFrom);
            }
        }
    }

    /**
     * onGetGroupOptions
     */
    public function onGetGroupOptions()
    {
        $scope = $this->filterScope;
        $searchQuery = post('search');

        $available = $this->getAvailableOptions($searchQuery);
        $active = $searchQuery ? [] : $this->filterActiveOptions((array) $scope->value, $available);

        return [
            'options' => [
                'available' => $this->optionsToAjax($available),
                'active' => $this->optionsToAjax($active),
            ]
        ];
    }

    /**
     * getAvailableOptions returns the available options a scope can use, either from the
     * model relation or from a supplied array. Optionally apply a search constraint
     * to the options
     */
    protected function getAvailableOptions(?string $searchQuery = null): array
    {
        $available = [];
        $scope = $this->filterScope;

        if ($scope->options || $scope->optionsMethod) {
            $available = $this->getOptionsFromArray($searchQuery);
        }
        else {
            $nameColumn = $scope->nameFrom;
            $options = $this->getOptionsFromModel($searchQuery);

            foreach ($options as $option) {
                $available[$option->getKey()] = $option->{$nameColumn};
            }
        }

        if ($scope->emptyOption) {
            $available = ['' => Lang::get($scope->emptyOption)] + $available;
        }

        return $available;
    }

    /**
     * filterActiveOptions removes any already selected options from the available options,
     * returns a newly built array
     */
    protected function filterActiveOptions(array $activeKeys, array $availableOptions): array
    {
        $active = [];
        foreach ($availableOptions as $id => $option) {
            if (!in_array($id, $activeKeys)) {
                continue;
            }

            $active[$id] = $option;
        }

        return $active;
    }

    /**
     * getOptionsFromModel looks at the model for defined scope items.
     * @return Collection
     */
    protected function getOptionsFromModel($searchQuery = null)
    {
        $scope = $this->filterScope;
        $model = $this->model;
        $query = $model->newQuery();
        $query->limit(200);

        // Apply a model scope to the options query
        if ($scope->optionsScope) {
            $scope->applyScopeMethodToQuery($query, $scope->optionsScope);
        }

        // Extensibility
        $this->getParentFilter()->extendScopeModelQuery($scope, $query);

        if (!$searchQuery) {
            // If scope has active filter(s) run additional query and merge it with base query
            if ($scope->value) {
                $modelIds = array_keys((array) $scope->value);
                $activeOptions = $model->newQuery()->findMany($modelIds);
            }

            $modelOptions = isset($activeOptions)
                ? $query->get()->merge($activeOptions)
                : $query->get();

            return $modelOptions;
        }

        $searchFields = [$model->getKeyName(), $scope->nameFrom];

        return $query->searchWhere($searchQuery, $searchFields)->get();
    }

    /**
     * getOptionsFromArray looks at the defined set of options for scope items, or the model method.
     * @return array
     */
    protected function getOptionsFromArray($searchQuery = null)
    {
        // Load the data
        $model = $this->model;
        $scope = $this->filterScope;
        $options = $scope->optionsMethod ?: $scope->options;

        // Calling via ClassName::method
        if (is_string($options)) {
            if (
                count($staticMethod = explode('::', $options)) === 2 &&
                is_callable($staticMethod)
            ) {
                $options = $staticMethod($model, $scope);

                if (!is_array($options)) {
                    throw new ApplicationException(Lang::get('backend::lang.field.options_static_method_invalid_value', [
                        'class' => $staticMethod[0],
                        'method' => $staticMethod[1]
                    ]));
                }
            }
            // Calling via $model->method
            else {
                $methodName = $options;

                if (!$model->methodExists($methodName)) {
                    throw new ApplicationException(Lang::get('backend::lang.filter.options_method_not_exists', [
                        'model'  => get_class($model),
                        'method' => $methodName,
                        'filter' => $scope->scopeName
                    ]));
                }

                // For passing to events
                // @deprecated v4 review this interface to closer resemble the form field
                // interface (FormField and FilterScope)
                $holder = new ElementHolder($this->getParentFilter()->getScopes());
                $options = $model->$methodName($holder);
            }
        }

        if (!is_array($options)) {
            $options = [];
        }

        // Apply the search
        $searchQuery = Str::lower($searchQuery);
        if (strlen($searchQuery)) {
            $options = $this->filterOptionsBySearch($options, $searchQuery);
        }

        return $options;
    }

    /**
     * filterOptionsBySearch filters an array of options by a search term.
     * @param array $options
     * @param string $query
     * @return array
     */
    protected function filterOptionsBySearch($options, $query)
    {
        $filteredOptions = [];

        $optionMatchesSearch = function ($words, $option) {
            foreach ($words as $word) {
                $word = trim($word);
                if (!strlen($word)) {
                    continue;
                }

                if (!Str::contains(Str::lower($option), $word)) {
                    return false;
                }
            }

            return true;
        };

        // Exact
        foreach ($options as $index => $option) {
            if (Str::is(Str::lower($option), $query)) {
                $filteredOptions[$index] = $option;
                unset($options[$index]);
            }
        }

        // Fuzzy
        $words = explode(' ', $query);
        foreach ($options as $index => $option) {
            if ($optionMatchesSearch($words, $option)) {
                $filteredOptions[$index] = $option;
            }
        }

        return $filteredOptions;
    }

    /**
     * optionsToAjax converts a key/pair array to a named array {id: 1, name: 'Foobar'}
     */
    protected function optionsToAjax(array $options): array
    {
        $processed = [];

        foreach ($options as $id => $result) {
            $name = is_array($result) ? ($result[0] ?? '') : $result;
            $processed[] = ['id' => $id, 'name' => __($name)];
        }

        return $processed;
    }
}
