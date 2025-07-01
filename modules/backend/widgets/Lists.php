<?php namespace Backend\Widgets;

use Db;
use Str;
use Url;
use Html;
use Lang;
use Backend;
use DbDongle;
use Carbon\Carbon;
use October\Rain\Html\Helper as HtmlHelper;
use October\Rain\Router\Helper as RouterHelper;
use System\Helpers\DateTime as DateTimeHelper;
use System\Classes\PluginManager;
use Backend\Classes\ListColumn;
use Backend\Classes\WidgetBase;
use October\Rain\Database\Model;
use October\Contracts\Element\ListElement;
use Illuminate\Database\Query\Builder as QueryBuilder;
use Illuminate\Pagination\UrlWindow;
use ApplicationException;
use Exception;
use UnitEnum;

/**
 * Lists Widget used for building back end lists, renders a list of model objects
 *
 * @package october\backend
 * @author Alexey Bobkov, Samuel Georges
 */
class Lists extends WidgetBase implements ListElement
{
    use \Backend\Widgets\Lists\IsListElement;
    use \Backend\Widgets\Lists\ColumnProcessor;
    use \Backend\Widgets\Lists\HasListSetup;
    use \Backend\Widgets\Lists\HasSorting;
    use \Backend\Widgets\Lists\HasSearch;
    use \Backend\Traits\PreferenceMaker;

    //
    // Configurable Properties
    //

    /**
     * @var array columns configuration.
     */
    public $columns;

    /**
     * @var Model model object for the list.
     */
    public $model;

    /**
     * @var string recordUrl for each record row. Replace :id with the record id.
     */
    public $recordUrl;

    /**
     * @var string recordOnClick event for each record row. Replace :id with the record id.
     */
    public $recordOnClick;

    /**
     * @var string noRecordsMessage to display when there are no records in the list.
     */
    public $noRecordsMessage = 'backend::lang.list.no_records';

    /**
     * @var int recordsPerPage as maximum rows to display.
     */
    public $recordsPerPage;

    /**
     * @var array perPageOptions is the number of items per page.
     */
    public $perPageOptions;

    /**
     * @var bool showSorting options for each column.
     */
    public $showSorting = true;

    /**
     * @var mixed defaultSort column to look for.
     */
    public $defaultSort;

    /**
     * @var bool showCheckboxes next to each record row.
     */
    public $showCheckboxes = false;

    /**
     * @var bool showSetup displays the list set up used for column visibility and ordering.
     */
    public $showSetup = false;

    /**
     * @var bool expandLastCol will expand to squeeze extra room from the last column.
     */
    public $expandLastColumn = false;

    /**
     * @var bool|string showPagination when limiting records per page.
     */
    public $showPagination = 'auto';

    /**
     * @var bool showPageNumbers with pagination, disable to improve performance.
     */
    public $showPageNumbers = true;

    /**
     * @var string customViewPath specifies a custom view path to override partials used by the list.
     */
    public $customViewPath;

    /**
     * @var string customPageName specifies a name to use in the page URL for paginated records.
     */
    public $customPageName = 'page';

    /**
     * @var string pivotMode targets the pivot relationship on the model for identifiers and replacements.
     */
    public $pivotMode = false;

    //
    // Object Properties
    //

    /**
     * @inheritDoc
     */
    protected $defaultAlias = 'list';

    /**
     * @var array allColumns collection of all list columns used in this list.
     * @see Backend\Classes\ListColumn
     */
    protected $allColumns;

    /**
     * @var array columnOverride default columns with supplied key names.
     */
    protected $columnOverride;

    /**
     * @var array visibleColumns to display and their order.
     */
    protected $visibleColumns;

    /**
     * @var object records of models as a data collection.
     */
    protected $records;

    /**
     * @var int currentPageNumber
     */
    protected $currentPageNumber;

    /**
     * @var array Collection of functions to apply to each list query.
     */
    protected $filterCallbacks = [];

    /**
     * @var array cssClasses to apply to the list container element
     */
    public $cssClasses = [];

    /**
     * init the widget, called by the constructor and free from its parameters.
     */
    public function init()
    {
        $this->fillFromConfig([
            'columns',
            'model',
            'recordUrl',
            'recordOnClick',
            'noRecordsMessage',
            'showPageNumbers',
            'recordsPerPage',
            'showSorting',
            'perPageOptions',
            'defaultSort',
            'showCheckboxes',
            'showSetup',
            'expandLastColumn',
            'showPagination',
            'customViewPath',
            'customPageName',
            'pivotMode',
        ]);

        // Configure the list widget
        if ($this->showSetup) {
            $this->recordsPerPage = $this->getUserPreference('per_page', $this->recordsPerPage);
        }

        if ($this->showPagination == 'auto') {
            $this->showPagination = $this->recordsPerPage && $this->recordsPerPage > 0;
        }

        if ($this->customViewPath) {
            $this->addViewPath($this->customViewPath);
        }

        if (!$this->customPageName) {
            $this->customPageName = '_page';
        }

        $this->validateModel();
    }

    /**
     * @inheritDoc
     */
    protected function loadAssets()
    {
        $this->addJs('js/october.list.js');
    }

    /**
     * Renders the widget.
     */
    public function render()
    {
        $this->prepareVars();
        return $this->makePartial('list-container');
    }

    /**
     * prepareVars for display
     */
    public function prepareVars()
    {
        $this->vars['cssClasses'] = implode(' ', $this->cssClasses);
        $this->vars['columns'] = $this->getVisibleColumns();
        $this->vars['columnTotal'] = $this->getTotalColumns();
        $this->vars['records'] = $this->getRecords();
        $this->vars['noRecordsMessage'] = trans($this->noRecordsMessage);
        $this->vars['showCheckboxes'] = $this->showCheckboxes;
        $this->vars['showSetup'] = $this->showSetup;
        $this->vars['showPagination'] = $this->showPagination;
        $this->vars['showPageNumbers'] = $this->showPageNumbers;
        $this->vars['expandLastColumn'] = $this->expandLastColumn;
        $this->vars['showSorting'] = $this->showSorting;
        $this->vars['sortColumn'] = $this->getSortColumn();
        $this->vars['sortDirection'] = $this->sortDirection;
        $this->vars['pageName'] = $this->customPageName;

        if ($this->showPagination) {
            $this->vars['pageCurrent'] = $this->records->currentPage();

            if ($this->showPageNumbers) {
                $this->vars['recordElements'] = $this->getPaginationElements($this->records);
                $this->vars['recordTotal'] = $this->records->total();
                $this->vars['pageLast'] = $this->records->lastPage();
                $this->vars['pageFrom'] = $this->records->firstItem();
                $this->vars['pageTo'] = $this->records->lastItem();
            }
            else {
                $this->vars['hasMorePages'] = $this->records->hasMorePages();
            }
        }
        else {
            $this->vars['recordTotal'] = $this->records->count();
            $this->vars['pageCurrent'] = 1;
        }
    }

