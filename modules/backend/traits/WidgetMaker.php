<?php namespace Backend\Traits;

use Backend\Classes\WidgetManager;
use System\Classes\SystemException;

/**
 * Config Maker Trait
 *
 * Adds widget based methods to a controller class, or a class that contains a 
 * $controller property referencing a controller.
 *
 * @package october\backend
 * @author Alexey Bobkov, Samuel Georges
 */

trait WidgetMaker
{
    /**
     * Makes a widget object with the supplied configuration file.
     * @param string $class Widget class name
     * @param array $configuration An array of config.
     * @return WidgetBase The widget or null
     */
    public function makeWidget($class, $configuration = null)
    {
        $controller = ($this->controller) ?: $this;

        $manager = WidgetManager::instance();
        $widget = $manager->makeWidget($class, $controller, $configuration);
        return $widget;
    }
}