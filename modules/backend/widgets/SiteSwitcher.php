<?php namespace Backend\Widgets;

use Site;
use Request;
use BackendAuth;
use Cms\Classes\Theme;
use Backend\Classes\WidgetBase;
use System\Classes\PluginManager;

/**
 * SiteSwitcher widget.
 *
 * @package october\backend
 * @author Alexey Bobkov, Samuel Georges
 */
class SiteSwitcher extends WidgetBase
{
    /**
     * @var string defaultAlias to identify this widget.
     */
    protected $defaultAlias = 'siteSwitcher';

    /**
     * @var string|null switchHandler is set by setSwitchHandler.
     */
    protected $switchHandler;

    /**
     * bindToController
     */
    public function bindToController()
    {
        parent::bindToController();

        // Store preference when user actively switches site
        if ($id = get('_site_id')) {
            if (!Request::ajax()) {
                Theme::resetEditTheme();
            }

            Site::storeEditSitePreference($id);
        }
    }

    /**
     * @inheritDoc
     */
    public function render($extraVars = [])
    {
        $this->prepareVars($extraVars);
        return $this->makePartial('siteswitcher');
    }

    /**
     * @inheritDoc
     */
    public function renderSubmenu()
    {
        $this->prepareVars();
        return $this->makePartial('submenu');
    }

    /**
     * prepareVars for display
     */
    public function prepareVars($extraVars = [])
    {
        foreach ($extraVars as $key => $val) {
            $this->vars[$key] = $val;
        }

        $useMultisite = Site::hasMultiEditSite();

        $sites = Site::listEditEnabled();
        $sites = $this->filterSitesByPlugin($sites);

        $this->vars['switchHandler'] = $this->switchHandler;
        $this->vars['useMultisite'] = $useMultisite;
        $this->vars['canManageSite'] = BackendAuth::userHasAccess('settings.manage_sites');
        $this->vars['useAnySite'] = Site::hasAnySite();
        $this->vars['editSite'] = Site::getEditSite() ?: Site::getAnySite();
        $this->vars['sites'] = $sites;
    }

    /**
     * filterSitesByPlugin removes sites where the current controller's
     * plugin is disabled, returns the collection unchanged for module controllers.
     */
    protected function filterSitesByPlugin($sites)
    {
        $manager = PluginManager::instance();
        $pluginCode = $manager->getIdentifier(get_class($this->controller));

        if (!$pluginCode || !$manager->hasPlugin($pluginCode)) {
            return $sites;
        }

        return $sites->filter(function($site) use ($manager, $pluginCode) {
            return !$manager->isDisabledForSiteDefinition($pluginCode, $site);
        });
    }

    /**
     * setSwitchHandler enables the use of an AJAX handler when switching the site
     */
    public function setSwitchHandler(?string $name = null)
    {
        $this->switchHandler = $name;
    }

    /**
     * loadAssets adds widget specific asset files. Use $this->addJs() and $this->addCss()
     * to register new assets to include on the page.
     * @return void
     */
    protected function loadAssets()
    {
        $this->addCss('css/siteswitcher.css');
        $this->addJs('js/siteswitcher.js', ['type' => 'module']);
    }
}
