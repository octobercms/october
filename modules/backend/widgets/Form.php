<?php namespace Backend\Widgets;

use Lang;
use Form as FormHelper;
use Backend\Classes\FormTabs;
use Backend\Classes\FormField;
use Backend\Classes\WidgetBase;
use Backend\Classes\WidgetManager;
use Backend\Classes\FormWidgetBase;
use October\Rain\Database\Model;
use October\Rain\Html\Helper as HtmlHelper;
use ApplicationException;
use Exception;

/**
 * Form Widget
 * Used for building back end forms and renders a form.
 *
 * @package october\backend
 * @author Alexey Bobkov, Samuel Georges
 */
class Form extends WidgetBase
{
    use \Backend\Traits\FormModelSaver;

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
    public $context;

    /**
     * @var string If the field element names should be contained in an array.
     * Eg: <input name="nameArray[fieldName]" />
     */
    public $arrayName;

    /**
     * @var bool Used to flag that this form is being rendered as part of another form,
     * a good indicator to expect that the form model and dataset values will differ.
     */
    public $isNested = false;

    //
    // Object properties
    //

    /**
     * @inheritDoc
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
     * @var \Backend\Classes\WidgetManager
     */
    protected $widgetManager;

    /**
     * @inheritDoc
     */
    public function init()
    {
        $this->fillFromConfig([
            'fields',
            'tabs',
            'secondaryTabs',
            'model',
            'data',
            'context',
            'arrayName',
            'isNested',
        ]);

        $this->widgetManager = WidgetManager::instance();
        $this->allTabs = (object) $this->allTabs;
        $this->validateModel();
    }

    /**
     * Ensure fields are defined and form widgets are registered so they can
     * also be bound to the controller this allows their AJAX features to
     * operate.
     *
     * @return void
     */
    public function bindToController()
    {
        $this->defineFormFields();
        parent::bindToController();
    }

