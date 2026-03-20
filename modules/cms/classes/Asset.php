<?php namespace Cms\Classes;

use File;
use Lang;
use Config;
use System;
use Request;
use Cms\Helpers\File as FileHelper;
use October\Rain\Extension\Extendable;
use ApplicationException;
use ValidationException;
use DirectoryIterator;

/**
 * Asset for CMS asset files
 *
 * @package october\cms
 * @author Alexey Bobkov, Samuel Georges
 */
class Asset extends Extendable
{
    /**
     * @var \Cms\Classes\Theme A reference to the CMS theme containing the object.
     */
    protected $theme;

    /**
     * @var string dirName for the container name inside the theme
     */
    protected $dirName = 'assets';

    /**
     * @var string fileName specifies the file name corresponding the CMS object
     */
    public $fileName;

    /**
     * @var string Specifies the file name, the CMS object was loaded from.
     */
    protected $originalFileName;

    /**
     * @var string Last modified time.
     */
    public $mtime;

    /**
     * @var string The entire file content.
     */
    public $content;

    /**
     * @var array fillable attributes that are mass assignable
     */
    protected $fillable = [
        'fileName',
        'content'
    ];

    /**
     * @var array allowedExtensions for template files
     */
    protected $allowedExtensions = [];

    /**
     * @var bool exists indicates if the model exists.
     */
    public $exists = false;

    /**
     * __construct creates an instance of the object and associates it with a CMS theme
     */
    public function __construct(Theme $theme)
    {
        $this->theme = $theme;

        $this->allowedExtensions = self::getEditableExtensions();

        parent::__construct();
    }

    /**
     * load the object from a file
     * This method is used in the CMS back-end. It doesn't use any caching.
     * @param \Cms\Classes\Theme $theme Specifies the theme the object belongs to.
     * @param string $fileName Specifies the file name, with the extension.
     * The file name can contain only alphanumeric symbols, dashes and dots.
     * @return mixed Returns a CMS object instance or null if the object wasn't found.
     */
    public static function load($theme, $fileName)
    {
        return (new static($theme))->find($fileName);
    }

    /**
     * listInTheme
     */
    public static function listInTheme($theme, array $options = [])
    {
        return static::inTheme($theme)->get($options);
    }

    /**
     * get all assets in a theme and uses simple objects
     *
     * Available options:
     * - recursive: search subfolders and place in 'assets' key
     * - flatten: produce a flat array instead of a recursive array
     * - filterPath: only include within an inner path
     * - filterFiles: only include files
     * - filterFolders: only include folders
     * - filterEditable: only show editable assets
     */
    public function get(array $options = []): array
    {
        extract(array_merge([
            'recursive' => true,
            'flatten' => false,
            'filterPath' => '',
            'filterFiles' => false,
            'filterFolders' => false,
            'filterEditable' => false,
        ], $options));

        $assets = [];

        $pathSuffix = $filterPath ? '/'.$filterPath : '';
        $path = $this->theme->getPath().'/'.$this->dirName.$pathSuffix;
        $files = $this->getInternal($path, $this->theme);

        // Splice in assets of parent theme
        if ($parentTheme = $this->theme->getParentTheme()) {
            $parentPath = $parentTheme->getPath().'/'.$this->dirName.$pathSuffix;
            $files = array_merge($files, $this->getInternal($parentPath, $parentTheme));
        }

        foreach ($files as $asset) {
            if ($recursive && $asset['isFolder'] && $asset['filename']) {
                $newFilter = $pathSuffix ? $pathSuffix.'/'.$asset['filename'] : $asset['filename'];

                if ($flatten) {
                    $assets = array_merge($assets, $this->get(['filterPath' => $newFilter] + $options));
                }
                else {
                    $asset['assets'] = $this->get(['filterPath' => $newFilter] + $options);
                }
            }

            if ($filterFolders && !$asset['isFolder']) {
                continue;
            }

            if ($filterEditable && !$asset['isEditable']) {
                continue;
            }

            if ($filterFiles && $asset['isFolder']) {
                continue;
            }

            $assets[] = $asset;
        }

        return collect($assets)->keyBy('path')->all();
    }

