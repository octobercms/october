<?php namespace Cms;

use App;
use Url;
use Lang;
use File;
use Event;
use Backend;
use BackendMenu;
use BackendAuth;
use Backend\Models\UserRole;
use Cms\Classes\Theme as CmsTheme;
use Backend\Classes\WidgetManager;
use October\Rain\Support\ModuleServiceProvider;
use System\Classes\SettingsManager;
use Cms\Classes\ComponentManager;
use Cms\Classes\Page as CmsPage;
use Cms\Classes\CmsObject;
use Cms\Models\ThemeData;
use Cms\Models\ThemeLog;

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

        $this->registerComponents();
        $this->registerThemeLogging();
        $this->registerCombinerEvents();
        $this->registerHalcyonModels();

        /*
         * Backend specific
         */
        if (App::runningInBackend()) {
            $this->registerBackendNavigation();
            $this->registerBackendReportWidgets();
            $this->registerBackendPermissions();
            $this->registerBackendWidgets();
            $this->registerBackendSettings();
        }
    }

    /**
     * Bootstrap the module events.
     *
     * @return void
     */
    public function boot()
    {
        parent::boot('cms');

        $this->bootMenuItemEvents();
        $this->bootRichEditorEvents();

        if (App::runningInBackend()) {
            $this->bootBackendLocalization();
        }
    }

    /**
     * Register components.
     */
    protected function registerComponents()
    {
        ComponentManager::instance()->registerComponents(function ($manager) {
            $manager->registerComponent(\Cms\Components\ViewBag::class, 'viewBag');
            $manager->registerComponent(\Cms\Components\Resources::class, 'resources');
        });
    }

    /**
     * Registers theme logging on templates.
     */
    protected function registerThemeLogging()
    {
        CmsObject::extend(function ($model) {
            ThemeLog::bindEventsToModel($model);
        });
    }

    /**
     * Registers events for the asset combiner.
     */
    protected function registerCombinerEvents()
    {
        if (App::runningInBackend() || App::runningInConsole()) {
            return;
        }

        Event::listen('cms.combiner.beforePrepare', function ($combiner, $assets) {
            $filters = array_flatten($combiner->getFilters());
            ThemeData::applyAssetVariablesToCombinerFilters($filters);
        });

        Event::listen('cms.combiner.getCacheKey', function ($combiner, $holder) {
            $holder->key = $holder->key . ThemeData::getCombinerCacheKey();
        });
    }

    /*
     * Register navigation
     */
    protected function registerBackendNavigation()
    {
        BackendMenu::registerCallback(function ($manager) {
            $manager->registerMenuItems('October.Cms', [
                'cms' => [
                    'label'       => 'cms::lang.cms.menu_label',
                    'icon'        => 'icon-magic',
                    'iconSvg'     => 'modules/cms/assets/images/cms-icon.svg',
                    'url'         => Backend::url('cms'),
                    'order'       => 100,
                    'permissions' => [
                        'cms.manage_content',
                        'cms.manage_assets',
                        'cms.manage_pages',
                        'cms.manage_layouts',
                        'cms.manage_partials'
                    ],
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

            $manager->registerQuickActions('October.Cms', [
                'preview' => [
                    'label'      => 'backend::lang.tooltips.preview_website',
                    'icon'       => 'icon-crosshairs',
                    'url'        => Url::to('/'),
                    'order'      => 10,
                    'attributes' => [
                        'target' => '_blank',
                        'rel'    => 'noopener noreferrer',
                    ],
                ],
            ]);
        });
    }

    /*
     * Register report widgets
     */
    protected function registerBackendReportWidgets()
    {
        WidgetManager::instance()->registerReportWidgets(function ($manager) {
            $manager->registerReportWidget(\Cms\ReportWidgets\ActiveTheme::class, [
                'label'   => 'cms::lang.dashboard.active_theme.widget_title_default',
                'context' => 'dashboard'
            ]);
        });
    }

    /*
     * Register permissions
     */
    protected function registerBackendPermissions()
    {
        BackendAuth::registerCallback(function ($manager) {
            $manager->registerPermissions('October.Cms', [
                'cms.manage_content' => [
                    'label' => 'cms::lang.permissions.manage_content',
                    'tab' => 'cms::lang.permissions.name',
                    'roles' => UserRole::CODE_DEVELOPER,
                    'order' => 100
                ],
                'cms.manage_assets' => [
                    'label' => 'cms::lang.permissions.manage_assets',
                    'tab' => 'cms::lang.permissions.name',
                    'roles' => UserRole::CODE_DEVELOPER,
                    'order' => 100
                ],
                'cms.manage_pages' => [
                    'label' => 'cms::lang.permissions.manage_pages',
                    'tab' => 'cms::lang.permissions.name',
                    'roles' => UserRole::CODE_DEVELOPER,
                    'order' => 100
                ],
                'cms.manage_layouts' => [
                    'label' => 'cms::lang.permissions.manage_layouts',
                    'tab' => 'cms::lang.permissions.name',
                    'roles' => UserRole::CODE_DEVELOPER,
                    'order' => 100
                ],
                'cms.manage_partials' => [
                    'label' => 'cms::lang.permissions.manage_partials',
                    'tab' => 'cms::lang.permissions.name',
                    'roles' => UserRole::CODE_DEVELOPER,
                    'order' => 100
                ],
                'cms.manage_themes' => [
                    'label' => 'cms::lang.permissions.manage_themes',
                    'tab' => 'cms::lang.permissions.name',
                    'roles' => UserRole::CODE_DEVELOPER,
                    'order' => 100
                ],
                'cms.manage_theme_options' => [
                    'label' => 'cms::lang.permissions.manage_theme_options',
                    'tab' => 'cms::lang.permissions.name',
                    'order' => 100
                ],
            ]);
        });
    }

    /*
     * Register widgets
     */
    protected function registerBackendWidgets()
    {
        WidgetManager::instance()->registerFormWidgets(function ($manager) {
            $manager->registerFormWidget(FormWidgets\Components::class);
        });
    }

    /*
     * Register settings
     */
    protected function registerBackendSettings()
    {
        SettingsManager::instance()->registerCallback(function ($manager) {
            $manager->registerSettingItems('October.Cms', [
                'theme' => [
                    'label'       => 'cms::lang.theme.settings_menu',
                    'description' => 'cms::lang.theme.settings_menu_description',
                    'category'    => SettingsManager::CATEGORY_CMS,
                    'icon'        => 'icon-picture-o',
                    'url'         => Backend::url('cms/themes'),
                    'permissions' => ['cms.manage_themes', 'cms.manage_theme_options'],
                    'order'       => 200
                ],
                'maintenance_settings' => [
                    'label'       => 'cms::lang.maintenance.settings_menu',
                    'description' => 'cms::lang.maintenance.settings_menu_description',
                    'category'    => SettingsManager::CATEGORY_CMS,
                    'icon'        => 'icon-plug',
                    'class'       => Models\MaintenanceSetting::class,
                    'permissions' => ['cms.manage_themes'],
                    'order'       => 300
                ],
                'theme_logs' => [
                    'label'       => 'cms::lang.theme_log.menu_label',
                    'description' => 'cms::lang.theme_log.menu_description',
                    'category'    => SettingsManager::CATEGORY_LOGS,
                    'icon'        => 'icon-magic',
                    'url'         => Backend::url('cms/themelogs'),
                    'permissions' => ['system.access_logs'],
                    'order'       => 910,
                    'keywords'    => 'theme change log'
                ]
            ]);
        });
    }

    /**
     * Boots localization from an active theme for backend items.
     */
    protected function bootBackendLocalization()
    {
        $theme = CmsTheme::getActiveTheme();

        if (is_null($theme)) {
            return;
        }

        $langPath = $theme->getPath() . '/lang';

        if (File::isDirectory($langPath)) {
            Lang::addNamespace('themes.' . $theme->getId(), $langPath);
        }
    }

    /**
     * Registers events for menu items.
     */
    protected function bootMenuItemEvents()
    {
        Event::listen('pages.menuitem.listTypes', function () {
            return [
                'cms-page' => 'cms::lang.page.cms_page'
            ];
        });

        Event::listen('pages.menuitem.getTypeInfo', function ($type) {
            if ($type === 'cms-page') {
                return CmsPage::getMenuTypeInfo($type);
            }
        });

        Event::listen('pages.menuitem.resolveItem', function ($type, $item, $url, $theme) {
            if ($type === 'cms-page') {
                return CmsPage::resolveMenuItem($item, $url, $theme);
            }
        });
    }

    /**
     * Registers events for rich editor page links.
     */
    protected function bootRichEditorEvents()
    {
        Event::listen('backend.richeditor.listTypes', function () {
            return [
                'cms-page' => 'cms::lang.page.cms_page'
            ];
        });

        Event::listen('backend.richeditor.getTypeInfo', function ($type) {
            if ($type === 'cms-page') {
                return CmsPage::getRichEditorTypeInfo($type);
            }
        });
    }

    /**
     * Registers the models to be made available to the theme database layer
     */
    protected function registerHalcyonModels()
    {
        Event::listen('system.console.theme.sync.getAvailableModelClasses', function () {
            return [
                Classes\Meta::class,
                Classes\Page::class,
                Classes\Layout::class,
                Classes\Content::class,
                Classes\Partial::class
            ];
        });
    }
}
