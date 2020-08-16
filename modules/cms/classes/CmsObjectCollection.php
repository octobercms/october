<?php namespace Cms\Classes;

use ApplicationException;
use October\Rain\Support\Collection as CollectionBase;

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
     * @param  string|array $components
     * @param null|callback $callback
     * @return static
     */
    public function withComponent($components, $callback = null)
    {
        return $this->filter(function ($object) use ($components, $callback) {
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
     *
     * Note that this deviates from Laravel 6's Illuminate\Support\Traits\EnumeratesValues::where() method signature,
     * which uses ($key, $operator = null, $value = null) as parameters and that this class extends.
     *
     * To ensure backwards compatibility with our current Halcyon functionality, this method retains the original
     * parameters and functions the same way as before, with handling for the $value and $strict parameters to ensure
     * they match the previously expected formats. This means that you cannot use operators for "where" queries on
     * CMS object collections.
     *
     * @param  string  $property
     * @param  string  $value
     * @param  bool  $strict
     * @return static
     */
    public function where($property, $value = null, $strict = null)
    {
        if (empty($value) || !is_string($value)) {
            throw new ApplicationException('You must provide a string value to compare with when executing a "where" '
             . 'query for CMS object collections.');
        }

        if (!isset($strict) || !is_bool($strict)) {
            $strict = true;
        }

        return $this->filter(function ($object) use ($property, $value, $strict) {
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
     * @param mixed $components
     * @param string $property
     * @param string $value
     * @param bool $strict
     * @return static
     */
    public function whereComponent($components, $property, $value, $strict = false)
    {
        return $this->filter(function ($object) use ($components, $property, $value, $strict) {

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
