<?php namespace Cms\ReportWidgets;

use BackendAuth;
use Cms\Classes\Theme;
use Cms\Models\MaintenanceSetting;
use Backend\Classes\ReportWidgetBase;
use ApplicationException;
use Exception;

/**
 * ActiveTheme report widget.
 *
 * @package october\backend
 * @author Alexey Bobkov, Samuel Georges
 */
class ActiveTheme extends ReportWidgetBase
{
    /**
     * @var string defaultAlias to identify this widget.
     */
    protected $defaultAlias = 'activetheme';

    /**
     * render the widget.
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

    /**
     * defineProperties
     */
    public function defineProperties()
    {
        return [
            'title' => [
                'title' => "Widget title",
                'default' => "Website",
                'type' => 'string',
                'validationPattern' => '^.+$',
                'validationMessage' => "The Widget Title is required.",
            ]
        ];
    }

    /**
     * @inheritDoc
     */
    protected function loadAssets()
    {
        $this->addCss('css/activetheme.css');
    }

    /**
     * loadData
     */
    protected function loadData()
    {
        if (!$theme = Theme::getActiveTheme()) {
            throw new ApplicationException(__("The theme ':name' is not found.", ['name'=>Theme::getActiveThemeCode()]));
        }

        $this->vars['theme'] = $theme;
        $this->vars['inMaintenance'] = MaintenanceSetting::get('is_enabled');
        $this->vars['canManage'] = BackendAuth::userHasAccess('cms.themes');
        $this->vars['canConfig'] = BackendAuth::userHasAccess('cms.theme_customize');
    }
}
