<?php namespace Backend\FormWidgets;

use Backend\Classes\FormWidgetBase;
use Backend\Classes\RichEditorManager;

/**
 * ToolbarBuilder renders a visual editor for a rich editor toolbar definition,
 * as a sortable row of button tiles with a palette of available buttons,
 * powered client-side by the oc.richEditor registry.
 *
 * @package october\backend
 * @author Alexey Bobkov, Samuel Georges
 */
class ToolbarBuilder extends FormWidgetBase
{
    /**
     * @inheritDoc
     */
    protected $defaultAlias = 'toolbarbuilder';

    /**
     * @inheritDoc
     */
    public function render()
    {
        $this->prepareVars();
        return $this->makePartial('toolbarbuilder');
    }

    /**
     * prepareVars for display
     */
    public function prepareVars()
    {
        $this->vars['field'] = $this->formField;
        $this->vars['name'] = $this->getFieldName();
        $this->vars['buttons'] = $this->normalizeButtons((string) $this->formField->getValueFromData($this->model));
        $this->vars['seededButtons'] = $this->getSeededButtons();
        $this->vars['inheritedButtons'] = $this->getInheritedButtons();
        $this->vars['injectable'] = ($this->model->code ?? null) === 'default';
    }

    /**
     * getSaveValue stores the buttons as a comma separated string
     */
    public function getSaveValue($value)
    {
        return $this->normalizeButtons((string) $value);
    }

    /**
     * getSeededButtons returns the registered button list for the definition,
     * used by the reset feature, a null return hides the feature
     */
    protected function getSeededButtons(): ?string
    {
        if (method_exists($this->model, 'getSeededButtons')) {
            return $this->model->getSeededButtons();
        }

        return null;
    }

    /**
     * getInheritedButtons returns the configured default toolbar displayed by
     * empty definitions, a null return means the client-side defaults apply
     */
    protected function getInheritedButtons(): ?string
    {
        if (($this->model->code ?? null) === 'default') {
            return null;
        }

        return RichEditorManager::instance()->getDefaultButtons();
    }

    /**
     * normalizeButtons cleans a button list to a comma separated string
     */
    protected function normalizeButtons(string $buttons): string
    {
        $items = array_filter(array_map('trim', explode(',', $buttons)), 'strlen');

        return implode(',', $items);
    }

    /**
     * @inheritDoc
     */
    protected function loadAssets()
    {
        $this->addCss('css/toolbarbuilder.css');
        $this->addJs('js/toolbarbuilder.js', ['type' => 'module']);
    }
}
