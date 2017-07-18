<?php namespace System\Models;

use App;
use File;
use View;
use Model;
use System\Classes\MailManager;
use October\Rain\Mail\MailParser;

/**
 * Mail template
 *
 * @package october\system
 * @author Alexey Bobkov, Samuel Georges
 */
class MailTemplate extends Model
{
    use \October\Rain\Database\Traits\Validation;

    /**
     * @var string The database table used by the model.
     */
    protected $table = 'system_mail_templates';

    public $rules = [
        'code'                  => 'required|unique:system_mail_templates',
        'subject'               => 'required',
        'description'           => 'required',
        'content_html'          => 'required',
    ];

    public $belongsTo = [
        'layout' => MailLayout::class
    ];

    /**
     * Returns an array of template codes and descriptions.
     * @return array
     */
    public static function listAllTemplates()
    {
        $fileTemplates = (array) MailManager::instance()->listRegisteredTemplates();
        $dbTemplates = (array) self::lists('description', 'code');
        $templates = $fileTemplates + $dbTemplates;
        ksort($templates);
        return $templates;
    }

    /**
     * Syncronise all file templates to the database.
     * @return void
     */
    public static function syncAll()
    {
        $templates = MailManager::instance()->listRegisteredTemplates();
        $dbTemplates = self::lists('is_custom', 'code');
        $newTemplates = array_diff_key($templates, $dbTemplates);

        /*
         * Clean up non-customized templates
         */
        foreach ($dbTemplates as $code => $is_custom) {
            if ($is_custom) {
                continue;
            }

            if (!array_key_exists($code, $templates)) {
                self::whereCode($code)->delete();
            }
        }

        /*
         * Create new templates
         */
        foreach ($newTemplates as $code => $description) {
            $sections = self::getTemplateSections($code);
            $layoutCode = array_get($sections, 'settings.layout', 'default');

            $template = self::make();
            $template->code = $code;
            $template->description = $description;
            $template->is_custom = 0;
            $template->layout_id = MailLayout::getIdFromCode($layoutCode);
            $template->forceSave();
        }
    }

    public function afterFetch()
    {
        if (!$this->is_custom) {
            $this->fillFromView();
        }
    }

    public function fillFromView()
    {
        $sections = self::getTemplateSections($this->code);
        $this->content_html = $sections['html'];
        $this->content_text = $sections['text'];
        $this->subject = array_get($sections, 'settings.subject', 'No subject');

        $layoutCode = array_get($sections, 'settings.layout', 'default');
        $this->layout_id = MailLayout::getIdFromCode($layoutCode);
    }

    protected static function getTemplateSections($code)
    {
        return MailParser::parse(File::get(View::make($code)->getPath()));
    }

    public static function findOrMakeTemplate($code)
    {
        if (!$template = self::whereCode($code)->first()) {
            $template = new self;
            $template->code = $code;
            $template->fillFromView();
        }

        return $template;
    }

    /**
     * @deprecated see System\Classes\MailManager::registerCallback
     * Remove if year >= 2019
     */
    public static function registerCallback(callable $callback)
    {
        traceLog('MailTemplate::registerCallback is deprecated, use System\Classes\MailManager::registerCallback instead');
        MailManager::instance()->registerCallback($callback);
    }
}
