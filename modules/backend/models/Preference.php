<?php namespace Backend\Models;

use App;
use Lang;
use Model;
use Config;
use Session;
use BackendAuth;
use DirectoryIterator;
use DateTime;
use DateTimeZone;

/**
 * Backend preferences for the backend user
 *
 * @package october\backend
 * @author Alexey Bobkov, Samuel Georges
 */
class Preference extends Model
{
    use \October\Rain\Database\Traits\Validation;

    const DEFAULT_THEME = 'twilight';

    /**
     * @var array Behaviors implemented by this model.
     */
    public $implement = [
        \Backend\Behaviors\UserPreferencesModel::class
    ];

    /**
     * @var string Unique code
     */
    public $settingsCode = 'backend::backend.preferences';

    /**
     * @var mixed Settings form field defitions
     */
    public $settingsFields = 'fields.yaml';

    /**
     * @var array Validation rules
     */
    public $rules = [];

    /**
     * Initialize the seed data for this model. This only executes when the
     * model is first created or reset to default.
     * @return void
     */
    public function initSettingsData()
    {
        $config = App::make('config');
        $this->locale = $config->get('app.locale', 'en');
        $this->fallback_locale = $this->getFallbackLocale($this->locale);
        $this->timezone = $config->get('cms.backendTimezone', $config->get('app.timezone'));

        $this->editor_font_size = $config->get('editor.font_size', 12);
        $this->editor_word_wrap = $config->get('editor.word_wrap', 'fluid');
        $this->editor_code_folding = $config->get('editor.code_folding', 'manual');
        $this->editor_tab_size = $config->get('editor.tab_size', 4);
        $this->editor_theme = $config->get('editor.theme', static::DEFAULT_THEME);
        $this->editor_show_invisibles = $config->get('editor.show_invisibles', false);
        $this->editor_highlight_active_line = $config->get('editor.highlight_active_line', true);
        $this->editor_use_hard_tabs = $config->get('editor.use_hard_tabs', false);
        $this->editor_show_gutter = $config->get('editor.show_gutter', true);
        $this->editor_auto_closing = $config->get('editor.auto_closing', false);
        $this->editor_autocompletion = $config->get('editor.editor_autocompletion', 'manual');
        $this->editor_enable_snippets = $config->get('editor.enable_snippets', false);
        $this->editor_display_indent_guides = $config->get('editor.display_indent_guides', false);
        $this->editor_show_print_margin = $config->get('editor.show_print_margin', false);
    }

    /**
     * Set the application's locale based on the user preference.
     * @return void
     */
    public static function setAppLocale()
    {
        if (Session::has('locale')) {
            App::setLocale(Session::get('locale'));
        }
        elseif (
            ($user = BackendAuth::getUser()) &&
            ($locale = static::get('locale'))
        ) {
            Session::put('locale', $locale);
            App::setLocale($locale);
        }
    }

    /**
     * Same as setAppLocale except for the fallback definition.
     * @return void
     */
    public static function setAppFallbackLocale()
    {
        if (Session::has('fallback_locale')) {
            Lang::setFallback(Session::get('fallback_locale'));
        }
        elseif (
            ($user = BackendAuth::getUser()) &&
            ($locale = static::get('fallback_locale'))
        ) {
            Session::put('fallback_locale', $locale);
            Lang::setFallback($locale);
        }
    }

    //
    // Events
    //

    public function beforeValidate()
    {
        $this->fallback_locale = $this->getFallbackLocale($this->locale);
    }

    public function afterSave()
    {
        Session::put('locale', $this->locale);
        Session::put('fallback_locale', $this->fallback_locale);
    }

    //
    // Utils
    //

    /**
     * Called when this model is reset to default by the user.
     * @return void
     */
    public function resetDefault()
    {
        parent::resetDefault();
        Session::forget('locale');
        Session::forget('fallback_locale');
    }

    /**
     * Overrides the config with the user's preference.
     * @return void
     */
    public static function applyConfigValues()
    {
        $settings = self::instance();
        Config::set('app.locale', $settings->locale);
        Config::set('app.fallback_locale', $settings->fallback_locale);
    }

    //
    // Getters
    //

    /**
     * Attempt to extract the language from the locale,
     * otherwise use the configuration.
     * @return string
     */
    protected function getFallbackLocale($locale)
    {
        if ($position = strpos($locale, '-')) {
            $target = substr($locale, 0, $position);
            $available = $this->getLocaleOptions();
            if (isset($available[$target])) {
                return $target;
            }
        }

        return Config::get('app.fallback_locale');
    }

