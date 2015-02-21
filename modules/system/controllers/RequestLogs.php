<?php namespace System\Controllers;

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
use System\Models\RequestLog;
use Exception;

/**
 * Request Logs controller
 *
 * @package october\system
 * @author Alexey Bobkov, Samuel Georges
 */
class RequestLogs extends Controller
{
    public $implement = [
        'Backend.Behaviors.FormController',
        'Backend.Behaviors.ListController'
    ];

    public $requiredPermissions = ['system.access_request_logs'];

    public $formConfig = 'config_form.yaml';

    public $listConfig = 'config_list.yaml';

    public function __construct()
    {
        parent::__construct();

        BackendMenu::setContext('October.System', 'system', 'settings');
        SettingsManager::setContext('October.System', 'request_logs');
    }

    public function onEmptyLog()
    {
        RequestLog::truncate();
        Flash::success(Lang::get('system::lang.request_log.empty_success'));
        return $this->listRefresh();
    }

    public function index_onDelete()
    {
        if (($checkedIds = post('checked')) && is_array($checkedIds) && count($checkedIds)) {

            foreach ($checkedIds as $recordId) {
                if (!$record = RequestLog::find($recordId)) continue;
                $record->delete();
            }

            Flash::success(Lang::get('backend::lang.list.delete_selected_success'));
        }
        else {
            Flash::error(Lang::get('backend::lang.list.delete_selected_empty'));
        }

        return $this->listRefresh();
    }
}
