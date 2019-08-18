<?php namespace Backend\Controllers;

use View;
use Cache;
use Config;
use Backend;
use Response;
use System\Models\File as FileModel;
use Backend\Classes\Controller;
use ApplicationException;
use Exception;

/**
 * Backend files controller
 *
 * Used for delivering protected system files, and generating URLs
 * for accessing them.
 *
 * @package october\backend
 * @author Alexey Bobkov, Samuel Georges
 *
 */
class Files extends Controller
{
    /**
     * Output file, or fall back on the 404 page
     */
    public function get($code = null)
    {
        try {
            return $this->findFileObject($code)->output('inline', true);
        }
        catch (Exception $ex) {
        }

        return Response::make(View::make('backend::404'), 404);
    }

    /**
     * Output thumbnail, or fall back on the 404 page
     */
    public function thumb($code = null, $width = 100, $height = 100, $mode = 'auto', $extension = 'auto')
    {
        try {
            return $this->findFileObject($code)->outputThumb(
                $width,
                $height,
                compact('mode', 'extension'),
                true
            );
        }
        catch (Exception $ex) {
        }

        return Response::make(View::make('backend::404'), 404);
    }

    /**
     * Attempt to return a redirect to a temporary URL to the asset instead of streaming the asset - if supported
     *
     * @param System|Models\File $file
     * @param string|null $path Optional, defaults to the getDiskPath() of the file
     * @return string|null
     */
    protected static function getTemporaryUrl($file, $path = null)
    {
        // Get the disk and adapter used
        $url = null;
        $disk = $file->getDisk();
        $adapter = $disk->getAdapter();
        if (class_exists('\League\Flysystem\Cached\CachedAdapter') && $adapter instanceof \League\Flysystem\Cached\CachedAdapter) {
            $adapter = $adapter->getAdapter();
        }

        if ((class_exists('\League\Flysystem\AwsS3v3\AwsS3Adapter') && $adapter instanceof \League\Flysystem\AwsS3v3\AwsS3Adapter) ||
            (class_exists('\League\Flysystem\Rackspace\RackspaceAdapter') && $adapter instanceof \League\Flysystem\Rackspace\RackspaceAdapter) ||
            method_exists($adapter, 'getTemporaryUrl')
        ) {
            if (empty($path)) {
                $path = $file->getDiskPath();
            }

            // Check to see if the URL has already been generated
            $pathKey = 'backend.file:' . $path;
            $url = Cache::get($pathKey);

            // The AWS S3 storage drivers will return a valid temporary URL even if the file does not exist
            if (is_null($url) && $disk->exists($path)) {
                $expires = now()->addSeconds(Config::get('cms.storage.uploads.temporaryUrlTTL', 3600));
                $url = Cache::remember($pathKey, $expires, function () use ($disk, $path, $expires) {
                    return $disk->temporaryUrl($path, $expires);
                });
            }
        }

        return $url;
    }

    /**
     * Returns the URL for downloading a system file.
     * @param $file System\Models\File
     * @return string
     */
    public static function getDownloadUrl($file)
    {
        $url = static::getTemporaryUrl($file);

        if (!empty($url)) {
            return $url;
        } else {
            return Backend::url('backend/files/get/' . self::getUniqueCode($file));
        }
    }

    /**
     * Returns the URL for downloading a system file.
     * @param $file System\Models\File
     * @param $width int
     * @param $height int
     * @param $options array
     * @return string
     */
    public static function getThumbUrl($file, $width, $height, $options)
    {
        $url = static::getTemporaryUrl($file, $file->getDiskPath($file->getThumbFilename($width, $height, $options)));

        if (!empty($url)) {
            return $url;
        } else {
            return Backend::url('backend/files/thumb/' . self::getUniqueCode($file)) . '/' . $width . '/' . $height . '/' . $options['mode'] . '/' . $options['extension'];
        }
    }

    /**
     * Returns a unique code used for masking the file identifier.
     * @param $file System\Models\File
     * @return string
     */
    public static function getUniqueCode($file)
    {
        if (!$file) {
            return null;
        }

        $hash = md5($file->file_name . '!' . $file->disk_name);
        return base64_encode($file->id . '!' . $hash);
    }

    /**
     * Locates a file model based on the unique code.
     * @param $code string
     * @return System\Models\File
     */
    protected function findFileObject($code)
    {
        if (!$code) {
            throw new ApplicationException('Missing code');
        }

        $parts = explode('!', base64_decode($code));
        if (count($parts) < 2) {
            throw new ApplicationException('Invalid code');
        }

        list($id, $hash) = $parts;

        if (!$file = FileModel::find((int) $id)) {
            throw new ApplicationException('Unable to find file');
        }

        /**
         * Ensure that the file model utilized for this request is
         * the one specified in the relationship configuration
         */
        if ($file->attachment) {
            $fileModel = $file->attachment->{$file->field}()->getRelated();

            /**
             * Only attempt to get file model through its assigned class
             * when the assigned class differs from the default one that
             * the file has already been loaded from
             */
            if (get_class($file) !== get_class($fileModel)) {
                $file = $fileModel->find($file->id);
            }
        }

        $verifyCode = self::getUniqueCode($file);
        if ($code != $verifyCode) {
            throw new ApplicationException('Invalid hash');
        }

        return $file;
    }
}
