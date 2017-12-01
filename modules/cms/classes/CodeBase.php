<?php namespace Cms\Classes;

use ArrayAccess;
use October\Rain\Extension\Extendable;

/**
 * Parent class for PHP classes created for layout and page code sections.
 *
 * @package october\cms
 * @author Alexey Bobkov, Samuel Georges
 */
class CodeBase extends Extendable implements ArrayAccess
{
    /**
     * @var \Cms\Classes\Page Specifies the current page
     */
    public $page;

    /**
     * @var \Cms\Classes\Layout Specifies the current layout
     */
    public $layout;

    /**
     * @var \Cms\Classes\controller Specifies the CMS controller
     */
    public $controller;

    /**
     * Creates the object instance.
     * @param \Cms\Classes\Page $page Specifies the CMS page.
     * @param \Cms\Classes\Layout $layout Specifies the CMS layout.
     * @param \Cms\Classes\Controller $controller Specifies the CMS controller.
     */
    public function __construct($page, $layout, $controller)
    {
        $this->page = $page;
        $this->layout = $layout;
        $this->controller = $controller;

        parent::__construct();
    }

    /**
     * This event is triggered when all components are initialized and before AJAX is handled.
     * The layout's onInit method triggers before the page's onInit method.
     */
    public function onInit()
    {
    }

    /**
     * This event is triggered in the beginning of the execution cycle.
     * The layout's onStart method triggers before the page's onStart method.
     */
    public function onStart()
    {
    }

    /**
     * This event is triggered in the end of the execution cycle, but before the page is displayed.
     * The layout's onEnd method triggers after the page's onEnd method.
     */
    public function onEnd()
    {
    }

    /**
     * ArrayAccess implementation
     */
    public function offsetSet($offset, $value)
    {
        $this->controller->vars[$offset] = $value;
    }

    /**
     * ArrayAccess implementation
     */
    public function offsetExists($offset)
    {
        return isset($this->controller->vars[$offset]);
    }

    /**
     * ArrayAccess implementation
     */
    public function offsetUnset($offset)
    {
        unset($this->controller->vars[$offset]);
    }

    /**
     * ArrayAccess implementation
     */
    public function offsetGet($offset)
    {
        return isset($this->controller->vars[$offset]) ? $this->controller->vars[$offset] : null;
    }

    /**
     * Dynamically handle calls into the controller instance.
     * @param string $method
     * @param array $parameters
     * @return mixed
     */
    public function __call($method, $parameters)
    {
        if ($this->methodExists($method)) {
            return call_user_func_array([$this, $method], $parameters);
        }

        return call_user_func_array([$this->controller, $method], $parameters);
    }

    /**
     * This object is referenced as $this->page in Cms\Classes\ComponentBase,
     * so to avoid $this->page->page this method will proxy there. This is also
     * used as a helper for accessing controller variables/components easier
     * in the page code, eg. $this->foo instead of $this['foo']
     * @param  string  $name
     * @return void
     */
    public function __get($name)
    {
        if (isset($this->page->components[$name]) || isset($this->layout->components[$name])) {
            return $this[$name];
        }

        if (($value = $this->page->{$name}) !== null) {
            return $value;
        }

        if (array_key_exists($name, $this->controller->vars)) {
            return $this[$name];
        }

        return null;
    }

    /**
     * This will set a property on the CMS Page object.
     * @param  string  $name
     * @param  mixed   $value
     * @return void
     */
    public function __set($name, $value)
    {
        return $this->page->{$name} = $value;
    }

    /**
     * This will check if a property isset on the CMS Page object.
     * @param  string  $name
     * @return void
     */
    public function __isset($name)
    {
        return isset($this->page->{$name});
    }
}
