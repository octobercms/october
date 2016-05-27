<?php namespace System\ReportWidgets;

use BackendAuth;
use System\Models\Parameters;
use System\Classes\UpdateManager;
use Backend\Classes\ReportWidgetBase;
use System\Models\EventLog;
use System\Models\RequestLog;
use Exception;

/**
 * System status report widget.
 *
 * @package october\system
 * @author Alexey Bobkov, Samuel Georges
 */
class Status extends ReportWidgetBase
{
    /**
     * Renders the widget.
     */
    public function render()
    {
        try {
            $this->loadData();
        }
        catch (Exception $ex) {
            $this->vars['error'] = $ex->getMessage();
        }

        return $this->makePartial('widget');
    }

    public function defineProperties()
    {
        return [
            'title' => [
                'title'             => 'backend::lang.dashboard.widget_title_label',
                'default'           => 'backend::lang.dashboard.status.widget_title_default',
                'type'              => 'string',
                'validationPattern' => '^.+$',
                'validationMessage' => 'backend::lang.dashboard.widget_title_error',
            ]
        ];
    }

    protected function loadData()
    {
        $manager = UpdateManager::instance();
        $this->vars['canUpdate'] = BackendAuth::getUser()->hasAccess('system.manage_updates');
        $this->vars['updates'] = $manager->check();
        $this->vars['warnings'] = false;
        $this->vars['coreBuild'] = Parameters::get('system::core.build');
        $this->vars['eventLog'] = EventLog::count();
        $this->vars['requestLog'] = RequestLog::count();
    }
}
