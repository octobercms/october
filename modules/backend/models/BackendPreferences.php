<?php namespace Backend\Models;

use App;
use Lang;
use Model;
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
        $config = App::make('config');
        $this->locale = $config->get('app.locale', 'en');
        $this->timezone = $config->get('app.timezone', 'UTC');
    }

    public static function applyConfigValues()
    {
        $config = App::make('config');
        $settings = self::instance();
        $config->set('app.locale', $settings->locale);
        $config->set('app.timezone', $settings->timezone);
    }

    /**
     * Returns available options for the "locale" attribute.
     * @return array
     */
    public function getLocaleOptions()
    {
        $locales = [
            'en' => [Lang::get('system::lang.locale.en'), 'flag-gb'],
            'ru' => [Lang::get('system::lang.locale.ru'), 'flag-ru'],
            'nl' => [Lang::get('system::lang.locale.nl'), 'flag-nl'],
            'ja' => [Lang::get('system::lang.locale.ja'), 'flag-jp'],
            'se' => [Lang::get('system::lang.locale.se'), 'flag-se'],
            'tr' => [Lang::get('system::lang.locale.tr'), 'flag-tr'],
            'de' => [Lang::get('system::lang.locale.de'), 'flag-de'],
            'fr' => [Lang::get('system::lang.locale.fr'), 'flag-fr'],
            'it' => [Lang::get('system::lang.locale.it'), 'flag-it'],
            'ro' => [Lang::get('system::lang.locale.ro'), 'flag-ro'],
            'es-ar' => [Lang::get('system::lang.locale.es-ar'), 'flag-ar'],
            'pt-br' => [Lang::get('system::lang.locale.pt-br'), 'flag-br'],
            'fa' => [Lang::get('system::lang.locale.fa'), 'flag-ir'],
            'es' => [Lang::get('system::lang.locale.es'), 'flag-es'],
        ];

        // Sort locales alphabetically
        asort($locales);

        return $locales;
    }

    /**
     * Returns available timezones
     * @return array
     */
    public function getTimezoneOptions()
    {
        $timezones = timezone_identifiers_list();

        return $timezones;
    }

    public function afterSave()
    {
        Session::put('locale', $this->locale);
        Session::put('timezone', $this->timezone);
    }
}
