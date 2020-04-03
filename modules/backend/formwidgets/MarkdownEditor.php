<?php namespace Backend\FormWidgets;

use Backend\Widgets\MediaManager;
use BackendAuth;
use Markdown;
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

    /**
     * @var string Display mode: split, tab.
     */
    public $mode = 'tab';

    /**
     * @var bool Render preview with safe markdown.
     */
    public $safe = false;

    /**
     * @var bool If true, the editor is set to read-only mode
     */
    public $readOnly = false;

    /**
     * @var bool If true, the editor is set to read-only mode
     */
    public $disabled = false;

    //
    // Object properties
    //

    /**
     * @inheritDoc
     */
    protected $defaultAlias = 'markdown';

    /**
     * @var MediaManager Media manager widget
     */
    protected $mediaManagerWidget;

    /**
     * @inheritDoc
     */
    public function init()
    {
        $this->fillFromConfig([
            'mode',
            'safe',
            'readOnly',
            'disabled',
        ]);

        $this->mediaManagerWidget = $this->makeMediaManagerWidget();
        $this->mediaManagerWidget->bindToController();
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
     * Prepares the widget data
     */
    public function prepareVars()
    {
        $this->vars['mode'] = $this->mode;
        $this->vars['stretch'] = $this->formField->stretch;
        $this->vars['size'] = $this->formField->size;
        $this->vars['name'] = $this->getFieldName();
        $this->vars['value'] = $this->getLoadValue();
        $this->vars['readOnly'] = $this->readOnly;
        $this->vars['disabled'] = $this->disabled;
        $this->vars['useMediaManager'] = BackendAuth::getUser()->hasAccess('media.manage_media');
        $this->vars['mediaManagerAlias'] = $this->mediaManagerWidget->alias;
    }

    /**
     * @inheritDoc
     */
    protected function loadAssets()
    {
        $this->addCss('css/markdowneditor.css', 'core');
        $this->addJs('js/markdowneditor.js', 'core');
        $this->addJs('/modules/backend/formwidgets/codeeditor/assets/js/build-min.js', 'core');
    }

    public function onRefresh()
    {
        $value = post($this->getFieldName());
        $previewHtml = $this->safe
            ? Markdown::parseSafe($value)
            : Markdown::parse($value);

        return [
            'preview' => $previewHtml
        ];
    }

    /**
     * Prepare a media manager widget
     *
     * @return MediaManager
     */
    protected function makeMediaManagerWidget()
    {
        $alias = $this->alias . 'MediaManager';
        $widget = new MediaManager($this->controller, $alias, $this->formField->readOnly);

        return $widget;
    }
}
