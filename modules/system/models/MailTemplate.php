<?php namespace System\Models;

use View;
use Model;
use System\Classes\MailManager;
use October\Rain\Mail\MailParser;
use File as FileHelper;

/**
 * MailTemplate
 *
 * @package october\system
 * @author Alexey Bobkov, Samuel Georges
 */
class MailTemplate extends Model
{
    use \October\Rain\Database\Traits\Validation;

    /**
     * @var string table associated with the model
     */
    protected $table = 'system_mail_templates';

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
        'code' => 'required|unique:system_mail_templates',
        'subject' => 'required',
        'description' => 'required',
        'content_html' => 'required',
    ];

    public $belongsTo = [
        'layout' => MailLayout::class
    ];

    /**
     * listAllTemplates returns an array of template codes and descriptions.
     * @return array
     */
    public static function listAllTemplates()
    {
        // Only return short codes, not views
        $fileTemplates = (array) MailManager::instance()->listRegisteredTemplates();
        $fileTemplates = array_keys($fileTemplates);
        $fileTemplates = array_combine($fileTemplates, $fileTemplates);

        // Short codes are in the db too
        $dbTemplates = (array) self::lists('code', 'code');
        $templates = $fileTemplates + $dbTemplates;

        // Sort and return
        ksort($templates);
        return $templates;
    }

    /**
     * allTemplates returns a list of all mail templates, returns an array of
     * MailTemplate objects.
     */
    public static function allTemplates(): array
    {
        $dbTemplates = self::all();
        $fileReferences = (array) MailManager::instance()->listRegisteredTemplates();
        $fileTemplates = [];

        // Add missing file-based references
        foreach ($fileReferences as $code => $view) {
            if ($dbTemplates->where('code', $code)->count() > 0) {
                continue;
            }

            if (View::exists($view)) {
                $template = new self;
                $template->code = $code;
                $template->fillFromView($view);
                $fileTemplates[] = $template;
            }
        }

        if ($fileTemplates) {
            $dbTemplates->merge($fileTemplates);
        }

        return $dbTemplates->all();
    }

    /**
     * syncAll synchronizes all file templates to the database.
     * @return void
     */
    public static function syncAll()
    {
        MailLayout::createLayouts();
        MailPartial::createPartials();

        $templates = MailManager::instance()->listRegisteredTemplates();
        $dbTemplates = self::lists('is_custom', 'code');
        $newTemplates = array_diff_key($templates, $dbTemplates);

        // Clean up non-customized templates
        foreach ($dbTemplates as $code => $isCustom) {
            if (!$isCustom && !array_key_exists($code, $templates)) {
                self::where('code', $code)->delete();
            }
        }

        // Create new templates
        foreach ($newTemplates as $code => $view) {
            $sections = self::getTemplateSections($view);
            $layoutCode = array_get($sections, 'settings.layout', 'default');
            $description = array_get($sections, 'settings.description');

            $template = new self;
            $template->code = $code;
            $template->description = $description;
            $template->is_custom = false;
            $template->layout_id = MailLayout::getIdFromCode($layoutCode);
            $template->forceSave();
        }
    }

    /**
     * afterFetch
     */
    public function afterFetch()
    {
        if (!$this->is_custom) {
            $viewPath = MailManager::instance()->getViewPathForTemplate($this->code);
            $this->fillFromView($viewPath ?: $this->code);
        }
    }

    /**
     * fillFromContent
     */
    public function fillFromContent($content)
    {
        $this->fillFromSections(MailParser::parse($content));
    }

    /**
     * fillFromView
     */
    public function fillFromView($path)
    {
        $this->fillFromSections(self::getTemplateSections($path));
    }

    /**
     * fillFromSections
     */
    protected function fillFromSections($sections)
    {
        $this->content_html = $sections['html'] ?? '';
        $this->content_text = $sections['text'] ?? '';
        $this->subject = array_get($sections, 'settings.subject', 'No subject');

        $layoutCode = array_get($sections, 'settings.layout', 'default');
        $this->layout = MailLayout::findOrMakeLayout($layoutCode);
    }

    /**
     * getTemplateSections
     */
    protected static function getTemplateSections($view)
    {
        return MailParser::parse(FileHelper::get(View::make($view)->getPath()));
    }

    /**
     * findOrMakeTemplate
     */
    public static function findOrMakeTemplate($code)
    {
        $template = self::where('code', $code)->first();
        if ($template) {
            return $template;
        }

        $view = MailManager::instance()->getViewPathForTemplate($code) ?: $code;
        if (View::exists($view)) {
            $template = new self;
            $template->code = $code;
            $template->fillFromView($view);
            return $template;
        }

        return null;
    }

    /**
     * canSendTemplate
     */
    public static function canSendTemplate($code): bool
    {
        if (!$code) {
            return false;
        }

        $view = MailManager::instance()->getViewPathForTemplate($code) ?: $code;
        if (View::exists($view)) {
            return true;
        }

        return self::where('code', $code)->exists();
    }
}
