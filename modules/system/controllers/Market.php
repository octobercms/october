<?php namespace System\Controllers;

use Lang;
use Flash;
use Backend;
use Response;
use BackendMenu;
use Cms\Classes\ThemeManager;
use Backend\Classes\Controller;
use System\Classes\ProductDetail;
use System\Classes\UpdateManager;
use System\Classes\PluginManager;
use System\Classes\SettingsManager;
use System\Widgets\Changelog;
use System\Widgets\Updater;
use ApplicationException;
use Exception;

/**
 * Market controller for installing projects, themes and plugins
 *
 * @package october\system
 * @author Alexey Bobkov, Samuel Georges
 *
 */
class Market extends Controller
{
    /**
     * @var array requiredPermissions to view this page.
     */
    public $requiredPermissions = ['general.backend.perform_updates'];

    /**
     * @var System\Widgets\Changelog changelogWidget
     */
    protected $changelogWidget;

    /**
     * @var System\Widgets\Updater updaterWidget
     */
    protected $updaterWidget;

    /**
     * @var bool turboRouter
     */
    public $turboRouter = false;

    /**
     * __construct
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
     * index shows marketplace information
     */
    public function index($tab = null)
    {
        if (get('search')) {
            return Response::make($this->onSearchProducts());
        }

        try {
            // $this->bodyClass = 'compact-container';
            $this->pageTitle = 'Marketplace';
            $this->pageSize = 1400;

            $this->addJs('/modules/system/assets/js/pages/market.installprocess.js');
            $this->addCss('/modules/system/assets/css/pages/market.css');

            $projectDetails = UpdateManager::instance()->getProjectDetails();
            $defaultTab = $projectDetails ? 'project' : 'plugins';

            $this->vars['projectDetails'] = $projectDetails;
            $this->vars['activeTab'] = $tab ?: $defaultTab;
        }
        catch (Exception $ex) {
            $this->handleError($ex);
        }
    }

    /**
     * plugin
     */
    public function plugin($urlCode = null, $tab = null)
    {
        try {
            $this->pageTitle = 'system::lang.updates.details_title_plugin';
            $this->pageSize = 950;
            $this->addJs('/modules/system/assets/js/pages/market.details.js');
            $this->addCss('/modules/system/assets/css/pages/market.css');

            $code = $this->slugToCode($urlCode);
            $product = new ProductDetail($code);

            if (!$product->exists()) {
                throw new ApplicationException(Lang::get('system::lang.updates.plugin_not_found'));
            }

            // Fetch from server
            // if (get('fetch')) {
            //     $fetchedContent = UpdateManager::instance()->requestPluginContent($code);
            //     $product->upgradeHtml = array_get($fetchedContent, 'upgrade_guide_html');
            // }

            $this->vars['projectDetails'] = UpdateManager::instance()->getProjectDetails();
            $this->vars['activeTab'] = $tab ?: 'readme';
            $this->vars['urlCode'] = $urlCode;
            $this->vars['product'] = $product;
        }
        catch (Exception $ex) {
            $this->handleError($ex);
        }
    }

    /**
     * theme
     */
    public function theme($urlCode = null, $tab = null)
    {
        try {
            $this->pageTitle = 'system::lang.updates.details_title_theme';
            $this->pageSize = 950;
            $this->addJs('/modules/system/assets/js/pages/market.details.js');
            $this->addCss('/modules/system/assets/css/pages/market.css');

            $code = $this->slugToCode($urlCode);
            $product = new ProductDetail($code, true);

            if (!$product->exists()) {
                throw new ApplicationException(Lang::get('system::lang.updates.theme_not_found'));
            }

            $this->vars['projectDetails'] = UpdateManager::instance()->getProjectDetails();
            $this->vars['activeTab'] = $tab ?: 'readme';
            $this->vars['urlCode'] = $urlCode;
            $this->vars['product'] = $product;
        }
        catch (Exception $ex) {
            $this->handleError($ex);
        }
    }

    /**
     * onBrowseProject
     */
    public function onBrowseProject()
    {
        $project = UpdateManager::instance()->requestBrowseProject();
        $pluginManager = PluginManager::instance();
        $themeManager = ThemeManager::instance();

        $products = collect();

        foreach (($project['plugins'] ?? []) as $plugin) {
            $installed = $pluginManager->hasPlugin($plugin['code'] ?? null);
            $slug = $this->codeToSlug($plugin['code'] ?? null);

            $plugin['type'] = 'plugin';
            $plugin['slug'] = $slug;
            $plugin['detailUrl'] = $this->actionUrl('plugin') . '/' . $slug;
            $plugin['installed'] = $installed;
            $plugin['version'] = $plugin['composer_version'] ?? '*';
            $plugin['handler'] = $installed
                ? $this->updaterWidget->getEventHandler('onRemovePlugin')
                : $this->updaterWidget->getEventHandler('onInstallPlugin');

            $products->add($plugin);
        }

        foreach (($project['themes'] ?? []) as $theme) {
            $installed = $themeManager->isInstalled($theme['code'] ?? null);
            $slug = $this->codeToSlug($theme['code'] ?? null);

            $theme['type'] = 'theme';
            $theme['slug'] = $slug;
            $theme['detailUrl'] = $this->actionUrl('theme') . '/' . $slug;
            $theme['installed'] = $installed;
            $theme['version'] = $theme['composer_version'] ?? '*';
            $theme['handler'] = $installed
                ? $this->updaterWidget->getEventHandler('onRemoveTheme')
                : $this->updaterWidget->getEventHandler('onInstallThemeCheck');

            $products->add($theme);
        }

        $products->sortBy('updated_at');

        return $project + [
            'products' => $products
        ];
    }

    /**
     * onSearchProducts
     */
    public function onSearchProducts()
    {
        $searchType = get('search', 'plugin');
        $serverUri = $searchType == 'plugin' ? 'plugin/search' : 'theme/search';

        $manager = UpdateManager::instance();
        return $manager->requestServerData($serverUri, ['query' => get('query')]);
    }

    /**
     * onSelectProduct
     */
    public function onSelectProduct()
    {
        $slug = $this->codeToSlug(post('code'));
        $type = post('type') === 'theme' ? 'theme' : 'plugin';
        return Backend::redirect('system/market/'.$type.'/'.$slug);
    }

    /**
     * onBrowsePackages
     */
    public function onBrowsePackages()
    {
        $type = post('type', 'plugin');
        $page = get($type.'_page');

        $packages = UpdateManager::instance()->requestBrowseProducts($type, $page);

        // Inject slug attribute for URLs
        foreach (array_get($packages, 'data', []) as $key => $package) {
            $packages['data'][$key]['slug'] = $this->codeToSlug($package['code']);
        }

        return ['result' => $packages];
    }

    /**
     * onResetProductData removes orphaned product data from the database
     * It only supports plugins at the moment.
     */
    public function onResetProductData()
    {
        if ($code = post('code')) {
            UpdateManager::instance()->rollbackPlugin($code);
            Flash::success(__("Data has been removed."));
        }

        return Backend::redirect('system/updates');
    }

    /**
     * slugToCode converts a slug to a product code
     * rainlab-blog -> rainlab.blog
     */
    protected function slugToCode(string $code): string
    {
        $parts = explode('-', $code, 2);

        if (!isset($parts[1])) {
            return strtolower($code);
        }
        else {
            return strtolower($parts[0].'.'.$parts[1]);
        }
    }

    /**
     * codeToSlug converts a product code to a slug
     * RainLab.Blog -> rainlab-blog
     */
    protected function codeToSlug(string $code): string
    {
        return strtolower(str_replace('.', '-', $code));
    }
}
