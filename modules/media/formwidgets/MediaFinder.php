<?php namespace Media\FormWidgets;

use BackendAuth;
use Media\Classes\MediaLibrary;
use Backend\Classes\FormWidgetBase;
use October\Rain\Support\Collection;
use October\Rain\Database\Model;
use Exception;

/**
 * MediaFinder renders a record finder field.
 *
 *    image:
 *        label: Some image
 *        type: mediafinder
 *
 * @package october\media
 * @author Alexey Bobkov, Samuel Georges
 */
class MediaFinder extends FormWidgetBase
{
    //
    // Configurable Properties
    //

    /**
     * @var string Display mode for the selection. Values: file, image.
     */
    public $mode = 'file';

    /**
     * @var int imageWidth for preview
     */
    public $imageWidth = 190;

    /**
     * @var int imageHeight for preview
     */
    public $imageHeight = 190;

    /**
     * @var int|null maxItems allowed
     */
    public $maxItems = null;

    /**
     * @var array thumbOptions used for generating thumbnails
     */
    public $thumbOptions = [
        'mode' => 'cover',
        'extension' => 'auto'
    ];

    /**
     * @var string Defines a mount point for the editor toolbar.
     * Must include a module name that exports the Vue application and a state element name.
     * Format: module.name::stateElementName
     * Only works in Vue applications and form document layouts.
     */
    public $externalToolbarAppState = null;

    //
    // Object Properties
    //

    /**
     * @inheritDoc
     */
    protected $defaultAlias = 'mediafinder';

    /**
     * @inheritDoc
     */
    public function init()
    {
        $this->fillFromConfig([
            'mode',
            'imageWidth',
            'imageHeight',
            'maxItems',
            'thumbOptions',
            'externalToolbarAppState'
        ]);

        if ($this->formField->disabled || $this->formField->readOnly) {
            $this->previewMode = true;
        }

        if (!BackendAuth::userHasAccess('media.library')) {
            $this->previewMode = true;
        }

        $this->processMaxItems();
    }

    /**
     * @inheritDoc
     */
    protected function loadAssets()
    {
        $this->addJs('js/mediafinder.js');
        $this->addCss('css/mediafinder.css');
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
     * prepareVars for display
     */
    public function prepareVars()
    {
        $this->vars['size'] = $this->formField->size;
        $this->vars['fileList'] = $fileList = $this->getFileList();
        $this->vars['singleFile'] = $fileList->first();
        $this->vars['displayMode'] = $this->getDisplayMode();
        $this->vars['field'] = $this->formField;
        $this->vars['maxItems'] = $this->maxItems;
        $this->vars['imageWidth'] = $this->imageWidth;
        $this->vars['imageHeight'] = $this->imageHeight;
        $this->vars['externalToolbarAppState'] = $this->externalToolbarAppState;
    }

    /**
     * getFileList returns a list of associated files
     */
    protected function getFileList()
    {
        $value = $this->getLoadValue() ?: [];

        if (!is_array($value)) {
            $value = [$value];
        }

        // Lookup files
        $list = [];
        foreach ($value as $val) {
            if ($item = $this->findItemFromMediaLibrary($val)) {
                $list[] = $item;
            }
        }

        // Promote to Collection
        $list = new Collection($list);

        return $list;
    }

    /**
     * findItemFromMediaLibrary
     */
    protected function findItemFromMediaLibrary($val)
    {
        $mediaLib = MediaLibrary::instance();
        try {
            $item = $this->isFolderMode()
                ? $mediaLib->findFolder($val)
                : $mediaLib->findFile($val);

            if ($item) {
                return $this->decorateFileAttributes($item);
            }
        }
        catch (Exception $ex) {
        }
    }

    /**
     * decorateFileAttributes adds the bespoke attributes used
     * internally by this widget. Added attributes are:
     * - thumbUrl
     * @return \Media\Classes\MediaLibraryItem
     */
    protected function decorateFileAttributes($file)
    {
        $thumb = $file->publicUrl;

        if ($this->isFileResizable($file) && $this->shouldGenerateThumb()) {
            $thumb = \System\Classes\ResizeImages::resize($file->publicUrl, $this->imageWidth, $this->imageHeight, $this->thumbOptions);
        }

        $file->thumbUrl = $thumb;

        return $file;
    }

    /**
     * shouldGenerateThumb determines if the resizer should be used
     */
    protected function shouldGenerateThumb()
    {
        if ($this->thumbOptions === false) {
            return false;
        }

        return $this->imageWidth || $this->imageHeight;
    }

    /**
     * isFileResizable returns true if the file can be resized
     */
    protected function isFileResizable($file): bool
    {
        return in_array(pathinfo($file->path, PATHINFO_EXTENSION), [
            'jpg',
            'jpeg',
            'bmp',
            'png',
            'gif'
        ]);
    }

    /**
     * processMaxItems
     */
    protected function processMaxItems()
    {
        if ($this->maxItems === null) {
            if ($this->model instanceof Model) {
                $this->maxItems = $this->model->isJsonable($this->valueFrom) ? 0 : 1;
            }
            else {
                $this->maxItems = 1;
            }
        }

        $this->maxItems = (int) $this->maxItems;
    }

    /**
     * getDisplayMode for the file upload. Eg: file-multi, image-single, etc
     * @return string
     */
    protected function getDisplayMode()
    {
        $mode = $this->getConfig('mode', 'file');
        if (str_contains($mode, '-')) {
            return $mode;
        }

        if ($this->isFolderMode()) {
            return 'folder-single';
        }

        $isMulti = $this->maxItems !== 1;
        if ($isMulti) {
            return $mode . '-multi';
        }

        return $mode . '-single';
    }

    /**
     * isFolderMode returns true if the chosen media item is a folder.
     */
    protected function isFolderMode()
    {
        return $this->getConfig('mode') === 'folder';
    }
}
