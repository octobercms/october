<?php namespace Backend\Classes;

use Str;
use Arr;
use Site;
use Html;
use Lang;
use October\Rain\Database\Model;
use October\Rain\Html\Helper as HtmlHelper;
use October\Rain\Element\Form\FieldDefinition;
use Illuminate\Support\Collection;
use SystemException;
use Exception;

/**
 * FormField definition is a translation of the form field configuration
 *
 * @method FormField arrayName(string $arrayName) arrayName if the field element names should be contained in an array.
 * @method FormField idPrefix(string $idPrefix) idPrefix to the field identifier so it can be totally unique.
 * @method FormField context(string $context) Specifies contextual visibility of this form field.
 * @method FormField required(bool $required) Specifies if this field is mandatory.
 * @method FormField translatable(bool $translatable) Specifies if this field supports translated values.
 * @method FormField stretch(bool $stretch) Specifies if this field stretch to fit the page height.
 * @method FormField attributes(array $attributes) Contains a list of attributes specified in the field configuration.
 * @method FormField containerAttributes(array $containerAttributes) Contains a list of attributes for the field container.
 * @method FormField cssClass(string $cssClass) Specifies a CSS class to attach to the field container.
 * @method FormField path(string $path) Specifies a path for partial-type fields.
 * @method FormField dependsOn(array $dependsOn) Other field names this field depends on, when the other fields are modified, this field will update.
 * @method FormField changeHandler(string $changeHandler) AJAX handler for the change event.
 * @method FormField trigger(array $trigger) Other field names this field can be triggered by, see the Trigger API documentation.
 * @method FormField preset(array $preset) Other field names text is converted in to a URL, slug or file name value in this field.
 * @method FormField permissions(array $permissions) permissions needed to view this field
 * @method FormField valueTrans(bool $valueTrans) valueTrans determines if display values (model attributes) should be translated
 * @method FormField tooltip(array|string $tooltip) tooltip to display next to the field label, as an array supports: title, placement, icon, isHtml
 *
 * @package october\backend
 * @author Alexey Bobkov, Samuel Georges
 */
class FormField extends FieldDefinition
{
    /**
     * @var int Value returned when the form field should not contribute any save data.
     */
    const NO_SAVE_DATA = -1;

    /**
     * @var string A special character in yaml config files to indicate a field higher in hierarchy
     */
    const HIERARCHY_UP = '^';

    /**
     * @var string Field contexts
     */
    const CONTEXT_CREATE = 'create';
    const CONTEXT_UPDATE = 'update';
    const CONTEXT_PREVIEW = 'preview';
    const CONTEXT_REFRESH = 'refresh';

    /**
     * __construct using old and new interface
     */
    public function __construct($config = [], $label = null)
    {
        // @deprecated old API
        if (!is_array($config)) {
            return parent::__construct([
                'fieldName' => $config,
                'label' => $label
            ]);
        }

        parent::__construct($config);
    }

    /**
     * initDefaultValues for this field
     */
    protected function initDefaultValues()
    {
        parent::initDefaultValues();

        $this
            ->valueTrans(true)
            ->attributes([])
        ;
    }

    /**
     * isSelected determines if the provided value matches this field's value.
     * @param string $value
     * @return bool
     */
    public function isSelected($value = true)
    {
        if ($this->value === null) {
            return false;
        }

        return (string) $value === (string) $this->value;
    }

    /**
     * hasAttribute checks if the field has the supplied [unfiltered] attribute.
     * @param  string $name
     * @param  string $position
     * @return bool
     */
    public function hasAttribute($name, $position = 'field')
    {
        $posKey = $position === 'container' ? 'containerAttributes' : 'attributes';

        if (!isset($this->config[$posKey])) {
            return false;
        }

        return array_key_exists($name, $this->config[$posKey]);
    }

    /**
     * getAttributes returns the attributes for this field at a given position.
     * @param  string $position
     * @return array
     */
    public function getAttributes($position = 'field', $htmlBuild = true)
    {
        $posKey = $position === 'container' ? 'containerAttributes' : 'attributes';

        $result = $this->config[$posKey] ?? [];
        $result = $this->filterAttributes($result, $position);

        return $htmlBuild ? Html::attributes($result) : $result;
    }

