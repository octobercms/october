<?php namespace Backend\FormWidgets;

use Backend\Classes\FormWidgetBase;

/**
 * Dropdown Form Widget
 */
class Dropdown extends FormWidgetBase
{

    //
    // Configurable properties
    //

    /**
     * Specifies the options for this dropdown as an array, a method to call on the parent controller to obtain the options.
     * Or the fully qualified class name of the Model to obtain options from.
     * @var string|array
     */
    public $options;

    /**
     * Specifies the database column to use as an options value.
     * @var string
     */
    public $optionsValueFrom = 'id';

    /**
     * Specifies the database column to use an options title value.
     * @var string
     */
    public $optionsTitleFrom = 'title';

    public $optionsOrderBy = [];

    public $optionsTitleFormatter;

    /**
     * Specifies the operational mode of this dropdown. (static and ajax are supported)
     * @var string
     */
    public $mode = 'static';

    /**
     * Specifies a message to display when there is no value supplied (placeholder).
     * @var string 
     */
    public $placeholder;

    /**
     * Specifies the label 
     * @var [type]
     */
    public $emptyOption;

    /**
     * Specifies wether or not we should show the search bar.
     * @var boolean
     */
    public $showSearch = true;
    
    /**
     * {@inheritDoc}
     */
    protected $defaultAlias = 'dropdown';

    /**
     * {@inheritDoc}
     */
    public function init()
    {
        $this->fillFromConfig([
            'options',
            'optionsValueFrom',
            'optionsTitleFrom',
            'optionsOrderBy',
            'optionsTitleFormatter',
            'mode',
            'placeholder',
            'emptyOption',
            'showSearch'
        ]);
    }

    /**
     * {@inheritDoc}
     */
    public function render()
    {
        $this->prepareVars();
        return $this->makePartial('dropdown');
    }

    /**
     * Prepares the form widget view data
     */
    public function prepareVars()
    {
        $this->vars['name'] = $this->formField->getName();
        $this->vars['value'] = $this->getLoadValue();
        $this->vars['model'] = $this->model;
        $this->vars['mode'] = $this->mode;
    }

    /**
     * {@inheritDoc}
     */
    public function loadAssets()
    {
    }

    /**
     * {@inheritDoc}
     */
    public function getSaveValue($value)
    {
        return $value;
    }

    /**
     * Returns the attributes for the attached $formField at a given position.
     * @param  string  $position 
     * @param  boolean $htmlBuild
     * @return array
     */
    public function getFieldAttributes($position = 'field', $htmlBuild = true)
    {
        return $this->formField->getAttributes($position, $htmlBuild);
    }

    /**
     * Returns true if the passed value is the current value for this widget.
     * @param  mixed $value
     * @return boolean
     */
    public function isSelected($value = true)
    {
        $currentValue = $this->getLoadValue();

        if ($currentValue === null) {
            return false;
        }

        return (string) $value === (string) $currentValue;
    }

    /**
     * Returns the title of an option based on the given value.
     * @param  mixed $value
     * @return string
     */
    public function valueToTitle($value = null)
    {
        if (is_string($this->options) 
            && class_exists($this->options)) {
            return $this->getOptionFromQuery($value);
        }

        $field = $this->formField;
        list(, $fieldName) = $field->resolveModelAttribute($this->model, $field->fieldName);

        $methodToCall = "get" . studly_case($fieldName) . "Option";

        if (is_string($this->options) 
            && $this->objectMethodExists($this->controller, $methodToCall)) {

            return call_user_func([$this->controller, $methodToCall], $value);
        }

        if (is_array($this->options)) {
            return isset($this->options[$value]) ? $this->options[$value] : 
            null;
        }

        return "";
    }

    /**
     * Returns the options for this dropdown.
     * If $search is specified the result set will be filtered by option title.
     * @param  mixed $search
     * @return array
     */
    public function options($value = null, $search = false)
    {
        if ($value) {
            $this->options = $value;
            return $this;
        }

        if (is_array($this->options)) {
            return $this->filterResultSet($this->options, $search);
        }

        if (class_exists($this->options)) {
            return $this->getOptionsFromQuery($search);
        }

        if ($this->objectMethodExists($this->model, $this->options)) {
            $options = call_user_func($this->model, $this->options);
            return $this->filterResultSet($options, $search);
        }

        $field = $this->formField;
        list(,$fieldName) = $field->resolveModelAttribute($this->model, $field->fieldName);
        $methodName = "get" . studly_case($fieldName) . "Options";

        if ($this->objectMethodExists($this->model, $methodName)) {
            $options = call_user_func([$this->model, $methodName]);
            return $this->filterResultSet($options, $search);
        }

        if ($this->objectMethodExists($this->model, "getDropdownOptions")) {
            $options = call_user_func([$this->model, "getDropdownOptions"], $fieldName);
            return $this->filterResultSet($options, $search);
        }

        return [];
    }

    /**
     * AJAX handler to retrieve the options for this widget.
     * If a $term is found in the POST body then the result set will be filtered by option title.
     * @return array
     */
    public function onGetOptions()
    {
        $term = post('term', false);

        $options = [];
        foreach($this->options(null, $term) as $id => $text) {
            $options[] = compact('id', 'text');
        }

        return [
            'options' => $options
        ];
    }

    /**
     * Convenience method to check if the widgets mode is AJAX.
     * @return boolean
     */
    public function isAjax()
    {
        return $this->mode === 'ajax';
    }

