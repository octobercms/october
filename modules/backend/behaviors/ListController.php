<?php namespace Backend\Behaviors;

use App;
use Lang;
use Event;
use Flash;
use BackendAuth;
use ApplicationException;
use Backend\Classes\ControllerBehavior;
use ForbiddenException;

/**
 * ListController adds features for working with backend lists
 *
 * This behavior is implemented in the controller like so:
 *
 *     public $implement = [
 *         \Backend\Behaviors\ListController::class,
 *     ];
 *
 *     public $listConfig = 'config_list.yaml';
 *
 * The `$listConfig` property makes reference to the list configuration
 * values as either a YAML file, located in the controller view directory,
 * or directly as a PHP array.
 *
 * @see https://docs.octobercms.com/4.x/extend/lists/list-controller.html List Controller Documentation
 * @package october\backend
 * @author Alexey Bobkov, Samuel Georges
 */
class ListController extends ControllerBehavior
{
    use \Backend\Behaviors\ListController\HasOverrides;

    /**
     * @var array listDefinitions are keys for alias and value for configuration.
     */
    protected $listDefinitions;

    /**
     * @var string primaryDefinition list alias to use. Default: list
     */
    protected $primaryDefinition;

    /**
     * @var array listConfig are keys for alias and value for config objects.
     */
    protected $listConfig = [];

    /**
     * @var \Backend\Classes\WidgetBase[] listWidgets reference to the list widget object.
     */
    protected $listWidgets = [];

    /**
     * @var \Backend\Classes\WidgetBase[] toolbarWidgets reference to the toolbar widget objects.
     */
    protected $toolbarWidgets = [];

    /**
     * @var \Backend\Classes\WidgetBase[] filterWidgets reference to the filter widget objects.
     */
    protected $filterWidgets = [];

    /**
     * @var array requiredProperties in the controller
     */
    protected $requiredProperties = ['listConfig'];

    /**
     * @var array requiredConfig values that must exist when applying the primary config file.
     * - modelClass: Class name for the model
     * - list: List column definitions
     */
    protected $requiredConfig = ['modelClass', 'list'];

    /**
     * @var array actions visible in context of the controller
     */
    protected $actions = ['index'];

    /**
     * __construct the behavior
     * @param \Backend\Classes\Controller $controller
     */
    public function __construct($controller)
    {
        parent::__construct($controller);

        // Extract list definitions
        if (is_array($controller->listConfig)) {
            $this->listDefinitions = $controller->listConfig;
            $this->primaryDefinition = key($this->listDefinitions);
        }
        else {
            $this->listDefinitions = ['list' => $controller->listConfig];
            $this->primaryDefinition = 'list';
        }

        // Build configuration
        $this->setConfig($this->listDefinitions[$this->primaryDefinition], $this->requiredConfig);
    }

    /**
     * makeLists creates all the list widgets based on the definitions.
     * @return array
     */
    public function makeLists()
    {
        foreach ($this->listDefinitions as $definition => $config) {
            $this->listWidgets[$definition] = $this->makeList($definition);
        }

        return $this->listWidgets;
    }

