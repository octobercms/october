<?php namespace Backend\Widgets;

use Db;
use HTML as Html;
use App;
use Lang;
use Input;
use Event;
use Backend;
use DbDongle;
use Carbon\Carbon;
use October\Rain\Html\Helper as HtmlHelper;
use October\Rain\Router\Helper as RouterHelper;
use Backend\Classes\ListColumn;
use Backend\Classes\WidgetBase;
use ApplicationException;
use October\Rain\Database\Model;
use DateTime;

/**
 * List Widget
 * Used for building back end lists, renders a list of model objects
 *
 * @package october\backend
 * @author Alexey Bobkov, Samuel Georges
 */
class Lists extends WidgetBase
{
    //
    // Configurable properties
    //

    /**
     * @var array List column configuration.
     */
    public $columns;

    /**
     * @var Model List model object.
     */
    public $model;

    /**
     * @var string Link for each record row. Replace :id with the record id.
     */
    public $recordUrl;

    /**
     * @var string Click event for each record row. Replace :id with the record id.
     */
    public $recordOnClick;

    /**
     * @var string Message to display when there are no records in the list.
     */
    public $noRecordsMessage = 'No records found';

    /**
     * @var int Maximum rows to display for each page.
     */
    public $recordsPerPage;

    /**
     * @var bool Shows the sorting options for each column.
     */
    public $showSorting = true;

    /**
     * @var mixed A default sort column to look for.
     */
    public $defaultSort;

    /**
     * @var bool Display a checkbox next to each record row.
     */
    public $showCheckboxes = false;

    /**
     * @var bool Display the list set up used for column visibility and ordering.
     */
    public $showSetup = false;

    /**
     * @var bool Display parent/child relationships in the list.
     */
    public $showTree = false;

    /**
     * @var bool Expand the tree nodes by default.
     */
    public $treeExpanded = false;

    /**
     * @var bool|string Display pagination when limiting records per page.
     */
    public $showPagination = 'auto';

    //
    // Object properties
    //

    /**
     * {@inheritDoc}
     */
    protected $defaultAlias = 'list';

    /**
     * @var array Collection of all list columns used in this list.
     * @see Backend\Classes\ListColumn
     */
    protected $allColumns;

    /**
     * @var array Override default columns with supplied key names.
     */
    protected $columnOverride;

    /**
     * @var array Columns to display and their order.
     */
    protected $visibleColumns;

    /**
     * @var array Model data collection.
     */
    protected $records;

    /**
     * @var int Current page number.
     */
    protected $currentPageNumber;

    /**
     * @var string Filter the records by a search term.
     */
    protected $searchTerm;

    /**
     * @var array Collection of functions to apply to each list query.
     */
    protected $filterCallbacks = [];

    /**
     * @var array All sortable columns.
     */
    protected $sortableColumns;

    /**
     * @var string Sets the list sorting column.
     */
    protected $sortColumn;

    /**
     * @var string Sets the list sorting direction (asc, desc)
     */
    protected $sortDirection;

    /**
     * @var array List of CSS classes to apply to the list container element
     */
    public $cssClasses = [];

    /**
     * Initialize the widget, called by the constructor and free from its parameters.
     */
    public function init()
    {
        $this->fillFromConfig([
            'columns',
            'model',
            'recordUrl',
            'recordOnClick',
            'noRecordsMessage',
            'recordsPerPage',
            'showSorting',
            'defaultSort',
            'showCheckboxes',
            'showSetup',
            'showTree',
            'treeExpanded',
            'showPagination',
        ]);

        /*
         * Configure the list widget
         */
        $this->recordsPerPage = $this->getSession('per_page', $this->recordsPerPage);

        if ($this->showPagination == 'auto') {
            $this->showPagination = $this->recordsPerPage && $this->recordsPerPage > 0;
        }

        $this->validateModel();
        $this->validateTree();
    }

    /**
     * {@inheritDoc}
     */
    public function loadAssets()
    {
        $this->addJs('js/october.list.js', 'core');
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
     * Prepares the list data
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
        $this->vars['showSorting'] = $this->showSorting;
        $this->vars['sortColumn'] = $this->getSortColumn();
        $this->vars['sortDirection'] = $this->sortDirection;
        $this->vars['showTree'] = $this->showTree;
        $this->vars['treeLevel'] = 0;

        if ($this->showPagination) {
            $this->vars['recordTotal'] = $this->records->total();
            $this->vars['pageCurrent'] = $this->records->currentPage();
            $this->vars['pageLast'] = $this->records->lastPage();
            $this->vars['pageFrom'] = $this->records->firstItem();
            $this->vars['pageTo'] = $this->records->lastItem();
        }
        else {
            $this->vars['recordTotal'] = $this->records->count();
            $this->vars['pageCurrent'] = 1;
        }
    }

