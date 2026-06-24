<?php namespace Cms\Classes\Halcyon;

use Illuminate\Contracts\Filesystem\Filesystem as FilesystemContract;
use October\Rain\Filesystem\Filesystem;

/**
 * LaravelDiskFilesystem adapts a Laravel storage disk for Halcyon datasource I/O.
 */
class LaravelDiskFilesystem extends Filesystem
{
    /**
     * @var FilesystemContract
     */
    protected $disk;

    /**
     * @var string
     */
    protected $prefix;

    public function __construct(FilesystemContract $disk, string $prefix = '')
    {
        $this->disk = $disk;
        $this->prefix = trim($prefix, '/');
    }

    /**
     * qualify prepends the disk prefix to a relative path
     */
    protected function qualify(string $path): string
    {
        $path = ltrim($path, '/\\');

        if ($this->prefix === '') {
            return $path;
        }

        return $this->prefix . '/' . $path;
    }

    /**
     * @inheritDoc
     */
    public function isFile($path)
    {
        return $this->disk->exists($this->qualify($path));
    }

    /**
     * @inheritDoc
     */
    public function get($path, $lock = false)
    {
        return $this->disk->get($this->qualify($path));
    }

    /**
     * @inheritDoc
     */
    public function put($path, $contents, $lock = false)
    {
        return $this->disk->put($this->qualify($path), $contents);
    }

    /**
     * @inheritDoc
     */
    public function delete($paths)
    {
        $paths = is_array($paths) ? $paths : func_get_args();

        foreach ($paths as $path) {
            $this->disk->delete($this->qualify($path));
        }

        return true;
    }

    /**
     * @inheritDoc
     */
    public function isDirectory($directory)
    {
        return $this->disk->exists($this->qualify($directory));
    }

    /**
     * @inheritDoc
     */
    public function makeDirectory($path, $mode = 0755, $recursive = false, $force = false)
    {
        return $this->disk->makeDirectory($this->qualify($path));
    }
}
