<?php namespace System\Models;

use Model;
use ApplicationException;

/**
 * Mail layout
 *
 * @package october\system
 * @author Alexey Bobkov, Samuel Georges
 */
class MailLayout extends Model
{
    use \October\Rain\Database\Traits\Validation;

    /**
     * @var string The database table used by the model.
     */
    protected $table = 'system_mail_layouts';

    public $rules = [
        'code'                  => 'required|unique:system_mail_layouts',
        'name'                  => 'required',
        'content_html'          => 'required',
    ];

    public static $codeCache;

    public function beforeDelete()
    {
        if ($this->is_locked) {
            throw new ApplicationException('Cannot delete this template because it is locked');
        }
    }

    public static function listCodes()
    {
        if (self::$codeCache !== null) {
            return self::$codeCache;
        }

        return self::$codeCache = self::lists('id', 'code');
    }

    public static function getIdFromCode($code)
    {
        return array_get(self::listCodes(), $code);
    }

}
