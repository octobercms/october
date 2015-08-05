<?php namespace Cms\Classes;

use Cms\Classes\ComponentBase;
use Cms\Classes\CodeBase;

class UnknownComponent extends ComponentBase
{
    protected $errorMessage;

    /**
     * {@inheritDoc}
     */
    public function __construct($cmsObject, $properties, $errorMessage)
    {
        $this->errorMessage = $errorMessage;
        $this->componentCssClass = 'error-component';
        $this->inspectorEnabled = false;

        parent::__construct($cmsObject, $properties);
    }

    public function componentDetails()
    {
        return [
            'name'        => 'Unknown component',
            'description' => $this->errorMessage
        ];
    }
}
