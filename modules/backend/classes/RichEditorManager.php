<?php namespace Backend\Classes;

use App;
use Lang;
use Schema;
use Backend\Models\EditorSetting;
use Backend\Models\EditorToolbar;
use System\Classes\PluginManager;

/**
 * RichEditorManager manages named toolbar definitions for the rich editor.
 * Definitions are seeded by plugins via the registerRichEditorToolbars
 * registration method, stored as editor toolbar records and managed in the
 * editor settings area.
 *
 * @package october\backend
 * @author Alexey Bobkov, Samuel Georges
 */
class RichEditorManager
{
    /**
     * @var array|null seedDefinitions registered in code, keyed by code
     */
    protected $seedDefinitions;

    /**
     * @var array|null toolbarRows stored in the database, keyed by code
     */
    protected $toolbarRows;

    /**
     * instance creates a new instance of this singleton
     */
    public static function instance(): static
    {
        return App::make('backend.richeditor');
    }

    /**
     * getSeedDefinitions returns definitions registered in code, keyed by code,
     * each with label, description, buttons and owner keys, definitions without
     * buttons inherit the default toolbar
     */
    public function getSeedDefinitions(): array
    {
        if ($this->seedDefinitions !== null) {
            return $this->seedDefinitions;
        }

        $definitions = $this->getBuiltInDefinitions();

        $bundles = PluginManager::instance()->getRegistrationMethodValues('registerRichEditorToolbars');
        foreach ($bundles as $owner => $items) {
            if (!is_array($items)) {
                continue;
            }

            foreach ($items as $code => $definition) {
                $definitions[$code] = [
                    'label' => $definition['label'] ?? $code,
                    'description' => $definition['description'] ?? null,
                    'buttons' => $this->normalizeButtons($definition['buttons'] ?? ''),
                    'owner' => $owner,
                ];
            }
        }

        return $this->seedDefinitions = $definitions;
    }

    /**
     * getToolbarButtons returns the resolved button list for a definition code,
     * where stored records take precedence over seeded definitions, and empty
     * definitions inherit the default toolbar
     */
    public function getToolbarButtons(string $code): ?string
    {
        $row = $this->getToolbarRows()[$code] ?? null;
        if ($row !== null && strlen($row)) {
            return $row;
        }

        $seed = $this->getSeedDefinitions()[$code]['buttons'] ?? null;
        if ($seed !== null && strlen($seed)) {
            return $seed;
        }

        // Inherit the default toolbar, a null return means the
        // client-side registry defaults apply
        return $code !== 'default' ? $this->getDefaultButtons() : null;
    }

    /**
     * getDefaultButtons returns the default toolbar only when it differs from
     * the seeded definition, a null return means the client-side registry
     * defaults apply
     */
    public function getDefaultButtons(): ?string
    {
        $seed = $this->getSeedDefinitions()['default']['buttons'] ?? null;

        $row = $this->getToolbarRows()['default'] ?? null;
        if ($row !== null && strlen($row) && $row !== $seed) {
            return $row;
        }

        // Legacy storage for the default definition @deprecated
        if ($legacy = EditorSetting::getConfigured('html_toolbar_buttons')) {
            return $this->normalizeButtons($legacy);
        }

        return null;
    }

    /**
     * syncToolbars creates missing toolbar records from the seeded definitions,
     * migrating the legacy default toolbar setting when found
     */
    public function syncToolbars(): void
    {
        $settings = EditorSetting::instance();
        if (!$settings->exists) {
            $settings->save();
        }

        // Adopt records from a previous settings record, e.g. after a settings reset
        EditorToolbar::where(function ($query) use ($settings) {
            $query->where('setting_id', '<>', $settings->getKey())->orWhereNull('setting_id');
        })->update(['setting_id' => $settings->getKey()]);

        $existing = EditorToolbar::pluck('code')->all();

        foreach ($this->getSeedDefinitions() as $code => $definition) {
            if (in_array($code, $existing)) {
                continue;
            }

            $buttons = $definition['buttons'];

            // Migrate the legacy default toolbar setting into the record
            if ($code === 'default' && ($legacy = EditorSetting::getConfigured('html_toolbar_buttons'))) {
                $buttons = $this->normalizeButtons($legacy);
                EditorSetting::set('html_toolbar_buttons', '');
            }

            try {
                EditorToolbar::create([
                    'setting_id' => $settings->getKey(),
                    'code' => $code,
                    'label' => $definition['label'],
                    'description' => $definition['description'],
                    'buttons' => $buttons,
                    'is_custom' => false,
                ]);
            }
            catch (\October\Rain\Exception\ValidationException $ex) {
                // Another request created the record concurrently
            }
        }

        $this->resetCache();
    }

    /**
     * resetCache clears the collected definitions and records
     */
    public function resetCache(): void
    {
        $this->seedDefinitions = null;
        $this->toolbarRows = null;
    }

    /**
     * getToolbarRows returns the stored button lists, keyed by code
     */
    protected function getToolbarRows(): array
    {
        if ($this->toolbarRows !== null) {
            return $this->toolbarRows;
        }

        if (!Schema::hasTable('backend_editor_toolbars')) {
            return $this->toolbarRows = [];
        }

        $result = [];

        foreach (EditorToolbar::pluck('buttons', 'code')->all() as $code => $buttons) {
            $result[$code] = $this->normalizeButtons((string) $buttons);
        }

        return $this->toolbarRows = $result;
    }

    /**
     * getBuiltInDefinitions seeds the default, minimal and full definitions
     */
    protected function getBuiltInDefinitions(): array
    {
        $definitions = [
            'default' => [
                'description' => 'Used by rich editors without a specific toolbar.',
                'buttons' => 'paragraphFormat, align, bold, italic, underline, |, formatOL, formatUL, |,
                    insertSnippet, insertTable, insertPageLink, insertImage, insertHR, html',
            ],
            'minimal' => [
                'description' => 'A compact toolbar for simple content.',
                'buttons' => 'bold, italic, underline, |, insertSnippet, insertPageLink, insertImage, |, html',
            ],
            'full' => [
                'description' => 'Every available button.',
                'buttons' => 'undo, redo, |, bold, italic, underline, |, paragraphFormat, paragraphStyle, inlineStyle, |,
                    strikeThrough, subscript, superscript, clearFormatting, |, fontFamily, fontSize, |, color,
                    emoticons, icons, -, selectAll, |, align, formatOL, formatUL, outdent, indent, quote, |, insertHR,
                    insertSnippet, insertPageLink, insertImage, insertVideo, insertAudio, insertFile, insertTable, |, selectAll,
                    html, fullscreen',
            ],
        ];

        $result = [];

        foreach ($definitions as $code => $definition) {
            $result[$code] = [
                'label' => Lang::get('backend::lang.editor.toolbar_buttons_presets.'.$code),
                'description' => $definition['description'],
                'buttons' => $this->normalizeButtons($definition['buttons']),
                'owner' => 'October.Backend',
            ];
        }

        return $result;
    }

    /**
     * normalizeButtons cleans a button list to a comma separated string
     */
    protected function normalizeButtons(string $buttons): string
    {
        $items = array_filter(array_map('trim', explode(',', $buttons)), 'strlen');

        return implode(',', $items);
    }
}
