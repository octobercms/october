<?php namespace Backend\Models;

use Lang;
use Model;
use Config;
use Session;
use DirectoryIterator;

/**
 * Backend preferences for the backend user
 *
 * @package october\backend
 * @author Alexey Bobkov, Samuel Georges
 */
class BackendPreferences extends Model
{
    public $implement = ['Backend.Behaviors.UserPreferencesModel'];
    public $settingsCode = 'backend::backend.preferences';
    public $settingsFields = 'fields.yaml';

    public function initSettingsData()
    {
        $this->locale = Config::get('app.locale', 'en');
    }

    public static function applyConfigValues()
    {
        $settings = self::instance();
        Config::set('app.locale', $settings->locale);
    }

    /**
     * Returns available options for the "locale" attribute.
     * @return array
     */
    public function getLocaleOptions()
    {
        $locales = Config::get('app.localeOptions', [
            'cs' => [Lang::get('system::lang.locale.cs'), 'flag-cz'],
            'en' => [Lang::get('system::lang.locale.en'), 'flag-gb'],
            'de' => [Lang::get('system::lang.locale.de'), 'flag-de'],
            'es' => [Lang::get('system::lang.locale.es'), 'flag-es'],
            'es-ar' => [Lang::get('system::lang.locale.es-ar'), 'flag-ar'],
            'fa' => [Lang::get('system::lang.locale.fa'), 'flag-ir'],
            'fr' => [Lang::get('system::lang.locale.fr'), 'flag-fr'],
            'hu' => [Lang::get('system::lang.locale.hu'), 'flag-hu'],
            'id' => [Lang::get('system::lang.locale.id'), 'flag-id'],
            'it' => [Lang::get('system::lang.locale.it'), 'flag-it'],
            'ja' => [Lang::get('system::lang.locale.ja'), 'flag-jp'],
            'lv' => [Lang::get('system::lang.locale.lv'), 'flag-lv'],
            'nl' => [Lang::get('system::lang.locale.nl'), 'flag-nl'],
            'pt-br' => [Lang::get('system::lang.locale.pt-br'), 'flag-br'],
            'ro' => [Lang::get('system::lang.locale.ro'), 'flag-ro'],
            'ru' => [Lang::get('system::lang.locale.ru'), 'flag-ru'],
            'sv' => [Lang::get('system::lang.locale.sv'), 'flag-se'],
            'tr' => [Lang::get('system::lang.locale.tr'), 'flag-tr'],
            'pl' => [Lang::get('system::lang.locale.pl'), 'flag-pl'],
            'sk' => [Lang::get('system::lang.locale.sk'), 'flag-sk'],
            'zh-cn' => [Lang::get('system::lang.locale.zh-cn'), 'flag-cn'],
            'zh-tw' => [Lang::get('system::lang.locale.zh-tw'), 'flag-tw'],
            'nb-no' => [Lang::get('system::lang.locale.nb-no'), 'flag-no'],
            'el' => [Lang::get('system::lang.locale.el'), 'flag-gr'],
        ]);

        // Sort locales alphabetically
        asort($locales);

        return $locales;
    }

    public function afterSave()
    {
        Session::put('locale', $this->locale);
    }
}
