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
}