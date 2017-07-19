<?php namespace System\Classes;

use Twig;
use Markdown;
use System\Models\MailPartial;
use System\Models\MailTemplate;
use System\Helpers\View as ViewHelper;
use System\Classes\PluginManager;
use System\Classes\MarkupManager;
use System\Twig\MailPartialTokenParser;
use System\Twig\MailComponentTokenParser;

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
     * @var array List of registered partials in the system
     */
    protected $registeredPartials;

    /**
     * @var array List of registered layouts in the system
     */
    protected $registeredLayouts;

    /**
     * @var bool Internal marker for rendering mode
     */
    protected $isHtmlRenderMode;

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
         * Start twig transaction
         */
        $markupManager = MarkupManager::instance();
        $markupManager->beginTransaction();
        $markupManager->registerTokenParsers([
            new MailPartialTokenParser,
            new MailComponentTokenParser
        ]);

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
        $html = $this->renderHtmlContents($template, $data);

        $message->setBody($html, 'text/html');

        /*
         * Text contents
         */
        $text = $this->renderTextContents($template, $data);

        $message->addPart($text, 'text/plain');

        /*
         * End twig transaction
         */
        $markupManager->endTransaction();
    }

    //
    // Rendering
    //

    public function renderHtmlContents($template, $data)
    {
        $this->isHtmlRenderMode = true;

        $templateHtml = $template->content_html;

        $html = Twig::parse($templateHtml, $data);
        $html = Markdown::parse($html);

        if ($template->layout) {
            $html = Twig::parse($template->layout->content_html, [
                'content' => $html,
                'css' => $template->layout->content_css
            ] + (array) $data);
        }

        return $html;
    }

    public function renderTextContents($template, $data)
    {
        $this->isHtmlRenderMode = false;

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

        return $text;
    }

    public function renderPartial($code, $params)
    {
        if (!$partial = MailPartial::whereCode($code)->first()) {
            return '<!-- Missing partial: '.$code.' -->';
        }

        if ($this->isHtmlRenderMode) {
            return $this->renderHtmlPartial($partial, $params);
        }
        else {
            return $this->renderTextPartial($partial, $params);
        }
    }

    public function renderHtmlPartial($partial, $params)
    {
        $content = $partial->content_html;

        if (!strlen(trim($content))) {
            return '';
        }

        $params['body'] = Markdown::parse(array_get($params, 'body'));

        return Twig::parse($content, $params);
    }

    public function renderTextPartial($partial, $params)
    {
        $content = $partial->content_text ?: $partial->content_html;

        if (!strlen(trim($content))) {
            return '';
        }

        return Twig::parse($content, $params);
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
     * Returns a list of the registered partials.
     * @return array
     */
    public function listRegisteredPartials()
    {
        if ($this->registeredPartials === null) {
            $this->loadRegisteredTemplates();
        }

        return $this->registeredPartials;
    }

    /**
     * Returns a list of the registered layouts.
     * @return array
     */
    public function listRegisteredLayouts()
    {
        if ($this->registeredLayouts === null) {
            $this->loadRegisteredTemplates();
        }

        return $this->registeredLayouts;
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

        // Prior sytax where (key) code => (value) description
        if (!isset($definitions[0])) {
            $definitions = array_keys($definitions);
        }

        $definitions = array_combine($definitions, $definitions);

        $this->registeredTemplates = $definitions + $this->registeredTemplates;
    }

    /**
     * Registers mail views and manageable layouts.
     */
    public function registerMailPartials(array $definitions)
    {
        if (!$this->registeredPartials) {
            $this->registeredPartials = [];
        }

        $this->registeredPartials = $definitions + $this->registeredPartials;
    }

    /**
     * Registers mail views and manageable layouts.
     */
    public function registerMailLayouts(array $definitions)
    {
        if (!$this->registeredLayouts) {
            $this->registeredLayouts = [];
        }

        $this->registeredLayouts = $definitions + $this->registeredLayouts;
    }
}
