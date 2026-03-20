<?php namespace Backend\VueComponents;

use Url;
use Backend\Classes\VueComponentBase;
use Backend\Models\Preference as BackendPreference;

/**
 * CodeEditor Vue component
 *
 * @package october\backend
 * @author Alexey Bobkov, Samuel Georges
 */
class CodeEditor extends VueComponentBase
{
    /**
     * @var string componentName is the Vue component tag name.
     */
    protected $componentName = 'backend-codeeditor';

    /**
     * loadAssets adds component specific asset files. Use $this->addJs() and $this->addCss()
     * to register new assets to include on the page.
     * The default component script and CSS file are loaded automatically.
     * @return void
     */
    protected function loadAssets()
    {
        // This Vue component uses Ace dependencies from the form widget
        //
        $this->addJs('../../../formwidgets/codeeditor/assets/js/build-min.js');
    }

    /**
     * prepareVars required by the component's partials
     */
    protected function prepareVars()
    {
        $preferences = BackendPreference::instance();

        $configuration = [
            'fontSize' => $preferences->editor_font_size,
            'wordWrap' => $preferences->editor_word_wrap,
            'codeFolding' => $preferences->editor_code_folding,
            'autoClosing' => $preferences->editor_auto_closing,
            'tabSize' => $preferences->editor_tab_size,
            'theme' => $preferences->editor_theme,
            'showInvisibles' => !!$preferences->editor_show_invisibles,
            'highlightActiveLine' => !!$preferences->editor_highlight_active_line,
            'useSoftTabs' => !$preferences->editor_use_hard_tabs,
            'showGutter' => !!$preferences->editor_show_gutter,
            'autocompletion' => $preferences->editor_autocompletion,
            'displayIndentGuides' => !!$preferences->editor_display_indent_guides,
            'showPrintMargin' => !!$preferences->editor_show_print_margin,
            'margin' => 0,
            'vendorPath' => Url::asset('/modules/backend/formwidgets/codeeditor/assets/vendor/ace')
        ];

        $this->vars['configuration'] = json_encode($configuration);
    }
}
