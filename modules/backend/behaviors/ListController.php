<?php namespace Backend\Behaviors;

use Str;
use Lang;
use Event;
use System\Classes\SystemException;
use Backend\Classes\ControllerBehavior;

/**
 * List Controller Behavior
 * Adds features for working with backend lists.
 *
 * @package october\backend
 * @author Alexey Bobkov, Samuel Georges
 */
class ListController extends ControllerBehavior
{

    /**
     * @var array List definitions, keys for alias and value for configuration.
     */
    private $listDefinitions;

    /**
     * @var string The primary list alias to use. Default: list
     */
    private $primaryDefinition;

    /**
     * @var Backend\Classes\WidgetBase Reference to the list widget object.
     */
    private $listWidgets = [];

    /**
     * @var WidgetBase Reference to the toolbar widget objects.
     */
    private $toolbarWidgets = [];

    /**
     * {@inheritDoc}
     */
    protected $requiredProperties = ['listConfig'];

    /**
     * @var array Configuration values that must exist when applying the primary config file.
     * - modelClass: Class name for the model
     * - list: List column definitions
     */
    protected $requiredConfig = ['modelClass', 'list'];

    /**
     * Behavior constructor
     * @param Backend\Classes\Controller $controller
     * @return void
     */
    public function __construct($controller)
    {
        parent::__construct($controller);

        /*
         * Extract list definitions
         */
        if (is_array($controller->listConfig)) {
            $this->listDefinitions = $controller->listConfig;
            $this->primaryDefinition = key($this->listDefinitions);
        }
        else {
            $this->listDefinitions = ['list' => $controller->listConfig];
            $this->primaryDefinition = 'list';
        }

        /*
         * Build configuration
         */
        $this->setConfig($this->listDefinitions[$this->primaryDefinition], $this->requiredConfig);
    }

    /**
     * Creates all the list widgets based on the definitions.
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
     * Prepare the widgets used by this action
     * @return void
     */
    public function makeList($definition = null)
    {
        if (!$definition || !isset($this->listDefinitions[$definition]))
            $definition = $this->primaryDefinition;

        $listConfig = $this->makeConfig($this->listDefinitions[$definition], $this->requiredConfig);

        /*
         * Create the model
         */
        $class = $listConfig->modelClass;
        $model = new $class();
        $model = $this->controller->listExtendModel($model, $definition);

        /*
         * Prepare the list widget
         */
        $columnConfig = $this->makeConfig($listConfig->list);
        $columnConfig->model = $model;
        $columnConfig->alias = $definition;
        if (isset($listConfig->recordUrl)) $columnConfig->recordUrl = $listConfig->recordUrl;
        if (isset($listConfig->recordOnClick)) $columnConfig->recordOnClick = $listConfig->recordOnClick;
        if (isset($listConfig->recordsPerPage)) $columnConfig->recordsPerPage = $listConfig->recordsPerPage;
        if (isset($listConfig->noRecordsMessage)) $columnConfig->noRecordsMessage = $listConfig->noRecordsMessage;
        if (isset($listConfig->defaultSort)) $columnConfig->defaultSort = $listConfig->defaultSort;
        if (isset($listConfig->showSorting)) $columnConfig->showSorting = $listConfig->showSorting;
        if (isset($listConfig->showSetup)) $columnConfig->showSetup = $listConfig->showSetup;
        if (isset($listConfig->showCheckboxes)) $columnConfig->showCheckboxes = $listConfig->showCheckboxes;
        if (isset($listConfig->showTree)) $columnConfig->showTree = $listConfig->showTree;
        if (isset($listConfig->treeExpanded)) $columnConfig->treeExpanded = $listConfig->treeExpanded;
        $widget = $this->makeWidget('Backend\Widgets\Lists', $columnConfig);
        $widget->bindToController();

        /*
         * Extensibility helpers
         */
        $widget->bindEvent('list.extendQueryBefore', function($host, $query) use ($definition) {
            $this->controller->listExtendQueryBefore($query, $definition);
        });

        $widget->bindEvent('list.extendQuery', function($host, $query) use ($definition) {
            $this->controller->listExtendQuery($query, $definition);
        });

        $widget->bindEvent('list.injectRowClass', function($host, $record) use ($definition) {
            return $this->controller->listInjectRowClass($record, $definition);
        });

        $widget->bindEvent('list.overrideColumnValue', function($host, $record, $column, $value) use ($definition) {
            return $this->controller->listOverrideColumnValue($record, $column->columnName, $definition);
        });

        $widget->bindEvent('list.overrideHeaderValue', function($host, $column, $value) use ($definition) {
            return $this->controller->listOverrideHeaderValue($column->columnName, $definition);
        });

        /*
         * Prepare the toolbar widget (optional)
         */
        if (isset($listConfig->toolbar)) {
            $toolbarConfig = $this->makeConfig($listConfig->toolbar);
            $toolbarConfig->alias = $widget->alias . 'Toolbar';
            $toolbarWidget = $this->makeWidget('Backend\Widgets\Toolbar', $toolbarConfig);
            $toolbarWidget->bindToController();
            $toolbarWidget->cssClasses[] = 'list-header';

            /*
             * Link the Search Widget to the List Widget
             */
            if ($searchWidget = $toolbarWidget->getSearchWidget()) {
                $searchWidget->bindEvent('search.submit', function() use ($widget, $searchWidget) {
                    $widget->setSearchTerm($searchWidget->getActiveTerm());
                    return $widget->onRender();
                });

                // Find predefined search term
                $widget->setSearchTerm($searchWidget->getActiveTerm());
            }

            $this->toolbarWidgets[$definition] = $toolbarWidget;
        }

        return $widget;
    }

