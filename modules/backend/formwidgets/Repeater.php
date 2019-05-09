<?php namespace Backend\FormWidgets;

use Lang;
use ApplicationException;
use Backend\Classes\FormWidgetBase;
use October\Rain\Html\Helper as HtmlHelper;

/**
 * Repeater Form Widget
 */
class Repeater extends FormWidgetBase
{
    //
    // Configurable properties
    //

    /**
     * @var array Form field configuration
     */
    public $form;

    /**
     * @var string Prompt text for adding new items.
     */
    public $prompt = 'Add new item';

    /**
     * @var bool Items can be sorted.
     */
    public $sortable = false;

    /**
     * @var string Field name to use for the title of collapsed items
     */
    public $titleFrom = false;

    /**
     * @var int Minimum items required. Pre-displays those items when not using groups
     */
    public $minItems;

    /**
     * @var int Maximum items permitted
     */
    public $maxItems;

    //
    // Object properties
    //

    /**
     * @inheritDoc
     */
    protected $defaultAlias = 'repeater';

    /**
     * @var int Count of repeated items.
     */
    protected $indexCount = 0;

    /**
     * @var array Meta data associated to each field, organised by index
     */
    protected $indexMeta = [];

    /**
     * @var array Collection of form widgets.
     */
    protected $formWidgets = [];

    /**
     * @var bool Stops nested repeaters populating from previous sibling.
     */
    protected static $onAddItemCalled = false;

    protected $useGroups = false;

    protected $groupDefinitions = [];

    /**
     * Determines if repeater has been initialised previously
     *
     * @var boolean
     */
    protected $loaded = false;

    /**
     * @inheritDoc
     */
    public function init()
    {
        $this->fillFromConfig([
            'form',
            'prompt',
            'sortable',
            'titleFrom',
            'minItems',
            'maxItems',
        ]);

        if ($this->formField->disabled) {
            $this->previewMode = true;
        }

        // Check for loaded flag in POST
        if ((bool) post($this->alias . '_loaded') === true) {
            $this->loaded = true;
        }

        $fieldName = $this->formField->getName(false);

        $this->processGroupMode();

        if (!self::$onAddItemCalled) {
            $this->processItems();
        }
    }

    /**
     * @inheritDoc
     */
    public function render()
    {
        $this->prepareVars();
        return $this->makePartial('repeater');
    }

    /**
     * Prepares the form widget view data
     */
    public function prepareVars()
    {
        // Refresh the loaded data to support being modified by filterFields
        // @see https://github.com/octobercms/october/issues/2613
        if (!self::$onAddItemCalled) {
            $this->processItems();
        }

        if ($this->previewMode) {
            foreach ($this->formWidgets as $widget) {
                $widget->previewMode = true;
            }
        }

        $this->vars['prompt'] = $this->prompt;
        $this->vars['formWidgets'] = $this->formWidgets;
        $this->vars['titleFrom'] = $this->titleFrom;
        $this->vars['minItems'] = $this->minItems;
        $this->vars['maxItems'] = $this->maxItems;

        $this->vars['useGroups'] = $this->useGroups;
        $this->vars['groupDefinitions'] = $this->groupDefinitions;
    }

    /**
     * @inheritDoc
     */
    protected function loadAssets()
    {
        $this->addCss('css/repeater.css', 'core');
        $this->addJs('js/repeater.js', 'core');
    }

    /**
     * @inheritDoc
     */
    public function getSaveValue($value)
    {
        return (array) $this->processSaveValue($value);
    }

    /**
     * Splices in some meta data (group and index values) to the dataset.
     * @param array $value
     * @return array
     */
    protected function processSaveValue($value)
    {
        if (!is_array($value) || !$value) {
            return $value;
        }

        if ($this->minItems && count($value) < $this->minItems) {
            throw new ApplicationException(Lang::get('backend::lang.repeater.min_items_failed', ['name' => $this->fieldName, 'min' => $this->minItems, 'items' => count($value)]));
        }
        if ($this->maxItems && count($value) > $this->maxItems) {
            throw new ApplicationException(Lang::get('backend::lang.repeater.max_items_failed', ['name' => $this->fieldName, 'max' => $this->maxItems, 'items' => count($value)]));
        }

        /*
         * Give repeated form field widgets an opportunity to process the data.
         */
        foreach ($value as $index => $data) {
            if (isset($this->formWidgets[$index])) {
                if ($this->useGroups) {
                    $value[$index] = array_merge($this->formWidgets[$index]->getSaveData(), ['_group' => $data['_group']]);
                } else {
                    $value[$index] = $this->formWidgets[$index]->getSaveData();
                }
            }
        }

        return array_values($value);
    }

