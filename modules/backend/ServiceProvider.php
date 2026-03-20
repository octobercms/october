<?php namespace Backend;

use Backend;
use System\Classes\SettingsManager;
use Backend\Models\UserRole;
use Backend\Models\BrandSetting;
use October\Rain\Support\ModuleServiceProvider;

/**
 * ServiceProvider for Backend module
 */
class ServiceProvider extends ModuleServiceProvider
{
    /**
     * register the service provider.
     */
    public function register()
    {
        parent::register('backend');

        $this->registerSingletons();
    }

    /**
     * boot the module events.
     */
    public function boot()
    {
        parent::boot('backend');
    }

    /**
     * registerSingletons
     */
    protected function registerSingletons()
    {
        $this->app->singleton('backend.helper', \Backend\Helpers\Backend::class);
        $this->app->singleton('backend.roles', \Backend\Classes\RoleManager::class);
        $this->app->scoped('backend.auth', fn () => \Backend\Classes\AuthManager::instance());
        $this->app->scoped('backend.menu', \Backend\Classes\NavigationManager::class);
        $this->app->scoped('backend.widgets', \Backend\Classes\WidgetManager::class);
    }

    /**
     * registerReportWidgets
     */
    public function registerReportWidgets()
    {
        return [
            \Backend\ReportWidgets\Welcome::class => [
                'label' => "Welcome",
                'context' => 'dashboard'
            ],
        ];
    }

    /**
     * registerMailTemplates
     */
    public function registerMailTemplates()
    {
        return [
            'backend:invite' => 'backend::mail.invite',
            'backend:restore' => 'backend::mail.restore',
            'backend:contact-form' => 'backend::mail.contact-form',
        ];
    }

    /**
     * registerNavigation
     */
    public function registerNavigation()
    {
        // return [
        //     'dashboard' => [
        //         'label' => "Dashboard",
        //         'icon' => 'icon-dashboard',
        //         'iconSvg' => 'modules/backend/assets/images/dashboard-icon.svg',
        //         'url' => Backend::url('backend'),
        //         'permissions' => ['dashboard.*', 'dashboard'],
        //         'order' => 10
        //     ]
        // ];
    }

    /**
     * registerPermissions
     */
    public function registerPermissions()
    {
        return [
            // General
            'general.backend' => [
                'label' => 'Access the Backend Panel',
                'tab' => 'General',
                'order' => 200
            ],
            'general.backend.view_offline' => [
                'label' => 'View Backend During Maintenance',
                'tab' => 'General',
                'order' => 300
            ],
            'general.backend.perform_updates' => [
                'label' => 'Perform Software Updates',
                'tab' => 'General',
                'roles' => UserRole::CODE_DEVELOPER,
                'order' => 300
            ],

            // Administrators
            'admins.manage' => [
                'label' => 'Manage Admins',
                'tab' => 'Administrators',
                'order' => 200
            ],
            'admins.manage.create' => [
                'label' => 'Create Admins',
                'tab' => 'Administrators',
                'order' => 300
            ],
            // 'admins.manage.moderate' => [
            //     'label' => 'Moderate Admins',
            //     'comment' => 'Manage account suspension and ban admin accounts',
            //     'tab' => 'Administrators',
            //     'order' => 400
            // ],
            'admins.manage.other_admins' => [
                'label' => 'Manage Other Admins',
                'comment' => 'Allow users to reset passwords and update emails.',
                'tab' => 'Administrators',
                'order' => 700
            ],
            'admins.manage.delete' => [
                'label' => 'Delete Admins',
                'tab' => 'Administrators',
                'order' => 800
            ],
            'admins.roles' => [
                'label' => 'Role Permissions',
                'comment' => 'Allow users to create new roles and manage roles lower than their highest role.',
                'tab' => 'Administrators',
                'order' => 500
            ],
            'admins.groups' => [
                'label' => 'Team Groups',
                'tab' => 'Administrators',
                'order' => 600
            ],

            // Preferences
            'preferences' => [
                'label' => "Manage Backend Preferences",
                'tab' => 'Preferences',
                'order' => 400
            ],
            'preferences.code_editor' => [
                'label' => "Manage Code Editor Preferences",
                'tab' => 'Preferences',
                'order' => 500
            ],

            // Settings
            'settings.customize_backend' => [
                'label' => "Customize Backend Styles",
                'tab' => 'Settings',
                'order' => 400
            ],
            'settings.editor_settings' => [
                'label' => 'Global Editor Settings',
                'comment' => "Change the global editor preferences.",
                'tab' => 'Settings',
                'order' => 500
            ]
        ];
    }

