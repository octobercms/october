<?php namespace Backend\Models;

use Url;
use File;
use Html;
use Lang;
use Cache;
use Config;
use Backend;
use Less_Parser;
use System\Models\SettingModel;
use Exception;

/**
 * BrandSetting that affect all users
 *
 * @package october\backend
 * @author Alexey Bobkov, Samuel Georges
 */
class BrandSetting extends SettingModel
{
    use \October\Rain\Database\Traits\Validation;
    use \Backend\Models\BrandSetting\HasPalettes;

    /**
     * @var string settingsCode is a unique code for this object
     */
    public $settingsCode = 'backend_brand_settings';

    /**
     * @var mixed settingsFields definition file
     */
    public $settingsFields = 'fields.yaml';

    /**
     * @var array attachOne relations
     */
    public $attachOne = [
        'favicon' => \System\Models\File::class,
        'logo' => \System\Models\File::class,
        'login_background_wallpaper' => \System\Models\File::class,
        'login_custom_image' => \System\Models\File::class,
        'menu_logo' => \System\Models\File::class,
        'dashboard_icon' => \System\Models\File::class
    ];

    /**
     * @var string cacheKey to store rendered CSS in the cache under
     */
    public $cacheKey = 'backend::brand.custom_css';

    const COLOR_AUTO = 'auto';
    const COLOR_LIGHT = 'light';
    const COLOR_DARK = 'dark';

    const MENU_INLINE = 'inline';
    const MENU_TEXT = 'text';
    const MENU_TILE = 'tile';
    const MENU_COLLAPSE = 'collapse';
    const MENU_ICONS = 'icons';
    const MENU_LEFT = 'left';

    const DEFAULT_PALETTE_COLOR = 'default';
    const DEFAULT_LOGIN_COLOR = '#fef6eb';
    const DEFAULT_LOGIN_BG_TYPE = 'gradient';
    const DEFAULT_LOGIN_IMG_TYPE = 'autumn_images';
    const DEFAULT_WALLPAPER_SIZE = 'auto';

    /**
     * rules for validation
     */
    public $rules = [
        'app_name' => 'required',
        'app_tagline' => 'required',
        'login_prompt' => 'required'
    ];

    /**
     * initSettingsData initializes the seed data for this model. This only executes
     * when the model is first created or reset to default.
     */
    public function initSettingsData(): void
    {
        $this->app_name = self::getBaseConfig('app_name', Lang::get('system::lang.app.name'));
        $this->app_tagline = self::getBaseConfig('tagline', Lang::get('system::lang.app.tagline'));
        $this->login_prompt = self::getBaseConfig('login_prompt', Lang::get('backend::lang.account.login_prompt'));
        $this->color_mode = self::getBaseConfig('color_mode', self::COLOR_LIGHT);
        $this->menu_mode = self::getBaseConfig('menu_mode', self::MENU_INLINE);
        $this->login_background_type = self::getBaseConfig('login_background_type', self::DEFAULT_LOGIN_BG_TYPE);
        $this->login_background_color = self::getBaseConfig('login_background_color', self::DEFAULT_LOGIN_COLOR);
        $this->login_background_wallpaper_size = self::getBaseConfig('login_background_wallpaper_size', self::DEFAULT_WALLPAPER_SIZE);
        $this->login_image_type = self::getBaseConfig('login_image_type', self::DEFAULT_LOGIN_IMG_TYPE);

        $defaultPalette = self::getBaseConfig('color_palette', self::DEFAULT_PALETTE_COLOR);

        $this->color_palette = [
            'preset' => $defaultPalette,
        ] + $this->getPaletteColors($defaultPalette);

        // Attempt to load custom CSS
        $brandCssPath = File::symbolizePath(self::getBaseConfig('stylesheet_path'));
        if ($brandCssPath && File::exists($brandCssPath)) {
            $this->custom_css = File::get($brandCssPath);
        }
    }

    /**
     * beforeSave
     */
    public function beforeSave()
    {
        if ($this->isDirty('custom_css')) {
            $this->custom_css = Html::clean($this->custom_css);
        }
    }

    /**
     * clearCache
     */
    public function clearCache()
    {
        parent::clearCache();

        Cache::forget($this->cacheKey . '.stylesheet');
        Cache::forget($this->cacheKey . '.favicon');
        Cache::forget($this->cacheKey . '.menu_logo');
        Cache::forget($this->cacheKey . '.dashboard_icon');
    }

    /**
     * getColorMode
     */
    public static function getColorMode(): string
    {
        $settings = self::instance();

        if (isset($_COOKIE['admin_color_mode_user'])) {
            return $_COOKIE['admin_color_mode_user'];
        }

        if (
            $settings->color_mode === 'auto' &&
            isset($_COOKIE['admin_color_mode_setting'])
        ) {
            return (string) $_COOKIE['admin_color_mode_setting'];
        }

        return (string) $settings->color_mode;
    }

    /**
     * getFavicon
     */
    public static function getFavicon()
    {
        $cacheKey = self::instance()->cacheKey . '.favicon';

        return Cache::memo()->rememberForever($cacheKey, function() {
            $settings = self::instance();

            if ($settings->favicon) {
                return $settings->favicon->getPath();
            }

            return self::getBaseConfigPath('favicon_path', '');
        });
    }

    /**
     * getLogo
     */
    public static function getLogo()
    {
        $settings = self::instance();

        if ($settings->logo) {
            return $settings->logo->getPath();
        }

        return self::getDefaultLogo() ?: null;
    }

