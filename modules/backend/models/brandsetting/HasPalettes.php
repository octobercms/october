<?php namespace Backend\Models\BrandSetting;

use Event;

/**
 * HasPalettes for brand settings
 *
 * @package october\backend
 * @author Alexey Bobkov, Samuel Georges
 */
trait HasPalettes
{
    /**
     * @var array presets
     */
    protected $presets = [
        'default' => [
            'name' => 'Default',
            'light' => [
                'primary' => '#6a6cf7',
                'secondary' => '#72809d',
                'selection' => '#6bc48d',
                'link_color' => '#3498db',
                'mainnav_color' => '#ffffff',
                'mainnav_bg' => '#2d3134',
                'sidebar_color' => '#536061',
                'sidebar_bg' => '#e9edf3',
                'sidebar_active_color' => '#333333',
                'sidebar_active_bg' => '#ffffff',
                'sidebar_hover_bg' => '#ffffff',
                'settings_color' => '#536061',
                'settings_bg' => '#f0f4f8',
                'settings_item' => '#ffffff',
                'settings_active_color' => '#ffffff',
                'settings_active_bg' => '#6bc48d',
                'settings_hover_bg' => '#dfe7ee',
            ],
            'dark' => [
                'link_color' => '#a6a7fa',
                'sidebar_color' => '#d7e1eA',
                'sidebar_bg' => '#292a2d',
                'sidebar_active_color' => '#ffffff',
                'sidebar_active_bg' => '#424242',
                'sidebar_hover_bg' => '#424242',
                'settings_color' => '#adb5bd',
                'settings_bg' => '#1b1f22',
                'settings_item' => '#212529',
                'settings_active_color' => '#ffffff',
                'settings_active_bg' => '#2b3442',
                'settings_hover_bg' => '#2b3442',
            ],
        ],

        'classic' => [
            'name' => 'Classic',
            'light' => [
                'primary' => '#1991d1',
                'secondary' => '#656d79',
                'selection' => '#e67e22',
                'mainnav_color' => '#ffffff',
                'mainnav_bg' => '#000000',
                'sidebar_color' => '#aeb6bf',
                'sidebar_bg' => '#34495e',
                'sidebar_active_color' => '#ffffff',
                'sidebar_active_bg' => '#1991d1',
                'sidebar_hover_bg' => '#151d26',
                'settings_color' => '#e0e0e0',
                'settings_bg' => '#34495e',
                'settings_item' => '#2c3e50',
                'settings_active_color' => '#ffffff',
                'settings_active_bg' => '#1991d1',
                'settings_hover_bg' => '#151d26',
            ],
            'dark' => [
            ],
        ],

        'oxford' => [
            'name' => 'Oxford',
            'light' => [
                'primary' => '#6698c8',
                'secondary' => '#4a5664',
                'selection' => '#78af8f',
                'mainnav_color' => '#ffffff',
                'mainnav_bg' => '#2c3849',
                'sidebar_color' => '#ffffff',
                'sidebar_bg' => '#303e4d',
                'sidebar_active_color' => '#ffffff',
                'sidebar_active_bg' => '#6698c8',
                'sidebar_hover_bg' => '#4a5664',
                'settings_active_bg' => '#6698c8',
            ],
            'dark' => [
                'settings_active_bg' => '#2c3849',
            ],
        ],

        'console' => [
            'name' => 'Console',
            'light' => [
                'primary' => '#0d6efd',
                'secondary' => '#223b2f',
                'selection' => '#1c913d',
                'mainnav_color' => '#4ee077',
                'mainnav_bg' => '#1a2b23',
                'sidebar_color' => '#4ee077',
                'sidebar_bg' => '#181818',
                'sidebar_active_color' => '#1a1d21',
                'sidebar_active_bg' => '#4ee077',
                'sidebar_hover_bg' => '#1a2b23',
            ],
            'dark' => [
                'settings_bg' => '#181818',
                'settings_active_color' => '#4ee077',
                'settings_active_bg' => '#1a2b23',
                'settings_hover_bg' => '#1a2b23',
            ],
        ],

        'valentino' => [
            'name' => 'Valentino',
            'light' => [
                'primary' => '#1164a3',
                'secondary' => '#6c8497',
                'selection' => '#2bac76',
                'mainnav_color' => '#ffffff',
                'mainnav_bg' => '#350d36',
                'sidebar_color' => '#ece7ec',
                'sidebar_bg' => '#3f0e40',
                'sidebar_active_color' => '#ffffff',
                'sidebar_active_bg' => '#1164a3',
                'sidebar_hover_bg' => '#4d2a51',
                'settings_bg' => '#f0f4f8',
                'settings_active_color' => '#ffffff',
                'settings_active_bg' => '#1164a3',
            ],
            'dark' => [
                'primary' => '#1164a3',
                'mainnav_bg' => '#121016',
                'sidebar_bg' => '#19171d',
                'settings_bg' => '#1d151d',
                'sidebar_active_bg' => '#1164a3',
                'sidebar_hover_bg' => '#27242c',
                'settings_active_bg' => '#1164a3',
            ],
        ],

        'punch' => [
            'name' => 'Punch',
            'light' => [
                'primary' => '#ff8f21',
                'secondary' => '#8b7e60',
                'selection' => '#d94422',
                'mainnav_color' => '#ffd476',
                'mainnav_bg' => '#461412',
                'sidebar_color' => '#ffd476',
                'sidebar_bg' => '#6A1B1B',
                'sidebar_active_color' => '#FDF6E3',
                'sidebar_active_bg' => '#d94422',
                'sidebar_hover_bg' => '#461412',
                'settings_color' => '#6A1B1B',
                'settings_bg' => '#e2dfd7',
                'settings_item' => '#ffffff',
                'settings_active_color' => '#fdf6e3',
                'settings_active_bg' => '#d94422',
                'settings_hover_bg' => '#f3f2ef',
            ],
            'dark' => [
                'sidebar_color' => '#d2a454',
                'sidebar_bg' => '#171a1e',
                'sidebar_active_color' => '#FFD476',
                'sidebar_active_bg' => '#6A1B1B',
                'sidebar_hover_bg' => '#461412',
                'settings_color' => '#FFD476',
                'settings_bg' => '#1f1818',
                'settings_item' => '#221b1b',
                'settings_hover_bg' => '#461412',
            ],
        ],
    ];

