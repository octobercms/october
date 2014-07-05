<?php namespace System\Models;

use Model;
use Config;
use System\Classes\PluginManager;

class PluginVersion extends Model
{

    public $table = 'system_plugin_versions';

    /**
     * @var array Guarded fields
     */
    protected $guarded = ['*'];

    /**
     * @var array List of attribute names which should not be saved to the database.
     */
    protected $purgeable = ['name', 'description', 'orphaned', 'author', 'icon'];

    public $timestamps = false;

    protected static $versionCache = null;

    public $disabledBySystem = false;

    public $disabledByConfig = false;

    public $orphaned = false;

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
                $this->{$attribute} = $info;
            }

            if ($this->is_disabled)
                $manager->disablePlugin($this->code, true);
            else
                $manager->enablePlugin($this->code, true);

            $this->disabledBySystem = $pluginObj->disabled;

            if (($configDisabled = Config::get('cms.disablePlugins')) && is_array($configDisabled)) {
                $this->disabledByConfig = in_array($this->code, $configDisabled);
            }
        }
        else {
            $this->name = $this->code;
            $this->description = 'Plugin has been removed from the file system.';
            $this->orphaned = true;
        }

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

}