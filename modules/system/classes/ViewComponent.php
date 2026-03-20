<?php namespace System\Classes;

use Illuminate\Support\Str;
use Illuminate\View\ComponentAttributeBag;
use Illuminate\Support\Facades\View;

/**
 * ViewComponent is a lightweight component that renders from a view file.
 *
 * Supports inline rendering and slot-based content capture:
 *
 *     <?= UiFactory::button(label: 'Save') ?>
 *
 *     <?php UiFactory::card(title: 'Hey')->slot() ?>
 *         <p>Content</p>
 *     <?php UiFactory::end() ?>
 *
 * @package october\system
 * @author Alexey Bobkov, Samuel Georges
 */
class ViewComponent
{
    /**
     * @var string name of the component
     */
    protected string $name;

    /**
     * @var array props passed to the component view
     */
    protected array $props = [];

    /**
     * @var array attributes passed through to the AttributeBag
     */
    protected array $attributes = [];

    /**
     * @var array slots captured content keyed by slot name
     */
    protected array $slots = [];

    /**
     * @var string|null currentSlot being captured
     */
    protected ?string $currentSlot = null;

    /**
     * @var array stack of active components for nesting support
     */
    protected static array $stack = [];
    /**
     * __construct
     */
    public function __construct(string $name, array $props = [], array $attributes = [])
    {
        $this->name = $name;
        $this->props = $props;
        $this->attributes = $attributes;
    }

    /**
     * slot starts capturing content for a named slot
     */
    public function slot(string $name = 'default'): void
    {
        ob_start();
        $this->currentSlot = $name;
        static::$stack[] = $this;
    }

    /**
     * captureSlot switches to a new named slot, closing the previous one
     */
    public static function captureSlot(string $name): void
    {
        $instance = end(static::$stack);

        if ($instance === false) {
            throw new \RuntimeException("Cannot capture slot '{$name}': no active component.");
        }

        // Close previous slot
        if ($instance->currentSlot !== null) {
            $instance->slots[$instance->currentSlot] = ob_get_clean();
        }

        // Start new slot
        ob_start();
        $instance->currentSlot = $name;
    }

    /**
     * endComponent captures the final slot and renders the component
     */
    public static function endComponent(): void
    {
        $instance = array_pop(static::$stack);

        if ($instance === null) {
            throw new \RuntimeException("Cannot end component: no active component.");
        }

        // Capture final slot
        if ($instance->currentSlot !== null) {
            $instance->slots[$instance->currentSlot] = ob_get_clean();
        }

        echo $instance->render();
    }
    /**
     * __call supports fluent API for setting props
     */
    public function __call(string $method, array $args): static
    {
        $this->props[$method] = $args[0] ?? true;
        return $this;
    }

    /**
     * __toString renders the component inline
     */
    public function __toString(): string
    {
        return $this->render();
    }

    /**
     * render the component view file and return HTML
     */
    protected function render(): string
    {
        $kebabAttributes = [];
        foreach ($this->attributes as $key => $value) {
            $kebabAttributes[Str::kebab($key)] = $value;
        }

        $attributes = new ComponentAttributeBag($kebabAttributes);
        $slots = $this->slots;
        $slot = $slots['default'] ?? '';

        $vars = $this->props;
        $vars['attributes'] = $attributes;
        $vars['slots'] = $slots;
        $vars['slot'] = $slot;

        return View::make("system::ui.{$this->name}", $vars)->render();
    }
}
