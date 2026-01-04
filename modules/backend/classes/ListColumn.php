<?php namespace Backend\Classes;

use October\Rain\Database\Model;
use October\Rain\Html\Helper as HtmlHelper;
use October\Rain\Element\Lists\ColumnDefinition;

/**
 * ListColumn definition is a translation of the list column configuration
 *
 * @method ListColumn valueFrom(string $valueFrom) valueFrom is a model attribute to use for the accessed value
 * @method ListColumn displayFrom(string $displayFrom) displayFrom is a model attribute to use for the displayed value
 * @method ListColumn defaults(string $defaults) defaults specifies a default value when value is empty
 * @method ListColumn sqlSelect(string $sqlSelect) sqlSelect is a custom SQL for selecting this record display value, the `@` symbol is replaced with the table name.
 * @method ListColumn relation(string $relation) Relation name, if this column represents a model relationship.
 * @method ListColumn relationCount(bool $relationCount) Count mode to display the number of related records.
 * @method ListColumn relationWith(string $relationWith) Eager load this dot-notated relation definition with the list query.
 * @method ListColumn width(string $width) sets the column width, can be specified in percents (10%) or pixels (50px).
 * @method ListColumn cssClass(string $cssClass) Specify a CSS class to attach to the list cell element.
 * @method ListColumn headCssClass(string $headCssClass) Specify a CSS class to attach to the list header cell element.
 * @method ListColumn format(string $format) Specify a format or style for the column value, such as a Date.
 * @method ListColumn path(string $path) Specifies a path for partial-type fields.
 * @method ListColumn sortableDefault(string $sortableDefault) sortableDefault makes the field sorted by default, either as asc or desc.
 * @method ListColumn valueTrans(bool $valueTrans) valueTrans determines if display values (model attributes) should be translated
 * @method ListColumn tooltip(array|string $tooltip) tooltip to display next to the column header, as an array supports: title, placement, icon, isHtml
 *
 * @package october\backend
 * @author Alexey Bobkov, Samuel Georges
 */
class ListColumn extends ColumnDefinition
{
    /**
     * __construct using old and new interface
     */
    public function __construct($config = [], $label = null)
    {
        // @deprecated old API
        if (!is_array($config)) {
            return parent::__construct([
                'columnName' => $config,
                'label' => $label
            ]);
        }

        parent::__construct($config);
    }

    /**
     * initDefaultValues for this field
     */
    protected function initDefaultValues()
    {
        parent::initDefaultValues();

        $this
            ->valueTrans(true)
        ;
    }

    /**
     * evalConfig
     */
    public function evalConfig(array $config)
    {
        if (isset($config['select'])) {
            // @deprecated use below
            $this->sqlSelect($config['select']);
            // $this->sqlSelect(array_pull($config, 'select'));
        }

        if (isset($config['default'])) {
            $this->defaults($config['default']);
        }
    }

    /**
     * select
     */
    public function select($column)
    {
        $this->sqlSelect($column);
    }

    /**
     * getName returns a HTML valid name for the column name.
     * @return string
     */
    public function getName()
    {
        return HtmlHelper::nameToId($this->columnName);
    }

    /**
     * getId returns a value suitable for the column id property.
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

    /**
     * getDisplayValue checks to see if display values (model attributes) should be translated,
     * and also escapes the value
     */
    public function getDisplayValue($value)
    {
        if ($this->valueTrans) {
            return e(__($value));
        }

        return e($value);
    }

    /**
     * getAlignClass returns the column specific alignment css class.
     * @return string
     */
    public function getAlignClass()
    {
        return $this->align ? 'list-cell-align-' . $this->align : '';
    }

    /**
     * useRelationCount
     */
    public function useRelationCount(): bool
    {
        if (!$this->relation) {
            return false;
        }

        // @deprecated use relationCount instead
        if (($value = $this->getConfig('useRelationCount')) !== null) {
            return $value;
        }

        return (bool) $this->relationCount;
    }

    /**
     * getValueFromData returns this columns value from a supplied data set, which can be
     * an array or a model or another generic collection.
     * @param mixed $data
     * @param mixed $default
     * @return mixed
     */
    public function getValueFromData($data, $default = null)
    {
        $columnName = $this->valueFrom ?: $this->columnName;

        return $this->getColumnNameFromData($columnName, $data, $default);
    }

    /**
     * Internal method to extract the value of a column name from a data set.
     * @param string $columnName
     * @param mixed $data
     * @param mixed $default
     * @return mixed
     */
    protected function getColumnNameFromData($columnName, $data, $default = null)
    {
        /*
         * Array column name, eg: column[key][key2][key3]
         */
        $keyParts = HtmlHelper::nameToArray($columnName);
        $result = $data;

        /*
         * Loop the column key parts and build a value.
         * To support relations only the last column should return the
         * relation value, all others will look up the relation object as normal.
         */
        foreach ($keyParts as $key) {
            if ($result instanceof Model && $result->hasRelation($key)) {
                $result = $result->{$key};
            }
            else {
                if (is_array($result) && array_key_exists($key, $result)) {
                    $result = $result[$key];
                }
                elseif (!isset($result->{$key})) {
                    return $default;
                }
                else {
                    $result = $result->{$key};
                }
            }
        }

        return $result;
    }
}