    /**
     * Index Controller action.
     * @return void
     */
    public function index()
    {
        $this->controller->pageTitle = $this->controller->pageTitle ?: trans($this->getConfig('title', 'backend::lang.list.default_title'));
        $this->controller->bodyClass = 'slim-container';
        $this->makeLists();
    }

    /**
     * Renders the widget collection.
     * @param  string $definition Optional list definition.
     * @return string Rendered HTML for the list.
     */
    public function listRender($definition = null)
    {
        if (!count($this->listWidgets))
            throw new SystemException(Lang::get('backend::lang.list.behavior_not_ready'));

        if (!$definition || !isset($this->listDefinitions[$definition]))
            $definition = $this->primaryDefinition;

        $collection = [];

        if (isset($this->toolbarWidgets[$definition]))
            $collection[] = $this->toolbarWidgets[$definition]->render();

        $collection[] = $this->listWidgets[$definition]->render();

        return implode(PHP_EOL, $collection);
    }

    /**
     * Refreshes the list container only, useful for returning in custom AJAX requests.
     * @param  string $definition Optional list definition.
     * @return array The list element selector as the key, and the list contents are the value.
     */
    public function listRefresh($definition = null)
    {
        if (!count($this->listWidgets))
            $this->makeLists();

        if (!$definition || !isset($this->listDefinitions[$definition]))
            $definition = $this->primaryDefinition;

        return $this->listWidgets[$definition]->onRender();
    }

    //
    // Overrides
    //

    /**
     * Controller override: Extend supplied model
     * @param Model $model
     * @return Model
     */
    public function listExtendModel($model, $definition = null)
    {
        return $model;
    }

    /**
     * Controller override: Extend the query used for populating the list
     * before the default query is processed.
     * @param October\Rain\Database\Builder $query
     */
    public function listExtendQueryBefore($query, $definition = null) {}

    /**
     * Controller override: Extend the query used for populating the list
     * after the default query is processed.
     * @param October\Rain\Database\Builder $query
     */
    public function listExtendQuery($query, $definition = null) {}

    /**
     * Returns a CSS class name for a list row (<tr class="...">).
     * @param  Model $record The populated model used for the column
     * @param  string $definition List definition (optional)
     * @return string HTML view
     */
    public function listInjectRowClass($record, $definition = null) {}

    /**
     * Replace a table column value (<td>...</td>)
     * @param  Model $record The populated model used for the column
     * @param  string $columnName The column name to override
     * @param  string $definition List definition (optional)
     * @return string HTML view
     */
    public function listOverrideColumnValue($record, $columnName, $definition = null) {}

    /**
     * Replace the entire table header contents (<th>...</th>) with custom HTML
     * @param  string $columnName The column name to override
     * @param  string $definition List definition (optional)
     * @return string HTML view
     */
    public function listOverrideHeaderValue($columnName, $definition = null) {}

}