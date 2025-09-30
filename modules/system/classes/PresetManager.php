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
    }

    /**
     * instance creates a new instance of this singleton
     */
    public static function instance(): static
    {
        return App::make('system.preset');
    }

    /**
     * registerPreset
     */
    public function registerPreset(string $alias, callable $callback)
    {
        $this->presets[$alias] = $callback;
    }

    /**
     * getPreset
     */
    public function getPreset(string $alias): array
    {
        if (str_starts_with($alias, 'preset:')) {
            $alias = substr($alias, 7);
        }

        if ($this->hasPreset($alias)) {
            return $this->presets[$alias]();
        }

        return [];
    }

    /**
     * hasPreset
     */
    public function hasPreset(string $alias): bool
    {
        return isset($this->presets[$alias]);
    }
}
