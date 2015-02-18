<?php namespace Backend\Classes;

use Str;
use Html;
use Model;

/**
 * Form Field definition
 * A translation of the form field configuration
 *
 * @package october\backend
 * @author Alexey Bobkov, Samuel Georges
 */
class FormField
{
    /**
     * @var int Value returned when the form field should not contribute any save data.
     */
    const NO_SAVE_DATA = -1;

    /**
     * @var string Form field name.
     */
    public $fieldName;

    /**
     * @var string If the field element names should be contained in an array.
     * Eg: <input name="nameArray[fieldName]" />
     */
    public $arrayName;

    /**
     * @var string A prefix to the field identifier so it can be totally unique.
     */
    public $idPrefix;

    /**
     * @var string Form field label.
     */
    public $label;

    /**
     * @var string Form field value.
     */
    public $value;

    /**
     * @var string Model attribute to use for the display value.
     */
    public $valueFrom;

    /**
     * @var string Specifies if this field belongs to a tab.
     */
    public $tab;

    /**
     * @var string Display mode. Text, textarea
     */
    public $type = 'text';

    /**
     * @var string Field options.
     */
    public $options;

    /**
     * @var string Specifies a side. Possible values: auto, left, right, full.
     */
    public $span = 'full';

    /**
     * @var string Specifies a size. Possible values: tiny, small, large, huge, giant.
     */
    public $size = 'large';

    /**
     * @var string Specifies contextual visibility of this form field.
     */
    public $context = null;

    /**
     * @var bool Specifies if this field is mandatory.
     */
    public $required = false;

    /**
     * @var bool Specify if the field is disabled or not.
     */
    public $disabled = false;

    /**
     * @var bool Specify if the field is hidden. Hiddens fields are not included in postbacks.
     */
    public $hidden = false;

    /**
     * @var bool Specifies if this field stretch to fit the page height.
     */
    public $stretch = false;

    /**
     * @var string Specifies a comment to accompany the field
     */
    public $comment;

    /**
     * @var string Specifies the comment position.
     */
    public $commentPosition = 'below';

    /**
     * @var string Specifies if the comment is in HTML format.
     */
    public $commentHtml = false;

    /**
     * @var string Specifies a default value for supported fields.
     */
    public $defaults;

    /**
     * @var string Specifies a message to display when there is no value supplied (placeholder).
     */
    public $placeholder;

    /**
     * @var array Contains a list of attributes specified in the field configuration.
     */
    public $attributes;

    /**
     * @var string Specifies a CSS class to attach to the field container.
     */
    public $cssClass;

    /**
     * @var string Specifies a path for partial-type fields.
     */
    public $path;

    /**
     * @var array Raw field configuration.
     */
    public $config;

    /**
     * @var array Other field names this field depends on, when the other fields are modified, this field will update.
     */
    public $dependsOn;

    /**
     * @var array Other field names this field can be triggered by, see the Trigger API documentation.
     */
    public $trigger;

    /**
     * Constructor.
     * @param string $fieldName
     * @param string $label
     */
    public function __construct($fieldName, $label)
    {
        $this->fieldName = $fieldName;
        $this->label = $label;
    }

    /**
     * If this field belongs to a tab.
     */
    public function tab($value)
    {
        $this->tab = $value;
        return $this;
    }

    /**
     * Sets a side of the field on a form.
     * @param string $value Specifies a side. Possible values: left, right, full
     */
    public function span($value = 'full')
    {
        $this->span = $value;
        return $this;
    }

    /**
     * Sets a side of the field on a form.
     * @param string $value Specifies a size. Possible values: tiny, small, large, huge, giant
     */
    public function size($value = 'large')
    {
        $this->size = $value;
        return $this;
    }

    /**
     * Sets field options, for dropdowns, radio lists and checkbox lists.
     * @param  array $value
     * @return self
     */
    public function options($value = null)
    {
        if ($value === null) {
            if (is_array($this->options)) {
                return $this->options;
            }
            elseif (is_callable($this->options)) {
                $callable = $this->options;
                return $callable();
            }

            return [];
        }
        else {
            $this->options = $value;
        }

        return $this;
    }

    /**
     * Specifies a field control rendering mode. Supported modes are:
     * - text - creates a text field. Default for varchar column types.
     * - textarea - creates a textarea control. Default for text column types.
     * - dropdown - creates a drop-down list. Default for reference-based columns.
     * - radio - creates a set of radio buttons.
     * - checkbox - creates a single checkbox.
     * - checkboxlist - creates a checkbox list.
     * @param string $type Specifies a render mode as described above
     * @param array $config A list of render mode specific config.
     */
    public function displayAs($type, $config = [])
    {
        $this->type = strtolower($type) ?: $this->type;
        $this->config = $this->evalConfig($config);
        return $this;
    }

