<?php namespace System\ReportWidgets;

use System\Models\Parameters;
use System\Classes\UpdateManager;
use Cms\Models\MaintenanceSettings;
use Backend\Classes\ReportWidgetBase;
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
        $this->vars['inMaintenance'] = MaintenanceSettings::get('is_enabled');
        $this->vars['showUpdates'] = $this->controller->user->hasAccess('system.manage_updates');
        $this->vars['updates'] = $manager->check();
    }
}
