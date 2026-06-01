<?php namespace System\Models;

use View;
use Model;
use System\Classes\MailManager;
use October\Rain\Mail\MailParser;
use ApplicationException;
use File as FileHelper;

/**
 * MailLayout
 *
 * @package october\system
 * @author Alexey Bobkov, Samuel Georges
 */
class MailLayout extends Model
{
    use \October\Rain\Database\Traits\Validation;

    /**
     * @var string table associated with the model
     */
    protected $table = 'system_mail_layouts';

    /**
     * @var array guarded fields
     */
    protected $guarded = [];

    /**
     * @var array fillable fields
     */
    protected $fillable = [];

    /**
     * @var array rules for validation
     */
    public $rules = [
        'code' => 'required|unique:system_mail_layouts',
        'name' => 'required',
        'content_html' => 'required',
    ];

    /**
     * @var array jsonable attribute names that are json encoded and decoded from the database
     */
    protected $jsonable = [
        'options'
    ];

    /**
     * @var array codeCache
     */
    public static $codeCache;

    /**
     * beforeDelete
     */
    public function beforeDelete()
    {
        if ($this->is_locked) {
            throw new ApplicationException('Cannot delete this template because it is locked');
        }
    }

    /**
     * listCodes
     */
    public static function listCodes()
    {
        if (self::$codeCache !== null) {
            return self::$codeCache;
        }

        return self::$codeCache = self::lists('id', 'code');
    }

    /**
     * getIdFromCode
     */
    public static function getIdFromCode($code)
    {
        return array_get(self::listCodes(), $code);
    }

    /**
     * findOrMakeLayout
     */
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
     * createLayouts loops over each mail layout and ensures the system has a layout,
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

        self::$codeCache = null;
    }

    /**
     * fillFromCode
     */
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

    /**
     * fillFromView
     */
    public function fillFromView($path)
    {
        $sections = self::getTemplateSections($path);

        $defaultCss = '
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
        $this->options = array_get($sections, 'settings.options', null);
        $this->content_css = $sections['css'] ?? $defaultCss;
        $this->content_html =  $sections['html'] ?? '';
        $this->content_text = $sections['text'] ?? '';
    }

    /**
     * getTemplateSections
     */
    protected static function getTemplateSections($code)
    {
        return MailParser::parse(FileHelper::get(View::make($code)->getPath()));
    }
}
