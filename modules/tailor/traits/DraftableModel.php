<?php namespace Tailor\Traits;

use Tailor\Classes\Scopes\DraftableScope;

/**
 * DraftableModel trait allows draft versions of models
 *
 * @property int $primary_id
 * @property array $primary_attrs
 * @property \October\Rain\Database\Model|null $primaryRecord
 * @property \October\Rain\Database\Collection|null $drafts
 * @method \October\Rain\Database\Relations\HasMany drafts()
 * @method \October\Rain\Database\Relations\BelongsTo primaryRecord()
 *
 * @package october\tailor
 * @author Alexey Bobkov, Samuel Georges
 */
trait DraftableModel
{
    /**
     * @var string|null draftableSaveMode for saving the draft.
     */
    protected $draftableSaveMode;

    /**
     * @var array draftableSaveAttrs contains draft notes.
     */
    protected $draftableSaveAttrs = [];

    /**
     * bootDraftableModel trait for a model.
     */
    public static function bootDraftableModel()
    {
        static::addGlobalScope(new DraftableScope);
    }

    /**
     * initializeDraftableModel
     */
    public function initializeDraftableModel()
    {
        // Align the in-memory default with the schema default
        $this->attributes[$this->getDraftModeColumnName()] ??= DraftableScope::MODE_PUBLISHED;

        if (!$this->isJsonable('primary_attrs')) {
            $this->addJsonable('primary_attrs');
        }

        $this->belongsTo['primaryRecord'] = [
            static::class,
            'key' => 'primary_id',
            'scope' => 'withDrafts',
            'replicate' => false
        ];

        $this->hasMany['drafts'] = [
            static::class,
            'key' => 'primary_id',
            'scope' => 'withDrafts',
            'replicate' => false
        ];

        $this->bindEvent('model.beforeValidate', function() {
            if ($this->isDraftStatus()) {
                $this->removeValidationRule('slug', 'unique_site');
            }
        });

        $this->bindEvent('model.afterRelation', function($name, $related) {
            if (in_array($name, ['drafts', 'primaryRecord'])) {
                $related->extendWithBlueprint($this->blueprint_uuid);
            }
        });
    }

    /**
     * getDraftRecords
     */
    public function getDraftRecords()
    {
        if ($this->primary_id) {
            return $this->primaryRecord->drafts;
        }
        else {
            return $this->drafts;
        }
    }

    /**
     * getDraftId
     */
    public function getDraftId(): string
    {
        return $this->getKey();
    }

    /**
     * getDraftName
     */
    public function getDraftName(): string
    {
        $attrs = $this->primary_attrs;
        return $attrs['name'] ?? '';
    }

    /**
     * getDraftNotes
     */
    public function getDraftNotes(): string
    {
        $attrs = $this->primary_attrs;
        return $attrs['notes'] ?? '';
    }

    /**
     * countDrafts will return the number of available drafts.
     */
    public function countDrafts(): int
    {
        return $this->drafts()->count();
    }

    /**
     * saveAsFirstDraft
     */
    public function saveAsFirstDraft(array $attrs = [])
    {
        $this->{$this->getDraftModeColumnName()} = DraftableScope::MODE_NEW_UNSAVED;

        $this->primary_attrs = $attrs;

        $this->save(['force' => true]);
    }

    /**
     * createNewDraft
     */
    public function createNewDraft(array $attrs = [])
    {
        $model = $this->replicateWithRelations();

        $model->{$this->getDraftModeColumnName()} = DraftableScope::MODE_DRAFT;

        $model->primary_id = $this->getKey();

        $model->primary_attrs = $attrs;

        $model->save(['force' => true]);

        return $model;
    }

    /**
     * setDraftAutosave
     */
    public function setDraftAutosave(array $attrs): void
    {
        $this->primary_attrs = $attrs;
    }

    /**
     * setDraftCommit
     */
    public function setDraftCommit(array $attrs): void
    {
        // Convert autosave to saved
        if ($this->getDraftModeColumn() === DraftableScope::MODE_NEW_UNSAVED) {
            $this->{$this->getDraftModeColumnName()} = DraftableScope::MODE_NEW_SAVED;
        }

        $this->primary_attrs = $attrs;
    }

    /**
     * setDraftPublish
     */
    public function setDraftPublish(): void
    {
        $this->{$this->getDraftModeColumnName()} = DraftableScope::MODE_PUBLISHED;

        $this->primary_attrs = [];
    }

    /**
     * isDraftStatus
     */
    public function isDraftStatus(): bool
    {
        return $this->getDraftModeColumn() !== DraftableScope::MODE_PUBLISHED;
    }

    /**
     * isFirstDraftStatus
     */
    public function isFirstDraftStatus(): bool
    {
        return in_array($this->getDraftModeColumn(), [
            DraftableScope::MODE_NEW_SAVED,
            DraftableScope::MODE_NEW_UNSAVED
        ]);
    }

    /**
     * isUnsavedDraftStatus
     */
    public function isUnsavedDraftStatus(): bool
    {
        return $this->getDraftModeColumn() === DraftableScope::MODE_NEW_UNSAVED;
    }

    /**
     * getDraftModeColumn returns the value of the draft column.
     */
    public function getDraftModeColumn(): int
    {
        return (int) $this->{$this->getDraftModeColumnName()};
    }

    /**
     * getDraftModeColumnName gets the name of the "draft_mode" column.
     */
    public function getDraftModeColumnName(): string
    {
        return 'draft_mode';
    }

    /**
     * getQualifiedDraftModeColumnName gets the fully qualified "draft_mode" column.
     */
    public function getQualifiedDraftModeColumnName(): string
    {
        return $this->getTable().'.'.$this->getDraftModeColumnName();
    }
}
