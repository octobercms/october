<?php namespace Tailor;

use Url;
use Event;
use Backend\Models\UserRole;
use Tailor\Classes\BlueprintIndexer;
use October\Rain\Support\ModuleServiceProvider;

/**
 * ServiceProvider for Tailor module
 */
class ServiceProvider extends ModuleServiceProvider
{
    /**
     * register the service provider
     */
    public function register()
    {
        parent::register('tailor');

        $this->registerSingletons();
        $this->registerEditorEvents();
        $this->registerConsole();
        $this->registerRenamedClasses();

        $this->extendMigrateCommand();
        $this->extendDeferredBindingForContent();
    }

    /**
     * boot the module events
     */
    public function boot()
    {
        parent::boot('tailor');

        $this->bootPageManagerEvents();
    }

    /**
     * registerComponents
     */
    public function registerComponents()
    {
        return [
           \Tailor\Components\GlobalComponent::class => 'global',
           \Tailor\Components\SectionComponent::class => 'section',
           \Tailor\Components\CollectionComponent::class => 'collection',
        ];
    }

    /**
     * registerNavigation
     */
    public function registerNavigation()
    {
        return BlueprintIndexer::instance()->getNavigationMainMenu() +
            BlueprintIndexer::instance()->getNavigationContentMainMenu();
    }

    /**
     * registerSettings
     */
    public function registerSettings()
    {
        return BlueprintIndexer::instance()->getNavigationSettingsMenu();
    }

    /**
     * registerPermissions
     */
    public function registerPermissions()
    {
        return [
            // Editor
            'editor.tailor_blueprints' => [
                'label' => "Manage Blueprints",
                'tab' => "Editor",
                'roles' => UserRole::CODE_DEVELOPER,
                'order' => 100
            ],
            // Tailor
            'tailor.entry' => [
                'label' => "Manage Entries",
                'tab' => "Tailor",
                'order' => 900
            ],
            'tailor.global' => [
                'label' => "Manage Globals",
                'tab' => "Tailor",
                'order' => 910
            ]
        ] + BlueprintIndexer::instance()->getPermissionDefinitions();
    }

    /**
     * registerSingletons
     */
    protected function registerSingletons()
    {
        $this->app->singleton('tailor.fields', \Tailor\Classes\FieldManager::class);
        $this->app->singleton('tailor.record.indexer', \Tailor\Classes\RecordIndexer::class);
        $this->app->singleton('tailor.blueprint.indexer', \Tailor\Classes\BlueprintIndexer::class);
        $this->app->singleton('tailor.blueprint.verifier', \Tailor\Classes\BlueprintVerifier::class);

        $this->app->singleton('validation.presence.tailor', function ($app) {
            return new \Tailor\Classes\PresenceVerifier($app['db']);
        });
    }

    /**
     * registerEditorEvents handles Editor events
     */
    protected function registerEditorEvents()
    {
        Event::listen('editor.extension.register', function () {
            return \Tailor\Classes\EditorExtension::class;
        });

        Event::listen('editor.extension.defineYamlSchemas', function () {
            return [
                [
                    'uri' => Url::asset('modules/tailor/assets/js/blueprint-yaml-schema.json'),
                    'fileMatch' => ['*-blueprint.yaml']
                ]
            ];
        });
    }

    /**
     * registerConsole
     */
    protected function registerConsole()
    {
        $this->registerConsoleCommand('tailor.refresh', \Tailor\Console\TailorRefresh::class);
        $this->registerConsoleCommand('tailor.migrate', \Tailor\Console\TailorMigrate::class);
        $this->registerConsoleCommand('tailor.prune', \Tailor\Console\TailorPrune::class);
        $this->registerConsoleCommand('tailor.propagate', \Tailor\Console\TailorPropagate::class);
    }

    /**
     * registerContentFields
     */
    public function registerContentFields()
    {
        return [
            \Tailor\ContentFields\MixinField::class => 'mixin',
            \Tailor\ContentFields\EntriesField::class => 'entries',
            \Tailor\ContentFields\RepeaterField::class => 'repeater',
            \Tailor\ContentFields\RichEditorField::class => 'richeditor',
            \Tailor\ContentFields\MarkdownField::class => 'markdown',
            \Tailor\ContentFields\FileUploadField::class => 'fileupload',
            \Tailor\ContentFields\MediaFinderField::class => 'mediafinder',
            \Tailor\ContentFields\PageFinderField::class => 'pagefinder',
            \Tailor\ContentFields\DataTableField::class => 'datatable',
            \Tailor\ContentFields\NestedFormField::class => 'nestedform',
            \Tailor\ContentFields\NestedItemsField::class => 'nesteditems',
            \Tailor\ContentFields\DatePickerField::class => 'datepicker',
            \Tailor\ContentFields\NumberField::class => 'number',
            \Tailor\ContentFields\TagListField::class => 'taglist',
            \Tailor\ContentFields\RecordFinderField::class => 'recordfinder',
        ];
    }

    /**
     * extendMigrateCommand to migrate blueprints
     */
    public function extendMigrateCommand()
    {
        Event::listen('system.updater.migrate', function ($updateManager) {
            BlueprintIndexer::instance()
                ->setNotesOutput($updateManager->getNotesOutput())->migrate();
        });
    }

    /**
     * extendDeferredBindingForContent
     */
    protected function extendDeferredBindingForContent()
    {
        Event::listen('deferredBinding.newMasterInstance', function($model, $masterObject) {
            if (
                $masterObject instanceof \Tailor\Models\EntryRecord ||
                $masterObject instanceof \Tailor\Models\RepeaterItem ||
                $masterObject instanceof \Tailor\Models\GlobalRecord
            ) {
                $masterObject->extendDeferredContentModel($model);
            }
        });
    }

    /**
     * bootPageManagerEvents
     */
    protected function bootPageManagerEvents()
    {
        Event::listen(['cms.pageLookup.listTypes', 'pages.menuitem.listTypes'], function () {
            return BlueprintIndexer::instance()->listPageManagerTypes();
        });

        Event::listen(['cms.pageLookup.getTypeInfo', 'pages.menuitem.getTypeInfo'], function ($type) {
            if (starts_with($type, ['entry-', 'list-entry-'])) {
                return BlueprintIndexer::instance()->getPageManagerTypeInfo($type);
            }
        });

        Event::listen(['cms.pageLookup.resolveItem', 'pages.menuitem.resolveItem'], function ($type, $item, $url, $theme) {
            if (starts_with($type, ['entry-', 'list-entry-'])) {
                return BlueprintIndexer::instance()->resolvePageManagerItem($type, $item, $url, $theme);
            }
        });
    }

    /**
     * registerRenamedClasses
     */
    protected function registerRenamedClasses()
    {
        $this->app->registerClassAliases([
            \Tailor\Models\EntryRecordImport::class => \Tailor\Models\RecordImport::class,
            \Tailor\Models\EntryRecordExport::class => \Tailor\Models\RecordExport::class
        ]);
    }
}
