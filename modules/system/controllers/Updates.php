<?php namespace System\Controllers;

use Str;
use Lang;
use File;
use Flash;
use Config;
use Backend;
use Redirect;
use BackendMenu;
use Backend\Classes\Controller;
use System\Models\Parameters;
use System\Models\PluginVersion;
use System\Classes\UpdateManager;
use System\Classes\PluginManager;
use System\Classes\SettingsManager;
use ApplicationException;
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
    public $implement = ['Backend.Behaviors.ListController'];

    public $requiredPermissions = ['system.manage_updates'];

    public $listConfig = ['list' => 'config_list.yaml', 'manage' => 'config_manage_list.yaml'];

    public function __construct()
    {
        parent::__construct();

        $this->addJs('/modules/system/assets/js/updates/updates.js', 'core');
        $this->addCss('/modules/system/assets/css/updates.css', 'core');

        BackendMenu::setContext('October.System', 'system', 'updates');
        SettingsManager::setContext('October.System', 'updates');
    }

    /**
     * Index controller
     */
    public function index()
    {
        $this->vars['coreBuild'] = Parameters::get('system::core.build');
        $this->vars['projectId'] = Parameters::get('system::project.id');
        $this->vars['projectName'] = Parameters::get('system::project.name');
        $this->vars['projectOwner'] = Parameters::get('system::project.owner');
        $this->vars['pluginsActiveCount'] = PluginVersion::isEnabled()->count();
        $this->vars['pluginsCount'] = PluginVersion::count();
        return $this->asExtension('ListController')->index();
    }

    /**
     * Plugin manage controller
     */
    public function manage()
    {
        $this->pageTitle = 'system::lang.plugins.manage';
        PluginManager::instance()->clearDisabledCache();
        return $this->asExtension('ListController')->index();
    }

    /**
     * {@inheritDoc}
     */
    public function listInjectRowClass($record, $definition = null)
    {
        if ($record->disabledByConfig) {
            return 'hidden';
        }

        if ($record->orphaned || $record->is_disabled) {
            return 'safe disabled';
        }

        if ($definition != 'manage') {
            return;
        }

        if ($record->disabledBySystem) {
            return 'negative';
        }

        return 'positive';
    }

    /**
     * Runs a specific update step.
     */
    public function onExecuteStep()
    {
        /*
         * Address timeout limits
         */
        @set_time_limit(3600);

        $manager = UpdateManager::instance();
        $stepCode = post('code');

        switch ($stepCode) {
            case 'downloadCore':
                $manager->downloadCore(post('hash'));
                break;

            case 'extractCore':
                $manager->extractCore(post('hash'), post('build'));
                break;

            case 'downloadPlugin':
                $manager->downloadPlugin(post('name'), post('hash'));
                break;

            case 'downloadTheme':
                $manager->downloadTheme(post('name'), post('hash'));
                break;

            case 'extractPlugin':
                $manager->extractPlugin(post('name'), post('hash'));
                break;

            case 'extractTheme':
                $manager->extractTheme(post('name'), post('hash'));
                break;

            case 'completeUpdate':
                $manager->update();
                Flash::success(Lang::get('system::lang.updates.update_success'));
                return Backend::redirect('system/updates');

            case 'completeInstall':
                $manager->update();
                Flash::success(Lang::get('system::lang.install.install_success'));
                return Backend::redirect('system/updates');
        }
    }

    //
    // Updates
    //

    /**
     * Spawns the update checker popup.
     */
    public function onLoadUpdates()
    {
        return $this->makePartial('update_form');
    }

    /**
     * Contacts the update server for a list of necessary updates.
     */
    public function onCheckForUpdates()
    {
        try {
            $manager = UpdateManager::instance();
            $result = $manager->requestUpdateList();

            $this->vars['core'] = array_get($result, 'core', false);
            $this->vars['hasUpdates'] = array_get($result, 'hasUpdates', false);
            $this->vars['pluginList'] = array_get($result, 'plugins', []);
            $this->vars['themeList'] = array_get($result, 'themes', []);
        }
        catch (Exception $ex) {
            $this->handleError($ex);
        }

        return ['#updateContainer' => $this->makePartial('update_list')];
    }

    /**
     * Contacts the update server for a list of necessary updates.
     */
    public function onForceUpdate()
    {
        try {
            $manager = UpdateManager::instance();
            $result = $manager->requestUpdateList(true);

            $coreHash = array_get($result, 'core.hash', false);
            $coreBuild = array_get($result, 'core.build', false);
            $core = [$coreHash, $coreBuild];

            $plugins = [];
            $pluginList = array_get($result, 'plugins', []);
            foreach ($pluginList as $code => $plugin) {
                $plugins[$code] = array_get($plugin, 'hash', null);
            }

            $themes = [];
            $themeList = array_get($result, 'themes', []);
            foreach ($themeList as $code => $theme) {
                $themes[$code] = array_get($theme, 'hash', null);
            }

            /*
             * Update steps
             */
            $updateSteps = $this->buildUpdateSteps($core, $plugins, $themes);

            /*
             * Finish up
             */
            $updateSteps[] = [
                'code' => 'completeUpdate',
                'label' => Lang::get('system::lang.updates.update_completing'),
            ];

            $this->vars['updateSteps'] = $updateSteps;
        }
        catch (Exception $ex) {
            $this->handleError($ex);
        }

        return $this->makePartial('execute');
    }

    /**
     * Converts the update data to an actionable array of steps.
     */
    public function onApplyUpdates()
    {
        try {
            $coreHash = post('hash');
            $coreBuild = post('build');
            $core = [$coreHash, $coreBuild];

            $plugins = post('plugins', []);
            if (!is_array($plugins)) {
                $plugins = [];
            }

            $themes = post('themes', []);
            if (!is_array($themes)) {
                $themes = [];
            }

            /*
             * Update steps
             */
            $updateSteps = $this->buildUpdateSteps($core, $plugins, $themes);

            /*
             * Finish up
             */
            $updateSteps[] = [
                'code' => 'completeUpdate',
                'label' => Lang::get('system::lang.updates.update_completing'),
            ];

            $this->vars['updateSteps'] = $updateSteps;
        }
        catch (Exception $ex) {
            $this->handleError($ex);
        }

        return $this->makePartial('execute');
    }

    protected function buildUpdateSteps($core, $plugins, $themes)
    {
        if (!is_array($core)) {
            $core = [null, null];
        }

        if (!is_array($plugins)) {
            $plugins = [];
        }

        if (!is_array($themes)) {
            $themes = [];
        }

        $updateSteps = [];
        list($coreHash, $coreBuild) = $core;

        /*
         * Download
         */
        if ($coreHash) {
            $updateSteps[] = [
                'code'  => 'downloadCore',
                'label' => Lang::get('system::lang.updates.core_downloading'),
                'hash'  => $coreHash
            ];
        }

        foreach ($plugins as $name => $hash) {
            $updateSteps[] = [
                'code'  => 'downloadPlugin',
                'label' => Lang::get('system::lang.updates.plugin_downloading', compact('name')),
                'name'  => $name,
                'hash'  => $hash
            ];
        }

        foreach ($themes as $name => $hash) {
            $updateSteps[] = [
                'code'  => 'downloadTheme',
                'label' => Lang::get('system::lang.updates.theme_downloading', compact('name')),
                'name'  => $name,
                'hash'  => $hash
            ];
        }

        /*
         * Extract
         */
        if ($coreHash) {
            $updateSteps[] = [
                'code'  => 'extractCore',
                'label' => Lang::get('system::lang.updates.core_extracting'),
                'hash'  => $coreHash,
                'build' => $coreBuild
            ];
        }

        foreach ($plugins as $name => $hash) {
            $updateSteps[] = [
                'code' => 'extractPlugin',
                'label' => Lang::get('system::lang.updates.plugin_extracting', compact('name')),
                'name' => $name,
                'hash' => $hash
            ];
        }

        foreach ($themes as $name => $hash) {
            $updateSteps[] = [
                'code' => 'extractTheme',
                'label' => Lang::get('system::lang.updates.theme_extracting', compact('name')),
                'name' => $name,
                'hash' => $hash
            ];
        }

        return $updateSteps;
    }

    //
    // Bind to Project
    //

    /**
     * Displays the form for entering a Project ID
     */
    public function onLoadProjectForm()
    {
        return $this->makePartial('project_form');
    }

    /**
     * Validate the project ID and execute the project installation
     */
    public function onAttachProject()
    {
        try {
            if (!$projectId = trim(post('project_id'))) {
                throw new ApplicationException(Lang::get('system::lang.project.id.missing'));
            }

            $manager = UpdateManager::instance();
            $result = $manager->requestProjectDetails($projectId);

            Parameters::set([
                'system::project.id'    => $projectId,
                'system::project.name'  => $result['name'],
                'system::project.owner' => $result['owner'],
            ]);

            return $this->onForceUpdate();
        }
        catch (Exception $ex) {
            $this->handleError($ex);
            return $this->makePartial('project_form');
        }
    }

    public function onDetachProject()
    {
        Parameters::set([
            'system::project.id'    => null,
            'system::project.name'  => null,
            'system::project.owner' => null,
        ]);

        Flash::success(Lang::get('system::lang.project.unbind_success'));
        return Backend::redirect('system/updates');
    }

    //
    // Plugin management
    //

    /**
     * Validate the plugin code and execute the plugin installation
     */
    public function onInstallPlugin()
    {
        try {
            if (!$code = trim(post('code'))) {
                throw new ApplicationException(Lang::get('system::lang.install.missing_plugin_name'));
            }

            $manager = UpdateManager::instance();
            $result = $manager->requestPluginDetails($code);

            if (!isset($result['code']) || !isset($result['hash'])) {
                throw new ApplicationException(Lang::get('system::lang.server.response_invalid'));
            }

            $name = $result['code'];
            $hash = $result['hash'];
            $plugins = [$name => $hash];

            /*
             * Update steps
             */
            $updateSteps = $this->buildUpdateSteps(null, $plugins, []);

            /*
             * Finish up
             */
            $updateSteps[] = [
                'code'  => 'completeInstall',
                'label' => Lang::get('system::lang.install.install_completing'),
            ];

            $this->vars['updateSteps'] = $updateSteps;

            return $this->makePartial('execute');
        }
        catch (Exception $ex) {
            $this->handleError($ex);
            return $this->makePartial('plugin_form');
        }
    }

    /**
     * Removes or purges plugins from the system.
     * @return void
     */
    public function onRemovePlugins()
    {
        if (($checkedIds = post('checked')) && is_array($checkedIds) && count($checkedIds)) {

            foreach ($checkedIds as $objectId) {
                if (!$object = PluginVersion::find($objectId)) {
                    continue;
                }

                /*
                 * Rollback plugin
                 */
                $pluginCode = $object->code;
                UpdateManager::instance()->rollbackPlugin($pluginCode);

                /*
                 * Delete from file system
                 */
                if ($pluginPath = PluginManager::instance()->getPluginPath($pluginCode)) {
                    File::deleteDirectory($pluginPath);
                }
            }

            Flash::success(Lang::get('system::lang.plugins.remove_success'));
        }

        return $this->listRefresh('manage');
    }

    /**
     * Rebuilds plugin database migrations.
     * @return void
     */
    public function onRefreshPlugins()
    {
        if (($checkedIds = post('checked')) && is_array($checkedIds) && count($checkedIds)) {

            $manager = UpdateManager::instance();

            foreach ($checkedIds as $objectId) {
                if (!$object = PluginVersion::find($objectId)) {
                    continue;
                }

                /*
                 * Refresh plugin
                 */
                $pluginCode = $object->code;
                $manager->rollbackPlugin($pluginCode);
                $manager->updatePlugin($pluginCode);
            }

            Flash::success(Lang::get('system::lang.plugins.refresh_success'));
        }

        return $this->listRefresh('manage');
    }

    public function onLoadDisableForm()
    {
        try {
            $this->vars['checked'] = post('checked');
        }
        catch (Exception $ex) {
            $this->handleError($ex);
        }
        return $this->makePartial('disable_form');
    }

    public function onDisablePlugins()
    {
        $disable = post('disable', false);
        if (($checkedIds = post('checked')) && is_array($checkedIds) && count($checkedIds)) {

            $manager = PluginManager::instance();

            foreach ($checkedIds as $objectId) {
                if (!$object = PluginVersion::find($objectId)) {
                    continue;
                }

                if ($disable) {
                    $manager->disablePlugin($object->code, true);
                }
                else {
                    $manager->enablePlugin($object->code, true);
                }

                $object->is_disabled = $disable;
                $object->save();
            }

        }

        if ($disable) {
            Flash::success(Lang::get('system::lang.plugins.disable_success'));
        }
        else {
            Flash::success(Lang::get('system::lang.plugins.enable_success'));
        }

        return Backend::redirect('system/updates/manage');
    }
}
