<?php namespace Cms\Classes;

use Cms\Classes\ComponentBase;

/**
 * The view bag stores custom template properties.
 * This is a hidden component ignored by the back-end UI.
 *
 * @package october\cms
 * @author Alexey Bobkov, Samuel Georges
 */
class ViewBag extends ComponentBase
{
    public $isHidden = true;

    /**
     * @return array
     */
    public function componentDetails()
    {
        return [
            'name'        => 'viewBag',
            'description' => 'Stores custom template properties.'
        ];
    }

    /**
     * @param array $properties
     * @return array
     */
    public function validateProperties(array $properties)
    {
        return $properties;
    }

    /**
     * @param string $method
     * @param array $parameters
     * @return mixed
     */
    public function __call($method, $parameters)
    {
        if (method_exists($this, $method)){
            return call_user_func_array([$this, $method], $parameters);
        }

        if ($property = $this->property($method, $parameters)) {
            return $property;
        }

        return null;
    }

    /**
     * @return array
     */
    public function defineProperties()
    {
        $result = [];

        foreach ($this->properties as $name => $value) {
            $result[$name] = [
                'title' => $name,
                'type' => 'string'
            ];
        }

        return $result;
    }
}
