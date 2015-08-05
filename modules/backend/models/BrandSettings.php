<?php namespace Backend\Models;

use File;
use Lang;
use Model;
use Cache;
use Less_Parser;
use Exception;

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

        $primaryColorLight = self::get('primary_color_light', self::PRIMARY_LIGHT);
        $primaryColorDark = self::get('primary_color_dark', self::PRIMARY_DARK);
        $secondaryColorLight = self::get('secondary_color_light', self::SECONDARY_LIGHT);
        $secondaryColorDark = self::get('secondary_color_dark', self::SECONDARY_DARK);

        $vars = [
            'logo-image'            => "'".self::getLogo()."'",
            'primary-color-light'   => $primaryColorLight,
            'primary-color-dark'    => $primaryColorDark,
            'secondary-color-light' => $secondaryColorLight,
            'secondary-color-dark'  => $secondaryColorDark,
        ];

        $parser->ModifyVars($vars);

        $parser->parse(
            File::get(base_path().'/modules/backend/models/brandsettings/custom.less') .
            self::get('custom_css')
        );

        $css = $parser->getCss();
        $css .= self::makeTabSvg($primaryColorLight, $primaryColorDark);

        return $css;
    }

    /**
     * The PHP LESS parser dies trying to dynamically generate 
     * the tab SVG CSS, so process it manually instead.
     * @param string $light
     * @param string $dark
     * @return string
     */
    protected static function makeTabSvg($light, $dark)
    {
        /*
         * Desaturate and darken the dark color
         */
        $dark = substr($dark, 1); // Remove the #
        $func = new \Less_Functions(null);
        $value = new \Less_Tree_Dimension('14.5', '%');
        $color = new \Less_Tree_Color($dark);
        $color = $func->desaturate($color, $value);
        $value = new \Less_Tree_Dimension('5', '%');
        $black = new \Less_Tree_Color('000000');
        $color = $func->mix($black, $color, $value);
        $dark = $color->toRGB();

        /*
         * SVG Definition
         */
        $svg = '';
        $svg .= '<svg xmlns="http://www.w3.org/2000/svg" version="1.1" x="0px" y="0px" width="100px" height="110px" viewBox="0 0 100 110" enable-background="new 0 0 100 110" xml:space="preserve">';
        $svg .= '<path d="M0,30C5,30,10,0,20,0c5,0,60,0,65,0c10,0,10,30,15,30"/>';
        $svg .= '<path fill="'.$light.'" d="M0,70c5,0,10-30,20-30c0,10,0,15,0,15v15"/>';
        $svg .= '<path fill="'.$light.'" d="M100,70c-5,0-10-30-20-30c0,10,0,15,0,15v15"/>';
        $svg .= '<path fill="'.$dark.'" d="M0,110c5,0,10-30,20-30c0,10,0,15,0,15v15"/>';
        $svg .= '<path fill="'.$dark.'" d="M100,110c-5,0-10-30-20-30c0,10,0,15,0,15v15"/>';
        $svg .= '</svg>';

        /*
         * Escape CSS
         */
        $revert = ['%21'=>'!', '%2A'=>'*', '%27'=>"'",'%3F'=>'?','%26'=>'&','%2C'=>',','%2F'=>'/','%40'=>'@','%2B'=>'+','%24'=>'$'];
        $svg = strtr(rawurlencode($svg), $revert);

        /*
         * Add header
         */
        $svg = 'data:image/svg+xml;charset=UTF-8,' . $svg;

        /*
         * Compile CSS
         */
        $css = '';
        $css .= '.fancy-layout .control-tabs.master-tabs > div > div.tabs-container > ul.nav-tabs > li a > span.title:before,';
        $css .= '.fancy-layout.control-tabs.master-tabs > div > div.tabs-container > ul.nav-tabs > li a > span.title:before,';
        $css .= '.fancy-layout .control-tabs.master-tabs > div > div.tabs-container > ul.nav-tabs > li a > span.title:after,';
        $css .= '.fancy-layout.control-tabs.master-tabs > div > div.tabs-container > ul.nav-tabs > li a > span.title:after {';
        $css .= "background-image: url('".$svg."')}";

        return $css;
    }
}
