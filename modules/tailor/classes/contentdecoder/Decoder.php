<?php namespace Tailor\Classes\ContentDecoder;

use Tailor\Models\RepeaterItem;

/**
 * Decoder walks raw content data and applies it to a blueprint record,
 * routing each attribute to scalar assignment, nested child creation,
 * file attachment or relation association. Subclasses define the trust
 * rules for their input source via the coerce hooks.
 *
 * @package october\tailor
 * @author Alexey Bobkov, Samuel Georges
 */
abstract class Decoder
{
    /**
     * decode applies each attribute in the data array to the model.
     */
    public function decode($model, array $data, $sessionKey = null): void
    {
        foreach ($data as $attr => $value) {
            $this->decodeModelAttribute($model, $attr, $value, $sessionKey);
        }
    }

    /**
     * decodeModelAttribute applies a single attribute value to the model.
     */
    public function decodeModelAttribute($model, $attr, $value, $sessionKey = null): void
    {
        if ($this->beforeDecodeAttribute($model, $attr, $value) === false) {
            return;
        }

        if ($model->hasRelation($attr)) {
            $relationModel = $model->makeRelation($attr);
            if ($relationModel instanceof RepeaterItem) {
                $value = $this->coerceRelationValue($model, $attr, $value);
                $this->decodeRepeaterItems($model, $attr, $value, $sessionKey);
            }
            elseif ($relationModel instanceof \System\Models\File) {
                $this->decodeFileRelation($model, $attr, $value, $sessionKey);
            }
            else {
                $value = $this->coerceAssociationId($model, $attr, $value);
                $model->$attr()->setSimpleValue($value);
            }
        }
        else {
            $model->$attr = $value;
        }
    }

    /**
     * decodeRepeaterItems builds child records from nested data.
     */
    protected function decodeRepeaterItems($model, $attr, $values, $sessionKey): void
    {
        if ($model->isRelationTypeSingular($attr)) {
            $values = [$values];
        }

        foreach ($values as $value) {
            $value = $this->coerceChildAttributes($model, $attr, $value);

            $item = $model->makeRelation($attr);
            $item->content_group = $value['content_group'] ?? null;
            $item->extendWithBlueprint();

            $this->decodeRepeaterItem($item, $value, $sessionKey);

            // Repeaters "has many" relations are without a session key
            // and the saving chain is deferred in memory instead
            $model->$attr()->add($item);
        }
    }

    /**
     * decodeRepeaterItem applies nested data to a child record.
     */
    protected function decodeRepeaterItem($model, $data, $sessionKey): void
    {
        foreach ($data as $attr => $value) {
            $this->decodeModelAttribute($model, $attr, $value, $sessionKey);
        }
    }

    /**
     * decodeFileRelation creates file attachments from the source-specific value shape.
     */
    abstract protected function decodeFileRelation($model, $attr, $value, $sessionKey): void;

    /**
     * beforeDecodeAttribute can veto or transform an attribute before decoding.
     */
    protected function beforeDecodeAttribute($model, $attr, &$value): bool
    {
        return true;
    }

    /**
     * coerceRelationValue gates the raw value before child records are built from it.
     */
    protected function coerceRelationValue($model, $attr, $value)
    {
        return $value;
    }

    /**
     * coerceChildAttributes gates the attributes of a single child record before it is built.
     */
    protected function coerceChildAttributes($model, $attr, $value)
    {
        return $value;
    }

    /**
     * coerceAssociationId gates the value before it is passed to a relation association.
     */
    protected function coerceAssociationId($model, $attr, $value)
    {
        return $value;
    }
}
