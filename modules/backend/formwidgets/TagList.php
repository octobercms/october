<?php namespace Backend\FormWidgets;

use October\Rain\Database\Model;
use Backend\Classes\FormWidgetBase;

/**
 * Tag List Form Widget
 */
class TagList extends FormWidgetBase
{
    use \Backend\Traits\FormModelWidget;
    use \Backend\FormWidgets\TagList\HasStringStore;
    use \Backend\FormWidgets\TagList\HasRelationStore;

    const MODE_ARRAY = 'array';
    const MODE_STRING = 'string';
    const MODE_RELATION = 'relation';

    //
    // Configurable Properties
    //

    /**
     * @var string separator for tags: space, comma.
     */
    public $separator = 'comma';

    /**
     * @var bool customTags allowed to be entered manually by the user.
     */
    public $customTags = false;

    /**
     * @var bool useKey instead of value for saving and reading data.
     */
    public $useKey = true;

    /**
     * @var mixed options settings. Set to true to get from model.
     */
    public $options;

    /**
     * @var string mode for the return value. Values: string, array, relation.
     */
    public $mode;

    /**
     * @var string nameFrom if mode is relation, model column to use for the name reference.
     */
    public $nameFrom = 'name';

    /**
     * @var string placeholder for empty TagList widget
     */
    public $placeholder = '';

    /**
     * @var int maxItems permitted
     */
    public $maxItems;

    //
    // Object Properties
    //

    /**
     * @var bool useOptions if they are supplied by the model or array
     */
    protected $useOptions = false;

    /**
     * @inheritDoc
     */
    protected $defaultAlias = 'taglist';

    /**
     * @inheritDoc
     */
    public function init()
    {
        $this->fillFromConfig([
            'separator',
            'customTags',
            'options',
            'mode',
            'nameFrom',
            'maxItems',
            'useKey',
            'placeholder'
        ]);

        // Keys cannot be used with custom tags
        if ($this->customTags) {
            $this->useKey = false;
        }

        $this->processMode();

        $this->useOptions = $this->formField->hasOptions();
    }

    /**
     * processMode
     */
    protected function processMode()
    {
        // Set by config
        if ($this->mode !== null) {
            return;
        }

        [$model, $attribute] = $this->nearestModelAttribute($this->valueFrom);

        if ($model instanceof Model && $model->hasRelation($attribute)) {
            $this->mode = static::MODE_RELATION;
            return;
        }

        if ($model instanceof Model && $model->isJsonable($attribute)) {
            $this->mode = static::MODE_ARRAY;
            return;
        }

        $this->mode = static::MODE_STRING;
    }

    /**
     * @inheritDoc
     */
    public function render()
    {
        $this->prepareVars();

        return $this->makePartial('taglist');
    }

    /**
     * prepareVars for display
     */
    public function prepareVars()
    {
        $this->vars['placeholder'] = $this->placeholder;
        $this->vars['maxItems'] = $this->maxItems;
        $this->vars['useKey'] = $this->useKey;
        $this->vars['field'] = $this->formField;
        $this->vars['selectedValues'] = $this->getLoadValue();
        $this->vars['customSeparators'] = $this->getCustomSeparators();
    }

    /**
     * @inheritDoc
     */
    public function getSaveValue($value)
    {
        if ($this->mode === static::MODE_RELATION) {
            return $this->processSaveForRelation($value);
        }

        if ($this->mode === static::MODE_STRING) {
            return $this->processSaveForString($value);
        }

        return $value;
    }

    /**
     * @inheritDoc
     */
    public function getLoadValue()
    {
        $value = parent::getLoadValue();

        if ($this->mode === static::MODE_RELATION) {
            return $this->getLoadValueFromRelation($value);
        }

        if (!is_array($value) && $this->mode === static::MODE_STRING) {
            return $this->getLoadValueFromString($value);
        }

        return $value;
    }

    /**
     * getFieldOptions returns defined field options, or from the relation if available.
     * @return array
     */
    public function getFieldOptions()
    {
        $options = [];

        if ($this->useOptions) {
            $options = $this->formField->options();
        }
        elseif ($this->mode === static::MODE_RELATION) {
            $options = $this->getFieldOptionsForRelation();
        }

        return $options;
    }

    /**
     * getKeylessOptions returns a flat set of options when useKey is false
     */
    public function getKeylessOptions(array $selectedValues, array $fieldOptions): array
    {
        $result = [];

        foreach ($fieldOptions as $option) {
            if ($flatValue = $option->label) {
                $result[$flatValue] = $flatValue;
            }
        }

        foreach ($selectedValues as $value) {
            $result[$value] = $value;
        }

        return $result;
    }

    /**
     * getPreviewOptions generates options for display in read only modes
     */
    public function getPreviewOptions(array $selectedValues, array $fieldOptions): array
    {
        $displayOptions = [];

        foreach ($fieldOptions as $key => $option) {
            if (
                ($this->useKey && in_array($key, $selectedValues)) ||
                (!$this->useKey && in_array($option->label, $selectedValues))
            ) {
                $displayOptions[] = $option;
            }
        }

        return $displayOptions;
    }
}
