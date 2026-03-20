<?php namespace System\Classes\UiFactory;

use System\Classes\ViewComponent;

/**
 * HasButtons
 *
 * @package october\system
 * @author Alexey Bobkov, Samuel Georges
 */
trait HasButtons
{
    /**
     * button creates a button component
     * @param string $label Button label
     * @param string $href Link URL (optional)
     * @param string $icon Icon class
     * @param bool $primary Primary styling
     * @param bool $secondary Secondary styling
     */
    public static function button(
        string $_migrate = '',
        string $label = '',
        string $href = '',
        string $icon = '',
        bool $primary = false,
        bool $secondary = false,
        bool $danger = false,
        string|array $hotkey = '',
        ...$attributes
    ): ViewComponent|\System\Classes\UiFactory\Migrate\Button {
        if ($_migrate !== '') {
            return new \System\Classes\UiFactory\Migrate\Button($_migrate, $label);
        }

        return new ViewComponent('button', compact(
            'label',
            'href',
            'icon',
            'primary',
            'secondary',
            'danger',
            'hotkey'
        ), $attributes);
    }

    /**
     * popupButton creates a popup button component
     *
     * @param string $label Button label
     * @param string $handler AJAX handler for the popup contents
     * @param string $icon Icon class
     * @param bool $primary Primary styling
     * @param bool $secondary Secondary styling
     * @param array $requestData Request data to pass with the AJAX request
     */
    public static function popupButton(
        string $_migrate = '',
        string $label = '',
        string $handler = '',
        string $icon = '',
        bool $primary = false,
        bool $secondary = false,
        bool $danger = false,
        string|array $hotkey = '',
        array $requestData = [],
        ...$attributes
    ): ViewComponent|\System\Classes\UiFactory\Migrate\PopupButton {
        if ($_migrate !== '') {
            return new \System\Classes\UiFactory\Migrate\PopupButton($_migrate, $label);
        }

        return new ViewComponent('button.popup-button', compact(
            'label',
            'handler',
            'icon',
            'primary',
            'secondary',
            'danger',
            'hotkey',
            'requestData'
        ), $attributes);
    }

    /**
     * ajaxButton creates an AJAX button component
     *
     * @param string $label Button label
     * @param string $handler AJAX handler to associate to the button
     * @param string $icon Icon class
     * @param bool $primary Primary styling
     * @param bool $secondary Secondary styling
     * @param array $requestData Request data to pass with the AJAX request
     */
    public static function ajaxButton(
        string $_migrate = '',
        string $label = '',
        string $handler = '',
        string $icon = '',
        bool $primary = false,
        bool $secondary = false,
        bool $danger = false,
        string|array $hotkey = '',
        array $requestData = [],
        ...$attributes
    ): ViewComponent|\System\Classes\UiFactory\Migrate\AjaxButton {
        if ($_migrate !== '') {
            return new \System\Classes\UiFactory\Migrate\AjaxButton($_migrate, $label);
        }

        return new ViewComponent('button.ajax-button', compact(
            'label',
            'handler',
            'icon',
            'primary',
            'secondary',
            'danger',
            'hotkey',
            'requestData'
        ), $attributes);
    }

    /**
     * iconButton creates an icon-only button component
     *
     * @param string $label Accessible label (renders as title attribute)
     * @param string $icon Icon class (applied to the element, not as a child)
     * @param string $handler AJAX handler (optional)
     * @param bool $danger Danger hover styling
     */
    public static function iconButton(
        string $label = '',
        string $icon = '',
        string $handler = '',
        bool $danger = false,
        string|array $hotkey = '',
        ...$attributes
    ): ViewComponent {
        return new ViewComponent('button.icon-button', compact(
            'label',
            'icon',
            'handler',
            'danger',
            'hotkey'
        ), $attributes);
    }

    /**
     * dropdownButton creates a dropdown button component (slot-based)
     *
     * Usage:
     *     <?php Ui::dropdownButton(label: 'Actions', secondary: true)->slot() ?>
     *         <?= Ui::dropdownItem(label: 'Edit', handler: 'onEdit') ?>
     *     <?php Ui::end() ?>
     *
     * @param string $label Button label
     * @param string $icon Icon class
     * @param bool $primary Primary styling
     * @param bool $secondary Secondary styling
     * @param bool $caret Show dropdown caret arrow
     */
    public static function dropdownButton(
        string $label = '',
        string $icon = '',
        bool $primary = false,
        bool $secondary = false,
        bool $caret = true,
        ...$attributes
    ): ViewComponent {
        return new ViewComponent('button.dropdown-button', compact(
            'label',
            'icon',
            'primary',
            'secondary',
            'caret'
        ), $attributes);
    }

    /**
     * dropdownItem creates a dropdown menu item component
     *
     * @param string $label Item label
     * @param string $handler AJAX handler (optional)
     * @param string $href Link URL (optional)
     * @param string $icon Icon class (optional)
     */
    public static function dropdownItem(
        string $label = '',
        string $handler = '',
        string $href = '',
        string $icon = '',
        ...$attributes
    ): ViewComponent {
        return new ViewComponent('button.dropdown-item', compact(
            'label',
            'handler',
            'href',
            'icon'
        ), $attributes);
    }

    /**
     * dropdownDivider creates a dropdown menu separator
     */
    public static function dropdownDivider(): ViewComponent
    {
        return new ViewComponent('button.dropdown-divider');
    }
}
