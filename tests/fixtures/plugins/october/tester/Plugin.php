<?php namespace October\Tester;

use System\Classes\PluginBase;

class Plugin extends PluginBase
{

    public function pluginDetails()
    {
        return [
            'name' => 'October Test Plugin',
            'description' => 'Test plugin used by unit tests.',
            'author' => 'Alexey Bobkov, Samuel Georges'
        ];
    }

    public function registerComponents()
    {
        return [
            'October\Tester\Components\Archive' => 'testArchive',
            'October\Tester\Components\Post' => 'testPost',
            'October\Tester\Components\MainMenu' => 'testMainMenu',
            'October\Tester\Components\ContentBlock' => 'testContentBlock',
            'October\Tester\Components\Comments' => 'testComments',
        ];
    }

    public function registerFormWidgets()
    {
        return [
            'October\Tester\FormWidgets\Preview' => [
                'label' => 'Preview',
                'code'  => 'preview'
            ]
        ];
    }

    public function registerNavigation()
    {
        return [
            'blog' => [
                'label'       => 'Blog',
                'url'         => 'http://rainlab.tld/blog/posts',
                'icon'        => 'icon-pencil',
                'permissions' => ['rainlab.blog.*'],
                'order'       => 500,

                'sideMenu' => [
                    'posts' => [
                        'label'       => 'Posts',
                        'icon'        => 'icon-copy',
                        'url'         => 'http://rainlab.tld/blog/posts',
                        'permissions' => ['rainlab.blog.access_posts']
                    ],
                    'categories' => [
                        'label'       => 'Categories',
                        'icon'        => 'icon-list-ul',
                        'url'         => 'http://rainlab.tld/blog/categories',
                        'permissions' => ['rainlab.blog.access_categories']
                    ],
                ]
            ]
        ];
    }

}
