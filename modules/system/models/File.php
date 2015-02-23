<?php namespace System\Models;

use Config;
use Request;
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
        return Config::get('filesystems.disks.local.root', storage_path().'/app');
    }

    /**
     * Define the public address for the storage path.
     */
    public function getPublicPath()
    {
        $uploadsPath = Config::get('cms.storage.uploads.path', '/storage/app/uploads');

        if (!preg_match("/(\/\/|http|https)/", $uploadsPath)) {
            $uploadsPath = Request::getBasePath() . $uploadsPath;
        }

        if ($this->isPublic()) {
            return $uploadsPath . '/public/';
        }
        else {
            return $uploadsPath . '/protected/';
        }
    }
}
