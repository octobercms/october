<?php namespace October\Tester\Components;

use Cms\Classes\ComponentBase;
use Cms\Classes\CodeBase;
use October\Tester\Classes\Users;

class Comments extends ComponentBase
{
    private $users;

    public function __construct(CodeBase $cmsObject = null, $properties = [], Users $users = null)
    {
        parent::__construct($cmsObject, $properties);
        $this->users = $users;
    }

    public function componentDetails()
    {
        return [
            'name' => 'Blog Comments Dummy Component',
            'description' => 'Displays the list of comments on a post.'
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

    public function getUsers()
    {
        return $this->users;
    }
}
