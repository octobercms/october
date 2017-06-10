<?php namespace Cms\Widgets;

use Str;
use Url;
use File;
use Lang;
use Input;
use Config;
use Request;
use Response;
use Validator;
use Cms\Classes\Theme;
use Cms\Classes\Asset;
use Backend\Classes\WidgetBase;
use System\Classes\PluginManager;
use ApplicationException;
use ValidationException;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\HttpFoundation\File\MimeType\MimeTypeGuesser;
use October\Rain\Filesystem\Definitions as FileDefinitions;
use RecursiveIteratorIterator;
use RecursiveDirectoryIterator;
use DirectoryIterator;
use Exception;

/**
 * CMS asset list widget.
 *
 * @package october\cms
 * @author Alexey Bobkov, Samuel Georges
 */
class AssetList extends WidgetBase
{
    use \Backend\Traits\SelectableWidget;

    protected $searchTerm = false;

    protected $theme;

    /**
     * @var string Message to display when there are no records in the list.
     */
    public $noRecordsMessage = 'cms::lang.asset.no_list_records';

    /**
     * @var string Message to display when the Delete button is clicked.
     */
    public $deleteConfirmation = 'cms::lang.asset.delete_confirm';

    /**
     * @var array Valid asset file extensions
     */
    protected $assetExtensions;

    public function __construct($controller, $alias)
    {
        $this->alias = $alias;
        $this->theme = Theme::getEditTheme();
        $this->selectionInputName = 'file';
        $this->assetExtensions = FileDefinitions::get('assetExtensions');

        parent::__construct($controller, []);
        $this->bindToController();

        $this->checkUploadPostback();
    }

    /**
     * @inheritDoc
     */
    protected function loadAssets()
    {
        $this->addCss('css/assetlist.css', 'core');
        $this->addJs('js/assetlist.js', 'core');
    }

    /**
     * Renders the widget.
     * @return string
     */
    public function render()
    {
        return $this->makePartial('body', [
           'data' => $this->getData()
        ]);
    }

    //
    // Event handlers
    //

    public function onOpenDirectory()
    {
        $path = Input::get('path');
        if (!$this->validatePath($path)) {
            throw new ApplicationException(Lang::get('cms::lang.asset.invalid_path'));
        }

        $delay = Input::get('delay');
        if ($delay) {
            usleep(1000000*$delay);
        }

        $this->putSession('currentPath', $path);
        return [
            '#'.$this->getId('asset-list') => $this->makePartial('items', ['items' => $this->getData()])
        ];
    }

    public function onRefresh()
    {
        return [
            '#'.$this->getId('asset-list') => $this->makePartial('items', ['items' => $this->getData()])
        ];
    }

    public function onUpdate()
    {
        $this->extendSelection();

        return $this->onRefresh();
    }

    public function onDeleteFiles()
    {
        $this->validateRequestTheme();

        $fileList = Request::input('file');
        $error = null;
        $deleted = [];

        try {
            $assetsPath = $this->getAssetsPath();

            foreach ($fileList as $path => $selected) {
                if ($selected) {
                    if (!$this->validatePath($path)) {
                        throw new ApplicationException(Lang::get('cms::lang.asset.invalid_path'));
                    }

                    $fullPath = $assetsPath.'/'.$path;
                    if (File::exists($fullPath)) {
                        if (!File::isDirectory($fullPath)) {
                            if (!@File::delete($fullPath)) {
                                throw new ApplicationException(Lang::get(
                                    'cms::lang.asset.error_deleting_file',
                                    ['name' => $path]
                                ));
                            }
                        }
                        else {
                            $empty = File::isDirectoryEmpty($fullPath);
                            if ($empty === false) {
                                throw new ApplicationException(Lang::get(
                                    'cms::lang.asset.error_deleting_dir_not_empty',
                                    ['name' => $path]
                                ));
                            }

                            if (!@rmdir($fullPath)) {
                                throw new ApplicationException(Lang::get(
                                    'cms::lang.asset.error_deleting_dir',
                                    ['name' => $path]
                                ));
                            }
                        }

                        $deleted[] = $path;
                        $this->removeSelection($path);
                    }
                }
            }
        }
        catch (Exception $ex) {
            $error = $ex->getMessage();
        }

        return [
            'deleted' => $deleted,
            'error'   => $error,
            'theme'   => Request::input('theme')
        ];
    }

    public function onLoadRenamePopup()
    {
        $this->validateRequestTheme();

        $path = Input::get('renamePath');
        if (!$this->validatePath($path)) {
            throw new ApplicationException(Lang::get('cms::lang.asset.invalid_path'));
        }

        $this->vars['originalPath'] = $path;
        $this->vars['name'] = basename($path);

        return $this->makePartial('rename_form');
    }