    /**
     * getPaginationElements get the array of elements to pass to the view.
     * @return array
     */
    protected function getPaginationElements($records)
    {
        $records->onEachSide(1);

        $window = UrlWindow::make($records);

        return array_filter([
            $window['first'],
            is_array($window['slider']) ? '...' : null,
            $window['slider'],
            is_array($window['last']) ? '...' : null,
            $window['last'],
        ]);
    }

    /**
     * onRefresh event handler for refreshing the list.
     */
    public function onRefresh()
    {
        $this->prepareVars();

        $result = ['#'.$this->getId() => $this->makePartial('list')];

        /**
         * @event backend.list.refresh
         * Called after the list is refreshed, should return an array of additional result parameters.
         *
         * Example usage:
         *
         *     Event::listen('backend.list.refresh', function ((\Backend\Widgets\List) $listWidget, (array) $result) {
         *         $result['#my-partial-id' => $listWidget->makePartial('$/path/to/custom/backend/_partial.php')];
         *         return $result;
         *     });
         *
         * Or
         *
         *     $listWidget->bindEvent('list.refresh', function ((array) $result) use ((\Backend\Widgets\List $listWidget)) {
         *         $result['#my-partial-id' => $listWidget->makePartial('$/path/to/custom/backend/_partial.php')];
         *         return $result;
         *     });
         *
         */
        $eventResults = $this->fireSystemEvent('backend.list.refresh', [$result], false);

        foreach ($eventResults as $eventResult) {
            if (!is_array($eventResult)) {
                continue;
            }

            $result = $eventResult + $result;
        }

        return $result;
    }

    /**
     * onPaginate event handler for switching the page number.
     */
    public function onPaginate()
    {
        $this->currentPageNumber = input($this->customPageName);

        return $this->onRefresh();
    }

    /**
     * onFilter event handler for changing the filter
     */
    public function onFilter()
    {
        $this->currentPageNumber = 1;

        return $this->onRefresh();
    }

    /**
     * validateModel is present and right class type
     */
    protected function validateModel()
    {
        if (!$this->model) {
            throw new ApplicationException(Lang::get(
                'backend::lang.list.missing_model',
                ['class'=>get_class($this->controller)]
            ));
        }

        if (!$this->model instanceof Model) {
            throw new ApplicationException(Lang::get(
                'backend::lang.model.invalid_class',
                ['model'=>get_class($this->model), 'class'=>get_class($this->controller)]
            ));
        }

        return $this->model;
    }

    /**
     * parseTableName replaces the @ symbol with a table name in a model
     * @param  string $sql
     * @param  string $table
     * @return string
     */
    protected function parseTableName($sql, $table)
    {
        return str_replace('@', $table.'.', $sql);
    }

