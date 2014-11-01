<?php namespace System\Models;

use App;
use File;
use View;
use Model;
use October\Rain\Mail\MailParser;
use System\Classes\PluginManager;

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
        'layout' => ['System\Models\MailLayout']
    ];

    /**
     * @var array A cache of customised mail templates.
     */
    protected static $cache = [];

    /**
     * @var array Cache of registration callbacks.
     */
    private static $callbacks = [];

    protected static $registeredTemplates;

    public static function syncAll()
    {
        $templates = self::make()->listRegisteredTemplates();
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
        if (count($newTemplates)) {
            $categories = MailLayout::lists('id', 'code');
        }

        foreach ($newTemplates as $code => $description) {
            $sections = self::getTemplateSections($code);
            $layoutCode = array_get($sections, 'settings.layout', 'default');

            $template = self::make();
            $template->code = $code;
            $template->description = $description;
            $template->is_custom = false;
            $template->layout_id = isset($categories[$layoutCode]) ? $categories[$layoutCode] : null;
            $template->forceSave();
        }
    }

    public function afterFetch()
    {
        if (!$this->is_custom) {
            $sections = self::getTemplateSections($this->code);
            $this->content_html = $sections['html'];
            $this->content_text = $sections['text'];
            $this->subject = array_get($sections, 'settings.subject', 'No subject');
        }
    }

    protected static function getTemplateSections($code)
    {
        return MailParser::parse(File::get(View::make($code)->getPath()));
    }

    public static function addContentToMailer($message, $code, $data)
    {
        if (!isset(self::$cache[$code])) {
            if (!$template = self::whereCode($code)->first()) {
                return false;
            }

            self::$cache[$code] = $template;
        }
        else {
            $template = self::$cache[$code];
        }

        /*
         * Get Twig to load from a string
         */
        $twig = App::make('twig.string');
        $message->subject($twig->render($template->subject, $data));

        /*
         * HTML contents
         */
        $html = $twig->render($template->content_html, $data);
        if ($template->layout) {
            $html = $twig->render($template->layout->content_html, [
                'message' => $html,
                'css' => $template->layout->content_css
            ]);
        }

        $message->setBody($html, 'text/html');

        /*
         * Text contents
         */
        if (strlen($template->content_text)) {
            $text = $twig->render($template->content_text, $data);
            if ($template->layout) {
                $text = $twig->render($template->layout->content_text, ['message' => $text]);
            }

            $message->addPart($text, 'text/plain');
        }

        return true;
    }

    //
    // Registration
    //

    /**
     * Loads registered mail templates from modules and plugins
     * @return void
     */
    public function loadRegisteredTemplates()
    {
        foreach (static::$callbacks as $callback) {
            $callback($this);
        }

        $plugins = PluginManager::instance()->getPlugins();
        foreach ($plugins as $pluginId => $pluginObj) {
            $templates = $pluginObj->registerMailTemplates();
            if (!is_array($templates)) {
                continue;
            }

            $this->registerMailTemplates($templates);
        }
    }

    /**
     * Returns a list of the registered templates.
     * @return array
     */
    public function listRegisteredTemplates()
    {
        if (self::$registeredTemplates === null) {
            $this->loadRegisteredTemplates();
        }

        return self::$registeredTemplates;
    }

    /**
     * Registers a callback function that defines mail templates.
     * The callback function should register templates by calling the manager's
     * registerMailTemplates() function. Thi instance is passed to the
     * callback function as an argument. Usage:
     * <pre>
     *   MailTemplate::registerCallback(function($template){
     *       $template->registerMailTemplates([...]);
     *   });
     * </pre>
     * @param callable $callback A callable function.
     */
    public static function registerCallback(callable $callback)
    {
        self::$callbacks[] = $callback;
    }

    /**
     * Registers mail views and manageable templates.
     */
    public function registerMailTemplates(array $definitions)
    {
        if (!static::$registeredTemplates) {
            static::$registeredTemplates = [];
        }

        static::$registeredTemplates = array_merge(static::$registeredTemplates, $definitions);
    }
}
