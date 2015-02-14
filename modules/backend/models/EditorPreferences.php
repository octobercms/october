<?php namespace Backend\Models;

use App;
use Model;
use DirectoryIterator;

/**
 * Code editor preferences for the backend user\
 *
 * @package october\backend
 * @author Alexey Bobkov, Samuel Georges
 */
class EditorPreferences extends Model
{
    public $implement = ['Backend.Behaviors.UserPreferencesModel'];
    public $settingsCode = 'backend::editor.preferences';
    public $settingsFields = 'fields.yaml';

    const DEFAULT_THEME = 'twilight';

    public function initSettingsData()
    {
        $config = App::make('config');
        $this->font_size = $config->get('editor.font_size', 12);
        $this->word_wrap = $config->get('editor.word_wrap', 'fluid');
        $this->code_folding = $config->get('editor.code_folding', 'manual');
        $this->tab_size = $config->get('editor.tab_size', 4);
        $this->theme = $config->get('editor.theme', static::DEFAULT_THEME);
        $this->show_invisibles = $config->get('editor.show_invisibles', true);
        $this->highlight_active_line = $config->get('editor.highlight_active_line', true);
        $this->use_hard_tabs = $config->get('editor.use_hard_tabs', false);
        $this->show_gutter = $config->get('editor.show_gutter', true);
        $this->auto_closing = $config->get('editor.auto_closing', true);
    }

    public static function applyConfigValues()
    {
        $config = App::make('config');
        $settings = self::instance();
        $config->set('editor.font_size', $settings->font_size);
        $config->set('editor.word_wrap', $settings->word_wrap);
        $config->set('editor.code_folding', $settings->code_folding);
        $config->set('editor.tab_size', $settings->tab_size);
        $config->set('editor.theme', $settings->theme);
        $config->set('editor.show_invisibles', $settings->show_invisibles);
        $config->set('editor.highlight_active_line', $settings->highlight_active_line);
        $config->set('editor.use_hard_tabs', $settings->use_hard_tabs);
        $config->set('editor.show_gutter', $settings->show_gutter);
        $config->set('editor.auto_closing', $settings->auto_closing);
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
        return [static::DEFAULT_THEME => ucwords(static::DEFAULT_THEME)] + $themes;
    }
}
