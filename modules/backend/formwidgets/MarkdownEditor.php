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
class MarkdownEditor extends FormWidgetBase
{
    //
    // Configurable properties
    //

    //
    // Object properties
    //

    /**
     * {@inheritDoc}
     */
    protected $defaultAlias = 'markdown';

    /**
     * {@inheritDoc}
     */
    public function init()
    {
        $this->fillFromConfig([]);
    }

    /**
     * {@inheritDoc}
     */
    public function render()
    {
        $this->prepareVars();
        return $this->makePartial('markdowneditor');
    }

    /**
     * Prepares the widget data
     */
    public function prepareVars()
    {
        $this->vars['stretch'] = $this->formField->stretch;
        $this->vars['size'] = $this->formField->size;
        $this->vars['name'] = $this->formField->getName();
        $this->vars['value'] = $this->getLoadValue();
    }

    /**
     * {@inheritDoc}
     */
    public function loadAssets()
    {
        $this->addCss('css/markdowneditor.css', 'core');
        $this->addJs('js/markdowneditor.js', 'core');
        $this->addJs('/modules/backend/formwidgets/codeeditor/assets/js/build-min.js', 'core');
    }

}
