<?php namespace Tailor\Classes\BlueprintIndexer;

use Tailor\Classes\Blueprint\GlobalBlueprint;

/**
 * GlobalIndex
 *
 * @package october\tailor
 * @author Alexey Bobkov, Samuel Georges
 */
trait GlobalIndex
{
    /**
     * @var string globalsCacheKey
     */
    protected $globalsCacheKey = 'globals';

    /**
     * listGlobals
     */
    public function listGlobals(): array
    {
        $result = [];

        foreach ($this->listGlobalsRaw() as $attributes) {
            $result[] = GlobalBlueprint::newFromIndexer($attributes);
        }

        return $result;
    }

    /**
     * listGlobalsRaw without populating the Blueprint object
     */
    protected function listGlobalsRaw(): array
    {
        $records = $this->getCache($this->globalsCacheKey);

        if (!$records) {
            $records = $this->indexGlobals();
        }

        return $records;
    }

    /**
     * findGlobal
     */
    public function findGlobal($uuid): ?GlobalBlueprint
    {
        $index = $this->listGlobalsRaw();

        if (!isset($index[$uuid])) {
            return null;
        }

        return GlobalBlueprint::newFromIndexer($index[$uuid]);
    }

    /**
     * findGlobalByHandle
     */
    public function findGlobalByHandle(string $handle): ?GlobalBlueprint
    {
        $result = null;

        foreach ($this->listGlobalsRaw() as $attributes) {
            if (
                (isset($attributes['handle']) && $attributes['handle'] === $handle) ||
                (isset($attributes['handleSlug']) && $attributes['handleSlug'] === $handle)
            ) {
                // Skip blueprints from inactive themes
                if (!$this->isActiveThemeDatasource($attributes['_theme'] ?? null)) {
                    continue;
                }

                $result = GlobalBlueprint::newFromIndexer($attributes);
            }
        }

        return $result;
    }

    /**
     * indexGlobals
     */
    public function indexGlobals(): array
    {
        $newIndex = [];

        foreach (GlobalBlueprint::listInProject() as $section) {
            $newIndex[$section->uuid] = $section->toArray();
        }

        $this->putCache($this->globalsCacheKey, $newIndex);

        return $newIndex;
    }
}
