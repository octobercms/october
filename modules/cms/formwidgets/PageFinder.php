<?php namespace Cms\FormWidgets;

use Url;
use Cms\Models\PageLookupItem;
use Backend\Classes\FormWidgetBase;

/**
 * PageFinder renders a page finder field.
 *
 *    page:
 *        label: Featured Page
 *        type: pagefinder
 *
 * @package october\cms
 * @author Alexey Bobkov, Samuel Georges
 */
class PageFinder extends FormWidgetBase
{
    use \Backend\Traits\SearchableWidget;

    //
    // Configurable Properties
    //

    /**
     * @var bool singleMode only allows items to be selected that resovle to a single URL.
     */
    public $singleMode = false;

    /**
     * @var bool allowCustomUrl controls whether the free-form URL option appears.
     */
    public $allowCustomUrl = true;

    /**
     * @var array|null allowedTypes restricts the type dropdown to these types only.
     */
    public $allowedTypes = null;

    /**
     * @var array|null excludedTypes removes these types from the dropdown.
     */
    public $excludedTypes = null;

    //
    // Object Properties
    //

    /**
     * @inheritDoc
     */
    protected $defaultAlias = 'pagefinder';

    /**
     * @var \Backend\Classes\WidgetBase selectWidget reference to the widget used for selecting a page.
     */
    protected $selectWidget;

    /**
     * @var PageLookupItem lookupItem
     */
    protected $lookupItem;

    /**
     * @inheritDoc
     */
    public function init()
    {
        $this->fillFromConfig([
            'singleMode',
            'allowCustomUrl',
            'allowedTypes',
            'excludedTypes',
        ]);

        if ($this->formField->disabled || $this->formField->readOnly) {
            $this->previewMode = true;
        }
    }

    /**
     * @inheritDoc
     */
    protected function loadAssets()
    {
        $this->addCss('css/pagefinder.css');
        $this->addJs('js/pagefinder.js');
    }

    /**
     * @inheritDoc
     */
    public function render()
    {
        $this->prepareVars();
        return $this->makePartial('container');
    }

    /**
     * prepareVars for display
     */
    public function prepareVars()
    {
        $this->vars['value'] = $this->getKeyValue();
        $this->vars['field'] = $this->formField;
        $this->vars['nameValue'] = $this->getNameValue();
        $this->vars['descriptionValue'] = $this->getDescriptionValue();
        $this->vars['singleMode'] = $this->singleMode;
        $this->vars['allowCustomUrl'] = $this->allowCustomUrl;
        $this->vars['allowedTypes'] = $this->allowedTypes;
        $this->vars['excludedTypes'] = $this->excludedTypes;
    }

    /**
     * onRefresh AJAX handler
     */
    public function onRefresh()
    {
        $value = post($this->getFieldName());

        $this->setKeyValue($value);

        $this->prepareVars();

        return ['#'.$this->getId('container') => $this->makePartial('pagefinder')];
    }

    /**
     * onClearRecord AJAX handler
     */
    public function onClearRecord()
    {
        $this->setKeyValue('');

        $this->prepareVars();

        return ['#'.$this->getId('container') => $this->makePartial('pagefinder')];
    }

    /**
     * getNameValue
     */
    public function getNameValue()
    {
        $item = $this->getLookupItemValue();
        if (!$item) {
            return '';
        }

        $label = $item->getReferenceLabel() ?: $item->getTypeLabel();

        if ($item->cmsPage) {
            $cmsPageLabel = $item->getCmsPageOptions()[$item->cmsPage] ?? $item->cmsPage;
            $label .= ' - ' . $cmsPageLabel;
        }

        return $label;
    }

    /**
     * getDescriptionValue
     */
    public function getDescriptionValue()
    {
        $linkUrl = (string) $this->getKeyValue();
        if (!$linkUrl) {
            return '';
        }

        $item = $this->getLookupItemValue();
        if (!$item) {
            return '';
        }

        if (str_starts_with($linkUrl, 'october://')) {
            return $item->getPreviewUrl();
        }

        return $item->url ?? '';
    }

    /**
     * getLookupItemValue
     */
    protected function getLookupItemValue()
    {
        if ($this->lookupItem !== null) {
            return $this->lookupItem;
        }

        return $this->lookupItem = PageLookupItem::fromSchema((string) $this->getKeyValue());
    }

    /**
     * getKeyValue
     */
    public function getKeyValue()
    {
        return $this->formField->value ??= $this->getLoadValue();
    }

    /**
     * setKeyValue
     */
    public function setKeyValue($value)
    {
        $this->formField->value = $value;
    }
}
