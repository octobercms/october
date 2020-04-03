<?php namespace October\Tester\Components;

use Cms\Classes\ComponentBase;

class Post extends ComponentBase
{
    public function componentDetails()
    {
        return [
            'name' => 'Blog Post Dummy Component',
            'description' => 'Displays a blog post.'
        ];
    }

    public function defineProperties()
    {
        return [
            'show-featured' => [
                 'description' => 'Display the post featured image or not',
                 'default' => true
            ]
        ];
    }
}
