<?php namespace Backend\Widgets;

use Lang;
use DbDongle;
use Backend\Classes\WidgetBase;
use October\Rain\Element\ElementHolder;
use October\Contracts\Element\FilterElement;
use Backend\Classes\FilterScope;
use ApplicationException;
use SystemException;

/**
 * Filter Widget renders a container used for filtering things
 *
 * @package october\backend
 * @author Alexey Bobkov, Samuel Georges
 */
class Filter extends WidgetBase implements FilterElement
{
    use \Backend\Widgets\Filter\IsFilterElement;
    use \Backend\Widgets\Filter\ScopeProcessor;
    use \Backend\Widgets\Filter\HasFilterWidgets;
    use \Backend\Widgets\Filter\HasLegacyDefinitions;

    //
    // Configurable Properties
    //

    /**
     * @var array scopes defined by configuration
     */
    public $scopes;

    /**
     * @var Model model associated to the filtering, optional
     */
    public $model;

    /**
     * @var string context of this filter, scopes that do not belong
     * to this context will not be shown.
     */
    public $context;

    /**
     * @var string arrayName if the scope element names should be contained in an array.
     * Eg: `<input name="CustomFilter[scopeName]" />`
     */
    public $arrayName = 'CustomFilter';

    /**
     * @var string customPageName will be reset when a filter is applied, shared with the list widget
     */
    public $customPageName = 'page';

    //
    // Object Properties
    //

    /**
     * @inheritDoc
     */
    protected $defaultAlias = 'filter';

    /**
     * @var boolean scopesDefined determines if scope definitions have been created.
     */
    protected $scopesDefined = false;

    /**
     * @var array allScopes used in this filter.
     */
    protected $allScopes = [];

    /**
     * @var array scopeModels used in this filter.
     */
    protected $scopeModels = [];

    /**
     * @var array cssClasses to apply to the filter container element
     */
    public $cssClasses = [];

    /**
     * init the widget, called by the constructor and free from its parameters.
     */
    public function init()
    {
        $this->fillFromConfig([
            'scopes',
            'model',
            'context',
            'arrayName',
            'customPageName',
        ]);

        if (!$this->customPageName) {
            $this->customPageName = '_page';
        }

        $this->initFilterWidgetsConcern();
    }

    /**
     * bindToController ensures scopes are defined and filter widgets are registered so they
     * can also be bound to the controller this allows their AJAX features to operate.
     * @return void
     */
    public function bindToController()
    {
        $this->defineFilterScopes();
        parent::bindToController();
    }

    /**
     * @inheritDoc
     */
    protected function loadAssets()
    {
        $this->addJs('js/october.filter.js');
    }

    /**
     * render the widget.
     */
    public function render()
    {
        $this->defineFilterScopes();
        $this->applyFiltersFromModel();
        $this->prepareVars();

        return $this->makePartial('filter');
    }

    /**
     * prepareVars for display
     */
    public function prepareVars()
    {
        $this->vars['cssClasses'] = implode(' ', $this->cssClasses);
        $this->vars['scopes'] = $this->allScopes;
        $this->vars['pageName'] = $this->customPageName;
    }

    /**
     * defineFilterScopes creates an array of filter scopes from the configuration
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
         *     Event::listen('backend.filter.extendScopesBefore', function ((\Backend\Widgets\Filter) $filterWidget) {
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

        // All scopes
        if (!isset($this->scopes) || !is_array($this->scopes)) {
            $this->scopes = [];
        }

        if ($this->scopes) {
            $this->addScopes($this->scopes);
        }
        else {
            $this->addScopesFromModel();
        }

        /**
         * @event backend.filter.extendScopes
         * Provides an opportunity to interact with the Filter widget & its scopes after the filter scopes have been initialized
         *
         * Example usage:
         *
         *     Event::listen('backend.filter.extendScopes', function ((\Backend\Widgets\Filter) $filterWidget) {
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

        // Apply post processing
        $this->processLegacyDefinitions($this->allScopes);
        $this->processScopeModels($this->allScopes);
        $this->processPermissionCheck($this->allScopes);
        $this->processAutoOrder($this->allScopes);
        $this->processFilterWidgetScopes($this->allScopes);
        $this->processFieldOptionValues($this->allScopes);

        // Set scope values from data source
        foreach ($this->allScopes as $scope) {
            $scope->setScopeValue($this->getScopeValue($scope));
        }

        $this->scopesDefined = true;
    }

    /**
     * addScopes programmatically, used internally and for extensibility.
     */
    public function addScopes(array $scopes)
    {
        foreach ($scopes as $name => $config) {
            $scopeObj = $this->makeFilterScope($name, (array) $config);

            // Check that the filter scope matches the active context
            if ($scopeObj->context !== null) {
                $context = is_array($scopeObj->context) ? $scopeObj->context : [$scopeObj->context];
                if (!in_array($this->getContext(), $context)) {
                    continue;
                }
            }

            // Scope name without @context suffix
            $scopeName = $scopeObj->scopeName;

            $this->allScopes[$scopeName] = $scopeObj;
        }
    }

