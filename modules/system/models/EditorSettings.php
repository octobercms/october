<?php namespace System\Models;

use App;
use Model;

class EditorSettings extends Model
{
    public $implement = ['System.Behaviors.SettingsModel'];
    public $settingsCode = 'system_editor_settings';
    public $settingsFields = 'fields.yaml';

    public function initSettingsData()
    {
        $config = App::make('config');
        $this->font_size = $config->get('editor.font.size', 12);
        $this->tab_size = $config->get('editor.tab.size', 4);
        $this->use_hard_tabs = $config->get('editor.tab.usehard', false);
        $this->use_wrap = $config->get('editor.wrap.enable', false);
    }

    public static function applyConfigValues()
    {
        $config = App::make('config');
        $settings = self::instance();
        $config->set('editor.font.size', $settings->font_size);
        $config->set('editor.tab.size', $settings->tab_size);
        $config->set('editor.tab.usehard', $settings->use_hard_tabs);
        $config->set('editor.wrap.enable', $settings->use_wrap);
    }
}