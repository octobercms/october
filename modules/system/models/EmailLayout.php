<?php namespace System\Models;

use Model;
use System\Classes\ApplicationException;

class EmailLayout extends Model
{
    /**
     * @var string The database table used by the model.
     */
    protected $table = 'system_email_layouts';

    public $rules = [
        'code'                  => 'required|unique:system_email_layouts',
        'name'                  => 'required',
        'content_html'          => 'required',
    ];

    public function beforeDelete()
    {
        if ($this->is_locked)
            throw new ApplicationException('Cannot delete this template because it is locked');

    }
}