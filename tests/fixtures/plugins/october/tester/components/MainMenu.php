<?php namespace October\Tester\Components;

use Cms\Classes\ComponentBase;

class MainMenu extends ComponentBase
{
    public function componentDetails()
    {
        return [
            'name' => 'Menu Dummy Component',
            'description' => 'Displays a really cool menu.'
        ];
    }

    public function menuItems()
    {
        return ['Home', 'Blog', 'About', 'Contact'];
    }
}
