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
    /**
     * {@inheritDoc}
     */
    public $defaultAlias = 'codeeditor';

    /**
     * @var string Code language to display (php, twig)
     */
    public $language = 'php';

    /**
     * @var boolean Determines whether the gutter is visible
     */
    public $showGutter = true;

    /**
     * @var boolean Indicates whether the the word wrapping is enabled
     */
    public $wordWrap = true;

    /**
     * @var boolean Indicates whether the the editor uses spaces for indentation
     */
    public $useSoftTabs = true;

    /**
     * @var boolean Sets the size of the indentation
     */
    public $tabSize = 4;

    /**
     * @var integer Sets the font size
     */
    public $fontSize = 12;

    /**
     * @var integer Sets the editor margin size
     */
    public $margin = 10;

    /**
     * @var $theme Ace Editor theme to use
     */
    public $theme = 'twilight';

    /**
     * {@inheritDoc}
     */
    public function init()
    {
        // Load the editor system settings
        $editorSettings = EditorPreferences::instance();

        $this->fontSize = $this->getConfig('fontSize', $editorSettings->font_size);
        $this->wordWrap = $this->getConfig('wordWrap', $editorSettings->word_wrap);
        $this->codeFolding = $this->getConfig('codeFolding', $editorSettings->code_folding);
        $this->tabSize = $this->getConfig('tabSize', $editorSettings->tab_size);
        $this->theme = $this->getConfig('theme', $editorSettings->theme);
        $this->showInvisibles = $this->getConfig('showInvisibles', $editorSettings->show_invisibles);
        $this->highlightActiveLine = $this->getConfig('highlightActiveLine', $editorSettings->highlight_active_line);
        $this->useSoftTabs = $this->getConfig('useSoftTabs', !$editorSettings->use_hard_tabs);
        $this->showGutter = $this->getConfig('showGutter', $editorSettings->show_gutter);
        $this->language = $this->getConfig('language', 'php');
        $this->margin = $this->getConfig('margin', 0);
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
     * Prepares the list data
     */
    public function prepareVars()
    {
        $this->vars['fontSize'] = $this->fontSize;
        $this->vars['wordWrap'] = $this->wordWrap;
        $this->vars['codeFolding'] = $this->codeFolding;
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
        $this->vars['value'] = $this->model->{$this->columnName};
    }

    /**
     * {@inheritDoc}
     */
    public function loadAssets()
    {
        $this->addCss('css/codeeditor.css', 'core');
        $this->addJs('vendor/ace/ace.js', 'core');
        $this->addJs('js/codeeditor.js', 'core');
    }

}