<?php namespace System\Classes\MailManager;

use App;
use Site;
use View;
use Config;

/**
 * HasMailLocale resolves the locale for mail messages, translating templates,
 * layouts and partials from stored translations and localized view files.
 *
 * @package october\system
 * @author Alexey Bobkov, Samuel Georges
 */
trait HasMailLocale
{
    use \Illuminate\Support\Traits\Localizable;

    /**
     * @var string|null renderLocale is the locale used for the current render.
     */
    protected $renderLocale;

    /**
     * getMailLocale returns the target locale for a mail message, or null when
     * translation is disabled.
     * @param array $data
     * @return string|null
     */
    protected function getMailLocale($data): ?string
    {
        if (!Config::get('multisite.translate.system_mail_templates', true)) {
            return null;
        }

        $locale = $data['_current_locale'] ?? null;

        if (is_string($locale) && strlen($locale)) {
            return $locale;
        }

        return App::getLocale();
    }

    /**
     * localizeMailTemplate applies a locale to a resolved template, refilling from a
     * localized view file when available and applying stored translations, which take
     * precedence over view files.
     * @param \System\Models\MailTemplate|null $template
     * @param string $code
     * @param string|null $locale
     */
    protected function localizeMailTemplate($template, $code, $locale): void
    {
        if (!$template || !$locale) {
            return;
        }

        if (!$template->is_custom) {
            $view = $this->getViewPathForTemplate($code) ?: $code;
            if ($localizedView = $this->findLocalizedView($view, $locale)) {
                $template->fillFromView($localizedView);
            }
        }

        $this->applyTranslateContext($template, $locale);
        $this->applyTranslateContext($template->layout, $locale);
    }

    /**
     * localizeMailPartial applies a locale to a resolved partial, mirroring the
     * template rules where stored translations take precedence over view files.
     * @param \System\Models\MailPartial $partial
     * @param string $code
     * @param string|null $locale
     */
    protected function localizeMailPartial($partial, $code, $locale): void
    {
        if (!$locale) {
            return;
        }

        if (!$partial->is_custom) {
            $view = array_get($this->listRegisteredPartials(), $code);
            if ($view && ($localizedView = $this->findLocalizedView($view, $locale))) {
                $partial->fillFromView($localizedView);
            }
        }

        $this->applyTranslateContext($partial, $locale);
    }

    /**
     * findLocalizedView returns a localized view name resolved from a locale
     * subdirectory (mail.welcome gives mail.fr.welcome), or null when none exists.
     * @param string $view
     * @param string|null $locale
     * @return string|null
     */
    public function findLocalizedView(string $view, ?string $locale = null): ?string
    {
        if (!Config::get('multisite.translate.system_mail_templates', true)) {
            return null;
        }

        $locale = $locale ?: App::getLocale();
        if (!$locale) {
            return null;
        }

        foreach (Site::getLocaleKeyChain($locale) as $localeKey) {
            $candidate = $this->makeLocalizedViewName($view, $localeKey);
            if (View::exists($candidate)) {
                return $candidate;
            }
        }

        return null;
    }

    /**
     * makeLocalizedViewName inserts a locale segment before the final view name,
     * preserving any view namespace.
     */
    protected function makeLocalizedViewName(string $view, string $locale): string
    {
        $namespace = '';
        if (($nsPosition = strpos($view, '::')) !== false) {
            $namespace = substr($view, 0, $nsPosition + 2);
            $view = substr($view, $nsPosition + 2);
        }

        if (($position = strrpos($view, '.')) !== false) {
            return $namespace.substr($view, 0, $position).'.'.$locale.substr($view, $position);
        }

        return $namespace.$locale.'.'.$view;
    }

    /**
     * applyTranslateContext sets the locale context on a translatable model using the
     * locale key chain, always resetting the context to avoid reusing a stale locale.
     * @param mixed $model
     * @param string|null $locale
     */
    protected function applyTranslateContext($model, $locale): void
    {
        if (
            !$locale ||
            !$model ||
            !$model->exists ||
            !$model->isClassInstanceOf(\October\Contracts\Database\TranslatableInterface::class)
        ) {
            return;
        }

        foreach (Site::getLocaleKeyChain($locale) as $localeKey) {
            if ($model->hasTranslations($localeKey)) {
                $model->setLocale($localeKey);
                return;
            }
        }

        $model->setLocale($locale);
    }
}
