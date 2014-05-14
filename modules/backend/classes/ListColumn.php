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
     * @var string Custom SQL for selecting this record value.
     */
    public $sqlSelect;

    /**
     * @var string Relation name, if this column represents a model relationship.
     */
    public $relation;

    /**
     * @var string Specify a CSS class to attach to the list row element.
     */
    public $cssClass;

    /**
     * @var string Specify a format or style for the column value, such as a Date
     */
    public $format;

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
    public function displayAs($type)
    {
        $this->type = $type;
        return $this;
    }

    /**
     * Specifies CSS classes to apply to the table row element.
     */
    public function cssClass($class)
    {
        $this->cssClass = $class;
        return $this;
    }

}