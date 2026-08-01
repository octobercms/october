<?php namespace Cms\Classes;

use Site;
use File;
use Lang as LangHelper;
use Cms\Helpers\File as FileHelper;
use Cms\Models\SourceFile;
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
     * getInternal helps the get method. When the theme has the database layer
     * enabled, results are merged with active SourceFile rows and any
     * filesystem entries whose paths are tombstoned in the database are
     * suppressed.
     */
    protected function getInternal(string $path, Theme $theme): array
    {
        $dbLayerEnabled = $theme->databaseLayerEnabled();
        $tombstoned = [];
        $dbRows = [];

        if ($dbLayerEnabled) {
            $source = $this->getSourceIdentifier($theme);

            $tombstoned = SourceFile::onlyTrashed()
                ->bySource($source)
                ->pluck('path')
                ->all();
            $tombstoned = array_flip($tombstoned);

            $dbRows = SourceFile::query()
                ->bySource($source)
                ->get()
                ->keyBy('path')
                ->all();
        }

        $result = [];
        $seen = [];

        if (file_exists($path)) {
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
                $normalizedPath = ltrim(File::normalizePath($filePath), '/');

                if (isset($tombstoned[$normalizedPath])) {
                    continue;
                }

                $result[] = [
                    'filename' => $fileName,
                    'path' => $normalizedPath
                ];
                $seen[$normalizedPath] = true;
            }
        }

        foreach ($dbRows as $rowPath => $row) {
            if (isset($seen[$rowPath])) {
                continue;
            }

            if (!in_array(strtolower(pathinfo($rowPath, PATHINFO_EXTENSION)), $this->allowedExtensions)) {
                continue;
            }

            $result[] = [
                'filename' => basename($rowPath),
                'path' => $rowPath
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
     * find a single template by its file name, resolving against the theme's
     * database layer and filesystem before falling back to its parent theme.
     */
    public function find(string $fileName)
    {
        if ($result = $this->findInTheme($this->theme, $fileName)) {
            return $result;
        }

        if ($parentTheme = $this->theme->getParentTheme()) {
            return $this->findInTheme($parentTheme, $fileName);
        }

        return null;
    }

    /**
     * findInTheme resolves a lang file against a single theme, checking its
     * database layer first and falling back to its filesystem copy.
     */
    protected function findInTheme(Theme $theme, string $fileName)
    {
        if ($theme->databaseLayerEnabled()) {
            if ($this->isTombstoned($theme, $fileName)) {
                return null;
            }

            if ($row = $this->findSourceFile($theme, $fileName)) {
                return $this->hydrateFromSourceFile($fileName, $row);
            }
        }

        $filePath = $theme->getPath().'/'.$this->dirName.'/'.$fileName;

        if (!File::isFile($filePath)) {
            return null;
        }

        if (!FileHelper::validateInTheme($theme, $filePath)) {
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
     * save the object to the disk, or to the database when the theme has the
     * database layer enabled.
     */
    public function save(array $options = [])
    {
        $this->validateFileName();

        if ($this->theme->databaseLayerEnabled()) {
            $this->saveToDatabase();
            return;
        }

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
     * delete the object from disk, or write a tombstone row when the theme
     * has the database layer enabled. A tombstone suppresses the filesystem
     * copy from listing/find, so the file appears deleted across all
     * instances even when the filesystem still has it.
     */
    public function delete()
    {
        $this->validateFileName();

        if ($this->theme->databaseLayerEnabled()) {
            SourceFile::tombstoneAt($this->getSourceIdentifier($this->theme), $this->fileName);
            return;
        }

        $fullPath = $this->getFilePath();

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

    /**
     * getSourceIdentifier returns the SourceFile source identifier for the
     * given theme's lang files. Format: theme.{themeDir}.lang
     */
    protected function getSourceIdentifier(Theme $theme): string
    {
        return 'theme.'.$theme->getDirName().'.lang';
    }

    /**
     * isTombstoned returns true if a soft-deleted SourceFile row exists for
     * the given theme and filename, meaning the file should be reported as
     * not existing even when the filesystem still has a copy.
     */
    protected function isTombstoned(Theme $theme, string $fileName): bool
    {
        return SourceFile::onlyTrashed()
            ->bySource($this->getSourceIdentifier($theme))
            ->byPath($fileName)
            ->exists();
    }

    /**
     * findSourceFile returns an active SourceFile row for the given theme
     * and filename, or null if none exists.
     */
    protected function findSourceFile(Theme $theme, string $fileName): ?SourceFile
    {
        return SourceFile::findByPath($this->getSourceIdentifier($theme), $fileName);
    }

    /**
     * hydrateFromSourceFile populates this instance from a SourceFile row,
     * using the row's updated_at as the mtime so concurrent-edit detection
     * compares like for like.
     */
    protected function hydrateFromSourceFile(string $fileName, SourceFile $row): static
    {
        $this->fileName = $fileName;
        $this->originalFileName = $fileName;
        $this->mtime = $row->updated_at ? $row->updated_at->timestamp : null;
        $this->content = $row->getContents();
        $this->exists = true;

        return $this;
    }

    /**
     * saveToDatabase upserts the current content into a SourceFile row for this theme and filename
     */
    protected function saveToDatabase(): void
    {
        $source = $this->getSourceIdentifier($this->theme);

        // Reject collisions when creating or renaming, mirroring the
        // filesystem branch's "file already exists" check
        if ($this->originalFileName !== $this->fileName) {
            $targetTaken = SourceFile::existsAt($source, $this->fileName)
                || (File::isFile($this->getFilePath()) && !$this->isTombstoned($this->theme, $this->fileName));

            if ($targetTaken) {
                throw new ApplicationException(LangHelper::get(
                    'cms::lang.cms_object.file_already_exists',
                    ['name' => $this->fileName]
                ));
            }
        }

        $row = SourceFile::upsertAt($source, $this->fileName, (string) $this->content);

        if (strlen($this->originalFileName) && $this->originalFileName !== $this->fileName) {
            SourceFile::tombstoneAt($source, $this->originalFileName);
        }

        $this->mtime = $row->updated_at ? $row->updated_at->timestamp : null;
        $this->originalFileName = $this->fileName;
        $this->exists = true;
    }
}
