<?php namespace Cms\Components;

use Cms\Classes\ComponentBase;

class SoftComponent extends ComponentBase
{
    /**
     * @var string Message that is shown with this component.
     */
    protected $message;

    /**
     * @inheritDoc
     */
    public function __construct($cmsObject, $properties, $message)
    {
        $this->message = $message;
        $this->componentCssClass = 'warning-component';
        $this->inspectorEnabled = false;

        parent::__construct($cmsObject, $properties);
    }

    /**
     * @return array
     */
    public function componentDetails()
    {
        return [
            'name'        => 'Soft component',
            'description' => $this->message
        ];
    }
}
