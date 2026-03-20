<?php namespace Tailor\Classes\BlueprintIndexer;

use Tailor\Classes\Blueprint\EntryBlueprint;

/**
 * SectionIndex
 *
 * @package october\tailor
 * @author Alexey Bobkov, Samuel Georges
 */
trait SectionIndex
{
    /**
     * @var string sectionsCacheKey
     */
    protected $sectionsCacheKey = 'sections';

    /**
     * listSections
     */
    public function listSections(): array
    {
        $result = [];

        foreach ($this->listSectionsRaw() as $attributes) {
            $result[] = EntryBlueprint::newFromIndexer($attributes);
        }

        return $result;
    }

    /**
     * listSectionsRaw without populating the Blueprint object
     */
    protected function listSectionsRaw(): array
    {
        $records = $this->getCache($this->sectionsCacheKey);

        if (!$records) {
            $records = $this->indexSections();
        }

        return $records;
    }

    /**
     * hasSection is a quick way to resolve a section to a UUID
     */
    public function hasSection($handleOrUuid): string
    {
        $index = $this->listSectionsRaw();

        // UUID found
        if (isset($index[$handleOrUuid])) {
            return $handleOrUuid;
        }

        // Handle found
        $themeDatasource = $this->getActiveThemeDatasource();
        foreach ($index as $attributes) {
            if (isset($attributes['handle']) && $attributes['handle'] === $handleOrUuid) {
                // Skip blueprints from inactive themes
                $themeCode = $attributes['_theme'] ?? null;
                if ($themeCode !== null && $themeDatasource && $themeCode !== $themeDatasource) {
                    continue;
                }

                return $attributes['uuid'] ?? '';
            }
        }

        return '';
    }

    /**
     * findSection
     */
    public function findSection($uuid): ?EntryBlueprint
    {
        $index = $this->listSectionsRaw();

        if (!isset($index[$uuid])) {
            return null;
        }

        return EntryBlueprint::newFromIndexer($index[$uuid]);
    }

    /**
     * findSectionByHandle
     */
    public function findSectionByHandle(string $handle): ?EntryBlueprint
    {
        $themeDatasource = $this->getActiveThemeDatasource();
        $result = null;

        foreach ($this->listSectionsRaw() as $attributes) {
            if (
                (isset($attributes['handle']) && $attributes['handle'] === $handle) ||
                (isset($attributes['handleSlug']) && $attributes['handleSlug'] === $handle)
            ) {
                // Skip blueprints from inactive themes
                $themeCode = $attributes['_theme'] ?? null;
                if ($themeCode !== null && $themeDatasource && $themeCode !== $themeDatasource) {
                    continue;
                }

                $result = EntryBlueprint::newFromIndexer($attributes);
            }
        }

        return $result;
    }

    /**
     * indexSections
     */
    public function indexSections(): array
    {
        $newIndex = [];

        foreach (EntryBlueprint::listInProject() as $blueprint) {
            $newIndex[$blueprint->uuid] = $blueprint->toArray();
        }

        $this->putCache($this->sectionsCacheKey, $newIndex);

        return $newIndex;
    }
}
