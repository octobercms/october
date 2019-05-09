<?php namespace October\Test\Models;

use File as FileHelper;
use Request;
use System\Models\File as FileBase;

/**
 * This file model saves files to storage/temp/test-plugin-custom-files
 * It also does not use partition directories.
 */
class CustomFile extends FileBase
{
    protected function getPartitionDirectory()
    {
        return '/';
    }

    protected function getLocalRootPath()
    {
        return storage_path();
    }

    public function getStorageDirectory()
    {
        return 'temp/test-plugin-custom-files';
    }

    public function getPublicPath()
    {
        $uploadsPath = '/storage/temp/test-plugin-custom-files';

        return Request::getBasePath() . $uploadsPath;
    }

    protected function isLocalStorage()
    {
        return true;
    }
}
