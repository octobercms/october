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
    public function withComponent($components)
    {
        return $this->filter(function($object) use ($components) {

            $hasComponent = false;

            foreach ((array) $components as $component) {
                if ($object->hasComponent($component)) {
                    $hasComponent = true;
                }
            }

            return $hasComponent;
        });
    }
}
