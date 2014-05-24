<?php namespace System\Models;

use Model;
use System\Classes\PluginManager;

class PluginVersion extends Model
{

    public $table = 'system_plugin_versions';

    /**
     * @var array Guarded fields
     */
    protected $guarded = ['*'];

    protected static $versionCache = null;

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