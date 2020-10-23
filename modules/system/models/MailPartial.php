<?php namespace System\Models;

use View;
use Model;
use System\Classes\MailManager;
use October\Rain\Mail\MailParser;
use ApplicationException;
use Exception;
use File as FileHelper;

/**
 * Mail partial
 *
 * @package october\system
 * @author Alexey Bobkov, Samuel Georges
 */
class MailPartial extends Model
{
    use \October\Rain\Database\Traits\Validation;

    /**
     * @var string The database table used by the model.
     */
    protected $table = 'system_mail_partials';

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
        'code'                  => 'required|unique:system_mail_partials',
        'name'                  => 'required',
        'content_html'          => 'required',
    ];

    public function afterFetch()
    {
        if (!$this->is_custom) {
            $this->fillFromCode();
        }
    }

    public static function findOrMakePartial($code)
    {
        try {
            if (!$template = self::whereCode($code)->first()) {
                $template = new self;
                $template->code = $code;
                $template->fillFromCode($code);
            }

            return $template;
        }
        catch (Exception $ex) {
            return null;
        }
    }

    /**
     * Loops over each mail layout and ensures the system has a layout,
     * if the layout does not exist, it will create one.
     * @return void
     */
    public static function createPartials()
    {
        $partials = MailManager::instance()->listRegisteredPartials();
        $dbPartials = self::lists('is_custom', 'code');
        $newPartials = array_diff_key($partials, $dbPartials);

        /*
         * Clean up non-customized partials
         */
        foreach ($dbPartials as $code => $isCustom) {
            if ($isCustom) {
                continue;
            }

            if (!array_key_exists($code, $partials)) {
                self::whereCode($code)->delete();
            }
        }

        foreach ($newPartials as $code => $path) {
            $partial = new static;
            $partial->code = $code;
            $partial->is_custom = 0;
            $partial->fillFromView($path);
            $partial->save();
        }
    }

    public function fillFromCode($code = null)
    {
        $definitions = MailManager::instance()->listRegisteredPartials();

        if ($code === null) {
            $code = $this->code;
        }

        if (!$definition = array_get($definitions, $code)) {
            throw new ApplicationException('Unable to find a registered partial with code: '.$code);
        }

        $this->fillFromView($definition);
    }

    public function fillFromView($path)
    {
        $sections = self::getTemplateSections($path);

        $this->name = array_get($sections, 'settings.name', '???');
        $this->content_html =  array_get($sections, 'html');
        $this->content_text = array_get($sections, 'text');
    }

    protected static function getTemplateSections($code)
    {
        return MailParser::parse(FileHelper::get(View::make($code)->getPath()));
    }
}
