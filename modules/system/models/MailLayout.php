<?php namespace System\Models;

use View;
use Model;
use System\Classes\MailManager;
use October\Rain\Mail\MailParser;
use ApplicationException;
use File as FileHelper;

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

    /**
     * @var array Guarded fields
     */
    protected $guarded = [];

    /**
     * @var array Fillable fields
     */
    protected $fillable = [];

    /**
     * @var array Validation rules
     */
    public $rules = [
        'code'                  => 'required|unique:system_mail_layouts',
        'name'                  => 'required',
        'content_html'          => 'required',
    ];

    /**
     * @var array Options array
     */
    protected $jsonable = [
        'options'
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

    public static function findOrMakeLayout($code)
    {
        $layout = self::whereCode($code)->first();

        if (!$layout && View::exists($code)) {
            $layout = new self;
            $layout->code = $code;
            $layout->fillFromView($code);
        }

        return $layout;
    }

    /**
     * Loops over each mail layout and ensures the system has a layout,
     * if the layout does not exist, it will create one.
     * @return void
     */
    public static function createLayouts()
    {
        $dbLayouts = self::lists('code', 'code');

        $definitions = MailManager::instance()->listRegisteredLayouts();
        foreach ($definitions as $code => $path) {
            if (array_key_exists($code, $dbLayouts)) {
                continue;
            }

            $layout = new static;
            $layout->code = $code;
            $layout->is_locked = true;
            $layout->fillFromView($path);
            $layout->save();
        }
    }

    public function fillFromCode($code = null)
    {
        $definitions = MailManager::instance()->listRegisteredLayouts();

        if ($code === null) {
            $code = $this->code;
        }

        if (!$definition = array_get($definitions, $code)) {
            throw new ApplicationException('Unable to find a registered layout with code: '.$code);
        }

        $this->fillFromView($definition);
    }

    public function fillFromView($path)
    {
        $sections = self::getTemplateSections($path);

        $css = '
@media only screen and (max-width: 600px) {
    .inner-body {
        width: 100% !important;
    }

    .footer {
        width: 100% !important;
    }
}

@media only screen and (max-width: 500px) {
    .button {
        width: 100% !important;
    }
}
        ';

        $this->name = array_get($sections, 'settings.name', '???');
        $this->content_css = $css;
        $this->content_html =  array_get($sections, 'html');
        $this->content_text = array_get($sections, 'text');
    }

    protected static function getTemplateSections($code)
    {
        return MailParser::parse(FileHelper::get(View::make($code)->getPath()));
    }
}
