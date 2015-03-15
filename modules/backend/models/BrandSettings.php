<?php namespace Backend\Models;

use File;
use Lang;
use Model;
use Cache;
use Less_Parser;

/**
 * Backend settings that affect all users
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

    // Pumpkin
    const PRIMARY_LIGHT = '#e67e22';

    // Carrot
    const PRIMARY_DARK = '#d35400';

    // Wet Asphalt
    const SECONDARY_LIGHT = '#34495e';

    // Midnight Blue
    const SECONDARY_DARK = '#2b3e50';

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

        $this->primary_color_light = self::PRIMARY_LIGHT;
        $this->primary_color_dark = self::PRIMARY_DARK;
        $this->secondary_color_light = self::SECONDARY_LIGHT;
        $this->secondary_color_dark = self::SECONDARY_DARK;
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

        $customCss = self::compileCss();
        Cache::forever(self::CACHE_KEY, $customCss);
        return $customCss;
    }

    public static function compileCss()
    {
        $parser = new Less_Parser(['compress' => true]);

        $svgHead  = 'data:image/svg+xml;charset=UTF-8,';
        $svgOpen  = static::cssEscape('<svg xmlns="http://www.w3.org/2000/svg" version="1.1" x="0px" y="0px" width="100px" height="110px" viewBox="0 0 100 110" enable-background="new 0 0 100 110" xml:space="preserve">');
        $svgClose = static::cssEscape('</svg>');

        $vars = [
            'logo-image'            => "'".self::getLogo()."'",
            'primary-color-light'   => self::get('primary_color_light', self::PRIMARY_LIGHT),
            'primary-color-dark'    => self::get('primary_color_dark', self::PRIMARY_DARK),
            'secondary-color-light' => self::get('secondary_color_light', self::SECONDARY_LIGHT),
            'secondary-color-dark'  => self::get('secondary_color_dark', self::SECONDARY_DARK),
            'svg-head'              => "'".$svgHead."'",
            'svg-open'              => "'".$svgOpen."'",
            'svg-close'             => "'".$svgClose."'"
        ];

        $parser->ModifyVars($vars);

        $parser->parse(
            File::get(base_path().'/modules/backend/models/brandsettings/custom.less')
            . self::get('custom_css')
        );

        $css = $parser->getCss();

        return $css;
    }

    /**
     * Escape for RFC 3986, generally good for CSS
     * @param string $string
     */
    protected static function cssEscape($string)
    {
        $entities = array('%21', '%2A', '%27', '%28', '%29', '%3B', '%3A', '%40', '%26', '%3D', '%2B', '%24', '%2C', '%2F', '%3F', '%25', '%23', '%5B', '%5D');
        $replacements = array('!', '*', "'", "(", ")", ";", ":", "@", "&", "=", "+", "$", ",", "/", "?", "%", "#", "[", "]");
        return str_replace($entities, $replacements, rawurlencode($string));
    }
}
