<?php namespace Cms\Classes;

use Site;
use File;
use Lang as LangHelper;
use Cms\Helpers\File as FileHelper;
use October\Rain\Extension\Extendable;
use ApplicationException;
use ValidationException;
use DirectoryIterator;

/**
 * Lang represents CMS language files
 *
 * @package october\cms
 * @author Alexey Bobkov, Samuel Georges
 */
class Lang extends Extendable
{
    /**
     * @var \Cms\Classes\Theme A reference to the CMS theme containing the object.
     */
    protected $theme;

    /**
     * @var string dirName for the container name inside the theme
     */
    protected $dirName = 'lang';

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
     * @var array allowedExtensions for language files
     */
    protected $allowedExtensions = ['json'];

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

        parent::__construct();
    }

    /**
     * load the object from a file
     * @param \Cms\Classes\Theme $theme Specifies the theme the object belongs to.
     * @param string $fileName Specifies the file name, with the extension.
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
     * get all language files in a theme
     *
     * Available options:
     * - filterFiles: only include files
     */
    public function get(array $options = []): array
    {
        extract(array_merge([
            'filterFiles' => false,
        ], $options));

        $path = $this->theme->getPath().'/'.$this->dirName;
        $files = $this->getInternal($path, $this->theme);

        // Splice in files of parent theme
        if ($parentTheme = $this->theme->getParentTheme()) {
            $parentPath = $parentTheme->getPath().'/'.$this->dirName;
            $files = array_merge($files, $this->getInternal($parentPath, $parentTheme));
        }

        return collect($files)->keyBy('path')->all();
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

        foreach ($iterator as $fileInfo) {
            $fileName = $fileInfo->getFileName();
            if (substr($fileName, 0, 1) === '.') {
                continue;
            }

            if (!$fileInfo->isFile()) {
                continue;
            }

            if (!in_array(strtolower($fileInfo->getExtension()), $this->allowedExtensions)) {
                continue;
            }

            $filePath = $this->getRelativePath($fileInfo->getPathname(), $theme);

            $result[] = [
                'filename' => $fileName,
                'path' => ltrim(File::normalizePath($filePath), '/')
            ];
        }

        return $result;
    }

    /**
     * getRelativePath returns path relative to the theme lang directory
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
    public static function inTheme($theme): Lang
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
                LangHelper::get('cms::lang.cms_object.invalid_file', [
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
                throw new ApplicationException(LangHelper::get(
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
    public function save(array $options = [])
    {
        $this->validateFileName();

        $fullPath = $this->getFilePath();

        if (File::isFile($fullPath) && $this->originalFileName !== $this->fileName) {
            throw new ApplicationException(LangHelper::get(
                'cms::lang.cms_object.file_already_exists',
                ['name'=>$this->fileName]
            ));
        }

        $dirPath = $this->theme->getPath().'/'.$this->dirName;
        if (!file_exists($dirPath) || !is_dir($dirPath)) {
            if (!File::makeDirectory($dirPath, 0755, true, true)) {
                throw new ApplicationException(LangHelper::get(
                    'cms::lang.cms_object.error_creating_directory',
                    ['name'=>$dirPath]
                ));
            }
        }

        $newFullPath = $fullPath;
        if (@File::put($fullPath, $this->content) === false) {
            throw new ApplicationException(LangHelper::get(
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
        $fullPath = $this->getFilePath();

        $this->validateFileName();

        if (!FileHelper::validateInTheme($this->theme, $fullPath)) {
            throw new ValidationException(['fileName' =>
                LangHelper::get('cms::lang.cms_object.invalid_file', [
                    'name' => $this->fileName
                ])
            ]);
        }

        if (File::exists($fullPath)) {
            if (!@File::delete($fullPath)) {
                throw new ApplicationException(LangHelper::get(
                    'cms::lang.lang.error_deleting_file',
                    ['name' => $this->fileName]
                ));
            }
        }
    }

    /**
     * validateFileName supplied with extension and path.
     */
    protected function validateFileName($fileName = null)
    {
        if ($fileName === null) {
            $fileName = $this->fileName;
        }

        $fileName = trim($fileName);

        if (!strlen($fileName)) {
            throw new ValidationException(['fileName' =>
                LangHelper::get('cms::lang.cms_object.file_name_required', [
                    'allowed' => implode(', ', $this->allowedExtensions),
                    'invalid' => pathinfo($fileName, PATHINFO_EXTENSION)
                ])
            ]);
        }

        if (!FileHelper::validateExtension($fileName, $this->allowedExtensions, false)) {
            throw new ValidationException(['fileName' =>
                LangHelper::get('cms::lang.cms_object.invalid_file_extension', [
                    'allowed' => implode(', ', $this->allowedExtensions),
                    'invalid' => pathinfo($fileName, PATHINFO_EXTENSION)
                ])
            ]);
        }

        if (!FileHelper::validatePath($fileName, null)) {
            throw new ValidationException(['fileName' =>
                LangHelper::get('cms::lang.cms_object.invalid_file', [
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
     * getTheme returns the theme this lang file belongs to.
     */
    public function getTheme(): Theme
    {
        return $this->theme;
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
     * getDefaultKeys returns the translation keys from the primary site's
     * language file, trying the full locale (e.g. en-au.json) then the
     * base language (e.g. en.json) as a fallback.
     */
    public static function getDefaultKeys(Theme $theme, ?string $excludeFileName = null): ?array
    {
        $primarySite = Site::getPrimarySite();
        if (!$primarySite) {
            return null;
        }

        $locale = $primarySite->hard_locale;
        $candidates = [$locale . '.json'];

        if (($pos = strpos($locale, '-')) !== false) {
            $candidates[] = substr($locale, 0, $pos) . '.json';
        }

        foreach ($candidates as $fileName) {
            if ($fileName === $excludeFileName) {
                return null;
            }

            $template = static::load($theme, $fileName);
            if ($template) {
                return json_decode($template->content ?: '{}', true) ?: [];
            }
        }

        return null;
    }

    /**
     * getFilePath returns the absolute file path of a lang file
     */
    public function getFilePath(?string $fileName = null): string
    {
        if ($fileName === null) {
            $fileName = $this->fileName;
        }

        return $this->theme->getPath().'/'.$this->dirName.'/'.$fileName;
    }
}
