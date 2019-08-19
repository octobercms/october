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
    public function __construct($properties)
    {
        $this->componentCssClass = 'warning-component';
        $this->inspectorEnabled = false;

        parent::__construct(null, $properties);
    }

    /**
     * @return array
     */
    public function componentDetails()
    {
        return [
            'name'        => 'Soft component',
            'description' => 'This component is missing but optional.'
        ];
    }
}
