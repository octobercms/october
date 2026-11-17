<?php namespace Tailor\Classes\Scopes;

use Illuminate\Database\Eloquent\Model as ModelBase;
use Illuminate\Database\Eloquent\Scope as ScopeInterface;
use Illuminate\Database\Eloquent\Builder as BuilderBase;

/**
 * DraftableScope
 *
 * @package october\database
 * @author Alexey Bobkov, Samuel Georges
 */
class DraftableScope implements ScopeInterface
{
    /**
     * @var const MODE_PUBLISHED is the final state for a record
     */
    const MODE_PUBLISHED = 1;

    /**
     * @var const MODE_DRAFT is a draft of an already published record
     */
    const MODE_DRAFT = 2;

    /**
     * @var const MODE_NEW_SAVED is a committed draft for a proposed record
     */
    const MODE_NEW_SAVED = 3;

    /**
     * @var const MODE_NEW_UNSAVED is a temporary draft for a proposed record
     */
    const MODE_NEW_UNSAVED = 4;

    /**
     * @var array extensions to be added to the builder.
     */
    protected $extensions = ['WithDrafts', 'WithOnlyDrafts', 'WithSavedDrafts'];

    /**
     * apply the scope to a given Eloquent query builder.
     */
    public function apply(BuilderBase $builder, ModelBase $model)
    {
        $builder->where($model->getQualifiedDraftModeColumnName(), static::MODE_PUBLISHED);
    }

    /**
     * extend the query builder with the needed functions.
     */
    public function extend(BuilderBase $builder)
    {
        foreach ($this->extensions as $extension) {
            $this->{"add{$extension}"}($builder);
        }
    }

    /**
     * addWithDrafts removes this scope and includes everything.
     */
    protected function addWithDrafts(BuilderBase $builder)
    {
        $builder->macro('withDrafts', function (BuilderBase $builder) {
            return $builder->withoutGlobalScope($this);
        });
    }

    /**
     * addWithOnlyDrafts includes only drafts in the query.
     */
    protected function addWithOnlyDrafts(BuilderBase $builder)
    {
        $builder->macro('withOnlyDrafts', function (BuilderBase $builder) {
            $model = $builder->getModel();

            $builder->withoutGlobalScope($this)
                ->where($model->getQualifiedDraftModeColumnName(), static::MODE_DRAFT)
            ;

            return $builder;
        });
    }

    /**
     * addWithSavedDrafts will exclude unsaved drafts.
     */
    protected function addWithSavedDrafts(BuilderBase $builder)
    {
        $builder->macro('withSavedDrafts', function (BuilderBase $builder) {
            $model = $builder->getModel();

            $builder->withoutGlobalScope($this)->whereNotIn(
                $model->getQualifiedDraftModeColumnName(),
                [static::MODE_DRAFT, static::MODE_NEW_UNSAVED]
            );

            return $builder;
        });
    }
}
