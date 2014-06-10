<?php namespace Backend\Models;

use App;
use Model;
use DirectoryIterator;

class EditorSettings extends Model
{
    public $implement = ['Backend.Behaviors.UserSettingsModel'];
    public $settingsCode = 'system::editor.settings';
    public $settingsFields = 'fields.yaml';

    const DEFAULT_THEME = 'twilight';

    public function initSettingsData()
    {
        $config = App::make('config');
        $this->font_size = $config->get('editor.font.size', 12);
        $this->tab_size = $config->get('editor.tab.size', 4);
        $this->use_hard_tabs = $config->get('editor.tab.usehard', false);
        $this->use_wrap = $config->get('editor.wrap.enable', false);
        $this->theme = $config->get('editor.theme', static::DEFAULT_THEME);
    }

    public static function applyConfigValues()
    {
        $config = App::make('config');
        $settings = self::instance();
        $config->set('editor.font.size', $settings->font_size);
        $config->set('editor.tab.size', $settings->tab_size);
        $config->set('editor.tab.usehard', $settings->use_hard_tabs);
        $config->set('editor.wrap.enable', $settings->use_wrap);
        $config->set('editor.theme', $settings->theme);
    }

    public function getThemeOptions()
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
        return [static::DEFAULT_THEME => 'Twilight'] + $themes;
    }
}