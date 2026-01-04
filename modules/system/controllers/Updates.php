<?php namespace System\Controllers;

use Lang;
use Flash;
use Backend;
use BackendAuth;
use BackendMenu;
use System\Models\PluginVersion;
use System\Classes\UpdateManager;
use System\Classes\PluginManager;
use System\Classes\SettingsManager;
use System\Widgets\Changelog;
use System\Widgets\Updater;
use Backend\Classes\Controller;
use October\Rain\Composer\ComposerManager;
use ValidationException;
use Exception;

/**
 * Updates controller
 *
 * @package october\system
 * @author Alexey Bobkov, Samuel Georges
 *
 */
class Updates extends Controller
{
    /**
     * @var array Extensions implemented by this controller.
     */
    public $implement = [
        \Backend\Behaviors\ListController::class
    ];

    /**
     * @var array `ListController` configuration.
     */
    public $listConfig = [
        'list' => 'config_list.yaml',
        'manage' => 'config_manage_list.yaml'
    ];

    /**
     * @var array requiredPermissions to view this page.
     */
    public $requiredPermissions = ['general.backend.perform_updates'];

    /**
     * @var System\Widgets\Changelog
     */
    protected $changelogWidget;

    /**
     * @var System\Widgets\Updater
     */
    protected $updaterWidget;

    /**
     * __construct the class
     */
    public function __construct()
    {
        parent::__construct();

        BackendMenu::setContext('October.System', 'system', 'updates');
        SettingsManager::setContext('October.System', 'updates');

        $this->changelogWidget = new Changelog($this);
        $this->changelogWidget->bindToController();

        $this->updaterWidget = new Updater($this);
        $this->updaterWidget->bindToController();
    }

    /**
     * index controller
     */
    public function index()
    {
        $this->addJs('/modules/system/assets/js/pages/updates.js');

        try {
            $this->vars['projectDetails'] = UpdateManager::instance()->getProjectDetails();
        }
        catch (Exception $ex) {
            $this->vars['projectDetails'] = null;
        }

        $this->vars['currentVersion'] = UpdateManager::instance()->getCurrentVersion();
        $this->vars['pluginsActiveCount'] = PluginVersion::applyEnabled()->count();
        $this->vars['pluginsCount'] = PluginVersion::count();
        return $this->asExtension('ListController')->index();
    }

    /**
     * index_onCompareVersions
     */
    public function index_onCompareVersions()
    {
        $force = (bool) post('force', false);

        return UpdateManager::instance()->checkVersions($force);
    }

    /**
     * manage controller for plugins
     */
    public function manage()
    {
        $this->pageTitle = "Manage Plugins";
        PluginManager::instance()->clearDisabledCache();

        $this->vars['canUpdate'] = BackendAuth::userHasAccess('general.backend.perform_updates');
        return $this->asExtension('ListController')->index();
    }

    /**
     * manage_onBulkAction performs a bulk action on the provided plugins
     */
    public function manage_onBulkAction()
    {
        if (
            ($bulkAction = post('action')) &&
            ($checkedIds = post('checked')) &&
            is_array($checkedIds) &&
            count($checkedIds)
        ) {
            $manager = PluginManager::instance();

            foreach ($checkedIds as $pluginId) {
                if (!$plugin = PluginVersion::find($pluginId)) {
                    continue;
                }

                $savePlugin = true;
                switch ($bulkAction) {
                    // Disables plugin on the system
                    case 'disable':
                        $plugin->is_disabled = 1;
                        $manager->disablePlugin($plugin->code, true);
                        break;

                    // Enables plugin on the system
                    case 'enable':
                        $plugin->is_disabled = 0;
                        $manager->enablePlugin($plugin->code, true);
                        break;

                    // Rebuilds plugin database migrations
                    case 'refresh':
                        $savePlugin = false;
                        if ($plugin->orphaned) {
                            UpdateManager::instance()->rollbackPlugin($plugin->code);
                        }
                        else {
                            $manager->refreshPlugin($plugin->code);
                        }
                        break;

                    // Rollback and remove plugins from the system
                    case 'remove':
                        $savePlugin = false;
                        $manager->deletePlugin($plugin->code);
                        break;
                }

                if ($savePlugin) {
                    $plugin->save();
                }
            }
        }

        // Reload plugin dependency tree
        PluginManager::instance()->reloadDisabledCache();

        Flash::success(Lang::get("system::lang.plugins.{$bulkAction}_success"));
        return $this->listRefresh('manage');
    }

    /**
     * listInjectRowClass is an override for the ListController behavior
     * Modifies the CSS class for each row in the list to
     *
     * - hidden - Disabled by configuration
     * - safe disabled - Orphaned or disabled
     * - negative - Disabled by system
     * - frozen - Frozen by the user
     * - positive - Default CSS class
     *
     * @see Backend\Behaviors\ListController
     * @return string
     */
    public function listInjectRowClass($record, $definition = null)
    {
        if ($record->disabledByConfig) {
            return 'hidden';
        }

        if ($record->orphaned || $record->is_disabled) {
            return 'safe disabled';
        }

        if ($record->disabledBySystem) {
            return 'negative';
        }

        if ($definition !== 'manage') {
            return;
        }

        return 'positive';
    }

    /**
     * onLoadProjectForm displays the form for entering a license key
     */
    public function onLoadProjectForm()
    {
        return $this->makePartial('project_form');
    }

    /**
     * onAttachProject validates the project ID and execute the project installation
     */
    public function onAttachProject()
    {
        try {
            if (!$projectId = trim(post('project_id'))) {
                throw new ValidationException(['project_id' => Lang::get('system::lang.project.id.missing')]);
            }

            // Validate input with gateway
            $manager = UpdateManager::instance();
            $result = $manager->requestProjectDetails($projectId);

            // Check project status
            $isActive = $result['is_active'] ?? false;
            if (!$isActive) {
                throw new ValidationException(['project_id' => __("License is unpaid or has expired. Please visit octobercms.com to obtain a license.")]);
            }

            // Store project details
            $manager->storeProjectDetails($result);

            // Add gateway as a composer repo
            $this->ensureComposerRegistered();

            Flash::success(__("Thanks for being a customer of October CMS!"));
            return Backend::redirect('system/updates');
        }
        catch (Exception $ex) {
            throw new ValidationException(['project_id' => $ex->getMessage()]);
        }
    }

    /**
     * Make sure composer is ready to receive updates
     */
    protected function ensureComposerRegistered()
    {
        $manager = UpdateManager::instance();
        $composer = ComposerManager::instance();

        $composerUrl = $manager->getComposerUrl();

        if (!$composer->hasRepository($composerUrl)) {
            $composer->addOctoberRepository($composerUrl);
        }

        if (!$composer->getPackageVersions(['october/system'])) {
            $composer->addPackages(['october/all' => "^".\System\Facades\System::VERSION]);
        }
    }
}
