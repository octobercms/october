<?php namespace Backend\FormWidgets;

use Backend\Classes\FormField;
use Backend\Classes\FormWidgetBase;
use October\Rain\Database\Model;
use October\Rain\Exception\ValidationException;
use October\Rain\Html\Helper as HtmlHelper;

/**
 * NestedForm widget
 *
 * @package october\backend
 * @author Alexey Bobkov, Samuel Georges
 */
class NestedForm extends FormWidgetBase
{
    use \Backend\Traits\FormModelSaver;
    use \Backend\Traits\FormModelWidget;

    /**
     * @inheritDoc
     */
    protected $defaultAlias = 'nestedform';

    /**
     * @var array form configuration
     */
    public $form;

    /**
     * @var bool showPanel defines if the nested form is styled like a panel
     */
    public $showPanel = true;

    /**
     * @var bool defaultCreate will create a new record when the form loads, useful
     * for associating relations within the nested form
     */
    public $defaultCreate = false;

    /**
     * @var bool useRelation will instruct the widget to look for a relationship
     */
    protected $useRelation = false;

    /**
     * @var \Backend\Widgets\Form formWidget reference
     */
    protected $formWidget;

    /**
     * @var \Model relatedRecord when using a relation
     */
    protected $relatedRecord;

    /**
     * @inheritDoc
     */
    public function init()
    {
        $this->fillFromConfig([
            'form',
            'showPanel',
            'defaultCreate'
        ]);

        if ($this->formField->disabled) {
            $this->previewMode = true;
        }

        $this->processRelationMode();

        $this->makeNestedFormWidget();
    }

    /**
     * @inheritdoc
     */
    public function render()
    {
        $this->prepareVars();
        return $this->makePartial('nestedform');
    }

    /**
     * prepareVars for display
     */
    public function prepareVars()
    {
        $this->formWidget->previewMode = $this->previewMode;
    }

    /**
     * loadAssets
     */
    protected function loadAssets()
    {
        $this->addCss('css/nestedform.css');
    }

    /**
     * @inheritDoc
     */
    public function getSaveValue($value)
    {
        if ($this->useRelation) {
            return $this->processSaveForRelation($value);
        }

        return $this->formWidget->getSaveData();
    }

    /**
     * resetFormValue from the form field
     */
    public function resetFormValue()
    {
        $this->formWidget->setFormValues($this->formField->value);
    }

    /**
     * processSaveForRelation
     * @param array $value
     * @return array|null
     */
    protected function processSaveForRelation($value)
    {
        // Give form field widgets an opportunity to process the data
        $widget = $this->formWidget;
        $saveData = $widget->getSaveData();

        // Save data to the model
        $model = $widget->model;

        $modelsToSave = $this->prepareModelsToSave($model, $saveData);

        foreach ($modelsToSave as $attrChain => $modelToSave) {
            try {
                $modelToSave->save(['sessionKey' => $widget->getSessionKeyWithSuffix()]);
            }
            catch (ValidationException $ve) {
                $ve->setFieldPrefix(array_merge(
                    HtmlHelper::nameToArray($this->valueFrom),
                    $attrChain ? explode('.', $attrChain) : []
                ));
                throw $ve;
            }
        }

        return FormField::NO_SAVE_DATA;
    }

    /**
     * makeNestedFormWidget creates a form widget
     */
    protected function makeNestedFormWidget()
    {
        $config = $this->makeConfig($this->form);

        if ($this->useRelation) {
            $config->model = $this->getLoadValueFromRelation();
        }
        else {
            $config->model = $this->model;
            $config->data = $this->getLoadValue() ?: [];
            $config->isNested = true;
        }

        $config->alias = $this->alias . $this->defaultAlias;
        $config->context = $this->formField->context;
        $config->arrayName = $this->getFieldName();
        $config->sessionKey = $this->sessionKey;
        $config->sessionKeySuffix = $this->sessionKeySuffix;
        $config->parentFieldName = $this->formField->fieldName;
        $config->useTranslatable = $this->getParentForm()->useTranslatable;

        $this->tagTabbedFormFields($config->tabs);
        $this->tagTabbedFormFields($config->secondaryTabs);

        $widget = $this->makeWidget(\Backend\Widgets\Form::class, $config);
        $widget->previewMode = $this->previewMode;
        $widget->bindToController();

        $this->formWidget = $widget;
    }

    /**
     * tagTabbedFormFields adds is-nested CSS class to tabs
     */
    protected function tagTabbedFormFields(&$config)
    {
        if (!$config) {
            return;
        }

        if (isset($config['cssClass'])) {
            $config['cssClass'] = $config['cssClass'] . ' is-nested';
        }
        else {
            $config['cssClass'] = 'is-nested';
        }
    }

    /**
     * getLoadValueFromRelation
     */
    protected function getLoadValueFromRelation()
    {
        if ($this->relatedRecord !== null) {
            return $this->relatedRecord;
        }

        $this->relatedRecord = $this->getRelationObject()
            ->withDeferred($this->getSessionKey())
            ->first()
        ;

        if (!$this->relatedRecord) {
            $this->relatedRecord = $this->createRelationByDefault();
        }

        return $this->relatedRecord;
    }

    /**
     * createRelationByDefault
     */
    protected function createRelationByDefault()
    {
        $model = $this->getRelationModel();

        if ($this->defaultCreate) {
            $model->save(['force' => true]);

            $this->getRelationObject()->add($model, $this->getSessionKey());
        }

        return $model;
    }

    /**
     * processRelationMode
     */
    protected function processRelationMode()
    {
        [$model, $attribute] = $this->nearestModelAttribute($this->valueFrom);

        if ($model instanceof Model && $model->hasRelation($attribute)) {
            $this->useRelation = true;
        }
    }
}
