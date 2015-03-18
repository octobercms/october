<?php namespace Backend\Widgets;

use App;
use Lang;
use Input;
use Event;
use Form as FormHelper;
use Backend\Classes\FormTabs;
use Backend\Classes\FormField;
use Backend\Classes\WidgetBase;
use Backend\Classes\WidgetManager;
use ApplicationException;
use Backend\Classes\FormWidgetBase;
use October\Rain\Database\Model;
use October\Rain\Html\Helper as HtmlHelper;

/**
 * Form Widget
 * Used for building back end forms and renders a form.
 *
 * @package october\backend
 * @author Alexey Bobkov, Samuel Georges
 */
class Form extends WidgetBase
{
    //
    // Configurable properties
    //

    /**
     * @var array Form field configuration.
     */
    public $fields;

    /**
     * @var array Primary tab configuration.
     */
    public $tabs;

    /**
     * @var array Secondary tab configuration.
     */
    public $secondaryTabs;

    /**
     * @var Model Form model object.
     */
    public $model;

    /**
     * @var array Dataset containing field values, if none supplied, model is used.
     */
    public $data;

    /**
     * @var string The context of this form, fields that do not belong
     * to this context will not be shown.
     */
    public $context = null;

    /**
     * @var string If the field element names should be contained in an array.
     * Eg: <input name="nameArray[fieldName]" />
     */
    public $arrayName;

    //
    // Object properties
    //

    /**
     * {@inheritDoc}
     */
    protected $defaultAlias = 'form';

    /**
     * @var boolean Determines if field definitions have been created.
     */
    protected $fieldsDefined = false;

    /**
     * @var array Collection of all fields used in this form.
     * @see Backend\Classes\FormField
     */
    protected $allFields = [];

    /**
     * @var object Collection of tab sections used in this form.
     * @see Backend\Classes\FormTabs
     */
    protected $allTabs = [
        'outside'   => null,
        'primary'   => null,
        'secondary' => null,
    ];

    /**
     * @var array Collection of all form widgets used in this form.
     */
    protected $formWidgets = [];

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
        $this->fillFromConfig([
            'fields',
            'tabs',
            'secondaryTabs',
            'model',
            'data',
            'arrayName',
            'context',
        ]);

