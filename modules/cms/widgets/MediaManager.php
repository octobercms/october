<?php namespace Cms\Widgets;

use URL;
use Str;
use Lang;
use File;
use Input;
use Request;
use Response;
use Exception;
use SystemException;
use ApplicationException;
use Backend\Classes\WidgetBase;
use Cms\Classes\MediaLibrary;
use Cms\Classes\MediaLibraryItem;
use October\Rain\Database\Attach\Resizer;

/**
 * Media Manager widget.
 *
 * @package october\cms
 * @author Alexey Bobkov, Samuel Georges
 */
class MediaManager extends WidgetBase
{
    const FOLDER_ROOT = '/';
    const VIEW_MODE_GRID = 'grid';
    const VIEW_MODE_LIST = 'list';
    const VIEW_MODE_TILES = 'tiles';

    protected $brokenImageHash = null;

    public function __construct($controller, $alias)
    {
        $this->alias = $alias;

        parent::__construct($controller, []);
        $this->bindToController();
    }

    /**
     * Renders the widget.
     * @return string
     */
    public function render()
    {
        $this->prepareVars();

        return $this->makePartial('body');
    }

    /*
     * Event handlers
     */

    public function onSearch()
    {
    }

    public function onGoToFolder()
    {
        $path = Input::get('path');

        if (Input::get('clearCache'))
            MediaLibrary::instance()->resetCache();

        $this->setCurrentFolder($path);
        $this->prepareVars();

        return [
            '#'.$this->getId('item-list') => $this->makePartial('item-list'),
            '#'.$this->getId('folder-path') => $this->makePartial('folder-path')
        ];
    }

    public function onGenerateThumbnails()
    {
        $batch = Input::get('batch');
        if (!is_array($batch))
            return;

        $result = [];
        foreach ($batch as $thumbnailInfo)
            $result[] = $this->generateThumbnail($thumbnailInfo);

        return [
            'generatedThumbnails'=>$result
        ];
    }

    public function onGetSidebarThumbnail()
    {
        $path = Input::get('path');
        $lastModified = Input::get('lastModified');

        $thumbnailParams = $this->getThumbnailParams();
        $thumbnailParams['width'] = 300;
        $thumbnailParams['height'] = 255;
        $thumbnailParams['mode'] = 'auto';

        $path = MediaLibrary::validatePath($path);

        if (!is_numeric($lastModified))
            throw new ApplicationException('Invalid input data');

        // If the thumbnail file exists - just return the thumbnail marup,
        // otherwise generate a new thumbnail.
        $thumbnailPath = $this->thumbnailExists($thumbnailParams, $path, $lastModified);
        if ($thumbnailPath) {
            return [
                'markup'=>$this->makePartial('thumbnail-image', [
                    'isError' => $this->thumbnailIsError($thumbnailPath),
                    'imageUrl' => $this->getThumbnailImageUrl($thumbnailPath)
                    ])
                ];
        }

        $thumbnailInfo = $thumbnailParams;
        $thumbnailInfo['path'] = $path;
        $thumbnailInfo['lastModified'] = $lastModified;
        $thumbnailInfo['id'] = 'sidebar-thumbnail';

        return $this->generateThumbnail($thumbnailInfo, $thumbnailParams, true);
    }

    public function onChangeView()
    {
        $viewMode = Input::get('view');
        $path = Input::get('path');

        $this->setViewMode($viewMode);
        $this->setCurrentFolder($path);

        $this->prepareVars();

        return [
            '#'.$this->getId('item-list') => $this->makePartial('item-list'),
            '#'.$this->getId('folder-path') => $this->makePartial('folder-path'),
            '#'.$this->getId('view-mode-buttons') => $this->makePartial('view-mode-buttons')
        ];
    }

    /*
     * Methods for th internal use
     */

    protected function prepareVars()
    {
        clearstatcache();

        $folder = $this->getCurrentFolder();
        $viewMode = $this->getViewMode();

        $this->vars['items'] = $this->listFolderItems($folder);
        $this->vars['currentFolder'] = $folder;
        $this->vars['isRootFolder'] = $folder == self::FOLDER_ROOT;
        $this->vars['pathSegments'] = $this->splitPathToSegments($folder);
        $this->vars['viewMode'] = $viewMode;

        $this->vars['thumbnailParams'] = $this->getThumbnailParams($viewMode);
    }

