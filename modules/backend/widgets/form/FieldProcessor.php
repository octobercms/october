<?php namespace Backend\Widgets\Form;

use BackendAuth;
use Backend\Classes\FormTabs;
use October\Rain\Html\Helper as HtmlHelper;

/**
 * FieldProcessor concern
 */
trait FieldProcessor
{
    /**
     * processAutoOrder applies a default sort order to all fields
     */
    protected function processAutoOrder(FormTabs $tabs)
    {
        // Apply incremental default orders
        $orderCount = 0;
        foreach ($tabs->getFields() as $fields) {
            foreach ($fields as $field) {
                if ($field->order !== -1) {
                    continue;
                }
                $field->order = ($orderCount += 100);
            }
        }

        // Sort fields internally
        $tabs->sortAllFields();
    }

    /**
     * processAutoSpan converts fields with a span set to 'auto' as either
     * 'left' or 'right' depending on the previous field.
     */
    protected function processAutoSpan(FormTabs $tabs)
    {
        $prevSpan = null;

        foreach ($tabs->getFields() as $fields) {
            foreach ($fields as $field) {
                // Auto sizing
                if (strtolower($field->span) === 'auto') {
                    if ($prevSpan === 'left') {
                        $field->span = 'right';
                    }
                    else {
                        $field->span = 'left';
                    }
                }

                $prevSpan = $field->span;

                // Adaptive sizing
                if (strtolower($field->span) === 'adaptive') {
                    $field->size = 'adaptive';
                    $field->stretch = true;
                    $tabs->stretch = true;
                    $tabs->addAdaptive($field->tab ?: $tabs->defaultTab);
                }
            }
        }
    }

    /**
     * processPermissionCheck check if user has permissions to show the field
     * and removes it if permission is denied
     */
    protected function processPermissionCheck(array $fields)
    {
        foreach ($fields as $fieldName => $field) {
            if (
                $field->permissions &&
                !BackendAuth::userHasAccess($field->permissions, false)
            ) {
                $this->removeField($fieldName);
            }
        }
    }

    /**
     * processFormWidgetFields will mutate fields types that are registered as widgets,
     * convert their type to 'widget' and internally allocate the widget object
     */
    protected function processFormWidgetFields(array $fields)
    {
        foreach ($fields as $field) {
            if (!$this->isFormWidget((string) $field->type)) {
                continue;
            }

            $newConfig = ['widget' => $field->type];

            if (is_array($field->config)) {
                $newConfig += $field->config;
            }

            $field->useConfig($newConfig)->displayAs('widget');

            // Create form widget instance and bind to controller
            $this->makeFormFieldWidget($field)->bindToController();
        }
    }

    /**
     * processValidationAttributes applies the field name to the validation engine
     */
    protected function processValidationAttributes(array $fields)
    {
        if (!$this->model || !method_exists($this->model, 'setValidationAttributeName')) {
            return;
        }

        foreach ($fields as $field) {
            $this->model->setValidationAttributeName(
                HtmlHelper::nameToDot($field->fieldName),
                $field->label
            );
        }
    }

    /**
     * processFieldOptionValues sets the callback for retrieving options
     * from fields that specifically require it
     */
    protected function processFieldOptionValues(array $fields)
    {
        // Fields that demand options
        $requiredTypes = [
            'dropdown',
            'radio',
            'checkboxlist',
            'balloon-selector'
        ];

        foreach ($fields as $field) {
            if (!in_array($field->type, $requiredTypes, false)) {
                continue;
            }

            // Specified explicitly on the object already
            if ($field->hasOptions()) {
                continue;
            }

            // If options are defined by config but are in an unusable state
            $fieldOptions = $field->optionsPreset
                ? 'preset:' . $field->optionsPreset
                : ($field->optionsMethod ?: $field->options);

            // Defer the execution of option data collection
            $field->options(function () use ($field, $fieldOptions) {
                return $field->getOptionsFromModel($this->model, $fieldOptions, $this->data);
            });
        }
    }

    /**
     * processRequiredAttributes will set the required flag based on the model preference
     */
    protected function processRequiredAttributes(array $fields)
    {
        if (!$this->model->isClassInstanceOf(\October\Contracts\Database\ValidationInterface::class)) {
            return;
        }

        if (!$this->model || !method_exists($this->model, 'isAttributeRequired')) {
            return;
        }

        foreach ($fields as $field) {
            if ($field->required !== null) {
                continue;
            }

            $field->required = $this->model->isAttributeRequired(
                HtmlHelper::nameToDot($field->fieldName)
            );
        }
    }

    /**
     * processTranslatableAttributes will set the translatable flag based on the model preference
     */
    protected function processTranslatableAttributes(array $fields)
    {
        if ($this->useTranslatable === false) {
            return;
        }

        if (!$this->model) {
            return;
        }

        // Multisite trait: non-propagatable attributes are translatable
        if (
            $this->model->isClassInstanceOf(\October\Contracts\Database\MultisiteInterface::class) &&
            $this->model->isMultisiteSyncEnabled()
        ) {
            foreach ($fields as $field) {
                if ($field->translatable !== null) {
                    continue;
                }

                $attrName = HtmlHelper::nameToDot($field->fieldName);
                if (!$this->model->isAttributePropagatable($attrName)) {
                    $field->translatable = true;
                }
            }
        }

        // Translatable trait: attributes listed in $translatable are translatable
        if (
            $this->model->isClassInstanceOf(\October\Contracts\Database\TranslatableInterface::class) &&
            $this->model->isTranslatableEnabled()
        ) {
            $translatableAttrs = $this->model->getTranslatableAttributes();

            foreach ($fields as $field) {
                if ($field->translatable !== null) {
                    continue;
                }

                $attrName = HtmlHelper::nameToDot($field->fieldName);
                if (in_array($attrName, $translatableAttrs)) {
                    $field->translatable = true;
                }
            }
        }

        // Currencyable trait: attributes listed in $currencyable.
        // Only show the globe icon for existing records since overrides
        // are stored in a sidecar table that requires a saved record.
        if (
            $this->model->exists &&
            $this->model->isClassInstanceOf(\October\Contracts\Database\CurrencyableInterface::class) &&
            $this->model->isCurrencyableEnabled()
        ) {
            $currencyableAttrs = $this->model->getCurrencyableAttributes();

            foreach ($fields as $field) {
                if ($field->translatable !== null) {
                    continue;
                }

                $attrName = HtmlHelper::nameToDot($field->fieldName);
                if (in_array($attrName, $currencyableAttrs)) {
                    $field->translatable = 'currency';
                }
            }
        }
    }
}
