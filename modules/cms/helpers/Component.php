<?php namespace Cms\Helpers;

use Backend\Helpers\Inspector as InspectorHelper;

/**
 * Component defines some component helpers for the CMS UI.
 *
 * @package october\cms
 * @author Alexey Bobkov, Samuel Georges
 */
class Component
{
    /**
     * getComponentsPropertyConfig returns a component property configuration as a JSON string or array.
     * @param mixed $component The component object
     * @param boolean $addAliasProperty Determines if the Alias property should be added to the result.
     * @param boolean $returnArray Determines if the method should return an array.
     * @return string
     */
    public static function getComponentsPropertyConfig($component, $addAliasProperty = true, $returnArray = false)
    {
        $result = [];

        if ($addAliasProperty) {
            $property = [
                'property' => 'oc.alias',
                'title' => __("Alias"),
                'description' => __("A unique name given to this component when using it in the page or layout code."),
                'type' => 'string',
                'validationPattern' => '^[a-zA-Z]+[0-9a-z\_]*$',
                'validationMessage' => __("Component aliases are required and can contain only Latin symbols, digits, and underscores. The aliases should start with a Latin symbol."),
                'required' => true,
                'showExternalParam' => false
            ];
            $result[] = $property;
        }

        $properties = $component->defineProperties();
        if (is_array($properties)) {
            $result = array_merge($result, InspectorHelper::getPropertyConfig($properties));
        }

        if ($returnArray) {
            return $result;
        }

        return json_encode($result);
    }

    /**
     * getComponentPropertyValues returns a component property values.
     * @param mixed $component The component object
     * @param boolean $returnArray Returns array if TRUE. Returns JSON string otherwise.
     * @return mixed
     */
    public static function getComponentPropertyValues($component, $returnArray = false)
    {
        $result = [];

        $result['oc.alias'] = $component->alias;

        $properties = $component->defineProperties();
        if (is_array($properties)) {
            foreach ($properties as $name => $params) {
                $result[$name] = $component->property($name);
            }
        }

        if ($returnArray) {
            return $result;
        }

        return json_encode($result);
    }

    /**
     * getComponentName returns a component name.
     * @param mixed $component The component object
     * @return string
     */
    public static function getComponentName($component)
    {
        return __($component->componentDetails()['name'] ?? "Unnamed");
    }

    /**
     * getComponentIcon returns a component icon.
     * @param mixed $component The component object
     * @return string
     */
    public static function getComponentIcon($component)
    {
        return $component->componentDetails()['icon'] ?? null;
    }

    /**
     * getComponentDescription returns a component description.
     * @param mixed $component The component object
     * @return string
     */
    public static function getComponentDescription($component)
    {
        return __($component->componentDetails()['description'] ?? "No description provided");
    }

    /**
     * getComponentSnippetAjax returns if a component should be rendered with an AJAX partial
     * only applies when a component is used as a snippet
     * @param mixed $component The component object
     * @return bool
     */
    public static function getComponentSnippetAjax($component)
    {
        return (bool) array_get($component->componentDetails(), 'snippetAjax', false);
    }

    /**
     * getComponentSnippetInline returns if a component snippet should render inline
     * only applies when a component is used as a snippet
     * @param mixed $component The component object
     * @return bool
     */
    public static function getComponentSnippetInline($component)
    {
        return (bool) array_get($component->componentDetails(), 'snippetInline', false);
    }
}
