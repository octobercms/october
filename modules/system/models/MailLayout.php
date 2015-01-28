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

    public function beforeDelete()
    {
        if ($this->is_locked) {
            throw new ApplicationException('Cannot delete this template because it is locked');
        }
    }
}
