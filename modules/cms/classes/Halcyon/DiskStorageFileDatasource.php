<?php namespace Cms\Classes\Halcyon;

use Cms\Classes\Contracts\ThemeFilesDiskAdapter;
use Illuminate\Contracts\Filesystem\Filesystem as FilesystemContract;
use October\Rain\Halcyon\Datasource\StorageFileDatasource;

/**
 * DiskStorageFileDatasource stores theme file bytes on a Laravel filesystem disk.
 */
class DiskStorageFileDatasource extends StorageFileDatasource implements ThemeFilesDiskAdapter
{
    /**
     * @var FilesystemContract
     */
    protected $disk;

    /**
     * @var string
     */
    protected $diskPrefix;

    public function __construct(
        string $source,
        string $table,
        FilesystemContract $disk,
        string $diskPrefix = ''
    ) {
        $this->disk = $disk;
        $this->diskPrefix = trim($diskPrefix, '/');

        parent::__construct(
            $source,
            $table,
            '',
            new LaravelDiskFilesystem($disk, $this->diskPrefix)
        );
    }

    /**
     * @inheritDoc
     */
    public function resolveLocalPath(string $dirName, string $fileName, string $extension): ?string
    {
        if (!$this->hasTemplate($dirName, $fileName, $extension) || !method_exists($this->disk, 'path')) {
            return null;
        }

        return $this->disk->path($this->qualifyDiskPath($this->makeFilePath($dirName, $fileName, $extension)));
    }

    /**
     * @inheritDoc
     */
    public function resolvePublicUrl(string $dirName, string $fileName, string $extension, array $context = []): ?string
    {
        if (!$this->hasTemplate($dirName, $fileName, $extension)) {
            return null;
        }

        $publicUrl = $context['publicUrl'] ?? null;

        if (!$publicUrl && method_exists($this->disk, 'url')) {
            $publicUrl = rtrim($this->disk->url($this->diskPrefix), '/');
        }

        if (!$publicUrl) {
            return null;
        }

        $path = $this->makeFilePath($dirName, $fileName, $extension);

        return rtrim($publicUrl, '/') . '/' . ltrim($path, '/');
    }

    /**
     * qualifyDiskPath returns the object key for a theme-relative path
     */
    protected function qualifyDiskPath(string $path): string
    {
        $path = ltrim($path, '/\\');

        if ($this->diskPrefix === '') {
            return $path;
        }

        return $this->diskPrefix . '/' . $path;
    }

    /**
     * @inheritDoc
     */
    protected function makeDiskPathFromPath(string $path): string
    {
        return ltrim($path, '/\\');
    }
}