    /**
     * prepareQuery applies any filters to the model
     */
    public function prepareQuery()
    {
        $query = $this->model->newQuery();
        $primaryTable = $this->model->getTable();
        $selects = [$primaryTable.'.*'];
        $joins = [];
        $withs = [];
        $bindings = [];

        /**
         * @event backend.list.extendQueryBefore
         * Provides an opportunity to modify the `$query` object before the List widget applies its scopes to it.
         *
         * Example usage:
         *
         *     Event::listen('backend.list.extendQueryBefore', function ($listWidget, $query) {
         *         $query->whereNull('deleted_at');
         *     });
         *
         * Or
         *
         *     $listWidget->bindEvent('list.extendQueryBefore', function ($query) {
         *         $query->whereNull('deleted_at');
         *     });
         *
         */
        $this->fireSystemEvent('backend.list.extendQueryBefore', [$query]);

        // Prepare searchable column names
        $primarySearchable = [];
        $relationSearchable = [];

        if (!empty($this->searchTerm) && ($searchableColumns = $this->getSearchableColumns())) {
            foreach ($searchableColumns as $column) {
                // Related
                if ($this->isColumnRelated($column)) {
                    $table = $this->model->makeRelation($column->relation)->getTable();
                    $columnName = $column->sqlSelect
                        ? DbDongle::raw($this->parseTableName($column->sqlSelect, $table))
                        : $table . '.' . $column->valueFrom;

                    $relationSearchable[$column->relation][] = $columnName;
                }
                // Primary
                else {
                    $columnName = $column->sqlSelect
                        ? DbDongle::raw($this->parseTableName($column->sqlSelect, $primaryTable))
                        : $primaryTable . '.' . $column->columnName;

                    $primarySearchable[] = $columnName;
                }
            }
        }

        // Prepare related eager loads (withs) and custom selects (joins)
        foreach ($this->getVisibleColumns() as $column) {
            // Column wants to count the value
            if ($column->useRelationCount()) {
                $query->withCount($column->relation);
            }

            // Column wants to eager load something
            if ($column->relationWith) {
                if (is_array($column->relationWith)) {
                    $withs = array_merge($withs, $column->relationWith);
                } else {
                    $withs[] = $column->relationWith;
                }
            }

            // Column is not a related column selection (relation + select)
            if (!$this->isColumnRelated($column) || (!$column->sqlSelect && !$column->valueFrom)) {
                continue;
            }

            if ($column->valueFrom) {
                $withs[] = $column->relation;
            }

            $joins[] = $column->relation;
        }

        // Add eager loads to the query
        if ($withs) {
            $query->with(array_unique($withs));
        }

        // Apply search term
        $query->where(function($innerQuery) use ($primarySearchable, $relationSearchable, $joins) {

            // Search primary columns
            if (count($primarySearchable) > 0) {
                $this->applySearchToQuery($innerQuery, $primarySearchable, 'or');
            }

            // Search relation columns
            if ($joins) {
                foreach (array_unique($joins) as $join) {
                    // Apply a supplied search term for relation columns and constrain
                    // the query only if there is something to search for
                    $columnsToSearch = array_get($relationSearchable, $join, []);

                    if (count($columnsToSearch) > 0) {
                        $innerQuery->orWhereHas($join, function ($_query) use ($columnsToSearch) {
                            $this->applySearchToQuery($_query, $columnsToSearch);
                        });
                    }
                }
            }
        });

        // Custom select queries
        foreach ($this->getVisibleColumns() as $column) {
            if (!$column->sqlSelect) {
                continue;
            }

            $alias = $query->getQuery()->getGrammar()->wrap($column->columnName);

            // Relation column
            if ($column->relation) {
                // @todo Find a way...
                $relationType = $this->model->getRelationType($column->relation);
                if ($relationType === 'morphTo') {
                    throw new ApplicationException('The relationship morphTo is not supported for list columns.');
                }

                $table = $this->model->makeRelation($column->relation)->getTable();
                $sqlSelect = $this->parseTableName($column->sqlSelect, $table);

                // Manipulate a count query for the sub query
                $relationObj = $this->model->{$column->relation}();
                $relationQuery = $relationObj->getRelated()->newQuery();

                // Apply related constraints to the sub query
                // Possibility: the column could contribute to this via conditions or scope
                $relationObj->addDefinedConstraintsToQuery($relationQuery);

                $countQuery = $relationObj->getRelationExistenceQuery($relationQuery, $query);

                $joinSql = $this->isColumnRelated($column, true)
                    ? DbDongle::raw("group_concat(" . $sqlSelect . " separator ', ')")
                    : DbDongle::raw($sqlSelect);

                $joinSql = $countQuery->select($joinSql)->reorder()->toSql();

                $selects[] = Db::raw('('.$joinSql.') as '.$alias);

                // If a polymorphic relation, bindings need to be added to the query
                $bindings = array_merge($bindings, $countQuery->getBindings());
            }
            // Primary column
            else {
                $sqlSelect = $this->parseTableName($column->sqlSelect, $primaryTable);
                $selects[] = DbDongle::raw($sqlSelect . ' as '. $alias);
            }
        }

        // Apply sorting
        if (
            $this->useSorting() &&
            ($sortColumn = $this->getSortColumn()) &&
            $this->isColumnSortable($sortColumn) &&
            ($column = $this->allColumns[$sortColumn] ?? null)
        ) {
            if ($column->useRelationCount()) {
                $sortColumn = $column->relation . '_count';
            }
            elseif ($column->valueFrom) {
                $sortColumn = $this->isColumnPivot($column)
                    ? 'pivot_' . $column->valueFrom
                    : $column->valueFrom;
            }

            $sortDirection = $this->getSortDirection();
            $query->reorder($sortColumn, $sortDirection);

            /**
             * @event backend.list.extendSortColumn
             * Provides an opportunity to customize the sort column and direction
             *
             * Example usage:
             *
             *     Event::listen('backend.list.extendSortColumn', function ($listWidget, $query, $sortColumn, $sortDirection) {
             *         $query->reorder('secondary_order', 'asc);
             *         $query->orderBy($sortColumn, $sortDirection);
             *     });
             *
             * Or
             *
             *     $listWidget->bindEvent('list.extendSortColumn', function ($query, $sortColumn, $sortDirection) {
             *         $query->orderBy('secondary_order');
             *     });
             *
             */
            $this->fireSystemEvent('backend.list.extendSortColumn', [$query, $sortColumn, $sortDirection]);
        }

        // Apply filters
        foreach ($this->filterCallbacks as $callback) {
            $callback($query);
        }

        // Add custom selects
        $query->addSelect($selects);

        // Add bindings for polymorphic relations
        $query->addBinding($bindings, 'select');

        /**
         * @event backend.list.extendQuery
         * Provides an opportunity to modify and / or return the `$query` object after the List widget has applied its scopes to it and before it's used to get the records.
         *
         * Example usage:
         *
         *     Event::listen('backend.list.extendQuery', function ($listWidget, $query) {
         *         $newQuery = MyModel::newQuery();
         *         return $newQuery;
         *     });
         *
         * Or
         *
         *     $listWidget->bindEvent('list.extendQuery', function ($query) {
         *         $query->whereNull('deleted_at');
         *     });
         *
         */
        if ($event = $this->fireSystemEvent('backend.list.extendQuery', [&$query])) {
            return $event;
        }

        return $query;
    }

    /**
     * getRecords returns all the records from the supplied model, after filtering.
     * @return Collection
     */
    protected function getRecords()
    {
        $query = $this->prepareQuery();

        if ($this->showPagination) {
            $method = $this->showPageNumbers ? 'paginateAtPage' : 'simplePaginateAtPage';
            $currentPageNumber = $this->getCurrentPageNumber($query);
            $records = $query->{$method}($this->recordsPerPage, $currentPageNumber);
        }
        else {
            $records = $query->get();
        }

        /**
         * @event backend.list.extendRecords
         * Provides an opportunity to modify and / or return the `$records` Collection object before the widget uses it.
         *
         * Example usage:
         *
         *     Event::listen('backend.list.extendRecords', function ($listWidget, $records) {
         *         $model = MyModel::where('always_include', true)->first();
         *         $records->prepend($model);
         *     });
         *
         * Or
         *
         *     $listWidget->bindEvent('list.extendRecords', function ($records) {
         *         $model = MyModel::where('always_include', true)->first();
         *         $records->prepend($model);
         *     });
         *
         */
        if ($event = $this->fireSystemEvent('backend.list.extendRecords', [&$records])) {
            $records = $event;
        }

        return $this->records = $records;
    }

