<?php namespace Backend\Behaviors\FormController;

use SystemException;

/**
 * HasRenderers
 */
trait HasRenderers
{
    /**
     * formRenderField is a view helper to render a single form field.
     *
     *     <?= $this->formRenderField('field_name') ?>
     *
     * @param string $name Field name
     * @param array $options (e.g. ['useContainer'=>false])
     * @return string HTML markup
     */
    public function formRenderField($name, $options = [])
    {
        return $this->formWidget->renderField($name, $options);
    }

    /**
     * formRefreshFields is a view helper to render a field from AJAX based on their field names.
     * @param array|string $names
     */
    public function formRefreshFields($names): array
    {
        $result = [];

        foreach ((array) $names as $name) {
            if (!$fieldObject = $this->formWidget->getField($name)) {
                throw new SystemException("Field {$name} was not found in the form definitions.");
            }

            $result['#' . $fieldObject->getId('group')] = $this->formRenderField($name, ['useContainer' => false]);
        }

        return $result;
    }

    /**
     * formRenderPreview is a view helper to render the form in preview mode.
     *
     *     <?= $this->formRenderPreview() ?>
     *
     * @return string The form HTML markup.
     */
    public function formRenderPreview()
    {
        return $this->formWidget->render(['preview' => true]);
    }

    /**
     * formHasOutsideFields is a view helper to check if a form tab has fields in the
     * non-tabbed section (outside fields).
     *
     *     <?php if ($this->formHasOutsideFields()): ?>
     *         <!-- Do something -->
     *     <?php endif ?>
     *
     * @return bool
     */
    public function formHasOutsideFields()
    {
        return $this->formWidget->getTab('outside')->hasFields();
    }

    /**
     * formRenderOutsideFields is a view helper to render the form fields belonging to the
     * non-tabbed section (outside form fields).
     *
     *     <?= $this->formRenderOutsideFields() ?>
     *
     * @return string HTML markup
     */
    public function formRenderOutsideFields($options = [])
    {
        return $this->formWidget->render(['section' => 'outside'] + $options);
    }

    /**
     * formHasPrimaryTabs is a view helper to check if a form tab has fields in the
     * primary tab section.
     *
     *     <?php if ($this->formHasPrimaryTabs()): ?>
     *         <!-- Do something -->
     *     <?php endif ?>
     *
     * @return bool
     */
    public function formHasPrimaryTabs()
    {
        return $this->formWidget->getTab('primary')->hasFields();
    }

    /**
     * formRenderPrimaryTabs is a view helper to render the form fields belonging to the
     * primary tabs section.
     *
     *     <?= $this->formRenderPrimaryTabs() ?>
     *
     * @return string HTML markup
     */
    public function formRenderPrimaryTabs($options = [])
    {
        return $this->formWidget->render(['section' => 'primary'] + $options);
    }

    /**
     * formRenderPrimaryTab renders the contents of a primary tab
     */
    public function formRenderPrimaryTab($tabName, $options = [])
    {
        return $this->formWidget->renderTab($tabName, $options);
    }

    /**
     * formHasSecondaryTabs is a view helper to check if a form tab has fields in the
     * secondary tab section.
     *
     *     <?php if ($this->formHasSecondaryTabs()): ?>
     *         <!-- Do something -->
     *     <?php endif ?>
     *
     * @return bool
     */
    public function formHasSecondaryTabs()
    {
        return $this->formWidget->getTab('secondary')->hasFields();
    }

    /**
     * formRenderSecondaryTabs is a view helper to render the form fields belonging to the
     * secondary tabs section.
     *
     *     <?= $this->formRenderPrimaryTabs() ?>
     *
     * @return string HTML markup
     */
    public function formRenderSecondaryTabs($options = [])
    {
        return $this->formWidget->render(['section' => 'secondary'] + $options);
    }

    /**
     * formRenderSecondaryTab renders the contents of a secondary tab
     */
    public function formRenderSecondaryTab($tabName, $options = [])
    {
        return $this->formWidget->renderTab($tabName, ['secondaryTab' => true] + $options);
    }
}
