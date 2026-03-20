<?php namespace Tailor\Classes\BlueprintIndexer;

use Backend;
use Tailor\Classes\NavigationItem;
use System\Classes\SettingsManager;
use Tailor\Classes\Blueprint\EntryBlueprint;
use Tailor\Classes\Blueprint\GlobalBlueprint;

/**
 * NavigationRegistry
 *
 * @package october\tailor
 * @author Alexey Bobkov, Samuel Georges
 */
trait NavigationRegistry
{
    /**
     * @var string navigationCacheKey
     */
    protected $navigationCacheKey = 'navigation';

    /**
     * listPrimaryNavigation
     */
    protected function listPrimaryNavigation(): array
    {
        $result = [];

        foreach ($this->listFilteredNavigationRaw()[0] as $attributes) {
            $result[] = (new NavigationItem)->useConfig($attributes);
        }

        return $result;
    }

    /**
     * listSecondaryNavigation
     */
    protected function listSecondaryNavigation(): array
    {
        $result = [];

        foreach ($this->listFilteredNavigationRaw()[1] as $attributes) {
            $result[] = (new NavigationItem)->useConfig($attributes);
        }

        return $result;
    }

    /**
     * listFilteredNavigationRaw applies the site/theme filter to the blueprint navigation
     * this allows theme-based blueprints to not appear in the menu.
     */
    protected function listFilteredNavigationRaw(): array
    {
        $records = $this->listNavigationRaw();

        $themeDatasource = $this->getActiveThemeDatasource();
        if (!$themeDatasource) {
            return $records;
        }

        foreach ($records as &$collection) {
            foreach ($collection as $key => $attributes) {
                if ($themeCode = $attributes['_theme'] ?? false) {
                    if ($themeCode === false || $themeCode !== $themeDatasource) {
                        unset($collection[$key]);
                    }
                }
            }
        }

        return $records;
    }

    /**
     * listNavigationRaw
     */
    protected function listNavigationRaw(): array
    {
        $records = $this->getCache($this->navigationCacheKey);

        if (!$records) {
            $records = $this->indexNavigation();
        }

        return $records;
    }

    /**
     * findPrimaryNavigation
     */
    public function findPrimaryNavigation($uuid): ?NavigationItem
    {
        $index = $this->listNavigationRaw()[0];

        if (!isset($index[$uuid])) {
            return null;
        }

        return (new NavigationItem)->useConfig($index[$uuid]);
    }

    /**
     * findSecondaryNavigation
     */
    public function findSecondaryNavigation($uuid): ?NavigationItem
    {
        $index = $this->listNavigationRaw()[1];

        if (!isset($index[$uuid])) {
            return null;
        }

        return (new NavigationItem)->useConfig($index[$uuid]);
    }

    /**
     * indexNavigation
     */
    public function indexNavigation(): array
    {
        $newIndex = $this->findAllNavigationBlueprints();

        $this->putCache($this->navigationCacheKey, $newIndex);

        return $newIndex;
    }

    /**
     * findAllFieldsetBlueprints will spin over all fieldset sources
     */
    protected function findAllNavigationBlueprints(): array
    {
        $primary = [];
        $secondary = [];

        // Sections
        foreach (EntryBlueprint::listInProject() as $blueprint) {
            if ($config = $this->buildNavigationConfig($blueprint, true)) {
                $primary[$blueprint->uuid] = $config;
            }

            if ($config = $this->buildNavigationConfig($blueprint)) {
                $secondary[$blueprint->uuid] = $config;
            }

            if ($config = $this->buildExtraNavigationConfig($blueprint)) {
                $secondary += $config;
            }
        }

        // Globals
        foreach (GlobalBlueprint::listInProject() as $blueprint) {
            if ($config = $this->buildNavigationConfig($blueprint, true)) {
                $primary[$blueprint->uuid] = $config;
            }

            if ($config = $this->buildNavigationConfig($blueprint)) {
                $secondary[$blueprint->uuid] = $config;
            }

            if ($config = $this->buildExtraNavigationConfig($blueprint)) {
                $secondary += $config;
            }
        }

        // Post processing
        foreach ($secondary as &$item) {
            if (!isset($item['parent'])) {
                continue;
            }

            $parentUuid = $this->findParentConfigUuid($primary, $item['parent']);
            if (!$parentUuid) {
                continue;
            }

            // Set parent code
            if (isset($primary[$parentUuid]['code'])) {
                $item['parentCode'] = $primary[$parentUuid]['code'];
            }

            // Combine permissions
            if (isset($item['permissionCode'][0])) {
                $primary[$parentUuid]['permissionCode'][] = $item['permissionCode'][0];
            }
        }

        return [$primary, $secondary];
    }

    /**
     * findParentConfigUuid
     */
    protected function findParentConfigUuid(array $index, string $handleOrUuid): string
    {
        // UUID found
        if (isset($index[$handleOrUuid])) {
            return $handleOrUuid;
        }

        // Handle found
        foreach ($index as $uuid => $attributes) {
            if (isset($attributes['handle']) && $attributes['handle'] === $handleOrUuid) {
                return $uuid;
            }
        }

        return '';
    }