    /**
     * filterAttributes adds any circumstantial attributes to the field based on other
     * settings, such as the 'disabled' option.
     * @param  array $attributes
     * @param  string $position
     * @return array
     */
    protected function filterAttributes($attributes, $position = 'field')
    {
        $position = strtolower($position);

        $attributes = $this->filterTriggerAttributes($attributes, $position);
        $attributes = $this->filterPresetAttributes($attributes, $position);

        if ($position === 'field' && $this->disabled) {
            $attributes = $attributes + ['disabled' => 'disabled'];
        }

        if ($position === 'field' && $this->autoFocus) {
            $attributes = $attributes + ['autofocus' => 'autofocus'];
        }

        if ($position === 'field' && $this->readOnly) {
            $attributes = $attributes + ['readonly' => 'readonly'];

            if ($this->type === 'checkbox' || $this->type === 'switch') {
                $attributes = $attributes + ['onclick' => 'return false;'];
            }
        }

        return $attributes;
    }

    /**
     * filterTriggerAttributes adds attributes used specifically by the Trigger API
     * @param  array $attributes
     * @param  string $position
     * @return array
     */
    protected function filterTriggerAttributes($attributes, $position = 'field')
    {
        if (!$this->trigger || !is_array($this->trigger)) {
            return $attributes;
        }

        $triggerAction = array_get($this->trigger, 'action');
        $triggerField = array_get($this->trigger, 'field');
        $triggerCondition = array_get($this->trigger, 'condition');
        $triggerForm = $this->arrayName;
        $triggerMulti = '';

        // Apply these to container
        if (in_array($triggerAction, ['hide', 'show']) && $position !== 'container') {
            return $attributes;
        }

        // Apply these to field/input
        if (in_array($triggerAction, ['enable', 'disable', 'empty']) && $position !== 'field') {
            return $attributes;
        }

        // Reduce the field reference for the trigger condition field
        $triggerFieldParentLevel = Str::getPrecedingSymbols($triggerField, self::HIERARCHY_UP);
        if ($triggerFieldParentLevel > 0) {
            // Remove the preceding symbols from the trigger field name
            $triggerField = substr($triggerField, $triggerFieldParentLevel);
            $triggerForm = HtmlHelper::reduceNameHierarchy($triggerForm, $triggerFieldParentLevel);
        }

        // Preserve multi field types
        if (Str::endsWith($triggerField, '[]')) {
            $triggerField = substr($triggerField, 0, -2);
            $triggerMulti = '[]';
        }

        // Final compilation
        if ($this->arrayName) {
            $fullTriggerField = $triggerForm.'['.implode('][', HtmlHelper::nameToArray($triggerField)).']'.$triggerMulti;
        }
        else {
            $fullTriggerField = $triggerField.$triggerMulti;
        }

        $newAttributes = [
            'data-trigger' => '[name="'.$fullTriggerField.'"]',
            'data-trigger-action' => $triggerAction,
            'data-trigger-condition' => $triggerCondition,
            'data-trigger-closest-parent' => 'form, div[data-control="formwidget"]'
        ];

        return $attributes + $newAttributes;
    }

    /**
     * filterPresetAttributes adds attributes used specifically by the Input Preset API
     * @param  array $attributes
     * @param  string $position
     * @return array
     */
    protected function filterPresetAttributes($attributes, $position = 'field')
    {
        if (!$this->preset || $position !== 'field') {
            return $attributes;
        }

        if (!is_array($this->preset)) {
            $this->preset = ['field' => $this->preset, 'type' => 'slug'];
        }

        $presetField = array_get($this->preset, 'field');
        $presetType = array_get($this->preset, 'type');

        if ($this->arrayName) {
            $fullPresetField = $this->arrayName.'['.implode('][', HtmlHelper::nameToArray($presetField)).']';
        }
        else {
            $fullPresetField = $presetField;
        }

        $newAttributes = [
            'data-input-preset' => '[name="'.$fullPresetField.'"]',
            'data-input-preset-type' => $presetType,
            'data-input-preset-closest-parent' => 'form'
        ];

        if ($prefixInput = array_get($this->preset, 'prefixInput')) {
            $newAttributes['data-input-preset-prefix-input'] = $prefixInput;
        }

        return $attributes + $newAttributes;
    }

