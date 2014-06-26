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

    //
    // Configuration
    //

    /**
     * Define the storage path, override this method to define.
     */
    public function getStorageDirectory()
    {
        $uploadsDir = Config::get('cms.uploadsDir');
        if ($this->isPublic())
            return base_path() . $uploadsDir . '/public/';
        else
            return base_path() . $uploadsDir . '/protected/';
    }

    /**
     * Define the public address for the storage path.
     */
    public function getPublicDirectory()
    {
        $uploadsDir = Config::get('cms.uploadsDir');
        if ($this->isPublic())
            return Request::getBasePath() . $uploadsDir . '/public/';
        else
            return Request::getBasePath() . $uploadsDir . '/protected/';
    }
}
