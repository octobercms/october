<?php namespace Tailor\Classes;

use Model;
use Tailor\Classes\Blueprint;
use SystemException;

/**
 * BlueprintModel is base class for models that use blueprints
 *
 * @package october\support
 * @author Alexey Bobkov, Samuel Georges
 */
abstract class BlueprintModel extends Model
{
    /**
     * @var bool isBlueprintExtended prevents multiple extensions
     */
    protected $isBlueprintExtended = false;

    /**
     * getBlueprintDefinition returns the blueprint definition
     */
    abstract public function getBlueprintDefinition(): Blueprint;

    /**
     * getBlueprintAttribute
     */
    public function getBlueprintAttribute()
    {
        return $this->getBlueprintDefinition();
    }

    /**
     * __sleep prepare the object for serialization
     */
    public function __sleep()
    {
        $this->isBlueprintExtended = false;

        return parent::__sleep();
    }

    /**
     * __wakeup restores the blueprint extension after unserialization
     */
    public function __wakeup()
    {
        parent::__wakeup();

        $this->extendWithBlueprint();
    }

    /**
     * extendWithBlueprint
     */
    public function extendWithBlueprint(?string $uuid = null)
    {
        if ($this->isBlueprintExtended) {
            return;
        }

        if ($uuid !== null) {
            $this->setBlueprintUuid($uuid);
        }

        $uuid = $this->blueprint_uuid;
        if ($uuid === null) {
            return;
        }

        $this->setTable($this->getBlueprintDefinition()->getContentTableName());

        $this->getContentFieldsetDefinition()->applyModelExtensions($this);

        $this->isBlueprintExtended = true;

        /**
         * @event model.extendBlueprint
         * Called when the model is extended with the blueprint, called once per model instance
         *
         * Example usage:
         *
         *     $model->bindEvent('model.extendBlueprint', function (string $uuid) use (\October\Rain\Database\Model $model) {
         *         // Apply specific uuid actions
         *         $model->add_status_to_history = true;
         *     });
         *
         */
        $this->fireEvent('model.extendBlueprint', [$uuid]);
    }

    /**
     * getBlueprintUuid
     */
    public function getBlueprintUuid(): string
    {
        $uuid = $this->blueprint_uuid;
        if (!$uuid) {
            throw new SystemException("Missing content UUID. Set the attribute 'blueprint_uuid' on the model first.");
        }

        return $uuid;
    }

    /**
     * setBlueprintUuid
     */
    public function setBlueprintUuid($value)
    {
        $this->blueprint_uuid = $value;
    }

    /**
     * getBlueprintGroupAttribute
     */
    public function getBlueprintGroupAttribute(): ?string
    {
        return $this->contentGroupFrom ?? null;
    }

    /**
     * getBlueprintGroup
     */
    public function getBlueprintGroup(): ?string
    {
        $groupAttr = $this->getBlueprintGroupAttribute();

        if ($groupAttr === null) {
            return null;
        }

        $group = $this->$groupAttr;
        if (!$group) {
            return null;
        }

        return $group;
    }

    /**
     * setBlueprintGroup
     */
    public function setBlueprintGroup($value): void
    {
        $groupAttr = $this->getBlueprintGroupAttribute();

        if ($groupAttr !== null) {
            $this->$groupAttr = $value;
        }
    }

    /**
     * getFieldsetColumnNames
     */
    public function getFieldsetColumnNames(): array
    {
        return $this->getContentFieldsetDefinition()->getContentColumnNames();
    }

    /**
     * getFieldsetDefinition
     */
    public function getFieldsetDefinition(): Fieldset
    {
        $fieldset = BlueprintIndexer::instance()->findFieldset(
            $this->getBlueprintUuid(),
            $this->getBlueprintGroup()
        );

        if (!$fieldset) {
            $fieldset = $this->getContentFieldsetDefinition();
        }

        return $fieldset;
    }

    /**
     * getContentFieldsetDefinition
     */
    public function getContentFieldsetDefinition(): Fieldset
    {
        $uuid = $this->getBlueprintUuid();

        $fieldset = BlueprintIndexer::instance()->findContentFieldset($uuid);

        if (!$fieldset) {
            throw new SystemException("Unable to find content fieldset definition with UUID of '{$uuid}'.");
        }

        return $fieldset;
    }

    /**
     * makePageUrlParams returns parameters used when linking to this record as a page
     */
    public function makePageUrlParams(): array
    {
        return [
            'id' => $this->id,
            'code' => $this->code,
            'slug' => $this->slug,
            'fullslug' => $this->fullslug
        ];
    }
}
