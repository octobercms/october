<?php namespace Tailor\Classes\Relations;

use Site;
use Illuminate\Support\Arr;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;
use October\Rain\Database\Relations\HasMany;

/**
 * CustomFieldHasManyRelation adds a field name to has many
 *
 * @package october\tailor
 * @author Alexey Bobkov, Samuel Georges
 */
class CustomFieldHasManyRelation extends HasMany
{
    /**
     * addConstraints on the relation query.
     */
    public function addConstraints()
    {
        if (static::$constraints) {
            $this->getRelationQuery()->where('host_field', $this->relationName);

            parent::addConstraints();
        }
    }

    /**
     * addEagerConstraints for an eager load of the relation.
     */
    public function addEagerConstraints(array $models)
    {
        parent::addEagerConstraints($models);

        $this->getRelationQuery()->where('host_field', $this->relationName);
    }

    /**
     * setForeignAttributesForCreate a related model.
     */
    protected function setForeignAttributesForCreate(Model $model)
    {
        $model->{$this->getForeignKeyName()} = $this->getParentKey();

        $model->host_field = $this->relationName;

        // Set site_id for multisite sync repeaters. Query filtering is handled
        // by MultisiteScope on the related model, but new records need site_id
        // set before the trait's beforeSave fires.
        if ($this->getMultisiteSyncEnabled()) {
            $model->site_id = Site::getSiteIdFromContext();
        }
    }

    /**
     * getMultisiteSyncEnabled checks if the relation definition has the
     * multisiteSync flag, indicating Scenario C mode.
     */
    public function getMultisiteSyncEnabled(): bool
    {
        $definition = $this->parent->getRelationDefinition($this->relationName);

        return Arr::get($definition, 'multisiteSync', false);
    }

    /**
     * getRelationExistenceQuery
     */
    public function getRelationExistenceQuery(Builder $query, Builder $parentQuery, $columns = ['*'])
    {
        return parent::getRelationExistenceQuery($query, $parentQuery, $columns)->where(
            $query->qualifyColumn('host_field'),
            $this->relationName
        );
    }
}
