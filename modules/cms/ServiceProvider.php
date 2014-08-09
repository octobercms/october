<?php namespace Cms;

use Lang;
use Backend;
use BackendMenu;
use BackendAuth;
use Backend\Classes\WidgetManager;
use October\Rain\Support\ModuleServiceProvider;
use System\Classes\SettingsManager;
use Cms\Classes\ComponentManager;

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
                'cms.manage_content'   => ['label' => 'cms::lang.permissions.manage_content', 'tab' => 'Cms'],
                'cms.manage_assets'    => ['label' => 'cms::lang.permissions.manage_assets', 'tab' => 'Cms'],
                'cms.manage_pages'     => ['label' => 'cms::lang.permissions.manage_pages', 'tab' => 'Cms'],
                'cms.manage_layouts'   => ['label' => 'cms::lang.permissions.manage_layouts', 'tab' => 'Cms'],
                'cms.manage_partials'  => ['label' => 'cms::lang.permissions.manage_partials', 'tab' => 'Cms'],
                'cms.manage_themes'    => ['label' => 'cms::lang.permissions.manage_themes', 'tab' => 'Cms']
            ]);
        });

        /*
         * Register widgets
         */
        WidgetManager::instance()->registerFormWidgets(function($manager){
            $manager->registerFormWidget('Cms\FormWidgets\Components');
        });

        /*
         * Register settings
         */
        SettingsManager::instance()->registerCallback(function($manager){
            $manager->registerSettingItems('October.Cms', [
                'theme' => [
                    'label'       => 'cms::lang.theme.settings_menu',
                    'description' => 'cms::lang.theme.settings_menu_description',
                    'category'    => SettingsManager::CATEGORY_CMS,
                    'icon'        => 'icon-picture-o',
                    'url'         => Backend::URL('cms/themes'),
                    'order'       => 200
                ]
            ]);
        });

        /*
         * Register components
         */
        ComponentManager::instance()->registerComponents(function($manager){
            $manager->registerComponent('Cms\Classes\ViewBag', 'viewBag');
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
