<?php namespace System\Classes\UiFactory;

use System\Classes\ViewComponent;

/**
 * HasInputs
 *
 * @package october\system
 * @author Alexey Bobkov, Samuel Georges
 */
trait HasInputs
{
    /**
     * searchInput creates a search input
     * @param string $name Input name
     * @param string $value Input value
     * @param string $placeholder Placeholder text
     * @param bool $handler AJAX handler
     */
    public static function searchInput(
        string $name = '',
        ?string $value = null,
        string $placeholder = '',
        string $handler = '',
        ...$attributes
    ): ViewComponent {
        return new ViewComponent('input.search-input', compact(
            'name',
            'value',
            'placeholder',
            'handler'
        ), $attributes);
    }
}