    public function onApplyName()
    {
        $this->validateRequestTheme();

        $newName = trim(Input::get('name'));
        if (!strlen($newName)) {
            throw new ApplicationException(Lang::get('cms::lang.asset.name_cant_be_empty'));
        }

        if (!$this->validatePath($newName)) {
            throw new ApplicationException(Lang::get('cms::lang.asset.invalid_path'));
        }

        if (!$this->validateName($newName)) {
            throw new ApplicationException(Lang::get('cms::lang.asset.invalid_name'));
        }

        $originalPath = Input::get('originalPath');
        if (!$this->validatePath($originalPath)) {
            throw new ApplicationException(Lang::get('cms::lang.asset.invalid_path'));
        }

        $originalFullPath = $this->getFullPath($originalPath);
        if (!file_exists($originalFullPath)) {
            throw new ApplicationException(Lang::get('cms::lang.asset.original_not_found'));
        }

        if (!is_dir($originalFullPath) && !$this->validateFileType($newName)) {
            throw new ApplicationException(Lang::get(
                'cms::lang.asset.type_not_allowed',
                ['allowed_types' => implode(', ', $this->assetExtensions)]
            ));
        }

        $newFullPath = $this->getFullPath(dirname($originalPath).'/'.$newName);
        if (file_exists($newFullPath) && $newFullPath !== $originalFullPath) {
            throw new ApplicationException(Lang::get('cms::lang.asset.already_exists'));
        }

        if (!@rename($originalFullPath, $newFullPath)) {
            throw new ApplicationException(Lang::get('cms::lang.asset.error_renaming'));
        }

        return [
            '#'.$this->getId('asset-list') => $this->makePartial('items', ['items' => $this->getData()])
        ];
    }

    public function onLoadNewDirPopup()
    {
        $this->validateRequestTheme();

        return $this->makePartial('new_dir_form');
    }

    public function onNewDirectory()
    {
        $this->validateRequestTheme();

        $newName = trim(Input::get('name'));
        if (!strlen($newName)) {
            throw new ApplicationException(Lang::get('cms::lang.asset.name_cant_be_empty'));
        }

        if (!$this->validatePath($newName)) {
            throw new ApplicationException(Lang::get('cms::lang.asset.invalid_path'));
        }

        if (!$this->validateName($newName)) {
            throw new ApplicationException(Lang::get('cms::lang.asset.invalid_name'));
        }

        $newFullPath = $this->getCurrentPath().'/'.$newName;
        if (file_exists($newFullPath)) {
            throw new ApplicationException(Lang::get('cms::lang.asset.already_exists'));
        }

        if (!File::makeDirectory($newFullPath)) {
            throw new ApplicationException(Lang::get(
                'cms::lang.cms_object.error_creating_directory',
                ['name' => $newName]
            ));
        }

        return [
            '#'.$this->getId('asset-list') => $this->makePartial('items', ['items' => $this->getData()])
        ];
    }

    public function onLoadMovePopup()
    {
        $this->validateRequestTheme();

        $fileList = Request::input('file');
        $directories = [];

        $selectedList = array_filter($fileList, function ($value) {
            return $value == 1;
        });

        $this->listDestinationDirectories($directories, $selectedList);

        $this->vars['directories'] = $directories;
        $this->vars['selectedList'] = base64_encode(json_encode(array_keys($selectedList)));

        return $this->makePartial('move_form');
    }

    public function onMove()
    {
        $this->validateRequestTheme();

        $selectedList = Input::get('selectedList');
        if (!strlen($selectedList)) {
            throw new ApplicationException(Lang::get('cms::lang.asset.selected_files_not_found'));
        }

        $destinationDir = Input::get('dest');
        if (!strlen($destinationDir)) {
            throw new ApplicationException(Lang::get('cms::lang.asset.select_destination_dir'));
        }

        $destinationFullPath = $this->getFullPath($destinationDir);
        if (!file_exists($destinationFullPath) || !is_dir($destinationFullPath)) {
            throw new ApplicationException(Lang::get('cms::lang.asset.destination_not_found'));
        }

        $list = @json_decode(@base64_decode($selectedList));
        if ($list === false) {
            throw new ApplicationException(Lang::get('cms::lang.asset.selected_files_not_found'));
        }

        foreach ($list as $path) {
            if (!$this->validatePath($path)) {
                throw new ApplicationException(Lang::get('cms::lang.asset.invalid_path'));
            }

            $basename = basename($path);
            $originalFullPath = $this->getFullPath($path);
            $newFullPath = rtrim($destinationFullPath, '/').'/'.$basename;
            $safeDir = $this->getAssetsPath();

            if ($originalFullPath == $newFullPath) {
                continue;
            }

            if (is_file($originalFullPath)) {
                if (!@File::move($originalFullPath, $newFullPath)) {
                    throw new ApplicationException(Lang::get(
                        'cms::lang.asset.error_moving_file',
                        ['file' => $basename]
                    ));
                }
            }
            elseif (is_dir($originalFullPath)) {
                if (!@File::copyDirectory($originalFullPath, $newFullPath)) {
                    throw new ApplicationException(Lang::get(
                        'cms::lang.asset.error_moving_directory',
                        ['dir' => $basename]
                    ));
                }

                if (strpos($originalFullPath, '../') !== false) {
                    throw new ApplicationException(Lang::get(
                        'cms::lang.asset.error_deleting_directory',
                        ['dir' => $basename]
                    ));
                }

                if (strpos($originalFullPath, $safeDir) !== 0) {
                    throw new ApplicationException(Lang::get(
                        'cms::lang.asset.error_deleting_directory',
                        ['dir' => $basename]
                    ));
                }

                if (!@File::deleteDirectory($originalFullPath)) {
                    throw new ApplicationException(Lang::get(
                        'cms::lang.asset.error_deleting_directory',
                        ['dir' => $basename]
                    ));
                }
            }
        }

        return [
            '#'.$this->getId('asset-list') => $this->makePartial('items', ['items' => $this->getData()])
        ];
    }

