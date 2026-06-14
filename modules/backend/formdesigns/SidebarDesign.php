<?php namespace Backend\FormDesigns;

use Backend\Classes\FormDesignBase;

/**
 * SidebarDesign displays a form with a right sidebar for secondary tabs
 * and a main content area for outside fields and primary tabs.
 *
 * @package october\backend
 * @author Alexey Bobkov, Samuel Georges
 */
class SidebarDesign extends FormDesignBase
{
    /**
     * getDesignBodyClass returns `compact-container` for the sidebar layout
     */
    public function getDesignBodyClass(): ?string
    {
        return 'compact-container';
    }
}
