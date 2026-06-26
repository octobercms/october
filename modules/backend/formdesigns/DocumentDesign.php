<?php namespace Backend\FormDesigns;

use Backend\Classes\FormDesignBase;

/**
 * DocumentDesign displays a form with a Vue.js document editor toolbar,
 * primary tabs below, and a secondary fields popover button.
 *
 * @package october\backend
 * @author Alexey Bobkov, Samuel Georges
 */
class DocumentDesign extends FormDesignBase
{
    /**
     * init registers the required assets and Vue components
     */
    public function init(): void
    {
        $this->addJs('/modules/backend/behaviors/formcontroller/assets/js/vue-document-form.js', ['type' => 'module']);
        $this->controller->registerVueComponent(\Backend\VueComponents\Document::class);
        $this->controller->registerVueComponent(\Backend\VueComponents\Popover::class);
    }

    /**
     * formRenderDesignButtons renders document-specific buttons
     */
    public function formRenderDesignButtons(): string
    {
        return $this->makePartial('buttons');
    }

    /**
     * getDesignBodyClass returns `compact-container` for the document layout
     */
    public function getDesignBodyClass(): ?string
    {
        return 'compact-container';
    }

    /**
     * getDesignSecondaryLabel returns the label for the secondary
     * fields popover button
     */
    public function getDesignSecondaryLabel(): string
    {
        return $this->getDesignConfig('secondaryLabel') ?: __("Options");
    }
}