    /**
     * @inheritDoc
     */
    protected function loadAssets()
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
     *
     * @param array $options
     * @return string|bool The rendered partial contents, or false if suppressing an exception
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
            $targetPartial = $section ? 'section-container' : 'form-container';
        }

        $this->prepareVars();

        /*
         * Force preview mode on all widgets
         */
        if ($this->previewMode) {
            foreach ($this->formWidgets as $widget) {
                $widget->previewMode = $this->previewMode;
            }
        }

        return $this->makePartial($targetPartial, $extraVars);
    }

    /**
     * Renders a single form field
     *
     * Options:
     *  - useContainer: Wrap the result in a container, used by AJAX. Default: true
     *
     * @param string|array $field The field name or definition
     * @param array $options
     * @return string|bool The rendered partial contents, or false if suppressing an exception
     */
    public function renderField($field, $options = [])
    {
        $this->prepareVars();
        
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

        return $this->makePartial($targetPartial, ['field' => $field]);
    }

    /**
     * Renders the HTML element for a field
     * @param FormWidgetBase $field
     * @return string|bool The rendered partial contents, or false if suppressing an exception
     */
    public function renderFieldElement($field)
    {
        return $this->makePartial(
            'field_' . $field->type,
            [
                'field' => $field,
                'formModel' => $this->model
            ]
        );
    }

    /**
     * Validate the supplied form model.
     *
     * @return mixed
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
     *
     * @return void
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
        if ($data === null) {
            $data = $this->getSaveData();
        }

        /*
         * Fill the model as if it were to be saved
         */
        $this->prepareModelsToSave($this->model, $data);

        /*
         * Data set differs from model
         */
        if ($this->data !== $this->model) {
            $this->data = (object) array_merge((array) $this->data, (array) $data);
        }

        /*
         * Set field values from data source
         */
        foreach ($this->allFields as $field) {
            $field->value = $this->getFieldValue($field);
        }

        return $data;
    }

    /**
     * Event handler for refreshing the form.
     *
     * @return array
     */
    public function onRefresh()
    {
        $result = [];
        $saveData = $this->getSaveData();

        /**
         * @event backend.form.beforeRefresh
         * Called before the form is refreshed, modify the $dataHolder->data property in place
         *
         * Example usage:
         *
         *     Event::listen('backend.form.beforeRefresh', function((\Backend\Widgets\Form) $formWidget, (stdClass) $dataHolder) {
         *         $dataHolder->data = $arrayOfSaveDataToReplaceExistingDataWith;
         *     });
         *
         * Or
         *
         *     $formWidget->bindEvent('form.beforeRefresh', function ((stdClass) $dataHolder) {
         *         $dataHolder->data = $arrayOfSaveDataToReplaceExistingDataWith;
         *     });
         *
         */
        $dataHolder = (object) ['data' => $saveData];
        $this->fireSystemEvent('backend.form.beforeRefresh', [$dataHolder]);
        $saveData = $dataHolder->data;

        /*
         * Set the form variables and prepare the widget
         */
        $this->setFormValues($saveData);
        $this->prepareVars();

        /**
         * @event backend.form.refreshFields
         * Called when the form is refreshed, giving the opportunity to modify the form fields
         *
         * Example usage:
         *
         *     Event::listen('backend.form.refreshFields', function((\Backend\Widgets\Form) $formWidget, (array) $allFields) {
         *         $allFields['name']->required = false;
         *     });
         *
         * Or
         *
         *     $formWidget->bindEvent('form.refreshFields', function ((array) $allFields) {
         *         $allFields['name']->required = false;
         *     });
         *
         */
        $this->fireSystemEvent('backend.form.refreshFields', [$this->allFields]);

        /*
         * If an array of fields is supplied, update specified fields individually.
         */
        if (($updateFields = post('fields')) && is_array($updateFields)) {

            foreach ($updateFields as $field) {
                if (!isset($this->allFields[$field])) {
                    continue;
                }

                /** @var FormWidgetBase $fieldObject */
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

        /**
         * @event backend.form.refresh
         * Called after the form is refreshed, should return an array of additional result parameters.
         *
         * Example usage:
         *
         *     Event::listen('backend.form.refresh', function((\Backend\Widgets\Form) $formWidget, (array) $result) {
         *         $result['#my-partial-id' => $formWidget->makePartial('$/path/to/custom/backend/partial.htm')];
         *         return $result;
         *     });
         *
         * Or
         *
         *     $formWidget->bindEvent('form.refresh', function ((array) $result) use ((\Backend\Widgets\Form $formWidget)) {
         *         $result['#my-partial-id' => $formWidget->makePartial('$/path/to/custom/backend/partial.htm')];
         *         return $result;
         *     });
         *
         */
        $eventResults = $this->fireSystemEvent('backend.form.refresh', [$result], false);

        foreach ($eventResults as $eventResult) {
            $result = $eventResult + $result;
        }

        return $result;
    }

    /**
     * Creates a flat array of form fields from the configuration.
     * Also slots fields in to their respective tabs.
     *
     * @return void
     */
    protected function defineFormFields()
    {
        if ($this->fieldsDefined) {
            return;
        }

        /**
         * @event backend.form.extendFieldsBefore
         * Called before the form fields are defined
         *
         * Example usage:
         *
         *     Event::listen('backend.form.extendFieldsBefore', function((\Backend\Widgets\Form) $formWidget) {
         *         // You should always check to see if you're extending correct model/controller
         *         if (!$widget->model instanceof \Foo\Example\Models\Bar) {
         *             return;
         *         }
         *
         *         // Here you can't use addFields() because it will throw you an exception because form is not yet created
         *         // and it does not have tabs and fields
         *         // For this example we will pretend that we want to add a new field named example_field
         *         $widget->fields['example_field'] = [
         *             'label' => 'Example field',
         *             'comment' => 'Your example field',
         *             'type' => 'text',
         *         ];
         *     });
         *
         * Or
         *
         *     $formWidget->bindEvent('form.extendFieldsBefore', function () use ((\Backend\Widgets\Form $formWidget)) {
         *         // You should always check to see if you're extending correct model/controller
         *         if (!$widget->model instanceof \Foo\Example\Models\Bar) {
         *             return;
         *         }
         *
         *         // Here you can't use addFields() because it will throw you an exception because form is not yet created
         *         // and it does not have tabs and fields
         *         // For this example we will pretend that we want to add a new field named example_field
         *         $widget->fields['example_field'] = [
         *             'label' => 'Example field',
         *             'comment' => 'Your example field',
         *             'type' => 'text',
         *         ];
         *     });
         *
         */
        $this->fireSystemEvent('backend.form.extendFieldsBefore');

        /*
         * Outside fields
         */
        if (!isset($this->fields) || !is_array($this->fields)) {
            $this->fields = [];
        }

        $this->allTabs->outside = new FormTabs(FormTabs::SECTION_OUTSIDE, (array) $this->config);
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

        /**
         * @event backend.form.extendFields
         * Called after the form fields are defined
         *
         * Example usage:
         *
         *     Event::listen('backend.form.extendFields', function((\Backend\Widgets\Form) $formWidget) {
         *         // Only for the User controller
         *         if (!$widget->getController() instanceof \RainLab\User\Controllers\Users) {
         *             return;
         *         }
         *
         *         // Only for the User model
         *         if (!$widget->model instanceof \RainLab\User\Models\User) {
         *             return;
         *         }
         *
         *         // Add an extra birthday field
         *         $widget->addFields([
         *             'birthday' => [
         *                 'label'   => 'Birthday',
         *                 'comment' => 'Select the users birthday',
         *                 'type'    => 'datepicker'
         *             ]
         *         ]);
         *
         *         // Remove a Surname field
         *         $widget->removeField('surname');
         *     });
         *
         * Or
         *
         *     $formWidget->bindEvent('form.extendFields', function () use ((\Backend\Widgets\Form $formWidget)) {
         *         // Only for the User controller
         *         if (!$widget->getController() instanceof \RainLab\User\Controllers\Users) {
         *             return;
         *         }
         *
         *         // Only for the User model
         *         if (!$widget->model instanceof \RainLab\User\Models\User) {
         *             return;
         *         }
         *
         *         // Add an extra birthday field
         *         $widget->addFields([
         *             'birthday' => [
         *                 'label'   => 'Birthday',
         *                 'comment' => 'Select the users birthday',
         *                 'type'    => 'datepicker'
         *             ]
         *         ]);
         *
         *         // Remove a Surname field
         *         $widget->removeField('surname');
         *     });
         *
         */
        $this->fireSystemEvent('backend.form.extendFields', [$this->allFields]);

        /*
         * Convert automatic spanned fields
         */
        foreach ($this->allTabs->outside->getFields() as $fields) {
            $this->processAutoSpan($fields);
        }

        foreach ($this->allTabs->primary->getFields() as $fields) {
            $this->processAutoSpan($fields);
        }

        foreach ($this->allTabs->secondary->getFields() as $fields) {
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
            if ($field->type !== 'widget') {
                continue;
            }

            $widget = $this->makeFormFieldWidget($field);
            $widget->bindToController();
        }

        $this->fieldsDefined = true;
    }

    /**
     * Converts fields with a span set to 'auto' as either
     * 'left' or 'right' depending on the previous field.
     *
     * @return void
     */
    protected function processAutoSpan($fields)
    {
        $prevSpan = null;

        foreach ($fields as $field) {
            if (strtolower($field->span) === 'auto') {
                if ($prevSpan === 'left') {
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
     *
     * @param array $fields
     * @param string $addToArea
     * @return void
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
                $context = is_array($fieldObj->context) ? $fieldObj->context : [$fieldObj->context];
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
                    $this->allTabs->outside->addField($name, $fieldObj);
                    break;
            }
        }
    }

    /**
     * Add tab fields.
     *
     * @param array $fields
     * @return void
     */
    public function addTabFields(array $fields)
    {
        $this->addFields($fields, 'primary');
    }

    /**
     * @param array $fields
     * @return void
     */
    public function addSecondaryTabFields(array $fields)
    {
        $this->addFields($fields, 'secondary');
    }

    /**
     * Programatically remove a field.
     *
     * @param string $name
     * @return bool
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
     * Programatically remove all fields belonging to a tab.
     *
     * @param string $name
     * @return bool
     */
    public function removeTab($name)
    {
        foreach ($this->allFields as $fieldName => $field) {
            if ($field->tab == $name) {
                $this->removeField($fieldName);
            }
        }
    }

    /**
     * Creates a form field object from name and configuration.
     *
     * @param string $name
     * @param array $config
     * @return FormField
     */
    protected function makeFormField($name, $config = [])
    {
        $label = $config['label'] ?? null;
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
            $fieldType = $config['type'] ?? null;
            if (!is_string($fieldType) && $fieldType !== null) {
                throw new ApplicationException(Lang::get(
                    'backend::lang.field.invalid_type',
                    ['type' => gettype($fieldType)]
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
         * Apply the field name to the validation engine
         */
        $attrName = implode('.', HtmlHelper::nameToArray($field->fieldName));

        if ($this->model && method_exists($this->model, 'setValidationAttributeName')) {
            $this->model->setValidationAttributeName($attrName, $field->label);
        }

        /*
         * Check model if field is required
         */
        if ($field->required === null && $this->model && method_exists($this->model, 'isAttributeRequired')) {
            // Check nested fields
            if ($this->isNested) {
                // Get the current attribute level
                $nameArray = HtmlHelper::nameToArray($this->arrayName);
                unset($nameArray[0]);

                // Convert any numeric indexes to wildcards
                foreach ($nameArray as $i => $value) {
                    if (preg_match('/^[0-9]*$/', $value)) {
                        $nameArray[$i] = '*';
                    }
                }

                // Recombine names for full attribute name in rules array
                $attrName = implode('.', $nameArray) . ".{$attrName}";
            }

            $field->required = $this->model->isAttributeRequired($attrName);
        }

        /*
         * Get field options from model
         */
        $optionModelTypes = ['dropdown', 'radio', 'checkboxlist', 'balloon-selector'];
        if (in_array($field->type, $optionModelTypes, false)) {

            /*
             * Defer the execution of option data collection
             */
            $field->options(function () use ($field, $config) {
                $fieldOptions = $config['options'] ?? null;
                $fieldOptions = $this->getOptionsFromModel($field, $fieldOptions);
                return $fieldOptions;
            });
        }

        return $field;
    }

    /**
     * Check if a field type is a widget or not
     *
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
     *
     * @param $field
     * @return \Backend\Traits\FormWidgetBase|null
     */
    protected function makeFormFieldWidget($field)
    {
        if ($field->type !== 'widget') {
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

        $widget = $this->makeFormWidget($widgetClass, $field, $widgetConfig);

        /*
         * If options config is defined, request options from the model.
         */
        if (isset($field->config['options'])) {
            $field->options(function () use ($field) {
                $fieldOptions = $field->config['options'];
                if ($fieldOptions === true) $fieldOptions = null;
                $fieldOptions = $this->getOptionsFromModel($field, $fieldOptions);
                return $fieldOptions;
            });
        }

        return $this->formWidgets[$field->fieldName] = $widget;
    }

    /**
     * Get all the loaded form widgets for the instance.
     *
     * @return array
     */
    public function getFormWidgets()
    {
        return $this->formWidgets;
    }

    /**
     * Get a specified form widget
     *
     * @param string $field
     * @return mixed
     */
    public function getFormWidget($field)
    {
        if (isset($this->formWidgets[$field])) {
            return $this->formWidgets[$field];
        }

        return null;
    }

    /**
     * Get all the registered fields for the instance.
     *
     * @return array
     */
    public function getFields()
    {
        return $this->allFields;
    }

    /**
     * Get a specified field object
     *
     * @param string $field
     * @return mixed
     */
    public function getField($field)
    {
        if (isset($this->allFields[$field])) {
            return $this->allFields[$field];
        }

        return null;
    }

    /**
     * Get all tab objects for the instance.
     *
     * @return object[FormTabs]
     */
    public function getTabs()
    {
        return $this->allTabs;
    }

    /**
     * Get a specified tab object.
     * Options: outside, primary, secondary.
     *
     * @param string $field
     * @return mixed
     */
    public function getTab($tab)
    {
        if (isset($this->allTabs->$tab)) {
            return $this->allTabs->$tab;
        }

        return null;
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
     * @param mixed $field
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

        $defaultValue = !$this->model->exists
            ? trans($field->getDefaultFromData($this->data))
            : null;

        return $field->getValueFromData($this->data, $defaultValue);
    }

    /**
     * Returns a HTML encoded value containing the other fields this
     * field depends on
     * @param  \Backend\Classes\FormField $field
     * @return string
     */
    protected function getFieldDepends($field)
    {
        if (!$field->dependsOn) {
            return '';
        }

        $dependsOn = is_array($field->dependsOn) ? $field->dependsOn : [$field->dependsOn];
        $dependsOn = htmlspecialchars(json_encode($dependsOn), ENT_QUOTES, 'UTF-8');
        return $dependsOn;
    }

    /**
     * Helper method to determine if field should be rendered
     * with label and comments.
     * @param  \Backend\Classes\FormField $field
     * @return boolean
     */
    protected function showFieldLabels($field)
    {
        if (in_array($field->type, ['checkbox', 'switch', 'section'])) {
            return false;
        }

        if ($field->type === 'widget') {
            return $this->makeFormFieldWidget($field)->showLabels;
        }

        return true;
    }

    /**
     * Returns post data from a submitted form.
     *
     * @return array
     */
    public function getSaveData()
    {
        $this->defineFormFields();

        $result = [];

        /*
         * Source data
         */
        $data = $this->arrayName ? post($this->arrayName) : post();
        if (!$data) {
            $data = [];
        }

        /*
         * Spin over each field and extract the postback value
         */
        foreach ($this->allFields as $field) {
            /*
             * Disabled and hidden should be omitted from data set
             */
            if ($field->disabled || $field->hidden) {
                continue;
            }

            /*
             * Handle HTML array, eg: item[key][another]
             */
            $parts = HtmlHelper::nameToArray($field->fieldName);
            if (($value = $this->dataArrayGet($data, $parts)) !== null) {

                /*
                 * Number fields should be converted to integers
                 */
                if ($field->type === 'number') {
                    $value = !strlen(trim($value)) ? null : (float) $value;
                }

                $this->dataArraySet($result, $parts, $value);
            }
        }

        /*
         * Give widgets an opportunity to process the data.
         */
        foreach ($this->formWidgets as $field => $widget) {
            $parts = HtmlHelper::nameToArray($field);

            $widgetValue = $widget->getSaveValue($this->dataArrayGet($result, $parts));
            $this->dataArraySet($result, $parts, $widgetValue);
        }

        return $result;
    }

    /*
     * Allow the model to filter fields.
     */
    protected function applyFiltersFromModel()
    {
        /*
         * Standard usage
         */
        if (method_exists($this->model, 'filterFields')) {
            $this->model->filterFields((object) $this->allFields, $this->getContext());
        }

        /*
         * Advanced usage
         */
        if (method_exists($this->model, 'fireEvent')) {
            /**
             * @event model.form.filterFields
             * Called after the form is initialized
             *
             * Example usage:
             *
             *     $model->bindEvent('model.form.filterFields', function ((\Backend\Widgets\Form) $formWidget, (stdClass) $fields, (string) $context) use (\October\Rain\Database\Model $model) {
             *         if ($model->source_type == 'http') {
             *             $fields->source_url->hidden = false;
             *             $fields->git_branch->hidden = true;
             *         } elseif ($model->source_type == 'git') {
             *             $fields->source_url->hidden = false;
             *             $fields->git_branch->hidden = false;
             *         } else {
             *             $fields->source_url->hidden = true;
             *             $fields->git_branch->hidden = true;
             *         }
             *     });
             *
             */
            $this->model->fireEvent('model.form.filterFields', [$this, (object) $this->allFields, $this->getContext()]);
        }
    }

    /**
     * Looks at the model for defined options.
     *
     * @param $field
     * @param $fieldOptions
     * @return mixed
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

            try {
                list($model, $attribute) = $field->resolveModelAttribute($this->model, $field->fieldName);
            }
            catch (Exception $ex) {
                throw new ApplicationException(Lang::get('backend::lang.field.options_method_invalid_model', [
                    'model' => get_class($this->model),
                    'field' => $field->fieldName
                ]));
            }

            $methodName = 'get'.studly_case($attribute).'Options';
            if (
                !$this->objectMethodExists($model, $methodName) &&
                !$this->objectMethodExists($model, 'getDropdownOptions')
            ) {
                throw new ApplicationException(Lang::get('backend::lang.field.options_method_not_exists', [
                    'model'  => get_class($model),
                    'method' => $methodName,
                    'field'  => $field->fieldName
                ]));
            }

            if ($this->objectMethodExists($model, $methodName)) {
                $fieldOptions = $model->$methodName($field->value, $this->data);
            }
            else {
                $fieldOptions = $model->getDropdownOptions($attribute, $field->value, $this->data);
            }
        }
        /*
         * Field options are an explicit method reference
         */
        elseif (is_string($fieldOptions)) {
            if (!$this->objectMethodExists($this->model, $fieldOptions)) {
                throw new ApplicationException(Lang::get('backend::lang.field.options_method_not_exists', [
                    'model'  => get_class($this->model),
                    'method' => $fieldOptions,
                    'field'  => $field->fieldName
                ]));
            }

            $fieldOptions = $this->model->$fieldOptions($field->value, $field->fieldName, $this->data);
        }

        return $fieldOptions;
    }

    /**
     * Returns the active session key.
     *
     * @return \Illuminate\Routing\Route|mixed|string
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
     *
     * @return string
     */
    public function getContext()
    {
        return $this->context;
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

    /**
     * Variant to array_get() but preserves dots in key names.
     *
     * @param array $array
     * @param array $parts
     * @param null $default
     * @return array|null
     */
    protected function dataArrayGet(array $array, array $parts, $default = null)
    {
        if ($parts === null) {
            return $array;
        }

        if (count($parts) === 1) {
            $key = array_shift($parts);
            if (isset($array[$key])) {
                return $array[$key];
            }

            return $default;
        }

        foreach ($parts as $segment) {
            if (!is_array($array) || !array_key_exists($segment, $array)) {
                return $default;
            }

            $array = $array[$segment];
        }

        return $array;
    }

    /**
     * Variant to array_set() but preserves dots in key names.
     *
     * @param array $array
     * @param array $parts
     * @param string $value
     * @return array
     */
    protected function dataArraySet(array &$array, array $parts, $value)
    {
        if ($parts === null) {
            return $value;
        }

        while (count($parts) > 1) {
            $key = array_shift($parts);

            if (!isset($array[$key]) || !is_array($array[$key])) {
                $array[$key] = [];
            }

            $array =& $array[$key];
        }

        $array[array_shift($parts)] = $value;

        return $array;
    }
}
