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
     * Define the public address for the storage path.
     */
    public function getPublicDirectory()
    {
        $uploadsPath = Config::get('cms.uploadsPath', '/storage/app/uploads');

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