    /**
     * Filters a result set by the passed in search term.
     * If the search term is false, the entire result set is returned.
     * Returns the full result set if $search is false.
     * @param  array $options
     * @param  mixed $search
     * @return array
     */
    protected function filterResultSet($options, $search = false)
    {
        if ($search === false) {
            return $options;
        }

        return array_filter($options, function ($item) use ($search) {
            return preg_match("/^$search/i", $item) === 1;
        });
    }

    /**
     * Retreives an option from the database that corressponds to the passed in $value.
     * @return array
     */
    protected function getOptionFromQuery($value = null)
    {
        if ($value === null) {
            $value = $this->getLoadValue();
        }

        $valueFrom = $this->optionsValueFrom;
        $model = $this->options;

        $options = forward_static_call_array([$model, 'select'], $this->getRequiredQueryColumns());
        $options->where($valueFrom, $value);

        if ($options) {
            $option = $options->first();
            
            if ($option) {
                return [
                    'value' => $option->{$valueFrom},
                    'title' => $this->getFormattedOptionTitle($option)
                ];
            }
        }

        return [];
    }

    /**
     * Retreives all options from the database for this widget.
     * If $search is specified, the result set will be filtered by the column specified from $optionsTitleFrom
     * @param  mixed $search
     * @return array
     */
    protected function getOptionsFromQuery($search = false)
    {
        $valueFrom = $this->optionsValueFrom;
        $model = $this->options;
        $requiredQueryColumns = $this->getRequiredQueryColumns();

        $options = forward_static_call_array([$model, 'select'], $requiredQueryColumns);
    
        $this->orderOptionsQuery($options);
        $this->searchOptionsQuery($options, $search);
        
        $options = $options->get();

        if ($options) {
            return $options->reduce(function ($list, $record) use ($valueFrom) {
                $key = $record->{$valueFrom};
                $value = $this->getFormattedOptionTitle($record);
            
                $list[$key] = $value;
            
                return $list;
            }, []);
        }

        return [];
    }

    /**
     * Takes the values from $optionsValueFrom and $optionsTitleFrom and turns it into a flat list of columns
     * to query the database for.
     * @return array
     */
    protected function getRequiredQueryColumns()
    {
        $columns = [$this->optionsValueFrom];

        if (is_array($this->optionsTitleFrom) === true) {
            $columns = array_merge($columns, $this->optionsTitleFrom);
        }

        if (is_string($this->optionsTitleFrom) === true) {
            $columns[] = $this->optionsTitleFrom;
        }

        return $columns;
    }

    /**
     * Prepares the current options query to be sorted by the list in $optionsOrderBy
     * @param  Illuminate\Database\Query\Builder $options
     * @return Illuminate\Database\Query\Builder
     */
    protected function orderOptionsQuery($options)
    {
        if ($this->optionsOrderBy) {
            foreach($this->optionsOrderBy as $key => $value) {
                $column = is_numeric($key) ? $value : $key;
                $direction = is_numeric($key) ? 'ASC' : $value;
                
                $options->orderBy($column, $direction);
            }
        }

        return $options;
    }

    /**
     * Prepares the current options query to be filtered by the passed in $search term.
     * @param  array  $options
     * @param  string $search
     * @return array
     */
    protected function searchOptionsQuery($options, $search = false) {
        
        if ($search) {
            if (is_string($this->optionsTitleFrom) === true) {
                return $options->where($this->optionsTitleFrom, 'LIKE', "$search%");
            }

            if (is_array($this->optionsTitleFrom) === true) {                
                foreach($this->optionsTitleFrom as $column) {
                    $options->orWhere($column, 'LIKE', "$search%");
                }
            }
        }

        return $options;
    }

    /**
     * Formats the title for a given option.
     * 
     * In the event that $optionsTitleFormatter is set to a valid callable on the parent controller, then this function returns the value returned by the invokation of $this->controller->$optionsTitleFormatter.
     * In the event that $optionsTitleFrom is an array, then the values for the columns listed in $optionsTitleFrom are concatenated together with dashes as separators.
     * In the event that $optionsTitleFrom is a string, then it is assumed that it refers to the title column for the $option.
     * In the event that all previous events fail, this function returns null.
     * 
     * @param  mixed $option
     * @return mixed
     */
    protected function getFormattedOptionTitle($option)
    {
        if (is_string($this->optionsTitleFormatter) === false) {
            $this->optionsTitleFormatter = "getFormatted" . studly_case($this->formField->fieldName) . "OptionTitle";
        }

        if ($this->objectMethodExists($this->model, $this->optionsTitleFormatter) === true) {
            return call_user_func([$this->model, $this->optionsTitleFormatter], $option);
        }

        if (is_array($this->optionsTitleFrom) === true) {
            return rtrim(array_reduce($this->optionsTitleFrom, function($title, $column) use ($option) {
                $value = $option->{$column};
                $title .= "$value - ";
                return $title;
            }, ""), ' - ');
        }

        if (is_string($this->optionsTitleFrom) === true) {
            return $option->{$this->optionsTitleFrom};
        }

        return null;
    }

    /**
     * Internal helper for method existence checks.
     *
     * @param  object $object
     * @param  string $method
     * @return boolean
     */
    protected function objectMethodExists($object, $method)
    {
        if (method_exists($object, 'methodExists')) {
            return $object->methodExists($method);
        }

        return method_exists($object, $method);
    }
}
