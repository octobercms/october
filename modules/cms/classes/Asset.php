<?php namespace Cms\Classes;

use File;
use Lang;
use Config;
use Request;
use Cms\Helpers\File as FileHelper;
use October\Rain\Extension\Extendable;
use ApplicationException;
use ValidationException;

/**
 * The CMS theme asset file class.
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
     * @var string The container name inside the theme.
     */
    protected $dirName = 'assets';

    /**
     * @var string Specifies the file name corresponding the CMS object.
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
     * @var array The attributes that are mass assignable.
     */
    protected $fillable = [
        'fileName',
        'content'
    ];

    /**
     * @var array Allowable file extensions.
     */
    protected $allowedExtensions = [];

    /**
     * @var bool Indicates if the model exists.
     */
    public $exists = false;

    /**
     * Creates an instance of the object and associates it with a CMS theme.
     * @param \Cms\Classes\Theme $theme Specifies the theme the object belongs to.
     */
    public function __construct(Theme $theme)
    {
        $this->theme = $theme;

        $this->allowedExtensions = self::getEditableExtensions();

        parent::__construct();
    }

    /**
     * Loads the object from a file.
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
     * Prepares the theme datasource for the model.
     * @param \Cms\Classes\Theme|string $theme Specifies a parent theme.
     * @return $this
     */
    public static function inTheme($theme)
    {
        if (is_string($theme)) {
            $theme = Theme::load($theme);
        }

        return new static($theme);
    }

    /**
     * Find a single template by its file name.
     *
     * @param  string $fileName
     * @return mixed|static
     */
    public function find($fileName)
    {
        $filePath = $this->getFilePath($fileName);

        if (!File::isFile($filePath)) {
            return null;
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
     * Saves the object to the disk.
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
            if (!File::makeDirectory($dirPath, 0777, true, true)) {
                throw new ApplicationException(Lang::get(
                    'cms::lang.cms_object.error_creating_directory',
                    ['name'=>$dirPath]
                ));
            }
        }

        if (($pos = strpos($this->fileName, '/')) !== false) {
            $dirPath = dirname($fullPath);

            if (!is_dir($dirPath) && !File::makeDirectory($dirPath, 0777, true, true)) {
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

    public function delete()
    {
        $fileName = Request::input('fileName');
        $fullPath = $this->getFilePath($fileName);

        $this->validateFileName($fileName);

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
     * Validate the supplied filename, extension and path.
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
     * Returns the file name.
     * @return string
     */
    public function getFileName()
    {
        return $this->fileName;
    }

    /**
     * Returns the absolute file path.
     * @param string $fileName Specifies the file name to return the path to.
     * @return string
     */
    public function getFilePath($fileName = null)
    {
        if ($fileName === null) {
            $fileName = $this->fileName;
        }

        // Limit paths to those under the assets directory
        $directory = $this->theme->getPath() . '/' . $this->dirName . '/';
        $path = realpath($directory . $fileName);
        if (!starts_with($path, $directory)) {
            return false;
        }

        return $path;
    }

    /**
     * Returns a list of editable asset extensions.
     * The list can be overridden with the cms.editableAssetTypes configuration option.
     * @return array
     */
    public static function getEditableExtensions()
    {
        $defaultTypes =  ['css', 'js', 'less', 'sass', 'scss'];

        $configTypes = Config::get('cms.editableAssetTypes');
        if (!$configTypes) {
            return $defaultTypes;
        }

        return $configTypes;
    }
}
