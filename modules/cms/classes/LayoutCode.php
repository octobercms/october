<?php namespace Cms\Classes;

/**
 * Parent class for PHP classes created for layout PHP sections.
 *
 * @package october\cms
 * @author Alexey Bobkov, Samuel Georges
 */
class LayoutCode extends CodeBase
{
    /**
     * This event is triggered after the layout components are executed,
     * but before the page's onStart event.
     */
    public function onBeforePageStart()
    {
    }
}
