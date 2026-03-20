<?php namespace Backend\FormWidgets;

use Backend\Classes\FormWidgetBase;
use BackendAuth;
use Markdown;

/**
 * MarkdownEditor renders a markdown editor field.
 *
 * @package october\backend
 * @author Alexey Bobkov, Samuel Georges
 */
class MarkdownEditor extends FormWidgetBase
{
    //
    // Legacy properties
    //

    /**
     * @var string Display mode: split, tab.
     */
    public $mode = 'tab';

    /**
     * @var bool Render preview with safe markdown.
     */
    public $safe = false;

    /**
     * @var bool The Legacy mode disables the Vue integration.
     */
    public $legacyMode = false;

    //
    // Configurable Properties
    //

    /**
     * @var bool sideBySide window by default.
     */
    public $sideBySide = false;

    /**
     * @var string Defines a mount point for the editor toolbar.
     * Must include a module name that exports the Vue application and a state element name.
     * Format: stateElementName
     * Only works in Vue applications and form document layouts.
     */
    public $externalToolbarAppState = null;

    //
    // Object Properties
    //

    /**
     * @inheritDoc
     */
    protected $defaultAlias = 'markdown';

    /**
     * @inheritDoc
     */
    public function init()
    {
        $this->fillFromConfig([
            'mode',
            'safe',
            'legacyMode',
            'sideBySide',
            'externalToolbarAppState'
        ]);

        if (!$this->legacyMode) {
            $this->controller->registerVueComponent(\Backend\VueComponents\DocumentMarkdownEditor::class);
        }
    }

    /**
     * @inheritDoc
     */
    public function render()
    {
        $this->prepareVars();
        return $this->makePartial('markdowneditor');
    }

    /**
     * prepareVars for display
     */
    public function prepareVars()
    {
        $this->vars['mode'] = $this->mode;
        $this->vars['legacyMode'] = $this->legacyMode;
        $this->vars['sideBySide'] = $this->sideBySide;
        $this->vars['stretch'] = $this->formField->stretch;
        $this->vars['size'] = $this->formField->size;
        $this->vars['name'] = $this->getFieldName();
        $this->vars['value'] = $this->getLoadValue();
        $this->vars['useMediaManager'] = BackendAuth::userHasAccess('media.library');
        $this->vars['externalToolbarAppState'] = $this->externalToolbarAppState;
    }

    /**
     * @inheritDoc
     */
    protected function loadAssets()
    {
        $this->addCss('css/markdowneditor.css');
        $this->addJs('js/markdowneditor.js', ['type' => 'module']);
        $this->addJs('/modules/backend/formwidgets/codeeditor/assets/js/build-min.js');
    }

    public function onRefresh()
    {
        $value = (string) post($this->getFieldName());
        $previewHtml = $this->safe
            ? Markdown::parseIndent($value)
            : Markdown::parse($value);

        return [
            'preview' => $previewHtml
        ];
    }
}
