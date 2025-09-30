<?php namespace Backend\FormWidgets;

use Backend\Models\Preference as BackendPreference;
use Backend\Classes\FormWidgetBase;

/**
 * CodeEditor renders a field for editing code
 *
 * @package october\backend
 * @author Alexey Bobkov, Samuel Georges
 */
class CodeEditor extends FormWidgetBase
{
    //
    // Configurable Properties
    //

    /**
     * @var string language code to display (php, twig)
     */
    public $language = 'php';

    /**
     * @var bool showGutter determines whether the gutter is visible.
     */
    public $showGutter = true;

    /**
     * @var bool wordWrap indicates whether the the word wrapping is enabled.
     */
    public $wordWrap = true;

    /**
     * @var string codeFolding mode: manual, markbegin, markbeginend.
     */
    public $codeFolding = 'manual';

    /**
     * @var bool autoClosing automatically close tags and special characters,
     * like quotation marks, parenthesis, or brackets.
     */
    public $autoClosing = true;

    /**
     * @var bool useSoftTabs indicates whether the the editor uses spaces for indentation.
     */
    public $useSoftTabs = true;

    /**
     * @var bool tabSize sets the size of the indentation.
     */
    public $tabSize = 4;

    /**
     * @var int fontSize sets the font size.
     */
    public $fontSize = 12;

    /**
     * @var int margin sets the editor margin size.
     */
    public $margin = 0;

    /**
     * @var string theme to use.
     */
    public $theme = 'twilight';

    /**
     * @var bool showInvisibles characters.
     */
    public $showInvisibles = false;

    /**
     * @var bool highlightActiveLine highlights the active line.
     */
    public $highlightActiveLine = true;

    /**
     * @var bool readOnly, if true, the editor is set to read-only mode
     */
    public $readOnly = false;

    /**
     * @var string autocompletion mode: manual, basic, live.
     */
    public $autocompletion = 'manual';

    /**
     * @var bool enableSnippets ,if true, the editor activate use Snippets
     */
    public $enableSnippets = true;

    /**
     * @var bool displayIndentGuides, if true, the editor show Indent Guides
     */
    public $displayIndentGuides = true;

    /**
     * @var bool showPrintMargin, if true, the editor show Print Margin
     */
    public $showPrintMargin = false;

    //
    // Object Properties
    //

    /**
     * @inheritDoc
     */
    protected $defaultAlias = 'codeeditor';

    /**
     * @inheritDoc
     */
    public function init()
    {
        $this->applyEditorPreferences();

        if ($this->formField->disabled) {
            $this->readOnly = true;
        }

        $this->fillFromConfig([
            'language',
            'showGutter',
            'wordWrap',
            'codeFolding',
            'autoClosing',
            'useSoftTabs',
            'tabSize',
            'fontSize',
            'margin',
            'theme',
            'showInvisibles',
            'highlightActiveLine',
            'readOnly',
            'autocompletion',
            'enableSnippets',
            'displayIndentGuides',
            'showPrintMargin'
        ]);
    }

    /**
     * @inheritDoc
     */
    public function render()
    {
        $this->prepareVars();
        return $this->makePartial('codeeditor');
    }

    /**
     * prepareVars for display
     */
    public function prepareVars()
    {
        $this->vars['fontSize'] = $this->fontSize;
        $this->vars['wordWrap'] = $this->wordWrap;
        $this->vars['codeFolding'] = $this->codeFolding;
        $this->vars['autoClosing'] = $this->autoClosing;
        $this->vars['tabSize'] = $this->tabSize;
        $this->vars['theme'] = $this->theme;
        $this->vars['showInvisibles'] = $this->showInvisibles;
        $this->vars['highlightActiveLine'] = $this->highlightActiveLine;
        $this->vars['useSoftTabs'] = $this->useSoftTabs;
        $this->vars['showGutter'] = $this->showGutter;
        $this->vars['language'] = $this->language;
        $this->vars['margin'] = $this->margin;
        $this->vars['stretch'] = $this->formField->stretch;
        $this->vars['size'] = $this->formField->size;
        $this->vars['readOnly'] = $this->readOnly;
        $this->vars['autocompletion'] = $this->autocompletion;
        $this->vars['enableSnippets'] = $this->enableSnippets;
        $this->vars['displayIndentGuides'] = $this->displayIndentGuides;
        $this->vars['showPrintMargin'] = $this->showPrintMargin;

        $this->vars['value'] = $this->getLoadValue();
        $this->vars['name'] = $this->getFieldName();
    }

    /**
     * @inheritDoc
     */
    protected function loadAssets()
    {
        $this->addCss('css/codeeditor.css');
        $this->addJs('js/build-min.js');
    }

    /**
     * Looks at the user preferences and overrides any set values.
     * @return void
     */
    protected function applyEditorPreferences()
    {
        // Load the editor system settings
        $preferences = BackendPreference::instance();

        $this->fontSize = $preferences->editor_font_size;
        $this->wordWrap = $preferences->editor_word_wrap;
        $this->codeFolding = $preferences->editor_code_folding;
        $this->autoClosing = $preferences->editor_auto_closing;
        $this->tabSize = $preferences->editor_tab_size;
        $this->theme = $preferences->editor_theme;
        $this->showInvisibles = $preferences->editor_show_invisibles;
        $this->highlightActiveLine = $preferences->editor_highlight_active_line;
        $this->useSoftTabs = !$preferences->editor_use_hard_tabs;
        $this->showGutter = $preferences->editor_show_gutter;
        $this->autocompletion = $preferences->editor_autocompletion;
        $this->displayIndentGuides = $preferences->editor_display_indent_guides;
        $this->showPrintMargin = $preferences->editor_show_print_margin;
    }
}
