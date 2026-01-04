<?php namespace Backend\FormWidgets;

use Backend\Classes\FormField;
use Backend\Classes\FormWidgetBase;

/**
 * Repeater Form Widget
 *
 * @package october\backend
 * @author Alexey Bobkov, Samuel Georges
 */
class Repeater extends FormWidgetBase
{
    use \Backend\Traits\FormModelSaver;
    use \Backend\Traits\FormModelWidget;
    use \Backend\FormWidgets\Repeater\HasJsonStore;
    use \Backend\FormWidgets\Repeater\HasRelationStore;

    const MODE_ACCORDION = 'accordion';
    const MODE_BUILDER = 'builder';

    //
    // Configurable Properties
    //

    /**
     * @var array form field configuration
     */
    public $form;

    /**
     * @var array groups configuration
     */
    public $groups;

    /**
     * @var string prompt text for adding new items
     */
    public $prompt = "Add New Item";

    /**
     * @var bool showReorder allows the user to reorder the items
     */
    public $showReorder = true;

    /**
     * @var bool showDuplicate allow the user to duplicate an item
     */
    public $showDuplicate = true;

    /**
     * @var string titleFrom field name to use for the title of collapsed items
     */
    public $titleFrom = false;

    /**
     * @var string groupKeyFrom attribute stored along with the saved data
     */
    public $groupKeyFrom = '_group';

    /**
     * @var int minItems required. Pre-displays those items when not using groups
     */
    public $minItems;

    /**
     * @var int maxItems permitted
     */
    public $maxItems;

    /**
     * @var string displayMode constant
     */
    public $displayMode;

    /**
     * @var bool itemsExpanded will expand the repeater item by default, otherwise
     * they will be collapsed and only select one at a time when clicking the header.
     */
    public $itemsExpanded = true;

    /**
     * @var bool useTabs for the form fields.
     */
    public $useTabs = false;

    /**
     * @var string Defines a mount point for the editor toolbar.
     * Must include a module name that exports the Vue application and a state element name.
     * Format: stateElementName
     * Only works in Vue applications and form document layouts.
     */
    public $externalToolbarAppState = null;

    //
    // Object Properties
    //

    /**
     * @inheritDoc
     */
    protected $defaultAlias = 'repeater';

    /**
     * @var array indexMeta data associated to each field, organised by index
     */
    protected $indexMeta = [];

    /**
     * @var array formWidgets collection
     */
    protected $formWidgets = [];

    /**
     * @var bool onAddItemCalled sets the create context for default values
     */
    protected static $onAddItemCalled;

    /**
     * @var bool useGroups
     */
    protected $useGroups = false;

    /**
     * @var bool useRelation
     */
    protected $useRelation = false;

    /**
     * @var array relatedRecords when using a relation
     */
    protected $relatedRecords;

    /**
     * @var array groupDefinitions
     */
    protected $groupDefinitions = [];

    /**
     * @var boolean isLoaded is true when the request is made via postback
     */
    protected $isLoaded = false;