    /**
     * getCurrentPageNumber returns the current page number for the list. This will override
     * the current page number provided by the user if it is past the last page of available
     * records.
     * @param object $query
     * @return int
     */
    protected function getCurrentPageNumber($query)
    {
        $currentPageNumber = $this->currentPageNumber;
        if (empty($currentPageNumber)) {
            $currentPageNumber = input($this->customPageName);
        }

        // Convert empty page number to page 1
        $currentPageNumber = $currentPageNumber ? intval($currentPageNumber) : 1;

        // Validate the page number
        if ($currentPageNumber > 1) {
            $baseQuery = $query instanceof QueryBuilder ? $query : $query->toBase();
            $count = $baseQuery->getCountForPagination();

            // If the current page number is higher than the amount of
            // available pages, go to the last available page
            if ($count <= (($currentPageNumber - 1) * $this->recordsPerPage)) {
                $currentPageNumber = ceil($count / $this->recordsPerPage);
            }
        }

        return $currentPageNumber;
    }

    /**
     * hasRecordAction will specify is anything is clickable
     */
    public function hasRecordAction(): bool
    {
        return isset($this->recordOnClick) || isset($this->recordUrl);
    }

    /**
     * getRecordAction
     */
    public function getRecordAction($record): ?array
    {
        if (!$this->hasRecordAction()) {
            return null;
        }

        $url = $this->getRecordUrl($record);
        $onClick = $this->getRecordOnClick($record, true);

        /**
         * @event backend.list.overrideRecordAction
         * Overrides the record url or onclick event in a list widget.
         *
         * If a value is returned from this event, it will be used as the url for the provided record.
         * $url contains the default url and $record is a reference to the model instance.
         * Example usage:
         *
         *     Event::listen('backend.list.overrideRecordAction', function ($listWidget, $record, $url, $onClick) {
         *         if ($record->user_id !== BackendAuth::getUser()->id) {
         *             return 'acme/blog/posts/preview/' . $record->id;
         *         }
         *     });
         *
         * Or
         *
         *     $listWidget->bindEvent('list.overrideRecordAction', function ($record, $url, $onClick) {
         *         if ($record->user_id !== BackendAuth::getUser()->id) {
         *             return 'acme/blog/posts/preview/' . $record->id;
         *         }
         *     });
         *
         */
        if ($event = $this->fireSystemEvent('backend.list.overrideRecordAction', [$record, $url, $onClick])) {
            if (is_array($event)) {
                // Override onclick event
                if (array_key_exists('onclick', $event)) {
                    if ($event['onclick'] === null) {
                        $onClick = null;
                    }
                    else {
                        $onClick = $event['onclick'];
                    }
                }

                // Override URL
                if (array_key_exists('url', $event)) {
                    if ($event['url'] === null) {
                        $url = 'javascript:;';
                    }
                    else {
                        $url = Backend::url($event['url']);
                    }
                }

                // Override clickable entirely
                if (array_key_exists('clickable', $event) && $event['clickable'] === false) {
                    return null;
                }
            }
            elseif (is_string($event)) {
                $url = Backend::url($event);
            }
        }

        return [
            $url,
            $onClick ? Html::attributes(['onclick' => $onClick]) : null
        ];
    }

    /**
     * getRecordUrl returns the record URL address for a list row.
     * @param  Model $record
     * @return string
     */
    public function getRecordUrl($record)
    {
        if (isset($this->recordOnClick)) {
            return 'javascript:;';
        }

        if (!isset($this->recordUrl)) {
            return null;
        }

        if ($this->pivotMode) {
            $url = RouterHelper::replaceParameters($record->pivot, $this->recordUrl);
        }

        $url = RouterHelper::replaceParameters($record, $this->recordUrl);

        return Backend::url($url);
    }

    /**
     * getRecordOnClick returns the onclick event for a list row.
     * @param  Model $record
     * @return string
     */
    public function getRecordOnClick($record, $isRaw = false)
    {
        if (!isset($this->recordOnClick)) {
            return null;
        }

        $recordOnClick = $this->recordOnClick;

        // FormController popup design integration
        if (str_starts_with($recordOnClick, 'popup') && $this->controller->isClassExtendedWith(\Backend\Behaviors\FormController::class)) {
            if (str_contains($recordOnClick, '@')) {
                $recordOnClickContext = explode('@', $recordOnClick)[1];
                $recordOnClick = "oc.listOnLoadForm(':id', '{$recordOnClickContext}')";
            }
            else {
                $recordOnClick = "oc.listOnLoadForm(':id')";
            }
        }

        if ($this->pivotMode) {
            $recordOnClick = RouterHelper::replaceParameters($record->pivot, $recordOnClick);
        }

        $recordOnClick = RouterHelper::replaceParameters($record, $recordOnClick);

        // @deprecated this method will always return isRaw = true
        return $isRaw ? $recordOnClick : Html::attributes(['onclick' => $recordOnClick]);
    }

    /**
     * getColumns gets all the registered columns for the instance.
     * @return array
     */
    public function getColumns()
    {
        return $this->allColumns ?: $this->defineListColumns();
    }

    /**
     * getColumn gets a specified column object
     * @param  string $column
     * @return mixed
     */
    public function getColumn($column)
    {
        if (!isset($this->allColumns[$column])) {
            throw new ApplicationException('No definition for column ' . $column);
        }

        return $this->allColumns[$column];
    }

    /**
     * isColumnSortable checks if column can be sorted, excluding calculated non visible columns
     */
    protected function isColumnSortable(string $columnName): bool
    {
        if ($this->isColumnVisible($columnName)) {
            return true;
        }

        $column = array_get($this->allColumns, $columnName);
        if (!$column) {
            return false;
        }

        if ($column->sqlSelect || $column->relation) {
            return false;
        }

        return true;
    }

    /**
     * isColumnVisible checks if a column is visible to the list
     */
    public function isColumnVisible(string $columnName): bool
    {
        $columns = $this->visibleColumns ?: $this->getVisibleColumns();

        return isset($columns[$columnName]);
    }

    /**
     * getVisibleColumns returns the list columns that are visible by list settings or default
     */
    public function getVisibleColumns()
    {
        $definitions = $this->defineListColumns();
        $columns = [];

        // Supplied column list
        if ($this->showSetup && $this->columnOverride === null) {
            $this->columnOverride = $this->getUserPreference('visible', null);
        }

        if ($this->columnOverride && is_array($this->columnOverride)) {
            $invalidColumns = array_diff($this->columnOverride, array_keys($definitions));
            if (!count($definitions)) {
                throw new ApplicationException(Lang::get(
                    'backend::lang.list.missing_column',
                    ['columns'=>implode(',', $invalidColumns)]
                ));
            }

            $availableColumns = array_intersect($this->columnOverride, array_keys($definitions));
            foreach ($availableColumns as $columnName) {
                $definitions[$columnName]->invisible = false;
                $columns[$columnName] = $definitions[$columnName];
            }
        }
        // Use default column list
        else {
            foreach ($definitions as $columnName => $column) {
                if ($column->invisible) {
                    continue;
                }

                $columns[$columnName] = $definitions[$columnName];
            }
        }

        return $this->visibleColumns = $columns;
    }

