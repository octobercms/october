<?php namespace Tailor\Classes\BlueprintIndexer;

use Cms;
use Site;
use Cms\Classes\Page;
use Tailor\Classes\Blueprint\EntryBlueprint;
use Tailor\Classes\BlueprintIndexer;
use Exception;

/**
 * PageManagerRegistry
 *
 * @package october\tailor
 * @author Alexey Bobkov, Samuel Georges
 */
trait PageManagerRegistry
{
    /**
     * listPrimaryNavigation
     */
    public function listPageManagerTypes(): array
    {
        $types = [];
        $themeDatasource = $this->getActiveThemeDatasource();

        // Sections
        foreach (EntryBlueprint::listInProject() as $blueprint) {
            // Skip blueprints from inactive themes
            $themeCode = $blueprint->getDatasourceTheme();
            if ($themeCode !== null && $themeDatasource && $themeCode !== $themeDatasource) {
                continue;
            }

            if ($typeCode = $this->pageManagerBlueprintToType($blueprint)) {
                if ($blueprint->usePageFinder()) {
                    $types[$typeCode] = $blueprint->getMessage('pagefinderItemType', ":name Entry", ['name' => $blueprint->name]);
                }

                if ($blueprint->usePageFinder('list')) {
                    $types['list-'.$typeCode] = [
                        $blueprint->getMessage('pagefinderListType', "All :name Entries", ['name' => $blueprint->name]),
                        true
                    ];
                }
            }
        }

        return $types;
    }

    /**
     * getPageManagerTypeInfo
     */
    public function getPageManagerTypeInfo($type): array
    {
        try {
            [$model, $query] = $this->pageManagerTypeToModel($type);
        }
        catch (Exception $ex) {
            report($ex);
            return ['cmsPages' => []];
        }

        if (!$model) {
            return ['cmsPages' => []];
        }

        $result = [];

        if (!str_starts_with($type, 'list-')) {
            $result['references'] = $this->listRecordOptionsForPageInfo($model, $query);
        }

        $result['cmsPages'] = $this->listBlueprintCmsPagesForPageInfo($model);

        return $result;
    }

    /**
     * listBlueprintCmsPagesForPageInfo
     */
    protected function listBlueprintCmsPagesForPageInfo($model)
    {
        $handle = $model->blueprint->handle ?? $model->blueprint_uuid;
        return Page::whereComponent('section', 'handle', $handle)->all();
    }

    /**
     * listRecordOptionsForPageInfo
     */
    protected function listRecordOptionsForPageInfo($model, $query)
    {
        $records = $model->isClassInstanceOf(\October\Contracts\Database\TreeInterface::class)
            ? $query->getNested()
            : $query->get();

        $iterator = function($records) use (&$iterator) {
            $result = [];
            $hasMultisite = null;
            foreach ($records as $record) {
                $hasMultisite ??= $record->isClassInstanceOf(\October\Contracts\Database\MultisiteInterface::class) &&
                    $record->isMultisiteEnabled();

                $id = $hasMultisite ? $record->getMultisiteKey() : $record->getKey();
                if (!$record->children) {
                    $result[$id] = $record->title;
                }
                else {
                    $result[$id] = [
                        'title' => $record->title,
                        'items' => $iterator($record->children)
                    ];
                }
            }
            return $result;
        };

        return $iterator($records);
    }

    /**
     * resolvePageManagerItem
     */
    public function resolvePageManagerItem($type, $item, $url, $theme): array
    {
        if (str_starts_with($type, 'list-')) {
            return $this->resolvePageManagerItemAsList($type, $item, $url, $theme);
        }

        return $this->resolvePageManagerItemAsReference($type, $item, $url, $theme);
    }

    /**
     * resolvePageManagerItemAsList
     */
    protected function resolvePageManagerItemAsList($type, $item, $url, $theme): array
    {
        [$model, $query] = $this->pageManagerTypeToModel($type);
        if (!$model) {
            return [];
        }

        $result = [];

        $records = $model->isClassInstanceOf(\October\Contracts\Database\TreeInterface::class)
            ? $query->getNested()
            : $query->get();

        $recurse = $model->isEntryStructure() && $item->nesting;

        $result['items'] = $this->resolvePageManagerItemAsChildren($records, $item, $theme, $url, $recurse);

        return $result;
    }

