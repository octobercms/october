<?php namespace Backend\Widgets;

use Event;
use Backend\Classes\WidgetBase;
use Backend\Classes\FilterScope;
use System\Classes\ApplicationException;

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

    public function onFilterGetOptions()
    {
        $this->defineFilterScopes();

        if (!$scopeName = post('scopeName'))
            return;

        $scope = $this->getScope($scopeName);

        // $available = [
        //     ['id' => 1, 'name' => 'Deleted'],
        //     ['id' => 2, 'name' => 'Moo'],
        // ];

        $available = $this->getAvailableOptions($scope);
        $active = $this->filterActiveOptions($available);

        // $active = [
        //     ['id' => 3, 'name' => 'Selected'],
        //     ['id' => 4, 'name' => 'Bar'],
        // ];

        $available = $this->processOptionsForAjax($available);
        $active = $this->processOptionsForAjax($active);

        return [
            'options' => [
                'available' => $available,
                'active' => $active,
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

    protected function filterActiveOptions(&$availableOptions)
    {
        $fromSession = [1];

        $active = [];
        foreach ($availableOptions as $id => $option) {
            if (!in_array($id, $fromSession))
                continue;

            $active[$id] = $option;
            unset($availableOptions[$id]);
        }

        return $active;
    }

    protected function processOptionsForAjax($options)
    {
        $processed = [];
        foreach ($options as $id => $result) {
            $processed[] = ['id' => $id, 'name' => $result];
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
        return $scope;
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