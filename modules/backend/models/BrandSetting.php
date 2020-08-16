<?php namespace Backend\Models;

use App;
use Backend;
use Url;
use File;
use Lang;
use Model;
use Cache;
use Config;
use Less_Parser;
use Exception;

/**
 * Brand settings that affect all users
 *
 * @package october\backend
 * @author Alexey Bobkov, Samuel Georges
 */
class BrandSetting extends Model
{
    use \System\Traits\ViewMaker;
    use \October\Rain\Database\Traits\Validation;

    /**
     * @var array Behaviors implemented by this model.
     */
    public $implement = [
        \System\Behaviors\SettingsModel::class
    ];

    /**
     * @var string Unique code
     */
    public $settingsCode = 'backend_brand_settings';

    /**
     * @var mixed Settings form field defitions
     */
    public $settingsFields = 'fields.yaml';

    public $attachOne = [
        'favicon' => \System\Models\File::class,
        'logo' => \System\Models\File::class
    ];

    /**
     * @var string The key to store rendered CSS in the cache under
     */
    public $cacheKey = 'backend::brand.custom_css';

    const PRIMARY_COLOR   = '#34495e'; // Wet Asphalt
    const SECONDARY_COLOR = '#e67e22'; // Pumpkin
    const ACCENT_COLOR    = '#3498db'; // Peter River

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

    /**
     * Initialize the seed data for this model. This only executes when the
     * model is first created or reset to default.
     * @return void
     */
    public function initSettingsData()
    {
        $config = App::make('config');

        $this->app_name = $config->get('brand.appName', Lang::get('system::lang.app.name'));
        $this->app_tagline = $config->get('brand.tagline', Lang::get('system::lang.app.tagline'));
        $this->primary_color = $config->get('brand.primaryColor', self::PRIMARY_COLOR);
        $this->secondary_color = $config->get('brand.secondaryColor', self::SECONDARY_COLOR);
        $this->accent_color = $config->get('brand.accentColor', self::ACCENT_COLOR);
        $this->menu_mode = $config->get('brand.menuMode', self::INLINE_MENU);

        // Attempt to load custom CSS
        $brandCssPath = File::symbolizePath(Config::get('brand.customLessPath'));
        if ($brandCssPath && File::exists($brandCssPath)) {
            $this->custom_css = File::get($brandCssPath);
        }
    }

    public function afterSave()
    {
        Cache::forget(self::instance()->cacheKey);
    }

    public static function getFavicon()
    {
        $settings = self::instance();

        if ($settings->favicon) {
            return $settings->favicon->getPath();
        }

        return self::getDefaultFavicon() ?: null;
    }

    public static function getLogo()
    {
        $settings = self::instance();

        if ($settings->logo) {
            return $settings->logo->getPath();
        }

        return self::getDefaultLogo() ?: null;
    }

    public static function renderCss()
    {
        $cacheKey = self::instance()->cacheKey;
        if (Cache::has($cacheKey)) {
            return Cache::get($cacheKey);
        }

        try {
            $customCss = self::compileCss();
            Cache::forever($cacheKey, $customCss);
        }
        catch (Exception $ex) {
            $customCss = '/* ' . $ex->getMessage() . ' */';
        }

        return $customCss;
    }

    public static function compileCss()
    {
        $parser = new Less_Parser(['compress' => true]);
        $basePath = base_path('modules/backend/models/brandsetting');

        $primaryColor = self::get('primary_color', self::PRIMARY_COLOR);
        $secondaryColor = self::get('secondary_color', self::PRIMARY_COLOR);
        $accentColor = self::get('accent_color', self::ACCENT_COLOR);

        $parser->ModifyVars([
            'logo-image'      => "'".self::getLogo()."'",
            'brand-primary'   => $primaryColor,
            'brand-secondary' => $secondaryColor,
            'brand-accent'    => $accentColor,
        ]);

        $parser->parse(
            File::get($basePath . '/custom.less') .
            self::get('custom_css')
        );

        return $parser->getCss();
    }

    //
    // Base line configuration
    //

    public static function isBaseConfigured()
    {
        return !!Config::get('brand');
    }

    public static function getDefaultFavicon()
    {
        $faviconPath = File::symbolizePath(Config::get('brand.faviconPath'));

        if ($faviconPath && File::exists($faviconPath)) {
            return Url::asset(File::localToPublic($faviconPath));
        }

        return Backend::skinAsset('assets/images/favicon.png');
    }

    public static function getDefaultLogo()
    {
        $logoPath = File::symbolizePath(Config::get('brand.logoPath'));

        if ($logoPath && File::exists($logoPath)) {
            return Url::asset(File::localToPublic($logoPath));
        }

        return null;
    }
}
