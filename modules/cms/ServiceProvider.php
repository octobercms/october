<?php namespace Cms;

use Lang;
use Backend;
use BackendMenu;
use BackendAuth;
use Cms\Classes\MarkupManager;
use Backend\Classes\WidgetManager;
use October\Rain\Support\ModuleServiceProvider;

class ServiceProvider extends ModuleServiceProvider
{
    /**
     * Register the service provider.
     *
     * @return void
     */
    public function register()
    {
        parent::register('cms');

        /*
         * Register navigation
         */
        BackendMenu::registerCallback(function($manager) {
            $manager->registerMenuItems('October.Cms', [
                'cms' => [
                    'label'       => 'cms::lang.cms.menu_label',
                    'icon'        => 'icon-magic',
                    'url'         => Backend::url('cms'),
                    'permissions' => ['cms.*'],
                    'order'       => 10,

                    'sideMenu' => [
                        'pages' => [
                            'label'       => 'cms::lang.page.menu_label',
                            'icon'        => 'icon-copy',
                            'url'         => 'javascript:;',
                            'attributes'  => ['data-menu-item'=>'pages'],
                            'permissions' => ['cms.manage_pages']
                        ],
                        'partials' => [
                            'label'       => 'cms::lang.partial.menu_label',
                            'icon'        => 'icon-tags',
                            'url'         => 'javascript:;',
                            'attributes'  => ['data-menu-item'=>'partials'],
                            'permissions' => ['cms.manage_partials']
                        ],
                        'layouts' => [
                            'label'       => 'cms::lang.layout.menu_label',
                            'icon'        => 'icon-th-large',
                            'url'         => 'javascript:;',
                            'attributes'  => ['data-menu-item'=>'layouts'],
                            'permissions' => ['cms.manage_layouts']
                        ],
                        'content' => [
                            'label'       => 'cms::lang.content.menu_label',
                            'icon'        => 'icon-file-text-o',
                            'url'         => 'javascript:;',
                            'attributes'  => ['data-menu-item'=>'content'],
                            'permissions' => ['cms.manage_content']
                        ],
                        'assets' => [
                            'label'       => 'cms::lang.asset.menu_label',
                            'icon'        => 'icon-picture-o',
                            'url'         => 'javascript:;',
                            'attributes'  => ['data-menu-item'=>'assets'],
                            'permissions' => ['cms.manage_assets']
                        ],
                        'components' => [
                            'label'       => 'cms::lang.component.menu_label',
                            'icon'        => 'icon-puzzle-piece',
                            'url'         => 'javascript:;',
                            'attributes'  => ['data-menu-item'=>'components'],
                            'permissions' => ['cms.manage_pages', 'cms:manage_layouts']
                        ]
                    ]

                ]
            ]);
        });

        /*
         * Register permissions
         */
        BackendAuth::registerCallback(function($manager) {
            $manager->registerPermissions('October.Cms', [
                'cms.manage_content'   => ['label' => 'Manage content', 'tab' => 'Cms'],
                'cms.manage_assets'    => ['label' => 'Manage assets', 'tab' => 'Cms'],
                'cms.manage_pages'     => ['label' => 'Manage pages', 'tab' => 'Cms'],
                'cms.manage_layouts'   => ['label' => 'Manage layouts', 'tab' => 'Cms'],
            ]);
        });

        /*
         * Register markup tags
         */
        MarkupManager::instance()->registerCallback(function($manager){
            $manager->registerFunctions([
                // Global helpers
                'post' => 'post',

                // Form helpers
                'form_ajax'         => ['Form', 'ajax'],
                'form_open'         => ['Form', 'open'],
                'form_close'        => ['Form', 'close'],
                'form_token'        => ['Form', 'token'],
                'form_session_key'  => ['Form', 'sessionKey'],
                'form_token'        => ['Form', 'token'],
                'form_model'        => ['Form', 'model'],
                'form_label'        => ['Form', 'label'],
                'form_text'         => ['Form', 'text'],
                'form_password'     => ['Form', 'password'],
                'form_checkbox'     => ['Form', 'checkbox'],
                'form_radio'        => ['Form', 'radio'],
                'form_file'         => ['Form', 'file'],
                'form_select'       => ['Form', 'select'],
                'form_select_range' => ['Form', 'selectRange'],
                'form_select_month' => ['Form', 'selectMonth'],
                'form_submit'       => ['Form', 'submit'],
                'form_macro'        => ['Form', '__call'],
                'form_value'        => ['Form', 'value'],
            ]);

            $manager->registerFilters([
                // String helpers
                'slug'     => ['Str', 'slug'],
                'plural'   => ['Str', 'plural'],
                'singular' => ['Str', 'singular'],
                'finish'   => ['Str', 'finish'],
                'snake'    => ['Str', 'snake'],
                'camel'    => ['Str', 'camel'],
                'studly'   => ['Str', 'studly'],
            ]);
        });

        /*
         * Register widgets
         */
        WidgetManager::instance()->registerFormWidgets(function($manager){
            $manager->registerFormWidget('Cms\FormWidgets\Components');
        });

    }

    /**
     * Bootstrap the module events.
     *
     * @return void
     */
    public function boot()
    {
        parent::boot('cms');
    }

}
