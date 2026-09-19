<?php namespace Backend\Models;

use Model;
use Backend\Classes\RichEditorManager;

/**
 * EditorToolbar stores a named rich editor toolbar definition, seeded from
 * the registerRichEditorToolbars registration method or created by an admin.
 *
 * @package october\backend
 * @author Alexey Bobkov, Samuel Georges
 */
class EditorToolbar extends Model
{
    use \October\Rain\Database\Traits\Validation;

    /**
     * @var string table associated with the model
     */
    protected $table = 'backend_editor_toolbars';

    /**
     * @var array rules for validation
     */
    public $rules = [
        'label' => 'required',
        'code' => ['required', 'regex:/^[a-zA-Z0-9_\-]+$/', 'unique:backend_editor_toolbars'],
    ];

    /**
     * @var array guarded attributes aren't mass assignable
     */
    protected $guarded = [];

    /**
     * beforeCreate marks records as custom unless created by the seeder
     */
    public function beforeCreate()
    {
        if (!isset($this->attributes['is_custom'])) {
            $this->is_custom = true;
        }
    }

    /**
     * beforeSave normalizes the button list
     */
    public function beforeSave()
    {
        $this->buttons = $this->normalizeButtons((string) $this->buttons);
    }

    /**
     * filterFields protects the code of seeded definitions
     */
    public function filterFields($fields)
    {
        if ($this->exists && !$this->is_custom && isset($fields->code)) {
            $fields->code->disabled = true;
        }
    }

    /**
     * getIsModifiedAttribute returns true when the buttons differ from the
     * seeded definition
     */
    public function getIsModifiedAttribute(): bool
    {
        $seeded = $this->getSeededButtons();
        if ($seeded === null) {
            return false;
        }

        return $this->normalizeButtons((string) $this->buttons) !== $seeded;
    }

    /**
     * getSeededButtons returns the registered button list for this definition,
     * a null return means the definition is not seeded by a plugin
     */
    public function getSeededButtons(): ?string
    {
        if (!$this->code) {
            return null;
        }

        return RichEditorManager::instance()->getSeedDefinitions()[$this->code]['buttons'] ?? null;
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
