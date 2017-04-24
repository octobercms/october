<?php namespace Backend\ReportWidgets;

use BackendAuth;
use Backend\Models\AccessLog;
use Backend\Classes\ReportWidgetBase;
use Backend\Models\BrandSetting;
use Exception;

/**
 * User welcome report widget.
 *
 * @package october\backend
 * @author Alexey Bobkov, Samuel Georges
 */
class Welcome extends ReportWidgetBase
{
    /**
     * @var string A unique alias to identify this widget.
     */
    protected $defaultAlias = 'welcome';

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
                'default'           => 'backend::lang.dashboard.welcome.widget_title_default',
                'type'              => 'string',
                'validationPattern' => '^.+$',
                'validationMessage' => 'backend::lang.dashboard.widget_title_error',
            ]
        ];
    }

    /**
     * @inheritDoc
     */
    protected function loadAssets()
    {
        $this->addCss('css/welcome.css', 'core');
    }

    protected function loadData()
    {
        $this->vars['user'] = $user = BackendAuth::getUser();
        $this->vars['appName'] = BrandSetting::get('app_name');
        $this->vars['lastSeen'] = AccessLog::getRecent($user);
    }
}