    /**
     * makeList prepares the widgets used by this action
     * @return \Backend\Classes\WidgetBase
     */
    public function makeList($definition = null)
    {
        if (!$definition || !isset($this->listDefinitions[$definition])) {
            $definition = $this->primaryDefinition;
        }

        $listConfig = $this->config = $this->controller->listGetConfig($definition);

        // Create the model
        $model = $this->createModel();
        $model = $this->controller->listExtendModel($model, $definition);

        // Prepare the list widget
        $widgetConfig = $this->makeConfig($listConfig->list);
        $widgetConfig->model = $model;
        $widgetConfig->alias = $listConfig->widgetAlias ?? $definition;

        // Prepare the columns configuration
        $configFieldsToTransfer = [
            'recordUrl',
            'recordOnClick',
            'recordsPerPage',
            'perPageOptions',
            'showPageNumbers',
            'noRecordsMessage',
            'defaultSort',
            'showSorting',
            'showSetup',
            'expandLastColumn',
            'showCheckboxes',
            'customViewPath',
            'customPageName',
        ];

        foreach ($configFieldsToTransfer as $field) {
            if (isset($listConfig->{$field})) {
                $widgetConfig->{$field} = $listConfig->{$field};
            }
        }

        // List Widget with extensibility
        $structureConfig = $this->makeListStructureConfig($widgetConfig, $listConfig);
        if ($structureConfig) {
            $widget = $this->makeWidget(\Backend\Widgets\ListStructure::class, $structureConfig);
        }
        else {
            $widget = $this->makeWidget(\Backend\Widgets\Lists::class, $widgetConfig);
        }

        $widget->bindEvent('list.extendColumns', function () use ($widget) {
            $this->controller->listExtendColumns($widget);
        });

        $widget->bindEvent('list.extendQueryBefore', function ($query) use ($definition) {
            $this->controller->listExtendQueryBefore($query, $definition);
        });

        $widget->bindEvent('list.extendQuery', function ($query) use ($definition) {
            $this->controller->listExtendQuery($query, $definition);
        });

        $widget->bindEvent('list.extendSortColumn', function ($query, $sortColumn, $sortDirection) use ($definition) {
            $this->controller->listExtendSortColumn($query, $sortColumn, $sortDirection, $definition);
        });

        $widget->bindEvent('list.extendRecords', function ($records) use ($definition) {
            return $this->controller->listExtendRecords($records, $definition);
        });

        $widget->bindEvent('list.injectRowClass', function ($record) use ($definition) {
            return $this->controller->listInjectRowClass($record, $definition);
        });

        $widget->bindEvent('list.overrideColumnValue', function ($record, $column, $value) use ($definition) {
            return $this->controller->listOverrideColumnValue($record, $column->columnName, $definition);
        });

        $widget->bindEvent('list.overrideHeaderValue', function ($column, $value) use ($definition) {
            return $this->controller->listOverrideHeaderValue($column->columnName, $definition);
        });

        $widget->bindEvent('list.overrideRecordAction', function ($record, $url, $onClick) use ($definition) {
            return $this->controller->listOverrideRecordUrl($record, $definition);
        });

        $widget->bindEvent('list.reorderStructure', function ($record) use ($definition) {
            return $this->controller->listAfterReorder($record, $definition);
        });

        $widget->bindEvent('list.refresh', function ($result) use ($widget, $definition) {
            return $this->controller->listExtendRefreshResults($widget, $result, $definition);
        });

        $widget->bindToController();

        // Prepare the toolbar widget (optional)
        if (isset($listConfig->toolbar)) {
            $toolbarConfig = $this->makeConfig($listConfig->toolbar);
            $toolbarConfig->alias = $widget->alias . 'Toolbar';
            $toolbarWidget = $this->makeWidget(\Backend\Widgets\Toolbar::class, $toolbarConfig);
            $toolbarWidget->listWidgetId = $widget->getId();
            $toolbarWidget->cssClasses[] = 'list-header';

            // Pass the list setup AJAX handler to the toolbar
            if (isset($listConfig->showSetup) && $listConfig->showSetup) {
                $toolbarWidget->setupHandler = $widget->getEventHandler('onLoadSetup');
            }

            // Link the Search Widget to the List Widget
            if ($searchWidget = $toolbarWidget->getSearchWidget()) {
                $searchWidget->bindEvent('search.submit', function () use ($widget, $searchWidget) {
                    $widget->setSearchTerm($searchWidget->getActiveTerm(), true);
                    return $widget->onRefresh();
                });

                // Pass search options
                $widget->setSearchOptions([
                    'mode' => $searchWidget->mode,
                    'scope' => $searchWidget->scope,
                ]);

                // Find predefined search term
                $widget->setSearchTerm($searchWidget->getActiveTerm());
            }

            // Bind to controller
            $toolbarWidget->bindToController();

            $this->toolbarWidgets[$definition] = $toolbarWidget;
        }

        // Prepare the filter widget (optional)
        if (isset($listConfig->filter)) {
            $widget->cssClasses[] = 'list-flush';

            $filterConfig = $this->makeConfig($listConfig->filter);
            $filterConfig->model = $model;
            $filterConfig->alias = $widget->alias . 'Filter';
            $filterConfig->customPageName = $listConfig->customPageName ?? null;
            $filterWidget = $this->makeWidget(\Backend\Widgets\Filter::class, $filterConfig);

            // Filter the list when the scopes are changed
            $filterWidget->bindEvent('filter.update', function() use ($widget) {
                return $widget->onFilter();
            });

            // Filter Widget with extensibility
            $filterWidget->bindEvent('filter.extendScopes', function() use ($filterWidget) {
                $this->controller->listFilterExtendScopes($filterWidget);
            });

            // Extend the query of the list of options
            $filterWidget->bindEvent('filter.extendQuery', function($query, $scope) {
                $this->controller->listFilterExtendQuery($query, $scope);
            });

            // Apply predefined filter values
            $widget->addFilter([$filterWidget, 'applyAllScopesToQuery']);

            // Bind to controller
            $filterWidget->bindToController();

            $this->filterWidgets[$definition] = $filterWidget;
        }

        return $widget;
    }

