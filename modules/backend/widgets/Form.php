<?php namespace Backend\Widgets;

use Lang;
use Form as FormHelper;
use Backend\Classes\FormTabs;
use Backend\Classes\FormField;
use Backend\Classes\WidgetBase;
use October\Rain\Element\ElementHolder;
use October\Contracts\Element\FormElement;
use October\Rain\Database\Model;
use October\Rain\Html\Helper as HtmlHelper;
use SystemException;
use UnitEnum;

/**
 * Form Widget is used for building back end forms and renders a form
 *
 * @package october\backend
 * @author Alexey Bobkov, Samuel Georges
 */
class Form extends WidgetBase implements FormElement
{
    use \Backend\Widgets\Form\IsFormElement;
    use \Backend\Widgets\Form\FieldProcessor;
    use \Backend\Widgets\Form\HasFormWidgets;
    use \Backend\Traits\FormModelSaver;

    //
    // Configurable Properties
    //

    /**
     * @var array fields configuration.
     */
    public $fields;

    /**
     * @var array tabs (primary) configuration.
     */
    public $tabs;

    /**
     * @var array secondaryTabs configuration.
     */
    public $secondaryTabs;

    /**
     * @var Model model object for the form.
     */
    public $model;

    /**
     * @var array data containing field values, if none supplied, model is used.
     */
    public $data;

    /**
     * @var string context of this form, fields that do not belong
     * to this context will not be shown.
     */
    public $context;

    /**
     * @var string arrayName if the field element names should be contained in an array.
     * Eg: `<input name="nameArray[fieldName]" />`
     */
    public $arrayName;

    /**
     * @var bool isNested is used to flag that this form is being rendered as part of another form,
     * a good indicator to expect that the form model and dataset values will differ.
     */
    public $isNested = false;

    //
    // Object Properties
    //

    /**
     * @inheritDoc
     */
    protected $defaultAlias = 'form';

    /**
     * @var boolean fieldsDefined determines if field definitions have been created.
     */
    protected $fieldsDefined = false;

    /**
     * @var array allFields used in this form.
     * @see \Backend\Classes\FormField
     */
    protected $allFields = [];

    /**
     * @var object allTabs sections used in this form.
     * @see \Backend\Classes\FormTabs
     */
    protected $allTabs = [
        'outside' => null,
        'primary' => null,
        'secondary' => null,
    ];

    /**
     * @var array saveDataOverride allows for values to be changed during the save process
     */
    protected $saveDataOverride;

    /**
     * @var string sessionKey for the active session, used for editing forms and deferred bindings.
     */
    public $sessionKey;

    /**
     * @var string sessionKeySuffix adds some extra uniqueness to the session key.
     */
    public $sessionKeySuffix;

    /**
     * @var string|null parentFieldName if this form is nested in a field.
     */
    public $parentFieldName = null;

    /**
     * @var bool previewMode renders this form with uneditable preview data.
     */
    public $previewMode = false;

    /**
     * @var bool surveyMode renders this form using a survey layout (no tabs)
     */
    public $surveyMode = false;

