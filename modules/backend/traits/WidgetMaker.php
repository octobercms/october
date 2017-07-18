<?php namespace Backend\Traits;

use Lang;
use Backend\Classes\FormField;
use SystemException;

/**
 * Widget Maker Trait
 *
 * Adds widget based methods to a controller class, or a class that
 * contains a `$controller` property referencing a controller.
 *
 * @package october\backend
 * @author Alexey Bobkov, Samuel Georges
 */
trait WidgetMaker
{
    /**
     * Makes a widget object with the supplied configuration file.
     * @param string $class Widget class name
     * @param array $widgetConfig An array of config.
     * @return \Backend\Classes\WidgetBase The widget object
     */
    public function makeWidget($class, $widgetConfig = [])
    {
        $controller = property_exists($this, 'controller') && $this->controller
            ? $this->controller
            : $this;

        if (!class_exists($class)) {
            throw new SystemException(Lang::get('backend::lang.widget.not_registered', [
                'name' => $class
            ]));
        }

        return new $class($controller, $widgetConfig);
    }

    /**
     * Makes a form widget object with the supplied form field and widget configuration.
     * @param string $class Widget class name
     * @param mixed $fieldConfig A field name, an array of config or a FormField object.
     * @param array $widgetConfig An array of config.
     * @return \Backend\Classes\FormWidgetBase The widget object
     */
    public function makeFormWidget($class, $fieldConfig = [], $widgetConfig = [])
    {
        $controller = property_exists($this, 'controller') && $this->controller
            ? $this->controller
            : $this;

        if (!class_exists($class)) {
            throw new SystemException(Lang::get('backend::lang.widget.not_registered', [
                'name' => $class
            ]));
        }

        if (is_string($fieldConfig)) {
            $fieldConfig = ['name' => $fieldConfig];
        }

        if (is_array($fieldConfig)) {
            $formField = new FormField(
                array_get($fieldConfig, 'name'),
                array_get($fieldConfig, 'label')
            );
            $formField->displayAs('widget', $fieldConfig);
        }
        else {
            $formField = $fieldConfig;
        }

        return new $class($controller, $formField, $widgetConfig);
    }
}
