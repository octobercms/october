<?php namespace Backend\FormWidgets;

use Backend\Models\EditorPreferences;
use Backend\Classes\FormWidgetBase;

/**
 * Code Editor
 * Renders a code editor field.
 *
 * @package october\backend
 * @author Alexey Bobkov, Samuel Georges
 */
class CodeEditor extends FormWidgetBase
{
    //
    // Configurable properties
    //

    /**
     * @var string Code language to display (php, twig)
     */
    public $language = 'php';

    /**
     * @var boolean Determines whether the gutter is visible.
     */
    public $showGutter = true;

    /**
     * @var boolean Indicates whether the the word wrapping is enabled.
     */
    public $wordWrap = true;

    /**
     * @var string Cold folding mode: manual, markbegin, markbeginend.
     */
    public $codeFolding = 'manual';

    /**
     * @var boolean Automatically close tags and special characters,
     * like quotation marks, parenthesis, or brackets.
     */
    public $autoClosing = true;

    /**
     * @var boolean Indicates whether the the editor uses spaces for indentation.
     */
    public $useSoftTabs = true;

    /**
     * @var boolean Sets the size of the indentation.
     */
    public $tabSize = 4;

    /**
     * @var integer Sets the font size.
     */
    public $fontSize = 12;

    /**
     * @var integer Sets the editor margin size.
     */
    public $margin = 0;

    /**
     * @var $theme Ace Editor theme to use.
     */
    public $theme = 'twilight';

    /**
     * @var boolean If true, the editor is set to read-only mode
     */
    public $readOnly = false;

    //
    // Object properties
    //

    /**
     * {@inheritDoc}
     */
    protected $defaultAlias = 'codeeditor';

    /**
     * {@inheritDoc}
     */
    public function init()
    {
        $this->applyEditorPreferences();

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
            'readOnly'
        ]);
    }

    /**
     * {@inheritDoc}
     */
    public function render()
    {
        $this->prepareVars();
        return $this->makePartial('codeeditor');
    }

    /**
     * Prepares the widget data
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
        $this->vars['name'] = $this->formField->getName();
        $this->vars['readOnly'] = $this->readOnly;

        // Double encode when escaping
        $this->vars['value'] = htmlentities($this->getLoadValue(), ENT_QUOTES, 'UTF-8', true);
    }

    /**
     * {@inheritDoc}
     */
    protected function loadAssets()
    {
        $this->addCss('css/codeeditor.css', 'core');
        $this->addJs('js/build-min.js', 'core');
    }

    /**
     * Looks at the user preferences and overrides any set values.
     * @return void
     */
    protected function applyEditorPreferences()
    {
        // Load the editor system settings
        $editorSettings = EditorPreferences::instance();

        $this->fontSize = $editorSettings->font_size;
        $this->wordWrap = $editorSettings->word_wrap;
        $this->codeFolding = $editorSettings->code_folding;
        $this->autoClosing = $editorSettings->auto_closing;
        $this->tabSize = $editorSettings->tab_size;
        $this->theme = $editorSettings->theme;
        $this->showInvisibles = $editorSettings->show_invisibles;
        $this->highlightActiveLine = $editorSettings->highlight_active_line;
        $this->useSoftTabs = !$editorSettings->use_hard_tabs;
        $this->showGutter = $editorSettings->show_gutter;
    }

}
