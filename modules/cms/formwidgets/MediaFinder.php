<?php namespace Cms\FormWidgets;

use Lang;
use ApplicationException;
use Cms\Classes\MediaLibrary;
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
 * @package october\cms
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
    public $prompt = 'Click the %s button to find a media item';

    /**
     * @var string Display mode for the selection. Values: file, image.
     */
    public $mode = 'file';

    //
    // Object properties
    //

    /**
     * {@inheritDoc}
     */
    protected $defaultAlias = 'media';

    /**
     * {@inheritDoc}
     */
    public function init()
    {
        $this->fillFromConfig([
            'mode',
            'prompt'
        ]);
    }

    /**
     * {@inheritDoc}
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
        $this->vars['value'] = $value;
        $this->vars['imageUrl'] = $value ? MediaLibrary::url($value) : '';
        $this->vars['field'] = $this->formField;
        $this->vars['prompt'] = str_replace('%s', '<i class="icon-folder"></i>', $this->prompt);
        $this->vars['mode'] = $this->mode;
    }

    /**
     * {@inheritDoc}
     */
    public function loadAssets()
    {
        $this->addJs('js/mediafinder.js', 'core');
        $this->addCss('css/mediafinder.css', 'core');
    }
}