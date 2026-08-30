<?php namespace October\Tester\Components;

use Cms\Classes\ComponentBase;

class VueBlock extends ComponentBase
{
    public function componentDetails()
    {
        return [
            'name' => 'Vue Block Dummy Component',
            'description' => 'Registers a Vue component on the page.'
        ];
    }

    public function init()
    {
        $this->registerVueComponent(\October\Tester\VueComponents\TestWidget::class);
    }
}