    /**
     * resolvePageManagerItemAsReference
     */
    protected function resolvePageManagerItemAsReference($type, $item, $url, $theme): array
    {
        [$model, $query] = $this->pageManagerTypeToModel($type);
        if (!$model) {
            return [];
        }

        if (
            $model->isClassInstanceOf(\October\Contracts\Database\MultisiteInterface::class) &&
            $model->isMultisiteEnabled()
        ) {
            $record = $query->applyOtherSiteRoot($item->reference)->first();
        }
        else {
            $record = $query->find($item->reference);
        }

        if (!$record) {
            return [];
        }

        $pageUrl = $this->getPageManagerPageUrl($item->cmsPage, $record, $theme, $item);

        $result = [
            'url' => $pageUrl,
            'isActive' => $pageUrl == $url,
            'mtime' => $record->updated_at,
            'status' => $record->status_code,
        ];

        if ($item->sites) {
            $result['sites'] = $this->getPageManagerSites($item->cmsPage, $record, $theme);
        }

        if (!$model->isEntryStructure() || !$item->nesting) {
            return $result;
        }

        $result['items'] = $this->resolvePageManagerItemAsChildren($record->children, $item, $theme, $url);

        return $result;
    }

    /**
     * resolvePageManagerItemAsChildren
     */
    protected function resolvePageManagerItemAsChildren($children, $item, $theme, $url, $recursive = true)
    {
        $branch = [];

        foreach ($children as $child) {
            $childUrl = $this->getPageManagerPageUrl($item->cmsPage, $child, $theme);

            $childItem = [
                'url' => $childUrl,
                'isActive' => $childUrl == $url,
                'title' => $child->title,
                'mtime' => $child->updated_at,
                'status' => $child->status_code,
            ];

            if ($item->sites) {
                $childItem['sites'] = $this->getPageManagerSites($item->cmsPage, $child, $theme);
            }

            if ($recursive && $child->children) {
                $childItem['items'] = $this->resolvePageManagerItemAsChildren(
                    $child->children,
                    $item,
                    $theme,
                    $url,
                    $recursive
                );
            }

            $branch[] = $childItem;
        }

        return $branch;
    }

    /**
     * getPageManagerPageUrl
     */
    protected function getPageManagerPageUrl($pageCode, $record, $theme, $item = null)
    {
        $params = $record->makePageUrlParams();

        if ($item) {
            $params = array_merge($params, $this->extractItemUrlParams($item));
        }

        return Cms::pageUrl($pageCode, $params);
    }

    /**
     * extractItemUrlParams returns URL-relevant params from a PageLookupItem,
     * filtering out known metadata keys.
     */
    protected function extractItemUrlParams($item): array
    {
        return \Cms\Models\PageLookupItem::extractUrlParams($item->attributes ?? []);
    }

    /**
     * getPageManagerSites
     */
    protected function getPageManagerSites($pageCode, $record, $theme): array
    {
        if (
            !Site::hasMultiSite() ||
            !$record ||
            !$record->isClassInstanceOf(\October\Contracts\Database\MultisiteInterface::class) ||
            !$record->isMultisiteEnabled()
        ) {
            return [];
        }

        $page = Page::loadCached($theme, $pageCode);
        if (!$page) {
            return [];
        }

        $result = [];
        $otherRecords = $record->newOtherSiteQuery()->get();
        if (!$otherRecords || !$otherRecords->count()) {
            return [];
        }

        foreach (Site::listEnabled() as $site) {
            $otherRecord = $otherRecords->where('site_id', $site->id)->first();
            if (!$otherRecord) {
                continue;
            }

            $url = Cms::siteUrl($page, $site, $otherRecord->makePageUrlParams());

            $result[] = [
                'url' => $url,
                'id' => $site->id,
                'code' => $site->code,
                'locale' => $site->hard_locale,
            ];
        }

        return $result;
    }

    /**
     * pageManagerTypeToModel returns the resolved model and its scoped query for a given type
     */
    protected function pageManagerTypeToModel(string $typeName)
    {
        $model = $query = null;

        $blueprintUuid = $this->getBlueprintUuidFromTypename($typeName);

        if ($blueprint = $this->pageManagerTypeToBlueprint($blueprintUuid)) {
            $model = $blueprint->getModelClassName()::inSectionUuid($blueprintUuid);
            $query = $model->applyVisibleFrontend();
        }

        return [$model, $query];
    }

    /**
     * pageManagerBlueprintToType
     */
    protected function pageManagerBlueprintToType($blueprint): string
    {
        if ($blueprint instanceof EntryBlueprint) {
            return 'entry-' . $blueprint->uuid;
        }

        return '';
    }

    /**
     * pageManagerTypeToBlueprint
     */
    protected function pageManagerTypeToBlueprint($typeName): ?EntryBlueprint
    {
        return BlueprintIndexer::instance()->findSection($typeName);
    }

    /**
     * getBlueprintUuidFromTypename
     */
    protected function getBlueprintUuidFromTypename($typeName)
    {
        if (str_starts_with($typeName, 'list-')) {
            $typeName = substr($typeName, 5);
        }

        if (str_starts_with($typeName, 'entry-')) {
            $typeName = substr($typeName, 6);
        }

        return $typeName;
    }
}