    /**
     * Event handler for refreshing the list.
     */
    public function onRefresh()
    {
        $this->prepareVars();
        return ['#'.$this->getId() => $this->makePartial('list')];
    }

    /**
     * Event handler for switching the page number.
     */
    public function onPaginate()
    {
        $this->currentPageNumber = post('page');
        return $this->onRefresh();
    }

    /**
     * Validate the supplied form model.
     * @return void
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
     * Replaces the @ symbol with a table name in a model
     * @param  string $sql
     * @param  string $table
     * @return string
     */
    protected function parseTableName($sql, $table)
    {
        return str_replace('@', $table.'.', $sql);
    }

    /**
     * Applies any filters to the model.
     */
    public function prepareModel()
    {
        $query = $this->model->newQuery();
        $primaryTable = $this->model->getTable();
        $selects = [$primaryTable.'.*'];
        $joins = [];
        $withs = [];

        /*
         * Extensibility
         */
        Event::fire('backend.list.extendQueryBefore', [$this, $query]);
        $this->fireEvent('list.extendQueryBefore', [$query]);

        /*
         * Prepare searchable column names
         */
        $primarySearchable = [];
        $relationSearchable = [];

        $columnsToSearch = [];
        if (!empty($this->searchTerm) && ($searchableColumns = $this->getSearchableColumns())) {
            foreach ($searchableColumns as $column) {
                /*
                 * Related
                 */
                if ($this->isColumnRelated($column)) {
                    $table = $this->model->makeRelation($column->relation)->getTable();
                    $columnName = isset($column->sqlSelect)
                        ? DbDongle::raw($this->parseTableName($column->sqlSelect, $table))
                        : $table . '.' . $column->valueFrom;

                    $relationSearchable[$column->relation][] = $columnName;
                }
                /*
                 * Primary
                 */
                else {
                    $columnName = isset($column->sqlSelect)
                        ? DbDongle::raw($this->parseTableName($column->sqlSelect, $primaryTable))
                        : $primaryTable . '.' . $column->columnName;

                    $primarySearchable[] = $columnName;
                }
            }
        }

        /*
         * Prepare related eager loads (withs) and custom selects (joins)
         */
        foreach ($this->getVisibleColumns() as $column) {

            if (!$this->isColumnRelated($column) || (!isset($column->sqlSelect) && !isset($column->valueFrom))) {
                continue;
            }

            if (isset($column->valueFrom)) {
                $withs[] = $column->relation;
            }

            $joins[] = $column->relation;
        }

        /*
         * Include any relation constraints
         */
        if ($joins) {
            foreach (array_unique($joins) as $join) {
                /*
                 * Apply a supplied search term for relation columns and
                 * constrain the query only if there is something to search for
                 */
                $columnsToSearch = array_get($relationSearchable, $join, []);

                if (count($columnsToSearch) > 0) {
                    $query->whereHas($join, function ($_query) use ($columnsToSearch) {
                        $_query->searchWhere($this->searchTerm, $columnsToSearch);
                    });
                }
            }
        }

        /*
         * Add eager loads to the query
         */
        if ($withs) {
            $query->with(array_unique($withs));
        }

        /*
         * Custom select queries
         */
        foreach ($this->getVisibleColumns() as $column) {
            if (!isset($column->sqlSelect)) {
                continue;
            }

            $alias = Db::getQueryGrammar()->wrap($column->columnName);

            /*
             * Relation column
             */
            if (isset($column->relation)) {
                $table =  $this->model->makeRelation($column->relation)->getTable();
                $relationType = $this->model->getRelationType($column->relation);
                $sqlSelect = $this->parseTableName($column->sqlSelect, $table);

                /*
                 * Manipulate a count query for the sub query
                 */
                $relationObj = $this->model->{$column->relation}();
                $countQuery = $relationObj->getRelationCountQuery($relationObj->getRelated()->newQuery(), $query);

                $joinSql = $this->isColumnRelated($column, true)
                    ? DbDongle::raw("group_concat(" . $sqlSelect . " separator ', ')")
                    : DbDongle::raw($sqlSelect);

                $joinSql = $countQuery->select($joinSql)->toSql();

                $selects[] = Db::raw("(".$joinSql.") as ".$alias);
            }
            /*
             * Primary column
             */
            else {
                $sqlSelect = $this->parseTableName($column->sqlSelect, $primaryTable);
                $selects[] = DbDongle::raw($sqlSelect . ' as '. $alias);
            }
        }

        /*
         * Apply a supplied search term for primary columns
         */
        if (count($primarySearchable) > 0) {
            $query->orWhere(function ($innerQuery) use ($primarySearchable) {
                $innerQuery->searchWhere($this->searchTerm, $primarySearchable);
            });
        }

        /*
         * Apply sorting
         */
        if ($sortColumn = $this->getSortColumn()) {
            if (($column = array_get($this->allColumns, $sortColumn)) && $column->valueFrom) {
                $sortColumn = $column->valueFrom;
            }

            $query->orderBy($sortColumn, $this->sortDirection);
        }

        /*
         * Apply filters
         */
        foreach ($this->filterCallbacks as $callback) {
            $callback($query);
        }

        /*
         * Add custom selects
         */
        $query->select($selects);

        /*
         * Extensibility
         */
        if (
            ($event = $this->fireEvent('list.extendQuery', [$query], true)) ||
            ($event = Event::fire('backend.list.extendQuery', [$this, $query], true))
        ) {
            return $event;
        }

        return $query;
    }

