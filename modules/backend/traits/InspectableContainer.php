<?php namespace Backend\Traits;

use Request;
use SystemException;
use ApplicationException;

/**
 * Inspectable Container Trait
 * Extension for controllers that can host inspectable widgets (Components, etc.)
 *
 * @package october\backend
 * @author Alexey Bobkov, Samuel Georges
 */

trait InspectableContainer
{
    public function onInspectableGetOptions()
    {
        $property = trim(Request::input('inspectorProperty'));
        if (!$property) {
            throw new ApplicationException('The property name is not specified.');
        }

        $className = trim(Request::input('inspectorClassName'));
        if (!$className) {
            throw new ApplicationException('The inspectable class name is not specified.');
        }

        $traitFound = in_array('System\Traits\PropertyContainer', class_uses_recursive($className));
        if (!$traitFound) {
            throw new ApplicationException('The options cannot be loaded for the specified class.');
        }

        $obj = new $className(null);

        $methodName = 'get'.ucfirst($property).'Options';
        if (method_exists($obj, $methodName)) {
            $options = $obj->$methodName();
        }
        else {
            $options = $obj->getPropertyOptions($property);
        }

        /*
         * Convert to array to retain the sort order in JavaScript
         */
        $optionsArray = [];
        foreach ((array) $options as $value => $title) {
            $optionsArray[] = ['value' => $value, 'title' => $title];
        }

        return [
            'options' => $optionsArray
        ];
    }
}