    protected function listFolderItems($folder)
    {
        return MediaLibrary::instance()->listFolderContents($folder);
    }

    protected function getCurrentFolder()
    {
        $folder = $this->getSession('media_folder', self::FOLDER_ROOT);

        return $folder;
    }

    protected function setCurrentFolder($path)
    {
        $path = MediaLibrary::validatePath($path);

        $this->putSession('media_folder', $path);
    }

    protected function itemTypeToIconClass($item, $itemType)
    {
        if ($item->type == MediaLibraryItem::TYPE_FOLDER)
            return 'icon-folder';

        switch ($itemType) {
            case MediaLibraryItem::FILE_TYPE_IMAGE : return "icon-picture-o";
            case MediaLibraryItem::FILE_TYPE_VIDEO : return "icon-video-camera";
            case MediaLibraryItem::FILE_TYPE_AUDIO : return "icon-volume-up";
            default : return "icon-file";
        }
    }

    protected function splitPathToSegments($path)
    {
        $path = MediaLibrary::validatePath($path, true);
        $result = [];

        do {
            $result[] = $path;
        } while (($path = dirname($path)) != '/');

        return array_reverse($result);
    }

    /**
     * Adds widget specific asset files. Use $this->addJs() and $this->addCss()
     * to register new assets to include on the page.
     * @return void
     */
    protected function loadAssets()
    {
        $this->addCss('css/mediamanager.css', 'core');
        $this->addJs('js/mediamanager.js', 'core');
    }

    protected function getViewMode()
    {
        return $this->getSession('view_mode', self::VIEW_MODE_GRID);
    }

    protected function setViewMode($viewMode)
    {
        if (!in_array($viewMode, [self::VIEW_MODE_GRID, self::VIEW_MODE_LIST, self::VIEW_MODE_TILES]))
            throw new SystemException('Invalid input data');

        return $this->putSession('view_mode', $viewMode);
    }

    protected function getThumbnailParams($viewMode = null)
    {
        $result = [
            'mode' => 'crop',
            'ext' => 'png'
        ];

        if ($viewMode) {
            if ($viewMode == self::VIEW_MODE_LIST) {
                $result['width'] = 75;
                $result['height'] = 75;
            } 
            else {
                $result['width'] = 165;
                $result['height'] = 165;
            }
        }

        return $result;
    }

    protected function getThumbnailImagePath($thumbnailParams, $itemPath, $lastModified)
    {
        $itemSignature = md5($itemPath).$lastModified;

        $thumbFile = 'thumb_' . 
            $itemSignature . '_' . 
            $thumbnailParams['width'] . 'x' . 
            $thumbnailParams['height'] . '_' . 
            $thumbnailParams['mode'] . '.' . 
            $thumbnailParams['ext'];

        $partition = implode('/', array_slice(str_split($itemSignature, 3), 0, 3)) . '/';

        $result = $this->getThumbnailDirectory().$partition.$thumbFile;

        return $result;
    }

    protected function getThumbnailImageUrl($imagePath)
    {
        return URL::to('/storage/temp'.$imagePath);
    }

    protected function thumbnailExists($thumbnailParams, $itemPath, $lastModified)
    {
        $thumbnailPath = $this->getThumbnailImagePath($thumbnailParams, $itemPath, $lastModified);

        $fullPath = temp_path(ltrim($thumbnailPath, '/'));
        if (File::exists($fullPath))
            return $thumbnailPath;

        return false;
    }

    protected function thumbnailIsError($thumbnailPath)
    {
        $fullPath = temp_path(ltrim($thumbnailPath, '/'));
        return hash_file('crc32', $fullPath) == $this->getBrokenImageHash();
    }

    protected function getLocalTempFilePath($fileName)
    {
        $fileName = md5($fileName.uniqid().microtime());

        $path = temp_path() . '/media';

        if (!File::isDirectory($path))
            File::makeDirectory($path, 0777, true, true);

        return $path.'/'.$fileName;
    }

    protected function getThumbnailDirectory()
    {
        return '/public/';
    }

    protected function getPlaceholderId($item)
    {
        return 'placeholder'.md5($item->path.'-'.$item->lastModified.uniqid(microtime()));
    }

