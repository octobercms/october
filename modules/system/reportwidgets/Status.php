<?php namespace System\ReportWidgets;

use System\Models\Parameters;
use System\Classes\UpdateManager;
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
                'title'             => 'Widget title',
                'default'           => 'System status',
                'type'              => 'string',
                'validationPattern' => '^.+$',
                'validationMessage' => 'The Widget Title is required.'
            ]
        ];
    }

    protected function loadData()
    {
        $manager = UpdateManager::instance();
        $this->vars['updates'] = $manager->check();
    }
}