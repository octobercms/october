<?php namespace Backend\Widgets;

use Event;
use Backend\Classes\WidgetBase;
use Backend\Classes\FilterScope;
use System\Classes\ApplicationException;
use October\Rain\Support\Util;

/**
 * Filter Widget
 * Renders a container used for filtering things.
 *
 * @package october\backend
 * @author Alexey Bobkov, Samuel Georges
 */
class Filter extends WidgetBase
{
    /**
     * {@inheritDoc}
     */
    public $defaultAlias = 'filter';

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
     * @var string The context of this filter, scopes that do not belong
     * to this context will not be shown.
     */
    protected $activeContext = null;

    /**
     * @var array List of CSS classes to apply to the filter container element
     */
    public $cssClasses = [];

    /**
     * Initialize the widget, called by the constructor and free from its parameters.
     */
    public function init()
    {
        $this->activeContext = $this->getConfig('context');
    }

    /**
     * {@inheritDoc}
     */
    public function loadAssets()
    {
        $this->addJs('js/october.filter.js', 'core');
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

    public function onFilterUpdate()
    {
        $this->defineFilterScopes();

        if (!$scope = post('scopeName'))
            return;

        $active = $this->optionsFromAjax(post('options.active'));
        $this->setScopeValue($scope, $active);

        /*
         * Trigger class event, merge results as viewable array
         */
        $params = func_get_args();
        $result = $this->fireEvent('scope.update', [$params]);
        if ($result && is_array($result))
            return Util::arrayMerge($result);
    }

    public function onFilterGetOptions()
    {
        $this->defineFilterScopes();

        if (!$scopeName = post('scopeName'))
            return;

        $scope = $this->getScope($scopeName);
        $activeKeys = $scope->value ? array_keys($scope->value) : [];
        $available = $this->getAvailableOptions($scope);
        $active = $this->filterActiveOptions($activeKeys, $available);

        return [
            'options' => [
                'available' => $this->optionsToAjax($available),
                'active'    => $this->optionsToAjax($active),
            ]
        ];
    }

    protected function getAvailableOptions($scope)
    {
        $available = [];
        $options = $this->getOptionsFromModel($scope);
        foreach ($options as $option) {
            $available[$option->id] = $option->name;
        }
        return $available;
    }

    protected function filterActiveOptions(array $activekeys, array &$availableOptions)
    {
        $active = [];
        foreach ($availableOptions as $id => $option) {
            if (!in_array($id, $activekeys))
                continue;

            $active[$id] = $option;
            unset($availableOptions[$id]);
        }

        return $active;
    }

    protected function optionsToAjax($options)
    {
        $processed = [];
        foreach ($options as $id => $result) {
            $processed[] = ['id' => $id, 'name' => $result];
        }
        return $processed;
    }

    protected function optionsFromAjax($options)
    {
        $processed = [];
        if (!is_array($options))
            return $processed;

        foreach ($options as $option) {
            if (!$id = array_get($option, 'id')) continue;
            $processed[$id] = array_get($option, 'name');
        }
        return $processed;
    }

    /**
     * Looks at the model for defined scope items.
     */
    protected function getOptionsFromModel($scope)
    {
        $model = $this->scopeModels[$scope->scopeName];
        return $model->all();
    }

    /**
     * Renders the HTML element for a scope
     */
    public function renderScopeElement($scope)
    {
        return $this->makePartial('scope_'.$scope->type, ['scope' => $scope]);
    }

    /**
     * Creates a flat array of filter scopes from the configuration.
     */
    protected function defineFilterScopes()
    {
        if ($this->scopesDefined)
            return;

        /*
         * Extensibility
         */
        Event::fire('backend.filter.extendScopesBefore', [$this]);
        $this->fireEvent('filter.extendScopesBefore');

        /*
         * All scopes
         */
        if (!isset($this->config->scopes) || !is_array($this->config->scopes))
            $this->config->scopes = [];

        $this->addScopes($this->config->scopes);

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
                if (!in_array($this->getContext(), $context))
                    continue;
            }

            /*
             * Validate scope model
             */
            if (!isset($config['modelClass']))
                throw new ApplicationException('Missing model definition for scope');

            $class = $config['modelClass'];
            $model = new $class;
            $this->scopeModels[$name] = $model;

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

    /**
     * Returns a scope value for this widget instance.
     */
    public function getScopeValue($scope, $default = null)
    {
        if (is_string($scope)) {
            if (!isset($this->allScopes[$scope]))
                throw new ApplicationException('No definition for scope ' . $scope);

            $scope = $this->allScopes[$scope];
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
            if (!isset($this->allScopes[$scope]))
                throw new ApplicationException('No definition for scope ' . $scope);

            $scope = $this->allScopes[$scope];
        }

        $cacheKey = 'scope-'.$scope->scopeName;
        $this->putSession($cacheKey, $value);
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
        return $this->allScopes[$scope];
    }

    /**
     * Returns the active context for displaying the filter.
     */
    public function getContext()
    {
        return $this->activeContext;
    }

}