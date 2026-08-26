<?php namespace System\Classes;

use App;
use Arr;
use System;
use Markdown;
use System\Models\MailPartial;
use System\Models\MailTemplate;
use System\Models\MailBrandSetting;
use System\Helpers\View as ViewHelper;
use TijsVerkoyen\CssToInlineStyles\CssToInlineStyles;

/**
 * MailManager manages Mail sending functions
 *
 * @package october\system
 * @author Alexey Bobkov, Samuel Georges
 */
class MailManager
{
    use \System\Classes\MailManager\HasMailLocale;

    /**
     * @var array A cache of customized mail templates.
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
     * instance creates a new instance of this singleton
     */
    public static function instance(): static
    {
        return App::make('system.mailer');
    }

    /**
     * registerCallback registers a callback function that defines mail templates.
     * The callback function should register templates by calling the manager's
     * registerMailTemplates() function. Thi instance is passed to the
     * callback function as an argument. Usage:
     *
     *     MailManager::registerCallback(function ($manager) {
     *         $manager->registerMailTemplates([...]);
     *     });
     *
     * @deprecated this will be removed in a later version
     * @param callable $callback A callable function.
     */
    public static function registerCallback(callable $callback)
    {
        App::extendInstance('system.mailer', $callback);
    }

    /**
     * addContentFromEvent handles adding content from the `mailer.beforeAddContent` event
     */
    public function addContentFromEvent($message, $view = null, $plain = null, $raw = null, $data = [])
    {
        // Dual views have been supplied, this is Laravel implementation
        if ($view !== null && $plain !== null) {
            return false;
        }

        // When "plain-text only" email is sent, $view is null, this sets the flag appropriately
        $plainOnly = $view === null;

        if ($raw === null) {
            return $this->addContentToMailer($message, $view ?: $plain, $data, $plainOnly);
        }
        else {
            return $this->addRawContentToMailer($message, $raw, $data, $plainOnly);
        }
    }

    /**
     * addRawContentToMailer is the same as `addContentToMailer` except with raw content
     *
     * @return bool
     */
    public function addRawContentToMailer($message, $content, $data)
    {
        $template = new MailTemplate;

        $template->fillFromContent($content);

        $this->addContentToMailerInternal($message, $template, $data);

        return true;
    }

    /**
     * addContentToMailer function hijacks the `addContent` method of the
     * `October\Rain\Mail\Mailer` class, using the `mailer.beforeAddContent` event.
     *
     * @param \Illuminate\Mail\Message $message
     * @param string $code
     * @param array $data
     * @param bool $plainOnly Add only plain text content to the message
     * @return bool
     */
    public function addContentToMailer($message, $code, $data, $plainOnly = false)
    {
        if (!is_string($code)) {
            return false;
        }

        $locale = $this->getMailLocale($data);

        return $this->withLocale($locale, function () use ($message, $code, $data, $plainOnly, $locale) {
            $cacheKey = $locale ? "{$code}:{$locale}" : $code;

            if (isset($this->templateCache[$cacheKey])) {
                $template = $this->templateCache[$cacheKey];
            }
            else {
                $this->templateCache[$cacheKey] = $template = MailTemplate::findOrMakeTemplate($code);
                $this->localizeMailTemplate($template, $code, $locale);
            }

            if (!$template) {
                return false;
            }

            $lastRenderLocale = $this->renderLocale;

            try {
                $this->renderLocale = $locale;
                $this->addContentToMailerInternal($message, $template, $data, $plainOnly);
            }
            finally {
                $this->renderLocale = $lastRenderLocale;
            }

            return true;
        });
    }

    /**
     * addContentToMailerInternal is an internal method used to share logic
     * between `addRawContentToMailer` and `addContentToMailer`
     *
     * @param \Illuminate\Mail\Message $message
     * @param MailTemplate $template
     * @param array $data
     * @param bool $plainOnly Add only plain text content to the message
     * @return void
     */
    protected function addContentToMailerInternal($message, $template, $data, $plainOnly = false)
    {
        // Inject global view variables
        $globalVars = ViewHelper::getGlobalVars();
        if (!empty($globalVars)) {
            $data = (array) $data + $globalVars;
        }

        // Subject
        $sMessage = $message->getSymfonyMessage();

        if (empty($sMessage->getSubject())) {
            $message->subject($this->parseTwig($template->subject, $data));
        }

        $data += [
            'subject' => $sMessage->getSubject()
        ];

        // HTML contents
        if (!$plainOnly) {
            $html = $this->renderTemplate($template, $data);

            $message->html($html);
        }

        // Text contents
        $text = $this->renderTextTemplate($template, $data);

        $message->text($text);
    }

    //
    // Rendering
    //

    /**
     * render the Markdown template into HTML
     * @param  string  $content
     * @param  array  $data
     * @return string
     */
    public function render($content, $data = [])
    {
        if (!$content) {
            return '';
        }

        $html = $this->parseTwig($content, $data);

        $html = Markdown::parseIndent($html);

        return $html;
    }

