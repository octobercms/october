<?php namespace System\Models;

use Url;
use Config;
use File as FileHelper;
use Storage;
use October\Rain\Database\Attach\File as FileBase;

/**
 * File attachment model
 *
 * @package october\system
 * @author Alexey Bobkov, Samuel Georges
 */
class File extends FileBase
{
    /**
     * @var string The database table used by the model.
     */
    protected $table = 'system_files';

    /**
     * If working with local storage, determine the absolute local path.
     */
    protected function getLocalRootPath()
    {
        return Config::get('filesystems.disks.local.root', storage_path('app'));
    }

    /**
     * Define the public address for the storage path.
     */
    public function getPublicPath()
    {
        $uploadsPath = Config::get('cms.storage.uploads.path', '/storage/app/uploads');

        if ($this->isPublic()) {
            $uploadsPath .= '/public';
        }
        else {
            $uploadsPath .= '/protected';
        }

        return Url::asset($uploadsPath) . '/';
    }

    /**
     * Define the internal storage path.
     */
    public function getStorageDirectory()
    {
        $uploadsFolder = Config::get('cms.storage.uploads.folder');

        if ($this->isPublic()) {
            return $uploadsFolder . '/public/';
        }

        return $uploadsFolder . '/protected/';
    }

    /**
     * Returns true if storage.uploads.disk in config/cms.php is "local".
     * @return bool
     */
    protected function isLocalStorage()
    {
        return Config::get('cms.storage.uploads.disk') == 'local';
    }

    /**
     * Copy the local file to Storage
     * @return bool True on success, false on failure.
     */
    protected function copyLocalToStorage($localPath, $storagePath)
    {
        $disk = Storage::disk(Config::get('cms.storage.uploads.disk'));
        return $disk->put($storagePath, FileHelper::get($localPath), $this->isPublic() ? 'public' : null);
    }
}
