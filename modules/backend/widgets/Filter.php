<?php namespace Backend\Widgets;

use Db;
use Str;
use Lang;
use Backend;
use DbDongle;
use Carbon\Carbon;
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
    public $context;

    //
    // Object properties
    //

    /**
     * @inheritDoc
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
        $params = ['scope' => $scope];

        switch ($scope->type) {
            case 'date':
                if ($scope->value && $scope->value instanceof Carbon) {
                    $params['dateStr'] = Backend::dateTime($scope->value, ['formatAlias' => 'dateMin']);
                    $params['date']    = $scope->value->format('Y-m-d H:i:s');
                }

                break;
            case 'daterange':
                if ($scope->value && is_array($scope->value) && count($scope->value) === 2 &&
                    $scope->value[0] && $scope->value[0] instanceof Carbon &&
                    $scope->value[1] && $scope->value[1] instanceof Carbon
                ) {
                    $after = $scope->value[0]->format('Y-m-d H:i:s');
                    $before = $scope->value[1]->format('Y-m-d H:i:s');

                    if(strcasecmp($after, '0000-00-00 00:00:00') > 0) {
                        $params['afterStr'] = Backend::dateTime($scope->value[0], ['formatAlias' => 'dateMin']);
                        $params['after']    = $after;
                    }
                    else {
                        $params['afterStr'] = '∞';
                        $params['after']    = null;
                    }

                    if(strcasecmp($before, '2999-12-31 23:59:59') < 0) {
                        $params['beforeStr'] = Backend::dateTime($scope->value[1], ['formatAlias' => 'dateMin']);
                        $params['before']    = $before;
                    }
                    else {
                        $params['beforeStr'] = '∞';
                        $params['before']    = null;
                    }
                }

                break;
            case 'number':
                if (is_numeric($scope->value)) {
                    $params['number'] = $scope->value;
                }

                break;

            case 'numberrange':
                if ($scope->value && is_array($scope->value) && count($scope->value) === 2 &&
                    $scope->value[0] &&
                    $scope->value[1]
                ) {
                    $min = $scope->value[0];
                    $max = $scope->value[1];

                    $params['minStr'] = $min ?: '';
                    $params['min'] = $min ?: null;

                    $params['maxStr'] = $max ?: '∞';
                    $params['max'] = $max ?: null;
                }

                break;

            case 'text':
                $params['value'] = $scope->value;
                $params['size'] = array_get($scope->config, 'size', 10);

                break;
        }

        return $this->makePartial('scope_'.$scope->type, $params);
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
                $checked = post('value') == 'true';
                $this->setScopeValue($scope, $checked);
                break;

            case 'switch':
                $value = post('value');
                $this->setScopeValue($scope, $value);
                break;

            case 'date':
                $dates = $this->datesFromAjax(post('options.dates'));

                if (!empty($dates)) {
                    list($date) = $dates;
                }
                else {
                    $date = null;
                }

                $this->setScopeValue($scope, $date);
                break;

            case 'daterange':
                $dates = $this->datesFromAjax(post('options.dates'));

                if (!empty($dates)) {
                    list($after, $before) = $dates;

                    $dates = [$after, $before];
                }
                else {
                    $dates = null;
                }

                $this->setScopeValue($scope, $dates);
                break;

            case 'number':
                $numbers = $this->numbersFromAjax(post('options.numbers'));

                if (!empty($numbers)) {
                    list($number) = $numbers;
                }
                else {
                    $number = null;
                }

                $this->setScopeValue($scope, $number);
                break;

            case 'numberrange':
                $numbers = $this->numbersFromAjax(post('options.numbers'));

                if (!empty($numbers)) {
                    list($min, $max) = $numbers;

                    $numbers = [$min, $max];
                }
                else {
                    $numbers = null;
                }

                $this->setScopeValue($scope, $numbers);
                break;

            case 'text':
                $values = post('options.value');

                if ($values !== null && $values !== '') {
                    list($value) = $values;
                }
                else {
                    $value = null;
                }

                $this->setScopeValue($scope, $value);
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
        if ($scope->options) {
            return $this->getOptionsFromArray($scope, $searchQuery);
        }

        $available = [];
        $nameColumn = $this->getScopeNameFrom($scope);
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
     * @return Collection
     */
    protected function getOptionsFromModel($scope, $searchQuery = null)
    {
        $model = $this->scopeModels[$scope->scopeName];

        $query = $model->newQuery();

        /*
         * The 'group' scope has trouble supporting more than 500 records at a time
         * @todo Introduce a more advanced version with robust list support.
         */
        $query->limit(500);

        /**
         * @event backend.filter.extendQuery
         * Provides an opportunity to extend the query of the list of options
         *
         * Example usage:
         *
         *     Event::listen('backend.filter.extendQuery', function((\Backend\Widgets\Filter) $filterWidget, $query, (\Backend\Classes\FilterScope) $scope) {
         *         if ($scope->scopeName == 'status') {
         *             $query->where('status', '<>', 'all');
         *         }
         *     });
         *
         * Or
         *
         *     $listWidget->bindEvent('filter.extendQuery', function ($query, (\Backend\Classes\FilterScope) $scope) {
         *         if ($scope->scopeName == 'status') {
         *             $query->where('status', '<>', 'all');
         *         }
         *     });
         *
         */
        $this->fireSystemEvent('backend.filter.extendQuery', [$query, $scope]);

        if (!$searchQuery) {
            return $query->get();
        }

        $searchFields = [$model->getKeyName(), $this->getScopeNameFrom($scope)];
        return $query->searchWhere($searchQuery, $searchFields)->get();
    }

    /**
     * Look at the defined set of options for scope items, or the model method.
     * @return array
     */
    protected function getOptionsFromArray($scope, $searchQuery = null)
    {
        /*
         * Load the data
         */
        $options = $scope->options;

        if (is_scalar($options)) {
            $model = $this->scopeModels[$scope->scopeName];
            $methodName = $options;

            if (!$model->methodExists($methodName)) {
                throw new ApplicationException(Lang::get('backend::lang.filter.options_method_not_exists', [
                    'model'  => get_class($model),
                    'method' => $methodName,
                    'filter' => $scope->scopeName
                ]));
            }

            $options = $model->$methodName();
        }
        elseif (!is_array($options)) {
            $options = [];
        }

        /*
         * Apply the search
         */
        $searchQuery = Str::lower($searchQuery);
        if (strlen($searchQuery)) {
            $options = $this->filterOptionsBySearch($options, $searchQuery);
        }

        return $options;
    }

    /**
     * Filters an array of options by a search term.
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

        /*
         * Exact
         */
        foreach ($options as $index => $option) {
            if (Str::is(Str::lower($option), $query)) {
                $filteredOptions[$index] = $option;
                unset($options[$index]);
            }
        }

        /*
         * Fuzzy
         */
        $words = explode(' ', $query);
        foreach ($options as $index => $option) {
            if ($optionMatchesSearch($words, $option)) {
                $filteredOptions[$index] = $option;
            }
        }

        return $filteredOptions;
    }

    /**
     * Creates a flat array of filter scopes from the configuration.
     */
    protected function defineFilterScopes()
    {
        if ($this->scopesDefined) {
            return;
        }

        /**
         * @event backend.filter.extendScopesBefore
         * Provides an opportunity to interact with the Filter widget before defining the filter scopes
         *
         * Example usage:
         *
         *     Event::listen('backend.filter.extendScopesBefore', function((\Backend\Widgets\Filter) $filterWidget) {
         *         // Just in case you really had to do something before scopes are defined
         *     });
         *
         * Or
         *
         *     $listWidget->bindEvent('filter.extendScopesBefore', function () use ((\Backend\Widgets\Filter) $filterWidget) {
         *         // Just in case you really had to do something before scopes are defined
         *     });
         *
         */
        $this->fireSystemEvent('backend.filter.extendScopesBefore');

        /*
         * All scopes
         */
        if (!isset($this->scopes) || !is_array($this->scopes)) {
            $this->scopes = [];
        }

        $this->addScopes($this->scopes);

        /**
         * @event backend.filter.extendScopes
         * Provides an opportunity to interact with the Filter widget & its scopes after the filter scopes have been initialized
         *
         * Example usage:
         *
         *     Event::listen('backend.filter.extendScopes', function((\Backend\Widgets\Filter) $filterWidget) {
         *         $filterWidget->addScopes([
         *             'my_scope' => [
         *                 'label' => 'My Filter Scope'
         *             ]
         *         ]);
         *     });
         *
         * Or
         *
         *     $listWidget->bindEvent('filter.extendScopes', function () use ((\Backend\Widgets\Filter) $filterWidget) {
         *         $filterWidget->removeScope('my_scope');
         *     });
         *
         */
        $this->fireSystemEvent('backend.filter.extendScopes');

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
                $context = is_array($scopeObj->context) ? $scopeObj->context : [$scopeObj->context];
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

            /*
             * Ensure scope type options are set
             */
            $scopeProperties = [];
            switch ($scopeObj->type) {
                case 'date':
                case 'daterange':
                    $scopeProperties = [
                        'minDate'   => '2000-01-01',
                        'maxDate'   => '2099-12-31',
                        'firstDay'  => 0,
                        'yearRange' => 10,
                    ];

                    break;
            }

            foreach ($scopeProperties as $property => $value) {
                if (isset($config[$property])) {
                    $value = $config[$property];
                }

                $scopeObj->{$property} = $value;
            }

            $this->allScopes[$name] = $scopeObj;
        }
    }

    /**
     * Programatically remove a scope, used for extensibility.
     * @param string $scopeName Scope name
     */
    public function removeScope($scopeName)
    {
        if (isset($this->allScopes[$scopeName])) {
            unset($this->allScopes[$scopeName]);
        }
    }

    /**
     * Creates a filter scope object from name and configuration.
     */
    protected function makeFilterScope($name, $config)
    {
        $label = $config['label'] ?? null;
        $scopeType = $config['type'] ?? null;

        $scope = new FilterScope($name, $label);
        $scope->displayAs($scopeType, $config);
        $scope->idPrefix = $this->alias;

        /*
         * Set scope value
         */
        $scope->value = $this->getScopeValue($scope, @$config['default']);

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

        switch ($scope->type) {
            case 'date':
                if ($scope->value instanceof Carbon) {
                    $value = $scope->value;

                    /*
                     * Condition
                     */
                    if ($scopeConditions = $scope->conditions) {
                        $query->whereRaw(DbDongle::parse(strtr($scopeConditions, [
                            ':filtered' => $value->format('Y-m-d'),
                            ':after'    => $value->format('Y-m-d H:i:s'),
                            ':before'   => $value->copy()->addDay()->addMinutes(-1)->format('Y-m-d H:i:s')
                        ])));
                    }
                    /*
                     * Scope
                     */
                    elseif ($scopeMethod = $scope->scope) {
                        $query->$scopeMethod($value);
                    }
                }

                break;

            case 'daterange':
                if (is_array($scope->value) && count($scope->value) > 1) {
                    list($after, $before) = array_values($scope->value);

                    if ($after && $after instanceof Carbon && $before && $before instanceof Carbon) {

                        /*
                         * Condition
                         */
                        if ($scopeConditions = $scope->conditions) {
                            $query->whereRaw(DbDongle::parse(strtr($scopeConditions, [
                                ':afterDate'  => $after->format('Y-m-d'),
                                ':after'      => $after->format('Y-m-d H:i:s'),
                                ':beforeDate' => $before->format('Y-m-d'),
                                ':before'     => $before->format('Y-m-d H:i:s')
                            ])));
                        }
                        /*
                         * Scope
                         */
                        elseif ($scopeMethod = $scope->scope) {
                            $query->$scopeMethod($after, $before);
                        }
                    }
                }

                break;

            case 'number':
                if (is_numeric($scope->value)) {
                    /*
                     * Condition
                     */
                    if ($scopeConditions = $scope->conditions) {
                        $query->whereRaw(DbDongle::parse(strtr($scopeConditions, [
                            ':filtered' => $scope->value,
                        ])));
                    }
                    /*
                     * Scope
                     */
                    elseif ($scopeMethod = $scope->scope) {
                        $query->$scopeMethod($scope->value);
                    }
                }

                break;

            case 'numberrange':
                if (is_array($scope->value) && count($scope->value) > 1) {
                    list($min, $max) = array_values($scope->value);

                    if ($min && $max) {

                        /*
                         * Condition
                         *
                         */
                        if ($scopeConditions = $scope->conditions) {
                            $query->whereRaw(DbDongle::parse(strtr($scopeConditions, [
                                ':min'  => $min,
                                ':max'  => $max
                            ])));
                        }
                        /*
                         * Scope
                         */
                        elseif ($scopeMethod = $scope->scope) {
                            $query->$scopeMethod($min, $max);
                        }
                    }
                }

                break;

            case 'text':
                /*
                 * Condition
                 */
                if ($scopeConditions = $scope->conditions) {
                    $query->whereRaw(DbDongle::parse(strtr($scopeConditions, [
                        ':value' => Db::getPdo()->quote($scope->value),
                    ])));
                }

                /*
                 * Scope
                 */
                elseif ($scopeMethod = $scope->scope) {
                    $query->$scopeMethod($scope->value);
                }

                break;

            default:
                $value = is_array($scope->value) ? array_keys($scope->value) : $scope->value;

                /*
                 * Condition
                 */
                if ($scopeConditions = $scope->conditions) {

                    /*
                     * Switch scope: multiple conditions, value either 1 or 2
                     */
                    if (is_array($scopeConditions)) {
                        $conditionNum = is_array($value) ? 0 : $value - 1;
                        list($scopeConditions) = array_slice($scopeConditions, $conditionNum);
                    }

                    if (is_array($value)) {
                        $filtered = implode(',', array_build($value, function ($key, $_value) {
                            return [$key, Db::getPdo()->quote($_value)];
                        }));
                    }
                    else {
                        $filtered = Db::getPdo()->quote($value);
                    }

                    $query->whereRaw(DbDongle::parse(strtr($scopeConditions, [':filtered' => $filtered])));
                }
                /*
                 * Scope
                 */
                elseif ($scopeMethod = $scope->scope) {
                    $query->$scopeMethod($value);
                }

                break;
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
    public function getScopeNameFrom($scope)
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
            $processed[] = ['id' => $id, 'name' => trans($result)];
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
            $id = array_get($option, 'id');
            if ($id === null) {
                continue;
            }
            $processed[$id] = array_get($option, 'name');
        }
        return $processed;
    }

    /**
     * Convert an array from the posted dates
     *
     * @param  array $dates
     *
     * @return array
     */
    protected function datesFromAjax($ajaxDates)
    {
        $dates = [];
        $dateRegex = '/\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}/';

        if (null !== $ajaxDates) {
            if (!is_array($ajaxDates)) {
                if(preg_match($dateRegex, $ajaxDates)) {
                    $dates = [$ajaxDates];
                }
            } else {
                foreach ($ajaxDates as $i => $date) {
                    if (preg_match($dateRegex, $date)) {
                        $dates[] = Carbon::createFromFormat('Y-m-d H:i:s', $date);
                    } elseif (empty($date)) {
                        if($i == 0) {
                            $dates[] = Carbon::createFromFormat('Y-m-d H:i:s', '0000-00-00 00:00:00');
                        } else {
                            $dates[] = Carbon::createFromFormat('Y-m-d H:i:s', '2999-12-31 23:59:59');
                        }
                    } else {
                        $dates = [];
                        break;
                    }
                }
            }
        }
        return $dates;
    }

    /**
     * Convert an array from the posted numbers
     *
     * @param  array $dates
     *
     * @return array
     */
    protected function numbersFromAjax($ajaxNumbers)
    {
        $numbers = [];
        $numberRegex = '/\d/';

        if (!empty($ajaxNumbers)) {
            if (!is_array($ajaxNumbers) && preg_match($numberRegex, $ajaxNumbers)) {
                $numbers = [$ajaxNumbers];
            } else {
                foreach ($ajaxNumbers as $i => $number) {
                    if (preg_match($numberRegex, $number)) {
                        $numbers[] = $number;
                    } else {
                        $numbers = [];
                        break;
                    }
                }
            }
        }

        return $numbers;
    }

    /**
     * @param mixed $scope
     *
     * @return string
     */
    protected function getFilterDateFormat($scope)
    {
        if (isset($scope->date_format)) {
            return $scope->date_format;
        }

        return trans('backend::lang.filter.date.format');
    }
}
