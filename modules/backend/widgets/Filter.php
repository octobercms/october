<?php namespace Backend\Widgets;

use Db;
use Event;
use Backend\Classes\WidgetBase;
use Backend\Classes\FilterScope;
use ApplicationException;

/**
 * Filter Widget
 * Renders a container used for filtering things.
 *
 * @package october\backend
 * @author Alexey Bobkov, Samuel Georges
 */
class Filter extends WidgetBase
{
    //
    // Configurable properties
    //

    /**
     * @var array Scope definition configuration.
     */
    public $scopes;

    /**
     * @var string The context of this filter, scopes that do not belong
     * to this context will not be shown.
     */
    public $context = null;

    //
    // Object properties
    //

    /**
     * {@inheritDoc}
     */
    protected $defaultAlias = 'filter';

    /**
     * @var boolean Determines if scope definitions have been created.
     */
    protected $scopesDefined = false;

    /**
     * @var array Collection of all scopes used in this filter.
     */
    protected $allScopes = [];

    /**
     * @var array Collection of all scopes models used in this filter.
     */
    protected $scopeModels = [];

    /**
     * @var array List of CSS classes to apply to the filter container element
     */
    public $cssClasses = [];

    /**
     * Initialize the widget, called by the constructor and free from its parameters.
     */
    public function init()
    {
        $this->fillFromConfig([
            'scopes',
            'context',
        ]);
    }

    /**
     * Renders the widget.
     */
    public function render()
    {
        $this->prepareVars();
        return $this->makePartial('filter');
    }

    /**
     * Prepares the view data
     */
    public function prepareVars()
    {
        $this->defineFilterScopes();
        $this->vars['cssClasses'] = implode(' ', $this->cssClasses);
        $this->vars['scopes'] = $this->allScopes;
    }

    /**
     * Renders the HTML element for a scope
     */
    public function renderScopeElement($scope)
    {
        return $this->makePartial('scope_'.$scope->type, ['scope' => $scope]);
    }

    //
    // AJAX
    //

    /**
     * Update a filter scope value.
     * @return array
     */
    public function onFilterUpdate()
    {
        $this->defineFilterScopes();

        if (!$scope = post('scopeName')) {
            return;
        }

        $scope = $this->getScope($scope);

        switch ($scope->type) {
            case 'group':
                $active = $this->optionsFromAjax(post('options.active'));
                $this->setScopeValue($scope, $active);
                break;

            case 'checkbox':
                $checked = post('value') == 'true' ? true : false;
                $this->setScopeValue($scope, $checked);
                break;
        }

        /*
         * Trigger class event, merge results as viewable array
         */
        $params = func_get_args();
        $result = $this->fireEvent('filter.update', [$params]);
        if ($result && is_array($result)) {
            return call_user_func_array('array_merge', $result);
        }
    }

    /**
     * Returns available options for group scope type.
     * @return array
     */
    public function onFilterGetOptions()
    {
        $this->defineFilterScopes();

        $searchQuery = post('search');
        if (!$scopeName = post('scopeName')) {
            return;
        }

        $scope = $this->getScope($scopeName);
        $activeKeys = $scope->value ? array_keys($scope->value) : [];
        $available = $this->getAvailableOptions($scope, $searchQuery);
        $active = $searchQuery ? [] : $this->filterActiveOptions($activeKeys, $available);

        return [
            'scopeName' => $scopeName,
            'options' => [
                'available' => $this->optionsToAjax($available),
                'active'    => $this->optionsToAjax($active),
            ]
        ];
    }

    //
    // Internals
    //

    /**
     * Returns the available options a scope can use, either from the
     * model relation or from a supplied array. Optionally apply a search
     * constraint to the options.
     * @param  string $scope
     * @param  string $searchQuery
     * @return array
     */
    protected function getAvailableOptions($scope, $searchQuery = null)
    {
        if (count($scope->options)) {
            return $scope->options;
        }

        $available = [];
        $nameColumn = $this->getScopeNameColumn($scope);
        $options = $this->getOptionsFromModel($scope, $searchQuery);
        foreach ($options as $option) {
            $available[$option->getKey()] = $option->{$nameColumn};
        }
        return $available;
    }

    /**
     * Removes any already selected options from the available options, returns
     * a newly built array.
     * @param  array  $activeKeys
     * @param  array  $availableOptions
     * @return array
     */
    protected function filterActiveOptions(array $activeKeys, array &$availableOptions)
    {
        $active = [];
        foreach ($availableOptions as $id => $option) {
            if (!in_array($id, $activeKeys)) {
                continue;
            }

            $active[$id] = $option;
            unset($availableOptions[$id]);
        }

        return $active;
    }

    /**
     * Looks at the model for defined scope items.
     */
    protected function getOptionsFromModel($scope, $searchQuery = null)
    {
        $model = $this->scopeModels[$scope->scopeName];
        $query = $model->newQuery();

        /*
         * Extensibility
         */
        Event::fire('backend.filter.extendQuery', [$this, $query, $scope]);
        $this->fireEvent('filter.extendQuery', [$query, $scope]);

        if (!$searchQuery) {
            return $query->get();
        }

        $searchFields = [$model->getKeyName(), $this->getScopeNameColumn($scope)];
        return $query->searchWhere($searchQuery, $searchFields)->get();
    }

