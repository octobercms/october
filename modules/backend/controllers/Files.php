<?php namespace Backend\Controllers;

use App;
use Backend;
use System\Models\File as FileModel;
use Backend\Classes\Controller;
use ApplicationException;
use Exception;

/**
 * Backend files controller
 *
 * @package october\backend
 * @author Alexey Bobkov, Samuel Georges
 *
 */
class Files extends Controller
{
    public function get($code = null)
    {
        try {
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

            $verifyCode = self::getUniqueCode($file);
            if ($code != $verifyCode) {
                throw new ApplicationException('Invalid hash');
            }

            echo $file->output();
            exit;
        }
        catch (Exception $ex) {}

        /*
         * Fall back on Cms controller
         */
        return App::make('Cms\Classes\Controller')->setStatusCode(404)->run('/404');
    }

    public static function getDownloadUrl($file)
    {
        return Backend::url('backend/files/get/' . self::getUniqueCode($file));
    }

    public static function getUniqueCode($file)
    {
        if (!$file) {
            return null;
        }

        $hash = md5($file->file_name . '!' . $file->disk_name);
        return base64_encode($file->id . '!' . $hash);
    }
}