<?php namespace Cms\Classes;

use File;
use Lang;
use Event;
use Config;
use System;
use Request;
use Storage;
use Cms\Helpers\File as FileHelper;
use Cms\Models\SourceFile;
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
    use \Cms\Classes\Asset\HasOperations;

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
     * getInternal helps the get method. When the theme has the asset database
     * layer enabled, results are merged with active SourceFile rows scoped to
     * the listed directory level and any filesystem entries whose paths are
     * tombstoned in the database are suppressed.
     */
    protected function getInternal(string $path, Theme $theme): array
    {
        $dbLayerEnabled = $theme->assetDatabaseLayerEnabled();
        $tombstoned = [];
        $dbPaths = [];

        if ($dbLayerEnabled) {
            $source = $this->getSourceIdentifier($theme);

            $tombstoned = SourceFile::onlyTrashed()
                ->bySource($source)
                ->pluck('path')
                ->all();
            $tombstoned = array_flip($tombstoned);

            $dbPaths = SourceFile::query()
                ->bySource($source)
                ->pluck('path')
                ->all();
        }

        $result = [];
        $seen = [];
        $editableAssetTypes = Asset::getEditableExtensions();

        if (file_exists($path)) {
            $iterator = new DirectoryIterator($path);

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
                $normalizedPath = ltrim(File::normalizePath($filePath), '/');

                if (!$isFolder && isset($tombstoned[$normalizedPath])) {
                    continue;
                }

                $result[] = [
                    'filename' => $fileName,
                    'isFolder' => $isFolder ? 1 : 0,
                    'isEditable' => $isEditable,
                    'path' => $normalizedPath
                ];
                $seen[$normalizedPath] = true;
            }
        }

        // Merge database rows scoped to this directory level, synthesizing
        // folder entries for rows nested beneath it
        if ($dbLayerEnabled) {
            $relativePrefix = trim(ltrim(File::normalizePath($this->getRelativePath($path, $theme)), '/'), '/');
            $prefix = strlen($relativePrefix) ? $relativePrefix.'/' : '';

            foreach ($dbPaths as $rowPath) {
                if (strlen($prefix) && strpos($rowPath, $prefix) !== 0) {
                    continue;
                }

                $remainder = strlen($prefix) ? substr($rowPath, strlen($prefix)) : $rowPath;
                if (!strlen($remainder)) {
                    continue;
                }

                $slashPos = strpos($remainder, '/');

                // File directly at this level, dotfiles stay hidden
                if ($slashPos === false) {
                    if (isset($seen[$rowPath]) || substr($remainder, 0, 1) === '.') {
                        continue;
                    }

                    $result[] = [
                        'filename' => $remainder,
                        'isFolder' => 0,
                        'isEditable' => in_array(strtolower(pathinfo($remainder, PATHINFO_EXTENSION)), $editableAssetTypes),
                        'path' => $rowPath
                    ];
                    $seen[$rowPath] = true;
                    continue;
                }

                // Synthesize a folder entry for the first segment beneath this level
                $folderName = substr($remainder, 0, $slashPos);
                $folderPath = $prefix.$folderName;

                if (isset($seen[$folderPath])) {
                    continue;
                }

                $result[] = [
                    'filename' => $folderName,
                    'isFolder' => 1,
                    'isEditable' => false,
                    'path' => $folderPath
                ];
                $seen[$folderPath] = true;
            }
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
     * findInTheme resolves an asset against a single theme, checking its
     * database layer first and falling back to its filesystem copy.
     */
    protected function findInTheme(Theme $theme, string $fileName)
    {
        if ($theme->assetDatabaseLayerEnabled()) {
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
     * save the object to the disk, or to the assets disk with database row
     * tracking when the asset database layer is enabled.
     */
    public function save()
    {
        $this->validateFileName();

        if ($this->theme->assetDatabaseLayerEnabled()) {
            $this->saveToDatabase();
            return;
        }

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
     * delete the object from disk, or tombstone its database row and remove
     * the assets disk object when the asset database layer is enabled.
     */
    public function delete()
    {
        $fileName = Request::input('fileName');
        $fullPath = $this->getFilePath($fileName);

        $this->validateFileName($fileName);

        if ($this->theme->assetDatabaseLayerEnabled()) {
            SourceFile::tombstoneAt($this->getSourceIdentifier($this->theme), $fileName);

            $diskPath = $this->getDiskPath($this->theme, $fileName);
            Storage::disk($this->getDiskName())->delete($diskPath);

            $this->fireInvalidationEvent([$diskPath]);
            return;
        }

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

    /**
     * getSourceIdentifier returns the SourceFile source identifier for the
     * given theme's assets. Format: theme.{themeDir}.asset
     */
    protected function getSourceIdentifier(Theme $theme): string
    {
        return 'theme.'.$theme->getDirName().'.asset';
    }

    /**
     * getDiskName returns the Storage disk name used for published assets.
     */
    protected function getDiskName(): string
    {
        return 'assets';
    }

    /**
     * getDiskPath returns the assets disk key for a theme asset, mirroring
     * the repo-relative path so it matches the public URL built by asset().
     */
    protected function getDiskPath(Theme $theme, string $fileName): string
    {
        return 'themes/'.$theme->getDirName().'/'.$this->dirName.'/'.ltrim($fileName, '/');
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
     * saveToDatabase writes the current content to the assets disk and upserts
     * a disk-backed SourceFile row for this theme and filename
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
                throw new ApplicationException(Lang::get(
                    'cms::lang.cms_object.file_already_exists',
                    ['name' => $this->fileName]
                ));
            }
        }

        $diskPath = $this->getDiskPath($this->theme, $this->fileName);
        $invalidatePaths = [$diskPath];

        $row = SourceFile::upsertOnDiskAt(
            $source,
            $this->fileName,
            $this->getDiskName(),
            $diskPath,
            (string) $this->content
        );

        // Renames tombstone the old row and remove its disk object
        if (strlen($this->originalFileName) && $this->originalFileName !== $this->fileName) {
            SourceFile::tombstoneAt($source, $this->originalFileName);

            $oldDiskPath = $this->getDiskPath($this->theme, $this->originalFileName);
            Storage::disk($this->getDiskName())->delete($oldDiskPath);
            $invalidatePaths[] = $oldDiskPath;
        }

        $this->fireInvalidationEvent($invalidatePaths);

        $this->mtime = $row->updated_at ? $row->updated_at->timestamp : null;
        $this->originalFileName = $this->fileName;
        $this->exists = true;
    }

    /**
     * fireInvalidationEvent notifies listeners that asset bytes changed on
     * the assets disk so CDN caches can be purged.
     */
    protected function fireInvalidationEvent(array $diskPaths): void
    {
        /**
         * @event cms.asset.invalidate
         * Fires after asset bytes change on the assets disk so CDN caches can
         * be purged. Receives the theme and the changed disk keys.
         *
         * Example usage:
         *
         *     Event::listen('cms.asset.invalidate', function ($theme, $diskPaths) {
         *         MyCdn::invalidate($diskPaths);
         *     });
         *
         */
        Event::fire('cms.asset.invalidate', [$this->theme, $diskPaths]);
    }
}
