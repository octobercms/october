<?php namespace Backend\Widgets\Form;

use Site;
use Backend\Widgets\Form as FormWidget;
use SystemException;

/**
 * HasTranslatable adds translatable field popup support to the Form widget.
 * Clicking the globe icon shows a dropdown of available sites/locales, and
 * selecting one opens a popup to edit that single locale's field value.
 */
trait HasTranslatable
{
    /**
     * @var array translatableSitesCache keyed by filter type ('locale' or 'currency')
     */
    protected $translatableSitesCache = [];

    /**
     * onLoadTranslateField AJAX handler to open the translate popup for a single site
     */
    public function onLoadTranslateField()
    {
        $fieldName = post('field_name');
        $siteId = post('site_id');
        $field = $this->getField($fieldName);

        if (!$field) {
            throw new SystemException("Field [{$fieldName}] not found in form.");
        }

        if (!$field->translatable) {
            throw new SystemException("Field [{$fieldName}] is not translatable.");
        }

        $site = $this->getTranslatableSite($siteId);

        // Wrap the entire handler in site context so the form widget renders
        // with the correct site (and currency) active
        return Site::withContext($site->id, function () use ($field, $site) {
            $siteModel = $this->getTranslatableSiteModel($this->model, $site);
            $formWidget = $this->makeTranslateFormWidget($field, $siteModel, $site);

            $this->vars['translatableField'] = $field;
            $this->vars['translatableSite'] = $site;
            $this->vars['translatableFormWidget'] = $formWidget;
            $this->vars['translatableSessionKey'] = $this->getSessionKey();

            return $this->makePartial('translate_popup');
        });
    }

    /**
     * onSaveTranslateField AJAX handler to save a single site's translation
     */
    public function onSaveTranslateField()
    {
        if ($this->useTranslatable === false) {
            throw new SystemException("Translation is not enabled on this form.");
        }

        $fieldName = post('field_name');
        $siteId = post('site_id');
        $field = $this->getField($fieldName);

        if (!$field) {
            throw new SystemException("Field [{$fieldName}] not found in form.");
        }

        if (!$field->translatable) {
            throw new SystemException("Field [{$fieldName}] is not translatable.");
        }

        $model = $this->model;
        $site = $this->getTranslatableSite($siteId);

        // Only call hooks for the FormController widget
        $useSaveHooks = $this->controller->methodExists('formGetWidget') &&
            $this->controller->formGetWidget() === $this;

        Site::withContext($siteId, function () use ($model, $field, $site, $useSaveHooks) {
            $siteModel = $this->getTranslatableSiteModel($model, $site);
            $formWidget = $this->makeTranslateFormWidget($field, $siteModel, $site);
            $saveData = $formWidget->getSaveData();

            if ($useSaveHooks && $this->controller->methodExists('formBeforeSave')) {
                $this->controller->formBeforeSave($model);
            }

            $formWidget->performSaveOnModel($siteModel, $saveData, [
                'sessionKey' => $formWidget->getSessionKey(),
                'force' => true
            ]);

            if ($useSaveHooks && $this->controller->methodExists('formAfterSave')) {
                $this->controller->formAfterSave($model);
            }
        });
    }

    /**
     * bindTranslatableToController rebuilds the translate popup form when a request targets one of its widgets, so their AJAX handlers can run.
     */
    protected function bindTranslatableToController()
    {
        if ($this->useTranslatable === false || !$this->controller || !method_exists($this->controller, 'getAjaxHandler')) {
            return;
        }

        $siteId = post('site_id');
        $fieldName = post('field_name');
        $handler = (string) $this->controller->getAjaxHandler();
        if (!$siteId || !$fieldName || !str_starts_with($handler, $this->alias . 'TranslateField' . $siteId)) {
            return;
        }

        $field = $this->getField($fieldName);
        if (!$field || !$field->translatable) {
            return;
        }

        $site = $this->getTranslatableSite($siteId);

        Site::withContext($site->id, function () use ($field, $site) {
            $siteModel = $this->getTranslatableSiteModel($this->model, $site);
            $this->makeTranslateFormWidget($field, $siteModel, $site);
        });
    }

    /**
     * getTranslateSessionKey returns the deferred binding session key for a translate popup, kept apart from the main form and other sites.
     */
    protected function getTranslateSessionKey($site): string
    {
        return $this->getSessionKey() . 'TranslateField' . $site->id;
    }