    /**
     * addScopesFromModel from the model
     */
    protected function addScopesFromModel(): void
    {
        if (!$this->model) {
            return;
        }

        if (method_exists($this->model, 'defineFilterScopes')) {
            $this->model->defineFilterScopes($this);
        }
    }

    /**
     * removeScope programmatically, used for extensibility.
     * @param string $scopeName
     */
    public function removeScope($scopeName)
    {
        if (isset($this->allScopes[$scopeName])) {
            unset($this->allScopes[$scopeName]);
        }
    }

    /**
     * makeFilterScope creates a filter scope object from name and configuration.
     */
    protected function makeFilterScope($name, $config)
    {
        $scopeType = $config['type'] ?? null;
        [$scopeName, $scopeContext] = $this->evalScopeName($name);

        $scope = new FilterScope([
            'scopeName' => $scopeName,
            'arrayName' => $this->arrayName,
            'idPrefix' => $this->getId()
        ]);

        $scope->useConfig($config);
        $scope->idPrefix($this->getId());

        if ($scopeContext) {
            $scope->context($scopeContext);
        }

        if ($scopeType) {
            $scope->displayAs($scopeType);
        }

        return $scope;
    }

    /**
     * applyAllScopesToQuery applies all scopes to a DB query.
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
     * applyScopeToQuery applies a filter scope constraints to a DB query.
     * @param  string $scope
     * @param  Builder $query
     * @return Builder
     */
    public function applyScopeToQuery($scope, $query)
    {
        if (is_string($scope)) {
            $scope = $this->getScope($scope);
        }

        switch ($scope->type) {
            case 'checkbox':
            case 'switch':
                $this->applyCheckboxScopeToQuery($query, $scope);
                break;

            case 'dropdown':
                $this->applyDropdownScopeToQuery($query, $scope);
                break;

            case 'widget':
                $this->applyWidgetScopeToQuery($query, $scope);
                break;
        }

        return $query;
    }

    /**
     * applyWidgetScopeToQuery
     */
    public function applyWidgetScopeToQuery($query, $scope)
    {
        if (!$scope->scopeValue) {
            return;
        }

        $this->makeFilterScopeWidget($scope)->applyScopeToQuery($query);
    }

    /**
     * applyCheckboxScopeToQuery
     */
    public function applyCheckboxScopeToQuery($query, $scope)
    {
        // Check true value
        $scopeValue = $scope->scopeValue !== null ? $scope->value : null;
        if (!$scopeValue) {
            return;
        }

        // Scope
        if ($scope->modelScope) {
            $scope->applyScopeMethodToQuery($query);
            return;
        }

        // Condition
        $scopeConditions = $scope->conditions;
        if ($scopeConditions) {
            // Switch scope: multiple conditions, value either 1 or 2
            if (is_array($scopeConditions)) {
                $conditionNum = ((int) $scopeValue) - 1;
                [$scopeConditions] = array_slice($scopeConditions, $conditionNum);
            }

            $query->whereRaw(DbDongle::parse($scopeConditions));
            return;
        }

        if ($scope->type === 'switch') {
            $scopeValue = (int) $scopeValue === 2;
        }

        $query->where($scope->valueFrom ?: $scope->scopeName, $scopeValue);
    }

    /**
     * applyDropdownScopeToQuery
     */
    public function applyDropdownScopeToQuery($query, $scope)
    {
        // Check true value
        $scopeValue = $scope->scopeValue !== null ? $scope->value : null;
        if ($scopeValue === null || $scopeValue === '') {
            return;
        }

        // Scope
        if ($scope->modelScope) {
            $scope->applyScopeMethodToQuery($query);
            return;
        }

        // Condition
        $sqlCondition = $scope->conditions;
        if (is_string($sqlCondition)) {
            // @deprecated adapt legacy format
            $sqlCondition = str_replace(["':value'", "':filtered'", ':filtered'], ':value', $sqlCondition);

            $query->whereRaw(DbDongle::parse($sqlCondition, [
                'value' => $scopeValue
            ]));
            return;
        }

        $query->where($scope->valueFrom ?: $scope->scopeName, $scopeValue);
    }

    /**
     * renderScopeElement for a scope
     */
    public function renderScopeElement($scope)
    {
        if (is_string($scope)) {
            if (!isset($this->allScopes[$scope])) {
                throw new SystemException(Lang::get(
                    'backend::lang.form.missing_definition',
                    compact('scope')
                ));
            }

            $scope = $this->allScopes[$scope];
        }

        return $this->makePartial('scope_' . $scope->type, [
            'scope' => $scope,
        ]);
    }