    /**
     * getNavLogo
     */
    public static function getNavLogo()
    {
        $cacheKey = self::instance()->cacheKey . '.menu_logo';

        return Cache::memo()->rememberForever($cacheKey, function() {
            $settings = self::instance();

            if ($settings->menu_logo) {
                return $settings->menu_logo->getPath();
            }

            return self::getBaseConfigPath('menu_logo_path', '');
        });
    }

    /**
     * getNavDashboardIcon
     */
    public static function getNavDashboardIcon()
    {
        $cacheKey = self::instance()->cacheKey . '.dashboard_icon';

        return Cache::memo()->rememberForever($cacheKey, function() {
            $settings = self::instance();

            if ($settings->dashboard_icon) {
                return $settings->dashboard_icon->getPath();
            }

            return self::getBaseConfigPath('dashboard_icon_path', '');
        });
    }

    /**
     * getLoginWallpaperImage
     */
    public static function getLoginWallpaperImage()
    {
        $bgType = self::get('login_background_type', self::DEFAULT_LOGIN_BG_TYPE);
        if ($bgType == self::DEFAULT_LOGIN_BG_TYPE) {
            return null;
        }

        $settings = self::instance();

        if ($settings->login_background_wallpaper) {
            return $settings->login_background_wallpaper->getPath();
        }

        return self::getBaseConfigPath('login_background_wallpaper');
    }

    /**
     * getLoginCustomImage
     */
    public static function getLoginCustomImage()
    {
        $imgType = self::get('login_image_type', self::DEFAULT_LOGIN_IMG_TYPE);
        if ($imgType == self::DEFAULT_LOGIN_IMG_TYPE) {
            return null;
        }

        $settings = self::instance();
        if ($settings->login_custom_image) {
            return $settings->login_custom_image->getPath();
        }

        return self::getBaseConfigPath('login_custom_image');
    }

    /**
     * renderCss for the backend area
     */
    public static function renderCss()
    {
        try {
            $cacheKey = self::instance()->cacheKey . '.stylesheet';

            $customCss = Cache::memo()->rememberForever($cacheKey, function() {
                return self::compileCss() ?: '';
            });
        }
        catch (Exception $ex) {
            $customCss = '/* ' . $ex->getMessage() . ' */';
        }

        return $customCss;
    }

    /**
     * compileCss for the backend area
     */
    public static function compileCss()
    {
        $instance = self::instance();
        $basePath = base_path('modules/backend/models/brandsetting');

        // Process settings
        $loginBgColor = $instance->login_background_color ?? self::DEFAULT_LOGIN_COLOR;
        $wallpaperSize = $instance->login_background_wallpaper_size ?? self::DEFAULT_WALLPAPER_SIZE;

        // Process palettes
        $preset = $instance->color_palette['preset'] ?? 'default';
        $usePalette = $preset !== 'default';
        $lightPalette = $instance->getPaletteStyleVarsFor($preset, 'light', $instance->color_palette['light'] ?? []);
        $darkPalette = $instance->getPaletteStyleVarsFor($preset, 'dark', $instance->color_palette['dark'] ?? []);

        // Prepare LESS content
        $lessContent = '';
        if ($usePalette) {
            $lessContent .= File::get($basePath . '/style_palette.less');
        }
        $lessContent .= File::get($basePath . '/style_custom.less');
        $lessContent .= self::get('custom_css');

        // Prepare LESS vars
        $lessVars = [
            'logo-image' => "'".self::getLogo()."'",
            'login-bg-color' => $loginBgColor,
            'login-wallpaper-size' => $wallpaperSize,
            'login-wallpaper' => "'".self::getLoginWallpaperImage()."'"
        ] + $lightPalette + $darkPalette;

        // Compile LESS
        $parser = new Less_Parser(['compress' => true]);
        $parser->ModifyVars($lessVars);
        $parser->parse($lessContent);
        return $parser->getCss();
    }

    /**
     * getLoginPageCustomization returns customization properties used by the login page
     */
    public static function getLoginPageCustomization()
    {
        return (object)[
            'loginImageType' => self::get('login_image_type', self::DEFAULT_LOGIN_IMG_TYPE),
            'loginCustomImage' => self::getLoginCustomImage(),
            'loginBackgroundType' => self::get('login_background_type', self::DEFAULT_LOGIN_BG_TYPE)
        ];
    }

    //
    // Base line configuration
    //

    /**
     * getBaseConfig will only look at base config if the enabled flag is true
     */
    public static function getBaseConfig(string $value, ?string $default = null): ?string
    {
        if (!self::isBaseConfigured()) {
            return $default;
        }

        return Config::get('backend.brand.'.$value, $default);
    }

    /**
     * getBaseConfigPath returns a configured path from base config
     */
    public static function getBaseConfigPath(string $value, ?string $default = null): ?string
    {
        $configValue = self::getBaseConfig($value);
        if (!$configValue) {
            return $default;
        }

        $configPath = File::symbolizePath($configValue);
        if ($configPath && File::exists($configPath)) {
            return Url::asset(File::localToPublic($configPath));
        }

        return $default;
    }

    /**
     * isBaseConfigured checks if base brand settings found in config
     */
    public static function isBaseConfigured(): bool
    {
        return (bool) Config::get('backend.brand.enabled', false);
    }

    /**
     * getDefaultLogo returns a default backend logo image
     */
    public static function getDefaultLogo()
    {
        return self::getBaseConfigPath('logo_path');
    }
}