    /**
     * defineListColumns builds an array of list columns with keys as the column name
     * and values as a ListColumn object
     */
    protected function defineListColumns(): array
    {
        if (!isset($this->columns) || !is_array($this->columns)) {
            $this->columns = [];
        }

        if ($this->columns) {
            $this->addColumns($this->columns);
        }
        else {
            $this->addColumnsFromModel();
        }

        if (!$this->allColumns) {
            $class = get_class($this->model instanceof Model ? $this->model : $this->controller);
            throw new ApplicationException(Lang::get('backend::lang.list.missing_columns', compact('class')));
        }

        /**
         * @event backend.list.extendColumns
         * Provides an opportunity to modify the columns of a List widget
         *
         * Example usage:
         *
         *     Event::listen('backend.list.extendColumns', function ($listWidget) {
         *         // Only for the User controller
         *         if (!$listWidget->getController() instanceof \Backend\Controllers\Users) {
         *             return;
         *         }
         *
         *         // Only for the User model
         *         if (!$listWidget->model instanceof \Backend\Models\User) {
         *             return;
         *         }
         *
         *         // Add an extra birthday column
         *         $listWidget->addColumns([
         *             'birthday' => [
         *                 'label' => 'Birthday'
         *             ]
         *         ]);
         *
         *         // Remove a Surname column
         *         $listWidget->removeColumn('surname');
         *     });
         *
         * Or
         *
         *     $listWidget->bindEvent('list.extendColumns', function () use ($listWidget) {
         *         // Only for the User controller
         *         if (!$listWidget->getController() instanceof \Backend\Controllers\Users) {
         *             return;
         *         }
         *
         *         // Only for the User model
         *         if (!$listWidget->model instanceof \Backend\Models\User) {
         *             return;
         *         }
         *
         *         // Add an extra birthday column
         *         $listWidget->addColumns([
         *             'birthday' => [
         *                 'label' => 'Birthday'
         *             ]
         *         ]);
         *
         *         // Remove a Surname column
         *         $listWidget->removeColumn('surname');
         *     });
         *
         */
        $this->fireSystemEvent('backend.list.extendColumns');

        $this->processPermissionCheck($this->allColumns);
        $this->processAutoOrder($this->allColumns);
        $this->processHiddenColumns($this->allColumns);
        $this->processUserColumnOrders($this->allColumns, $this->getUserPreference('order'));
        $this->processColumnTypeModifiers($this->allColumns);

        return $this->allColumns;
    }

    /**
     * addColumns programmatically add columns, used internally and for extensibility.
     * @param array $columns Column definitions
     */
    public function addColumns(array $columns)
    {
        foreach ($columns as $columnName => $config) {
            $this->allColumns[$columnName] = $this->makeListColumn($columnName, $config);
        }
    }

    /**
     * removeColumn programmatically removes a column, used for extensibility.
     * @param string $column Column name
     */
    public function removeColumn($columnName)
    {
        if (isset($this->allColumns[$columnName])) {
            unset($this->allColumns[$columnName]);
        }
    }

    /**
     * getModel returns the active model for this list.
     * @return \Model|null
     */
    public function getModel()
    {
        return $this->model;
    }

    /**
     * makeListColumn creates a list column object from it's name and configuration.
     */
    protected function makeListColumn($name, $config)
    {
        if (is_string($config)) {
            $label = $config;
            $config = [];
        }
        elseif (isset($config['label'])) {
            $label = $config['label'];
        }
        else {
            $label = studly_case($name);
        }

        // Auto configure pivot relation
        if (str_starts_with($name, 'pivot[') && str_contains($name, ']')) {
            $_name = HtmlHelper::nameToArray($name);
            $relationName = array_shift($_name);
            $valueFrom = array_shift($_name);

            if (count($_name) > 0) {
                $valueFrom  .= '['.implode('][', $_name).']';
            }

            $config['relation'] = $relationName;
            $config['valueFrom'] = $valueFrom;
            $config['searchable'] = false;
        }
        // Auto configure standard relation
        elseif (str_contains($name, '[') && str_contains($name, ']')) {
            $config['valueFrom'] = $name;
            $config['sortable'] = false;
            $config['searchable'] = false;
        }

        $columnType = $config['type'] ?? null;

        $column = new ListColumn([
            'columnName' => $name,
            'label' => $label
        ]);

        if ($config) {
            $column->useConfig($config);
        }

        if ($columnType) {
            $column->displayAs($columnType);
        }

        return $column;
    }

    /**
     * getTotalColumns calculates the total columns used in the list, including
     * checkboxes and other additions.
     */
    protected function getTotalColumns()
    {
        $columns = $this->visibleColumns ?: $this->getVisibleColumns();
        $total = count($columns);

        if ($this->showCheckboxes) {
            $total++;
        }

        return $total;
    }

    /**
     * getHeaderValue looks up the column header
     */
    public function getHeaderValue($column)
    {
        if ($column->shortLabel !== null) {
            $value = Lang::get($column->shortLabel);
        }
        else {
            $value = Lang::get($column->label);
        }

        /**
         * @event backend.list.overrideHeaderValue
         * Overrides the column header value in a list widget.
         *
         * If a value is returned from this event, it will be used as the value for the provided column.
         * `$value` is passed by reference so modifying the variable in place is also supported. Example usage:
         *
         *     Event::listen('backend.list.overrideHeaderValue', function ($listWidget, $column, &$value) {
         *         $value .= '-modified';
         *     });
         *
         * Or
         *
         *     $listWidget->bindEvent('list.overrideHeaderValue', function ($column, $value) {
         *         return 'Custom header value';
         *     });
         *
         */
        if ($response = $this->fireSystemEvent('backend.list.overrideHeaderValue', [$column, &$value])) {
            $value = $response;
        }

        return $value;
    }

