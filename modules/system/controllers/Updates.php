<?php namespace System\Controllers;

use Str;
use Lang;
use Html;
use Yaml;
use File;
use Flash;
use Config;
use Backend;
use Markdown;
use Redirect;
use Response;
use BackendMenu;
use Cms\Classes\ThemeManager;
use Backend\Classes\Controller;
use System\Models\Parameter;
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

        if ($this->getAjaxHandler() == 'onExecuteStep') {
            $this->useSecurityToken = false;
        }
    }

    /**
     * Index controller
     */
    public function index()
    {
        $this->vars['coreBuild'] = Parameter::get('system::core.build');
        $this->vars['projectId'] = Parameter::get('system::project.id');
        $this->vars['projectName'] = Parameter::get('system::project.name');
        $this->vars['projectOwner'] = Parameter::get('system::project.owner');
        $this->vars['pluginsActiveCount'] = PluginVersion::applyEnabled()->count();
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

    public function details($urlCode = null, $tab = null)
    {
        try {
            $this->pageTitle = 'system::lang.updates.details_title';
            $this->addJs('/modules/system/assets/js/updates/details.js', 'core');
            $this->addCss('/modules/system/assets/css/updates/details.css', 'core');

            $readmeFiles = ['README.md', 'readme.md'];
            $upgradeFiles = ['UPGRADE.md', 'upgrade.md'];
            $licenceFiles = ['LICENCE.md', 'licence.md', 'LICENSE.md', 'license.md'];

            $readme = $changelog = $upgrades = $licence = $name = null;
            $code = str_replace('-', '.', $urlCode);

            /*
             * Lookup the plugin
             */
            $manager = PluginManager::instance();
            $plugin = $manager->findByIdentifier($code);
            $code = $manager->getIdentifier($plugin);
            $path = $manager->getPluginPath($plugin);

            if ($path && $plugin) {
                $details = $plugin->pluginDetails();
                $readme = $this->getPluginMarkdownFile($path, $readmeFiles);
                $changelog = $this->getPluginVersionFile($path, 'updates/version.yaml');
                $upgrades = $this->getPluginMarkdownFile($path, $upgradeFiles);
                $licence = $this->getPluginMarkdownFile($path, $licenceFiles);

                $pluginVersion = PluginVersion::whereCode($code)->first();
                $this->vars['pluginName'] = array_get($details, 'name', 'system::lang.plugin.unnamed');
                $this->vars['pluginVersion'] = $pluginVersion ? $pluginVersion->version : '???';
                $this->vars['pluginAuthor'] = array_get($details, 'author');
                $this->vars['pluginIcon'] = array_get($details, 'icon', 'icon-leaf');
                $this->vars['pluginHomepage'] = array_get($details, 'homepage');
            }
            else {
                throw new ApplicationException(Lang::get('system::lang.updates.plugin_not_found'));
            }

            /*
             * Fetch from server
             */
            if (get('fetch')) {
                $fetchedContent = UpdateManager::instance()->requestPluginContent($code);
                $upgrades = array_get($fetchedContent, 'upgrade_guide_html');
            }

            $this->vars['activeTab'] = $tab ?: 'readme';
            $this->vars['urlCode'] = $urlCode;
            $this->vars['readme'] = $readme;
            $this->vars['changelog'] = $changelog;
            $this->vars['upgrades'] = $upgrades;
            $this->vars['licence'] = $licence;
        }
        catch (Exception $ex) {
            $this->handleError($ex);
        }
    }

    protected function getPluginVersionFile($path, $filename)
    {
        $contents = [];

        try {
            $updates = Yaml::parseFile($path.'/'.$filename);
            $updates = is_array($updates) ? array_reverse($updates) : [];

            foreach ($updates as $version => $details) {
                $contents[$version] = is_array($details)
                    ? array_shift($details)
                    : $details;
            }
        }
        catch (Exception $ex) {}

        return $contents;
    }

    protected function getPluginMarkdownFile($path, $filenames)
    {
        $contents = null;
        foreach ($filenames as $file) {
            if (!File::exists($path . '/'.$file)) continue;

            $contents = File::get($path . '/'.$file);

            /*
             * Parse markdown, clean HTML, remove first H1 tag
             */
            $contents = Markdown::parse($contents);
            $contents = Html::clean($contents);
            $contents = preg_replace('@<h1[^>]*?>.*?<\/h1>@si', '', $contents, 1);
        }

        return $contents;
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

        if ($record->is_frozen) {
            return 'frozen';
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

            $result = $this->processUpdateLists($result);
            $result = $this->processImportantUpdates($result);

            $this->vars['core'] = array_get($result, 'core', false);
            $this->vars['hasUpdates'] = array_get($result, 'hasUpdates', false);
            $this->vars['hasImportantUpdates'] = array_get($result, 'hasImportantUpdates', false);
            $this->vars['pluginList'] = array_get($result, 'plugins', []);
            $this->vars['themeList'] = array_get($result, 'themes', []);
        }
        catch (Exception $ex) {
            $this->handleError($ex);
        }

        return ['#updateContainer' => $this->makePartial('update_list')];
    }

    /**
     * Loops the update list and checks for actionable updates.
     * @param array  $result
     * @return array
     */
    protected function processImportantUpdates($result)
    {
        $hasImportantUpdates = false;
        foreach (array_get($result, 'plugins', []) as $code => $plugin) {
            $isImportant = false;

            foreach (array_get($plugin, 'updates', []) as $version => $description) {
                if (strpos($description, '!!!') === false) continue;

                $isImportant = $hasImportantUpdates = true;
                $detailsUrl = Backend::url('system/updates/details/'.PluginVersion::makeSlug($code).'/upgrades').'?fetch=1';
                $description = str_replace('!!!', '', $description);
                $result['plugins'][$code]['updates'][$version] = [$description, $detailsUrl];
            }

            $result['plugins'][$code]['isImportant'] = $isImportant ? '1' : '0';
        }

        $result['hasImportantUpdates'] = $hasImportantUpdates;
        return $result;
    }

    /**
     * Reverses the update lists for the core and all plugins.
     * @param array  $result
     * @return array
     */
    protected function processUpdateLists($result)
    {
        if ($core = array_get($result, 'core')) {
            $result['core']['updates'] = array_reverse(array_get($core, 'updates', []), true);
        }

        foreach (array_get($result, 'plugins', []) as $code => $plugin) {
            $result['plugins'][$code]['updates'] = array_reverse(array_get($plugin, 'updates', []), true);
        }

        return $result;
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
            /*
             * Process core
             */
            $coreHash = post('hash');
            $coreBuild = post('build');
            $core = [$coreHash, $coreBuild];

            /*
             * Process plugins
             */
            $plugins = post('plugins');
            if (is_array($plugins)) {
                $pluginCodes = [];
                foreach ($plugins as $code => $hash) {
                    $pluginCodes[] = $this->decodeCode($code);
                }

                $plugins = array_combine($pluginCodes, $plugins);
            }
            else {
                $plugins = [];
            }

            /*
             * Process themes
             */
            $themes = post('themes');
            if (is_array($themes)) {
                $themeCodes = [];
                foreach ($themes as $code => $hash) {
                    $themeCodes[] = $this->decodeCode($code);
                }

                $themes = array_combine($themeCodes, $themes);
            }
            else {
                $themes = [];
            }

            /*
             * Process important update actions
             */
            $pluginActions = (array) post('plugin_actions');
            foreach ($plugins as $code => $hash) {
                $_code = $this->encodeCode($code);
                if (!array_key_exists($_code, $pluginActions)) continue;
                $pluginAction = $pluginActions[$_code];

                if (!$pluginAction) {
                    throw new ApplicationException('Please select an action for plugin '. $code);
                }

                if ($pluginAction != 'confirm') {
                    unset($plugins[$code]);
                }

                if ($pluginAction == 'ignore') {
                    PluginVersion::whereCode($code)->update([
                        'is_frozen' => true
                    ]);
                }
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

            Parameter::set([
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
        Parameter::set([
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
        $freeze = post('freeze', false);
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
                $object->is_frozen = $freeze;
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
                    ($hash = array_get($plugin, 'hash')) &&
                    !PluginManager::instance()->hasPlugin($name)
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
        $history = Parameter::get('system::theme.history', []);
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

    //
    // Helpers
    //

    /**
     * Encode HTML safe product code, this is to prevent issues with array_get().
     */
    protected function encodeCode($code)
    {
        return str_replace('.', ':', $code);
    }

    /**
     * Decode HTML safe product code.
     */
    protected function decodeCode($code)
    {
        return str_replace(':', '.', $code);
    }
}