    /**
     * makeListStructureConfig
     */
    protected function makeListStructureConfig(object $widgetConfig, object $config): ?object
    {
        // @deprecated old API
        if (isset($config->showTree)) {
            $widgetConfig->showTree = $config->showTree;
            $widgetConfig->treeExpanded = $config->treeExpanded ?? false;
            $widgetConfig->showReorder = false;
            if (!isset($config->structure)) {
                return $widgetConfig;
            }
        }

        // New API
        if (isset($config->structure)) {
            return $this->mergeConfig($widgetConfig, $config->structure);
        }

        return null;
    }

    /**
     * index controller action
     * @return void
     */
    public function index()
    {
        if (!$this->controller->pageTitle) {
            $this->controller->pageTitle = Lang::get($this->getConfig(
                'title',
                'backend::lang.list.default_title'
            ));
        }

        $this->controller->bodyClass ??= 'slim-container';

        $this->makeLists();
    }

    /**
     * index_onDelete bulk deletes records.
     * @return void
     */
    public function index_onDelete()
    {
        if (method_exists($this->controller, 'onDelete')) {
            return call_user_func_array([$this->controller, 'onDelete'], func_get_args());
        }

        // Establish the list definition
        $definition = post('definition', $this->primaryDefinition);

        if (!isset($this->listDefinitions[$definition])) {
            throw new ApplicationException(Lang::get('backend::lang.list.missing_parent_definition', compact('definition')));
        }

        $this->config = $this->controller->listGetConfig($definition);

        // Check conditions for deletion
        if (!$this->listCanDeleteRecords()) {
            throw new ForbiddenException;
        }

        // Validate checked identifiers
        $checkedIds = post('checked');

        if (!$checkedIds || !is_array($checkedIds) || !count($checkedIds)) {
            Flash::error(Lang::get('backend::lang.list.delete_selected_empty'));
            return $this->controller->listRefresh();
        }

        // Create the model
        $model = $this->createModel();
        $model = $this->controller->listExtendModel($model, $definition);

        // Create the query
        $query = $model->newQuery();
        $this->controller->listExtendQueryBefore($query, $definition);

        $query->whereIn($model->getQualifiedKeyName(), $checkedIds);
        $this->controller->listExtendQuery($query, $definition);

        // Delete records
        $records = $query->get();

        if ($records->count()) {
            foreach ($records as $record) {
                $record->delete();
            }

            Flash::success(Lang::get('backend::lang.list.delete_selected_success'));
        }
        else {
            Flash::error(Lang::get('backend::lang.list.delete_selected_empty'));
        }

        return $this->controller->listRefresh($definition);
    }

    /**
     * listCanDeleteRecords determines if records can be deleted from the list
     */
    protected function listCanDeleteRecords(): bool
    {
        if (!$this->getConfig('showCheckboxes')) {
            return false;
        }

        if ($requiredPermission = $this->getConfig('requiredPermissions[recordDelete]')) {
            return BackendAuth::userHasAccess($requiredPermission);
        }

        return true;
    }

    /**
     * createModel is an internal method used to prepare the list model object.
     * @return \October\Rain\Database\Model
     */
    protected function createModel()
    {
        return App::make($this->config->modelClass);
    }

    /**
     * listRender renders the widget collection.
     * @param  string $definition Optional list definition.
     * @return string Rendered HTML for the list.
     */
    public function listRender($definition = null)
    {
        if (!count($this->listWidgets)) {
            throw new ApplicationException(Lang::get('backend::lang.list.behavior_not_ready'));
        }

        if (!$definition || !isset($this->listDefinitions[$definition])) {
            $definition = $this->primaryDefinition;
        }

        $vars = [
            'toolbar' => null,
            'filter' => null,
            'list' => null,
        ];

        if (isset($this->toolbarWidgets[$definition])) {
            $vars['toolbar'] = $this->toolbarWidgets[$definition];
        }

        if (isset($this->filterWidgets[$definition])) {
            $vars['filter'] = $this->filterWidgets[$definition];
        }

        $vars['list'] = $this->listWidgets[$definition];

        return $this->listMakePartial('container', $vars);
    }

