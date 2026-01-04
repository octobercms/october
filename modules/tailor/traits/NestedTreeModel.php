<?php namespace Tailor\Traits;

/**
 * NestedTreeModel is modified to allow disabling the trait
 *
 * @package october\tailor
 * @author Alexey Bobkov, Samuel Georges
 */
trait NestedTreeModel
{
    use \October\Rain\Database\Traits\NestedTree;

    /**
     * bootNestedTree disables the inherited trait
     */
    public static function bootNestedTree()
    {
    }

    /**
     * initializeNestedTree disables the inherited trait
     */
    public function initializeNestedTree()
    {
    }

    /**
     * initializeNestedTreeModel constructor
     */
    public function initializeNestedTreeModel()
    {
        // Define relationships
        $this->hasMany['children'] = [
            get_class($this),
            'key' => $this->getParentColumnName(),
            'replicate' => false
        ];

        $this->belongsTo['parent'] = [
            get_class($this),
            'key' => $this->getParentColumnName(),
            'replicate' => false
        ];

        $this->bindEvent('model.afterRelation', function($name, $related) {
            if (in_array($name, ['children', 'parent'])) {
                $related->extendWithBlueprint($this->blueprint_uuid);
            }
        });

        // Bind events
        $this->bindEvent('model.beforeCreate', function () {
            if (!$this->useNestedTreeStructure()) {
                return;
            }

            $this->setDefaultLeftAndRight();
        });

        $this->bindEvent('model.beforeSave', function () {
            // This makes the parent column nullable
            $this->storeNewParent();
        });

        $this->bindEvent('model.afterSave', function () {
            if (!$this->useNestedTreeStructure()) {
                return;
            }

            $this->moveToNewParent();
        });

        $this->bindEvent('model.beforeDelete', function () {
            if (!$this->useNestedTreeStructure()) {
                return;
            }

            $this->deleteDescendants();
        });

        $this->bindEvent('model.beforeRestore', function () {
            if (!$this->useNestedTreeStructure()) {
                return;
            }

            $this->shiftSiblingsForRestore();
        });

        $this->bindEvent('model.afterRestore', function () {
            if (!$this->useNestedTreeStructure()) {
                return;
            }

            $this->restoreDescendants();
        });
    }

    /**
     * useNestedTreeStructure
     */
    public function useNestedTreeStructure(): bool
    {
        return true;
    }

    /**
     * getParentIdOptionsFromQuery
     */
    protected function getParentIdOptionsFromQuery($query)
    {
        if (!$this->isEntryStructure()) {
            return [];
        }

        $maxDepth = $this->getBlueprintDefinition()->getMaxDepth();

        $query = $query->where($this->getKeyName(), '<>', $this->getKey());

        if ($maxDepth !== 0) {
            $query->where('nest_depth', '<', $maxDepth - 1);
        }

        $collection = $query->get()->toNested();

        $buildOptions = function($items) use (&$buildOptions) {
            $result = [];
            foreach ($items as $item) {
                $option = ['label' => $item->title];
                $children = $item->getChildren();
                if ($children->count() > 0) {
                    $option['children'] = $buildOptions($children);
                }
                $result[$item->id] = $option;
            }
            return $result;
        };

        $result = ['' => __("Top Level")] + $buildOptions($collection);

        return $result;
    }
}