    /**
     * @inheritDoc
     */
    public function init()
    {
        $this->fillFromConfig([
            'form',
            'groups',
            'prompt',
            'displayMode',
            'itemsExpanded',
            'showReorder',
            'showDuplicate',
            'titleFrom',
            'groupKeyFrom',
            'minItems',
            'maxItems',
            'useTabs',
            'externalToolbarAppState'
        ]);

        if ($this->formField->disabled) {
            $this->previewMode = true;
        }

        $this->processGroupMode();

        $this->processRelationMode();

        $this->processLoadedState();

        $this->processLegacyConfig();

        $this->processItems();
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
     * prepareVars for display
     */
    public function prepareVars()
    {
        if ($this->previewMode) {
            foreach ($this->formWidgets as $widget) {
                $widget->previewMode = true;
            }
        }

        $this->vars['name'] = $this->getFieldName();
        $this->vars['displayMode'] = $this->getDisplayMode();
        $this->vars['itemsExpanded'] = $this->itemsExpanded;
        $this->vars['prompt'] = $this->prompt;
        $this->vars['formWidgets'] = $this->formWidgets;
        $this->vars['titleFrom'] = $this->titleFrom;
        $this->vars['groupKeyFrom'] = $this->groupKeyFrom;
        $this->vars['minItems'] = $this->minItems;
        $this->vars['maxItems'] = $this->maxItems;
        $this->vars['useRelation'] = $this->useRelation;
        $this->vars['useGroups'] = $this->useGroups;
        $this->vars['groupDefinitions'] = $this->groupDefinitions;
        $this->vars['showReorder'] = $this->showReorder;
        $this->vars['showDuplicate'] = $this->showDuplicate;
        $this->vars['externalToolbarAppState'] = $this->externalToolbarAppState;
    }

    /**
     * @inheritDoc
     */
    protected function loadAssets()
    {
        $this->addCss('css/repeater.css');
        $this->addJs('js/repeater-min.js');
    }

    /**
     * @inheritDoc
     */
    public function getSaveValue($value)
    {
        return $this->processSaveValue($value);
    }

    /**
     * resetFormValue from the form field
     */
    public function resetFormValue()
    {
        // Transfer approved config
        $this->minItems = $this->formField->minItems;
        $this->maxItems = $this->formField->maxItems;

        // Reprocess widgets
        $this->formWidgets = [];
        $this->processItems();

        // Reprocess related items
        $this->relatedRecords = null;
    }

    /**
     * processLoadedState is special logic that occurs during a postback,
     * the form field value is set directly from the postback data, this occurs
     * during initialization so that nested form widgets can be bound to the controller.
     */
    protected function processLoadedState()
    {
        if (!post($this->alias . '_loaded')) {
            return;
        }

        $this->formField->value = $this->getLoadedValueFromPost();
        $this->isLoaded = true;
    }

    /**
     * getLoadedValueFromPost returns the loaded value from postback with indexes intact
     */
    protected function getLoadedValueFromPost()
    {
        return post($this->formField->getName());
    }

    /**
     * processLegacyConfig converts deprecated options to latest
     */
    protected function processLegacyConfig()
    {
        if ($style = $this->getConfig('style')) {
            if ($style === 'accordion' || $style === 'collapsed') {
                $this->itemsExpanded = false;
            }
        }
    }

    /**
     * processSaveValue splices in some meta data (group and index values) to the dataset
     * @param array $value
     * @return array|null
     */
    protected function processSaveValue($value)
    {
        return $this->useRelation
            ? $this->processSaveForRelation($value)
            : $this->processSaveForJson($value);
    }

    /**
     * processItems processes data and applies it to the form widgets
     */
    protected function processItems()
    {
        if ($this->useRelation) {
            $this->processItemsForRelation();
        }
        else {
            $this->processItemsForJson();
        }
    }

    /**
     * makeItemFormWidget creates a form widget based on a field index and optional group code
     * @param int|string $index
     * @param string $groupCode
     * @param int|string $fromIndex
     * @return \Backend\Widgets\Form
     */
    protected function makeItemFormWidget($index = 0, $groupCode = null, $fromIndex = null)
    {
        $configDefinition = $this->useGroups
            ? $this->getGroupFormFieldConfig($groupCode)
            : $this->form;

        $config = $this->makeConfig($configDefinition);

        // Duplicate
        $dataIndex = $fromIndex !== null ? $fromIndex : $index;

        if ($this->useRelation) {
            $config->model = $this->getModelFromIndex($index);
            $indexName = ($modelKey = $config->model->getKey()) ? "id:{$modelKey}" : $index;
        }
        else {
            $config->model = $this->model;
            $config->data = $this->getValueFromIndex($dataIndex);
            $config->isNested = true;
            $indexName = $index;
        }

        $config->alias = $this->alias . 'Form' . $index;
        $config->context = self::$onAddItemCalled ? FormField::CONTEXT_CREATE : FormField::CONTEXT_UPDATE;
        $config->arrayName = $this->getFieldName().'['.$index.']';
        $config->sessionKey = $this->sessionKey;
        $config->sessionKeySuffix = $this->sessionKeySuffix . "-{$index}";
        $config->parentFieldName = $this->formField->fieldName . "[{$indexName}]";

        $widget = $this->makeWidget(\Backend\Widgets\Form::class, $config);
        $widget->previewMode = $this->previewMode;

        $this->indexMeta[$index] = [
            'groupCode' => $groupCode
        ];

        // Convert to tabbed config
        $useTabs = isset($config->useTabs) ? $config->useTabs : $this->useTabs;
        if ($useTabs) {
            $widget->bindEvent('form.extendFields', function() use ($widget) {
                $this->moveTabbedFormFields($widget, 'outside', 'secondary');
            });
        }

        $widget->bindToController();

        return $this->formWidgets[$index] = $widget;
    }

    /**
     * moveTabbedFormFields from one tab to another
     */
    protected function moveTabbedFormFields($widget, $fromTab, $toTab)
    {
        $from = $widget->getTab($fromTab);
        $to = $widget->getTab($toTab);

        foreach ($from->getAllFields() as $name => $field) {
            $to->addField($name, $field);
            $from->removeField($name);
        }
    }

    /**
     * getValueFromIndex returns the data at a given index
     * @param int|string $index
     */
    protected function getValueFromIndex($index)
    {
        $data = $this->getLoadValue();

        return $data[$index] ?? [];
    }

    /**
     * getDisplayMode for the repeater
     */
    protected function getDisplayMode(): string
    {
        return in_array($this->displayMode, [static::MODE_ACCORDION, static::MODE_BUILDER])
            ? $this->displayMode
            : static::MODE_ACCORDION;
    }

    //
    // AJAX handlers
    //

    /**
     * onAddItem handler
     */
    public function onAddItem()
    {
        self::$onAddItemCalled = true;

        $this->prepareParentModelData();

        $groupCode = post('_repeater_group');

        if ($this->useRelation) {
            $index = $this->createRelationAtIndex($groupCode)->getKey();
        }
        else {
            $index = $this->getNextIndex();
        }

        $this->prepareVars();
        $this->vars['widget'] = $this->makeItemFormWidget($index, $groupCode);
        $this->vars['indexValue'] = $index;

        $itemContainer = '@#' . $this->getId('items');

        return [
            $itemContainer => $this->makePartial('repeater_item')
        ];
    }

    /**
     * onDuplicateItem
     */
    public function onDuplicateItem()
    {
        $fromIndex = post('_repeater_index');
        $groupCode = post('_repeater_group');

        if ($this->useRelation) {
            // Relation must be saved to replicate
            $this->processSaveForRelation([$fromIndex => $this->getValueFromIndex($fromIndex)]);

            // Duplicate the model with replication
            $toIndex = $this->duplicateRelationAtIndex($fromIndex, $groupCode)->getKey();
        }
        else {
            $toIndex = $this->getNextIndex();
        }

        $this->prepareVars();
        $this->vars['widget'] = $this->makeItemFormWidget($toIndex, $groupCode, $fromIndex);
        $this->vars['indexValue'] = $toIndex;

        $itemContainer = '@#' . $this->getId('items');

        return [
            'result' => ['duplicateIndex' => $toIndex],
            $itemContainer => $this->makePartial('repeater_item')
        ];
    }

    /**
     * onRemoveItem
     */
    public function onRemoveItem()
    {
        if (!$this->useRelation) {
            return;
        }

        // Delete related records
        $deletedItems = (array) post('_repeater_items');
        foreach ($deletedItems as $item) {
            $index = $item['repeater_index'] ?? null;
            if ($index !== null) {
                $this->deleteRelationAtIndex($index);
            }
        }
    }

    /**
     * onRefresh
     */
    public function onRefresh()
    {
        $this->prepareParentModelData();

        $index = post('_repeater_index');
        $group = post('_repeater_group');

        $widget = $this->makeItemFormWidget($index, $group);

        return $widget->onRefresh();
    }

    /**
     * getNextIndex determines the next available index number for assigning to a
     * new repeater item
     */
    protected function getNextIndex(): int
    {
        $data = $this->getLoadedValueFromPost();

        if (is_array($data) && count($data)) {
            return max(array_keys($data)) + 1;
        }

        return 0;
    }

    /**
     * prepareParentModelData will ensure the parent model has its form data set
     * to provide context for newly created items or refreshed existing items.
     */
    protected function prepareParentModelData()
    {
        // This code is used since it is more efficient than calling setFormValues()
        // on the form widget, switching to this could be useful if form field value
        // context is needed in the future.
        if (($form = $this->getParentForm()) && !$form->isNested) {
            $this->prepareModelsToSave($form->getModel(), $form->getSaveData());
        }
    }

    //
    // Group Mode
    //

    /**
     * getGroupFormFieldConfig returns the form field configuration for a group, identified by code
     * @param string $code
     * @return array|null
     */
    protected function getGroupFormFieldConfig($code)
    {
        if (!$code) {
            return null;
        }

        $config = array_get($this->groupDefinitions, $code);

        if (!isset($config['fields'])) {
            return null;
        }

        return $config;
    }

    /**
     * processGroupMode processes features related to group mode
     */
    protected function processGroupMode()
    {
        $palette = [];
        $groups = $this->groups;
        $this->useGroups = (bool) $groups;

        if ($this->useGroups) {
            if (is_string($groups)) {
                $groups = $this->makeConfig($groups);
            }

            foreach ($groups as $code => $config) {
                if (str_starts_with($code, '_')) {
                    continue;
                }

                if (is_string($config)) {
                    $config = $this->makeConfig($config);
                }

                $palette[$code] = ['code' => $code] + ((array) $config) + [
                    'name' => '',
                    'icon' => 'icon-square',
                    'description' => '',
                    'titleFrom' => '',
                    'fields' => [],
                ];
            }

            $this->groupDefinitions = $palette;
        }
    }

    /**
     * getGroupCodeFromIndex returns a field group code from its index
     * @param int|string $index
     */
    public function getGroupCodeFromIndex($index): string
    {
        return (string) array_get($this->indexMeta, $index.'.groupCode');
    }

    /**
     * getGroupItemConfig returns the group config from its unique code
     * @param string $groupCode
     * @param ?string $name
     */
    public function getGroupItemConfig($groupCode, $name = null, $default = null)
    {
        return array_get($this->groupDefinitions, $groupCode.'.'.$name, $default);
    }
}
