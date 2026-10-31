<?php namespace System\Classes;

/**
 * UiFactory creates view-based UI components.
 *
 * Usage:
 *
 *     <?= UiFactory::button(label: 'Save', primary: true) ?>
 *
 *     <?php UiFactory::card(title: 'Settings')->slot() ?>
 *         <p>Content</p>
 *     <?php UiFactory::end() ?>
 *
 * @package october\system
 * @author Alexey Bobkov, Samuel Georges
 */
class UiFactory
{
    use \System\Classes\UiFactory\HasInputs;
    use \System\Classes\UiFactory\HasButtons;

    /**
     * slot switches to a named slot on the current component
     */
    public static function slot(string $name): void
    {
        ViewComponent::captureSlot($name);
    }

    /**
     * end closes the current component and renders it
     */
    public static function end(): void
    {
        ViewComponent::endComponent();
    }

    /**
     * callout creates a callout, where the optional body is a string, closure or UI element
     */
    public static function callout($body = null)
    {
        return new \System\Classes\UiFactory\Migrate\Callout($body);
    }
}
