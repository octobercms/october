<?php namespace Backend\FormWidgets;

use Backend\Classes\FormWidgetBase;

/**
 * Tag List Form Widget
 */
class TagList extends FormWidgetBase
{
    use \Backend\Traits\FormModelWidget;

    const MODE_ARRAY = 'array';
    const MODE_STRING = 'string';
    const MODE_RELATION = 'relation';

    //
    // Configurable properties
    //

    /**
     * @var string Tag separator: space, comma.
     */
    public $separator = 'comma';

    /**
     * @var bool Allows custom tags to be entered manually by the user.
     */
    public $customTags = true;

    /**
     * @var mixed Predefined options settings. Set to true to get from model.
     */
    public $options;

    /**
     * @var string Mode for the return value. Values: string, array, relation.
     */
    public $mode = 'string';

    /**
     * @var string If mode is relation, model column to use for the name reference.
     */
    public $nameFrom = 'name';

    /**
     * @var bool Use the key instead of value for saving and reading data.
     */
    public $useKey = false;

    /**
     * @var string Placeholder for empty TagList widget
     */
    public $placeholder = '';

    //
    // Object properties
    //

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
            'useKey',
            'placeholder'
        ]);
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
     * Prepares the form widget view data
     */
    public function prepareVars()
    {
        $this->vars['placeholder'] = $this->placeholder;
        $this->vars['useKey'] = $this->useKey;
        $this->vars['field'] = $this->formField;
        $this->vars['fieldOptions'] = $this->getFieldOptions();
        $this->vars['selectedValues'] = $this->getLoadValue();
        $this->vars['customSeparators'] = $this->getCustomSeparators();
    }

    /**
     * @inheritDoc
     */
    public function getSaveValue($value)
    {
        if ($this->mode === static::MODE_RELATION) {
            return $this->hydrateRelationSaveValue($value);
        }

        if (is_array($value) && $this->mode === static::MODE_STRING) {
            return implode($this->getSeparatorCharacter(), $value);
        }

        return $value;
    }

    /**
     * Returns an array suitable for saving against a relation (array of keys).
     * This method also creates non-existent tags.
     * @return array
     */
    protected function hydrateRelationSaveValue($names)
    {
        if (!$names) {
            return $names;
        }

        $relationModel = $this->getRelationModel();
        $existingTags = $relationModel
            ->whereIn($this->nameFrom, $names)
            ->lists($this->nameFrom, $relationModel->getKeyName())
        ;

        $newTags = $this->customTags ? array_diff($names, $existingTags) : [];

        foreach ($newTags as $newTag) {
            $newModel = $relationModel::create([$this->nameFrom => $newTag]);
            $existingTags[$newModel->getKey()] = $newTag;
        }

        return array_keys($existingTags);
    }

    /**
     * @inheritDoc
     */
    public function getLoadValue()
    {
        $value = parent::getLoadValue();

        if ($this->mode === static::MODE_RELATION) {
            return $this->getRelationObject()->lists($this->nameFrom);
        }

        return $this->mode === static::MODE_STRING
            ? explode($this->getSeparatorCharacter(), $value)
            : $value;
    }

    /**
     * Returns defined field options, or from the relation if available.
     * @return array
     */
    public function getFieldOptions()
    {
        $options = $this->formField->options();

        if (!$options && $this->mode === static::MODE_RELATION) {
            $options = $this->getRelationModel()->lists($this->nameFrom);
        }

        return $options;
    }

    /**
     * Returns character(s) to use for separating keywords.
     * @return mixed
     */
    protected function getCustomSeparators()
    {
        if (!$this->customTags) {
            return false;
        }

        $separators = [];

        $separators[] = $this->getSeparatorCharacter();

        return implode('|', $separators);
    }

    /**
     * Convert the character word to the singular character.
     * @return string
     */
    protected function getSeparatorCharacter()
    {
        switch (strtolower($this->separator)) {
            case 'comma': return ',';
            case 'space': return ' ';
        }
    }

}
