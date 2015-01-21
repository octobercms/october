<?php namespace Cms\Classes;

use Lang;

/**
 * Defines some component helpers for the CMS UI.
 *
 * @package october\system
 * @author Alexey Bobkov, Samuel Georges
 */
class ComponentHelpers
{
    /**
     * Returns a component property configuration as a JSON string or array.
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
                'property'              => 'oc.alias',
                'title'                 => Lang::get('cms::lang.component.alias'),
                'description'           => Lang::get('cms::lang.component.alias_description'),
                'type'                  => 'string',
                'validationPattern'     => '^[a-zA-Z]+[0-9a-z\_]*$',
                'validationMessage'     => Lang::get('cms::lang.component.validation_message'),
                'showExternalParam'     => false
            ];
            $result[] = $property;
        }

        $properties = $component->defineProperties();
        foreach ($properties as $name => $params) {
            $property = [
                'property'              => $name,
                'title'                 => array_get($params, 'title', $name),
                'type'                  => array_get($params, 'type', 'string'),
                'showExternalParam'     => array_get($params, 'showExternalParam', true)
            ];

            foreach ($params as $name => $value) {
                if (isset($property[$name])) {
                    continue;
                }
                $property[$name] = $value;
            }

            /*
             * Translate human values
             */
            $translate = ['title', 'description', 'options'];
            foreach ($property as $name => $value) {
                if (!in_array($name, $translate)) {
                    continue;
                }

                if (is_array($value)) {
                    array_walk($property[$name], function (&$_value, $key) {
                        $_value = Lang::get($_value);
                    });
                }
                else {
                    $property[$name] = Lang::get($value);
                }
            }

            $result[] = $property;
        }

        if ($returnArray)
            return $result;

        return json_encode($result);
    }

    /**
     * Returns a component property values.
     * @param mixed $component The component object
     * @return mixed
     */
    public static function getComponentPropertyValues($component)
    {
        $result = [];

        $result['oc.alias'] = $component->alias;

        $properties = $component->defineProperties();
        foreach ($properties as $name => $params) {
            $result[$name] = $component->property($name);
        }

        return json_encode($result);
    }

    /**
     * Returns a component name.
     * @param mixed $component The component object
     * @return string 
     */
    public static function getComponentName($component)
    {
        $details = $component->componentDetails();
        $name = (isset($details['name']))
            ? $details['name']
            : 'cms::lang.component.unnamed';

        return Lang::get($name);
    }

    /**
     * Returns a component description.
     * @param mixed $component The component object
     * @return string 
     */
    public static function getComponentDescription($component)
    {
        $details = $component->componentDetails();
        $name = (isset($details['description']))
            ? $details['description']
            : 'cms::lang.component.no_description';

        return Lang::get($name);
    }
}