    /**
     * getHeaderTooltipValue looks up the column header
     * @return string
     */
    public function getHeaderTooltipValue($column)
    {
        return Lang::get($column->tooltip['title'] ?? $column->tooltip);
    }

    /**
     * getColumnValueRaw returns a raw column value
     * @return string
     */
    public function getColumnValueRaw($record, $column)
    {
        $columnName = $column->columnName;

        // Handle taking value from model relation.
        if ($column->valueFrom && $column->relation) {
            $columnName = $column->relation;

            if (!array_key_exists($columnName, $record->getRelations())) {
                $value = null;
            }
            elseif ($this->isColumnRelated($column, true)) {
                $value = $record->{$columnName}->pluck($column->valueFrom)->all();
            }
            elseif ($this->isColumnRelated($column) || $this->isColumnPivot($column)) {
                $value = $record->{$columnName}
                    ? $column->getValueFromData($record->{$columnName})
                    : null;
            }
            else {
                $value = null;
            }
        }
        // Handle taking value from model attribute.
        elseif ($column->valueFrom) {
            $value = $column->getValueFromData($record);
        }
        // Otherwise, if the column is a relation, it will be a custom select,
        // so prevent the Model from attempting to load the relation
        // if the value is NULL.
        else {
            if (
                $record->hasRelation($columnName) &&
                array_key_exists($columnName, $record->attributes)
            ) {
                $value = $record->attributes[$columnName];
            }
            elseif ($column->useRelationCount()) {
                $countColumnName = Str::snake($column->relation) . '_count';
                $value = $record->{$countColumnName};
            }
            else {
                $value = $record->{$columnName};
            }
        }

        /**
         * @event backend.list.overrideColumnValueRaw
         * Overrides the raw column value in a list widget.
         *
         * If a value is returned from this event, it will be used as the raw value for the provided column.
         * `$value` is passed by reference so modifying the variable in place is also supported. Example usage:
         *
         *     Event::listen('backend.list.overrideColumnValueRaw', function ($listWidget, $record, $column, &$value) {
         *         $value .= '-modified';
         *     });
         *
         * Or
         *
         *     $listWidget->bindEvent('list.overrideColumnValueRaw', function ($record, $column, $value) {
         *         return 'No values for you!';
         *     });
         *
         */
        if ($response = $this->fireSystemEvent('backend.list.overrideColumnValueRaw', [$record, $column, &$value])) {
            $value = $response;
        }

        return $value;
    }

    /**
     * getColumnKey returns a column key/identifier
     */
    public function getColumnKey($record)
    {
        if ($this->pivotMode) {
            return $record->pivot->getKey();
        }

        return $record->getKey();
    }

    /**
     * getColumnValue returns a column value, with filters applied
     */
    public function getColumnValue($record, $column)
    {
        // Custom display attribute that pulls directly from the model
        if ($column->displayFrom) {
            $columnName = $column->displayFrom;
            $value = $record->{$columnName};
        }
        // Standard value
        else {
            $value = $this->getColumnValueRaw($record, $column);
        }

        // Cast enums to scalar
        if ($value instanceof UnitEnum) {
            $value = $value->value;
        }

        // Apply filters
        if (method_exists($this, 'eval'. studly_case($column->type) .'TypeValue')) {
            $value = $this->{'eval'. studly_case($column->type) .'TypeValue'}($record, $column, $value);
        }
        else {
            $value = $this->evalCustomListType($column->type, $record, $column, $value);
        }

        // Apply default value.
        if ($value === '' || $value === null) {
            $value = $column->defaults;
        }

        /**
         * @event backend.list.overrideColumnValue
         * Overrides the column value in a list widget.
         *
         * If a value is returned from this event, it will be used as the value for the provided column.
         * `$value` is passed by reference so modifying the variable in place is also supported. Example usage:
         *
         *     Event::listen('backend.list.overrideColumnValue', function ($listWidget, $record, $column, &$value) {
         *         $value .= '-modified';
         *     });
         *
         * Or
         *
         *     $listWidget->bindEvent('list.overrideColumnValue', function ($record, $column, $value) {
         *         return 'No values for you!';
         *     });
         *
         */
        if ($response = $this->fireSystemEvent('backend.list.overrideColumnValue', [$record, $column, &$value])) {
            $value = $response;
        }

        return $value;
    }

    /**
     * getCheckedRows
     */
    protected function getCheckedRows(): array
    {
        return array_unique((array) post('allChecked'));
    }

    /**
     * getCheckedRowsEncoded
     */
    protected function getCheckedRowsEncoded(): string
    {
        try {
            return json_encode(array_values($this->getCheckedRows()));
        }
        catch (Exception $ex) {
            return '';
        }
    }

    /**
     * isRowChecked
     */
    protected function isRowChecked($record): bool
    {
        return in_array($record->getKey(), $this->getCheckedRows());
    }

    /**
     * getAllCheckedIds returns all checked IDs, including those not visible on the page,
     * stored in the list data locker from switching pagination.
     */
    public function getAllCheckedIds(): array
    {
        $checkedIds = (array) post('checked');

        if ($allChecked = post('checked-all')) {
            $checkedIds = array_merge((array) json_decode($allChecked, true), $checkedIds);
        }

        return array_filter($checkedIds, 'is_scalar');
    }

    /**
     * getRowClass adds a custom CSS class string to a record row
     * @param  Model $record Populated model
     * @return string
     */
    public function getRowClass($record)
    {
        $value = '';

        /**
         * @event backend.list.injectRowClass
         * Provides opportunity to inject a custom CSS row class
         *
         * If a value is returned from this event, it will be used as the value for the row class.
         * `$value` is passed by reference so modifying the variable in place is also supported. Example usage:
         *
         *     Event::listen('backend.list.injectRowClass', function ($listWidget, $record, &$value) {
         *         $value .= '-modified';
         *     });
         *
         * Or
         *
         *     $listWidget->bindEvent('list.injectRowClass', function ($record, $value) {
         *         return 'strike';
         *     });
         *
         */
        if ($response = $this->fireSystemEvent('backend.list.injectRowClass', [$record, &$value])) {
            $value = $response;
        }

        return $value;
    }

