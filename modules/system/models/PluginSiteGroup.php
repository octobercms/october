<?php namespace System\Models;

use Model;

/**
 * PluginSiteGroup tracks per-site and per-site-group plugin enabled/disabled state.
 *
 * @package october\system
 * @author Alexey Bobkov, Samuel Georges
 */
class PluginSiteGroup extends Model
{
    /**
     * @var string table associated with the model
     */
    public $table = 'system_plugin_site_groups';

    /**
     * @var bool timestamps enabled
     */
    public $timestamps = false;

    /**
     * @var array guarded fields
     */
    protected $guarded = ['*'];

    /**
     * listDisabledForSite returns plugin codes disabled for a given site
     */
    public static function listDisabledForSite(int $siteId): array
    {
        return static::where('site_id', $siteId)
            ->where('is_enabled', 0)
            ->pluck('plugin_code')
            ->all();
    }

    /**
     * listDisabledForGroup returns plugin codes disabled for a given site group
     */
    public static function listDisabledForGroup(int $siteGroupId): array
    {
        return static::where('site_group_id', $siteGroupId)
            ->where('is_enabled', 0)
            ->pluck('plugin_code')
            ->all();
    }

    /**
     * setDisabledForSite disables a plugin for a specific site
     */
    public static function setDisabledForSite(string $pluginCode, int $siteId): void
    {
        static::updateOrInsert(
            ['plugin_code' => $pluginCode, 'site_id' => $siteId, 'site_group_id' => null],
            ['is_enabled' => 0]
        );
    }

    /**
     * setEnabledForSite enables a plugin for a specific site (removes override)
     */
    public static function setEnabledForSite(string $pluginCode, int $siteId): void
    {
        static::where('plugin_code', $pluginCode)
            ->where('site_id', $siteId)
            ->delete();
    }

    /**
     * setDisabledForGroup disables a plugin for a specific site group
     */
    public static function setDisabledForGroup(string $pluginCode, int $siteGroupId): void
    {
        static::updateOrInsert(
            ['plugin_code' => $pluginCode, 'site_id' => null, 'site_group_id' => $siteGroupId],
            ['is_enabled' => 0]
        );
    }

    /**
     * setEnabledForGroup enables a plugin for a specific site group (removes override)
     */
    public static function setEnabledForGroup(string $pluginCode, int $siteGroupId): void
    {
        static::where('plugin_code', $pluginCode)
            ->where('site_group_id', $siteGroupId)
            ->delete();
    }
}
