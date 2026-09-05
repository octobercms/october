<?php namespace System\Classes;

use File;
use System;
use Throwable;
use Exception;

/**
 * ManifestCache stores data in a local disk cache
 *
 * @package october\system
 * @author Alexey Bobkov, Samuel Georges
 */
class ManifestCache
{
    /**
     * @var bool useManifest or not
     */
    protected $useManifest;

    /**
     * @var string|null manifestPath
     */
    protected $manifestPath;

    /**
     * @var array manifest of loaded items
     */
    protected $manifest = [];

    /**
     * @var bool manifestLoaded if manifest is loaded
     */
    protected $manifestLoaded = false;

    /**
     * @var bool manifestDirty if manifest needs to be written
     */
    protected $manifestDirty = false;

    /**
     * __construct creates a new package manifest instance
     */
    public function __construct()
    {
        $this->useManifest = !System::checkDebugMode();
        $this->manifestPath = cache_path('cms/manifest.php');
    }

    /**
     * has determines if the given manifest value exists.
     *
     * @param  string  $key
     * @return bool
     */
    public function has($key)
    {
        $this->ensureManifestIsLoaded();

        return isset($this->manifest[$key]);
    }

    /**
     * get the specified manifest value.
     *
     * @param  string  $key
     * @param  mixed   $default
     * @return mixed
     */
    public function get($key, $default = null)
    {
        $this->ensureManifestIsLoaded();

        return $this->manifest[$key] ?? $default;
    }

    /**
     * set a given manifest value.
     *
     * @param  array|string  $key
     * @param  mixed   $value
     * @return void
     */
    public function put($key, $value = null)
    {
        $this->ensureManifestIsLoaded();

        $this->manifestDirty = true;

        $this->manifest[$key] = $value;
    }

    /**
     * forget a manifest value
     *
     * @param  array|string  $key
     * @return void
     */
    public function forget($key)
    {
        $this->ensureManifestIsLoaded();

        $this->manifestDirty = true;

        unset($this->manifest[$key]);
    }

    /**
     * build the manifest and write it to disk
     */
    public function build()
    {
        if (!$this->manifestDirty) {
            return;
        }

        $this->write($this->manifest);
    }

    /**
     * ensureManifestIsLoaded has been loaded into memory
     */
    protected function ensureManifestIsLoaded()
    {
        if ($this->manifestLoaded) {
            return;
        }

        $manifest = [];

        if ($this->useManifest && file_exists($this->manifestPath)) {
            try {
                $manifest = File::getRequire($this->manifestPath);

                if (!is_array($manifest)) {
                    $manifest = [];
                }
            }
            catch (Throwable $ex) {
            }
        }

        $this->manifest += $manifest;

        $this->manifestLoaded = true;
    }

    /**
     * write the given manifest array to disk
     */
    protected function write(array $manifest)
    {
        if (!$this->useManifest || $this->manifestPath === null) {
            return;
        }

        if (!is_writable(dirname($this->manifestPath))) {
            throw new Exception("The {$this->manifestPath} directory must be present and writable.");
        }

        // Write to a sibling file and rename, so a concurrent request never
        // includes a half-written manifest
        $tempPath = $this->manifestPath . '.' . uniqid('', true) . '.tmp';

        File::put($tempPath, '<?php return '.var_export($manifest, true).';');

        if (!@rename($tempPath, $this->manifestPath)) {
            @unlink($tempPath);
            throw new Exception("The {$this->manifestPath} file could not be replaced.");
        }
    }
}