    /**
     * getColumnTimezonePreference for date specific columns
     */
    protected function getColumnTimezonePreference($column, $default = true): bool
    {
        // @deprecated API
        if (!empty($column->config['ignoreTimezone'])) {
            return false;
        }

        return (bool) $column->getConfig('useTimezone', $default);
    }

    //
    // Value processing
    //

    /**
     * evalCustomListType processes a custom list types registered by plugins and the app.
     */
    protected function evalCustomListType($type, $record, $column, $value)
    {
        // Load plugin and app column types
        $methodValues = PluginManager::instance()->getRegistrationMethodValues('registerListColumnTypes');
        foreach ($methodValues as $availableTypes) {
            if (!isset($availableTypes[$type])) {
                continue;
            }

            $callback = $availableTypes[$type];

            if (is_callable($callback)) {
                return call_user_func_array($callback, [$value, $column, $record]);
            }
        }

        $customMessage = '';
        if ($type === 'relation') {
            $customMessage = 'Type: relation is not supported, instead use the relation property to specify a relationship to pull the value from and set the type to the type of the value expected.';
        }

        throw new ApplicationException(sprintf('List column type "%s" could not be found. %s', $type, $customMessage));
    }

    /**
     * evalTextTypeValue as text and escape the value
     * @return string
     */
    protected function evalTextTypeValue($record, $column, $value)
    {
        if (is_array($value) && count($value) === count($value, COUNT_RECURSIVE)) {
            $value = implode(', ', $value);
        }

        if (is_string($column->format) && !empty($column->format)) {
            $value = sprintf($column->format, $value);
        }

        return htmlentities((string) $value, ENT_QUOTES, 'UTF-8', false);
    }

    /**
     * evalNumberTypeValue process as number, proxy to text but uses different styling
     * @return string
     */
    protected function evalNumberTypeValue($record, $column, $value)
    {
        return $this->evalTextTypeValue($record, $column, $value);
    }

    /**
     * evalImageTypeValue will process an image value
     * @return string
     */
    protected function evalImageTypeValue($record, $column, $value)
    {
        $config = $column->config;
        $width = isset($config['width']) ? $config['width'] : 68;
        $height = isset($config['height']) ? $config['height'] : 68;
        $limit = isset($config['limit']) ? $config['limit'] : 3;
        $options = isset($config['options']) ? $config['options'] : [];
        $isDefaultSize = !isset($config['width']) && !isset($config['height']);

        $colName = $column->columnName;
        $images = [];

        // File model
        if (isset($record->attachMany[$colName])) {
            $images = $value->count() ? $value->all() : [];
        }
        elseif (isset($record->attachOne[$colName])) {
            $images = $value ? [$value] : [];
        }
        // Media item
        else {
            foreach ((array) $value as $val) {
                if (is_array($val)) {
                    return '';
                }
                if (strpos($val, '://') !== false) {
                    $images[] = $val;
                }
                elseif (strlen($val)) {
                    $images[] = \Media\Classes\MediaLibrary::url($val);
                }
            }
        }

        if (!$images) {
            return '';
        }

        $totalImages = count($images);
        $images = array_slice($images, 0, $limit);

        $imageUrls = [];
        foreach ($images as $image) {
            $imageUrls[] = \System\Classes\ResizeImages::resize($image, $width, $height, $options);
        }

        return $this->makePartial('column_image', [
            'totalImages' => $totalImages,
            'imageUrls' => $imageUrls,
            'isDefaultSize' => $isDefaultSize,
            'width' => $width,
            'height' => $height
        ]);
    }

    /**
     * evalSwitchTypeValue as boolean switch
     */
    protected function evalSwitchTypeValue($record, $column, $value)
    {
        $config = $column->config;

        return $this->makePartial('column_switch', [
            'column' => $column,
            'value' => $value,
            'trueValue' => Lang::get($config['options'][1] ?? 'backend::lang.list.column_switch_true'),
            'falseValue' => Lang::get($config['options'][0] ?? 'backend::lang.list.column_switch_false'),
        ]);
    }

    /**
     * evalSummaryTypeValue will limit a value by words
     */
    protected function evalSummaryTypeValue($record, $column, $value)
    {
        $config = $column->config;
        $endChars = isset($config['endChars']) ? $config['endChars'] : '...';
        $limitChars = isset($config['limitChars']) ? $config['limitChars'] : 40;
        $limitWords = isset($config['limitWords']) ? $config['limitWords'] : null;

        // Collapse spacing for inline nodes that will get stripped
        // "Welcome <img />, User" should read "Welcome, User"
        $result = $value;
        $result = str_replace(' <', '<', $result);

        // Add natural spacing between HTML nodes
        $result = str_replace("><", '> <', $result);

        // Strip HTML
        $result = $original = trim(Html::strip($result));

        // Nothing left
        if (!strlen($result)) {
            return $result;
        }

        // Limit by chars and estimate word count
        if (!$limitWords) {
            $result = Str::limit($result, $limitChars, '');
            $limitWords = substr_count($result, ' ') + 1;
        }

        // Strip HTML, limit to words
        $result = Str::words($result, $limitWords, '');

        // Add end suffix where original differs
        if (mb_strlen($result) !== mb_strlen($original)) {
            $result .= $endChars;
        }

        return $result;
    }

    /**
     * evalDatetimeTypeValue as a datetime value
     */
    protected function evalDatetimeTypeValue($record, $column, $value)
    {
        if ($value === null) {
            return null;
        }

        $dateTime = $this->validateDateTimeValue($value, $column);

        if ($column->format !== null) {
            $value = $dateTime->format($column->format);
        }
        else {
            $value = $dateTime->toDayDateTimeString();
        }

        $options = [
            'column' => $column,
            'defaultValue' => $value,
            'format' => $column->format,
            'formatAlias' => 'dateTimeLongMin',
            'useTimezone' => $this->getColumnTimezonePreference($column),
        ];

        return Backend::dateTime($dateTime, $options);
    }

    /**
     * evalTimeTypeValue as a time value
     */
    protected function evalTimeTypeValue($record, $column, $value)
    {
        if ($value === null) {
            return null;
        }

        $dateTime = $this->validateDateTimeValue($value, $column);

        $format = $column->format ?? 'g:i A';

        $value = $dateTime->format($format);

        $options = [
            'column' => $column,
            'defaultValue' => $value,
            'format' => $column->format,
            'formatAlias' => 'time',
            'useTimezone' => $this->getColumnTimezonePreference($column, false),
        ];

        return Backend::dateTime($dateTime, $options);
    }

