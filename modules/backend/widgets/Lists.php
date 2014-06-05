<?php namespace Backend\Widgets;

use DB as Db;
use HTML as Html;
use App;
use Lang;
use Input;
use Event;
use Backend;
use DbDongle;
use Carbon\Carbon;
use October\Rain\Router\Helper as RouterHelper;
use Backend\Classes\ListColumn;
use Backend\Classes\WidgetBase;
use System\Classes\ApplicationException;
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
    /**
     * {@inheritDoc}
     */
    public $defaultAlias = 'list';

    /**
     * @var Model List model object.
     */
    public $model;

    /**
     * @var array Override default columns with supplied key names.
     */
    public $columnOverride;

    /**
     * @var array Columns to display and their order.
     */
    protected $visibleColumns;

    /**
     * @var array All available columns.
     */
    protected $columns;

    /**
     * @var array Model data collection.
     */
    protected $records;

    /**
     * @var string Link for each record row. Replace :id with the record id.
     */
    public $recordUrl;

    /**
     * @var string Click event for each record row. Replace :id with the record id.
     */
    public $recordOnClick;

    /**
     * @var int Rows to display for each page.
     */
    public $recordsPerPage;

    /**
     * @var string Message to display when there are no records in the list.
     */
    public $noRecordsMessage = 'No records found';

    /**
     * @var string Filter the records by a search term.
     */
    public $searchTerm;

    /**
     * @var bool Shows the sorting options for each column.
     */
    public $showSorting = true;

    /**
     * @var array All sortable columns.
     */
    protected $sortableColumns;

    /**
     * @var mixed A default sort column to look for.
     */
    public $defaultSort;

    /**
     * @var string Sets the list sorting column.
     */
    public $sortColumn;

    /**
     * @var string Sets the list sorting direction (asc, desc)
     */
    public $sortDirection;

    /**
     * @var bool Display a checkbox next to each record row.
     */
    public $showCheckboxes = false;

    /**
     * @var bool Display the list set up used for column visibility and ordering.
     */
    public $showSetup = false;

    /**
     * @var bool Display pagination when limiting records per page.
     */
    public $showPagination = false;

    /**
     * @var bool Display parent/child relationships in the list.
     */
    public $showTree = false;

    /**
     * @var bool Expand the tree nodes by default.
     */
    public $treeExpanded = true;

    /**
     * Initialize the widget, called by the constructor and free from its parameters.
     */
    public function init()
    {
        $this->validateModel();

        /*
         * Configure the list widget
         */
        $this->recordUrl = $this->getConfig('recordUrl', $this->recordUrl);
        $this->recordOnClick = $this->getConfig('recordOnClick', $this->recordOnClick);
        $this->recordsPerPage = $this->getSession('per_page', $this->getConfig('recordsPerPage', $this->recordsPerPage));
        $this->noRecordsMessage = $this->getConfig('noRecordsMessage', $this->noRecordsMessage);
        $this->defaultSort = $this->getConfig('defaultSort', $this->defaultSort);
        $this->showSorting = $this->getConfig('showSorting', $this->showSorting);
        $this->showSetup = $this->getConfig('showSetup', $this->showSetup);
        $this->showCheckboxes = $this->getConfig('showCheckboxes', $this->showCheckboxes);
        $this->showTree = $this->getConfig('showTree', $this->showTree);
        $this->treeExpanded = $this->getConfig('treeExpanded', $this->treeExpanded);
        $this->showPagination = $this->recordsPerPage && $this->recordsPerPage > 0;
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
        return $this->makePartial('list_container');
    }

    /**
     * Prepares the list data
     */
    public function prepareVars()
    {
        $this->vars['columns'] = $this->getVisibleListColumns();
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
            $this->vars['recordTotal'] = $this->records->getTotal();
            $this->vars['pageCurrent'] = $this->records->getCurrentPage();
            $this->vars['pageLast'] = $this->records->getLastPage();
            $this->vars['pageFrom'] = $this->records->getFrom();
            $this->vars['pageTo'] = $this->records->getTo();
        }
        else {
            $this->vars['recordTotal'] = $this->records->count();
            $this->vars['pageCurrent'] = 1;
        }
    }

    /**
     * Event handler for refreshing the list.
     */
    public function onRender()
    {
        $this->prepareVars();
        return ['#'.$this->getId() => $this->makePartial('list')];
    }

    /**
     * Event handler for switching the page number.
     */
    public function onPaginate()
    {
        App::make('paginator')->setCurrentPage(post('page'));
        return $this->onRender();
    }

    /**
     * Validate the supplied form model.
     * @return void
     */
    protected function validateModel()
    {
        $this->model = $this->getConfig('model');

        if (!$this->model)
            throw new ApplicationException(Lang::get('backend::lang.list.missing_model', ['class'=>get_class($this->controller)]));

        if (!$this->model instanceof Model)
            throw new ApplicationException(Lang::get('backend::lang.model.invalid_class', ['model'=>get_class($this->model), 'class'=>get_class($this->controller)]));

        return $this->model;
    }

    /**
     * Replaces the @ symbol with a table name in a model
     * @param  string $sql
     * @param  string $table
     * @return string
     */
    private function parseTableName($sql, $table)
    {
        return str_replace('@', $table.'.', $sql);
    }

    /**
     * Applies any filters to the model.
     */
    protected function prepareModel()
    {
        $query = $this->model->newQuery();
        $selects = [$this->model->getTable().'.*'];
        $tables = ['base'=>$this->model->getTable()];
        $joins = [];

        /*
         * Extensibility
         */
        Event::fire('backend.list.extendQueryBefore', [$this, $query]);
        $this->fireEvent('list.extendQueryBefore', [$this, $query]);

        /*
         * Related custom selects, must come first
         */
        foreach ($this->getVisibleListColumns() as $column) {
            if (!isset($column->relation) || !isset($column->sqlSelect))
                continue;

            if (!$this->model->hasRelation($column->relation))
                throw new ApplicationException(Lang::get('backend::lang.model.missing_relation', ['class'=>get_class($this->model), 'relation'=>$column->relation]));

            $alias = Db::getQueryGrammar()->wrap($column->columnName);
            $table =  $this->model->makeRelation($column->relation)->getTable();
            $relationType = $this->model->getRelationType($column->relation);
            $sqlSelect = $this->parseTableName($column->sqlSelect, $table);

            if (in_array($relationType, ['hasMany', 'belongsToMany', 'morphToMany', 'morphedByMany', 'morphMany', 'attachMany', 'hasManyThrough']))
                $selects[] = DbDongle::raw("group_concat(" . $sqlSelect . " separator ', ') as ". $alias);
            else
                $selects[] = DbDongle::raw($sqlSelect . ' as '. $alias);

            $joins[] = $column->relation;
            $tables[$column->relation] = $table;
        }

        if ($joins)
            $query->joinWith(array_unique($joins), false);

        /*
         * Custom select queries
         */
        foreach ($this->getVisibleListColumns() as $column) {
            if (!isset($column->sqlSelect) || isset($column->relation))
                continue;

            $alias = Db::getQueryGrammar()->wrap($column->columnName);
            $sqlSelect = $this->parseTableName($column->sqlSelect, $tables['base']);
            $selects[] = DbDongle::raw($sqlSelect . ' as '. $alias);
        }

        /*
         * Handle a supplied search term
         */
        if (!empty($this->searchTerm) && ($searchableColumns = $this->getSearchableColumns())) {
            $query->orWhere(function($innerQuery) use ($searchableColumns, $tables) {
                $columnsToSearch = [];
                foreach ($searchableColumns as $column) {

                    if (isset($column->sqlSelect)) {
                        $table = (isset($column->relation)) ? $tables[$column->relation] : 'base';
                        $columnName = DbDongle::raw($this->parseTableName($column->sqlSelect, $table));
                    }
                    else
                        $columnName = $tables['base'] . '.' . $column->columnName;

                    $columnsToSearch[] = $columnName;
                }

                $innerQuery->searchWhere($this->searchTerm, $columnsToSearch);
            });
        }

        /*
         * Handle sorting
         */
        if ($sortColumn = $this->getSortColumn()) {
            $query->orderBy($sortColumn, $this->sortDirection);
        }

        /*
         * @todo Apply filters etc
         */

        /*
         * Extensibility
         */
        Event::fire('backend.list.extendQuery', [$this, $query]);
        $this->fireEvent('list.extendQuery', [$this, $query]);

        // Grouping due to the joinWith() call
        $query->select($selects);
        $query->groupBy($this->model->getQualifiedKeyName());
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
                ? $model->paginate($this->recordsPerPage)
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
        if (isset($this->recordOnClick))
            return 'javascript:;';

        if (!isset($this->recordUrl))
            return null;

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
        if (!isset($this->recordOnClick))
            return null;

        $columns = array_keys($record->getAttributes());
        $recordOnClick = RouterHelper::parseValues($record, $columns, $this->recordOnClick);
        return Html::attributes(['onclick' => $recordOnClick]);
    }

    /**
     * Returns the list columns that are visible by list settings or default
     */
    protected function getVisibleListColumns()
    {
        $definitions = $this->getListColumns();
        $columns = [];

        /*
         * Supplied column list
         */
        if ($this->columnOverride === null)
            $this->columnOverride = $this->getSession('visible', null);

        if ($this->columnOverride && is_array($this->columnOverride)) {

            $invalidColumns = array_diff($this->columnOverride, array_keys($definitions));
            if (!count($definitions))
                throw new ApplicationException(Lang::get('backend::lang.list.missing_column', ['columns'=>implode(',', $invalidColumns)]));

            foreach ($this->columnOverride as $columnName) {
                $definitions[$columnName]->invisible = false;
                $columns[$columnName] = $definitions[$columnName];
            }
        }
        /*
         * Use default column list
         */
        else {
            foreach ($definitions as $columnName => $column) {
                if ($column->invisible)
                    continue;

                $columns[$columnName] = $definitions[$columnName];
            }
        }

        return $this->visibleColumns = $columns;
    }

    /**
     * Builds an array of list columns with keys as the column name and values as a ListColumn object.
     */
    protected function getListColumns()
    {
        if (!isset($this->config->columns) || !is_array($this->config->columns) || !count($this->config->columns))
            throw new ApplicationException(Lang::get('backend::lang.list.missing_columns', ['class'=>get_class($this->controller)]));

        $definitions = $this->config->columns;

        /*
         * Use a supplied column order
         */
        if ($columnOrder = $this->getSession('order', null)) {
            $orderedDefinitions = [];
            foreach ($columnOrder as $column) {
                $orderedDefinitions[$column] = $definitions[$column];
            }

            $definitions = array_merge($orderedDefinitions, $definitions);
        }

        /*
         * Build a final collection of list column objects
         */
        foreach ($definitions as $columnName => $config) {
            $this->columns[$columnName] = $this->makeListColumn($columnName, $config);
        }

        return $this->columns;
    }

    /**
     * Creates a list column object from it's name and configuration.
     */
    protected function makeListColumn($name, $config)
    {
        if (is_string($config))
            $label = $config;
        elseif (isset($config['label']))
            $label = $config['label'];
        else
            $label = studly_case($name);

        $column = new ListColumn($name, $label);

        /*
         * Process options
         */
        if (isset($config['type'])) $column->type = $config['type'];
        if (isset($config['searchable'])) $column->searchable = $config['searchable'];
        if (isset($config['sortable'])) $column->sortable = $config['sortable'];
        if (isset($config['invisible'])) $column->invisible = $config['invisible'];
        if (isset($config['select'])) $column->sqlSelect = $config['select'];
        if (isset($config['relation'])) $column->relation = $config['relation'];
        if (isset($config['format'])) $column->format = $config['format'];

        return $column;
    }

    /**
     * Calculates the total columns used in the list, including checkboxes
     * and other additions.
     */
    protected function getTotalColumns()
    {
        $columns = $this->visibleColumns ?: $this->getVisibleListColumns();
        $total = count($columns);
        if ($this->showCheckboxes) $total++;
        if ($this->showSetup) $total++;
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
        if ($response = Event::fire('backend.list.overrideHeaderValue', [$this, $column, $value], true))
            $value = $response;

        if ($response = $this->fireEvent('list.overrideHeaderValue', [$this, $column, $value], true))
            $value = $response;

        return $value;
    }

    /**
     * Looks up the column value
     */
    public function getColumnValue($record, $column)
    {
        $value = $record->{$column->columnName};

        if (method_exists($this, 'eval'. studly_case($column->type) .'TypeValue'))
            $value = $this->{'eval'. studly_case($column->type) .'TypeValue'}($value, $column);

        /*
         * Extensibility
         */
        if ($response = Event::fire('backend.list.overrideColumnValue', [$this, $record, $column, $value], true))
            $value = $response;

        if ($response = $this->fireEvent('list.overrideColumnValue', [$this, $record, $column, $value], true))
            $value = $response;

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
        if ($response = Event::fire('backend.list.injectRowClass', [$this, $record], true))
            $value = $response;

        if ($response = $this->fireEvent('list.injectRowClass', [$this, $record], true))
            $value = $response;

        return $value;
    }

    //
    // Value processing
    //

    /**
     * Process as boolean switch
     */
    public function evalSwitchTypeValue($value, $column)
    {
        // return ($value) ? '<i class="icon-check"></i>' : '<i class="icon-times"></i>';
        return ($value) ? 'Yes' : 'No';
    }

    /**
     * Process as a datetime value
     */
    public function evalDatetimeTypeValue($value, $column)
    {
        if ($value === null)
            return null;

        if ($column->format !== null)
            return $value->format($column->format);

        return $value->toDayDateTimeString();
    }

    /**
     * Process as a time value
     */
    public function evalTimeTypeValue($value, $column)
    {
        if ($value === null)
            return null;

        if ($column->format === null)
            $column->format = 'g:i A';

        return $value->format($column->format);
    }

    /**
     * Process as a date value
     */
    public function evalDateTypeValue($value, $column)
    {
        if ($value === null)
            return null;

        if ($column->format !== null)
            return $value->format($column->format);

        return $value->toFormattedDateString();
    }

    /**
     * Process as diff for humans (1 min ago)
     */
    public function evalTimesinceTypeValue($value, $column)
    {
        if ($value === null)
            return null;

        if ($value instanceof DateTime)
            $value = Carbon::instance($value);

        if (!$value instanceof Carbon)
            throw new ApplicationException(sprintf('Column value %s is not a DateTime object, are you missing a $dates reference in the Model?', $column->columnName));

        return $value->diffForHumans();
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
        if (empty($term)) {
            $this->showTree = $this->getConfig('showTree', $this->showTree);
        }
        else {
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
        $columns = $this->columns ?: $this->getListColumns();
        $searchable = [];

        foreach ($columns as $column) {
            if (!$column->searchable)
                continue;

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

            if ($column != $sortOptions['column'] || $sortOptions['direction'] == 'asc')
                $this->sortDirection = $sortOptions['direction'] = 'desc';
            else
                $this->sortDirection = $sortOptions['direction'] = 'asc';

            $this->sortColumn = $sortOptions['column'] = $column;

            $this->putSession('sort', $sortOptions);

            /*
             * Persist the page number
             */
            App::make('paginator')->setCurrentPage(post('page'));

            return $this->onRender();
        }
    }

    /**
     * Returns the current sorting column, saved in a session or cached.
     */
    protected function getSortColumn()
    {
        if (!$this->isSortable())
            return false;

        if ($this->sortColumn !== null)
            return $this->sortColumn;

        /*
         * User preference
         */
        if ($this->showSorting && ($sortOptions = $this->getSession('sort'))) {
            $this->sortColumn = $sortOptions['column'];
            $this->sortDirection = $sortOptions['direction'];
        }
        /*
         * Supplied default
         */
        else {
            if (is_string($this->defaultSort)) {
                $this->sortColumn = $this->defaultSort;
                $this->sortDirection = 'desc';
            }
            elseif (is_array($this->defaultSort) && isset($this->defaultSort['column'])) {
                $this->sortColumn = $this->defaultSort['column'];
                $this->sortDirection = (isset($this->defaultSort['direction'])) ? $this->defaultSort['direction'] : 'desc';
            }
        }

        /*
         * First available column
         */
        if ($this->sortColumn === null || !$this->isSortable($this->sortColumn)) {
            $columns = $this->visibleColumns ?: $this->getVisibleListColumns();
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
        if ($column === null)
            return (count($this->getSortableColumns()) > 0);
        else
            return array_key_exists($column, $this->getSortableColumns());
    }

    /**
     * Returns a collection of columns which are sortable.
     */
    protected function getSortableColumns()
    {
        if ($this->sortableColumns !== null)
            return $this->sortableColumns;

        $columns = $this->columns ?: $this->getListColumns();
        $sortable = [];

        foreach ($columns as $column) {
            if (!$column->sortable)
                continue;

            $sortable[$column->columnName] = $column;
        }

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
        return $this->onRender();
    }

    /**
     * Returns an array of allowable records per page.
     */
    protected function getSetupPerPageOptions()
    {
        $perPageOptions = [20, 40, 80, 100, 120];
        if (!in_array($this->recordsPerPage, $perPageOptions))
            $perPageOptions[] = $this->recordsPerPage;

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
        $allColumns = $this->getListColumns();
        foreach ($allColumns as $column) {
            $column->invisible = true;
        }

        return array_merge($allColumns, $this->getVisibleListColumns());
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
        if (!$this->showTree) return;

        $this->showSorting = $this->showPagination = false;

        if (!$this->model->methodExists('getChildren'))
            throw new ApplicationException('To display list as a tree, the specified model must have a method "getChildren"');

        if (!$this->model->methodExists('getChildCount'))
            throw new ApplicationException('To display list as a tree, the specified model must have a method "getChildCount"');
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
        return $this->onRender();
    }

}