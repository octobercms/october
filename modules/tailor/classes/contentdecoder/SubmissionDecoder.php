<?php namespace Tailor\Classes\ContentDecoder;

use Tailor\Models\EntryRecord;
use Tailor\Models\RepeaterItem;
use October\Rain\Database\Relations\BelongsTo;
use Illuminate\Http\UploadedFile;
use ValidationException;

/**
 * SubmissionDecoder applies visitor-submitted data using hardened trust rules,
 * where nested arrays may only create new child records, scalar values may
 * only associate published entries, and file values must be uploaded files.
 *
 * @package october\tailor
 * @author Alexey Bobkov, Samuel Georges
 */
class SubmissionDecoder extends Decoder
{
    /**
     * @var array protectedKeys are system columns a visitor may never write on a child record
     */
    protected $protectedKeys = [
        'id',
        'host_id',
        'host_type',
        'host_field',
        'site_id',
        'site_root_id',
        'parent_id',
        'sort_order',
        'content_spawn_path',
        'created_at',
        'updated_at',
        'deleted_at',
    ];

    /**
     * @var array associationTypes are relation types where a scalar value safely points at an existing record
     */
    protected $associationTypes = [
        'belongsTo',
        'belongsToMany',
        'morphToMany',
        'morphedByMany',
    ];

    /**
     * __construct with the component providing uploaded file validation.
     */
    public function __construct(protected $component)
    {
    }

    /**
     * beforeDecodeAttribute drops child attributes that are unknown to the fieldset or guarded.
     */
    protected function beforeDecodeAttribute($model, $attr, &$value): bool
    {
        if (!$model instanceof RepeaterItem) {
            return true;
        }

        if ($attr === 'content_group') {
            return false;
        }

        $field = $model->getFieldsetDefinition()->getField($attr);

        return $field && $field->guarded !== true;
    }

    /**
     * coerceRelationValue rejects values that do not describe new child records.
     */
    protected function coerceRelationValue($model, $attr, $value)
    {
        if (!is_array($value)) {
            throw $this->makeInvalidFieldException($attr);
        }

        if (!$model->isRelationTypeSingular($attr)) {
            foreach ($value as $row) {
                if (!is_array($row)) {
                    throw $this->makeInvalidFieldException($attr);
                }
            }
        }

        return $value;
    }

    /**
     * coerceChildAttributes strips system keys and validates the content group selection.
     */
    protected function coerceChildAttributes($model, $attr, $value)
    {
        foreach ($this->protectedKeys as $key) {
            unset($value[$key]);
        }

        if (isset($value['content_group'])) {
            $group = $value['content_group'];
            $groups = $model->getFieldsetDefinition()->getField($attr)?->getConfig('groups');

            if (!is_string($group) || !is_array($groups) || !array_key_exists($group, $groups)) {
                throw $this->makeInvalidFieldException($attr);
            }
        }

        return $value;
    }

    /**
     * coerceAssociationId permits scalar identifiers of published records only.
     */
    protected function coerceAssociationId($model, $attr, $value)
    {
        if (!in_array($model->getRelationType($attr), $this->associationTypes)) {
            throw $this->makeInvalidFieldException($attr);
        }

        // Empty values clear the association
        if (!$value) {
            return $value;
        }

        if ($model->isRelationTypeSingular($attr) && !is_scalar($value)) {
            throw $this->makeInvalidFieldException($attr);
        }

        $ids = is_array($value) ? $value : [$value];
        foreach ($ids as $id) {
            if (!is_scalar($id)) {
                throw $this->makeInvalidFieldException($attr);
            }
        }

        $this->validatePublishedRecords($model, $attr, $ids);

        return $value;
    }

    /**
     * validatePublishedRecords rejects identifiers of missing or unpublished records.
     */
    protected function validatePublishedRecords($model, $attr, array $ids): void
    {
        $relation = $model->$attr();
        $related = $relation->getRelated();

        $keyName = $relation instanceof BelongsTo
            ? $relation->getOwnerKeyName()
            : $relation->getRelatedKeyName();

        $query = $related->newQuery()->whereIn($keyName, $ids);

        if ($related instanceof EntryRecord) {
            $query->applyPublishedStatus();
        }

        if ($query->count() < count(array_unique($ids))) {
            throw $this->makeInvalidFieldException($attr);
        }
    }

    /**
     * decodeFileRelation accepts uploaded file instances only, validated against the field definition.
     */
    protected function decodeFileRelation($model, $attr, $value, $sessionKey): void
    {
        $files = [];
        foreach (is_array($value) ? $value : [$value] as $file) {
            if ($file instanceof UploadedFile) {
                $files[] = $file;
            }
        }

        if (!$files) {
            return;
        }

        $field = $model->getFieldsetDefinition()->getField($attr);
        $isSingular = $model->isRelationTypeSingular($attr);

        $maxFiles = $isSingular ? 1 : (int) ($field?->maxFiles ?? 0);
        if ($maxFiles && count($files) > $maxFiles) {
            throw new ValidationException([$attr => __('Too many files were uploaded')]);
        }

        foreach ($files as $file) {
            $this->component->formValidateFile($attr, $file, ['fileTypes' => $field?->fileTypes ?? null]);
        }

        $model->$attr()->setSimpleValue($isSingular ? $files[0] : $files);
    }

    /**
     * makeInvalidFieldException builds a field-keyed validation error.
     */
    protected function makeInvalidFieldException($attr): ValidationException
    {
        return new ValidationException([
            $attr => __("The :name field is invalid.", ['name' => $attr])
        ]);
    }
}
