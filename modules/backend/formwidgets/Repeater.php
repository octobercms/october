<?php namespace Backend\FormWidgets;

use Lang;
use ApplicationException;
use Backend\Classes\FormWidgetBase;

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

    /**
     * Determines if a child repeater has made an AJAX request to add an item
     *
     * @var bool
     */
    protected $childAddItemCalled = false;

    /**
     * Determines which child index has made the AJAX request to add an item
     *
     * @var int
     */
    protected $childIndexCalled;

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

        $this->checkAddItemRequest();
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

        if (!$this->childAddItemCalled && $currentValue === null) {
            $this->formWidgets = [];
            return;
        }

        if ($this->childAddItemCalled && !isset($currentValue[$this->childIndexCalled])) {
            // If no value is available but a child repeater has added an item, add a "stub" repeater item
            $this->makeItemFormWidget($this->childIndexCalled);
        }

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

        if (!is_array($currentValue)) {
            return;
        }

        collect($currentValue)->each(function ($value, $index) {
            $this->makeItemFormWidget($index, array_get($value, '_group', null));
        });
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
        $widget->previewMode = $this->previewMode;
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
        $groupCode = post('_repeater_group');

        $index = $this->getNextIndex();

        $this->prepareVars();
        $this->vars['widget'] = $this->makeItemFormWidget($index, $groupCode);
        $this->vars['indexValue'] = $index;

        $itemContainer = '@#' . $this->getId('items');

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

    /**
     * Determines the next available index number for assigning to a new repeater item.
     *
     * @return int
     */
    protected function getNextIndex()
    {
        if ($this->loaded === true) {
            $data = post($this->formField->getName());

            if (is_array($data) && count($data)) {
                return (max(array_keys($data)) + 1);
            }
        } else {
            $data = $this->getLoadValue();

            if (is_array($data)) {
                return count($data);
            }
        }

        return 0;
    }

    /**
     * Determines the repeater that has triggered an AJAX request to add an item.
     *
     * @return void
     */
    protected function checkAddItemRequest()
    {
        $handler = $this->getParentForm()
            ->getController()
            ->getAjaxHandler();

        if ($handler === null || strpos($handler, '::') === false) {
            return;
        }

        list($widgetName, $handlerName) = explode('::', $handler);
        if ($handlerName !== 'onAddItem') {
            return;
        }

        if ($this->alias === $widgetName) {
            // This repeater has made the AJAX request
            self::$onAddItemCalled = true;
        } else if (strpos($widgetName, $this->alias) === 0) {
            // A child repeater has made the AJAX request

            // Get index from AJAX handler
            $handlerSuffix = str_replace($this->alias . 'Form', '', $widgetName);
            preg_match('/^[0-9]+/', $handlerSuffix, $matches);

            $this->childAddItemCalled = true;
            $this->childIndexCalled = (int) $matches[0];
        }
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