    /**
     * listMakePartial is a controller accessor for making partials within this behavior.
     * @param string $partial
     * @param array $params
     * @return string Partial contents
     */
    public function listMakePartial($partial, $params = [])
    {
        $contents = $this->controller->makePartial('list_'.$partial, $params + $this->vars, false);
        if (!$contents) {
            $contents = $this->makePartial($partial, $params);
        }

        return $contents;
    }

    /**
     * listRefresh refreshes the list container only, useful for returning in custom AJAX requests.
     * @param  string $definition Optional list definition.
     * @return array The list element selector as the key, and the list contents are the value.
     */
    public function listRefresh($definition = null)
    {
        if (!count($this->listWidgets)) {
            $this->makeLists();
        }

        if (!$definition || !isset($this->listDefinitions[$definition])) {
            $definition = $this->primaryDefinition;
        }

        return $this->listWidgets[$definition]->onRefresh();
    }

    /**
     * listGetWidget returns the widget used by this behavior.
     * @return \Backend\Classes\WidgetBase
     */
    public function listGetWidget($definition = null)
    {
        if (!$definition) {
            $definition = $this->primaryDefinition;
        }

        return array_get($this->listWidgets, $definition);
    }

    /**
     * listGetFilterWidget returns the filter widget used by this behavior.
     * @return \Backend\Classes\WidgetBase
     */
    public function listGetFilterWidget($definition = null)
    {
        if (!$definition) {
            $definition = $this->primaryDefinition;
        }

        return array_get($this->filterWidgets, $definition);
    }

    /**
     * listGetToolbarWidget returns the toolbar widget used by this behavior.
     * @return \Backend\Classes\WidgetBase
     */
    public function listGetToolbarWidget($definition = null)
    {
        if (!$definition) {
            $definition = $this->primaryDefinition;
        }

        return array_get($this->toolbarWidgets, $definition);
    }

    /**
     * listGetId returns a unique ID for the list widget used by this behavior.
     * This is useful for dealing with identifiers in the markup.
     *
     *     <div id="<?= $this->listGetId()">...</div>
     *
     * A suffix may be used passed as the first argument to reuse
     * the identifier in other areas.
     *
     *     <button id="<?= $this->listGetId('button')">...</button>
     *
     * @param string $suffix
     * @return string
     */
    public function listGetId($suffix = null, $definition = null)
    {
        return $this->listGetWidget($definition)->getId($suffix);
    }

    /**
     * listGetConfig returns the configuration used by this behavior. You may override this
     * method in your controller as an alternative to defining a listConfig property.
     * @return object|null
     */
    public function listGetConfig($definition = null)
    {
        if (!$definition) {
            $definition = $this->primaryDefinition;
        }

        $config = array_get($this->listConfig, $definition);

        if (!$config) {
            $config = $this->listConfig[$definition] = $this->makeConfig($this->listDefinitions[$definition], $this->requiredConfig);
        }

        return $config;
    }

    //
    // Overrides
    //

    /**
     * extendListColumns is a static helper for extending list columns.
     * @deprecated for best performance, use Event class directly, see docs
     * @link https://docs.octobercms.com/4.x/extend/lists/list-controller.html#extending-column-definitions
     */
    public static function extendListColumns($callback)
    {
        $calledClass = self::getCalledExtensionClass();
        Event::listen('backend.list.extendColumns', function ($widget) use ($calledClass, $callback) {
            if (!is_a($widget->getController(), $calledClass)) {
                return;
            }
            call_user_func_array($callback, [$widget, $widget->model]);
        });
    }

    /**
     * extendListFilterScopes is a static helper for extending filter scopes.
     * @deprecated for best performance, use Event class directly, see docs
     * @link https://docs.octobercms.com/4.x/extend/lists/list-controller.html#extending-filter-scopes
     */
    public static function extendListFilterScopes($callback)
    {
        $calledClass = self::getCalledExtensionClass();
        Event::listen('backend.filter.extendScopes', function ($widget) use ($calledClass, $callback) {
            if (!is_a($widget->getController(), $calledClass)) {
                return;
            }
            call_user_func_array($callback, [$widget]);
        });
    }
}
