<?php namespace Backend\Widgets;

use Backend\Classes\WidgetBase;

/**
 * Filter Widget
 * Renders a search container used for filtering things.
 *
 * @package october\backend
 * @author Alexey Bobkov, Samuel Georges
 */
class Filter extends WidgetBase
{
    /**
     * {@inheritDoc}
     */
    public $defaultAlias = 'filter';

    /**
     * Renders the widget.
     */
    public function render()
    {
        $this->prepareVars();
        return $this->makePartial('filter');
    }

    /**
     * Prepares the view data
     */
    public function prepareVars()
    {
    }
}