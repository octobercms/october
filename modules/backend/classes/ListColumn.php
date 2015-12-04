<?php namespace Backend\Classes;

use October\Rain\Html\Helper as HtmlHelper;

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
     * @var bool If set to false, disables the default click behavior when the column is clicked.
     */
    public $clickable = true;

    /**
     * @var string Model attribute to use for the display value, this will
     * override any $sqlSelect definition.
     */
    public $valueFrom;

    /**
     * @var string Specifies a default value when value is empty.
     */
    public $defaults;

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
     * @var string sets the column width, can be specified in percents (10%) or pixels (50px).
     * There could be a single column without width specified, it will be stretched to take the
     * available space.
     */
    public $width;

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
     * Constructor.
     * @param string $columnName
     * @param string $label
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
        if (isset($config['width'])) {
            $this->width = $config['width'];
        }
        if (isset($config['cssClass'])) {
            $this->cssClass = $config['cssClass'];
        }
        if (isset($config['searchable'])) {
            $this->searchable = $config['searchable'];
        }
        if (isset($config['sortable'])) {
            $this->sortable = $config['sortable'];
        }
        if (isset($config['clickable'])) {
            $this->clickable = $config['clickable'];
        }
        if (isset($config['invisible'])) {
            $this->invisible = $config['invisible'];
        }
        if (isset($config['valueFrom'])) {
            $this->valueFrom = $config['valueFrom'];
        }
        if (isset($config['default'])) {
            $this->defaults = $config['default'];
        }
        if (isset($config['select'])) {
            $this->sqlSelect = $config['select'];
        }
        if (isset($config['relation'])) {
            $this->relation = $config['relation'];
        }
        if (isset($config['format'])) {
            $this->format = $config['format'];
        }
        if (isset($config['path'])) {
            $this->path = $config['path'];
        }

        return $config;
    }

    /**
     * Returns a HTML valid name for the column name.
     * @return string
     */
    public function getName()
    {
        return HtmlHelper::nameToId($this->columnName);
    }

    /**
     * Returns a value suitable for the column id property.
     * @param  string $suffix Specify a suffix string
     * @return string
     */
    public function getId($suffix = null)
    {
        $id = 'column';

        $id .= '-'.$this->columnName;

        if ($suffix) {
            $id .= '-'.$suffix;
        }

        return HtmlHelper::nameToId($id);
    }
}
