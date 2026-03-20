<?php namespace System\Models\PluginVersion;

use Site;
use System\Models\PluginSiteGroup;
use System\Classes\PluginManager;

/**
 * HasDisabledContext adds per-site and per-site-group disabled state
 * to the PluginVersion model, providing a unified interface for checking
 * and toggling the disabled state based on the current site context.
 *
 * @package october\system
 * @author Alexey Bobkov, Samuel Georges
 */
trait HasDisabledContext
{
    /**
     * @var array|null contextDisabledCodes is a cached list of disabled plugin codes
     * for the current site context. Shared across all instances per request.
     */
    protected static $contextDisabledCodes;

    /**
     * getContextDisabledAttribute returns true if the plugin is disabled, considering
     * the current site context. Falls back to global is_disabled when no context.
     */
    public function getContextDisabledAttribute()
    {
        $codes = static::listContextDisabledCodes();

        if ($codes === null) {
            return (bool) $this->is_disabled;
        }

        return in_array($this->code, $codes);
    }

    /**
     * setContextDisabled disables this plugin for the current site context,
     * or globally if no site context is active.
     */
    public function setContextDisabled()
    {
        $context = static::getPluginSiteContext();

        if ($context) {
            if ($context['type'] === 'site') {
                PluginSiteGroup::setDisabledForSite($this->code, $context['id']);
            }
            else {
                PluginSiteGroup::setDisabledForGroup($this->code, $context['id']);
            }

            // Clear global disable if it was set before per-site features were enabled
            if ($this->is_disabled) {
                $this->is_disabled = 0;
                $this->save();
            }
        }
        else {
            $this->is_disabled = 1;
            $this->save();
            PluginManager::instance()->disablePlugin($this->code, true);
        }
    }

    /**
     * setContextEnabled enables this plugin for the current site context,
     * or globally if no site context is active.
     */
    public function setContextEnabled()
    {
        $context = static::getPluginSiteContext();

        if ($context) {
            if ($context['type'] === 'site') {
                PluginSiteGroup::setEnabledForSite($this->code, $context['id']);
            }
            else {
                PluginSiteGroup::setEnabledForGroup($this->code, $context['id']);
            }

            // Clear global disable if it was set before per-site features were enabled
            if ($this->is_disabled) {
                $this->is_disabled = 0;
                $this->save();
            }
        }
        else {
            $this->is_disabled = 0;
            $this->save();
            PluginManager::instance()->enablePlugin($this->code, true);
        }
    }

    /**
     * listContextDisabledCodes returns the list of plugin codes disabled for
     * the current site context, or null if no site context is active.
     */
    protected static function listContextDisabledCodes(): ?array
    {
        if (static::$contextDisabledCodes !== null) {
            return static::$contextDisabledCodes;
        }

        $context = static::getPluginSiteContext();

        if (!$context) {
            return static::$contextDisabledCodes = null;
        }

        return static::$contextDisabledCodes = $context['type'] === 'site'
            ? PluginSiteGroup::listDisabledForSite($context['id'])
            : PluginSiteGroup::listDisabledForGroup($context['id']);
    }

    /**
     * getPluginSiteContext returns the active site or site group context
     * for per-site plugin filtering, or null if the feature is not active.
     */
    public static function getPluginSiteContext(): ?array
    {
        if (Site::hasFeature('system_plugin_sites')) {
            if ($siteId = Site::getSiteIdFromContext()) {
                return ['type' => 'site', 'id' => $siteId];
            }
        }
        elseif (Site::hasFeature('system_plugin_site_groups')) {
            if ($siteGroupId = Site::getSiteGroupIdFromContext()) {
                return ['type' => 'group', 'id' => $siteGroupId];
            }
        }

        return null;
    }

    /**
     * resetContextDisabledCache clears the cached context disabled codes
     * so they are re-fetched on the next access.
     */
    public static function resetContextDisabledCache()
    {
        static::$contextDisabledCodes = null;
    }
}
