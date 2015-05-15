<?php namespace Cms\Classes;

use ArrayAccess;
use Cms\Classes\CodeBase;

/**
 * The 'page' object when referenced in a component.
 *
 * @package october\cms
 * @author Alexey Bobkov, Samuel Georges
 */
class ComponentPage implements ArrayAccess
{
    /**
     * @var \Cms\Classes\CodeBase The CMS object the component is bound to.
     */
    public $cmsObject;

    /**
     * @var \Cms\Classes\controller Specifies the CMS controller
     */
    public $controller;

    /**
     * @var array A list of variables to pass to the component.
     */
    public $vars = [];

    /**
     * Creates the object instance.
     * @param \Cms\Classes\CodeBase $cmsObject The bound CMS object.
     */
    public function __construct(CodeBase $cmsObject)
    {
        $this->cmsObject = $cmsObject;
        $this->controller = $cmsObject->controller;
    }

    /**
     * ArrayAccess implementation
     */
    public function offsetSet($offset, $value)
    {
        $this->vars[$offset] = $value;
        $this->controller->vars[$offset] = $value;
    }

    /**
     * ArrayAccess implementation
     */
    public function offsetExists($offset)
    {
        return isset($this->vars[$offset]) || isset($this->controller->vars[$offset]);
    }

    /**
     * ArrayAccess implementation
     */
    public function offsetUnset($offset)
    {
        unset($this->vars[$offset]);
        unset($this->controller->vars[$offset]);
    }

    /**
     * ArrayAccess implementation
     */
    public function offsetGet($offset)
    {
        if (isset($this->vars[$offset])) {
            return $this->vars[$offset];
        }

        if (isset($this->controller->vars[$offset])) {
            return $this->controller->vars[$offset];
        }

        return null;
    }

    /**
     * Dynamically handle calls into the controller instance.
     * @param string $method
     * @param array $parameters
     * @return mixed
     */
    public function __call($method, $parameters)
    {
        return call_user_func_array([$this->cmsObject, $method], $parameters);
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
        if (($value = $this->cmsObject->page->{$name}) !== null) {
            return $value;
        }

        return $this[$name];
    }

    /**
     * This will set a property as a proxy to Cms\Classes\CodeBase.
     * @param  string  $name
     * @param  mixed   $value
     * @return void
     */
    public function __set($name, $value)
    {
        return $this->cmsObject->{$name} = $value;
    }

    /**
     * This will check if a variable isset as a proxy to Cms\Classes\CodeBase.
     * @param  string  $name
     * @return void
     */
    public function __isset($name)
    {
        return isset($this->cmsObject->{$name});
    }

}