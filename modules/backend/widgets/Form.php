<?php namespace Backend\Widgets;

use App;
use Str;
use Lang;
use Form as FormHelper;
use Input;
use Event;
use Backend\Classes\FormField;
use Backend\Classes\WidgetBase;
use Backend\Classes\WidgetManager;
use System\Classes\ApplicationException;

/**
 * Form Widget
 * Used for building back end forms and renders a form.
 *
 * @package october\backend
 * @author Alexey Bobkov, Samuel Georges
 */
class Form extends WidgetBase
{
    /**
     * {@inheritDoc}
     */
    public $defaultAlias = 'form';

    /**
     * @var Model Form model object.
     */
    public $model;

    /**
     * @var array Dataset containing field values, if none supplied, model is used.
     */
    public $data;

    /**
     * @var boolean Determines if field definitions have been created.
     */
    private $fieldsDefined = false;

    /**
     * @var array Collection of all fields used in this form.
     */
    public $allFields = [];

    /** 
     * @var array Collection of all form widgets used in this form.
     */
    public $formWidgets = [];

    /**
     * @var array Collection of fields not contained in a tab.
     */
    protected $outsideFields = [];

    /**
     * @var array Collection of fields inside the primary tabs.
     */
    protected $primaryTabs = [];

    /**
     * @var array Collection of fields inside the secondary tabs.
     */
    protected $secondaryTabs = [];

    /**
     * @var string If the field element names should be contained in an array.
     * Eg: <input name="nameArray[fieldName]" />
     */
    public $arrayName;

    /**
     * @var string The context of this form, fields that do not belong
     * to this context will not be shown.
     */
    protected $activeContext = null;

    /**
     * @var string Active session key, used for editing forms and deferred bindings.
     */
    public $sessionKey;

    /**
     * @var bool Render this form with uneditable preview data.
     */
    public $previewMode = false;

    /**
     * @var Backend\Classes\WidgetManager
     */
    protected $widgetManager;

    /**
     * Initialize the widget, called by the constructor and free from its parameters.
     */
    public function init()
    {
        $this->widgetManager = WidgetManager::instance();
        $this->arrayName = $this->getConfig('arrayName');
        $this->activeContext = $this->getConfig('context');
        $this->validateModel();
    }

    /**
     * Ensure fields are defined and form widgets are registered so they can
     * also be bound to the controller this allows their AJAX features to
     * operate.
     * @return void
     */
    public function bindToController()
    {
        $this->defineFormFields();
        parent::bindToController();
    }

    /**
     * {@inheritDoc}
     */
    public function loadAssets()
    {
        $this->addJs('js/form.js', 'core');
    }

    /**
     * Renders the widget.
     *
     * Options:
     *  - preview: Render this form as an uneditable preview. Default: false
     *  - section: Which form section to render. Default: null
     *     - outside: Renders the Outside Fields area.
     *     - primary: Renders the Primary Tabs area.
     *     - secondary: Renders the Secondary Tabs area.
     *     - null: Renders all sections
     */
    public function render($options = [])
    {
        if (isset($options['preview'])) $this->previewMode = $options['preview'];

        /*
         * Determine the partial to use based on the supplied section option
         */
        $section = (isset($options['section'])) ? $options['section'] : null;
        switch (strtolower($section)) {
            case 'outside': $targetPartial = 'form_outside_fields'; break;
            case 'primary': $targetPartial = 'form_primary_tabs'; break;
            case 'secondary': $targetPartial = 'form_secondary_tabs'; break;
            default: $targetPartial = 'form'; break;
        }

        $this->prepareVars();
        return $this->makePartial($targetPartial);
    }

    /**
     * Renders a single form field
     */
    public function renderField($field)
    {
        if (is_string($field)) {
            if (!isset($this->allFields[$field]))
                throw new ApplicationException(Lang::get('backend::lang.form.missing_definition', compact('field')));

            $field = $this->allFields[$field];
        }

        $this->prepareVars();
        return $this->makePartial('field', ['field' => $field]);
    }

    /**
     * Renders the HTML element for a field
     */
    public function renderFieldElement($field)
    {
        return $this->makePartial('field_'.$field->type, ['field' => $field]);
    }

