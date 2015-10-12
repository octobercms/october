<?php namespace Cms\Classes;

use ApplicationException;
use Illuminate\Support\Collection as CollectionBase;

/**
 * This class represents a collection of Cms Objects.
 *
 * @package october\cms
 * @author Alexey Bobkov, Samuel Georges
 */
class CmsObjectCollection extends CollectionBase
{
    /**
     * Returns objects that use the supplied component.
     * @param  string|array  $components
     * @return static
     */
    public function withComponent($components, $callback = null)
    {
        return $this->filter(function($object) use ($components, $callback) {

            $hasComponent = false;

            foreach ((array) $components as $componentName) {

                if (!$callback && $object->hasComponent($componentName)) {
                    $hasComponent = true;
                }

                if ($callback && ($component = $object->getComponent($componentName))) {
                    $hasComponent = call_user_func($callback, $component) ?: $hasComponent;
                }
            }

            return $hasComponent;
        });
    }

    /**
     * Returns objects whose properties match the supplied value.
     * @param string $property
     * @param string $value
     * @return static
     */
    public function where($property, $value, $strict = true)
    {
        return $this->filter(function($object) use ($property, $value, $strict) {

            if (!array_key_exists($property, $object->settings)) {
                return false;
            }

            return $strict
                ? $object->settings[$property] === $value
                : $object->settings[$property] == $value;
        });
    }

    /**
     * Returns objects whose component properties match the supplied value.
     * @param string $property
     * @param string $value
     * @return static
     */
    public function whereComponent($components, $property, $value, $strict = false)
    {
        return $this->filter(function($object) use ($components, $property, $value, $strict) {

            $hasComponent = false;

            foreach ((array) $components as $componentName) {

                if (!$componentAlias = $object->hasComponent($componentName)) {
                    continue;
                }

                $componentSettings = array_get($object->settings, 'components', []);

                if (!array_key_exists($componentAlias, $componentSettings)) {
                    continue;
                }

                $settings = $componentSettings[$componentAlias];

                if (!array_key_exists($property, $settings)) {
                    continue;
                }

                if (
                    ($strict && $settings[$property] === $value) ||
                    (!$strict && $settings[$property] == $value)
                ) {
                    $hasComponent = true;
                }
            }

            return $hasComponent;
        });
    }

}