    /**
     * Returns all the records from the supplied model, after filtering.
     * @return Collection
     */
    protected function getRecords()
    {
        if ($this->showTree) {
            $records = $this->model->getAllRoot();
        }
        else {
            $model = $this->prepareModel();
            $records = ($this->showPagination)
                ? $model->paginate($this->recordsPerPage, $this->currentPageNumber)
                : $model->get();

        }

        return $this->records = $records;
    }

    /**
     * Returns the record URL address for a list row.
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

        $columns = array_keys($record->getAttributes());
        $url = RouterHelper::parseValues($record, $columns, $this->recordUrl);
        return Backend::url($url);
    }

    /**
     * Returns the onclick event for a list row.
     * @param  Model $record
     * @return string
     */
    public function getRecordOnClick($record)
    {
        if (!isset($this->recordOnClick)) {
            return null;
        }

        $columns = array_keys($record->getAttributes());
        $recordOnClick = RouterHelper::parseValues($record, $columns, $this->recordOnClick);
        return Html::attributes(['onclick' => $recordOnClick]);
    }

    /**
     * Get all the registered columns for the instance.
     * @return array
     */
    public function getColumns()
    {
        return $this->allColumns ?: $this->defineListColumns();
    }

    /**
     * Get a specified column object
     * @param  string $column
     * @return mixed
     */
    public function getColumn($column)
    {
        return $this->allColumns[$column];
    }

