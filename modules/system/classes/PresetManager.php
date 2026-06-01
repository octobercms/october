<?php namespace System\Classes;

use App;

/**
 * PresetManager class manages preset lists
 *
 * @package october\system
 * @author Alexey Bobkov, Samuel Georges
 */
class PresetManager
{
    /**
     * @var array presets collection of presets
     */
    protected $presets;

    /**
     * @var array extenders collection of preset extender callbacks
     */
    protected $extenders = [];

    /**
     * __construct
     */
    public function __construct()
    {
        $this->registerPreset('icons', [\System\Classes\PresetManager\Icons::class, 'icons']);
        $this->registerPreset('icons@phosphor', [\System\Classes\PresetManager\Icons::class, 'iconsPhosphor']);
        $this->registerPreset('locales', [\System\Classes\PresetManager\Locales::class, 'locales']);
        $this->registerPreset('flags', [\System\Classes\PresetManager\Locales::class, 'flags']);
        $this->registerPreset('flags@short', [\System\Classes\PresetManager\Locales::class, 'flagsShort']);
        $this->registerPreset('timezones', [\System\Classes\PresetManager\Dates::class, 'timezones']);

        // Deprecated aliases
        $this->registerPreset('phosphorIcons', [\System\Classes\PresetManager\Icons::class, 'iconsPhosphor']);
        $this->registerPreset('localeIcons', [\System\Classes\PresetManager\Locales::class, 'flags']);
    }

    /**
     * instance creates a new instance of this singleton
     */
    public static function instance(): static
    {
        return App::make('system.preset');
    }

    /**
     * registerPreset registers a new preset with a callback that returns the items
     */
    public function registerPreset(string $alias, callable $callback)
    {
        $this->presets[$alias] = $callback;
    }

    /**
     * replacePreset completely replaces an existing preset with a new callback
     */
    public function replacePreset(string $alias, callable $callback)
    {
        $this->presets[$alias] = $callback;
    }

    /**
     * extendPreset registers a callback that modifies a preset after it is resolved.
     * The callback receives the preset items array and should return the modified array.
     *
     * Usage to add items:
     *
     *     PresetManager::instance()->extendPreset('icons', function($items) {
     *         $items['bi-custom'] = ['custom', 'bi bi-custom'];
     *         return $items;
     *     });
     *
     * Usage to remove items:
     *
     *     PresetManager::instance()->extendPreset('icons', function($items) {
     *         unset($items['oc-icon-trash']);
     *         return $items;
     *     });
     *
     */
    public function extendPreset(string $alias, callable $callback)
    {
        $this->extenders[$alias][] = $callback;
    }

    /**
     * getPreset returns the resolved preset items for a given alias
     */
    public function getPreset(string $alias): array
    {
        if (str_starts_with($alias, 'preset:')) {
            $alias = substr($alias, 7);
        }

        if (!$this->hasPreset($alias)) {
            return [];
        }

        $items = $this->presets[$alias]();

        if (isset($this->extenders[$alias])) {
            foreach ($this->extenders[$alias] as $callback) {
                $items = $callback($items) ?: $items;
            }
        }

        return $items;
    }

    /**
     * hasPreset checks if a preset exists by alias
     */
    public function hasPreset(string $alias): bool
    {
        return isset($this->presets[$alias]);
    }
}
