<?php namespace Cms\Models;

use Model;
use Cms\Classes\Page;
use Cms\Classes\Theme;
use ApplicationException;

/**
 * Maintenance mode settings
 *
 * @package october\cms
 * @author Alexey Bobkov, Samuel Georges
 */
class MaintenanceSetting extends Model
{
    use \October\Rain\Database\Traits\Validation;

    public $implement = ['System.Behaviors.SettingsModel'];

    public $settingsCode = 'cms_maintenance_settings';

    public $settingsFields = 'fields.yaml';

    /**
     * Validation rules
     */
    public $rules = [];

    public function initSettingsData()
    {
        $this->is_enabled = false;
    }

    public function getCmsPageOptions()
    {
        if (!$theme = Theme::getEditTheme()) {
            throw new ApplicationException('Unable to find the active theme.');
        }

        return Page::listInTheme($theme)->lists('fileName', 'fileName');
    }

    /**
     * Ensure each theme has its own CMS page, store it inside a mapping array.
     * @return void
     */
    public function beforeValidate()
    {
        if (!$theme = Theme::getEditTheme()) {
            throw new ApplicationException('Unable to find the active theme.');
        }

        $themeMap = $this->getSettingsValue('theme_map', []);
        $themeMap[$theme->getDirName()] = $this->getSettingsValue('cms_page');
        $this->setSettingsValue('theme_map', $themeMap);
    }

    /**
     * Restore the CMS page found in the mapping array, or disable the
     * maintenance mode.
     * @return void
     */
    public function afterFetch()
    {
        if (
            ($theme = Theme::getEditTheme())
            && ($themeMap = array_get($this->attributes, 'theme_map'))
            && ($cmsPage = array_get($themeMap, $theme->getDirName()))
        ) {
            $this->cms_page = $cmsPage;
        }
        else {
            $this->is_enabled = false;
        }
    }
}
