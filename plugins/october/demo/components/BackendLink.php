<?php namespace October\Demo\Components;

use System;
use Backend;
use Cms\Classes\ComponentBase;

/**
 * BackendLink component
 */
class BackendLink extends ComponentBase
{
    public function componentDetails()
    {
        return [
            'name' => 'Backend Link',
            'description' => 'Makes the backend area link available.'
        ];
    }

    public function onRun()
    {
        $this->page['backendUrl'] = System::checkDebugMode() ? Backend::url('/') : null;
    }
}
