<?php namespace Cms\ReportWidgets;

use Lang;
use BackendAuth;
use Cms\Classes\Theme;
use Cms\Models\MaintenanceSetting;
use Backend\Classes\ReportWidgetBase;
use ApplicationException;
use Exception;

/**
 * Active theme report widget.
 *
 * @package october\backend
 * @author Alexey Bobkov, Samuel Georges
 */
class ActiveTheme extends ReportWidgetBase
{
    /**
     * @var string A unique alias to identify this widget.
     */
    protected $defaultAlias = 'activetheme';

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
                'default'           => 'cms::lang.dashboard.active_theme.widget_title_default',
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
        $this->addCss('css/activetheme.css', 'core');
    }

    protected function loadData()
    {
        if (!$theme = Theme::getActiveTheme()) {
            throw new ApplicationException(Lang::get('cms::lang.theme.not_found_name', ['name'=>Theme::getActiveThemeCode()]));
        }

        $this->vars['theme'] = $theme;
        $this->vars['inMaintenance'] = MaintenanceSetting::get('is_enabled');
        $this->vars['canManage'] = BackendAuth::getUser()->hasAccess('cms.manage_themes');
        $this->vars['canConfig'] = BackendAuth::getUser()->hasAccess('cms.manage_theme_options');
    }
}
