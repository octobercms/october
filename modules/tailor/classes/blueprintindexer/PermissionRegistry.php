<?php namespace Tailor\Classes\BlueprintIndexer;

use Tailor\Classes\PermissionItem;
use Tailor\Classes\Blueprint\EntryBlueprint;
use Tailor\Classes\Blueprint\SingleBlueprint;
use Tailor\Classes\Blueprint\GlobalBlueprint;

/**
 * PermissionRegistry
 *
 * @package october\tailor
 * @author Alexey Bobkov, Samuel Georges
 */
trait PermissionRegistry
{
    /**
     * @var string permissionCacheKey
     */
    protected $permissionCacheKey = 'permission';

    /**
     * listBlueprintPermissions
     */
    protected function listBlueprintPermissions(): array
    {
        $result = [];

        foreach ($this->listPermissionsRaw() as $attributes) {
            $result[] = (new PermissionItem)->useConfig($attributes);
        }

        return $result;
    }

    /**
     * listPermissionsRaw
     */
    protected function listPermissionsRaw(): array
    {
        $records = $this->getCache($this->permissionCacheKey);

        if (!$records) {
            $records = $this->indexPermissions();
        }

        return $records;
    }

    /**
     * getPermissionDefinitions
     */
    public function getPermissionDefinitions(): array
    {
        $result = [];

        foreach ($this->listBlueprintPermissions() as $item) {
            $result += $item->toBackendPermissionArray();
        }

        return $result;
    }

    /**
     * indexPermissions
     */
    public function indexPermissions(): array
    {
        $newIndex = $this->findAllPermissionBlueprints();

        $this->putCache($this->permissionCacheKey, $newIndex);

        return $newIndex;
    }

    /**
     * findAllFieldsetBlueprints will spin over all fieldset sources
     */
    protected function findAllPermissionBlueprints(): array
    {
        $result = [];

        // Sections
        foreach (EntryBlueprint::listInProject() as $blueprint) {
            if ($config = $this->buildPermissionConfig($blueprint)) {
                $result[$blueprint->uuid] = $config;
            }
        }

        // Globals
        foreach (GlobalBlueprint::listInProject() as $blueprint) {
            if ($config = $this->buildPermissionConfig($blueprint)) {
                $result[$blueprint->uuid] = $config;
            }
        }

        return $result;
    }

    /**
     * buildPermissionConfig
     */
    protected function buildPermissionConfig($blueprint): ?array
    {
        $name = $blueprint->getPermissionsOption('label') ?: $blueprint->name;

        $config = [];
        $config['prefix'] = $blueprint->getPermissionCodeName();
        $config['uuid'] = $blueprint->uuid;
        $config['handle'] = $blueprint->handle;
        $config['label'] = $name;

        if ($blueprint instanceof EntryBlueprint) {
            $config['useMulti'] = true;
            $config['usePublish'] = true;
            $config['useDrafts'] = $blueprint->useDrafts();
            $config['baseLabel'] = __('Update :name Entries', ['name' => $name]);

            if ($blueprint instanceof SingleBlueprint) {
                $config['useMulti'] = false;
                $config['usePublish'] = true;
                $config['useDrafts'] = $blueprint->useDrafts();
                $config['baseLabel'] = __('Update :name', ['name' => $name]);
            }
        }

        if ($blueprint instanceof GlobalBlueprint) {
            $config['baseLabel'] = __('Update :name', ['name' => $name]);
        }

        return $config;
    }
}
