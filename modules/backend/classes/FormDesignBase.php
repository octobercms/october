<?php namespace Backend\Classes;

use Backend;

/**
 * FormDesignBase is a base class for form design behaviors that control
 * how backend forms are displayed. Each form design is a controller behavior
 * applied via extendClassWith() that provides rendering, assets, and AJAX
 * handlers for a specific form layout.
 *
 * @package october\backend
 * @author Alexey Bobkov, Samuel Georges
 */
abstract class FormDesignBase extends ControllerBehavior
{
    /**
     * @var array actions visible in context of the controller
     */
    protected $actions = [];

    /**
     * init is called after the design behavior is applied to the controller.
     * Override to register assets, Vue components, or perform other setup.
     */
    public function init(): void
    {
    }

    /**
     * getFormController returns the FormController behavior instance
     */
    protected function getFormController(): \Backend\Behaviors\FormController
    {
        return $this->controller->asExtension('FormController');
    }

    /**
     * renderDesignContent renders the form design layout content. The controller
     * can override the design partial by providing a `_form_mode_{code}.php`
     * partial in its views directory, e.g. `_form_mode_document.php`.
     */
    public function renderDesignContent(array $options = []): string
    {
        $displayMode = $this->getFormController()->getDesignDisplayMode();
        $params = ['options' => $options];

        $contents = $this->controller->makePartial('form_mode_'.$displayMode, $params, false);
        if (!$contents) {
            $contents = $this->makePartial('mode', $params);
        }

        return $contents;
    }

    /**
     * formRenderDesignButtons renders the buttons for this design
     */
    public function formRenderDesignButtons(): string
    {
        return $this->getFormController()->formMakePartial('buttons');
    }

    /**
     * formRenderDesignError renders the error state for this design
     */
    public function formRenderDesignError(string $fatalError): string
    {
        return $this->getFormController()->formMakePartial('error', [
            'fatalError' => $fatalError
        ]);
    }

    /**
     * extendFormWidgetConfig allows the design to modify the form widget
     * configuration before the widget is created, e.g. to enable
     * horizontal mode or survey mode.
     */
    public function extendFormWidgetConfig(object $config): void
    {
    }

    /**
     * getDesignBodyClass returns a CSS class for the page body
     */
    public function getDesignBodyClass(): ?string
    {
        return null;
    }

    /**
     * getDesignSecondaryLabel returns the label for the secondary fields popover
     */
    public function getDesignSecondaryLabel(): string
    {
        return __("Options");
    }

    /**
     * getDesignFormSize returns the page size taken from the form configuration,
     * can also specify a custom configuration name, e.g. `sidebarSize`
     */
    public function getDesignFormSize($name = 'size')
    {
        $value = $this->getDesignConfig($name) ?: 'auto';

        return Backend::sizeToPixels($value) ?: null;
    }

    /**
     * getDesignConfig reads a design config value from the FormController YAML config,
     * checking the context-specific value first, then falling back to the global value
     */
    protected function getDesignConfig(string $name, $default = null)
    {
        $fc = $this->getFormController();
        $context = $fc->formGetContext();

        return $fc->getConfig(
            "{$context}[design][{$name}]",
            $fc->getConfig("design[{$name}]", $default)
        );
    }
}