    /**
     * registerFormWidgets
     */
    public function registerFormWidgets()
    {
        return [
            \Backend\FormWidgets\CodeEditor::class => 'codeeditor',
            \Backend\FormWidgets\RichEditor::class => 'richeditor',
            \Backend\FormWidgets\MarkdownEditor::class => 'markdown',
            \Backend\FormWidgets\FileUpload::class => 'fileupload',
            \Backend\FormWidgets\Relation::class => 'relation',
            \Backend\FormWidgets\DatePicker::class => 'datepicker',
            \Backend\FormWidgets\ColorPicker::class => 'colorpicker',
            \Backend\FormWidgets\DataTable::class => 'datatable',
            \Backend\FormWidgets\RecordFinder::class => 'recordfinder',
            \Backend\FormWidgets\Repeater::class => 'repeater',
            \Backend\FormWidgets\TagList::class => 'taglist',
            \Backend\FormWidgets\NestedForm::class => 'nestedform',
            \Backend\FormWidgets\Sensitive::class => 'sensitive',
        ];
    }

    /**
     * registerFilterWidgets
     */
    public function registerFilterWidgets()
    {
        return [
            \Backend\FilterWidgets\Group::class => 'group',
            \Backend\FilterWidgets\Date::class => 'date',
            \Backend\FilterWidgets\Text::class => 'text',
            \Backend\FilterWidgets\Number::class => 'number',
        ];
    }

    /**
     * registerSettings
     */
    public function registerSettings()
    {
        return [
            'branding' => [
                'label' => "Branding & Appearance",
                'description' => "Customize the administration area such as name, colors and logo.",
                'category' => SettingsManager::CATEGORY_BACKEND,
                'icon' => 'ph ph-terminal-window',
                'class' => \Backend\Models\BrandSetting::class,
                'permissions' => ['settings.customize_backend'],
                'order' => 400,
                'keywords' => 'brand style'
            ],
            'editor' => [
                'label' => "Editor Settings",
                'description' => "Change the global editor preferences.",
                'category' => SettingsManager::CATEGORY_BACKEND,
                'icon' => 'icon-code',
                'class' => \Backend\Models\EditorSetting::class,
                'permissions' => ['settings.editor_settings'],
                'order' => 410,
                'keywords' => 'html code class style'
            ],
            'administrators' => [
                'label' => "Administrators",
                'description' => "Manage back-end administrator users, groups and permissions.",
                'category' => SettingsManager::CATEGORY_TEAM,
                'icon' => 'ph ph-users-three',
                'url' => Backend::url('backend/users'),
                'permissions' => ['admins.manage'],
                'order' => 500
            ],
            'adminroles' => [
                'label' => "Role Permissions",
                'description' => "Define permissions for administrators based on their role.",
                'category' => SettingsManager::CATEGORY_TEAM,
                'icon' => 'icon-id-card-1',
                'url' => Backend::url('backend/userroles'),
                'permissions' => ['admins.roles'],
                'order' => 510
            ],
            'admingroups' => [
                'label' => "Team Groups",
                'description' => "Add administrators to groups used for notifications and features.",
                'category' => SettingsManager::CATEGORY_TEAM,
                'icon' => 'icon-user-group',
                'url' => Backend::url('backend/usergroups'),
                'permissions' => ['admins.groups'],
                'order' => 520
            ],
            'myaccount' => [
                'label' => "My Account",
                'description' => "Update your account details such as name, email address and password.",
                'category' => SettingsManager::CATEGORY_MYSETTINGS,
                'icon' => 'icon-user-account',
                'url' => Backend::url('backend/users/myaccount'),
                'order' => 600,
                'context' => 'mysettings',
                'keywords' => "security login"
            ],
            'preferences' => [
                'label' => "Backend Preferences",
                'description' => "Manage your account preferences such as desired language.",
                'category' => SettingsManager::CATEGORY_MYSETTINGS,
                'icon' => 'icon-app-window',
                'url' => Backend::url('backend/preferences'),
                'permissions' => ['preferences'],
                'order' => 610,
                'context' => 'mysettings'
            ],
            'color_mode' => !BrandSetting::get('show_light_switch') ? null : [
                'label' => "Color Mode",
                'category' => SettingsManager::CATEGORY_MYSETTINGS,
                'icon' => 'icon-adjust',
                'url' => 'javascript:;',
                'permissions' => ['preferences'],
                'attributes' => [
                    'data-control' => 'color-mode-switcher',
                    'data-lang-light-mode' => __("Light Mode"),
                    'data-lang-dark-mode' => __("Dark Mode"),
                    'data-lang-auto-mode' => __("Auto Mode")
                ],
                'order' => 620,
                'context' => 'mysettings'
            ],
            'access_logs' => [
                'label' => 'Access Log',
                'description' => 'View a list of successful back-end user sign ins.',
                'category' => SettingsManager::CATEGORY_LOGS,
                'icon' => 'icon-text-lock',
                'url' => Backend::url('backend/accesslogs'),
                'permissions' => ['utilities.logs'],
                'order' => 920
            ]
        ];
    }
}
