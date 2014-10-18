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
     * @var string Form field name.
     */
    public $fieldName;

    /**
     * @var string Model attribute to get/set value from.
     */
    public $valueFrom;

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
        $this->fieldName = $formField->fieldName;
        $this->valueFrom = $formField->valueFrom;
        $this->model = $model;

        // @todo Remove line if year >= 2015
        $this->columnName = $formField->valueFrom;

        if (isset($configuration->sessionKey)) {
            $this->sessionKey = $configuration->sessionKey;
        }
        if (isset($configuration->previewMode)) {
            $this->previewMode = $configuration->previewMode;
        }

        /*
         * Form fields originally passed their configuration via the options index.
         * This step should be removed if year >= 2015.
         */
        if (isset($configuration->options)) {
            $configuration = array_merge($configuration->options, (array) $configuration);
        }

        parent::__construct($controller, $configuration);
    }

    /**
     * Returns a unique ID for this widget. Useful in creating HTML markup.
     */
    public function getId($suffix = null)
    {
        $id = parent::getId($suffix);
        $id .= '-' . $this->fieldName;
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

    /**
     * Returns the value for this form field,
     * supports nesting via HTML array.
     * @return string
     */
    public function getLoadData()
    {
        list($model, $attribute) = $this->getModelArrayAttribute($this->valueFrom);
        return $model->{$attribute};
    }

    /**
     * Returns the final model and attribute name of
     * a nested HTML array attribute.
     * Eg: list($model, $attribute) = $this->getModelArrayAttribute($this->valueFrom);
     * @param  string $attribute.
     * @return array
     */
    public function getModelArrayAttribute($attribute)
    {
        $model = $this->model;
        $parts = Str::evalHtmlArray($attribute);
        $last = array_pop($parts);

        foreach ($parts as $part) {
            $model = $model->{$part};
        }

        return [$model, $last];
    }
}
