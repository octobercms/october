<?php namespace Backend\Behaviors\FormController;

use Backend;
use System\Classes\PluginManager;

/**
 * HasFormDesigns manages the form design system, resolving and applying
 * design behaviors to the controller based on the form configuration.
 */
trait HasFormDesigns
{
    /**
     * @var bool formDesignResolved tracks whether the form design has been resolved
     */
    protected $formDesignResolved = false;

    /**
     * @var string|null formDesignClass stores the resolved design class name
     */
    protected $formDesignClass;

    /**
     * isGlobalDesignMode returns true if the design must be resolved early
     * in beforeDisplay, before the form context is known. This is needed
     * for designs that provide AJAX handlers on the index action.
     */
    protected function isGlobalDesignMode(): bool
    {
        return $this->getConfig('design[displayMode]') === 'popup';
    }

    /**
     * getDesignDisplayMode returns the display mode taken from the form configuration,
     * defaults to `basic` display mode.
     */
    public function getDesignDisplayMode()
    {
        return $this->getDesignConfigValue('displayMode') ?: 'basic';
    }

    /**
     * getDesignConfigValue reads a design config value from the YAML config,
     * checking the context-specific value first, then falling back to the
     * global value.
     */
    protected function getDesignConfigValue(string $name, $default = null)
    {
        return $this->getConfig(
            "{$this->context}[design][{$name}]",
            $this->getConfig("design[{$name}]", $default)
        );
    }

    /**
     * getDesignFormSize returns the page size taken from the form configuration,
     * can also specify a custom configuration name, e.g. `sidebarSize`.
     */
    protected function getDesignFormSize($name = 'size')
    {
        $value = $this->getDesignConfigValue($name) ?: 'auto';

        return Backend::sizeToPixels($value) ?: null;
    }

    /**
     * getFormDesignObject returns the active form design behavior instance,
     * or null if no design is applied.
     */
    public function getFormDesignObject(): ?\Backend\Classes\FormDesignBase
    {
        if ($this->formDesignClass) {
            return $this->controller->getClassExtension($this->formDesignClass);
        }

        return null;
    }

    /**
     * getDesignBodyClass returns the body class from the active design behavior,
     * falls back to null if no design is applied.
     */
    public function getDesignBodyClass()
    {
        if ($designObj = $this->getFormDesignObject()) {
            return $designObj->getDesignBodyClass();
        }

        return null;
    }

    /**
     * formRenderDesignButtons renders the form buttons, delegated to the
     * active design behavior with a default fallback.
     */
    public function formRenderDesignButtons(): string
    {
        return $this->formMakePartial('buttons');
    }

    /**
     * formRenderDesignError renders the form error state, delegated to the
     * active design behavior with a default fallback.
     */
    public function formRenderDesignError(string $fatalError): string
    {
        return $this->formMakePartial('error', ['fatalError' => $fatalError]);
    }

    /**
     * renderDesignContent renders the form design content, delegated to the
     * active design behavior. Returns empty by default for custom mode.
     */
    public function renderDesignContent(array $options = []): string
    {
        return '';
    }

    /**
     * resolveFormDesign applies the appropriate form design behavior to the
     * controller based on the current context. Called from create/update/preview
     * actions after context is set.
     */
    protected function resolveFormDesign(): void
    {
        if ($this->formDesignResolved) {
            return;
        }

        $this->formDesignResolved = true;

        $displayMode = $this->getDesignDisplayMode();

        // Popup is already resolved in beforeDisplay, custom has no design
        if ($displayMode === 'custom' || $displayMode === 'popup') {
            return;
        }

        $this->applyFormDesign($displayMode);
    }

    /**
     * applyFormDesign resolves and applies a form design behavior to the controller
     */
    protected function applyFormDesign(string $displayMode): void
    {
        $designClass = $this->resolveFormDesignClass($displayMode);

        if ($designClass && class_exists($designClass)) {
            if (!$this->controller->isClassExtendedWith($designClass)) {
                $this->controller->extendClassWith($designClass);
            }

            $this->formDesignClass = $designClass;

            if ($designObj = $this->getFormDesignObject()) {
                $designObj->init();
            }
        }
    }

    /**
     * resolveFormDesignClass returns the class name for a given design code
     * by checking all registered form designs from plugins and modules.
     */
    protected function resolveFormDesignClass(string $code): ?string
    {
        $designs = PluginManager::instance()->getRegistrationMethodValues('registerFormDesigns');

        foreach ($designs as $pluginId => $pluginDesigns) {
            if (!is_array($pluginDesigns)) {
                continue;
            }

            foreach ($pluginDesigns as $className => $designCode) {
                if ($designCode === $code) {
                    return $className;
                }
            }
        }

        return null;
    }
}
