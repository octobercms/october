<?php namespace Backend\Classes;

/**
 * List Columns definition
 * A translation of the list column configuration
 *
 * @package october\backend
 * @author Alexey Bobkov, Samuel Georges
 */
class ListColumn
{

    /**
     * @var string List column name.
     */
    public $columnName;

    /**
     * @var string List column label.
     */
    public $label;

    /**
     * @var string Display mode. Text, number
     */
    public $type = 'text';

    /**
     * @var bool Specifies if this column can be searched.
     */
    public $searchable = false;

    /**
     * @var bool Specifies if this column is hidden by default.
     */
    public $invisible = false;

    /**
     * @var bool Specifies if this column can be sorted.
     */
    public $sortable = true;

    /**
     * @var string Model attribute to use for the display value, this will
     * override any $sqlSelect definition.
     */
    public $nameFrom;

    /**
     * @var string Custom SQL for selecting this record display value,
     * the @ symbol is replaced with the table name.
     */
    public $sqlSelect;

    /**
     * @var string Relation name, if this column represents a model relationship.
     */
    public $relation;

    /**
     * @var string Specify a CSS class to attach to the list cell element.
     */
    public $cssClass;

    /**
     * @var string Specify a format or style for the column value, such as a Date.
     */
    public $format;

    /**
     * @var string Specifies a path for partial-type fields.
     */
    public $path;

    /**
     * @var array Raw field configuration.
     */
    public $config;

    /**
     * Constructor
     */
    public function __construct($columnName, $label)
    {
        $this->columnName = $columnName;
        $this->label = $label;
    }

    /**
     * Specifies a list column rendering mode. Supported modes are:
     * - text - text column, aligned left
     * - number - numeric column, aligned right
     * @param string $type Specifies a render mode as described above
     */
    public function displayAs($type, $config)
    {
        $this->type = strtolower($type) ?: $this->type;
        $this->config = $this->evalConfig($config);
        return $this;
    }

    /**
     * Process options and apply them to this object.
     * @param array $config
     * @return array
     */
    protected function evalConfig($config)
    {
        if (isset($config['cssClass'])) $this->cssClass = $config['cssClass'];
        if (isset($config['searchable'])) $this->searchable = $config['searchable'];
        if (isset($config['sortable'])) $this->sortable = $config['sortable'];
        if (isset($config['invisible'])) $this->invisible = $config['invisible'];
        if (isset($config['nameFrom'])) $this->nameFrom = $config['nameFrom'];
        if (isset($config['select'])) $this->sqlSelect = $config['select'];
        if (isset($config['relation'])) $this->relation = $config['relation'];
        if (isset($config['format'])) $this->format = $config['format'];
        if (isset($config['path'])) $this->path = $config['path'];

        return $config;
    }

}