    /**
     * Returns the list columns that are visible by list settings or default
     */
    public function getVisibleColumns()
    {
        $definitions = $this->defineListColumns();
        $columns = [];

        /*
         * Supplied column list
         */
        if ($this->columnOverride === null) {
            $this->columnOverride = $this->getSession('visible', null);
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
        /*
         * Use default column list
         */
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
     * Builds an array of list columns with keys as the column name and values as a ListColumn object.
     */
    protected function defineListColumns()
    {
        if (!isset($this->columns) || !is_array($this->columns) || !count($this->columns)) {
            throw new ApplicationException(Lang::get(
                'backend::lang.list.missing_columns',
                ['class'=>get_class($this->controller)]
            ));
        }

        $this->addColumns($this->columns);

        /*
         * Extensibility
         */
        Event::fire('backend.list.extendColumns', [$this]);
        $this->fireEvent('list.extendColumns');

        /*
         * Use a supplied column order
         */
        if ($columnOrder = $this->getSession('order', null)) {
            $orderedDefinitions = [];
            foreach ($columnOrder as $column) {
                if (isset($this->allColumns[$column])) {
                    $orderedDefinitions[$column] = $this->allColumns[$column];
                }
            }

            $this->allColumns = array_merge($orderedDefinitions, $this->allColumns);
        }

        return $this->allColumns;
    }

    /**
     * Programatically add columns, used internally and for extensibility.
     */
    public function addColumns(array $columns)
    {
        /*
         * Build a final collection of list column objects
         */
        foreach ($columns as $columnName => $config) {
            $this->allColumns[$columnName] = $this->makeListColumn($columnName, $config);
        }
    }

    /**
     * Creates a list column object from it's name and configuration.
     */
    protected function makeListColumn($name, $config)
    {
        if (is_string($config)) {
            $label = $config;
        }
        elseif (isset($config['label'])) {
            $label = $config['label'];
        }
        else {
            $label = studly_case($name);
        }

        if (strpos($name, '[') !== false && strpos($name, ']') !== false) {
            $config['valueFrom'] = $name;
            $config['sortable'] = false;
            $config['searchable'] = false;
        }

        $columnType = isset($config['type']) ? $config['type'] : null;

        $column = new ListColumn($name, $label);
        $column->displayAs($columnType, $config);

        return $column;
    }

    /**
     * Calculates the total columns used in the list, including checkboxes
     * and other additions.
     */
    protected function getTotalColumns()
    {
        $columns = $this->visibleColumns ?: $this->getVisibleColumns();
        $total = count($columns);
        if ($this->showCheckboxes) {
            $total++;
        }
        if ($this->showSetup) {
            $total++;
        }
        return $total;
    }

    /**
     * Looks up the column header
     */
    public function getHeaderValue($column)
    {
        $value = Lang::get($column->label);

        /*
         * Extensibility
         */
        if ($response = Event::fire('backend.list.overrideHeaderValue', [$this, $column, $value], true)) {
            $value = $response;
        }

        if ($response = $this->fireEvent('list.overrideHeaderValue', [$column, $value], true)) {
            $value = $response;
        }

        return $value;
    }

    /**
     * Looks up the column value
     */
    public function getColumnValue($record, $column)
    {
        $columnName = $column->columnName;

        /*
         * Handle taking value from model relation.
         */
        if ($column->valueFrom && $column->relation) {
            $columnName = $column->relation;

            if (!array_key_exists($columnName, $record->getRelations())) {
                $value = null;
            }
            elseif ($this->isColumnRelated($column, true)) {
                $value = implode(', ', $record->{$columnName}->lists($column->valueFrom));
            }
            elseif ($this->isColumnRelated($column)) {
                $value = $record->{$columnName}->{$column->valueFrom};
            }
            else {
                $value = null;
            }
        }
        /*
         * Handle taking value from model attribute.
         */
        elseif ($column->valueFrom) {
            $keyParts = HtmlHelper::nameToArray($column->valueFrom);
            $value = $record;
            foreach ($keyParts as $key) {
                $value = $value->{$key};
            }
        }
        /*
         * Otherwise, if the column is a relation, it will be a custom select,
         * so prevent the Model from attempting to load the relation
         * if the value is NULL.
         */
        else {
            if ($record->hasRelation($columnName) && array_key_exists($columnName, $record->attributes)) {
                $value = $record->attributes[$columnName];
            }
            else {
                $value = $record->{$columnName};
            }
        }

        if (method_exists($this, 'eval'. studly_case($column->type) .'TypeValue')) {
            $value = $this->{'eval'. studly_case($column->type) .'TypeValue'}($record, $column, $value);
        }

        /*
         * Extensibility
         */
        if (($response = Event::fire('backend.list.overrideColumnValue', [$this, $record, $column, $value], true)) !== null) {
            $value = $response;
        }

        if (($response = $this->fireEvent('list.overrideColumnValue', [$record, $column, $value], true)) !== null) {
            $value = $response;
        }

        return $value;
    }

    /**
     * Adds a custom CSS class string to a record row
     * @param  Model $record Populated model
     * @return string
     */
    public function getRowClass($record)
    {
        $value = '';

        /*
         * Extensibility
         */
        if ($response = Event::fire('backend.list.injectRowClass', [$this, $record], true)) {
            $value = $response;
        }

        if ($response = $this->fireEvent('list.injectRowClass', [$record], true)) {
            $value = $response;
        }

        return $value;
    }

    //
    // Value processing
    //

    /**
     * Process as text, escape the value
     */
    protected function evalTextTypeValue($record, $column, $value)
    {
        return htmlentities($value, ENT_QUOTES, 'UTF-8', false);
    }

    /**
     * Process as partial reference
     */
    protected function evalPartialTypeValue($record, $column, $value)
    {
        return $this->controller->makePartial($column->path ?: $column->columnName, [
            'listColumn' => $column,
            'listRecord' => $record,
            'listValue'  => $value,
            'column'     => $column,
            'record'     => $record,
            'value'      => $value
        ]);
    }

    /**
     * Process as boolean switch
     */
    protected function evalSwitchTypeValue($record, $column, $value)
    {
        // return ($value) ? '<i class="icon-check"></i>' : '<i class="icon-times"></i>';
        return ($value) ? 'Yes' : 'No';
    }

    /**
     * Process as a datetime value
     */
    protected function evalDatetimeTypeValue($record, $column, $value)
    {
        if ($value === null) {
            return null;
        }

        $value = $this->validateDateTimeValue($value, $column);

        if ($column->format !== null) {
            return $value->format($column->format);
        }

        return $value->toDayDateTimeString();
    }

    /**
     * Process as a time value
     */
    protected function evalTimeTypeValue($record, $column, $value)
    {
        if ($value === null) {
            return null;
        }

        $value = $this->validateDateTimeValue($value, $column);

        if ($column->format === null) {
            $column->format = 'g:i A';
        }

        return $value->format($column->format);
    }

    /**
     * Process as a date value
     */
    protected function evalDateTypeValue($record, $column, $value)
    {
        if ($value === null) {
            return null;
        }

        $value = $this->validateDateTimeValue($value, $column);

        if ($column->format !== null) {
            return $value->format($column->format);
        }

        return $value->toFormattedDateString();
    }

    /**
     * Process as diff for humans (1 min ago)
     */
    protected function evalTimesinceTypeValue($record, $column, $value)
    {
        if ($value === null) {
            return null;
        }

        $value = $this->validateDateTimeValue($value, $column);

        return $value->diffForHumans();
    }

    /**
     * Validates a column type as a date
     */
    protected function validateDateTimeValue($value, $column)
    {
        if ($value instanceof DateTime) {
            $value = Carbon::instance($value);
        }

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

    public function addFilter(callable $filter)
    {
        $this->filterCallbacks[] = $filter;
    }

    //
    // Searching
    //

    /**
     * Applies a search term to the list results, searching will disable tree
     * view if a value is supplied.
     * @param string $term
     */
    public function setSearchTerm($term)
    {
        if (!empty($term)) {
            $this->showTree = false;
        }

        $this->searchTerm = $term;
    }

    /**
     * Returns a collection of columns which can be searched.
     * @return array
     */
    protected function getSearchableColumns()
    {
        $columns = $this->getColumns();
        $searchable = [];

        foreach ($columns as $column) {
            if (!$column->searchable) {
                continue;
            }

            $searchable[] = $column;
        }

        return $searchable;
    }

    //
    // Sorting
    //

    /**
     * Event handler for sorting the list.
     */
    public function onSort()
    {
        if ($column = post('sortColumn')) {

            /*
             * Toggle the sort direction and set the sorting column
             */
            $sortOptions = ['column' => $this->getSortColumn(), 'direction' => $this->sortDirection];

            if ($column != $sortOptions['column'] || $sortOptions['direction'] == 'asc') {
                $this->sortDirection = $sortOptions['direction'] = 'desc';
            }
            else {
                $this->sortDirection = $sortOptions['direction'] = 'asc';
            }

            $this->sortColumn = $sortOptions['column'] = $column;

            $this->putSession('sort', $sortOptions);

            /*
             * Persist the page number
             */
            $this->currentPageNumber = post('page');

            return $this->onRefresh();
        }
    }

    /**
     * Returns the current sorting column, saved in a session or cached.
     */
    protected function getSortColumn()
    {
        if (!$this->isSortable()) {
            return false;
        }

        if ($this->sortColumn !== null) {
            return $this->sortColumn;
        }

        /*
         * User preference
         */
        if ($this->showSorting && ($sortOptions = $this->getSession('sort'))) {
            $this->sortColumn = $sortOptions['column'];
            $this->sortDirection = $sortOptions['direction'];
        }
        else {
            /*
             * Supplied default
             */
            if (is_string($this->defaultSort)) {
                $this->sortColumn = $this->defaultSort;
                $this->sortDirection = 'desc';
            }
            elseif (is_array($this->defaultSort) && isset($this->defaultSort['column'])) {
                $this->sortColumn = $this->defaultSort['column'];
                $this->sortDirection = (isset($this->defaultSort['direction'])) ?
                    $this->defaultSort['direction'] :
                    'desc';
            }
        }

        /*
         * First available column
         */
        if ($this->sortColumn === null || !$this->isSortable($this->sortColumn)) {
            $columns = $this->visibleColumns ?: $this->getVisibleColumns();
            $columns = array_filter($columns, function($column){ return $column->sortable; });
            $this->sortColumn = key($columns);
            $this->sortDirection = 'desc';
        }

        return $this->sortColumn;
    }

    /**
     * Returns true if the column can be sorted.
     */
    protected function isSortable($column = null)
    {
        if ($column === null) {
            return (count($this->getSortableColumns()) > 0);
        }
        else {
            return array_key_exists($column, $this->getSortableColumns());
        }
    }

    /**
     * Returns a collection of columns which are sortable.
     */
    protected function getSortableColumns()
    {
        if ($this->sortableColumns !== null) {
            return $this->sortableColumns;
        }

        $columns = $this->getColumns();
        $sortable = array_filter($columns, function($column){
            return $column->sortable;
        });

        return $this->sortableColumns = $sortable;
    }

    //
    // List Setup
    //

    /**
     * Event handler to display the list set up.
     */
    public function onLoadSetup()
    {
        $this->vars['columns'] = $this->getSetupListColumns();
        $this->vars['perPageOptions'] = $this->getSetupPerPageOptions();
        $this->vars['recordsPerPage'] = $this->recordsPerPage;
        return $this->makePartial('setup_form');
    }

    /**
     * Event handler to apply the list set up.
     */
    public function onApplySetup()
    {
        if (($visibleColumns = post('visible_columns')) && is_array($visibleColumns)) {
            $this->columnOverride = array_keys($visibleColumns);
            $this->putSession('visible', array_keys($visibleColumns));
        }

        $this->putSession('order', post('column_order'));
        $this->putSession('per_page', post('records_per_page', $this->recordsPerPage));
        return $this->onRefresh();
    }

    /**
     * Returns an array of allowable records per page.
     */
    protected function getSetupPerPageOptions()
    {
        $perPageOptions = [20, 40, 80, 100, 120];
        if (!in_array($this->recordsPerPage, $perPageOptions)) {
            $perPageOptions[] = $this->recordsPerPage;
        }

        sort($perPageOptions);
        return $perPageOptions;
    }

    /**
     * Returns all the list columns used for list set up.
     */
    protected function getSetupListColumns()
    {
        /*
         * Force all columns invisible
         */
        $columns = $this->defineListColumns();
        foreach ($columns as $column) {
            $column->invisible = true;
        }

        return array_merge($columns, $this->getVisibleColumns());
    }

    //
    // Tree
    //

    /**
     * Validates the model and settings if showTree is used
     * @return void
     */
    public function validateTree()
    {
        if (!$this->showTree) {
            return;
        }

        $this->showSorting = $this->showPagination = false;

        if (!$this->model->methodExists('getChildren')) {
            throw new ApplicationException(
                'To display list as a tree, the specified model must have a method "getChildren"'
            );
        }

        if (!$this->model->methodExists('getChildCount')) {
            throw new ApplicationException(
                'To display list as a tree, the specified model must have a method "getChildCount"'
            );
        }
    }

    /**
     * Checks if a node (model) is expanded in the session.
     * @param  Model $node
     * @return boolean
     */
    public function isTreeNodeExpanded($node)
    {
        return $this->getSession('tree_node_status_' . $node->getKey(), $this->treeExpanded);
    }

    /**
     * Sets a node (model) to an expanded or collapsed state, stored in the
     * session, then renders the list again.
     * @return string List HTML contents.
     */
    public function onToggleTreeNode()
    {
        $this->putSession('tree_node_status_' . post('node_id'), post('status') ? 0 : 1);
        return $this->onRefresh();
    }

    //
    // Helpers
    //

    /**
     * Check if column refers to a relation of the model
     * @param  ListColumn  $column List column object
     * @param  boolean     $multi  If set, returns true only if the relation is a "multiple relation type"
     * @return boolean
     */
    protected function isColumnRelated($column, $multi = false)
    {
        if (!isset($column->relation)) {
            return false;
        }

        if (!$this->model->hasRelation($column->relation)) {
            throw new ApplicationException(Lang::get(
                'backend::lang.model.missing_relation',
                ['class'=>get_class($this->model), 'relation'=>$column->relation]
            ));
        }

        if (!$multi) {
            return true;
        }

        $relationType = $this->model->getRelationType($column->relation);

        return in_array($relationType, [
            'hasMany',
            'belongsToMany',
            'morphToMany',
            'morphedByMany',
            'morphMany',
            'attachMany',
            'hasManyThrough'
        ]);
    }
}