    /**
     * Creates a flat array of filter scopes from the configuration.
     */
    protected function defineFilterScopes()
    {
        if ($this->scopesDefined) {
            return;
        }

        /*
         * Extensibility
         */
        Event::fire('backend.filter.extendScopesBefore', [$this]);
        $this->fireEvent('filter.extendScopesBefore');

        /*
         * All scopes
         */
        if (!isset($this->scopes) || !is_array($this->scopes)) {
            $this->scopes = [];
        }

        $this->addScopes($this->scopes);

        /*
         * Extensibility
         */
        Event::fire('backend.filter.extendScopes', [$this]);
        $this->fireEvent('filter.extendScopes');

        $this->scopesDefined = true;
    }

    /**
     * Programatically add scopes, used internally and for extensibility.
     */
    public function addScopes(array $scopes)
    {
        foreach ($scopes as $name => $config) {

            $scopeObj = $this->makeFilterScope($name, $config);

            /*
             * Check that the filter scope matches the active context
             */
            if ($scopeObj->context !== null) {
                $context = (is_array($scopeObj->context)) ? $scopeObj->context : [$scopeObj->context];
                if (!in_array($this->getContext(), $context)) {
                    continue;
                }
            }

            /*
             * Validate scope model
             */
            if (isset($config['modelClass'])) {
                $class = $config['modelClass'];
                $model = new $class;
                $this->scopeModels[$name] = $model;
            }

            $this->allScopes[$name] = $scopeObj;
        }
    }

    /**
     * Creates a filter scope object from name and configuration.
     */
    protected function makeFilterScope($name, $config)
    {
        $label = (isset($config['label'])) ? $config['label'] : null;
        $scopeType = isset($config['type']) ? $config['type'] : null;

        $scope = new FilterScope($name, $label);
        $scope->displayAs($scopeType, $config);

        /*
         * Set scope value
         */
        $scope->value = $this->getScopeValue($scope);

        return $scope;
    }

    //
    // Filter query logic
    //

    /**
     * Applies all scopes to a DB query.
     * @param  Builder $query
     * @return Builder
     */
    public function applyAllScopesToQuery($query)
    {
        $this->defineFilterScopes();

        foreach ($this->allScopes as $scope) {
            $this->applyScopeToQuery($scope, $query);
        }

        return $query;
    }

    /**
     * Applies a filter scope constraints to a DB query.
     * @param  string $scope
     * @param  Builder $query
     * @return Builder
     */
    public function applyScopeToQuery($scope, $query)
    {
        if (is_string($scope)) {
            $scope = $this->getScope($scope);
        }

        if (!$scope->value) {
            return;
        }

        $value = is_array($scope->value) ? array_keys($scope->value) : $scope->value;

        /*
         * Condition
         */
        if ($scopeConditions = $scope->conditions) {
            if (is_array($value)) {
                $filtered = implode(',', array_build($value, function ($key, $_value) {
                    return [$key, Db::getPdo()->quote($_value)];
                }));
            }
            else {
                $filtered = Db::getPdo()->quote($value);
            }

            $query->whereRaw(strtr($scopeConditions, [':filtered' => $filtered]));
        }

        /*
         * Scope
         */
        if ($scopeMethod = $scope->scope) {
            $query->$scopeMethod($value);
        }

        return $query;
    }

    //
    // Access layer
    //

    /**
     * Returns a scope value for this widget instance.
     */
    public function getScopeValue($scope, $default = null)
    {
        if (is_string($scope)) {
            $scope = $this->getScope($scope);
        }

        $cacheKey = 'scope-'.$scope->scopeName;
        return $this->getSession($cacheKey, $default);
    }

    /**
     * Sets an scope value for this widget instance.
     */
    public function setScopeValue($scope, $value)
    {
        if (is_string($scope)) {
            $scope = $this->getScope($scope);
        }

        $cacheKey = 'scope-'.$scope->scopeName;
        $this->putSession($cacheKey, $value);

        $scope->value = $value;
    }

    /**
     * Get all the registered scopes for the instance.
     * @return array
     */
    public function getScopes()
    {
        return $this->allScopes;
    }

    /**
     * Get a specified scope object
     * @param  string $scope
     * @return mixed
     */
    public function getScope($scope)
    {
        if (!isset($this->allScopes[$scope])) {
            throw new ApplicationException('No definition for scope ' . $scope);
        }

        return $this->allScopes[$scope];
    }

    /**
     * Returns the display name column for a scope.
     * @param  string $scope
     * @return string
     */
    public function getScopeNameColumn($scope)
    {
        if (is_string($scope)) {
            $scope = $this->getScope($scope);
        }

        return $scope->nameFrom;
    }

    /**
     * Returns the active context for displaying the filter.
     * @return string
     */
    public function getContext()
    {
        return $this->context;
    }

    //
    // Helpers
    //

    /**
     * Convert a key/pair array to a named array {id: 1, name: 'Foobar'}
     * @param  array $options
     * @return array
     */
    protected function optionsToAjax($options)
    {
        $processed = [];
        foreach ($options as $id => $result) {
            $processed[] = ['id' => $id, 'name' => $result];
        }
        return $processed;
    }

    /**
     * Convert a named array to a key/pair array
     * @param  array $options
     * @return array
     */
    protected function optionsFromAjax($options)
    {
        $processed = [];
        if (!is_array($options)) {
            return $processed;
        }

        foreach ($options as $option) {
            if (!$id = array_get($option, 'id')) {
                continue;
            }
            $processed[$id] = array_get($option, 'name');
        }
        return $processed;
    }
}
