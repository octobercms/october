<?php namespace Tailor\Classes\Scopes;

use Illuminate\Database\Eloquent\Model as ModelBase;
use Illuminate\Database\Eloquent\Builder as BuilderBase;

/**
 * SingleRecordScope
 *
 * @package october\database
 * @author Alexey Bobkov, Samuel Georges
 */
class SingleRecordScope extends EntryRecordScope
{
    /**
     * apply the scope to a given Eloquent query builder.
     */
    public function apply(BuilderBase $builder, ModelBase $model)
    {
        // Placeholder
    }
}