    protected function generateThumbnail($thumbnailInfo, $thumbnailParams = null)
    {
        $tempFilePath = null;
        $fullThumbnailPath = null;
        $thumbnailPath = null;
        $markup = null;

        try {
            // Get and validate input data
            $path = $thumbnailInfo['path'];
            $width = $thumbnailInfo['width'];
            $height = $thumbnailInfo['height'];
            $lastModified = $thumbnailInfo['lastModified'];

            if (!is_numeric($width) || !is_numeric($height) || !is_numeric($lastModified))
                throw new ApplicationException('Invalid input data');

            if (!$thumbnailParams) {
                $thumbnailParams = $this->getThumbnailParams();
                $thumbnailParams['width'] = $width;
                $thumbnailParams['height'] = $height;
            }

            $thumbnailPath = $this->getThumbnailImagePath($thumbnailParams, $path, $lastModified);
            $fullThumbnailPath = temp_path(ltrim($thumbnailPath, '/'));

            // Save the file locally
            $library = MediaLibrary::instance();
            $tempFilePath = $this->getLocalTempFilePath($path);

            if (!@File::put($tempFilePath, $library->get($path)))
                throw new SystemException('Error saving remote file to a temporary location');

            // Resize the thumbnail and save to the thumbnails directory
            $this->resizeImage($fullThumbnailPath, $thumbnailParams, $tempFilePath);

            // Delete the temporary file
            File::delete($tempFilePath);
            $markup = $this->makePartial('thumbnail-image', [
                'isError' => false,
                'imageUrl' => $this->getThumbnailImageUrl($thumbnailPath)
            ]);
        } 
        catch (Exception $ex) {
            if ($tempFilePath)
                File::delete($tempFilePath);

            if ($fullThumbnailPath)
                $this->copyBrokenImage($fullThumbnailPath);

            $markup = $this->makePartial('thumbnail-image', ['isError' => true]);

            // TODO: We need to log all types of exceptions here
            traceLog($ex->getMessage());
        }

        if ($markup && ($id = $thumbnailInfo['id']))
            return [
                'id'=>$id, 
                'markup'=>$markup
            ];
    }

    protected function resizeImage($fullThumbnailPath, $thumbnailParams, $tempFilePath)
    {
        $thumbnailDir = dirname($fullThumbnailPath);
        if (!File::isDirectory($thumbnailDir)) {
            if (File::makeDirectory($thumbnailDir, 0777, true) === false)
                throw new SystemException('Error creating thumbnail directory');
        }

        $targetDimensions = $this->getTargetDimensions($thumbnailParams['width'], $thumbnailParams['height'], $tempFilePath);

        $targetWidth = $targetDimensions[0];
        $targetHeight = $targetDimensions[1];

        $resizer = Resizer::open($tempFilePath);
        $resizer->resize($targetWidth, $targetHeight, $thumbnailParams['mode'], [0, 0]);
        $resizer->save($fullThumbnailPath, 95);

        File::chmod($fullThumbnailPath);
    }

    protected function getBrokenImagePath()
    {
        return __DIR__.'/mediamanager/assets/images/broken-thumbnail.gif';
    }

    protected function getBrokenImageHash()
    {
        if ($this->brokenImageHash)
            return $this->brokenImageHash;

        $fullPath = $this->getBrokenImagePath();
        return $this->brokenImageHash = hash_file('crc32', $fullPath);
    }

    protected function copyBrokenImage($path)
    {
        try {
            $thumbnailDir = dirname($path);
            if (!File::isDirectory($thumbnailDir)) {
                if (File::makeDirectory($thumbnailDir, 0777, true) === false)
                    return;
            }
            File::copy($this->getBrokenImagePath(), $path);
        }
        catch (Exception $ex) {
            traceLog($ex->getMessage());
        }
    }

    protected function getTargetDimensions($width, $height, $originalImagePath)
    {
        $originalDimensions = [$width, $height];

        try {
            $dimensions = getimagesize($originalImagePath);
            if (!$dimensions)
                return $originalDimensions;

            if ($dimensions[0] > $width  || $dimensions[1] > $height)
                return $originalDimensions;

            return $dimensions;
        }
        catch (Exception $ex) {
            return $originalDimensions;
        }
    }
}