    /**
     * Validate the supplied form model.
     * @return void
     */
    protected function validateModel()
    {
        $this->model = $this->getConfig('model');

        if (!$this->model)
            throw new ApplicationException(Lang::get('backend::lang.form.missing_model', ['class'=>get_class($this->controller)]));

        $this->data = (object)$this->getConfig('data', $this->model);

        return $this->model;
    }

    /**
     * Prepares the list data
     */
    public function prepareVars()
    {
        $this->defineFormFields();
        $this->vars['sessionKey'] = $this->getSessionKey();
        $this->vars['outsideFields'] = $this->outsideFields;
        $this->vars['primaryTabs'] = $this->primaryTabs;
        $this->vars['secondaryTabs'] = $this->secondaryTabs;
    }

    /**
     * Creates a flat array of form fields from the configuration.
     * Also slots fields in to their respective tabs.
     */
    protected function defineFormFields()
    {
        if ($this->fieldsDefined)
            return;

        /*
         * Extensibility
         */
        Event::fire('backend.form.extendFieldsBefore', [$this]);
        $this->fireEvent('form.extendFieldsBefore', $this);

        /*
         * Outside fields
         */
        if (!isset($this->config->fields) || !is_array($this->config->fields))
            $this->config->fields = [];

        $this->addFields($this->config->fields);

        /*
         * Primary Tabs + Fields
         */
        if (!isset($this->config->tabs['fields']) || !is_array($this->config->tabs['fields']))
            $this->config->tabs['fields'] = [];

        $this->addFields($this->config->tabs['fields'], 'primary');

        /*
         * Secondary Tabs + Fields
         */
        if (!isset($this->config->secondaryTabs['fields']) || !is_array($this->config->secondaryTabs['fields']))
            $this->config->secondaryTabs['fields'] = [];

        $this->addFields($this->config->secondaryTabs['fields'], 'secondary');

        /*
         * Extensibility
         */
        Event::fire('backend.form.extendFields', [$this]);
        $this->fireEvent('form.extendFields', $this);

        /*
         * Convert automatic spanned fields
         */
        $this->processAutoSpan($this->outsideFields);

        foreach ($this->primaryTabs as $fields)
            $this->processAutoSpan($fields);

        foreach ($this->secondaryTabs as $fields)
            $this->processAutoSpan($fields);

        /*
         * Bind all form widgets to controller
         */
        foreach ($this->allFields as $field) {
            if ($field->type != 'widget')
                continue;

            $widget = $this->makeFormWidget($field);
            $widget->bindToController();
        }

        $this->fieldsDefined = true;
    }

    /**
     * Converts fields with a span set to 'auto' as either
     * 'left' or 'right' depending on the previous field.
     */
    protected function processAutoSpan($fields)
    {
        $prevSpan = null;
        foreach ($fields as $field) {
            if (strtolower($field->span) == 'auto') {
                if ($prevSpan == 'left')
                    $field->span = 'right';
                else
                    $field->span = 'left';
            }

            $prevSpan = $field->span;
        }
    }

    /**
     * Programatically add fields, used internally and for extensibility.
     */
    public function addFields(array $fields, $addToArea = null)
    {
        foreach ($fields as $name => $config) {

            $defaultTab = Lang::get('backend::lang.form.undefined_tab');
            if (!is_array($config))
                $tab = $defaultTab;
            elseif (!isset($config['tab']))
                $tab = $config['tab'] = $defaultTab;
            else
                $tab = $config['tab'];

            $fieldObj = $this->makeFormField($name, $config);

            /*
             * Check that the form field matches the active context
             */
            if ($fieldObj->context !== null) {
                $context = (is_array($fieldObj->context)) ? $fieldObj->context : [$fieldObj->context];
                if (!in_array($this->getContext(), $context))
                    continue;
            }

            $this->allFields[$name] = $fieldObj;

            switch (strtolower($addToArea)) {
                case 'primary':
                    $this->primaryTabs[$tab][$name] = $fieldObj;
                    break;
                case 'secondary':
                    $this->secondaryTabs[$tab][$name] = $fieldObj;
                    break;
                default:
                    $this->outsideFields[$name] = $fieldObj;
                    break;
            }

        }
    }

    public function addTabFields(array $fields)
    {
        return $this->addFields($fields, 'primary');
    }

    public function addSecondaryTabFields(array $fields)
    {
        return $this->addFields($fields, 'secondary');
    }