        $this->widgetManager = WidgetManager::instance();
        $this->allTabs = (object) $this->allTabs;
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
        $this->addJs('js/october.form.js', 'core');
    }

    /**
     * Renders the widget.
     *
     * Options:
     *  - preview: Render this form as an uneditable preview. Default: false
     *  - useContainer: Wrap the result in a container, used by AJAX. Default: true
     *  - section: Which form section to render. Default: null
     *     - outside: Renders the Outside Fields section.
     *     - primary: Renders the Primary Tabs section.
     *     - secondary: Renders the Secondary Tabs section.
     *     - null: Renders all sections
     */
    public function render($options = [])
    {
        if (isset($options['preview'])) {
            $this->previewMode = $options['preview'];
        }
        if (!isset($options['useContainer'])) {
            $options['useContainer'] = true;
        }
        if (!isset($options['section'])) {
            $options['section'] = null;
        }

        $extraVars = [];
        $targetPartial = 'form';

        /*
         * Determine the partial to use based on the supplied section option
         */
        if ($section = $options['section']) {
            $section = strtolower($section);

            if (isset($this->allTabs->{$section})) {
                $extraVars['tabs'] = $this->allTabs->{$section};
            }

            $targetPartial = 'section';
            $extraVars['renderSection'] = $section;
        }

        /*
         * Apply a container to the element
         */
        if ($useContainer = $options['useContainer']) {
            $targetPartial = ($section) ? 'section-container' : 'form-container';
        }

        $this->prepareVars();

        /*
         * Apply preview mode to widgets
         */
        foreach ($this->formWidgets as $widget) {
            $widget->previewMode = $this->previewMode;
        }

        return $this->makePartial($targetPartial, $extraVars);
    }

    /**
     * Renders a single form field
     */
    public function renderField($field, $options = [])
    {
        if (is_string($field)) {
            if (!isset($this->allFields[$field])) {
                throw new ApplicationException(Lang::get(
                    'backend::lang.form.missing_definition',
                    compact('field')
                ));
            }

            $field = $this->allFields[$field];
        }

        if (!isset($options['useContainer'])) {
            $options['useContainer'] = true;
        }
        $targetPartial = $options['useContainer'] ? 'field-container' : 'field';

        $this->prepareVars();
        return $this->makePartial($targetPartial, ['field' => $field]);
    }

    /**
     * Renders the HTML element for a field
     */
    public function renderFieldElement($field)
    {
        return $this->makePartial('field_'.$field->type, ['field' => $field, 'formModel' => $this->model]);
    }

    /**
     * Validate the supplied form model.
     * @return void
     */
    protected function validateModel()
    {
        if (!$this->model) {
            throw new ApplicationException(Lang::get(
                'backend::lang.form.missing_model',
                ['class'=>get_class($this->controller)]
            ));
        }

        $this->data = isset($this->data)
            ? (object) $this->data
            : $this->model;

        return $this->model;
    }

    /**
     * Prepares the form data
     */
    protected function prepareVars()
    {
        $this->defineFormFields();
        $this->applyFiltersFromModel();
        $this->vars['sessionKey'] = $this->getSessionKey();
        $this->vars['outsideTabs'] = $this->allTabs->outside;
        $this->vars['primaryTabs'] = $this->allTabs->primary;
        $this->vars['secondaryTabs'] = $this->allTabs->secondary;
    }

    /**
     * Sets or resets form field values.
     * @param array $data
     * @return array
     */
    public function setFormValues($data = null)
    {
        if ($data == null) {
            $data = $this->getSaveData();
        }

        $this->model->fill($data);
        $this->data = (object) array_merge((array) $this->data, (array) $data);

        foreach ($this->allFields as $field) {
            $field->value = $this->getFieldValue($field);
        }

        return $data;
    }

    /**
     * Event handler for refreshing the form.
     */
    public function onRefresh()
    {
        $result = [];
        $saveData = $this->getSaveData();

        /*
         * Extensibility
         */
        $eventResults = $this->fireEvent('form.beforeRefresh', [$saveData]) +
            Event::fire('backend.form.beforeRefresh', [$this, $saveData]);

        foreach ($eventResults as $eventResult) {
            $saveData = $eventResult + $saveData;
        }

        /*
         * Set the form variables and prepare the widget
         */
        $this->setFormValues($saveData);
        $this->prepareVars();

        /*
         * Extensibility
         */
        $this->fireEvent('form.refreshFields', [$this->allFields]);
        Event::fire('backend.form.refreshFields', [$this, $this->allFields]);

        /*
         * If an array of fields is supplied, update specified fields individually.
         */
        if (($updateFields = post('fields')) && is_array($updateFields)) {

            foreach ($updateFields as $field) {
                if (!isset($this->allFields[$field])) {
                    continue;
                }

                $fieldObject = $this->allFields[$field];
                $result['#' . $fieldObject->getId('group')] = $this->makePartial('field', ['field' => $fieldObject]);
            }
        }

        /*
         * Update the whole form
         */
        if (empty($result)) {
            $result = ['#'.$this->getId() => $this->makePartial('form')];
        }

        /*
         * Extensibility
         */
        $eventResults = $this->fireEvent('form.refresh', [$result]) +
            Event::fire('backend.form.refresh', [$this, $result]);

        foreach ($eventResults as $eventResult) {
            $result = $eventResult + $result;
        }

        return $result;
    }

    /**
     * Creates a flat array of form fields from the configuration.
     * Also slots fields in to their respective tabs.
     */
    protected function defineFormFields()
    {
        if ($this->fieldsDefined) {
            return;
        }

        /*
         * Extensibility
         */
        Event::fire('backend.form.extendFieldsBefore', [$this]);
        $this->fireEvent('form.extendFieldsBefore');

        /*
         * Outside fields
         */
        if (!isset($this->fields) || !is_array($this->fields)) {
            $this->fields = [];
        }

        $this->allTabs->outside = new FormTabs(FormTabs::SECTION_OUTSIDE, $this->config);
        $this->addFields($this->fields);

        /*
         * Primary Tabs + Fields
         */
        if (!isset($this->tabs['fields']) || !is_array($this->tabs['fields'])) {
            $this->tabs['fields'] = [];
        }

        $this->allTabs->primary = new FormTabs(FormTabs::SECTION_PRIMARY, $this->tabs);
        $this->addFields($this->tabs['fields'], FormTabs::SECTION_PRIMARY);

        /*
         * Secondary Tabs + Fields
         */
        if (!isset($this->secondaryTabs['fields']) || !is_array($this->secondaryTabs['fields'])) {
            $this->secondaryTabs['fields'] = [];
        }

        $this->allTabs->secondary = new FormTabs(FormTabs::SECTION_SECONDARY, $this->secondaryTabs);
        $this->addFields($this->secondaryTabs['fields'], FormTabs::SECTION_SECONDARY);

        /*
         * Extensibility
         */
        $this->fireEvent('form.extendFields', [$this->allFields]);
        Event::fire('backend.form.extendFields', [$this, $this->allFields]);

        /*
         * Convert automatic spanned fields
         */
        foreach ($this->allTabs->outside->getTabs() as $fields) {
            $this->processAutoSpan($fields);
        }

        foreach ($this->allTabs->primary->getTabs() as $fields) {
            $this->processAutoSpan($fields);
        }

        foreach ($this->allTabs->secondary->getTabs() as $fields) {
            $this->processAutoSpan($fields);
        }

        /*
         * At least one tab section should stretch
         */
        if (
            $this->allTabs->secondary->stretch === null
            && $this->allTabs->primary->stretch === null
            && $this->allTabs->outside->stretch === null
        ) {
            if ($this->allTabs->secondary->hasFields()) {
                $this->allTabs->secondary->stretch = true;
            }
            elseif ($this->allTabs->primary->hasFields()) {
                $this->allTabs->primary->stretch = true;
            }
            else {
                $this->allTabs->outside->stretch = true;
            }
        }

        /*
         * Bind all form widgets to controller
         */
        foreach ($this->allFields as $field) {
            if ($field->type != 'widget') {
                continue;
            }

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
                if ($prevSpan == 'left') {
                    $field->span = 'right';
                }
                else {
                    $field->span = 'left';
                }
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

            $fieldObj = $this->makeFormField($name, $config);
            $fieldTab = is_array($config) ? array_get($config, 'tab') : null;

            /*
             * Check that the form field matches the active context
             */
            if ($fieldObj->context !== null) {
                $context = (is_array($fieldObj->context)) ? $fieldObj->context : [$fieldObj->context];
                if (!in_array($this->getContext(), $context)) {
                    continue;
                }
            }

            $this->allFields[$name] = $fieldObj;

            switch (strtolower($addToArea)) {
                case FormTabs::SECTION_PRIMARY:
                    $this->allTabs->primary->addField($name, $fieldObj, $fieldTab);
                    break;
                case FormTabs::SECTION_SECONDARY:
                    $this->allTabs->secondary->addField($name, $fieldObj, $fieldTab);
                    break;
                default:
                    $this->allTabs->outside->addField($name, $fieldObj, $fieldTab);
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
     * Programatically remove a field.
     * @return boolean
     */
    public function removeField($name)
    {
        if (!isset($this->allFields[$name])) {
            return false;
        }

        /*
         * Remove from tabs
         */
        $this->allTabs->primary->removeField($name);
        $this->allTabs->secondary->removeField($name);
        $this->allTabs->outside->removeField($name);

        /*
         * Remove from main collection
         */
        unset($this->allFields[$name]);

        return true;
    }

    /**
     * Creates a form field object from name and configuration.
     */
    protected function makeFormField($name, $config)
    {
        $label = (isset($config['label'])) ? $config['label'] : null;
        list($fieldName, $fieldContext) = $this->getFieldName($name);

        $field = new FormField($fieldName, $label);
        if ($fieldContext) {
            $field->context = $fieldContext;
        }
        $field->arrayName = $this->arrayName;
        $field->idPrefix = $this->getId();

        /*
         * Simple field type
         */
        if (is_string($config)) {

            if ($this->isFormWidget($config) !== false) {
                $field->displayAs('widget', ['widget' => $config]);
            }
            else {
                $field->displayAs($config);
            }

        }
        /*
         * Defined field type
         */
        else {

            $fieldType = isset($config['type']) ? $config['type'] : null;
            if (!is_string($fieldType) && !is_null($fieldType)) {
                throw new ApplicationException(Lang::get(
                    'backend::lang.field.invalid_type',
                    ['type'=>gettype($fieldType)]
                ));
            }

            /*
             * Widget with configuration
             */
            if ($this->isFormWidget($fieldType) !== false) {
                $config['widget'] = $fieldType;
                $fieldType = 'widget';
            }

            $field->displayAs($fieldType, $config);

        }

        /*
         * Set field value
         */
        $field->value = $this->getFieldValue($field);

        /*
         * Check model if field is required
         */
        if (!$field->required && $this->model && method_exists($this->model, 'isAttributeRequired')) {
            $field->required = $this->model->isAttributeRequired($field->fieldName);
        }

        /*
         * Get field options from model
         */
        $optionModelTypes = ['dropdown', 'radio', 'checkboxlist', 'balloon-selector'];
        if (in_array($field->type, $optionModelTypes)) {

            /*
             * Defer the execution of option data collection
             */
            $field->options(function () use ($field, $config) {
                $fieldOptions = (isset($config['options'])) ? $config['options'] : null;
                $fieldOptions = $this->getOptionsFromModel($field, $fieldOptions);
                return $fieldOptions;
            });
        }

        return $field;
    }

    /**
     * Check if a field type is a widget or not
     * @param  string  $fieldType
     * @return boolean
     */
    protected function isFormWidget($fieldType)
    {
        if ($fieldType === null) {
            return false;
        }

        if (strpos($fieldType, '\\')) {
            return true;
        }

        $widgetClass = $this->widgetManager->resolveFormWidget($fieldType);

        if (!class_exists($widgetClass)) {
            return false;
        }

        if (is_subclass_of($widgetClass, 'Backend\Classes\FormWidgetBase')) {
            return true;
        }

        return false;
    }

    /**
     * Makes a widget object from a form field object.
     */
    protected function makeFormWidget($field)
    {
        if ($field->type != 'widget') {
            return null;
        }

        if (isset($this->formWidgets[$field->fieldName])) {
            return $this->formWidgets[$field->fieldName];
        }

        $widgetConfig = $this->makeConfig($field->config);
        $widgetConfig->alias = $this->alias . studly_case(HtmlHelper::nameToId($field->fieldName));
        $widgetConfig->sessionKey = $this->getSessionKey();
        $widgetConfig->previewMode = $this->previewMode;
        $widgetConfig->model = $this->model;
        $widgetConfig->data = $this->data;

        $widgetName = $widgetConfig->widget;
        $widgetClass = $this->widgetManager->resolveFormWidget($widgetName);
        if (!class_exists($widgetClass)) {
            throw new ApplicationException(Lang::get(
                'backend::lang.widget.not_registered',
                ['name' => $widgetClass]
            ));
        }

        $widget = new $widgetClass($this->controller, $field, $widgetConfig);

        return $this->formWidgets[$field->fieldName] = $widget;
    }

    /**
     * Get all the loaded form widgets for the instance.
     * @return array
     */
    public function getFormWidgets()
    {
        return $this->formWidgets;
    }

    /**
     * Get a specified form widget
     * @param  string $fieldName
     * @return mixed
     */
    public function getFormWidget($field)
    {
        return $this->formWidgets[$field];
    }

    /**
     * Get all the registered fields for the instance.
     * @return array
     */
    public function getFields()
    {
        return $this->allFields;
    }

    /**
     * Get a specified field object
     * @param  string $fieldName
     * @return mixed
     */
    public function getField($field)
    {
        return $this->allFields[$field];
    }

    /**
     * Parses a field's name
     * @param string $field Field name
     * @return array [columnName, context]
     */
    protected function getFieldName($field)
    {
        if (strpos($field, '@') === false) {
            return [$field, null];
        }

        return explode('@', $field);
    }

    /**
     * Looks up the field value.
     * @param  use Backend\Classes\FormField $field
     * @return string
     */
    protected function getFieldValue($field)
    {
        if (is_string($field)) {
            if (!isset($this->allFields[$field])) {
                throw new ApplicationException(Lang::get(
                    'backend::lang.form.missing_definition',
                    compact('field')
                ));
            }

            $field = $this->allFields[$field];
        }

        $defaultValue = (!$this->model->exists && $field->defaults !== '')
            ? $field->defaults
            : null;

        return $field->getValueFromData($this->data, $defaultValue);
    }

    /**
     * Returns a HTML encoded value containing the other fields this
     * field depends on
     * @param  use Backend\Classes\FormField $field
     * @return string
     */
    protected function getFieldDepends($field)
    {
        if (!$field->dependsOn) {
            return;
        }

        $dependsOn = is_array($field->dependsOn) ? $field->dependsOn : [$field->dependsOn];
        $dependsOn = htmlspecialchars(json_encode($dependsOn), ENT_QUOTES, 'UTF-8');
        return $dependsOn;
    }

    /**
     * Helper method to determine if field should be rendered
     * with label and comments.
     * @param  use Backend\Classes\FormField $field
     * @return boolean
     */
    protected function showFieldLabels($field)
    {
        if (in_array($field->type, ['checkbox', 'switch', 'section'])) {
            return false;
        }

        if ($field->type == 'widget') {
            $widget = $this->makeFormWidget($field);
            return $widget->showLabels;
        }

        return true;
    }

    /**
     * Returns postback data from a submitted form.
     */
    public function getSaveData()
    {
        $data = ($this->arrayName) ? post($this->arrayName) : post();

        if (!$data) {
            $data = [];
        }

        /*
         * Number fields should be converted to integers
         */
        foreach ($this->allFields as $field) {
            if ($field->type != 'number') {
                continue;
            }

            /*
             * Handle HTML array, eg: item[key][another]
             */
            $parts = HtmlHelper::nameToArray($field->fieldName);
            $dotted = implode('.', $parts);
            if (($value = array_get($data, $dotted)) !== null) {
                $value = !strlen(trim($value)) ? null : (float) $value;
                array_set($data, $dotted, $value);
            }
        }

        /*
         * Give widgets an opportunity to process the data.
         */
        foreach ($this->formWidgets as $field => $widget) {
            $parts = HtmlHelper::nameToArray($field);
            $dotted = implode('.', $parts);

            $widgetValue = $widget->getSaveValue(array_get($data, $dotted));

            array_set($data, $dotted, $widgetValue);
        }

        /*
         * Handle fields that differ by fieldName and valueFrom
         */
        $remappedFields = [];
        foreach ($this->allFields as $field) {
            if ($field->fieldName == $field->valueFrom) {
                continue;
            }

            /*
             * Get the value, remove it from the data collection
             */
            $parts = HtmlHelper::nameToArray($field->fieldName);
            $dotted = implode('.', $parts);
            $value = array_get($data, $dotted);
            array_forget($data, $dotted);

            /*
             * Set the new value to the data collection
             */
            $parts = HtmlHelper::nameToArray($field->valueFrom);
            $dotted = implode('.', $parts);
            array_set($remappedFields, $dotted, $value);
        }

        if (count($remappedFields) > 0) {
            $data = array_merge($remappedFields, $data);
            // Could be useful one day for field name collisions
            // $data['X_OCTOBER_REMAPPED_FIELDS'] = $remappedFields;
        }

        return $data;
    }

    /*
     * Allow the model to filter fields.
     */
    protected function applyFiltersFromModel()
    {
        if (method_exists($this->model, 'filterFields')) {
            $this->model->filterFields((object) $this->allFields, $this->getContext());
        }
    }

    /**
     * Looks at the model for defined options.
     */
    protected function getOptionsFromModel($field, $fieldOptions)
    {
        /*
         * Advanced usage, supplied options are callable
         */
        if (is_array($fieldOptions) && is_callable($fieldOptions)) {
            $fieldOptions = call_user_func($fieldOptions, $this, $field);
        }

        /*
         * Refer to the model method or any of its behaviors
         */
        if (!is_array($fieldOptions) && !$fieldOptions) {
            list($model, $attribute) = $field->resolveModelAttribute($this->model, $field->fieldName);

            $methodName = 'get'.studly_case($attribute).'Options';
            if (
                !$this->methodExists($model, $methodName) &&
                !$this->methodExists($model, 'getDropdownOptions')
            ) {
                throw new ApplicationException(Lang::get(
                    'backend::lang.field.options_method_not_exists',
                    ['model'=>get_class($model), 'method'=>$methodName, 'field'=>$field->fieldName]
                ));
            }

            if ($this->methodExists($model, $methodName)) {
                $fieldOptions = $model->$methodName($field->value);
            }
            else {
                $fieldOptions = $model->getDropdownOptions($attribute, $field->value);
            }
        }
        /*
         * Field options are an explicit method reference
         */
        elseif (is_string($fieldOptions)) {
            if (!$this->methodExists($this->model, $fieldOptions)) {
                throw new ApplicationException(Lang::get(
                    'backend::lang.field.options_method_not_exists',
                    ['model'=>get_class($this->model), 'method'=>$fieldOptions, 'field'=>$field->fieldName]
                ));
            }

            $fieldOptions = $this->model->$fieldOptions($field->value, $field->fieldName);
        }

        return $fieldOptions;
    }

    /**
     * Returns the active session key.
     */
    public function getSessionKey()
    {
        if ($this->sessionKey) {
            return $this->sessionKey;
        }

        if (post('_session_key')) {
            return $this->sessionKey = post('_session_key');
        }

        return $this->sessionKey = FormHelper::getSessionKey();
    }

    /**
     * Returns the active context for displaying the form.
     */
    public function getContext()
    {
        return $this->context;
    }

    /**
     * Internal helper for method existence checks
     * @param  object $object
     * @param  string $method
     * @return boolean
     */
    protected function methodExists($object, $method)
    {
        if (method_exists($object, 'methodExists')) {
            return $object->methodExists($method);
        }

        return method_exists($object, $method);
    }
}
