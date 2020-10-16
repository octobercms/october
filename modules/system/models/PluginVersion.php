<?php namespace System\Models;

use Event;
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
    protected static $versionCache;

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
     * After the model is saved
     */
    public function afterSave()
    {
        if (!$this->getOriginal('is_disabled') && $this->is_disabled) {
            /**
             * @event system.plugins.afterDisable
             * Provides an opportunity to take actions after a plugin has been disabled.
             *
             * Example usage:
             *
             *     Event::listen('system.plugins.afterDisable', function ((String) $pluginCode) {
             *         trace_log('Plugin ' . $pluginCode . ' has been disabled.');
             *     });
             *
             */
            Event::fire('system.plugins.afterDisable', [$this->code]);
        } elseif ($this->getOriginal('is_disabled') && !$this->is_disabled) {
            /**
             * @event system.plugins.afterEnable
             * Provides an opportunity to take actions after a plugin has been enabled.
             *
             * Example usage:
             *
             *     Event::listen('system.plugins.afterEnable', function ((String) $pluginCode) {
             *         trace_log('Plugin ' . $pluginCode . ' has been enabled.');
             *     });
             *
             */
            Event::fire('system.plugins.afterEnable', [$this->code]);
        }
        if (!$this->getOriginal('is_frozen') && $this->is_frozen) {
            /**
             * @event system.plugins.afterFreeze
             * Provides an opportunity to take actions after a plugin has been frozen.
             *
             * Example usage:
             *
             *     Event::listen('system.plugins.afterFreeze', function ((String) $pluginCode) {
             *         trace_log('Plugin ' . $pluginCode . ' has been frozen.');
             *     });
             *
             */
            Event::fire('system.plugins.afterFreeze', [$this->code]);
        } elseif ($this->getOriginal('is_frozen') && !$this->is_frozen) {
            /**
             * @event system.plugins.afterUnfreeze
             * Provides an opportunity to take actions after a plugin has been unfrozen.
             *
             * Example usage:
             *
             *     Event::listen('system.plugins.afterUnfreeze
             *         trace_log('Plugin ' . $pluginCode . ' has been unfrozen.');
             *     });
             *
             */
            Event::fire('system.plugins.afterUnfreeze', [$this->code]);
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

        return self::$versionCache[$pluginCode] ?? null;
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