    /**
     * evalDateTypeValue as a date value
     */
    protected function evalDateTypeValue($record, $column, $value)
    {
        if ($value === null) {
            return null;
        }

        $dateTime = $this->validateDateTimeValue($value, $column);

        if ($column->format !== null) {
            $value = $dateTime->format($column->format);
        }
        else {
            $value = $dateTime->toFormattedDateString();
        }

        $options = [
            'column' => $column,
            'defaultValue' => $value,
            'format' => $column->format,
            'formatAlias' => 'dateLongMin',
            'useTimezone' => $this->getColumnTimezonePreference($column, false),
        ];

        return Backend::dateTime($dateTime, $options);
    }

    /**
     * evalTimesinceTypeValue as diff for humans (1 min ago)
     */
    protected function evalTimesinceTypeValue($record, $column, $value)
    {
        if ($value === null) {
            return null;
        }

        $dateTime = $this->validateDateTimeValue($value, $column);

        $value = DateTimeHelper::timeSince($dateTime);

        $options = [
            'column' => $column,
            'defaultValue' => $value,
            'timeSince' => true,
            'useTimezone' => $this->getColumnTimezonePreference($column),
        ];

        return Backend::dateTime($dateTime, $options);
    }

    /**
     * evalTimetenseTypeValue as time as current tense (Today at 0:00)
     */
    protected function evalTimetenseTypeValue($record, $column, $value)
    {
        if ($value === null) {
            return null;
        }

        $dateTime = $this->validateDateTimeValue($value, $column);

        $value = DateTimeHelper::timeTense($dateTime);

        $options = [
            'column' => $column,
            'defaultValue' => $value,
            'timeTense' => true,
            'useTimezone' => $this->getColumnTimezonePreference($column),
        ];

        return Backend::dateTime($dateTime, $options);
    }

    /**
     * evalSelectableTypeValue processes as selectable value types for 'dropdown',
     * 'radio', 'balloon-selector' and similar form field types
     */
    protected function evalSelectableTypeValue($record, $column, $value)
    {
        $formField = new \Backend\Classes\FormField([
            'fieldName' => $column->columnName,
            'label' => $column->label
        ]);

        $fieldOptions = $column->optionsPreset
            ? 'preset:' . $column->optionsPreset
            : ($column->optionsMethod ?: $column->options);

        if (!is_array($fieldOptions)) {
            $model = $this->isColumnRelated($column)
                ? $this->model->makeRelation($column->relation)
                : $this->model;

            $fieldOptions = $formField->getOptionsFromModel(
                $model,
                $fieldOptions,
                $record->toArray()
            );
        }

        return $this->makePartial('column_selectable', [
            'fieldOptions' => $fieldOptions,
            'column' => $column,
            'value' => $value
        ]);
    }

    /**
     * evalLinkageTypeValue
     */
    protected function evalLinkageTypeValue($record, $column, $value)
    {
        if (!$value && $column->linkUrl) {
            $linkUrl = RouterHelper::replaceParameters($record, $column->linkUrl);
            if (!starts_with($linkUrl, ['//', 'http://', 'https://'])) {
                $linkUrl = Backend::url($linkUrl);
            }
            $value = $linkUrl;
        }

        if (is_array($value) && count($value) === 2) {
            $linkUrl = $value[0];
            $linkText = $value[1];
        }
        else {
            $linkText = $linkUrl = $value;
        }

        if ($column->linkText) {
            $linkText = $column->linkText;
        }

        if (str_starts_with($linkUrl, 'october://')) {
            $isDefault = $linkUrl === $linkText;
            $linkUrl = \Cms\Classes\PageManager::url($linkUrl);
            if (!$linkUrl) {
                $value = null;
            }
            elseif ($isDefault) {
                $linkText = Url::makeRelative($linkUrl);
            }
        }

        return $this->makePartial('column_linkage', [
            'attributes' => (array) $column->attributes,
            'linkText' => $linkText,
            'linkUrl' => $linkUrl,
            'column' => $column,
            'value' => $value
        ]);
    }

    /**
     * evalPartialTypeValue as partial reference
     */
    protected function evalPartialTypeValue($record, $column, $value)
    {
        return $this->makePartial('column_partial', [
            'record' => $record,
            'column' => $column,
            'value' => $value
        ]);
    }

    /**
     * evalColorPickerTypeValue as background color, to be seen at list
     */
    protected function evalColorPickerTypeValue($record, $column, $value)
    {
        return $this->makePartial('column_colorpicker', [
            'value' => $value
        ]);
    }

    /**
     * validateDateTimeValue column type
     */
    protected function validateDateTimeValue($value, $column)
    {
        $value = DateTimeHelper::makeCarbon($value, false);

        if (!$value instanceof Carbon) {
            throw new ApplicationException(Lang::get(
                'backend::lang.list.invalid_column_datetime',
                ['column' => $column->columnName]
            ));
        }

        return $value;
    }

    //
    // Filtering
    //

    /**
     * addFilter query to the stack.
     */
    public function addFilter(callable $filter)
    {
        $this->filterCallbacks[] = $filter;
    }

    //
    // Helpers
    //

    /**
     * isColumnRelated checks if column refers to a relation of the model, with a toggle
     * switch for checking only relationships with multiple records.
     */
    protected function isColumnRelated(ListColumn $column, bool $isMulti = false): bool
    {
        if (!$column->relation || $this->isColumnPivot($column)) {
            return false;
        }

        if (!$this->model->hasRelation($column->relation)) {
            throw new ApplicationException(Lang::get(
                'backend::lang.model.missing_relation',
                ['class'=>get_class($this->model), 'relation'=>$column->relation]
            ));
        }

        if ($isMulti) {
            return !$this->model->isRelationTypeSingular($column->relation);
        }

        return true;
    }

    /**
     * isColumnPivot checks if a column refers to a pivot model specifically.
     */
    protected function isColumnPivot(ListColumn $column): bool
    {
        if (!$column->relation || $column->relation !== 'pivot') {
            return false;
        }

        return true;
    }
}