    /**
     * renderScopeFormElement
     */
    public function renderScopeFormElement($scope)
    {
        if (is_string($scope)) {
            if (!isset($this->allScopes[$scope])) {
                throw new SystemException(Lang::get(
                    'backend::lang.form.missing_definition',
                    compact('scope')
                ));
            }

            $scope = $this->allScopes[$scope];
        }

        return $this->makePartial('form_' . $scope->type, [
            'scope' => $scope,
        ]);
    }

    /**
     * evalScopeName parses a scopes's name for embedded context
     * with a result of scopeName@context to [scopeName, context]
     */
    protected function evalScopeName(string $scope): array
    {
        if (strpos($scope, '@') === false) {
            return [$scope, null];
        }

        return explode('@', $scope);
    }

    /**
     * getHeaderValue looks up the scope header
     */
    public function getHeaderValue($scope)
    {
        if ($scope->shortLabel !== null) {
            $value = Lang::get($scope->shortLabel);
        }
        else {
            $value = Lang::get($scope->label);
        }

        /**
         * @event backend.filter.overrideHeaderValue
         * Overrides the scope header value in a filter widget.
         *
         * If a value is returned from this event, it will be used as the value for the provided scope.
         * `$value` is passed by reference so modifying the variable in place is also supported. Example usage:
         *
         *     Event::listen('backend.filter.overrideHeaderValue', function ($filterWidget, $scope, &$value) {
         *         $value .= '-modified';
         *     });
         *
         * Or
         *
         *     $filterWidget->bindEvent('filter.overrideHeaderValue', function ($scope, $value) {
         *         return 'Custom header value';
         *     });
         *
         */
        if ($response = $this->fireSystemEvent('backend.filter.overrideHeaderValue', [$scope, &$value])) {
            $value = $response;
        }

        return $value;
    }

    /**
     * getScopeValue returns a scope value for this widget instance.
     */
    public function getScopeValue($scope)
    {
        if (is_string($scope)) {
            $scope = $this->getScope($scope);
        }

        $cacheKey = 'scope-'.$scope->scopeName;
        return $this->getSession($cacheKey, $scope->getDefaultScopeValue());
    }

    /**
     * putScopeValue sets an scope value for this widget instance.
     */
    public function putScopeValue($scope, $value)
    {
        if (is_string($scope)) {
            $scope = $this->getScope($scope);
        }

        // Set in session
        $cacheKey = 'scope-'.$scope->scopeName;
        $this->putSession($cacheKey, $value);

        // Set in memory
        $scope->setScopeValue($value);

        // Set in widget memory
        if ($scope->type === 'widget' && ($widget = $this->makeFilterScopeWidget($scope))) {
            $widget->getFilterScope()->setScopeValue($value);
        }
    }

    /**
     * getScopes gets all the registered scopes for the instance.
     * @return array
     */
    public function getScopes()
    {
        return $this->allScopes;
    }

    /**
     * getScope gets a specified scope object
     * @param  string $scope
     * @return mixed
     */
    public function getScope($scope)
    {
        if (!isset($this->allScopes[$scope])) {
            throw new ApplicationException("No definition for scope [{$scope}] found");
        }

        return $this->allScopes[$scope];
    }

    /**
     * getDependScopes
     */
    protected function getDependScopes($parentScope): array
    {
        $dependScopes = [];
        foreach ($this->getScopes() as $scope) {
            if ($scope->scopeName === $parentScope->scopeName) {
                continue;
            }

            if (!$scope->dependsOn) {
                continue;
            }

            foreach ((array) $scope->dependsOn as $scopeName) {
                if ($scopeName === $parentScope->scopeName) {
                    $dependScopes[] = $scope;
                }
            }
        }

        return $dependScopes;
    }

    /**
     * getModel returns the active model for this form.
     * @return \Model|null
     */
    public function getModel()
    {
        return $this->model;
    }

    /**
     * getContext returns the active context for displaying the form.
     * @return string
     */
    public function getContext()
    {
        return $this->context;
    }

    /**
     * onLoadFilterForm
     */
    public function onLoadFilterForm()
    {
        $this->defineFilterScopes();

        if (!$scope = post('scopeName')) {
            return;
        }

        return $this->renderScopeFormElement($scope);
    }