    /**
     * renderTemplate
     */
    public function renderTemplate($template, $data = [])
    {
        $this->isHtmlRenderMode = true;

        $html = $this->render($template->content_html, $data);

        $disableAutoInlineCss = false;
        $brandCss = MailBrandSetting::renderCss($template, $data);
        $css = '';

        // Parse template layout
        if ($template->layout && $template->layout->content_html) {
            // Disable inline CSS
            if (array_get($template->layout->options, 'disable_auto_inline_css', false)) {
                $disableAutoInlineCss = true;
            }

            // Disable branding CSS
            if (array_get($template->layout->options, 'disable_brand_css', false)) {
                $brandCss = '';
            }

            $css = $template->layout->content_css;
            $html = $this->parseTwig($template->layout->content_html, [
                'content' => $html,
                'css' => $css,
                'brandCss' => $brandCss
            ] + (array) $data);
        }

        if (!$disableAutoInlineCss) {
            $html = (new CssToInlineStyles)->convert($html, $brandCss . PHP_EOL . $css);
        }

        return $html;
    }

    /**
     * renderText renders the Markdown template into text.
     * @param $content
     * @param array $data
     * @return string
     */
    public function renderText($content, $data = [])
    {
        if (!$content) {
            return '';
        }

        $text = $this->parseTwig($content, $data);

        $text = html_entity_decode(preg_replace("/[\r\n]{2,}/", "\n\n", $text), ENT_QUOTES, 'UTF-8');

        return $text;
    }

    /**
     * renderTextTemplate
     */
    public function renderTextTemplate($template, $data = [])
    {
        $this->isHtmlRenderMode = false;

        $templateText = $template->content_text ?: $template->content_html;

        $text = $this->renderText($templateText, $data);

        if ($template->layout && $template->layout->content_text) {
            $text = $this->parseTwig($template->layout->content_text, [
                'content' => $text
            ] + (array) $data);
        }

        return $text;
    }

    /**
     * renderPartial
     */
    public function renderPartial($code, array $params = [])
    {
        if (!$partial = MailPartial::findOrMakePartial($code)) {
            return '<!-- Missing partial: '.$code.' -->';
        }

        $this->localizeMailPartial($partial, $code, $this->renderLocale);

        if ($this->isHtmlRenderMode) {
            $content = $partial->content_html;
        }
        else {
            $content = $partial->content_text ?: $partial->content_html;
        }

        if (!strlen(trim($content))) {
            return '';
        }

        return $this->parseTwig($content, $params);
    }

    /**
     * parseTwig parses Twig using the mailer environment
     */
    protected function parseTwig($contents, $vars = [])
    {
        $twig = App::make('twig.environment.mailer');
        $template = $twig->createTemplate($contents);
        return $template->render($vars);
    }

    //
    // Registration
    //

    /**
     * loadRegisteredTemplates loads registered mail templates from modules and plugins
     * @return void
     */
    public function loadRegisteredTemplates()
    {
        // Registration logic
        $registrar = function($provider) {
            if (is_array($templates = $provider->registerMailTemplates())) {
                if (isset($templates['templates'])) {
                    $this->registerMailTemplates($templates['templates']);
                    if (is_array($partials = $templates['partials'] ?? null)) {
                        $this->registerMailPartials($partials);
                    }
                    if (is_array($layouts = $templates['layouts'] ?? null)) {
                        $this->registerMailLayouts($layouts);
                    }
                }
                else {
                    $this->registerMailTemplates($templates);
                }
            }

            if (is_array($layouts = $provider->registerMailLayouts())) {
                $this->registerMailLayouts($layouts);
            }

            if (is_array($partials = $provider->registerMailPartials())) {
                $this->registerMailPartials($partials);
            }
        };

        // Load module items
        foreach (System::listModules() as $module) {
            if ($provider = App::getProvider($module . '\\ServiceProvider')) {
                $registrar($provider);
            }
        }

        // Load plugin widgets
        foreach (PluginManager::instance()->getPlugins() as $pluginObj) {
            $registrar($pluginObj);
        }

        // Load app widgets
        if ($app = App::getProvider(\App\Provider::class)) {
            $registrar($app);
        }
    }

    /**
     * listRegisteredTemplates returns a list of the registered templates.
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
     * getViewPathForTemplate returns a view path for a registered template
     */
    public function getViewPathForTemplate($code): ?string
    {
        if ($this->registeredTemplates === null) {
            $this->loadRegisteredTemplates();
        }

        return $this->registeredTemplates[$code] ?? null;
    }

    /**
     * listRegisteredPartials returns a list of the registered partials.
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
     * listRegisteredLayouts returns a list of the registered layouts.
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
     * registerMailTemplates registers mail views and manageable templates.
     */
    public function registerMailTemplates(array $definitions)
    {
        if (!$this->registeredTemplates) {
            $this->registeredTemplates = [];
        }

        if (Arr::isList($definitions)) {
            $definitions = array_combine($definitions, $definitions);
        }

        $this->registeredTemplates = $definitions + $this->registeredTemplates;
    }

    /**
     * registerMailPartials registers mail views and manageable layouts.
     */
    public function registerMailPartials(array $definitions)
    {
        if (!$this->registeredPartials) {
            $this->registeredPartials = [];
        }

        $this->registeredPartials = $definitions + $this->registeredPartials;
    }

    /**
     * registerMailLayouts registers mail views and manageable layouts.
     */
    public function registerMailLayouts(array $definitions)
    {
        if (!$this->registeredLayouts) {
            $this->registeredLayouts = [];
        }

        $this->registeredLayouts = $definitions + $this->registeredLayouts;
    }
}
