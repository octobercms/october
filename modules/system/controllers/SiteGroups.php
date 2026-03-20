<?php namespace System\Controllers;

use Site;
use BackendMenu;
use Backend\Classes\Controller;
use System\Classes\SettingsManager;
use System\Models\SiteGroup;
use NotFoundException;

/**
 * SiteGroups controller
 *
 * @package october\system
 * @author Alexey Bobkov, Samuel Georges
 */
class SiteGroups extends Controller
{
    /**
     * @var array Extensions implemented by this controller.
     */
    public $implement = [
        \Backend\Behaviors\ListController::class,
        \Backend\Behaviors\FormController::class,
    ];

    /**
     * @var array `FormController` configuration.
     */
    public $formConfig = 'config_form.yaml';

    /**
     * @var array `ListController` configuration.
     */
    public $listConfig = 'config_list.yaml';

    /**
     * @var array requiredPermissions to view this page.
     */
    public $requiredPermissions = ['settings.manage_sites'];

    /**
     * __construct
     */
    public function __construct()
    {
        parent::__construct();

        BackendMenu::setContext('October.System', 'system', 'settings');
        SettingsManager::setContext('October.System', 'sites');
    }

    /**
     * beforeDisplay
     */
    public function beforeDisplay()
    {
        if (!Site::hasFeature()) {
            throw new NotFoundException;
        }
    }
}
