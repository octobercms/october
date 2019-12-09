<?php namespace Backend\FormWidgets;

use BackendAuth;
use Backend\Classes\FormField;
use System\Classes\MediaLibrary;
use Backend\Classes\FormWidgetBase;

/**
 * Media Finder
 * Renders a record finder field.
 *
 *    image:
 *        label: Some image
 *        type: media
 *        prompt: Click the %s button to find a user
 *
 * @package october\backend
 * @author Alexey Bobkov, Samuel Georges
 */
class MediaFinder extends FormWidgetBase
{
    //
    // Configurable properties
    //

    /**
     * @var string Prompt to display if no record is selected.
     */
    public $prompt = 'backend::lang.mediafinder.default_prompt';

    /**
     * @var string Display mode for the selection. Values: file, image.
     */
    public $mode = 'file';

    /**
     * @var int Preview image width
     */
    public $imageWidth;

    /**
     * @var int Preview image height
     */
    public $imageHeight;

    //
    // Object properties
    //

    /**
     * @inheritDoc
     */
    protected $defaultAlias = 'media';

    /**
     * @inheritDoc
     */
    public function init()
    {
        $this->fillFromConfig([
            'mode',
            'prompt',
            'imageWidth',
            'imageHeight'
        ]);

        $user = BackendAuth::getUser();

        if ($this->formField->disabled || !$user || !$user->hasAccess('media.manage_media')) {
            $this->previewMode = true;
        }
    }

    /**
     * @inheritDoc
     */
    public function render()
    {
        $this->prepareVars();

        return $this->makePartial('mediafinder');
    }

    /**
     * Prepares the list data
     */
    public function prepareVars()
    {
        $value = $this->getLoadValue();
        $isImage = $this->mode === 'image';

        $this->vars['value'] = $value;
        $this->vars['imageUrl'] = $isImage && $value ? MediaLibrary::url($value) : '';
        $this->vars['imageExists'] = $isImage && $value ? MediaLibrary::instance()->exists($value) : '';
        $this->vars['field'] = $this->formField;
        $this->vars['prompt'] = str_replace('%s', '<i class="icon-folder"></i>', trans($this->prompt));
        $this->vars['mode'] = $this->mode;
        $this->vars['imageWidth'] = $this->imageWidth;
        $this->vars['imageHeight'] = $this->imageHeight;
    }

    /**
     * @inheritDoc
     */
    public function getSaveValue($value)
    {
        if ($this->formField->disabled || $this->formField->hidden) {
            return FormField::NO_SAVE_DATA;
        }

        return $value;
    }

    /**
     * @inheritDoc
     */
    protected function loadAssets()
    {
        $this->addJs('js/mediafinder.js', 'core');
        $this->addCss('css/mediafinder.css', 'core');
    }
}
