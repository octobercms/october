<?php namespace October\Tester\Components;

use Cms\Classes\ComponentBase;

class AjaxBlock extends ComponentBase
{
    public function componentDetails()
    {
        return [
            'name' => 'Ajax Block Dummy Component',
            'description' => 'Renders output wrapped in an AJAX partial.',
            'ajaxPartial' => true
        ];
    }

    public function onTest()
    {
        $this->controller->vars['ajaxBlockSubmitted'] = true;
    }
}
