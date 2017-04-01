<?php namespace System\Models;

use Lang;
use Model;
use Config;
use System\Classes\PluginManager;

/**
 * Stores information about current plugin versions.
 *
 * @package october\system
 * @author Alexey Bobkov, Samuel Georges
 */
class PluginVersion extends Model
{
    public $table = 'system_plugin_versions';

    /**
     * @var array Guarded fields
     */
    protected $guarded = ['*'];

    /**
     * @var bool Disable model timestamps.
     */
    public $timestamps = false;

    /**
     * @var array Cache store for version information
     */
    protected static $versionCache = null;

    /**
     * @var bool Plugin has been disabled by a missing dependency.
     */
    public $disabledBySystem = false;

    /**
     * @var bool Plugin has been disabled by the user or configuration.
     */
    public $disabledByConfig = false;

    /**
     * @var bool If true, plugin exists in the database but not the filesystem.
     */
    public $orphaned = false;

    /**
     * @var string Plugin name, sourced from plugin details
     */
    public $name;

    /**
     * @var string Plugin description, sourced from plugin details
     */
    public $description;

    /**
     * @var string Plugin author, sourced from plugin details
     */
    public $author;

    /**
     * @var string Plugin icon, sourced from plugin details
     */
    public $icon;

    /**
     * @var string Plugin homepage, sourced from plugin details
     */
    public $homepage;

    /**
     * The accessors to append to the model's array form.
     * @var array
     */
    protected $appends = ['slug'];

    /**
     * After the model is populated
     */
    public function afterFetch()
    {
        /*
         * Override the database columns with the plugin details
         * found in the plugin registration file.
         */
        $manager = PluginManager::instance();
        $pluginObj = $manager->findByIdentifier($this->code);

        if ($pluginObj) {
            $pluginInfo = $pluginObj->pluginDetails();
            foreach ($pluginInfo as $attribute => $info) {
                if (property_exists($this, $attribute)) {
                    $this->{$attribute} = Lang::get($info);
                }
            }

            if ($this->is_disabled) {
                $manager->disablePlugin($this->code, true);
            }
            else {
                $manager->enablePlugin($this->code, true);
            }

            $this->disabledBySystem = $pluginObj->disabled;

            if (($configDisabled = Config::get('cms.disablePlugins')) && is_array($configDisabled)) {
                $this->disabledByConfig = in_array($this->code, $configDisabled);
            }
        }
        else {
            $this->name = $this->code;
            $this->description = Lang::get('system::lang.plugins.unknown_plugin');
            $this->orphaned = true;
        }
    }

    /**
     * Returns true if the plugin should be updated by the system.
     * @return bool
     */
    public function getIsUpdatableAttribute()
    {
        return !$this->is_disabled && !$this->disabledBySystem && !$this->disabledByConfig;
    }

    /**
     * Only include enabled plugins
     * @param $query
     * @return mixed
     */
    public function scopeApplyEnabled($query)
    {
        return $query->where('is_disabled', '!=', 1);
    }

    /**
     * Returns the current version for a plugin
     * @param  string $pluginCode Plugin code. Eg: Acme.Blog
     * @return string
     */
    public static function getVersion($pluginCode)
    {
        if (self::$versionCache === null) {
            self::$versionCache = self::lists('version', 'code');
        }

        return isset(self::$versionCache[$pluginCode])
            ? self::$versionCache[$pluginCode]
            : null;
    }

    /**
     * Provides the slug attribute.
     */
    public function getSlugAttribute()
    {
        return self::makeSlug($this->code);
    }

    /**
     * Generates a slug for the plugin.
     */
    public static function makeSlug($code)
    {
        return strtolower(str_replace('.', '-', $code));
    }
}