    /**
     * onFilterUpdate updates a filter scope value.
     * @return array
     */
    public function onFilterUpdate()
    {
        if (post('preload')) {
            return $this->onPreloadContent();
        }

        $updateScopePartial = false;
        $this->defineFilterScopes();

        if (!$scope = post('scopeName')) {
            return;
        }

        $scope = $this->getScope($scope);

        switch ($scope->type) {
            case 'checkbox':
                $checked = post('value');
                $this->putScopeValue($scope, ['value' => $checked]);
                break;

            case 'dropdown':
            case 'switch':
                $value = post('value');
                $this->putScopeValue($scope, ['value' => $value]);
                break;

            case 'widget':
                $widget = $this->makeFilterScopeWidget($scope);
                $this->putScopeValue($scope, $widget->getActiveValue());
                $updateScopePartial = true;
                break;
        }

        // Apply model filters to scopes
        $this->applyFiltersFromModel();

        // Build response
        $result = [];
        if ($updateScopePartial) {
            $result['#' . $scope->getId('group')] = $this->makePartial('scope', ['scope' => $scope]);
        }

        // Reset dependant scopes
        if ($dependScopes = $this->getDependScopes($scope)) {
            foreach ($dependScopes as $dScope) {
                $this->putScopeValue($dScope, null);
                $result['#' . $dScope->getId('group')] = $this->makePartial('scope', ['scope' => $dScope]);
            }
        }

        $result = $this->extendScopeUpdateResponse($result, func_get_args());

        return $result;
    }

    /**
     * onPreloadContent
     */
    public function onPreloadContent()
    {
        $this->defineFilterScopes();

        $result = [];

        foreach ($this->getScopes() as $scope) {
            $hasNoForm = in_array($scope->type, ['checkbox', 'switch', 'dropdown']);
            if ($hasNoForm) {
                continue;
            }

            $result[$scope->scopeName] = $this->renderScopeFormElement($scope);
        }

        return ['popoverContent' => $result];
    }

    /**
     * onFilterClearAll
     */
    public function onFilterClearAll()
    {
        $this->prepareVars();

        foreach ($this->getScopes() as $scope) {
            $scope->setScopeValue($scope->getDefaultScopeValue());

            if ($scope->type === 'widget' && ($widget = $this->makeFilterScopeWidget($scope))) {
                $widget->getFilterScope()->setScopeValue($scope->getDefaultScopeValue());
            }
        }

        $this->resetSession();

        // Return response
        $result = [
            '#' . $this->getId() => $this->makePartial('filter-container')
        ];

        $result = $this->extendScopeUpdateResponse($result, func_get_args());

        return $result;
    }

    /**
     * applyFiltersFromModel allows the model to filter scopes
     */
    protected function applyFiltersFromModel()
    {
        if (!$this->model) {
            return;
        }

        $targetModel = clone $this->model;

        // For passing to events
        $holder = new ElementHolder($this->allScopes);

        // Standard usage
        if (method_exists($targetModel, 'filterScopes')) {
            $targetModel->filterScopes($holder, $this->getContext());
        }

        // Advanced usage
        if (method_exists($targetModel, 'fireEvent')) {
            /**
             * @event model.filter.filterScopes
             * Called after the filter is initialized
             *
             * Example usage:
             *
             *     $model->bindEvent('model.filter.filterScopes', function ((\Backend\Widgets\Filter) $filterWidget, (stdClass) $scopes, (string) $context) use (\October\Rain\Database\Model $model) {
             *         if ($someCondition) {
             *             $scopes->roles->hidden = false;
             *         }
             *     });
             *
             */
            $targetModel->fireEvent('model.filter.filterScopes', [$this, $holder, $this->getContext()]);
        }
    }

    /**
     * extendScopeUpdateResponse
     */
    public function extendScopeUpdateResponse($result, $params)
    {
        /**
         * @event backend.filter.update
         * Called after the filter is updated, should return an array of additional result parameters.
         *
         * Example usage:
         *
         *     Event::listen('backend.filter.update', function ((\Backend\Widgets\Filter) $filterWidget, (array) $params) {
         *         return ['#my-partial-id' => $filterWidget->makePartial(...)];
         *     });
         *
         * Or
         *
         *     $filterWidget->bindEvent('filter.update', function ((array) $params) use ((\Backend\Widgets\Filter $filterWidget)) {
         *         return ['#my-partial-id' => $filterWidget->makePartial(...)];
         *     });
         *
         */
        $eventResults = $this->fireSystemEvent('backend.filter.update', [$params], false);

        foreach ($eventResults as $eventResult) {
            if (!is_array($eventResult)) {
                continue;
            }

            $result = $eventResult + $result;
        }

        return $result;
    }

    /**
     * extendScopeModelQuery
     */
    public function extendScopeModelQuery($scope, $query)
    {
        /**
         * @event backend.filter.extendQuery
         * Provides an opportunity to extend the query of the list of options
         *
         * Example usage:
         *
         *     Event::listen('backend.filter.extendQuery', function ((\Backend\Widgets\Filter) $filterWidget, $query, (\Backend\Classes\FilterScope) $scope) {
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
    }
}
