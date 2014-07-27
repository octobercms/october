<?php namespace Cms\Controllers;

use Lang;
use Config;
use BackendMenu;
use Input;
use Backend\Classes\Controller;
use System\Classes\SettingsManager;
use Cms\Classes\Theme as CmsTheme;

/**
 * Theme selector controller
 *
 * @package october\backend
 * @author Alexey Bobkov, Samuel Georges
 *
 */
class Themes extends Controller
{
    public $requiredPermissions = ['cms.manage_themes'];

    public $bodyClass = 'compact-container';

    /**
     * Constructor.
     */
    public function __construct()
    {
        parent::__construct();

        $this->addCss('/modules/cms/assets/css/october.theme-selector.css', 'core');

        $this->pageTitle = Lang::get('cms::lang.theme.settings_menu');
        BackendMenu::setContext('October.System', 'system', 'settings');
        SettingsManager::setContext('October.Cms', 'theme');
    }

    public function index()
    {

    }

    public function index_onSetActiveTheme()
    {
        CmsTheme::setActiveTheme(Input::get('theme'));

        return [
            '#theme-list' => $this->makePartial('theme_list')
        ];
    }
}