    /**
     * Creates a form field object from name and configuration.
     */
    protected function makeFormField($name, $config)
    {
        $label = (isset($config['label'])) ? $config['label'] : null;
        $field = new FormField($name, $label);
        $field->arrayName = $this->arrayName;
        $field->idPrefix = $this->getId();

        /*
         * Set field value
         */
        $field->value = $this->getFieldValue($field);

        /*
         * Simple widget field, only widget type is supplied
         */
        if (is_string($config) && $this->isFormWidget($config) !== false) {
            $field->displayAs('widget', ['widget' => $config]);
            return $field;
        }
        /*
         * Simple field, only field type is supplied
         */
        elseif (is_string($config)) {
            $field->displayAs($config);
            return $field;
        }

        $fieldType = isset($config['type']) ? $config['type'] : null;
        if (!is_string($fieldType) && !is_null($fieldType))
            throw new ApplicationException(Lang::get('backend::lang.field.invalid_type', ['type'=>gettype($fieldType)]));

        /*
         * Widget with options
         */
        if ($this->isFormWidget($fieldType) !== false) {
            $fieldOptions = (isset($config['options'])) ? $config['options'] : [];
            $fieldOptions['widget'] = $fieldType;
            $field->displayAs('widget', $fieldOptions);
        }
        /*
         * Simple field with options
         */
        elseif (strlen($fieldType)) {
            $fieldOptions = (isset($config['options'])) ? $config['options'] : null;
            $studlyField = studly_case(strtolower($fieldType));

            if (method_exists($this, 'eval'.$studlyField.'Options'))
                $fieldOptions = $this->{'eval'.$studlyField.'Options'}($field, $fieldOptions);

            $field->displayAs($fieldType, $fieldOptions);
        }

        /*
         * Process remaining options
         */
        if (isset($config['span'])) $field->span($config['span']);
        if (isset($config['context'])) $field->context = $config['context'];
        if (isset($config['size'])) $field->size($config['size']);
        if (isset($config['tab'])) $field->tab($config['tab']);
        if (isset($config['commentAbove'])) $field->comment($config['commentAbove'], 'above');
        if (isset($config['comment'])) $field->comment($config['comment']);
        if (isset($config['placeholder'])) $field->placeholder = $config['placeholder'];
        if (isset($config['default'])) $field->defaults = $config['default'];
        if (isset($config['cssClass'])) $field->cssClass = $config['cssClass'];
        if (isset($config['attributes'])) $field->attributes = $config['attributes'];
        if (isset($config['path'])) $field->path = $config['path'];

        if (array_key_exists('required', $config)) $field->required = $config['required'];
        if (array_key_exists('disabled', $config)) $field->disabled = $config['disabled'];
        if (array_key_exists('stretch', $config)) $field->stretch = $config['stretch'];

        return $field;
    }

    private function isFormWidget($fieldType)
    {
        if ($fieldType === null)
            return false;

        if (strpos($fieldType, '\\'))
            return true;

        $widgetClass = $this->widgetManager->resolveFormWidget($fieldType);

        if (!class_exists($widgetClass))
            return false;

        if (is_subclass_of($widgetClass, 'Backend\Classes\FormWidgetBase'))
            return true;

        return false;
    }

    /**
     * Makes a widget object from a form field object.
     */
    public function makeFormWidget($field)
    {
        if ($field->type != 'widget')
            return null;

        if (isset($this->formWidgets[$field->columnName]))
            return $this->formWidgets[$field->columnName];

        $widgetConfig = $this->makeConfig($field->options);
        $widgetConfig->alias = $this->alias . studly_case($field->columnName);
        $widgetConfig->sessionKey = $this->getSessionKey();

        $widgetName = $widgetConfig->widget;
        $widgetClass = $this->widgetManager->resolveFormWidget($widgetName);
        if (!class_exists($widgetClass)) {
            throw new ApplicationException(Lang::get('backend::lang.widget.not_registered', [
                'name' => $widgetClass
            ]));
        }

        $widget = new $widgetClass($this->controller, $this->model, $field, $widgetConfig);
        return $this->formWidgets[$field->columnName] = $widget;
    }