    /**
     * getInternal helps the get method
     */
    protected function getInternal(string $path, Theme $theme): array
    {
        if (!file_exists($path)) {
            return [];
        }

        $result = [];
        $iterator = new DirectoryIterator($path);
        $editableAssetTypes = Asset::getEditableExtensions();

        foreach ($iterator as $fileInfo) {
            $fileName = $fileInfo->getFileName();
            if (substr($fileName, 0, 1) === '.') {
                continue;
            }

            if (!$fileInfo->isDir() && !$fileInfo->isFile()) {
                continue;
            }

            $fileName = $fileInfo->getFileName();
            $isFolder = $fileInfo->isDir();
            $filePath = $this->getRelativePath($fileInfo->getPathname(), $theme);
            $isEditable = in_array(strtolower($fileInfo->getExtension()), $editableAssetTypes);

            $asset = [
                'filename' => $fileName,
                'isFolder' => $isFolder ? 1 : 0,
                'isEditable' => $isEditable,
                'path' => ltrim(File::normalizePath($filePath), '/')
            ];

            $result[] = $asset;
        }

        return $result;
    }

    /**
     * getRelativePath returns path relative to the theme asset directory
     */
    protected function getRelativePath(string $path, Theme $theme): string
    {
        $prefix = $theme->getPath().'/'.$this->dirName;

        if (substr($path, 0, strlen($prefix)) === $prefix) {
            $path = substr($path, strlen($prefix));
        }

        return $path;
    }

    /**
     * inTheme prepares the theme datasource for the model.
     */
    public static function inTheme($theme): Asset
    {
        if (is_string($theme)) {
            $theme = Theme::load($theme);
        }

        return new static($theme);
    }

    /**
     * find a single template by its file name.
     */
    public function find(string $fileName)
    {
        $filePath = $this->getFilePath($fileName);

        $foundTheme = $this->theme;

        if (!File::isFile($filePath)) {
            // Look at parent
            if ($parentTheme = $this->theme->getParentTheme()) {
                $foundTheme = $parentTheme;
                $filePath = $parentTheme->getPath().'/'.$this->dirName.'/'.$fileName;

                if (!File::isFile($filePath)) {
                    return null;
                }
            }
            else {
                return null;
            }
        }

        if (!FileHelper::validateInTheme($foundTheme, $filePath)) {
            throw new ValidationException(['fileName' =>
                Lang::get('cms::lang.cms_object.invalid_file', [
                    'name' => $fileName
                ])
            ]);
        }

        if (($content = @File::get($filePath)) === false) {
            return null;
        }

        $this->fileName = $fileName;
        $this->originalFileName = $fileName;
        $this->mtime = File::lastModified($filePath);
        $this->content = $content;
        $this->exists = true;

        return $this;
    }

    /**
     * Sets the object attributes.
     * @param array $attributes A list of attributes to set.
     */
    public function fill(array $attributes)
    {
        foreach ($attributes as $key => $value) {
            if (!in_array($key, $this->fillable)) {
                throw new ApplicationException(Lang::get(
                    'cms::lang.cms_object.invalid_property',
                    ['name' => $key]
                ));
            }

            $this->$key = $value;
        }
    }