    /**
     * getTranslatableSites returns available sites for translation or currency
     * override, excluding the current site. When a field is provided, the
     * filter type is determined per-field: currency fields show sites with
     * different currencies, while locale fields show sites with different locales.
     */
    public function getTranslatableSites($model, $field = null)
    {
        $cacheKey = $field && $field->translatable === 'currency' ? 'currency' : 'locale';

        if (array_key_exists($cacheKey, $this->translatableSitesCache)) {
            return $this->translatableSitesCache[$cacheKey];
        }

        $sites = Site::listEditEnabled();

        if ($cacheKey === 'currency') {
            // Currencyable: show other sites with a different currency
            $currentSiteId = Site::getEditSiteId();
            $currentCurrencyCode = Site::getEditSite()->hard_currency_code;
            $sites = $sites->filter(
                fn($site) =>
                    $site->id != $currentSiteId &&
                    $site->hard_currency_code !== $currentCurrencyCode
            );
        }
        else {
            $currentSiteId = Site::getEditSiteId();
            $sites = $sites->filter(fn($site) => $site->id != $currentSiteId);

            // Multisite: only show sites where a linked record exists
            if ($model->isClassInstanceOf(\October\Contracts\Database\MultisiteInterface::class) && $model->isMultisiteEnabled()) {
                $sites = $sites->filter(fn($site) => $model->findForSite($site->id) !== null);
            }
            // Translatable: only show sites with a different locale
            elseif ($model->isClassInstanceOf(\October\Contracts\Database\TranslatableInterface::class) && $model->isTranslatableEnabled()) {
                $currentLocale = Site::getEditSite()->hard_locale ?? null;
                $sites = $sites->filter(fn($site) => $site->hard_locale !== $currentLocale);
            }
        }

        return $this->translatableSitesCache[$cacheKey] = $sites->values();
    }

    /**
     * getTranslatableSite returns a single site definition by ID
     */
    protected function getTranslatableSite($siteId)
    {
        $sites = Site::listEditEnabled();

        $site = $sites->first(fn($site) => $site->id == $siteId);

        if (!$site) {
            throw new SystemException("Site [{$siteId}] not found.");
        }

        return $site;
    }

    /**
     * getTranslatableSiteModel returns the model for a specific site context
     */
    protected function getTranslatableSiteModel($model, $site)
    {
        if (!method_exists($model, 'isClassInstanceOf')) {
            return $model;
        }

        // Multisite: load the linked record for the target site
        if ($model->isClassInstanceOf(\October\Contracts\Database\MultisiteInterface::class) && $model->isMultisiteEnabled()) {
            return $model->findForSite($site->id) ?: $model;
        }

        // Translatable: set locale context on the same model
        if ($model->methodExists('setLocale')) {
            $model->setLocale($site->hard_locale);
        }
        elseif ($model->methodExists('translateContext')) {
            $model->translateContext($site->hard_locale);
        }

        // Currencyable: set currency context for the target site.
        // Always call setCurrency, even for primary sites (no currency_id)
        // so the model's cached context is reset from the current page's currency.
        if (
            $model->isClassInstanceOf(\October\Contracts\Database\CurrencyableInterface::class) &&
            $model->isCurrencyableEnabled()
        ) {
            $model->setCurrency($site->hard_currency_code);
        }

        return $model;
    }

    /**
     * makeTranslateFormWidget creates a Form widget instance for a single site/locale
     */
    protected function makeTranslateFormWidget($field, $siteModel, $site)
    {
        $config = $this->makeConfig();
        $config->model = $siteModel;
        $config->alias = $this->alias . 'TranslateField' . $site->id;
        $config->arrayName = 'TranslateField';
        $config->context = 'translate';
        $config->sessionKey = $this->getTranslateSessionKey($site);
        $config->isNested = true;
        $config->useTranslatable = false;
        $config->useFilterFields = false;
        $config->fields = [
            $field->fieldName => array_except(array_merge($field->config, [
                'type' => $field->config['widget'] ?? ($field->config['type'] ?? null),
                'required' => false,
                'span' => 'full'
            ]), ['value', 'arrayName', 'stretch', 'trigger'])
        ];

        $widget = $this->makeWidget(FormWidget::class, $config);
        $widget->bindToController();

        return $widget;
    }
}
