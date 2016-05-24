<?php namespace System\Controllers;

use App;
use Str;
use Lang;
use File;
use Flash;
use Backend;
use Redirect;
use BackendMenu;
use Backend\Classes\Controller;
use ApplicationException;
use System\Classes\SettingsManager;
use System\Models\EventLog;
use Exception;

/**
 * Event Logs controller
 *
 * @package october\system
 * @author Alexey Bobkov, Samuel Georges
 */
class EventLogs extends Controller
{
    public $implement = [
        'Backend.Behaviors.FormController',
        'Backend.Behaviors.ListController'
    ];

    public $requiredPermissions = ['system.access_logs'];

    public $formConfig = 'config_form.yaml';

    public $listConfig = 'config_list.yaml';

    public function __construct()
    {
        parent::__construct();

        BackendMenu::setContext('October.System', 'system', 'settings');
        SettingsManager::setContext('October.System', 'event_logs');
    }

    public function index_onRefresh()
    {
        return $this->listRefresh();
    }

    public function index_onEmptyLog()
    {
        EventLog::truncate();
        Flash::success(Lang::get('system::lang.event_log.empty_success'));
        return $this->listRefresh();
    }

    public function index_onDelete()
    {
        if (($checkedIds = post('checked')) && is_array($checkedIds) && count($checkedIds)) {

            foreach ($checkedIds as $recordId) {
                if (!$record = EventLog::find($recordId)) continue;
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
        $this->addCss('/modules/system/assets/css/eventlogs/exception-beautifier.css', 'core');
        $this->addJs('/modules/system/assets/js/eventlogs/exception-beautifier.js', 'core');

        if (in_array(App::environment(), ['dev', 'local'])) {
            $this->addJs('/modules/system/assets/js/eventlogs/exception-beautifier.links.js', 'core');
        }

        return $this->asExtension('FormController')->preview($id);
    }
}
