<?php namespace Cms\Controllers;

use Lang;
use Flash;
use BackendMenu;
use Backend\Classes\Controller;
use System\Classes\SettingsManager;
use Cms\Models\ThemeLog;

/**
 * Request Logs controller
 *
 * @package october\system
 * @author Alexey Bobkov, Samuel Georges
 */
class ThemeLogs extends Controller
{
    /**
     * @var array Extensions implemented by this controller.
     */
    public $implement = [
        \Backend\Behaviors\FormController::class,
        \Backend\Behaviors\ListController::class
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
     * @var array Permissions required to view this page.
     */
    public $requiredPermissions = ['system.access_logs'];

    /**
     * Constructor.
     */
    public function __construct()
    {
        parent::__construct();

        BackendMenu::setContext('October.System', 'system', 'settings');
        SettingsManager::setContext('October.Cms', 'theme_logs');
    }

    public function index_onRefresh()
    {
        return $this->listRefresh();
    }

    public function index_onEmptyLog()
    {
        ThemeLog::truncate();
        Flash::success(Lang::get('cms::lang.theme_log.empty_success'));
        return $this->listRefresh();
    }

    public function index_onDelete()
    {
        if (($checkedIds = post('checked')) && is_array($checkedIds) && count($checkedIds)) {

            foreach ($checkedIds as $recordId) {
                if (!$record = ThemeLog::find($recordId)) continue;
                $record->delete();
            }

            Flash::success(Lang::get('backend::lang.list.delete_selected_success'));
        }
        else {
            Flash::error(Lang::get('backend::lang.list.delete_selected_empty'));
        }

        return $this->listRefresh();
    }

    public function preview($id)
    {
        $this->addCss('/modules/cms/assets/css/themelogs/template-diff.css', 'core');
        $this->addJs('/modules/cms/assets/vendor/jsdiff/diff.js', 'core');
        $this->addJs('/modules/cms/assets/js/themelogs/template-diff.js', 'core');

        return $this->asExtension('FormController')->preview($id);
    }
}