    /**
     * Process options and apply them to this object.
     * @param array $config
     * @return array
     */
    protected function evalConfig($config)
    {
        if (isset($config['options'])) {
            $this->options($config['options']);
        }
        if (isset($config['span'])) {
            $this->span($config['span']);
        }
        if (isset($config['context'])) {
            $this->context = $config['context'];
        }
        if (isset($config['size'])) {
            $this->size($config['size']);
        }
        if (isset($config['tab'])) {
            $this->tab($config['tab']);
        }
        if (isset($config['commentAbove'])) {
            $this->comment($config['commentAbove'], 'above');
        }
        if (isset($config['comment'])) {
            $this->comment($config['comment']);
        }
        if (isset($config['placeholder'])) {
            $this->placeholder = $config['placeholder'];
        }
        if (isset($config['default'])) {
            $this->defaults = $config['default'];
        }
        if (isset($config['cssClass'])) {
            $this->cssClass = $config['cssClass'];
        }
        if (isset($config['attributes'])) {
            $this->attributes($config['attributes']);
        }
        if (isset($config['containerAttributes'])) {
            $this->attributes($config['containerAttributes'], 'container');
        }
        if (isset($config['dependsOn'])) {
            $this->dependsOn = $config['dependsOn'];
        }
        if (isset($config['trigger'])) {
            $this->trigger = $config['trigger'];
        }
        if (isset($config['path'])) {
            $this->path = $config['path'];
        }
        if (array_key_exists('required', $config)) {
            $this->required = $config['required'];
        }
        if (array_key_exists('disabled', $config)) {
            $this->disabled = $config['disabled'];
        }
        if (array_key_exists('hidden', $config)) {
            $this->hidden = $config['hidden'];
        }
        if (array_key_exists('stretch', $config)) {
            $this->stretch = $config['stretch'];
        }

        if (isset($config['valueFrom'])) {
            $this->valueFrom = $config['valueFrom'];
        }
        else {
            $this->valueFrom = $this->fieldName;
        }

        return $config;
    }

    /**
     * Adds a text comment above or below the field.
     * @param string $text Specifies a comment text.
     * @param string $position Specifies a comment position.
     * @param bool $isHtml Set to true if you use HTML formatting in the comment
     * Supported values are 'below' and 'above'
     */
    public function comment($text, $position = 'below', $isHtml = false)
    {
        $this->comment = $text;
        $this->commentPosition = $position;
        $this->commentHtml = $isHtml;
        return $this;
    }

    /**
     * Sets the attributes for this field in a given position.
     * - field: Attributes are added to the form field element (input, select, textarea, etc)
     * - container: Attributes are added to the form field container (div.form-group)
     * @param  array $items
     * @param  strubg $position
     * @return void
     */
    public function attributes($items, $position = 'field')
    {
        if (!is_array($items)) {
            return;
        }

        $multiArray = array_filter($items, 'is_array');
        if (!$multiArray) {
            $this->attributes[$position] = $items;
            return;
        }

        foreach ($items as $_position => $_items) {
            $this->attributes($_items, $_position);
        }
    }

    /**
     * Returns the attributes for this field at a given position.
     * @param  string $position
     * @return array
     */
    public function getAttributes($position = 'field', $htmlBuild = true)
    {
        $result = array_get($this->attributes, $position, []);
        $result = $this->filterAttributes($result, $position);
        return $htmlBuild ? Html::attributes($result) : $result;
    }

    /**
     * Adds any circumstantial attributes to the field based on other
     * settings, such as the 'trigger' option.
     * @param  array $attributes
     * @param  string $position
     * @return array
     */
    protected function filterAttributes($attributes, $position = 'field')
    {
        if (!$this->trigger || !is_array($this->trigger))
            return $attributes;

        $triggerAction = array_get($this->trigger, 'action');
        $triggerField = array_get($this->trigger, 'field');
        $triggerCondition = array_get($this->trigger, 'condition');

        // Apply these to container
        if (in_array($triggerAction, ['hide', 'show']) && $position != 'container')
            return $attributes;

        // Apply these to field/input
        if (in_array($triggerAction, ['enable', 'disable', 'empty']) && $position != 'field')
            return $attributes;

        if ($this->arrayName) {
            $fullTriggerField = $this->arrayName.'['.implode('][', Str::evalHtmlArray($triggerField)).']';
        }
        else {
            $fullTriggerField = $triggerField;
        }

        $newAttributes = [
            'data-trigger' => '[name="'.$fullTriggerField.'"]',
            'data-trigger-action' => $triggerAction,
            'data-trigger-condition' => $triggerCondition
        ];

        $attributes = $attributes + $newAttributes;
        return $attributes;
    }

    /**
     * Returns a value suitable for the field name property.
     * @param  string $arrayName Specify a custom array name
     * @return string
     */
    public function getName($arrayName = null)
    {
        if ($arrayName === null) {
            $arrayName = $this->arrayName;
        }

        if ($arrayName) {
            return $arrayName.'['.implode('][', Str::evalHtmlArray($this->fieldName)).']';
        }
        else {
            return $this->fieldName;
        }
    }

    /**
     * Returns a value suitable for the field id property.
     */
    public function getId($suffix = null)
    {
        $id = 'field';
        if ($this->arrayName) {
            $id .= '-'.$this->arrayName;
        }

        $id .= '-'.$this->fieldName;

        if ($suffix) {
            $id .= '-'.$suffix;
        }

        if ($this->idPrefix) {
            $id = $this->idPrefix . '-' . $id;
        }

        return Str::evalHtmlId($id);
    }

    /**
     * Returns this fields value from a supplied data set, which can be
     * an array or a model or another generic collection.
     * @param mixed $data
     * @return mixed
     */
    public function getValueFromData($data, $default = null)
    {
        $fieldName = $this->fieldName;

        /*
         * Array field name, eg: field[key][key2][key3]
         */
        $keyParts = Str::evalHtmlArray($fieldName);
        $lastField = end($keyParts);
        $result = $data;

        /*
         * Loop the field key parts and build a value.
         * To support relations only the last field should return the
         * relation value, all others will look up the relation object as normal.
         */
        foreach ($keyParts as $key) {

            if ($result instanceof Model && $result->hasRelation($key)) {
                if ($key == $lastField) {
                    $result = $result->getRelationValue($key) ?: $default;
                }
                else {
                    $result = $result->{$key};
                }
            }
            elseif (is_array($result)) {
                if (!array_key_exists($key, $result)) {
                    return $default;
                }
                $result = $result[$key];
            }
            else {
                if (!isset($result->{$key})) {
                    return $default;
                }
                $result = $result->{$key};
            }

        }

        return $result;
    }
}
