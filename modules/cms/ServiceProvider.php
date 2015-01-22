<?php namespace Cms;

use Lang;
use Event;
use Backend;
use BackendMenu;
use BackendAuth;
use Backend\Classes\WidgetManager;
use October\Rain\Support\ModuleServiceProvider;
use System\Classes\SettingsManager;
use Cms\Classes\ComponentManager;
use Cms\Classes\Page as CmsPage;

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
        BackendMenu::registerCallback(function ($manager) {
            $manager->registerMenuItems('October.Cms', [
                'cms' => [
                    'label'       => 'cms::lang.cms.menu_label',
                    'icon'        => 'icon-magic',
                    'url'         => Backend::url('cms'),
                    'permissions' => ['cms.*'],
                    'order'       => 10,

                    'sideMenu' => [
                        'pages' => [
                            'label'        => 'cms::lang.page.menu_label',
                            'icon'         => 'icon-copy',
                            'url'          => 'javascript:;',
                            'attributes'   => ['data-menu-item' => 'pages'],
                            'permissions'  => ['cms.manage_pages'],
                            'counterLabel' => 'cms::lang.page.unsaved_label'
                        ],
                        'partials' => [
                            'label'        => 'cms::lang.partial.menu_label',
                            'icon'         => 'icon-tags',
                            'url'          => 'javascript:;',
                            'attributes'   => ['data-menu-item' => 'partials'],
                            'permissions'  => ['cms.manage_partials'],
                            'counterLabel' => 'cms::lang.partial.unsaved_label'
                        ],
                        'layouts' => [
                            'label'        => 'cms::lang.layout.menu_label',
                            'icon'         => 'icon-th-large',
                            'url'          => 'javascript:;',
                            'attributes'   => ['data-menu-item' => 'layouts'],
                            'permissions'  => ['cms.manage_layouts'],
                            'counterLabel' => 'cms::lang.layout.unsaved_label'
                        ],
                        'content' => [
                            'label'        => 'cms::lang.content.menu_label',
                            'icon'         => 'icon-file-text-o',
                            'url'          => 'javascript:;',
                            'attributes'   => ['data-menu-item' => 'content'],
                            'permissions'  => ['cms.manage_content'],
                            'counterLabel' => 'cms::lang.content.unsaved_label'
                        ],
                        'assets' => [
                            'label'        => 'cms::lang.asset.menu_label',
                            'icon'         => 'icon-picture-o',
                            'url'          => 'javascript:;',
                            'attributes'   => ['data-menu-item' => 'assets'],
                            'permissions'  => ['cms.manage_assets'],
                            'counterLabel' => 'cms::lang.asset.unsaved_label'
                        ],
                        'components' => [
                            'label'       => 'cms::lang.component.menu_label',
                            'icon'        => 'icon-puzzle-piece',
                            'url'         => 'javascript:;',
                            'attributes'  => ['data-menu-item' => 'components'],
                            'permissions' => ['cms.manage_pages', 'cms.manage_layouts', 'cms.manage_partials']
                        ]
                    ]

                ]
            ]);
        });

        /*
         * Register permissions
         */
        BackendAuth::registerCallback(function ($manager) {
            $manager->registerPermissions('October.Cms', [
                'cms.manage_content' => [
                    'label' => 'cms::lang.permissions.manage_content',
                    'tab' => 'cms::lang.permissions.name'
                ],
                'cms.manage_assets' => [
                    'label' => 'cms::lang.permissions.manage_assets',
                    'tab' => 'cms::lang.permissions.name'
                ],
                'cms.manage_pages' => [
                    'label' => 'cms::lang.permissions.manage_pages',
                    'tab' => 'cms::lang.permissions.name'
                ],
                'cms.manage_layouts' => [
                    'label' => 'cms::lang.permissions.manage_layouts',
                    'tab' => 'cms::lang.permissions.name'
                ],
                'cms.manage_partials' => [
                    'label' => 'cms::lang.permissions.manage_partials',
                    'tab' => 'cms::lang.permissions.name'
                ],
                'cms.manage_themes' => [
                    'label' => 'cms::lang.permissions.manage_themes',
                    'tab' => 'cms::lang.permissions.name'
                ]
            ]);
        });

        /*
         * Register widgets
         */
        WidgetManager::instance()->registerFormWidgets(function ($manager) {
            $manager->registerFormWidget('Cms\FormWidgets\Components');
        });

        /*
         * Register settings
         */
        SettingsManager::instance()->registerCallback(function ($manager) {
            $manager->registerSettingItems('October.Cms', [
                'theme' => [
                    'label'       => 'cms::lang.theme.settings_menu',
                    'description' => 'cms::lang.theme.settings_menu_description',
                    'category'    => SettingsManager::CATEGORY_CMS,
                    'icon'        => 'icon-picture-o',
                    'url'         => Backend::URL('cms/themes'),
                    'order'       => 200
                ],
                'maintenance_settings' => [
                    'label'       => 'cms::lang.maintenance.settings_menu',
                    'description' => 'cms::lang.maintenance.settings_menu_description',
                    'category'    => SettingsManager::CATEGORY_CMS,
                    'icon'        => 'icon-plug',
                    'class'       => 'Cms\Models\MaintenanceSettings',
                    'order'       => 400
                ],
            ]);
        });

        /*
         * Register components
         */
        ComponentManager::instance()->registerComponents(function ($manager) {
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

        Event::listen('pages.menuitem.listTypes', function () {
            return [
                'cms-page' => 'CMS Page'
            ];
        });

        Event::listen('pages.menuitem.getTypeInfo', function ($type) {
            if ($type == 'cms-page') {
                return CmsPage::getMenuTypeInfo($type);
            }
        });

        Event::listen('pages.menuitem.resolveItem', function ($type, $item, $url, $theme) {
            if ($type == 'cms-page') {
                return CmsPage::resolveMenuItem($item, $url, $theme);
            }
        });
    }
}