    public function onSearch()
    {
        $this->setSearchTerm(Input::get('search'));
        $this->extendSelection();

        return $this->onRefresh();
    }

    /*
     * Methods for the internal use
     */

    protected function getData()
    {
        $assetsPath = $this->getAssetsPath();

        if (!file_exists($assetsPath) || !is_dir($assetsPath)) {
            if (!File::makeDirectory($assetsPath)) {
                throw new ApplicationException(Lang::get(
                    'cms::lang.cms_object.error_creating_directory',
                    ['name' => $assetsPath]
                ));
            }
        }

        $searchTerm = Str::lower($this->getSearchTerm());

        if (!strlen($searchTerm)) {
            $currentPath = $this->getCurrentPath();
            return $this->getDirectoryContents(
                new DirectoryIterator($currentPath)
            );
        }

        return $this->findFiles();
    }

    protected function getAssetsPath()
    {
        return $this->theme->getPath().'/assets';
    }

    protected function getThemeFileUrl($path)
    {
        return Url::to('themes/'.$this->theme->getDirName().'/assets'.$path);
    }

    public function getCurrentRelativePath()
    {
        $path = $this->getSession('currentPath', '/');

        if (!$this->validatePath($path)) {
            return null;
        }

        if ($path == '.') {
            return null;
        }

        return ltrim($path, '/');
    }

    protected function getCurrentPath()
    {
        $assetsPath = $this->getAssetsPath();

        $path = $assetsPath.'/'.$this->getCurrentRelativePath();
        if (!is_dir($path)) {
            return $assetsPath;
        }

        return $path;
    }

    protected function getRelativePath($path)
    {
        $prefix = $this->getAssetsPath();

        if (substr($path, 0, strlen($prefix)) == $prefix) {
            $path = substr($path, strlen($prefix));
        }

        return $path;
    }

    protected function getFullPath($path)
    {
        return $this->getAssetsPath().'/'.ltrim($path, '/');
    }

    protected function validatePath($path)
    {
        if (!preg_match('/^[0-9a-z\.\s_\-\/]+$/i', $path)) {
            return false;
        }

        if (strpos($path, '..') !== false || strpos($path, './') !== false) {
            return false;
        }

        return true;
    }

    protected function validateName($name)
    {
        if (!preg_match('/^[0-9a-z\.\s_\-]+$/i', $name)) {
            return false;
        }

        if (strpos($name, '..') !== false) {
            return false;
        }

        return true;
    }

    protected function getDirectoryContents($dir)
    {
        $editableAssetTypes = Asset::getEditableExtensions();

        $result = [];
        $files = [];

        foreach ($dir as $node) {
            if (substr($node->getFileName(), 0, 1) == '.') {
                continue;
            }

            if ($node->isDir() && !$node->isDot()) {
                $result[$node->getFilename()] = (object)[
                    'type'     => 'directory',
                    'path'     => File::normalizePath($this->getRelativePath($node->getPathname())),
                    'name'     => $node->getFilename(),
                    'editable' => false
                ];
            }
            elseif ($node->isFile()) {
                $files[] = (object)[
                    'type'     => 'file',
                    'path'     => File::normalizePath($this->getRelativePath($node->getPathname())),
                    'name'     => $node->getFilename(),
                    'editable' => in_array(strtolower($node->getExtension()), $editableAssetTypes)
                ];
            }
        }

        foreach ($files as $file) {
            $result[] = $file;
        }

        return $result;
    }

