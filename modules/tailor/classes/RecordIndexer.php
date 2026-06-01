<?php namespace Tailor\Classes;

use App;
use Tailor\Models\StructureRecord;

/**
 * RecordIndexer super class responsible for indexing record models
 *
 * @package october\tailor
 * @author Alexey Bobkov, Samuel Georges
 */
class RecordIndexer
{
    /**
     * instance creates a new instance of this singleton
     */
    public static function instance(): static
    {
        return App::make('tailor.record.indexer');
    }

    /**
     * process
     */
    public function process($model)
    {
        if ($model instanceof StructureRecord) {
            $this->processFullSlug($model);
        }
    }

    /**
     * processFullSlug
     */
    public function processFullSlug($model)
    {
        $proposedSlug = $this->makeFullSlugPath($model);

        if ($model->fullslug != $proposedSlug) {
            $model->fullslug = $proposedSlug;
            $model->save();
        }

        if ($children = $model->children) {
            foreach ($children as $child) {
                $this->processFullSlug($child);
            }
        }
    }

    /**
     * makeFullSlugPath
     */
    protected function makeFullSlugPath($model, $fullslug = '')
    {
        $fullslug = $model->slug . '/' . $fullslug;

        if ($parent = $model->parent()->withoutGlobalScopes()->first()) {
            $fullslug = $this->makeFullSlugPath($parent, $fullslug);
        }

        return rtrim($fullslug, '/');
    }
}
