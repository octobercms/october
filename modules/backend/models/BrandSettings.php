<?php namespace Backend\Models;

use File;
use Lang;
use Model;
use Cache;
use Less_Parser;
use Exception;

/**
 * Brand settings that affect all users
 *
 * @package october\backend
 * @author Alexey Bobkov, Samuel Georges
 */
class BrandSettings extends Model
{
    use \System\Traits\ViewMaker;
    use \October\Rain\Database\Traits\Validation;

    public $implement = ['System.Behaviors.SettingsModel'];

    public $settingsCode = 'backend_brand_settings';

    public $settingsFields = 'fields.yaml';

    public $attachOne = [
        'logo' => ['System\Models\File']
    ];

    const CACHE_KEY = 'backend::brand.custom_css';

    const PRIMARY_COLOR   = '#3498db'; // Peter River
    const SECONDARY_COLOR = '#34495e'; // Wet Asphalt
    const ACCENT_COLOR    = '#e67e22'; // Pumpkin

    const INLINE_MENU   = 'inline';
    const TILE_MENU     = 'tile';
    const COLLAPSE_MENU = 'collapse';

    /**
     * Validation rules
     */
    public $rules = [
        'app_name'     => 'required',
        'app_tagline'  => 'required',
    ];

    public function initSettingsData()
    {
        $this->app_name = Lang::get('system::lang.app.name');
        $this->app_tagline = Lang::get('system::lang.app.tagline');

        $this->primary_color = self::PRIMARY_COLOR;
        $this->secondary_color = self::SECONDARY_COLOR;
        $this->accent_color = self::ACCENT_COLOR;

        $this->menu_mode = self::INLINE_MENU;
    }

    public function afterSave()
    {
        Cache::forget(self::CACHE_KEY);
    }

    public static function getLogo()
    {
        $settings = self::instance();
        if (!$settings->logo) {
            return null;
        }

        return $settings->logo->getPath();
    }

    public static function renderCss()
    {
        if (Cache::has(self::CACHE_KEY)) {
            return Cache::get(self::CACHE_KEY);
        }

        try {
            $customCss = self::compileCss();
            Cache::forever(self::CACHE_KEY, $customCss);
        }
        catch (Exception $ex) {
            $customCss = '/* ' . $ex->getMessage() . ' */';
        }

        return $customCss;
    }

    public static function compileCss()
    {
        $parser = new Less_Parser(['compress' => true]);

        $primaryColor = self::get('primary_color', self::PRIMARY_COLOR);
        $secondaryColor = self::get('secondary_color', self::PRIMARY_COLOR);
        $accentColor = self::get('accent_color', self::ACCENT_COLOR);

        $vars = [
            'logo-image'      => "'".self::getLogo()."'",
            'brand-primary'   => $primaryColor,
            'brand-secondary' => $secondaryColor,
            'brand-accent'    => $accentColor,
        ];

        $parser->ModifyVars($vars);

        $parser->parse(
            File::get(base_path().'/modules/backend/models/brandsettings/custom.less') .
            self::get('custom_css')
        );

        $css = $parser->getCss();

        return $css;
    }
}