    /**
     * getName returns a value suitable for the field name property. The array name is taken
     * from the field or can be specified in the arguments.
     * @param  string $arrayName
     * @return string
     */
    public function getName($arrayName = null)
    {
        if ($arrayName === null) {
            $arrayName = $this->arrayName;
        }

        if ($arrayName) {
            return $arrayName.'['.implode('][', HtmlHelper::nameToArray($this->fieldName)).']';
        }

        return $this->fieldName;
    }

    /**
     * getId returns a value suitable for the field id property.
     * @param  string $suffix Specify a suffix string
     * @return string
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

        return HtmlHelper::nameToId($id);
    }

    /**
     * getDisplayValue checks to see if display values (model attributes) should be translated,
     * and also escapes the value
     */
    public function getDisplayValue($value)
    {
        if ($this->valueTrans) {
            return e(__($value));
        }

        return e($value);
    }

    /**
     * getTranslatableMessage
     */
    public function getTranslatableMessage(): string
    {
        if ($editSite = Site::getEditSite()) {
            return e($editSite->name);
        }

        return '';
    }

    /**
     * getCallableMethodFromValue checks for a string "Class::method" or as an
     * array [Class, method] usually from a YAML definition
     */
    public function getCallableMethodFromValue($value): ?array
    {
        if (
            is_string($value) &&
            count($staticMethod = explode('::', $value)) === 2 &&
            is_callable($value)
        ) {
            return $staticMethod;
        }

        if (
            is_array($value) &&
            count($value) === 2 &&
            Arr::isList($value)
        ) {
            return $value;
        }

        return null;
    }

    /**
     * getValueFromData returns this fields value from a supplied data set, which can be
     * an array or a model or another generic collection.
     * @param mixed $data
     * @param mixed $default
     * @return mixed
     */
    public function getValueFromData($data, $default = null)
    {
        $fieldName = $this->valueFrom ?: $this->fieldName;
        return $this->getFieldNameFromData($fieldName, $data, $default);
    }

    /**
     * getDefaultFromData returns the default value for this field, the supplied data is used
     * to source data when defaultFrom is specified.
     * @param mixed $data
     * @return mixed
     */
    public function getDefaultFromData($data)
    {
        if ($this->defaultFrom) {
            return $this->getFieldNameFromData($this->defaultFrom, $data);
        }

        if ($this->defaults !== '') {
            return $this->defaults;
        }

        return null;
    }

    /**
     * resolveModelAttribute returns the final model and attribute name of a nested attribute. Eg:
     *
     *     [$model, $attribute] = $this->resolveAttribute('person[phone]');
     *
     * @param  string $attribute
     * @return array
     */
    public function resolveModelAttribute($model, $attribute = null)
    {
        return $this->resolveModelAttributeInternal($model, $attribute);
    }

    /**
     * nearestModelAttribute returns the nearest model and attribute name of a nested attribute,
     * which is useful for checking if an attribute is jsonable or a relation.
     */
    public function nearestModelAttribute($model, $attribute = null)
    {
        return $this->resolveModelAttributeInternal($model, $attribute, [
            'nearMatch' => true,
            'objectOnly' => true
        ]);
    }

    /**
     * resolveModelAttributeInternal is an internal method resolver for resolveModelAttribute
     */
    protected function resolveModelAttributeInternal($model, $attribute = null, $options = [])
    {
        extract(array_merge([
            'objectOnly' => false,
            'nearMatch' => false
        ], $options));

        if ($attribute === null) {
            $attribute = $this->valueFrom ?: $this->fieldName;
        }

        $parts = is_array($attribute) ? $attribute : HtmlHelper::nameToArray($attribute);
        $last = array_pop($parts);

        foreach ($parts as $part) {
            if ($objectOnly && !is_object($model->{$part})) {
                if ($nearMatch) {
                    return [$model, $part];
                }

                continue;
            }

            $model = $model->{$part};
        }

        return [$model, $last];
    }

