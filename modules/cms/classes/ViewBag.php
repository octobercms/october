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

    public function componentDetails()
    {
        return [
            'name'        => 'viewBag',
            'description' => 'Stores custom template properties.'
        ];
    }

    public function validateProperties(array $properties)
    {
        return $properties;
    }

    public function __call($method, $parameters)
    {
        if (array_key_exists($method, $this->properties) && !method_exists($this, $method)) {
            return $this->properties[$method];
        }

        return parent::__call($method, $parameters);
    }

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
