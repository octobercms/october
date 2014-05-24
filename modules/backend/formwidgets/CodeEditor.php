<?php namespace Backend\FormWidgets;

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
    public $wrapWords = true;

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
        $this->language = $this->getConfig('language', 'php');
        $this->showGutter = $this->getConfig('showGutter', true);
        $this->theme = $this->getConfig('theme', 'twilight');
        $this->wrapWords = $this->getConfig('wrapWords', false);
        $this->fontSize = $this->getConfig('fontSize', false);
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
        $this->vars['stretch'] = $this->formField->stretch;
        $this->vars['size'] = $this->formField->size;
        $this->vars['language'] = $this->language;
        $this->vars['showGutter'] = $this->showGutter;
        $this->vars['wrapWords'] = $this->wrapWords;
        $this->vars['fontSize'] = $this->fontSize;
        $this->vars['theme'] = $this->theme;
        $this->vars['name'] = $this->formField->getName();
        $this->vars['value'] = $this->model->{$this->columnName};
        $this->vars['margin'] = $this->margin;
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