    /**
     * Looks up the column
     */
    public function getFieldValue($field)
    {
        if (is_string($field)) {
            if (!isset($this->allFields[$field]))
                throw new ApplicationException(Lang::get('backend::lang.form.missing_definition', compact('field')));

            $field = $this->allFields[$field];
        }

        $columnName = $field->columnName;

        if (!$this->model->exists)
            $defaultValue = strlen($field->defaults) ? $field->defaults : null;
        else
            $defaultValue = (isset($this->data->{$columnName})) ? $this->data->{$columnName} : null;

        /*
         * Array field name, eg: field[key][key2][key3]
         */
        $keyParts = Str::evalHtmlArray($columnName);

        /*
         * First part will be the field name, pop it off.
         */
        $fieldName = array_shift($keyParts);

        if (!isset($this->data->{$fieldName}))
            return $defaultValue;

        $result = $this->data->{$fieldName};

        /*
         * Loop the remaining key parts and build a result.
         * This won't execute for standard field names.
         */
        foreach ($keyParts as $key) {

            if (is_array($result)) {
                if (!array_key_exists($key, $result)) return $defaultValue;
                $result = $result[$key];
            }
            else {
                if (!isset($result->{$key})) return $defaultValue;
                $result = $result->{$key};
            }

        }

        return $result;
    }

    /**
     * Returns postback data from a submitted form.
     */
    public function getSaveData()
    {
        $data = ($this->arrayName) ? post($this->arrayName) : post();

        if (!$data)
            $data = [];

        /*
         * Boolean fields (checkbox, switch) won't be present value FALSE
         */
        foreach ($this->allFields as $field) {
            if ($field->type != 'switch' && $field->type != 'checkbox')
                continue;

            /*
             * Handle HTML array, eg: item[key][another]
             */
            $columnParts = Str::evalHtmlArray($field->columnName);
            $columnDotted = implode('.', $columnParts);
            $columnValue = array_get($data, $columnDotted, 0);
            array_set($data, $columnDotted, $columnValue);
        }

        /*
         * Give widgets an opportunity to process the data.
         */
        foreach ($this->formWidgets as $field => $widget) {
            $widgetValue = array_key_exists($field, $data)
                ? $data[$field]
                : null;

            $data[$field] = $widget->getSaveData($widgetValue);
        }

        return $data;
    }

    /**
     * Evaluate and validate dropdown field options.
     */
    public function evalDropdownOptions($field, $fieldOptions)
    {
        return $this->getOptionsFromModel($field, $fieldOptions);
    }

    /**
     * Evaluate and validate radio field options.
     */
    public function evalRadioOptions($field, $fieldOptions)
    {
        return $this->getOptionsFromModel($field, $fieldOptions);
    }

    /**
     * Evaluate and validate checkbox list field options.
     */
    public function evalCheckboxlistOptions($field, $fieldOptions)
    {
        return $this->getOptionsFromModel($field, $fieldOptions);
    }

    /**
     * Looks at the model for defined options.
     */
    private function getOptionsFromModel($field, $fieldOptions)
    {
        if (is_array($fieldOptions) && is_callable($fieldOptions)) {
            $fieldOptions = call_user_func($fieldOptions, $this, $field);
        }

        if (!is_array($fieldOptions) && !$fieldOptions) {
            $methodName = 'get'.studly_case($field->columnName).'Options';
            if (!method_exists($this->model, $methodName) && !method_exists($this->model, 'getDropdownOptions'))
                throw new ApplicationException(Lang::get('backend::lang.field.options_method_not_exists', ['model'=>get_class($this->model), 'method'=>$methodName, 'field'=>$field->columnName]));

            if (method_exists($this->model, $methodName))
                $fieldOptions = $this->model->$methodName($field->value);
            else
                $fieldOptions = $this->model->getDropdownOptions($field->columnName, $field->value);
        }
        elseif (is_string($fieldOptions)) {
            if (!method_exists($this->model, $fieldOptions))
                throw new ApplicationException(Lang::get('backend::lang.field.options_method_not_exists', ['model'=>get_class($this->model), 'method'=>$fieldOptions, 'field'=>$field->columnName]));

            $fieldOptions = $this->model->$fieldOptions($field->value, $field->columnName);
        }

        return $fieldOptions;
    }

    /**
     * Returns the active session key.
     */
    public function getSessionKey()
    {
        if ($this->sessionKey)
            return $this->sessionKey;

        if (post('_session_key'))
            return $this->sessionKey = post('_session_key');

        return $this->sessionKey = FormHelper::getSessionKey();
    }

    /**
     * Returns the active context for displaying the form.
     */
    public function getContext()
    {
        return $this->activeContext;
    }

}