    /**
     * save the object to the disk
     */
    public function save()
    {
        $this->validateFileName();

        $fullPath = $this->getFilePath();

        if (File::isFile($fullPath) && $this->originalFileName !== $this->fileName) {
            throw new ApplicationException(Lang::get(
                'cms::lang.cms_object.file_already_exists',
                ['name'=>$this->fileName]
            ));
        }

        $dirPath = $this->theme->getPath().'/'.$this->dirName;
        if (!file_exists($dirPath) || !is_dir($dirPath)) {
            if (!File::makeDirectory($dirPath, 0755, true, true)) {
                throw new ApplicationException(Lang::get(
                    'cms::lang.cms_object.error_creating_directory',
                    ['name'=>$dirPath]
                ));
            }
        }

        if (($pos = strpos($this->fileName, '/')) !== false) {
            $dirPath = dirname($fullPath);

            if (!is_dir($dirPath) && !File::makeDirectory($dirPath, 0755, true, true)) {
                throw new ApplicationException(Lang::get(
                    'cms::lang.cms_object.error_creating_directory',
                    ['name'=>$dirPath]
                ));
            }
        }

        $newFullPath = $fullPath;
        if (@File::put($fullPath, $this->content) === false) {
            throw new ApplicationException(Lang::get(
                'cms::lang.cms_object.error_saving',
                ['name'=>$this->fileName]
            ));
        }

        if (strlen($this->originalFileName) && $this->originalFileName !== $this->fileName) {
            $fullPath = $this->getFilePath($this->originalFileName);

            if (File::isFile($fullPath)) {
                @unlink($fullPath);
            }
        }

        clearstatcache();

        $this->mtime = @File::lastModified($newFullPath);
        $this->originalFileName = $this->fileName;
        $this->exists = true;
    }

    /**
     * delete the object from disk
     */
    public function delete()
    {
        $fileName = Request::input('fileName');
        $fullPath = $this->getFilePath($fileName);

        $this->validateFileName($fileName);

        if (!FileHelper::validateInTheme($this->theme, $fullPath)) {
            throw new ValidationException(['fileName' =>
                Lang::get('cms::lang.cms_object.invalid_file', [
                    'name' => $fileName
                ])
            ]);
        }

        if (File::exists($fullPath)) {
            if (!@File::delete($fullPath)) {
                throw new ApplicationException(Lang::get(
                    'cms::lang.asset.error_deleting_file',
                    ['name' => $fileName]
                ));
            }
        }
    }

    /**
     * validateFileName supplied with extension and path.
     * @param string $fileName
     */
    protected function validateFileName($fileName = null)
    {
        if ($fileName === null) {
            $fileName = $this->fileName;
        }

        $fileName = trim($fileName);

        if (!strlen($fileName)) {
            throw new ValidationException(['fileName' =>
                Lang::get('cms::lang.cms_object.file_name_required', [
                    'allowed' => implode(', ', $this->allowedExtensions),
                    'invalid' => pathinfo($fileName, PATHINFO_EXTENSION)
                ])
            ]);
        }

        if (!FileHelper::validateExtension($fileName, $this->allowedExtensions, false)) {
            throw new ValidationException(['fileName' =>
                Lang::get('cms::lang.cms_object.invalid_file_extension', [
                    'allowed' => implode(', ', $this->allowedExtensions),
                    'invalid' => pathinfo($fileName, PATHINFO_EXTENSION)
                ])
            ]);
        }

        if (!FileHelper::validatePath($fileName, null)) {
            throw new ValidationException(['fileName' =>
                Lang::get('cms::lang.cms_object.invalid_file', [
                    'name' => $fileName
                ])
            ]);
        }
    }

    /**
     * validate object
     */
    public function validate()
    {
        $this->validateFileName();
    }

    /**
     * getFileName
     * @return string
     */
    public function getFileName()
    {
        return $this->fileName;
    }

    /**
     * getFilePath returns the absolute file path of an asset
     */
    public function getFilePath(?string $fileName = null): string
    {
        if ($fileName === null) {
            $fileName = $this->fileName;
        }

        return $this->theme->getPath().'/'.$this->dirName.'/'.$fileName;
    }

    /**
     * getEditableExtensions returns a list of editable asset extensions
     * The list can be overridden with the cms.editable_asset_types configuration option.
     * @return array
     */
    public static function getEditableExtensions()
    {
        $defaultTypes =  ['css', 'js', 'less', 'sass', 'scss'];

        $configTypes = Config::get('cms.editable_asset_types');
        if ($configTypes) {
            $defaultTypes = $configTypes;
        }

        if (System::checkSafeMode()) {
            $defaultTypes = array_diff($defaultTypes, ['less', 'sass', 'scss']);
        }

        return array_values($defaultTypes);
    }
}