    protected function listDestinationDirectories(&$result, $excludeList, $startDir = null, $level = 0)
    {
        if ($startDir === null) {
            $startDir = $this->getAssetsPath();

            $result['/'] = 'assets';
            $level = 1;
        }

        $dirs = new DirectoryIterator($startDir);
        foreach ($dirs as $node) {
            if (substr($node->getFileName(), 0, 1) == '.') {
                continue;
            }

            if ($node->isDir() && !$node->isDot()) {
                $fullPath = $node->getPathname();
                $relativePath = $this->getRelativePath($fullPath);
                if (array_key_exists($relativePath, $excludeList)) {
                    continue;
                }

                $result[$relativePath] = str_repeat('&nbsp;', $level*4).$node->getFilename();

                $this->listDestinationDirectories($result, $excludeList, $fullPath, $level+1);
            }
        }
    }

    protected function getSearchTerm()
    {
        return $this->searchTerm !== false ? $this->searchTerm : $this->getSession('search');
    }

    protected function isSearchMode()
    {
        return strlen($this->getSearchTerm());
    }

    protected function getThemeSessionKey($prefix)
    {
        return $prefix.$this->theme->getDirName();
    }

    protected function getUpPath()
    {
        $path = $this->getCurrentRelativePath();
        if (!strlen(rtrim(ltrim($path, '/'), '/'))) {
            return null;
        }

        return dirname($path);
    }

    protected function validateRequestTheme()
    {
        if ($this->theme->getDirName() != Request::input('theme')) {
            throw new ApplicationException(trans('cms::lang.theme.edit.not_match'));
        }
    }

    /**
     * Check for valid asset file extension
     * @param string
     * @return bool
     */
    protected function validateFileType($name)
    {
        $extension = strtolower(File::extension($name));

        if (!in_array($extension, $this->assetExtensions)) {
            return false;
        }

        return true;
    }

    /**
     * Checks the current request to see if it is a postback containing a file upload
     * for this particular widget.
     */
    protected function checkUploadPostback()
    {
        $fileName = null;

        try {
            $uploadedFile = Input::file('file_data');

            if (!is_object($uploadedFile)) {
                return;
            }

            $fileName = $uploadedFile->getClientOriginalName();

            /*
             * Check valid upload
             */
            if (!$uploadedFile->isValid()) {
                throw new ApplicationException(Lang::get('cms::lang.asset.file_not_valid'));
            }

            /*
             * Check file size
             */
            $maxSize = UploadedFile::getMaxFilesize();
            if ($uploadedFile->getSize() > $maxSize) {
                throw new ApplicationException(Lang::get(
                    'cms::lang.asset.too_large',
                    ['max_size' => File::sizeToString($maxSize)]
                ));
            }

            /*
             * Check for valid file extensions
             */
            if (!$this->validateFileType($fileName)) {
                throw new ApplicationException(Lang::get(
                    'cms::lang.asset.type_not_allowed',
                    ['allowed_types' => implode(', ', $this->assetExtensions)]
                ));
            }

            /*
             * Accept the uploaded file
             */
            $uploadedFile->move($this->getCurrentPath(), $uploadedFile->getClientOriginalName());

            die('success');
        }
        catch (Exception $ex) {
            $message = $fileName !== null
                ? Lang::get('cms::lang.asset.error_uploading_file', ['name' => $fileName, 'error' => $ex->getMessage()])
                : $ex->getMessage();

            die($message);
        }
    }

    protected function setSearchTerm($term)
    {
        $this->searchTerm = trim($term);
        $this->putSession('search', $this->searchTerm);
    }

    protected function findFiles()
    {
        $iterator = new RecursiveIteratorIterator(
            new RecursiveDirectoryIterator($this->getAssetsPath(), RecursiveDirectoryIterator::SKIP_DOTS),
            RecursiveIteratorIterator::SELF_FIRST,
            RecursiveIteratorIterator::CATCH_GET_CHILD
        );

        $editableAssetTypes = Asset::getEditableExtensions();
        $searchTerm = Str::lower($this->getSearchTerm());
        $words = explode(' ', $searchTerm);

        $result = [];
        foreach ($iterator as $item) {
            if (!$item->isDir()) {
                if (substr($item->getFileName(), 0, 1) == '.') {
                    continue;
                }

                $path = $this->getRelativePath($item->getPathname());

                if ($this->pathMatchesSearch($words, $path)) {
                    $result[] = (object)[
                        'type'     => 'file',
                        'path'     => File::normalizePath($path),
                        'name'     => $item->getFilename(),
                        'editable' => in_array(strtolower($item->getExtension()), $editableAssetTypes)
                    ];
                }
            }
        }

        return $result;
    }

    protected function pathMatchesSearch(&$words, $path)
    {
        foreach ($words as $word) {
            $word = trim($word);
            if (!strlen($word)) {
                continue;
            }

            if (!Str::contains(Str::lower($path), $word)) {
                return false;
            }
        }

        return true;
    }
}