    /**
     * @var array|null presetCache
     */
    protected $presetCache;

    /**
     * getPalettePresets
     */
    protected function getPalettePresets()
    {
        if ($this->presetCache !== null) {
            return $this->presetCache;
        }

        $presets = $this->presets;

        /**
         * @event backend.brand.getPalettePresets
         * Add or remove backend branding palettes.
         *
         * The format of the $presets variable can be found in
         * Backend\Models\BrandSetting\HasPalettes::$presets
         *
         * Example usage:
         *
         *     Event::listen('backend.brand.getPalettePresets', function(&$presets) {
         *         unset($presets['punch']);
         *     });
         *
         */
        Event::fire('backend.brand.getPalettePresets', [&$presets]);

        return $this->presetCache = $presets;
    }

    /**
     * getPaletteColors
     */
    public function getPaletteColors(?string $preset = null): array
    {
        if ($preset === null) {
            $preset = 'default';
        }

        return [
            'light' => $this->getPaletteColorsFor($preset, 'light'),
            'dark' => $this->getPaletteColorsFor($preset, 'dark')
        ];
    }

    /**
     * getPaletteStyleVarsFor returns variables for use within a LESS compiler
     */
    public function getPaletteStyleVarsFor(string $preset, string $mode, array $customColors = []): array
    {
        // Merge defaults
        $defaultColors = $this->getPaletteColorsFor('default', $mode);
        $result = array_merge(
            $defaultColors,
            $this->getPaletteColorsFor($preset, $mode) ?: $this->cleanCustomPaletteColors($customColors, $defaultColors)
        );

        // Convert keys to kebab from snake case
        foreach ($result as $key => $val) {
            $newKey = 'brand-'.str_replace('_', '-', $key);
            if ($mode !== 'light') {
                $newKey .= '-dark';
            }
            $result[$newKey] = $val;
            unset($result[$key]);
        }

        return $result;
    }

    /**
     * cleanCustomPaletteColors keeps user supplied colors that are plain CSS colors under a safe name, so no LESS source reaches the parser.
     */
    protected function cleanCustomPaletteColors(array $customColors, array $defaultColors): array
    {
        $result = [];

        foreach ($customColors as $key => $val) {
            if (!array_key_exists($key, $defaultColors) && !preg_match('/^[a-z0-9_]+$/iD', (string) $key)) {
                continue;
            }

            $color = static::makeLessColorValue($val, $defaultColors[$key] ?? '');
            if ($color !== '') {
                $result[$key] = $color;
            }
        }

        return $result;
    }

    /**
     * getPaletteColorsFor
     */
    public function getPaletteColorsFor(string $preset, string $mode): array
    {
        $presets = $this->getPalettePresets();

        if (!isset($presets[$preset])) {
            return [];
        }

        return array_merge(
            $presets['default'][$mode] ?? [],
            $presets[$preset]['light'] ?? [],
            $presets[$preset][$mode] ?? []
        );
    }

    /**
     * getPaletteDefinitions
     */
    public function getPaletteDefinitions(): array
    {
        $result = [];
        $presets = $this->getPalettePresets();

        foreach ($presets as $palette => $info) {
            $result[$palette] = $info;
            $result[$palette]['light'] = array_merge(
                $presets['default']['light'],
                $info['light'] ?? []
            );
            $result[$palette]['dark'] = array_merge(
                $presets['default']['dark'],
                $info['light'] ?? [],
                $info['dark'] ?? []
            );
        }

        return $result;
    }

    /**
     * getPaletteOptions
     */
    public function getPaletteOptions(): array
    {
        $result = [];
        $presets = $this->getPalettePresets();

        foreach ($presets as $palette => $info) {
            $result[$palette] = $info['name'] ?? '???';
        }

        return $result;
    }
}