    /**
     * getFieldNameFromData is an internal method to extract the value of a field name
     * from a data set.
     * @param string $fieldName
     * @param mixed $data
     * @param mixed $default
     * @return mixed
     */
    protected function getFieldNameFromData($fieldName, $data, $default = null)
    {
        // Array field name, eg: field[key][key2][key3]
        $keyParts = HtmlHelper::nameToArray($fieldName);
        $lastField = end($keyParts);
        $result = $data;

        // Loop the field key parts and build a value.
        // To support relations only the last field should return the
        // relation value, all others will look up the relation object as normal.
        foreach ($keyParts as $key) {
            if ($result instanceof Model && $result->hasRelation($key)) {
                if ($key === $lastField) {
                    $result = $result->getRelationSimpleValue($key) ?: $default;
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

    /**
     * getOptionsFromModel looks at the model for defined options.
     */
    public function getOptionsFromModel($model, $fieldOptions, $data)
    {
        // Preset
        if (is_string($fieldOptions) && str_starts_with($fieldOptions, 'preset:')) {
            $fieldOptions = \System\Classes\PresetManager::instance()->getPreset($fieldOptions);
        }
        // Method name
        elseif (is_string($fieldOptions)) {
            $fieldOptions = $this->getOptionsFromModelAsString($model, $fieldOptions, $data);
        }
        // Default collection
        elseif ($fieldOptions === null || $fieldOptions === true) {
            $fieldOptions = $this->getOptionsFromModelAsDefault($model, $data);
        }

        // Cast collections to array
        if ($fieldOptions instanceof Collection) {
            $fieldOptions = $fieldOptions->all();
        }

        return $fieldOptions;
    }

    /**
     * getOptionsFromModelAsString where options are an explicit method reference
     */
    protected function getOptionsFromModelAsString($model, string $methodName, $data)
    {
        // Calling via ClassName::method
        if ($callableMethod = $this->getCallableMethodFromValue($methodName)) {
            $fieldOptions = $callableMethod($model, $this);

            if (!is_array($fieldOptions)) {
                throw new SystemException(Lang::get('backend::lang.field.options_static_method_invalid_value', [
                    'class' => $callableMethod[0],
                    'method' => $callableMethod[1]
                ]));
            }
        }
        // Calling via $model->method
        else {
            if (!$this->objectMethodExists($model, $methodName)) {
                throw new SystemException(Lang::get('backend::lang.field.options_method_not_exists', [
                    'model' => get_class($model),
                    'method' => $methodName,
                    'field' => $this->fieldName
                ]));
            }

            $fieldOptions = $model->$methodName($this->value, $this->fieldName, $data);
        }

        return $fieldOptions;
    }

    /**
     * getOptionsFromModelAsDefault refers to the model method or any of its behaviors
     */
    protected function getOptionsFromModelAsDefault($model, $data)
    {
        try {
            [$model, $attribute] = $this->resolveModelAttributeInternal($model, $this->fieldName, ['objectOnly' => true]);
        }
        catch (Exception $ex) {
            throw new SystemException(Lang::get('backend::lang.field.options_method_invalid_model', [
                'model' => get_class($model),
                'field' => $this->fieldName
            ]));
        }

        $methodName = 'get'.studly_case($attribute).'Options';
        if (
            !$this->objectMethodExists($model, $methodName) &&
            !$this->objectMethodExists($model, 'getDropdownOptions')
        ) {
            throw new SystemException(Lang::get('backend::lang.field.options_method_not_exists', [
                'model' => get_class($model),
                'method' => $methodName,
                'field' => $this->fieldName
            ]));
        }

        if ($this->objectMethodExists($model, $methodName)) {
            $fieldOptions = $model->$methodName($this->value, $data);
        }
        else {
            $fieldOptions = $model->getDropdownOptions($attribute, $this->value, $data);
        }

        return $fieldOptions;
    }

    /**
     * objectMethodExists is an internal helper for method existence checks.
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
}
