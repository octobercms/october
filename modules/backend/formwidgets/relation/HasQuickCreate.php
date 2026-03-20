<?php namespace Backend\FormWidgets\Relation;

use Db;
use Backend\Widgets\Form as FormWidget;

/**
 * HasQuickCreate adds the ability to create new related records from
 * a dropdown, opening a popup form to create the record on the fly.
 */
trait HasQuickCreate
{
    /**
     * @var mixed quickCreate config for the quick create feature
     */
    public $quickCreate;

    /**
     * @var array quickCreateConfig resolved configuration
     */
    protected $quickCreateConfig = [];

    /**
     * @var FormWidget|null quickCreateFormWidget
     */
    protected $quickCreateFormWidget;

    /**
     * hasQuickCreate returns true if quick create should be active
     */
    public function hasQuickCreate(): bool
    {
        if (!$this->quickCreate) {
            return false;
        }

        if ($this->previewMode || $this->readOnly) {
            return false;
        }

        if ($this->useController) {
            return false;
        }

        // Only applies to singular relations (dropdown)
        [$model, $attribute] = $this->resolveModelAttribute($this->valueFrom);
        $relationType = $model->getRelationType($attribute);

        return in_array($relationType, ['belongsTo', 'hasOne', 'morphOne']);
    }

    /**
     * initQuickCreate parses the quickCreate config and prepares the form widget
     * when processing a quick create request.
     */
    protected function initQuickCreate()
    {
        if (!$this->hasQuickCreate()) {
            return;
        }

        // Parse config: string becomes fields path, object/array is full config
        if (is_string($this->quickCreate)) {
            $config = ['fields' => $this->quickCreate];
        }
        else {
            $config = (array) $this->quickCreate;
        }

        // Resolve :name placeholder from the field label
        $nameParams = ['name' => __($this->formField->label ?? "Record")];

        $this->quickCreateConfig = array_merge([
            'fields' => null,
            'optionText' => __("- Create New :name -", $nameParams),
            'title' => __("New :name", $nameParams),
            'context' => 'quickcreate',
            'popupSize' => null,
        ], $config);

        // Initialize form widget when processing a quick create request
        if (post('_relation_quick_create')) {
            $this->quickCreateFormWidget = $this->makeQuickCreateFormWidget();
            $this->quickCreateFormWidget->bindToController();
        }
    }

    /**
     * makeQuickCreateFormWidget creates the form widget for the popup
     */
    protected function makeQuickCreateFormWidget()
    {
        $config = $this->makeConfig($this->quickCreateConfig['fields']);
        $config->model = $this->getRelationModel();
        $config->alias = $this->alias . 'QuickCreate';
        $config->context = $this->quickCreateConfig['context'];
        $config->arrayName = 'QuickCreate';

        return $this->makeWidget(FormWidget::class, $config);
    }

    /**
     * addQuickCreateOption prepends the quick create sentinel option to the dropdown
     */
    protected function addQuickCreateOption($options)
    {
        return ['__quick_create__' => $this->quickCreateConfig['optionText']] + $options;
    }

    /**
     * onLoadQuickCreateForm AJAX handler to render the popup form
     */
    public function onLoadQuickCreateForm()
    {
        $this->vars['quickCreateTitle'] = $this->quickCreateConfig['title'];
        $this->vars['quickCreateFormWidget'] = $this->quickCreateFormWidget;

        return $this->makePartial('quick_create_form');
    }

    /**
     * onQuickCreateRecord AJAX handler to create the new record
     */
    public function onQuickCreateRecord()
    {
        $saveData = $this->quickCreateFormWidget->getSaveData();
        $newModel = $this->getRelationModel();

        $modelsToSave = $this->prepareModelsToSave($newModel, $saveData);
        Db::transaction(function () use ($modelsToSave) {
            foreach ($modelsToSave as $modelToSave) {
                $modelToSave->save([
                    'sessionKey' => $this->quickCreateFormWidget->getSessionKey(),
                    'propagate' => true
                ]);
            }
        });

        // Set the newly created record as the selected value
        $this->formField->value = $newModel->getKey();

        $this->prepareVars();

        return ['#' . $this->getId() => $this->makePartial('relation')];
    }

    /**
     * loadQuickCreateAssets loads the JS control for quick create
     */
    protected function loadQuickCreateAssets()
    {
        if (!$this->getConfig('quickCreate')) {
            return;
        }

        $this->addJs('js/relation-quick-create.js', ['type' => 'module']);
    }
}
