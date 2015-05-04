<?php namespace System\Controllers;

use Str;
use Lang;
use File;
use Flash;
use Config;
use Backend;
use Redirect;
use Response;
use BackendMenu;
use Cms\Classes\ThemeManager;
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
        $this->addCss('/modules/system/assets/css/updates/updates.css', 'core');

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
     * Install new plugins / themes
     */
    public function install($tab = null)
    {
        if (get('search')) {
            return Response::make($this->onSearchProducts());
        }

        try {
            $this->bodyClass = 'compact-container breadcrumb-flush';
            $this->pageTitle = 'system::lang.plugins.install_products';

            $this->addJs('/modules/system/assets/js/updates/install.js', 'core');
            $this->addCss('/modules/system/assets/css/updates/install.css', 'core');

            $this->vars['activeTab'] = $tab ?: 'plugins';
            $this->vars['installedPlugins'] = $this->getInstalledPlugins();
            $this->vars['installedThemes'] = $this->getInstalledThemes();
        }
        catch (Exception $ex) {
            $this->handleError($ex);
        }
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
                return Redirect::refresh();

            case 'completeInstall':
                $manager->update();
                Flash::success(Lang::get('system::lang.install.install_success'));
                return Redirect::refresh();
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

        if (!is_array($themes)) {
            $themes = [];
        }

        if (!is_array($plugins)) {
            $plugins = [];
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

        foreach ($themes as $name => $hash) {
            $updateSteps[] = [
                'code'  => 'downloadTheme',
                'label' => Lang::get('system::lang.updates.theme_downloading', compact('name')),
                'name'  => $name,
                'hash'  => $hash
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

        foreach ($themes as $name => $hash) {
            $updateSteps[] = [
                'code' => 'extractTheme',
                'label' => Lang::get('system::lang.updates.theme_extracting', compact('name')),
                'name' => $name,
                'hash' => $hash
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
     * Rollback and remove plugins from the system.
     * @return void
     */
    public function onRemovePlugins()
    {
        if (($checkedIds = post('checked')) && is_array($checkedIds) && count($checkedIds)) {

            foreach ($checkedIds as $objectId) {
                if (!$object = PluginVersion::find($objectId)) {
                    continue;
                }

                PluginManager::instance()->deletePlugin($object->code);
            }

            Flash::success(Lang::get('system::lang.plugins.remove_success'));
        }

        return $this->listRefresh('manage');
    }

    /**
     * Rollback and remove a single plugin from the system.
     * @return void
     */
    public function onRemovePlugin()
    {
        if ($pluginCode = post('code')) {

            PluginManager::instance()->deletePlugin($pluginCode);

            Flash::success(Lang::get('system::lang.plugins.remove_success'));
        }

        return Redirect::refresh();
    }

    /**
     * Rebuilds plugin database migrations.
     * @return void
     */
    public function onRefreshPlugins()
    {
        if (($checkedIds = post('checked')) && is_array($checkedIds) && count($checkedIds)) {

            foreach ($checkedIds as $objectId) {
                if (!$object = PluginVersion::find($objectId)) {
                    continue;
                }

                PluginManager::instance()->refreshPlugin($object->code);
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

    //
    // Theme management
    //

    /**
     * Validate the theme code and execute the theme installation
     */
    public function onInstallTheme()
    {
        try {
            if (!$code = trim(post('code'))) {
                throw new ApplicationException(Lang::get('system::lang.install.missing_theme_name'));
            }

            $manager = UpdateManager::instance();
            $result = $manager->requestThemeDetails($code);

            if (!isset($result['code']) || !isset($result['hash'])) {
                throw new ApplicationException(Lang::get('system::lang.server.response_invalid'));
            }

            $name = $result['code'];
            $hash = $result['hash'];
            $themes = [$name => $hash];
            $plugins = [];

            foreach ((array) array_get($result, 'require') as $plugin) {
                if (
                    ($name = array_get($plugin, 'code')) &&
                    ($hash = array_get($plugin, 'hash'))
                ) {
                    $plugins[$name] = $hash;
                }
            }

            /*
             * Update steps
             */
            $updateSteps = $this->buildUpdateSteps(null, $plugins, $themes);

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
            return $this->makePartial('theme_form');
        }
    }

    /**
     * Deletes a single theme from the system.
     * @return void
     */
    public function onRemoveTheme()
    {
        if ($themeCode = post('code')) {

            ThemeManager::instance()->deleteTheme($themeCode);

            Flash::success(trans('cms::lang.theme.delete_theme_success'));
        }

        return Redirect::refresh();
    }

    //
    // Product install
    //

    public function onSearchProducts()
    {
        $searchType = get('search', 'plugins');
        $serverUri = $searchType == 'plugins' ? 'plugin/search' : 'theme/search';

        $manager = UpdateManager::instance();
        return $manager->requestServerData($serverUri, ['query' => get('query')]);
    }

    public function onGetPopularPlugins()
    {
        $installed = $this->getInstalledPlugins();
        $popular = UpdateManager::instance()->requestPopularProducts('plugin');
        $popular = $this->filterPopularProducts($popular, $installed);

        return ['result' => $popular];
    }

    public function onGetPopularThemes()
    {
        $installed = $this->getInstalledThemes();
        $popular = UpdateManager::instance()->requestPopularProducts('theme');
        $popular = $this->filterPopularProducts($popular, $installed);

        return ['result' => $popular];
    }

    protected function getInstalledPlugins()
    {
        $installed = PluginVersion::lists('code');
        $manager = UpdateManager::instance();
        return $manager->requestProductDetails($installed, 'plugin');
    }

    protected function getInstalledThemes()
    {
        $history = Parameters::get('system::theme.history', []);
        $manager = UpdateManager::instance();
        $installed = $manager->requestProductDetails(array_keys($history), 'theme');

        /*
         * Splice in the directory names
         */
        foreach ($installed as $key => $data) {
            $code = array_get($data, 'code');
            $installed[$key]['dirName'] = array_get($history, $code, $code);
        }

        return $installed;
    }

    /*
     * Remove installed products from the collection
     */
    protected function filterPopularProducts($popular, $installed)
    {
        $installedArray = [];
        foreach ($installed as $product) {
            $installedArray[] = array_get($product, 'code', -1);
        }

        foreach ($popular as $key => $product) {
            $code = array_get($product, 'code');
            if (in_array($code, $installedArray)) {
                unset($popular[$key]);
            }
        }

        return array_values($popular);
    }

}
