<?php namespace Backend\Models;

use App;
use Lang;
use Model;
use Session;
use DirectoryIterator;

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
            'ru' => [Lang::get('system::lang.locale.ru'), 'flag-ru'],
            'nl' => [Lang::get('system::lang.locale.nl'), 'flag-nl'],
            'ja' => [Lang::get('system::lang.locale.ja'), 'flag-jp'],
            'se' => [Lang::get('system::lang.locale.se'), 'flag-se'],
            'tr' => [Lang::get('system::lang.locale.tr'), 'flag-tr'],
            'de' => [Lang::get('system::lang.locale.de'), 'flag-de'],
            'fr' => [Lang::get('system::lang.locale.fr'), 'flag-fr'],
            'it' => [Lang::get('system::lang.locale.it'), 'flag-it'],
            'ro' => [Lang::get('system::lang.locale.ro'), 'flag-ro'],
            'pt-br' => [Lang::get('system::lang.locale.pt-br'), 'flag-br'],
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
