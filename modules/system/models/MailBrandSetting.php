<?php namespace System\Models;

use App;
use Str;
use Cache;
use Less_Parser;
use File as FileHelper;
use System\Models\SettingModel;
use Exception;

/**
 * MailBrandSetting
 *
 * @package october\system
 * @author Alexey Bobkov, Samuel Georges
 */
class MailBrandSetting extends SettingModel
{
    use \October\Rain\Database\Traits\Validation;

    /**
     * @var string settingsCode
     */
    public $settingsCode = 'system_mail_brand_settings';

    /**
     * @var mixed settingsFields definitions
     */
    public $settingsFields = 'fields.yaml';

    /**
     * @var string cacheKey to store rendered CSS in the cache under
     */
    public $cacheKey = 'system::mailbrand.custom_css';

    const WHITE_COLOR = '#fff';
    const BODY_BG = '#f5f8fa';
    const PRIMARY_BG = '#3498db';
    const POSITIVE_BG = '#31ac5f';
    const NEGATIVE_BG = '#ab2a1c';
    const HEADER_COLOR = '#bbbfc3';
    const HEADING_COLOR = '#2f3133';
    const TEXT_COLOR = '#74787e';
    const LINK_COLOR = '#0181b9';
    const FOOTER_COLOR = '#aeaeae';
    const BORDER_COLOR = '#edeff2';
    const SUB_BORDER_COLOR = '#e8e5ef';
    const PROMOTION_BORDER_COLOR = '#9ba2ab';

    /**
     * @var array rules for validation
     */
    public $rules = [
    ];

    /**
     * initSettingsData for this model. This only executes when the
     * model is first created or reset to default.
     * @return void
     */
    public function initSettingsData()
    {
        $config = App::make('config');

        $vars = static::getCssVars();

        foreach ($vars as $var => $default) {
            $this->{$var} = $config->get('brand.mail.'.Str::studly($var), $default);
        }
    }

    /**
     * clearCache
     */
    public function clearCache()
    {
        parent::clearCache();

        Cache::forget($this->cacheKey);
    }

    /**
     * @deprecated see clearCache
     */
    public function resetCache()
    {
        $this->clearCache();
    }

    /**
     * renderCss
     */
    public static function renderCss()
    {
        $cacheKey = self::instance()->cacheKey;

        if ($cache = Cache::memo()->get($cacheKey)) {
            return $cache;
        }

        try {
            $customCss = self::compileCss();
            Cache::forever($cacheKey, $customCss);
        }
        catch (Exception $ex) {
            $customCss = '/* ' . e($ex->getMessage()) . ' */';
        }

        return $customCss;
    }

    /**
     * getCssVars
     */
    protected static function getCssVars()
    {
        $vars = [
            'body_bg' => self::BODY_BG,
            'content_bg' => self::BODY_BG,
            'content_inner_bg' => self::WHITE_COLOR,
            'button_text_color' => self::WHITE_COLOR,
            'button_primary_bg' => self::PRIMARY_BG,
            'button_positive_bg' => self::POSITIVE_BG,
            'button_negative_bg' => self::NEGATIVE_BG,
            'header_color' => self::HEADER_COLOR,
            'heading_color' => self::HEADING_COLOR,
            'text_color' => self::TEXT_COLOR,
            'link_color' => self::LINK_COLOR,
            'footer_color' => self::FOOTER_COLOR,
            'body_border_color' => self::BORDER_COLOR,
            'subcopy_border_color' => self::SUB_BORDER_COLOR,
            'table_border_color' => self::SUB_BORDER_COLOR,
            'panel_bg' => self::BORDER_COLOR,
            'promotion_bg' => self::WHITE_COLOR,
            'promotion_border_color' => self::PROMOTION_BORDER_COLOR,
        ];

        return $vars;
    }

    protected static function makeCssVars()
    {
        $vars = static::getCssVars();

        $result = [];

        foreach ($vars as $var => $default) {
            // panel_bg -> panel-bg
            $cssVar = str_replace('_', '-', $var);

            $result[$cssVar] = self::get($var, $default);
        }

        return $result;
    }

    public static function compileCss()
    {
        $parser = new Less_Parser(['compress' => true]);
        $basePath = base_path('modules/system/models/mailbrandsetting');

        $parser->ModifyVars(static::makeCssVars());

        $parser->parse(FileHelper::get($basePath . '/custom.less'));

        return $parser->getCss();
    }
}
