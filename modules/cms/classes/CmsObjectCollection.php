<?php namespace Cms\Classes;

use Illuminate\Support\Collection as CollectionBase;
use System\Classes\ApplicationException;

/**
 * This class represents a collection of Cms Objects.
 *
 * @package october\cms
 * @author Alexey Bobkov, Samuel Georges
 */
class CmsObjectCollection extends CollectionBase
{
    /**
     * Add an item to the collection.
     *
     * @param  mixed  $item
     * @return Cms\Classes\CmsObjectCollection
     */
    public function add($item)
    {
        $this->items[] = $item;

        return $this;
    }
}