    /**
     * Returns available options for the "locale" attribute.
     * @return array
     */
    public function getLocaleOptions()
    {
        $localeOptions = [
            'ar' => [Lang::get('system::lang.locale.ar'), 'flag-icon flag-icon-sa'],
            'be' => [Lang::get('system::lang.locale.be'), 'flag-icon flag-icon-by'],
            'ca' => [Lang::get('system::lang.locale.ca'), 'flag-icon flag-icon-es-ct'],
            'cs' => [Lang::get('system::lang.locale.cs'), 'flag-icon flag-icon-cz'],
            'da' => [Lang::get('system::lang.locale.da'), 'flag-icon flag-icon-dk'],
            'en' => [Lang::get('system::lang.locale.en'), 'flag-icon flag-icon-us'],
            'en-au' => [Lang::get('system::lang.locale.en-au'), 'flag-icon flag-icon-au'],
            'en-ca' => [Lang::get('system::lang.locale.en-ca'), 'flag-icon flag-icon-ca'],
            'en-gb' => [Lang::get('system::lang.locale.en-gb'), 'flag-icon flag-icon-gb'],
            'et' => [Lang::get('system::lang.locale.et'), 'flag-icon flag-icon-ee'],
            'de' => [Lang::get('system::lang.locale.de'), 'flag-icon flag-icon-de'],
            'es' => [Lang::get('system::lang.locale.es'), 'flag-icon flag-icon-es'],
            'es-ar' => [Lang::get('system::lang.locale.es-ar'), 'flag-icon flag-icon-ar'],
            'fa' => [Lang::get('system::lang.locale.fa'), 'flag-icon flag-icon-ir'],
            'fr' => [Lang::get('system::lang.locale.fr'), 'flag-icon flag-icon-fr'],
            'fr-ca' => [Lang::get('system::lang.locale.fr-ca'), 'flag-icon flag-icon-ca'],
            'hu' => [Lang::get('system::lang.locale.hu'), 'flag-icon flag-icon-hu'],
            'id' => [Lang::get('system::lang.locale.id'), 'flag-icon flag-icon-id'],
            'it' => [Lang::get('system::lang.locale.it'), 'flag-icon flag-icon-it'],
            'ja' => [Lang::get('system::lang.locale.ja'), 'flag-icon flag-icon-jp'],
            'kr' => [Lang::get('system::lang.locale.kr'), 'flag-icon flag-icon-kr'],
            'lt' => [Lang::get('system::lang.locale.lt'), 'flag-icon flag-icon-lt'],
            'lv' => [Lang::get('system::lang.locale.lv'), 'flag-icon flag-icon-lv'],
            'nl' => [Lang::get('system::lang.locale.nl'), 'flag-icon flag-icon-nl'],
            'pt-br' => [Lang::get('system::lang.locale.pt-br'), 'flag-icon flag-icon-br'],
            'pt-pt' => [Lang::get('system::lang.locale.pt-pt'), 'flag-icon flag-icon-pt'],
            'ro' => [Lang::get('system::lang.locale.ro'), 'flag-icon flag-icon-ro'],
            'ru' => [Lang::get('system::lang.locale.ru'), 'flag-icon flag-icon-ru'],
            'fi' => [Lang::get('system::lang.locale.fi'), 'flag-icon flag-icon-fi'],
            'sv' => [Lang::get('system::lang.locale.sv'), 'flag-icon flag-icon-se'],
            'tr' => [Lang::get('system::lang.locale.tr'), 'flag-icon flag-icon-tr'],
            'uk' => [Lang::get('system::lang.locale.uk'), 'flag-icon flag-icon-ua'],
            'pl' => [Lang::get('system::lang.locale.pl'), 'flag-icon flag-icon-pl'],
            'sk' => [Lang::get('system::lang.locale.sk'), 'flag-icon flag-icon-sk'],
            'zh-cn' => [Lang::get('system::lang.locale.zh-cn'), 'flag-icon flag-icon-cn'],
            'zh-tw' => [Lang::get('system::lang.locale.zh-tw'), 'flag-icon flag-icon-tw'],
            'nb-no' => [Lang::get('system::lang.locale.nb-no'), 'flag-icon flag-icon-no'],
            'el' => [Lang::get('system::lang.locale.el'), 'flag-icon flag-icon-gr'],
            'vn' => [Lang::get('system::lang.locale.vn'), 'flag-icon flag-icon-vn'],
        ];

        $locales = Config::get('app.localeOptions', $localeOptions);

        // Sort locales alphabetically
        asort($locales);

        return $locales;
    }

    /**
     * Returns all available timezone options.
     * @return array
     */
    public function getTimezoneOptions()
    {
        $timezoneIdentifiers = DateTimeZone::listIdentifiers();
        $utcTime = new DateTime('now', new DateTimeZone('UTC'));

        $tempTimezones = [];
        foreach ($timezoneIdentifiers as $timezoneIdentifier) {
            $currentTimezone = new DateTimeZone($timezoneIdentifier);

            $tempTimezones[] = [
                'offset' => (int) $currentTimezone->getOffset($utcTime),
                'identifier' => $timezoneIdentifier
            ];
        }

        // Sort the array by offset, identifier ascending
        usort($tempTimezones, function ($a, $b) {
            return $a['offset'] === $b['offset']
                ? strcmp($a['identifier'], $b['identifier'])
                : $a['offset'] - $b['offset'];
        });

        $timezoneList = [];
        foreach ($tempTimezones as $tz) {
            $sign = $tz['offset'] > 0 ? '+' : '-';
            $offset = gmdate('H:i', abs($tz['offset']));
            $timezoneList[$tz['identifier']] = '(UTC ' . $sign . $offset . ') ' . $tz['identifier'];
        }

        return $timezoneList;
    }

    /**
     * Returns the theme options for the backend editor.
     * @return array
     */
    public function getEditorThemeOptions()
    {
        $themeDir = new DirectoryIterator("modules/backend/formwidgets/codeeditor/assets/vendor/ace/");
        $themes = [];

        // Iterate through the themes
        foreach ($themeDir as $node) {

            // If this file is a theme (starting by "theme-")
            if (!$node->isDir() && substr($node->getFileName(), 0, 6) == 'theme-') {
                // Remove the theme- prefix and the .js suffix, create an user friendly and capitalized name
                $themeId = substr($node->getFileName(), 6, -3);
                $themeName = ucwords(str_replace("_", " ", $themeId));

                // Add the values to the themes array
                if ($themeId != static::DEFAULT_THEME) {
                    $themes[$themeId] = $themeName;
                }
            }

        }

        // Sort the theme alphabetically, and push the default theme
        asort($themes);
        return [static::DEFAULT_THEME => ucwords(static::DEFAULT_THEME)] + $themes;
    }
}
