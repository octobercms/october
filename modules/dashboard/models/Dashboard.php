<?php namespace Dashboard\Models;

use Str;
use Lang;
use Model;
use Cache;
use BackendAuth;
use SystemException;
use ApplicationException;
use Backend\Models\UserRole;
use Backend\Models\UserPreference;
use Dashboard\Classes\DashManager;

/**
 * Dashboard definition
 *
 * @property int $id
 * @property string $name
 * @property string $icon
 * @property string $owner_type
 * @property string $owner_field
 * @property string $definition
 * @property string $default_start
 * @property string $default_end
 * @property string $default_interval
 * @property string $default_compare
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
     * @var array belongsToMany relation
     */
    public $belongsToMany = [
        'roles' => [
            UserRole::class,
            'table' => 'dashboard_dashboards_roles',
            'key' => 'dashboard_id',
            'otherKey' => 'role_id'
        ]
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
            $dashboard->is_personalized = true;
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
                __("Cannot find a dashboard with the specified slug: \":slug\".", ['slug' => $field])
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
        $dashboards = $query->applyOwner($owner)->with('roles')->get();

        $user = BackendAuth::user();
        $userRoleId = $user?->role_id;

        $dashboards = $dashboards->reject(function($dashboard) use ($user, $userRoleId) {
            if ($dashboard->is_hidden) {
                return true;
            }

            if ($dashboard->is_system && !DashManager::instance()->hasDashboardAccess($dashboard->code, $user)) {
                return true;
            }

            if ($dashboard->created_user_id === $user?->id) {
                return false;
            }

            if ($dashboard->is_global) {
                return false;
            }

            if ($userRoleId && $dashboard->roles->contains('id', $userRoleId)) {
                return false;
            }

            return true;
        });

        return $dashboards;
    }

    /**
     * getRolesOptions
     */
    public function getRolesOptions()
    {
        return UserRole::pluck('name', 'id')->all();
    }

    /**
     * syncAll creates a system dashboard for each definition keyed by code, removing
     * those no longer defined unless customized, which are kept as regular dashboards.
     */
    public static function syncAll($owner, array $dashboards)
    {
        // @todo check if all dashboard definitions can be customized
        // and if not, halt the process, there is nothing to capture
        // or perhaps checking the "scoreboardMode" property

        $ownerType = is_string($owner) ? $owner : get_class($owner);

        $syncedDashboards = static::applyOwner($ownerType)
            ->whereNotNull('owner_field')
            ->get(['id', 'owner_field', 'is_custom', 'is_system', 'is_interval_hidden'])
            ->keyBy('owner_field');

        foreach ($syncedDashboards as $code => $dashboard) {
            $definition = $dashboards[$code] ?? null;

            if ($definition === null && !$dashboard->is_custom) {
                static::whereKey($dashboard->getKey())->delete();
                continue;
            }

            // System dashboards follow the definition for the interval setting, since it is not editable
            $attributes = ['is_system' => $definition !== null];
            if ($definition !== null) {
                $attributes['is_interval_hidden'] = !($definition['showInterval'] ?? true);
            }

            $changed = array_filter($attributes, fn($value, $key) => (bool) $dashboard->$key !== $value, ARRAY_FILTER_USE_BOTH);
            if ($changed) {
                static::whereKey($dashboard->getKey())->update($changed);
            }
        }

        // Codes already used by other dashboards are not claimed
        $usedCodes = static::applyOwner($ownerType)->pluck('code')->all();

        foreach (array_diff_key($dashboards, $syncedDashboards->all()) as $field => $definition) {
            if (in_array((string) $field, $usedCodes, true)) {
                continue;
            }

            $dashboard = new static;
            $dashboard->owner_type = $ownerType;
            $dashboard->owner_field = $field;
            $dashboard->is_custom = false;
            $dashboard->is_global = true;
            $dashboard->is_system = true;
            $dashboard->code = $field;
            $dashboard->name = $definition['name'] ?? 'Unknown';
            $dashboard->icon = $definition['icon'] ?? 'icon-globe';
            $dashboard->is_interval_hidden = !($definition['showInterval'] ?? 1) ? 1 : 0;
            $dashboard->default_start = $definition['defaultStart'] ?? null;
            $dashboard->default_end = $definition['defaultEnd'] ?? null;
            $dashboard->default_interval = $definition['defaultInterval'] ?? null;
            $dashboard->default_compare = $definition['defaultCompare'] ?? null;
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
