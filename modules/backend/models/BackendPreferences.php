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

    public function getLocaleOptions()
    {
        return [
            'en' => [Lang::get('system::lang.locale.en'), 'flag-gb'],
            'ru' => [Lang::get('system::lang.locale.ru'), 'flag-ru'],
            'nl' => [Lang::get('system::lang.locale.nl'), 'flag-nl'],
            'ja' => [Lang::get('system::lang.locale.ja'), 'flag-jp'],
            'sv' => [Lang::get('system::lang.locale.sv'), 'flag-sv'],
            'tr' => [Lang::get('system::lang.locale.tr'), 'flag-tr'],
            'br' => [Lang::get('system::lang.locale.br'), 'flag-br'],
            'de' => [Lang::get('system::lang.locale.de'), 'flag-de'],
        ];
    }

    public function afterSave()
    {
        Session::put('locale', $this->locale);
    }
}