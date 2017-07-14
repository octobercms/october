<?php namespace System\Classes;

use Twig;
use Markdown;
use System\Models\MailTemplate;
use System\Helpers\View as ViewHelper;
use System\Classes\PluginManager;

/**
 * This class manages Mail sending functions
 *
 * @package october\system
 * @author Alexey Bobkov, Samuel Georges
 */
class MailManager
{
    use \October\Rain\Support\Traits\Singleton;

    /**
     * @var array Cache of registration callbacks.
     */
    protected $callbacks = [];

    /**
     * @var array A cache of customised mail templates.
     */
    protected $templateCache = [];

    /**
     * @var array List of registered templates in the system
     */
    protected $registeredTemplates;

    /**
     * This function hijacks the `addContent` method of the `October\Rain\Mail\Mailer` 
     * class, using the `mailer.beforeAddContent` event.
     */
    public function addContentToMailer($message, $code, $data)
    {
        if (isset($this->templateCache[$code])) {
            $template = $this->templateCache[$code];
        }
        else {
            $this->templateCache[$code] = $template = MailTemplate::findOrMakeTemplate($code);
        }

        /*
         * Inject global view variables
         */
        $globalVars = ViewHelper::getGlobalVars();
        if (!empty($globalVars)) {
            $data = (array) $data + $globalVars;
        }

        /*
         * Subject
         */
        $customSubject = $message->getSwiftMessage()->getSubject();
        if (empty($customSubject)) {
            $message->subject(Twig::parse($template->subject, $data));
        }

        /*
         * HTML contents
         */
        $templateHtml = $template->content_html;

        $html = Twig::parse($templateHtml, $data);
        $html = Markdown::parse($html);

        if ($template->layout) {
            $html = Twig::parse($template->layout->content_html, [
                'content' => $html,
                'css' => $template->layout->content_css
            ] + (array) $data);
        }

        $message->setBody($html, 'text/html');

        /*
         * Text contents
         */
        $templateText = $template->content_text;

        if (!strlen($template->content_text)) {
            $templateText = $template->content_html;
        }

        $text = Twig::parse($templateText, $data);
        if ($template->layout) {
            $text = Twig::parse($template->layout->content_text, [
                'content' => $text
            ] + (array) $data);
        }

        $message->addPart($text, 'text/plain');
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
        foreach ($this->callbacks as $callback) {
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
        if ($this->registeredTemplates === null) {
            $this->loadRegisteredTemplates();
        }

        return $this->registeredTemplates;
    }

    /**
     * Registers a callback function that defines mail templates.
     * The callback function should register templates by calling the manager's
     * registerMailTemplates() function. Thi instance is passed to the
     * callback function as an argument. Usage:
     *
     *     MailManager::registerCallback(function($manager) {
     *         $manager->registerMailTemplates([...]);
     *     });
     *
     * @param callable $callback A callable function.
     */
    public function registerCallback(callable $callback)
    {
        $this->callbacks[] = $callback;
    }

    /**
     * Registers mail views and manageable templates.
     */
    public function registerMailTemplates(array $definitions)
    {
        if (!$this->registeredTemplates) {
            $this->registeredTemplates = [];
        }

        $this->registeredTemplates = array_merge($this->registeredTemplates, $definitions);
    }
}
