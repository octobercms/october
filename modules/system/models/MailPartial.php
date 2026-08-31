<?php namespace System\Models;

use View;
use Model;
use Config;
use System\Classes\MailManager;
use October\Rain\Mail\MailParser;
use ApplicationException;
use File as FileHelper;
use Exception;

/**
 * Mail partial
 *
 * @package october\system
 * @author Alexey Bobkov, Samuel Georges
 */
class MailPartial extends Model
{
    use \October\Rain\Database\Traits\Validation;
    use \October\Rain\Database\Traits\Translatable;

    /**
     * @var string table associated with the model
     */
    protected $table = 'system_mail_partials';

    /**
     * @var array translatable attribute names
     */
    public $translatable = [
        'content_html',
        'content_text',
    ];

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
        'code' => 'required|unique:system_mail_partials',
        'name' => 'required',
        'content_html' => 'required',
    ];

    /**
     * isTranslatableEnabled gates the Translatable trait on the multisite config flag
     * so backend forms only show translation markers when mail translation is enabled.
     */
    public function isTranslatableEnabled()
    {
        return (bool) Config::get('multisite.features.backend_mail_template', false);
    }

    /**
     * afterFetch
     */
    public function afterFetch()
    {
        if (!$this->is_custom) {
            try {
                $this->fillFromCode();
            }
            catch (Exception $ex) {
                return null;
            }
        }
    }

    /**
     * isLocked returns true when the partial is provided by the system, backed
     * by a registered view, and can be reset to its default content instead of deleted.
     */
    public function isLocked(): bool
    {
        return array_key_exists($this->code, (array) MailManager::instance()->listRegisteredPartials());
    }

    /**
     * resetToDefault reverts a customized partial back to its registered view content.
     */
    public function resetToDefault(): void
    {
        $this->fillFromCode();
        $this->is_custom = false;
        $this->save();
    }

    /**
     * findOrMakePartial
     */
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
     * createPartials loops over each mail layout and ensures the system has a layout,
     * if the layout does not exist, it will create one.
     * @return void
     */
    public static function createPartials()
    {
        $dbPartials = self::lists('code', 'code');

        $definitions = MailManager::instance()->listRegisteredPartials();
        foreach ($definitions as $code => $path) {
            if (array_key_exists($code, $dbPartials)) {
                continue;
            }

            $partial = new static;
            $partial->code = $code;
            $partial->is_custom = 0;
            $partial->fillFromView($path);
            $partial->save();
        }
    }

    /**
     * fillFromCode
     */
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

    /**
     * fillFromView
     */
    public function fillFromView($path)
    {
        $sections = self::getTemplateSections($path);

        $this->name = array_get($sections, 'settings.name', '???');
        $this->content_html =  array_get($sections, 'html');
        $this->content_text = array_get($sections, 'text');
    }

    /**
     * getTemplateSections
     */
    protected static function getTemplateSections($code)
    {
        return MailParser::parse(FileHelper::get(View::make($code)->getPath()));
    }
}
