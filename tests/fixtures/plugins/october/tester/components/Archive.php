<?php namespace October\Tester\Components;

use Cms\Classes\ComponentBase;

class Archive extends ComponentBase
{
    public function componentDetails()
    {
        return [
            'name' => 'Blog Archive Dummy Component',
            'description' => 'Displays an archive of blog posts.'
        ];
    }

    public function defineProperties()
    {
        return [
            'posts-per-page' => [
                 'description' => 'This will set the posts to display per page',
                 'default' => 10
            ],
            'page-number-param' => [
                'description' => 'The router parameter for getting the pagination page number',
                'default' => 'pageNum'
            ]
        ];
    }

    public function posts()
    {
        return [
            ['title' => 'Lorum ipsum', 'content' => 'Post Content #1'],
            ['title' => 'La Playa Nudista', 'content' => 'Second Post Content']
        ];
    }

    public function onTestAjax()
    {
        $this->page['var'] = 'page';
    }
}
