<?php namespace Backend\Traits;

use Lang;
use Backend\Classes\WidgetManager;
use SystemException;

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
     * @return WidgetBase The widget object
     */
    public function makeWidget($class, $configuration = [])
    {
        $controller = property_exists($this, 'controller') && $this->controller
            ? $this->controller
            : $this;

        if (!class_exists($class)) {
            throw new SystemException(Lang::get('backend::lang.widget.not_registered', [
                'name' => $class
            ]));
        }

        return new $class($controller, $configuration);
    }
}