    /**
     * @var bool horizontalMode renders this form using a horizontal layout
     */
    public $horizontalMode = false;

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
            'sessionKey',
            'sessionKeySuffix',
            'parentFieldName',
            'previewMode',
            'surveyMode',
            'horizontalMode',
        ]);

        $this->initFormWidgetsConcern();
        $this->initFormTabs();
        $this->validateModel();
    }

    /**
     * bindToController ensure fields are defined and form widgets are registered so they
     * can also be bound to the controller this allows their AJAX features to operate.
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
        $this->addJs('js/october.form.js');
    }

    /**
     * render the widget.
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
        $this->defineFormFields();
        $this->applyFiltersFromModel();
        $this->prepareVars();

        // Custom options
        if (isset($options['preview'])) {
            $this->previewMode = $options['preview'];
        }

        if (isset($options['surveyMode'])) {
            $this->surveyMode = $options['surveyMode'];
        }

        $options['useContainer'] ??= true;
        $options['section'] ??= null;

        $extraVars = [];
        $targetPartial = 'form';

        // Determine the partial to use based on the supplied section option
        if ($section = $options['section']) {
            $section = strtolower($section);

            if (isset($this->allTabs->{$section})) {
                $extraVars['tabs'] = $this->allTabs->{$section};
            }

            $targetPartial = 'section';
            $extraVars['renderSection'] = $section;
        }

        // Apply a container to the element
        if ($options['useContainer']) {
            $targetPartial = $section ? 'section-container' : 'form-container';
        }

        // Force preview mode on all widgets
        if ($this->previewMode) {
            foreach ($this->formWidgets as $widget) {
                $widget->previewMode = $this->previewMode;
            }
        }

        return $this->makePartial($targetPartial, $extraVars);
    }

    /**
     * renderFields renders the specified fields.
     * @deprecated use `render(['primaryTab' => 'My Tab'])`
     */
    public function renderFields(array $fields): string
    {
        return $this->makePartial('form_fields', ['fields' => $fields]);
    }

    /**
     * renderTabSection renders the specified tabs.
     * @deprecated use `render(['section' => 'outside', 'useContainer' => false])`
     */
    public function renderTabSection($tabs): string
    {
        return $this->makePartial('section', ['tabs' => $tabs]);
    }

    /**
     * renderField
     */
    public function renderTab($tabName, $options = [])
    {
        $this->defineFormFields();
        $this->prepareVars();

        $options['secondaryTab'] ??= false;

        // Render a secondary tab
        if ($options['secondaryTab']) {
            $extraVars['fields'] = array_get($this->allTabs->secondary->getFields(), $tabName, []);
        }
        else {
            $extraVars['fields'] = array_get($this->allTabs->primary->getFields(), $tabName, []);
        }

        return $this->makePartial('form_fields', $extraVars);
    }

    /**
     * renderField renders a single form field
     *
     * Options:
     *  - useContainer: Wrap the result in a container, used by AJAX. Default: true
     *
     * @param \Backend\Classes\FormField|string $field The field name or definition
     * @param array $options
     * @return string|bool The rendered partial contents, or false if suppressing an exception
     */
    public function renderField($field, $options = [])
    {
        $this->defineFormFields();
        $this->prepareVars();

        if (is_string($field)) {
            if (!isset($this->allFields[$field])) {
                throw new SystemException(Lang::get(
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
     * renderFieldElement renders the HTML element for a field
     * @param \Backend\Classes\FormField|string $field
     * @return string|bool The rendered partial contents, or false if suppressing an exception
     */
    public function renderFieldElement($field)
    {
        if (is_string($field)) {
            if (!isset($this->allFields[$field])) {
                throw new SystemException(Lang::get(
                    'backend::lang.form.missing_definition',
                    compact('field')
                ));
            }

            $field = $this->allFields[$field];
        }

        return $this->makePartial('field_' . $field->type, [
            'field' => $field,
            'formModel' => $this->model
        ]);
    }

    /**
     * initFormTabs
     */
    protected function initFormTabs()
    {
        $this->allTabs = (object) $this->allTabs;
        $this->allTabs->outside = new FormTabs(['section' => FormTabs::SECTION_OUTSIDE]);
        $this->allTabs->primary = new FormTabs(['section' => FormTabs::SECTION_PRIMARY]);
        $this->allTabs->secondary = new FormTabs(['section' => FormTabs::SECTION_SECONDARY]);
    }

    /**
     * validateModel validates the supplied form model.
     * @return mixed
     */
    protected function validateModel()
    {
        if (!$this->model) {
            throw new SystemException(Lang::get(
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
     * prepareVars prepares the form data
     */
    protected function prepareVars()
    {
        $this->vars['sessionKey'] = $this->getSessionKey();
        $this->vars['outsideTabs'] = $this->allTabs->outside;
        $this->vars['primaryTabs'] = $this->allTabs->primary;
        $this->vars['secondaryTabs'] = $this->allTabs->secondary;
    }

    /**
     * setFormValues sets or resets form field values.
     * @param array $data
     * @return array
     */
    public function setFormValues($data = null)
    {
        $data = $this->setFormValuesInternal($data);

        // Notify form widgets new form field values
        foreach ($this->formWidgets as $widget) {
            $widget->model = $this->model;
            $widget->resetFormValue();
        }

        return $data;
    }

    /**
     * setFormValuesInternal method delays resetting form widgets
     * @param array $data
     * @return array
     */
    protected function setFormValuesInternal($data = null)
    {
        if ($data === null) {
            $data = $this->getSaveData();
        }

        // Fill the model as if it were to be saved
        if (!$this->isNested) {
            $this->prepareModelsToSave($this->model, $data);
        }

        // Data set differs from model
        if ($this->data !== $this->model) {
            $this->data = (object) array_merge((array) $this->data, (array) $data);
        }

        // Set field values from data source
        foreach ($this->allFields as $field) {
            $field->value = $this->getFieldValue($field);
        }

        return $data;
    }

    /**
     * onRefresh event handler for refreshing the form.
     *
     * @return array
     */
    public function onRefresh()
    {
        $result = [];
        $saveData = $this->getSaveDataInternal();
        $this->context = FormField::CONTEXT_REFRESH;

        /**
         * @event backend.form.beforeRefresh
         * Called before the form is refreshed, modify the $dataHolder->data property in place
         *
         * Example usage:
         *
         *     Event::listen('backend.form.beforeRefresh', function ((\Backend\Widgets\Form) $formWidget, (stdClass) $dataHolder) {
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

        // Set the form variables and prepare the widget
        $this->setFormValuesInternal($saveData);
        $this->applyFiltersFromModel();
        $this->prepareVars();

        /**
         * @event backend.form.refreshFields
         * Called when the form is refreshed, giving the opportunity to modify the form fields
         *
         * Example usage:
         *
         *     Event::listen('backend.form.refreshFields', function ((\Backend\Widgets\Form) $formWidget, (array) $allFields) {
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

        // If an array of fields is supplied, update specified fields individually.
        if (($updateFields = post('fields')) && is_array($updateFields)) {
            foreach ($updateFields as $field) {
                if (!isset($this->allFields[$field])) {
                    continue;
                }

                $fieldObject = $this->allFields[$field];
                $result['#' . $fieldObject->getId('group')] = $this->makePartial('field', ['field' => $fieldObject]);
            }
        }

        // Update the whole form
        if (empty($result)) {
            $result = ['#'.$this->getId() => $this->makePartial('form')];
        }

        /**
         * @event backend.form.refresh
         * Called after the form is refreshed, should return an array of additional result parameters.
         *
         * Example usage:
         *
         *     Event::listen('backend.form.refresh', function ((\Backend\Widgets\Form) $formWidget, (array) $result) {
         *         $result['#my-partial-id' => $formWidget->makePartial('$/path/to/custom/backend/_partial.php')];
         *         return $result;
         *     });
         *
         * Or
         *
         *     $formWidget->bindEvent('form.refresh', function ((array) $result) use ((\Backend\Widgets\Form $formWidget)) {
         *         $result['#my-partial-id' => $formWidget->makePartial('$/path/to/custom/backend/_partial.php')];
         *         return $result;
         *     });
         *
         */
        $eventResults = $this->fireSystemEvent('backend.form.refresh', [$result], false);

        foreach ($eventResults as $eventResult) {
            if (!is_array($eventResult)) {
                continue;
            }

            $result = $eventResult + $result;
        }

        return $result;
    }

    /**
     * onLazyLoadTab renders all fields of a tab in the target tab pane
     */
    public function onLazyLoadTab()
    {
        $target  = post('target');

        if (!$tabName = post('name')) {
            throw new SystemException(Lang::get('backend::lang.form.missing_tab'));
        }

        $tab = $this->getTab(post('section', 'primary'));

        $fields = $tab !== null ? array_get($tab->getFields(), $tabName) : [];

        return [
            $target => $this->makePartial('form_fields', ['fields' => $fields]),
        ];
    }

    /**
     * defineFormFields creates a flat array of form fields from the configuration
     * and slots fields in to their respective tabs
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
         *     Event::listen('backend.form.extendFieldsBefore', function ((\Backend\Widgets\Form) $widget) {
         *         // You should always check to see if you're extending correct model/controller
         *         if (!$widget->model instanceof \Foo\Example\Models\Bar) {
         *             return;
         *         }
         *
         *         // Add a new field named example_field
         *         $widget->addField('example_field', [
         *             'label' => 'Example field',
         *             'comment' => 'Your example field',
         *             'type' => 'text'
         *         ]);
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
         *         // Add a new field named example_field
         *         $widget->addField('example_field', [
         *             'label' => 'Example field',
         *             'comment' => 'Your example field',
         *             'type' => 'text'
         *         ]);
         *     });
         *
         */
        $this->fireSystemEvent('backend.form.extendFieldsBefore');

        // Configure tabs
        $this->allTabs->primary->useConfig((array) $this->tabs);
        $this->allTabs->secondary->useConfig((array) $this->secondaryTabs);

        // Outside fields
        if (!isset($this->fields) || !is_array($this->fields)) {
            $this->fields = [];
        }

        if ($this->fields) {
            $this->addFields($this->fields);
        }
        else {
            $this->addFieldsFromModel();
        }

        // Primary Tabs + Fields
        if (!isset($this->tabs['fields']) || !is_array($this->tabs['fields'])) {
            $this->tabs['fields'] = [];
        }

        if ($this->tabs['fields']) {
            $this->addFields($this->tabs['fields'], FormTabs::SECTION_PRIMARY);
        }
        else {
            $this->addFieldsFromModel(FormTabs::SECTION_PRIMARY);
        }

        // Secondary Tabs + Fields
        if (!isset($this->secondaryTabs['fields']) || !is_array($this->secondaryTabs['fields'])) {
            $this->secondaryTabs['fields'] = [];
        }

        if ($this->secondaryTabs['fields']) {
            $this->addFields($this->secondaryTabs['fields'], FormTabs::SECTION_SECONDARY);
        }
        else {
            $this->addFieldsFromModel(FormTabs::SECTION_SECONDARY);
        }

        /**
         * @event backend.form.extendFields
         * Called after the form fields are defined
         *
         * Example usage:
         *
         *     Event::listen('backend.form.extendFields', function ((\Backend\Widgets\Form) $widget) {
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
        $this->fireSystemEvent('backend.form.extendFields', [new ElementHolder($this->allFields)]);

        // Apply post processing
        $this->processPermissionCheck($this->allFields);
        $this->processFormWidgetFields($this->allFields);
        $this->processValidationAttributes($this->allFields);
        $this->processFieldOptionValues($this->allFields);

        // Model based processing
        if ($this->model && $this->model instanceof \October\Rain\Database\Model) {
            if ($this->model->isClassInstanceOf(\October\Contracts\Database\ValidationInterface::class)) {
                $this->processRequiredAttributes($this->allFields);
            }

            if ($this->model->isClassInstanceOf(\October\Contracts\Database\MultisiteInterface::class)) {
                $this->processTranslatableAttributes($this->allFields);
            }
        }

        // Set field values from data source, if not from the outside
        foreach ($this->allFields as $field) {
            if ($field->value === null) {
                $field->value = $this->getFieldValue($field);
            }
        }

        // Apply a default order and sort fields
        $this->processAutoOrder($this->allTabs->outside);
        $this->processAutoOrder($this->allTabs->primary);
        $this->processAutoOrder($this->allTabs->secondary);

        // Convert automatic spanned fields
        $this->processAutoSpan($this->allTabs->outside);
        $this->processAutoSpan($this->allTabs->primary);
        $this->processAutoSpan($this->allTabs->secondary);

        // At least one tab section should stretch
        if (
            $this->allTabs->secondary->stretch === null
            && $this->allTabs->primary->stretch === null
            && $this->allTabs->outside->stretch === null
        ) {
            if ($this->allTabs->secondary->hasFields()) {
                $this->allTabs->secondary->stretch();
            }
            elseif ($this->allTabs->primary->hasFields()) {
                $this->allTabs->primary->stretch();
            }
            else {
                $this->allTabs->outside->stretch();
            }
        }

        $this->fieldsDefined = true;
    }

    /**
     * addFields programmatically, used internally and for extensibility
     * @param array $fields
     * @param string $inSection
     */
    public function addFields(array $fields, ?string $inSection = null): ElementHolder
    {
        $built = [];
        foreach ($fields as $name => $config) {
            $fieldObj = $built[$name] = $this->makeFormField($name, $config);

            // Check form field matches the active context
            if (!$fieldObj->matchesContext($this->getContext())) {
                continue;
            }

            // Field name without @context suffix
            $fieldName = $fieldObj->fieldName;

            $this->allFields[$fieldName] = $fieldObj;

            switch (strtolower((string) $inSection)) {
                case FormTabs::SECTION_PRIMARY:
                    $this->allTabs->primary->addField($fieldName, $fieldObj);
                    break;
                case FormTabs::SECTION_SECONDARY:
                    $this->allTabs->secondary->addField($fieldName, $fieldObj);
                    break;
                default:
                    $this->allTabs->outside->addField($fieldName, $fieldObj);
                    break;
            }
        }

        return new ElementHolder($built);
    }

    /**
     * addField
     */
    public function addField($name, $config = []): FormField
    {
        if (is_string($config)) {
            $config = ['label' => $config];
        }

        return $this->addFields([$name => $config])->$name;
    }

    /**
     * addTabFields
     */
    public function addTabFields(array $fields): ElementHolder
    {
        return $this->addFields($fields, FormTabs::SECTION_PRIMARY);
    }

    /**
     * addTabField
     */
    public function addTabField($name, $config = []): FormField
    {
        if (is_string($config)) {
            $config = ['label' => $config];
        }

        return $this->addTabFields([$name => $config])->$name;
    }

    /**
     * addSecondaryTabFields
     */
    public function addSecondaryTabFields(array $fields): ElementHolder
    {
        return $this->addFields($fields, FormTabs::SECTION_SECONDARY);
    }

    /**
     * addSecondaryTabField
     */
    public function addSecondaryTabField($name, $config = []): FormField
    {
        if (is_string($config)) {
            $config = ['label' => $config];
        }

        return $this->addSecondaryTabFields([$name => $config])->$name;
    }

    /**
     * removeField programmatically
     */
    public function removeField($name): bool
    {
        if (!isset($this->allFields[$name])) {
            return false;
        }

        // Remove from tabs
        $this->allTabs->primary->removeField($name);
        $this->allTabs->secondary->removeField($name);
        $this->allTabs->outside->removeField($name);

        // Remove from main collection
        unset($this->allFields[$name]);

        return true;
    }

    /**
     * removeTab programmatically remove all fields belonging to a tab
     * @param string $name
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
     * makeFormField creates a form field object from name and configuration
     */
    protected function makeFormField(string $name, $config = []): FormField
    {
        $label = $config['label'] ?? null;
        [$fieldName, $fieldContext] = $this->evalFieldName($name);

        $field = new FormField([
            'fieldName' => $fieldName,
            'label' => $label,
            'arrayName' => $this->arrayName,
            'idPrefix' => $this->getId()
        ]);

        if ($fieldContext) {
            $field->context($fieldContext);
        }

        if (is_string($config)) {
            $field->displayAs($config);
        }
        else {
            $fieldType = $config['type'] ?? null;
            if (!is_string($fieldType) && $fieldType !== null) {
                throw new SystemException(Lang::get(
                    'backend::lang.field.invalid_type',
                    ['type' => gettype($fieldType)]
                ));
            }

            if ($config) {
                $field->useConfig($config);
            }

            if ($fieldType) {
                $field->displayAs($fieldType);
            }
        }

        return $field;
    }

    /**
     * getFields for the instance
     */
    public function getFields(): array
    {
        return $this->allFields;
    }

    /**
     * getField object specified
     */
    public function getField(string $field)
    {
        if (isset($this->allFields[$field])) {
            return $this->allFields[$field];
        }

        return null;
    }

    /**
     * getTabs for the instance
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
     * evalFieldName parses a field's name for embedded context
     * with a result of fieldName@context to [fieldName, context]
     */
    protected function evalFieldName(string $field): array
    {
        if (strpos($field, '@') === false) {
            return [$field, null];
        }

        return explode('@', $field);
    }

    /**
     * hasFieldValue determines if the field value is found in the data.
     */
    protected function hasFieldValue($field, $data = null): bool
    {
        return $field->getValueFromData($data, FormField::NO_SAVE_DATA) !== FormField::NO_SAVE_DATA;
    }

    /**
     * getFieldValue looks up the field value.
     * @param mixed $field
     * @param mixed $data
     * @return string
     */
    protected function getFieldValue($field, $data = null)
    {
        if ($data === null) {
            $data = $this->data;
        }

        if (is_string($field)) {
            if (!isset($this->allFields[$field])) {
                throw new SystemException(Lang::get(
                    'backend::lang.form.missing_definition',
                    ['field' => $field]
                ));
            }

            $field = $this->allFields[$field];
        }

        $defaultValue = $this->useDefaultValues()
            ? $field->getDefaultFromData($data)
            : null;

        // Default value might be a translatable string
        $defaultValue = is_string($defaultValue) ? __($defaultValue) : $defaultValue;

        // Ask the field for the value
        $value = $field->getValueFromData($data, $defaultValue);

        // Cast enums to scalar
        if ($value instanceof UnitEnum) {
            $value = $value->value;
        }

        return $value;
    }

    /**
     * useDefaultValues determines when to apply default data, usually when the context
     * is "create", the model is non-existent or the form is nested.
     */
    protected function useDefaultValues(): bool
    {
        return $this->context === FormField::CONTEXT_CREATE || $this->isNested || !$this->model->exists;
    }

    /**
     * getFieldDepends returns a HTML encoded value containing the other fields
     * this field depends on
     * @param \Backend\Classes\FormField $field
     */
    protected function getFieldDepends($field): string
    {
        if (!$field->dependsOn) {
            return '';
        }

        $dependsOn = is_array($field->dependsOn) ? $field->dependsOn : [$field->dependsOn];

        $dependsOn = htmlspecialchars(json_encode($dependsOn), ENT_QUOTES, 'UTF-8');

        return $dependsOn;
    }

    /**
     * showFieldLabels is a helper method to determine if field should be rendered
     * with label and comments.
     */
    protected function showFieldLabels(FormField $field): bool
    {
        if (in_array($field->type, ['checkbox', 'switch', 'section', 'hint', 'ruler'])) {
            return false;
        }

        if ($field->type === 'widget') {
            return (bool) ($this->makeFormFieldWidget($field)->showLabels ?? true);
        }

        return true;
    }

    /**
     * getFieldTooltipValue looks up the field tooltip value
     * @param \Backend\Classes\FormField $field
     * @return string
     */
    public function getFieldTooltipValue($field)
    {
        return Lang::get($field->tooltip['title'] ?? $field->tooltip);
    }

    /**
     * getSaveData returns post data from a submitted form.
     * @return array
     */
    public function getSaveData()
    {
        $this->defineFormFields();

        $saveData = $this->getSaveDataInternal();

        $this->applyFiltersFromModel($saveData);

        return $this->cleanSaveDataInternal($saveData);
    }

    /**
     * setSaveDataOverride will override the save data captured by the form
     */
    public function setSaveDataOverride($key, $value)
    {
        $this->saveDataOverride[$key] = $value;
    }

    /**
     * getSaveDataInternal will return all possible data to save
     */
    protected function getSaveDataInternal(): array
    {
        $this->defineFormFields();

        $result = [];
        $data = $this->getSaveDataSourceInternal();

        // Spin over each field and extract the postback value
        foreach ($this->allFields as $name => $field) {
            // Handle HTML array, eg: item[key][another]
            $parts = HtmlHelper::nameToArray($name);
            if (($value = $this->dataArrayGet($data, $parts)) !== null) {
                // Convert number to float
                if ($field->type === 'number') {
                    $value = !strlen(trim($value)) ? null : (float) $value;
                }

                $this->dataArraySet($result, $parts, $value);
            }
        }

        // Give widgets an opportunity to process the data.
        foreach ($this->formWidgets as $field => $widget) {
            // Handle HTML array, eg: item[key][another]
            $parts = HtmlHelper::nameToArray($field);
            if (($value = $this->dataArrayGet($data, $parts)) !== null) {
                $widgetValue = $widget->getSaveValue($value);
                $this->dataArraySet($result, $parts, $widgetValue);
            }
        }

        return $result;
    }

    /**
     * getSaveDataSourceInternal
     */
    protected function getSaveDataSourceInternal(): array
    {
        $data = $this->arrayName ? post($this->arrayName) : post();
        if (!$data) {
            $data = [];
        }

        if (is_array($this->saveDataOverride)) {
            $data = array_merge($data, $this->saveDataOverride);
        }

        return $data;
    }

    /**
     * cleanSaveDataInternal will purge disabled and hidden fields from the dataset
     */
    protected function cleanSaveDataInternal(array $data): array
    {
        foreach ($this->allFields as $name => $field) {
            if ($field->disabled || $field->hidden) {
                $parts = HtmlHelper::nameToArray($name);
                $this->dataArrayForget($data, $parts);
            }
        }

        return $data;
    }

    /**
     * applyFiltersFromModel allows the model to filter fields
     */
    protected function applyFiltersFromModel($applyData = null)
    {
        $targetModel = clone $this->model;

        // Apply specified data before filtering
        if ($applyData) {
            if (!$this->isNested) {
                $this->prepareModelsToSave($targetModel, $applyData);
            }

            foreach ($this->allFields as $field) {
                if ($this->hasFieldValue($field, $applyData)) {
                    $field->value = $this->getFieldValue($field, $applyData);
                }
            }
        }

        // For passing to events
        $holder = new ElementHolder($this->allFields);

        // Standard usage
        if (method_exists($targetModel, 'filterFields')) {
            $targetModel->filterFields($holder, $this->getContext());
        }

        // Advanced usage
        if (method_exists($targetModel, 'fireEvent')) {
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
             *         }
             *         elseif ($model->source_type == 'git') {
             *             $fields->source_url->hidden = false;
             *             $fields->git_branch->hidden = false;
             *         }
             *         else {
             *             $fields->source_url->hidden = true;
             *             $fields->git_branch->hidden = true;
             *         }
             *     });
             *
             */
            $targetModel->fireEvent('model.form.filterFields', [$this, $holder, $this->getContext()]);
        }

        // Reset widgets if they have been accessed
        foreach ($holder->getTouchedElements() as $name => $field) {
            if (isset($this->formWidgets[$name])) {
                $this->formWidgets[$name]->resetFormValue();
            }
        }
    }

    /**
     * getSessionKey returns the active session key.
     * @return string
     */
    public function getSessionKey()
    {
        if ($this->sessionKey) {
            return $this->sessionKey;
        }

        $sessionKey = post('_session_key');

        if (!$sessionKey) {
            $sessionKey = FormHelper::getSessionKey();
        }

        return $this->sessionKey = $sessionKey;
    }

    /**
     * getSessionKeyWithSuffix
     * @return string
     */
    public function getSessionKeyWithSuffix()
    {
        return $this->getSessionKey() . $this->sessionKeySuffix;
    }

    /**
     * getModel returns the active model for this form.
     * @return \Model|null
     */
    public function getModel()
    {
        return $this->model;
    }

    /**
     * getContext returns the active context for displaying the form.
     * @return string
     */
    public function getContext()
    {
        return $this->context;
    }

    /**
     * Variant to array_get() but preserves dots in key names.
     *
     * @param array $array
     * @param array $parts
     * @param null $default
     * @return mixed
     */
    protected function dataArrayGet(array $array, array $parts, $default = null)
    {
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

    /**
     * Variant to array_forget() but preserves dots in key names.
     *
     * @param array $array
     * @param array $parts
     * @return void
     */
    protected function dataArrayForget(array &$array, array $parts)
    {
        while (count($parts) > 1) {
            $part = array_shift($parts);

            if (isset($array[$part]) && is_array($array[$part])) {
                $array = &$array[$part];
            }
            else {
                return;
            }
        }

        unset($array[array_shift($parts)]);
    }
}