    /**
     * buildNavigationConfig builds navigation config based on blueprint relationships
     */
    protected function buildNavigationConfig($blueprint, bool $isPrimary = false): ?array
    {
        $prop = $isPrimary ? 'primaryNavigation' : 'navigation';
        $isDefined = isset($blueprint->$prop);

        // Primary definitions have no default
        if ($isPrimary && !$isDefined) {
            return null;
        }

        // Explicitly disabled by config
        if ($isDefined && $blueprint->$prop === false) {
            return null;
        }

        // Begin building with default values
        $config = $isDefined ? $blueprint->$prop : [];
        $config['_theme'] = $blueprint->getDatasourceTheme();
        $config['uuid'] = $blueprint->uuid;
        $config['handle'] = $blueprint->handle;
        $config['hasPrimary'] = (bool) $blueprint->primaryNavigation;
        $config['code'] = $blueprint->getNavigationCodeName();

        if ($blueprint instanceof EntryBlueprint) {
            $config['url'] = 'tailor/entries/'.$blueprint->handleSlug;
            $config['mode'] = $config['mode'] ?? NavigationItem::MODE_CONTENT;
        }

        if ($blueprint instanceof GlobalBlueprint) {
            $config['url'] = 'tailor/globals/'.$blueprint->handleSlug;
            $config['mode'] = $config['mode'] ?? NavigationItem::MODE_SETTINGS;
            $config['category'] = $config['category'] ?? SettingsManager::CATEGORY_GLOBALS;
        }

        if (!isset($config['label'])) {
            $config['label'] = $blueprint->name;
        }

        if (!isset($config['description'])) {
            $config['description'] = $blueprint->description;
        }

        $config['permissionCode'] = [$blueprint->getPermissionCodeName()];

        return $config;
    }

    /**
     * buildExtraNavigationConfig used to inject manually specified navigation definitions
     */
    protected function buildExtraNavigationConfig($blueprint): ?array
    {
        if (!isset($blueprint->extraNavigation) || !is_array($blueprint->extraNavigation)) {
            return null;
        }

        $extraConfig = [];
        foreach ($blueprint->extraNavigation as $code => $definition) {
            if (!is_array($definition)) {
                continue;
            }

            $config = $definition;
            $config['code'] = $code;
            $config['uuid'] = $blueprint->uuid;
            $config['handle'] = $blueprint->handle;
            $config['hasPrimary'] = (bool) $blueprint->primaryNavigation;
            $config['permissionCode'] = [$blueprint->getPermissionCodeName()];

            if ($parentReference = $blueprint->navigation['parent'] ?? null) {
                $config['parent'] = $parentReference;
            }

            $extraConfig[$blueprint->uuid.$code] = $config;
        }

        return $extraConfig;
    }

    /**
     * getNavigationContentMainMenu
     */
    public function getNavigationContentMainMenu(): array
    {
        $sideMenu = $this->getNavigationContentSideMenu();
        if (!$sideMenu) {
            return [];
        }

        return [
            'tailor' => [
                'label' => 'Content',
                'icon' => 'icon-pencil-square',
                'iconSvg' => 'modules/tailor/assets/images/tailor-icon.svg',
                'url' => Backend::url('tailor/entries'),
                'order' => 140,
                'sideMenu' => $sideMenu,
                'permissions' => $this->buildParentNavigationPermissions($sideMenu),
            ]
        ];
    }

    /**
     * getNavigationContentMenu
     */
    public function getNavigationContentSideMenu(): array
    {
        $result = [];

        foreach ($this->listSecondaryNavigation() as $item) {
            if ($item->mode !== NavigationItem::MODE_CONTENT) {
                continue;
            }

            $result[$item->code] = $item->toBackendMenuArray();
        }

        return $result;
    }

    /**
     * getNavigationMainMenu
     */
    public function getNavigationMainMenu(): array
    {
        $result = [];

        foreach ($this->listPrimaryNavigation() as $item) {
            $sideMenu = $this->getNavigationSideMenu($item);

            $result[$item->code] = $item->toBackendMenuArray() + [
                'sideMenu' => $sideMenu,
                'permissions' => $this->buildParentNavigationPermissions($sideMenu),
            ];
        }

        return $result;
    }

    /**
     * getNavigationSideMenu
     */
    public function getNavigationSideMenu($parentItem): array
    {
        $result = [];
        $primaryItem = false;

        foreach ($this->listSecondaryNavigation() as $item) {
            if (!in_array($item->mode, [NavigationItem::MODE_PRIMARY, NavigationItem::MODE_SECONDARY])) {
                continue;
            }

            if ($item->mode === NavigationItem::MODE_PRIMARY && $item->uuid === $parentItem->uuid) {
                $result[$item->code] = $item->toBackendMenuArray();
                $primaryItem = true;
            }

            if ($item->mode === NavigationItem::MODE_SECONDARY &&
                ($item->parent === $parentItem->uuid || $item->parent === $parentItem->handle)
            ) {
                $result[$item->code] = $item->toBackendMenuArray();
                $primaryItem = false;
            }
        }

        // If there is an orphaned auto generated primary item,
        // remove it to disable the secondary navigation
        if ($primaryItem && count($result) === 1) {
            $result = [];
        }

        return $result;
    }

    /**
     * getNavigationSettingsMenu
     */
    public function getNavigationSettingsMenu(): array
    {
        $result = [];

        foreach ($this->listSecondaryNavigation() as $item) {
            if ($item->mode !== NavigationItem::MODE_SETTINGS) {
                continue;
            }

            $result[$item->code] = $item->toBackendSettingsArray();
        }

        return $result;
    }

    /**
     * buildParentNavigationPermissions
     */
    protected function buildParentNavigationPermissions($items)
    {
        $permissions = [];

        foreach ($items as $item) {
            if (isset($item['permissions']) && is_array($item['permissions'])) {
                $permissions = array_merge($permissions, $item['permissions']);
            }
        }

        return $permissions;
    }
}
