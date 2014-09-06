<?php namespace Backend\Classes;

use Str;

/**
 * Form Widget base class
 * Widgets used specifically for forms
 *
 * @package october\backend
 * @author Alexey Bobkov, Samuel Georges
 */
abstract class FormWidgetBase extends WidgetBase
{

    /**
     * @var FormField Object containing general form field information.
     */
    public $formField;

    /**
     * @var string Form field column name.
     */
    public $columnName;

    /**
     * @var mixed Model object.
     */
    public $model;

    /**
     * @var string Active session key, used for editing forms and deferred bindings.
     */
    public $sessionKey;

    /**
     * @var bool Render this form with uneditable preview data.
     */
    public $previewMode = false;

    /**
     * @var int Value returned when the widget should not contribute any save data.
     */
    const NO_SAVE_DATA = -1;

    /**
     * Constructor
     * @param $controller Controller Active controller object.
     * @param $model Model The relevant model to reference.
     * @param $formField FormField Object containing general form field information.
     * @param $configuration array Configuration the relates to this widget.
     */
    public function __construct($controller, $model, $formField, $configuration = [])
    {
        $this->formField = $formField;
        $this->columnName = $formField->columnName;
        $this->model = $model;
        if (isset($configuration->sessionKey)) $this->sessionKey = $configuration->sessionKey;
        if (isset($configuration->previewMode)) $this->previewMode = $configuration->previewMode;

        /*
         * Form fields originally passed their configuration via the options index.
         * This step should be removed if year >= 2015.
         */
        if (isset($configuration->options)) $configuration = array_merge($configuration->options, (array)$configuration);

        parent::__construct($controller, $configuration);
    }

    /**
     * Returns a unique ID for this widget. Useful in creating HTML markup.
     */
    public function getId($suffix = null)
    {
        $id = parent::getId($suffix);
        $id .= '-' . $this->columnName;
        return Str::evalHtmlId($id);
    }

    /**
     * Process the postback data for this widget.
     * @param $value The existing value for this widget.
     * @return string The new value for this widget.
     */
    public function getSaveData($value)
    {
        return $value;
    }

}