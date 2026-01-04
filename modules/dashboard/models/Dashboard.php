<?php namespace Dashboard\Models;

use Str;
use Lang;
use Model;
use Cache;
use BackendAuth;
use SystemException;
use ApplicationException;
use Backend\Models\UserPreference;

/**
 * Dashboard definition
 *
 * @property int $id
 * @property string $name
 * @property string $icon
 * @property string $owner_type
 * @property string $owner_field
 * @property string $definition
 * @property bool $is_global
 * @property bool $is_custom
 * @property int $updated_user_id
 * @property int $created_user_id
 * @property \Illuminate\Support\Carbon $updated_at
 * @property \Illuminate\Support\Carbon $created_at
 *
 * @package october\dashboard
 * @author Alexey Bobkov, Samuel Georges
 */
class Dashboard extends Model
{
    use \October\Rain\Database\Traits\Sortable;
    use \October\Rain\Database\Traits\Validation;
    use \October\Rain\Database\Traits\UserFootprints;

    /**
     * @var string table associated with the model
     */
    protected $table = 'dashboard_dashboards';

    /**
     * @var array jsonable attribute names that are json encoded and decoded from the database
     */
    protected $jsonable = ['definition'];

    /**
     * @var array rules for validation
     */
    public $rules = [
        'name' => 'required',
        'code' => 'required|unique:dashboard_dashboards',
        // 'definition' => 'required'
    ];

    /**
     * getCodeAttribute
     */
    public function getCodeAttribute()
    {
        return $this->attributes['code'] ?? $this->owner_field;
    }

    /**
     * getCreatedByNameAttribute
     */
    public function getCreatedByNameAttribute()
    {
        if ($this->is_system) {
            return "System";
        }

        return $this->created_user?->full_name;
    }

    /**
     * fetchDashboard
     */
    public function fetchDashboard($owner, $field)
    {
        $dashboard = self::applyOwner($owner)->where('code', $field)->first();

        if ($userPref = $this->fetchDashboardPreference($owner, $field)) {
            $dashboard->definition = $userPref;
        }

        return $dashboard;
    }

    /**
     * fetchDashboardPreference
     */
    public function fetchDashboardPreference($owner, $field)
    {
        return UserPreference::forUser()->get($this->getUserPreferencesKey($owner, $field));
    }

    /**
     * updateDashboardPreference
     */
    public function updateDashboardPreference($owner, $field, $definition)
    {
        UserPreference::forUser()->set($this->getUserPreferencesKey($owner, $field), $definition);
    }

    /**
     * resetDashboardPreference
     */
    public function resetDashboardPreference($owner, $field)
    {
        UserPreference::forUser()->reset($this->getUserPreferencesKey($owner, $field));
    }

    /**
     * updateDashboard
     */
    public function updateDashboard($owner, $field, $definition)
    {
        $field = strtolower($field);
        if (!strlen($field)) {
            throw new SystemException('Slug must not be empty');
        }

        $dashboard = self::applyOwner($owner)->where('code', $field)->first();
        if (!$dashboard) {
            throw new ApplicationException(
                Lang::get('backend::lang.dashboard.not_found_by_slug', ['slug' => $field])
            );
        }

        $dashboard->is_custom = true;
        $dashboard->definition = $definition;
        $dashboard->save();
    }

    /**
     * scopeListDashboards
     */
    public function scopeListDashboards($query, $owner)
    {
        $dashboards = $query->applyOwner($owner)->get();

        $dashboards = $dashboards->reject(function($dashboard) {
            return $dashboard->created_user_id !== BackendAuth::user()?->id &&
                !$dashboard->is_global;
        });

        return $dashboards;
    }

    /**
     * syncAll dashboard definitions. This will check if the supplied definitions
     * can be customized and then creates an entry for each dashboard in the
     * database.
     */
    public static function syncAll($owner, array $dashboards)
    {
        // @todo check if all dashboard definitions can be customized
        // and if not, halt the process, there is nothing to capture
        // or perhaps checking the "scoreboardMode" property

        $ownerQuery = static::applyOwner($owner);
        $dbDashboards = $ownerQuery
            ->pluck('is_custom', 'owner_field')
            ->all();

        $newDashboards = array_diff_key($dashboards, $dbDashboards);

        // Clean up non-customized templates
        foreach ($dbDashboards as $code => $isCustom) {
            if (!$isCustom && !array_key_exists($code, $dashboards)) {
                $ownerQuery->where('owner_field', $code)->delete();
            }
        }

        // Create new dashboards
        foreach ($newDashboards as $field => $definition) {
            $dashboard = new static;
            $dashboard->owner_type = get_class($owner);
            $dashboard->owner_field = $field;
            $dashboard->is_custom = false;
            $dashboard->is_global = true;
            $dashboard->is_system = true;
            $dashboard->code = $field;
            $dashboard->name = $definition['name'] ?? 'Unknown';
            $dashboard->icon = $definition['icon'] ?? 'icon-globe';
            $dashboard->is_interval_hidden = !($definition['showInterval'] ?? 1) ? 1 : 0;
            $dashboard->forceSave();
        }
    }

    /**
     * scopeApplyOwner
     */
    public function scopeApplyOwner($query, $owner)
    {
        if (!is_string($owner)) {
            $owner = get_class($owner);
        }

        return $query->where('owner_type', $owner);
    }

    /**
     * scopeApplyCreatedUserOrSystem
     */
    public function scopeApplyCreatedUserOrSystem($query, $user = null)
    {
        if ($user === null) {
            $user = BackendAuth::user();
        }

        return $query->where(function($query) use ($user) {
            $query
                ->where('created_user_id', $user->getKey())
                ->orWhere('is_system', true)
            ;
        });
    }

    /**
     * getUserPreferencesKey
     */
    protected function getUserPreferencesKey($owner, $field)
    {
        if (!is_string($owner)) {
            $owner = Str::getClassId($owner);
        }

        return "dashboard::layout.{$owner}.{$field}";
    }
}
