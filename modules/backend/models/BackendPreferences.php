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
    }

    public static function applyConfigValues()
    {
        $config = App::make('config');
        $settings = self::instance();
        $config->set('app.locale', $settings->locale);
    }

    /**
     * Returns available options for the "locale" attribute.
     * @return array
     */
    public function getLocaleOptions()
    {
        $locales = [
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
            'nl' => [Lang::get('system::lang.locale.nl'), 'flag-nl'],
            'pt-br' => [Lang::get('system::lang.locale.pt-br'), 'flag-br'],
            'ro' => [Lang::get('system::lang.locale.ro'), 'flag-ro'],
            'ru' => [Lang::get('system::lang.locale.ru'), 'flag-ru'],
            'se' => [Lang::get('system::lang.locale.se'), 'flag-se'],
            'tr' => [Lang::get('system::lang.locale.tr'), 'flag-tr'],
            'pl' => [Lang::get('system::lang.locale.pl'), 'flag-pl'],
            'sk' => [Lang::get('system::lang.locale.sk'), 'flag-sk'],
        ];

        // Sort locales alphabetically
        asort($locales);

        return $locales;
    }

    public function afterSave()
    {
        Session::put('locale', $this->locale);
    }
}
