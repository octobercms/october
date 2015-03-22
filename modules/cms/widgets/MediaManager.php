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

    const FILTER_EVERYTHING = 'everything';

    protected $brokenImageHash = null;

    public function __construct($controller, $alias)
    {
        $this->alias = $alias;

        parent::__construct($controller, []);
        $this->bindToController();

        $this->handleUploads();
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

    //
    // Event handlers
    //

    public function onSearch()
    {
        $this->setSearchTerm(Input::get('search'));

        $this->prepareVars();

        return [
            '#'.$this->getId('item-list') => $this->makePartial('item-list'),
            '#'.$this->getId('folder-path') => $this->makePartial('folder-path')
        ];
    }

    public function onGoToFolder()
    {
        $path = Input::get('path');

        if (Input::get('clearCache'))
            MediaLibrary::instance()->resetCache();

        if (Input::get('resetSearch'))
            $this->setSearchTerm(null);

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

    public function onSetFilter()
    {
        $filter = Input::get('filter');
        $path = Input::get('path');

        $this->setFilter($filter);
        $this->setCurrentFolder($path);

        $this->prepareVars();

        return [
            '#'.$this->getId('item-list') => $this->makePartial('item-list'),
            '#'.$this->getId('folder-path') => $this->makePartial('folder-path'),
            '#'.$this->getId('filters') => $this->makePartial('filters')
        ];
    }

    public function onSetSorting()
    {
        $sortBy = Input::get('sortBy');
        $path = Input::get('path');

        $this->setSortBy($sortBy);
        $this->setCurrentFolder($path);

        $this->prepareVars();

        return [
            '#'.$this->getId('item-list') => $this->makePartial('item-list'),
            '#'.$this->getId('folder-path') => $this->makePartial('folder-path')
        ];
    }

    public function onDelete()
    {
        $paths = Input::get('paths');

        if (!is_array($paths))
            throw new SystemException('Invalid input data');

        $library = MediaLibrary::instance();

        $filesToDelete = [];
        foreach ($paths as $pathInfo) {
            if (!isset($pathInfo['path']) || !isset($pathInfo['type']))
                throw new SystemException('Invalid input data');

            if ($pathInfo['type'] == 'file')
                $filesToDelete[] = $pathInfo['path'];
            else if ($pathInfo['type'] == 'folder')
                $library->deleteFolder($pathInfo['path']);
        }

        if (count($filesToDelete) > 0)
            $library->deleteFiles($filesToDelete);

        $library->resetCache();
        $this->prepareVars();

        return [
            '#'.$this->getId('item-list') => $this->makePartial('item-list')
        ];
    }

    public function onLoadRenamePopup()
    {
        $path = Input::get('path');
        $path = MediaLibrary::validatePath($path);

        $this->vars['originalPath'] = $path;
        $this->vars['name'] = basename($path);
        $this->vars['listId'] = Input::get('listId');
        $this->vars['type'] = Input::get('type');
        return $this->makePartial('rename-form');
    }

    public function onApplyName()
    {
        $newName = trim(Input::get('name'));
        if (!strlen($newName))
            throw new ApplicationException(Lang::get('cms::lang.asset.name_cant_be_empty'));

        if (!$this->validateFileName($newName))
            throw new ApplicationException(Lang::get('cms::lang.asset.invalid_name'));

        $originalPath = Input::get('originalPath');
        $originalPath = MediaLibrary::validatePath($originalPath);

        $newPath = dirname($originalPath).'/'.$newName;

        $type = Input::get('type');

        if ($type == MediaLibraryItem::TYPE_FILE)
            MediaLibrary::instance()->moveFile($originalPath, $newPath);
        else
            MediaLibrary::instance()->moveFolder($originalPath, $newPath);

        MediaLibrary::instance()->resetCache();
    }

    public function onCreateFolder()
    {
        $name = trim(Input::get('name'));
        if (!strlen($name))
            throw new ApplicationException(Lang::get('cms::lang.asset.name_cant_be_empty'));

        if (!$this->validateFileName($name))
            throw new ApplicationException(Lang::get('cms::lang.asset.invalid_name'));

        $path = Input::get('path');
        $path = MediaLibrary::validatePath($path);

        $newFolderPath = $path.'/'.$name;

        $library = MediaLibrary::instance();

        if ($library->folderExists($newFolderPath))
            throw new ApplicationException(Lang::get('cms::lang.media.folder_or_file_exist'));

        if (!$library->makeFolder($newFolderPath))
            throw new ApplicationException(Lang::get('cms::lang.media.error_creating_folder'));

        $library->resetCache();

        $this->prepareVars();

        return [
            '#'.$this->getId('item-list') => $this->makePartial('item-list')
        ];
    }

    public function onLoadMovePopup()
    {
        $exclude = Input::get('exclude', []);
        if (!is_array($exclude))
            throw new SystemException('Invalid input data');

        $folders = MediaLibrary::instance()->listAllDirectories($exclude);

        $folderList = [];
        foreach ($folders as $folder) {
            $path = $folder;

            if ($folder == '/') 
                $name = Lang::get('cms::lang.media.library');
            else {
                $segments = explode('/', $folder);
                $name = str_repeat('&nbsp;', (count($segments)-1)*4).basename($folder);
            }

            $folderList[$path] = $name;
        }

        $this->vars['folders'] = $folderList;
        $this->vars['originalPath'] = Input::get('path');

        return $this->makePartial('move-form');
    }

    public function onMoveItems()
    {
        $dest = trim(Input::get('dest'));
        if (!strlen($dest))
            throw new ApplicationException(Lang::get('cms::lang.media.please_select_move_dest'));

        $dest = MediaLibrary::validatePath($dest);
        if ($dest == Input::get('originalPath'))
            throw new ApplicationException(Lang::get('cms::lang.media.move_dest_src_match'));

        $files = Input::get('files', []);
        if (!is_array($files))
            throw new SystemException('Invalid input data');

        $folders = Input::get('folders', []);
        if (!is_array($folders))
            throw new SystemException('Invalid input data');

        $library = MediaLibrary::instance();

        foreach ($files as $path)
            $library->moveFile($path, $dest.'/'.basename($path));

        foreach ($folders as $path)
            $library->moveFolder($path, $dest.'/'.basename($path));

        $library->resetCache();

        $this->prepareVars();

        return [
            '#'.$this->getId('item-list') => $this->makePartial('item-list')
        ];
    }

    //
    // Methods for th internal use
    //

    protected function prepareVars()
    {
        clearstatcache();

        $folder = $this->getCurrentFolder();
        $viewMode = $this->getViewMode();
        $filter = $this->getFilter();
        $sortBy = $this->getSortBy();
        $searchTerm = $this->getSearchTerm();
        $searchMode = strlen($searchTerm) > 0;

        if (!$searchMode)
            $this->vars['items'] = $this->listFolderItems($folder, $filter, $sortBy);
        else
            $this->vars['items'] = $this->findFiles($searchTerm, $filter, $sortBy);

        $this->vars['currentFolder'] = $folder;
        $this->vars['isRootFolder'] = $folder == self::FOLDER_ROOT;
        $this->vars['pathSegments'] = $this->splitPathToSegments($folder);
        $this->vars['viewMode'] = $viewMode;
        $this->vars['thumbnailParams'] = $this->getThumbnailParams($viewMode);
        $this->vars['currentFilter'] = $filter;
        $this->vars['sortBy'] = $sortBy;
        $this->vars['searchMode'] = $searchMode;
        $this->vars['searchTerm'] = $searchTerm;
    }

    protected function listFolderItems($folder, $filter, $sortBy)
    {
        $filter = $filter !== self::FILTER_EVERYTHING ? $filter : null;

        return MediaLibrary::instance()->listFolderContents($folder, $sortBy, $filter);
    }

    protected function findFiles($searchTerm, $filter, $sortBy)
    {
        $filter = $filter !== self::FILTER_EVERYTHING ? $filter : null;

        return MediaLibrary::instance()->findFiles($searchTerm, $sortBy, $filter);
    }

    protected function setCurrentFolder($path)
    {
        $path = MediaLibrary::validatePath($path);

        $this->putSession('media_folder', $path);
    }

    protected function getCurrentFolder()
    {
        $folder = $this->getSession('media_folder', self::FOLDER_ROOT);

        return $folder;
    }

    protected function setFilter($filter)
    {
        if (!in_array($filter, [
                self::FILTER_EVERYTHING, 
                MediaLibraryItem::FILE_TYPE_IMAGE,
                MediaLibraryItem::FILE_TYPE_AUDIO,
                MediaLibraryItem::FILE_TYPE_DOCUMENT,
                MediaLibraryItem::FILE_TYPE_VIDEO]))
            throw new SystemException('Invalid input data');

        return $this->putSession('media_filter', $filter);
    }

    protected function getFilter()
    {
        return $this->getSession('media_filter', self::FILTER_EVERYTHING);
    }

    protected function setSearchTerm($searchTerm)
    {
        $this->putSession('media_search', trim($searchTerm));
    }

    protected function getSearchTerm()
    {
        return $this->getSession('media_search', null);
    }

    protected function setSortBy($sortBy)
    {
        if (!in_array($sortBy, [
                MediaLibrary::SORT_BY_TITLE,
                MediaLibrary::SORT_BY_SIZE,
                MediaLibrary::SORT_BY_MODIFIED]))
            throw new SystemException('Invalid input data');

        return $this->putSession('media_sort_by', $sortBy);
    }

    protected function getSortBy()
    {
        return $this->getSession('media_sort_by', MediaLibrary::SORT_BY_TITLE);
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
        $path = explode('/', ltrim($path, '/'));

        $result = [];
        while (count($path) > 0) {
            $folder = array_pop($path);

            $result[$folder] = implode('/', $path).'/'.$folder;
            if (substr($result[$folder], 0, 1) != '/')
                $result[$folder] = '/'.$result[$folder];
        }

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

    protected function setViewMode($viewMode)
    {
        if (!in_array($viewMode, [self::VIEW_MODE_GRID, self::VIEW_MODE_LIST, self::VIEW_MODE_TILES]))
            throw new SystemException('Invalid input data');

        return $this->putSession('view_mode', $viewMode);
    }

    protected function getViewMode()
    {
        return $this->getSession('view_mode', self::VIEW_MODE_GRID);
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

    protected function handleUploads()
    {
        $fileName = null;

        try {
            $uploadedFile = Input::file('file_data');

            if (!is_object($uploadedFile)) {
                return;
            }

            $fileName = $uploadedFile->getClientOriginalName();

            // See mime type handling in the asset manager

            if (!$uploadedFile->isValid())
                throw new ApplicationException($uploadedFile->getErrorMessage());

            $path = Input::get('path');
            $path = MediaLibrary::validatePath($path);

            MediaLibrary::instance()->put($path.'/'.$fileName, 
                File::get($uploadedFile->getRealPath()));

            die('success');
        }
        catch (Exception $ex) {
            Response::make($ex->getMessage(), 406)->send();

            die();
        }
    }

    protected function validateFileName($name)
    {
        if (!preg_match('/^[0-9a-z\.\s_\-]+$/i', $name))
            return false;

        if (strpos($name, '..') !== false)
            return false;
 
        return true;
    }
}