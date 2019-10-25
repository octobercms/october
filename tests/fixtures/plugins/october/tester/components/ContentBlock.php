<?php namespace October\Tester\Components;

use Cms\Classes\ComponentBase;

class ContentBlock extends ComponentBase
{
    public function componentDetails()
    {
        return [
            'name' => 'Content Block Dummy Component',
            'description' => 'Displays a editable content block.'
        ];
    }

    public function onRender()
    {
        if ($output = $this->property('output')) {
            return 'Custom output: '.$output;
        }

        return 'Pass';
    }
}
