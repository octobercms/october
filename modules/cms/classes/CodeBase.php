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
     * This event is triggered in the beginning of the execution cycle.
     * The layout's onStart method triggers before the page's onStart method.
     */
    public function onStart() {}

    /**
     * This event is triggered in the end of the execution cycle, but before the page is displayed.
     * The layout's onEnd method triggers after the page's onEnd method.
     */
    public function onEnd() {}

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
        if (method_exists($this, $method))
            return call_user_func_array([$this, $method], $parameters);

        return call_user_func_array([$this->controller, $method], $parameters);
    }

    /**
     * This object is referenced as $this->page in Cms\Classes\ComponentBase,
     * so to avoid $this->page->page this method will proxy there.
     * @param  string  $name
     * @return void
     */
    public function __get($name)
    {
        return $this->page->{$name};
    }

    /**
     * As per __get, this will set a variable instead.
     * @param  string  $name
     * @param  mixed   $value
     * @return void
     */
    public function __set($name, $value)
    {
        return $this->page->{$name} = $value;
    }

    /**
     * As per __get, this will check if a variable isset instead.
     * @param  string  $name
     * @return void
     */
    public function __isset($name)
    {
        return isset($this->page->{$name});
    }
}