    /**
     * Processes form data and applies it to the form widgets.
     * @return void
     */
    protected function processItems()
    {
        $currentValue = ($this->loaded === true)
            ? post($this->formField->getName())
            : $this->getLoadValue();

        if ($currentValue === null) {
            $this->indexCount = 0;
            $this->formWidgets = [];
            return;
        }

        $groupMap = [];

        // Ensure that the minimum number of items are preinitialized
        // ONLY DONE WHEN NOT IN GROUP MODE
        if (!$this->useGroups && $this->minItems > 0) {
            if (!is_array($currentValue)) {
                $currentValue = [];
                for ($i = 0; $i < $this->minItems; $i++) {
                    $currentValue[$i] = [];
                }
            } elseif (count($currentValue) < $this->minItems) {
                for ($i = 0; $i < ($this->minItems - count($currentValue)); $i++) {
                    $currentValue[] = [];
                }
            }
        }

        if (is_array($currentValue) && count($currentValue)) {
            foreach ($currentValue as $value) {
                $groupMap[] = array_get($value, '_group');
            }
        }

        if (!count($groupMap)) {
            return;
        }

        foreach ($groupMap as $index => $groupCode) {
            $this->makeItemFormWidget($index, $groupCode);
        }
        $this->indexCount = max(count($currentValue), $this->indexCount);
    }

    /**
     * Creates a form widget based on a field index and optional group code.
     * @param int $index
     * @param string $index
     * @return \Backend\Widgets\Form
     */
    protected function makeItemFormWidget($index = 0, $groupCode = null)
    {
        $configDefinition = $this->useGroups
            ? $this->getGroupFormFieldConfig($groupCode)
            : $this->form;

        $config = $this->makeConfig($configDefinition);
        $config->model = $this->model;
        $config->data = $this->getValueFromIndex($index);
        $config->alias = $this->alias . 'Form'.$index;
        $config->arrayName = $this->getFieldName().'['.$index.']';
        $config->isNested = true;
        if (self::$onAddItemCalled || $this->minItems > 0) {
            $config->enableDefaults = true;
        }

        $widget = $this->makeWidget('Backend\Widgets\Form', $config);
        $widget->bindToController();

        $this->indexMeta[$index] = [
            'groupCode' => $groupCode
        ];

        return $this->formWidgets[$index] = $widget;
    }

    /**
     * Returns the data at a given index.
     * @param int $index
     */
    protected function getValueFromIndex($index)
    {
        $value = ($this->loaded === true)
            ? post($this->formField->getName())
            : $this->getLoadValue();

        if (!is_array($value)) {
            $value = [];
        }

        return array_get($value, $index, []);
    }

    //
    // AJAX handlers
    //

    public function onAddItem()
    {
        self::$onAddItemCalled = true;

        $groupCode = post('_repeater_group');

        $this->prepareVars();
        $this->vars['widget'] = $this->makeItemFormWidget($this->indexCount, $groupCode);
        $this->vars['indexValue'] = $this->indexCount;

        $itemContainer = '@#' . $this->getId('items');

        // Increase index count after item is created
        ++$this->indexCount;

        return [
            $itemContainer => $this->makePartial('repeater_item')
        ];
    }

    public function onRemoveItem()
    {
        // Useful for deleting relations
    }

    public function onRefresh()
    {
        $index = post('_repeater_index');
        $group = post('_repeater_group');

        $widget = $this->makeItemFormWidget($index, $group);

        return $widget->onRefresh();
    }

    //
    // Group mode
    //

    /**
     * Returns the form field configuration for a group, identified by code.
     * @param string $code
     * @return array|null
     */
    protected function getGroupFormFieldConfig($code)
    {
        if (!$code) {
            return null;
        }

        $fields = array_get($this->groupDefinitions, $code.'.fields');

        if (!$fields) {
            return null;
        }

        return ['fields' => $fields, 'enableDefaults' => object_get($this->config, 'enableDefaults')];
    }

    /**
     * Process features related to group mode.
     * @return void
     */
    protected function processGroupMode()
    {
        $palette = [];

        if (!$group = $this->getConfig('groups', [])) {
            $this->useGroups = false;
            return;
        }

        if (is_string($group)) {
            $group = $this->makeConfig($group);
        }

        foreach ($group as $code => $config) {
            $palette[$code] = [
                'code' => $code,
                'name' => array_get($config, 'name'),
                'icon' => array_get($config, 'icon', 'icon-square-o'),
                'description' => array_get($config, 'description'),
                'fields' => array_get($config, 'fields')
            ];
        }

        $this->groupDefinitions = $palette;
        $this->useGroups = true;
    }

    /**
     * Returns a field group code from its index.
     * @param $index int
     * @return string
     */
    public function getGroupCodeFromIndex($index)
    {
        return array_get($this->indexMeta, $index.'.groupCode');
    }

    /**
     * Returns the group title from its unique code.
     * @param $groupCode string
     * @return string
     */
    public function getGroupTitle($groupCode)
    {
        return array_get($this->groupDefinitions, $groupCode.'.name');
    }
}
