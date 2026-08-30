<?php namespace Cms\Classes;

use Lang;
use ApplicationException;
use October\Rain\Extension\ExtensionBase;

/**
 * ComponentBehavior base class for CMS component behaviors.
 *
 * Analogous to Backend\Classes\ControllerBehavior but adapted for CMS components.
 * Behaviors are attached to components via the $implement property and provide
 * reusable functionality such as form handling and list rendering.
 *
 * @package october\cms
 * @author Alexey Bobkov, Samuel Georges
 */
class ComponentBehavior extends ExtensionBase
{
    use \System\Traits\ConfigMaker;

    /**
     * @var ComponentBase component class
     */
    protected $component;

    /**
     * @var \Cms\Classes\Controller controller to CMS controller.
     */
    protected $controller;

    /**
     * @var array requiredProperties that must exist in the component using this behavior
     */
    protected $requiredProperties = [];

    /**
     * __construct the behavior
     */
    public function __construct($component)
    {
        $this->component = $component;

        $this->controller = $controller = $component->getController();

        // Validate component properties
        foreach ($this->requiredProperties as $property) {
            if (!isset($component->{$property})) {
                throw new ApplicationException(Lang::get('system::lang.behavior.missing_property', [
                    'class' => get_class($component),
                    'property' => $property,
                    'behavior' => get_called_class()
                ]));
            }
        }

        if (!$controller) {
            return;
        }

        // Constructor logic that is protected by authentication
        $controller->bindEvent('page.initComponents', function() {
            $this->beforeDisplay();
        });
    }

    /**
     * beforeDisplay fires before the page is displayed and AJAX is executed.
     */
    public function beforeDisplay()
    {
    }
}
