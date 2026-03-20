<?php namespace Backend\FormWidgets;

use App;
use Config;
use BackendAuth;
use Backend\Classes\FormWidgetBase;
use Backend\Models\EditorSetting;

/**
 * RichEditor renders a rich content editor field.
 *
 * @package october\backend
 * @author Alexey Bobkov, Samuel Georges
 */
class RichEditor extends FormWidgetBase
{
    //
    // Configurable Properties
    //

    /**
     * @var bool Determines whether content has HEAD and HTML tags.
     */
    public $fullPage = false;

    /**
     * @var bool Determines whether content has HEAD and HTML tags.
     */
    public $toolbarButtons;

    /**
     * @var bool If true, the editor is set to read-only mode
     */
    public $readOnly = false;

    /**
     * @var bool The Legacy mode disables the Vue integration.
     */
    public $legacyMode = false;

    /**
     * @var bool showMargins includes resizable document margins.
     * Only works in Vue applications and form document layouts.
     */
    public $showMargins = false;

    /**
     * @var bool useLineBreaks uses line breaks instead of paragraph wrappers for each new line.
     */
    public $useLineBreaks = false;

    /**
     * @var string Defines a mount point for the editor toolbar.
     * Must include a module name that exports the Vue application and a state element name.
     * Format: stateElementName
     * Only works in Vue applications and form document layouts.
     */
    public $externalToolbarAppState = null;

    /**
     * @var array|null editorOptions configured in the Froala editor. For example:
     *
     * - imageDefaultWidth: Sets the default width of the image when it is inserted in the rich text editor. Setting it to `0` will not set any width.
     * - imageDefaultAlign: Sets the default image alignment when it is inserted in the rich text editor. Possible values are `left`, `center` and `right`.
     * - imageDefaultDisplay: Sets the default display for an image when is is inserted in the rich text. Possible options are: `inline` and `block`.
     */
    public $editorOptions = null;

    //
    // Object Properties
    //

    /**
     * @inheritDoc
     */
    protected $defaultAlias = 'richeditor';

    /**
     * @inheritDoc
     */
    public function init()
    {
        if ($this->formField->disabled) {
            $this->readOnly = true;
        }

        $this->fillFromConfig([
            'fullPage',
            'readOnly',
            'toolbarButtons',
            'legacyMode',
            'showMargins',
            'useLineBreaks',
            'editorOptions',
            'externalToolbarAppState',
            'externalToolbarEventBus'
        ]);

        if (!$this->legacyMode) {
            $this->controller->registerVueComponent(\Backend\VueComponents\RichEditorDocumentConnector::class);
        }
    }

    /**
     * @inheritDoc
     */
    public function render()
    {
        $this->prepareVars();
        return $this->makePartial('richeditor');
    }

    /**
     * prepareVars for display
     */
    public function prepareVars()
    {
        $this->vars['field'] = $this->formField;
        $this->vars['editorLang'] = $this->getValidEditorLang();
        $this->vars['editorOptions'] = $this->getValidEditorOptions();
        $this->vars['fullPage'] = $this->fullPage;
        $this->vars['useLineBreaks'] = $this->useLineBreaks;
        $this->vars['stretch'] = $this->formField->stretch;
        $this->vars['size'] = $this->formField->size;
        $this->vars['readOnly'] = $this->readOnly;
        $this->vars['showMargins'] = $this->showMargins;
        $this->vars['externalToolbarAppState'] = $this->externalToolbarAppState;
        $this->vars['name'] = $this->getFieldName();
        $this->vars['value'] = $this->getLoadValue();
        $this->vars['toolbarButtons'] = $this->evalToolbarButtons();
        $this->vars['useMediaManager'] = BackendAuth::userHasAccess('media.library');
        $this->vars['legacyMode'] = $this->legacyMode;

        $this->vars['globalToolbarButtons'] = EditorSetting::getConfigured('html_toolbar_buttons');
        $this->vars['allowEmptyTags'] = EditorSetting::getConfigured('html_allow_empty_tags');
        $this->vars['allowTags'] = EditorSetting::getConfigured('html_allow_tags');
        $this->vars['allowAttrs'] = EditorSetting::getConfigured('html_allow_attrs');
        $this->vars['noWrapTags'] = EditorSetting::getConfigured('html_no_wrap_tags');
        $this->vars['removeTags'] = EditorSetting::getConfigured('html_remove_tags');
        $this->vars['lineBreakerTags'] = EditorSetting::getConfigured('html_line_breaker_tags');

        $this->vars['imageStyles'] = EditorSetting::getConfiguredStyles('html_style_image');
        $this->vars['linkStyles'] = EditorSetting::getConfiguredStyles('html_style_link');
        $this->vars['paragraphFormats'] = EditorSetting::getConfiguredFormats('html_paragraph_formats');
        $this->vars['paragraphStyles'] = EditorSetting::getConfiguredStyles('html_style_paragraph');
        $this->vars['inlineStyles'] = EditorSetting::getConfiguredStyles('html_style_inline');
        $this->vars['tableStyles'] = EditorSetting::getConfiguredStyles('html_style_table');
        $this->vars['tableCellStyles'] = EditorSetting::getConfiguredStyles('html_style_table_cell');
    }

    /**
     * evalToolbarButtons to use based on config.
     * @return string
     */
    protected function evalToolbarButtons()
    {
        $buttons = $this->toolbarButtons;

        if (is_string($buttons)) {
            $buttons = array_map(function ($button) {
                return strlen($button) ? $button : '|';
            }, explode('|', $buttons));
        }

        return $buttons;
    }

    /**
     * @inheritDoc
     */
    protected function loadAssets()
    {
        $this->addCss('css/richeditor.css');
        $this->addJs('js/richeditor.js', ['type' => 'module']);
        $this->addJs('/modules/backend/formwidgets/codeeditor/assets/js/build-min.js');
    }

    /**
     * getValidEditorLang returns a proposed language code for Froala.
     */
    protected function getValidEditorLang(): ?string
    {
        $locale = App::getLocale();

        // English is baked in
        if ($locale !== 'en') {
            return str_replace('-', '_', strtolower($locale));
        }

        return null;
    }

    /**
     * getValidEditorOptions returns custom editor options passed directly to the JS control
     */
    protected function getValidEditorOptions(): array
    {
        $config = [];

        if (is_array($this->editorOptions)) {
            $config += $this->editorOptions;
        }

        if (
            Config::get('editor.html_defaults.enabled', false) &&
            is_array($fileConfig = Config::get('editor.html_defaults.editor_options'))
        ) {
            $config += $fileConfig;
        }

        return $config;
    }
}
