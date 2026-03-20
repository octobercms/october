<?php namespace System\Models;

use Site;
use Model;
use ValidationException;

/**
 * SiteGroup
 *
 * @package october\system
 * @author Alexey Bobkov, Samuel Georges
 */
class SiteGroup extends Model
{
    use \October\Rain\Database\Traits\Validation;

    /**
     * @var string The database table used by the model.
     */
    public $table = 'system_site_groups';

    /**
     * @var array Validation rules
     */
    public $rules = [
        'code' => 'required',
        'name' => 'required',
    ];

    /**
     * @var array hasMany
     */
    public $hasMany = [
        'sites' => [SiteDefinition::class, 'key' => 'group_id'],
    ];

    /**
     * isConfigured returns true if a group has been configured
     */
    public static function isConfigured()
    {
        return static::count() > 1;
    }

    /**
     * syncDefaultGroup ensures a default site group exists so site_group_id is never null.
     * The afterCreate hook will auto-adopt any orphaned sites.
     */
    public static function syncDefaultGroup()
    {
        if (static::count() > 0) {
            return;
        }

        static::create([
            'name' => 'Default',
            'code' => 'default',
        ]);
    }

    /**
     * beforeDelete
     */
    public function beforeDelete()
    {
        if (($count = $this->sites()->count()) > 0) {
            throw new ValidationException(['name' => __("Unable to delete site group because it is being used by existing site definitions (:count).", ['count' => $count])]);
        }
    }

    /**
     * afterDelete
     */
    public function afterDelete()
    {
        PluginSiteGroup::where('site_group_id', $this->id)->delete();

        Site::resetCache();
    }

    /**
     * afterSave
     */
    public function afterSave()
    {
        Site::resetCache();
    }
}
