<?php namespace System\Classes;

use Twig;
use Markdown;
use System\Models\MailPartial;
use System\Models\MailTemplate;
use System\Models\MailBrandSetting;
use System\Helpers\View as ViewHelper;
use System\Twig\MailPartialTokenParser;
use TijsVerkoyen\CssToInlineStyles\CssToInlineStyles;

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
    protected $isHtmlRenderMode = false;

    /**
     * @var bool Internal marker for booting custom twig extensions.
     */
    protected $isTwigStarted = false;

    /**
     * Same as `addContentToMailer` except with raw content.
     *
     * @return bool
     *
     * @deprecated Use addContent() instead
     */
    public function addRawContentToMailer($message, $content, $data)
    {
        $text = new MailTemplate;
        $text->fillFromContent($content);

        $this->addContentToMailerInternal($message, null, $text, $data);

        return true;
    }

    /**
     * This function hijacks the `addContent` method of the `October\Rain\Mail\Mailer`
     * class, using the `mailer.beforeAddContent` event.
     *
     * @param \Illuminate\Mail\Message $message
     * @param string $code
     * @param array $data
     * @param bool $plainOnly Add only plain text content to the message
     * @return bool
     *
     * @deprecated Use addContent() instead
     */
    public function addContentToMailer($message, $code, $data, $plainOnly = false)
    {
        if (isset($this->templateCache[$code])) {
            $template = $this->templateCache[$code];
        }
        else {
            $this->templateCache[$code] = $template = MailTemplate::findOrMakeTemplate($code);
        }

        if (!$template) {
            return false;
        }

        $html = $text = $template;

        if ($plainOnly) {
            $html = null;
        }
        $this->addContentToMailerInternal($message, $html, $text, $data);

        return true;
    }

    /**
     * Restore proper behavior in-line with Laravel Mailer
     * Replaces both `addContentToMailer` and `addRawContentToMailer`
     *
     * @param \Illuminate\Mail\Message $message
     * @param string|null $view
     * @param string|null $plain
     * @param string|null $raw
     * @param array $data
     * @return bool
     */
    public function addContent($message, $view, $plain, $raw, $data)
    {
        $html = $text = null;

        if (!is_null($view)) {
            if (isset($this->templateCache[$view])) {
                $html = $this->templateCache[$view];
            } else {
                $this->templateCache[$view] = $html = MailTemplate::findOrMakeTemplate($view);
            }
        }

        if (!is_null($plain)) {
            if (isset($this->templateCache[$plain])) {
                $text = $this->templateCache[$plain];
            } else {
                $this->templateCache[$plain] = $text = MailTemplate::findOrMakeTemplate($plain);
            }
        }

        // raw content will overwrite plain view content, as done in laravel
        if (!is_null($raw)) {
            $text = new MailTemplate;
            $text->fillFromContent($raw);
        }

        // bailout if we have no content
        if (is_null($html) && is_null($text)) {
            return false;
        }

        $this->addContentToMailerInternal($message, $html, $text, $data);

        return true;
    }

    /**
     * Internal method used to share logic between `addContent`, `addRawContentToMailer` and `addContentToMailer`
     *
     * @param \Illuminate\Mail\Message $message
     * @param MailTemplate|null $html
     * @param MailTemplate|null $text
     * @param array $data
     * @return void
     */
    protected function addContentToMailerInternal($message, $html = null, $text = null, array $data = [])
    {
        /*
         * Start twig transaction
         */
        $this->startTwig();

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
        $swiftMessage = $message->getSwiftMessage();

        if (empty($swiftMessage->getSubject())) {
            if ($html) {
                $message->subject(Twig::parse($html->subject, $data));
            } else if ($text) {
                $message->subject(Twig::parse($text->subject, $data));
            }
        }

        $data += [
            'subject' => $swiftMessage->getSubject()
        ];

        /*
         * HTML content
         */
        if ($html) {
            $message->setBody($this->renderTemplate($html, $data), 'text/html');
            if (!$text && $html->content_text) {
                $text = $html;
            }
        }

        /*
         * Text content
         */
        if ($text) {
            $method = $html ? 'addPart' : 'setBody';
            $message->{$method}($this->renderTextTemplate($text, $data), 'text/plain');
        }


        /*
         * End twig transaction
         */
        $this->stopTwig();
    }

    //
    // Rendering
    //

    /**
     * Render the Markdown template into HTML.
     *
     * @param  string  $content
     * @param  array  $data
     * @return string
     */
    public function render($content, $data = [])
    {
        if (!$content) {
            return '';
        }

        $html = $this->renderTwig($content, $data);

        $html = Markdown::parseSafe($html);

        return $html;
    }

    public function renderTemplate($template, $data = [])
    {
        $this->isHtmlRenderMode = true;

        $html = $this->render($template->content_html, $data);

        $css = MailBrandSetting::renderCss();

        $disableAutoInlineCss = false;

        if ($template->layout) {
            $disableAutoInlineCss = array_get($template->layout->options, 'disable_auto_inline_css', $disableAutoInlineCss);

            $html = $this->renderTwig($template->layout->content_html, [
                'content' => $html,
                'css' => $template->layout->content_css,
                'brandCss' => $css
            ] + (array) $data);

            $css .= PHP_EOL . $template->layout->content_css;
        }

        if (!$disableAutoInlineCss) {
            $html = (new CssToInlineStyles)->convert($html, $css);
        }

        return $html;
    }

    /**
     * Render the Markdown template into text.
     * @param $content
     * @param array $data
     * @return string
     */
    public function renderText($content, $data = [])
    {
        if (!$content) {
            return '';
        }

        $text = $this->renderTwig($content, $data);

        $text = html_entity_decode(preg_replace("/[\r\n]{2,}/", "\n\n", $text), ENT_QUOTES, 'UTF-8');

        return $text;
    }

    public function renderTextTemplate($template, $data = [])
    {
        $this->isHtmlRenderMode = false;

        $templateText = $template->content_text;

        if (!strlen($template->content_text)) {
            $templateText = $template->content_html;
        }

        $text = $this->renderText($templateText, $data);

        if ($template->layout) {
            $text = $this->renderTwig($template->layout->content_text, [
                'content' => $text
            ] + (array) $data);
        }

        return $text;
    }

    public function renderPartial($code, array $params = [])
    {
        if (!$partial = MailPartial::findOrMakePartial($code)) {
            return '<!-- Missing partial: '.$code.' -->';
        }

        if ($this->isHtmlRenderMode) {
            $content = $partial->content_html;
        }
        else {
            $content = $partial->content_text ?: $partial->content_html;
        }

        if (!strlen(trim($content))) {
            return '';
        }

        return $this->renderTwig($content, $params);
    }

    /**
     * Internal helper for rendering Twig
     */
    protected function renderTwig($content, $data = [])
    {
        if ($this->isTwigStarted) {
            return Twig::parse($content, $data);
        }

        $this->startTwig();

        $result = Twig::parse($content, $data);

        $this->stopTwig();

        return $result;
    }

    /**
     * Temporarily registers mail based token parsers with Twig.
     * @return void
     */
    protected function startTwig()
    {
        if ($this->isTwigStarted) {
            return;
        }

        $this->isTwigStarted = true;

        $markupManager = MarkupManager::instance();
        $markupManager->beginTransaction();
        $markupManager->registerTokenParsers([
            new MailPartialTokenParser
        ]);
    }

    /**
     * Indicates that we are finished with Twig.
     * @return void
     */
    protected function stopTwig()
    {
        if (!$this->isTwigStarted) {
            return;
        }

        $markupManager = MarkupManager::instance();
        $markupManager->endTransaction();

        $this->isTwigStarted = false;
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
            $layouts = $pluginObj->registerMailLayouts();
            if (is_array($layouts)) {
                $this->registerMailLayouts($layouts);
            }

            $templates = $pluginObj->registerMailTemplates();
            if (is_array($templates)) {
                $this->registerMailTemplates($templates);
            }

            $partials = $pluginObj->registerMailPartials();
            if (is_array($partials)) {
                $this->registerMailPartials($partials);
            }
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
     *     MailManager::registerCallback(function ($manager) {
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
