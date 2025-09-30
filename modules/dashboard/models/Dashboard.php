<?php namespace Dashboard\Models;

use Lang;
use Model;
use Cache;
use BackendAuth;
use SystemException;
use ApplicationException;
use Backend\Models\User;

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
     * @var string PERMISSION_CACHE_KEY for the dashboard lookup
     */
    const PERMISSION_CACHE_KEY = 'dashboard.dashboard_permission_cache';

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
     * afterSave model event
     */
    public function afterSave()
    {
        $this->clearCache();
    }

    /**
     * getCodeAttribute
     */
    public function getCodeAttribute()
    {
        return $this->attributes['code'] ?? $this->owner_field;
    }

    /**
     * fetchDashboard
     */
    public static function fetchDashboard($owner, $code)
    {
        return self::applyOwner($owner)->where('code', $code)->first();
    }

    /**
     * listDashboards
     */
    public static function listDashboards($owner)
    {
        $dashboards = self::applyOwner($owner)->get();

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
            $dashboard->code = $field;
            $dashboard->name = $definition['name'] ?? 'Unknown';
            $dashboard->icon = $definition['icon'] ?? 'icon-globe';
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
     * updateDashboard
     */
    public static function updateDashboard($owner, $field, $definition)
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
     * createDashboard
     */
    public static function createDashboard(string $name, string $slug, string $icon, ?int $userId, bool $globalAccess, ?string $definition = null)
    {
        $slug = strtolower($slug);
        self::validateSlug($slug);
        if (self::where('slug', $slug)->first()) {
            throw new ApplicationException(
                Lang::get('backend::lang.dashboard.slug_already_exists', ['slug' => $slug])
            );
        }

        $dashboard = new Dashboard();
        $dashboard->name = $name;
        $dashboard->slug = $slug;
        $dashboard->icon = $icon;
        $dashboard->definition = $definition ?? '[{"widgets":[]}]';
        $dashboard->created_user_id = $userId;
        $dashboard->is_global = $globalAccess;
        $dashboard->validate();
        $dashboard->save();
    }

    public static function updateDashboardConfig(string $originalSlug, string $name, string $slug, string $icon, bool $globalAccess)
    {
        $slug = strtolower($slug);
        $originalSlug = strtolower($originalSlug);

        $dashboard = self::where('slug', $originalSlug)->first();
        if (!$dashboard) {
            throw new ApplicationException(
                Lang::get('backend::lang.dashboard.not_found_by_slug', ['slug' => $originalSlug])
            );
        }

        if (self::where('slug', $slug)->where('id', '<>', $dashboard->id)->first()) {
            throw new ApplicationException(
                Lang::get('backend::lang.dashboard.slug_already_exists', ['slug' => $slug])
            );
        }

        self::validateSlug($slug);

        $dashboard->name = $name;
        $dashboard->slug = $slug;
        $dashboard->icon = $icon;
        $dashboard->is_global = $globalAccess;
        $dashboard->validate();
        $dashboard->save();
    }

    public static function deleteDashboard(string $slug)
    {
        $slug = strtolower($slug);
        $dashboard = self::where('slug', $slug)->first();
        if (!$dashboard) {
            throw new ApplicationException(
                Lang::get('backend::lang.dashboard.not_found_by_slug', ['slug' => $slug])
            );
        }

        $dashboard->delete();
    }

    public static function getConfigurationAsJson(string $slug)
    {
        $slug = strtolower($slug);
        $dashboard = self::where('slug', $slug)->first();
        if (!$dashboard) {
            throw new ApplicationException(
                Lang::get('backend::lang.dashboard.not_found_by_slug', ['slug' => $slug])
            );
        }

        $result = [
            'definition' => $dashboard->definition,
            'slug' => $dashboard->slug,
            'icon' => $dashboard->icon,
            'name' => $dashboard->name,
            'schema' => 1
        ];

        return json_encode($result, JSON_PRETTY_PRINT);
    }

    public function getStateProps()
    {
        $result = [
            'code' => $this->code,
            'name' => $this->name,
            'icon' => $this->icon,
            'is_global' => $this->is_global,
            'rows' => json_decode($this->definition)
        ];

        return $result;
    }

    public static function import(string $content, ?int $userId, bool $globalAccess = false): string
    {
        $decoded = json_decode($content, true);
        if (!is_array($decoded)) {
            throw new ApplicationException("Error decoding the uploaded file");
        }

        $requiredProps = [
            'definition',
            'slug',
            'icon',
            'name',
            'schema'
        ];

        foreach ($requiredProps as $property) {
            if (!array_key_exists($property, $decoded)) {
                throw new ApplicationException("The uploaded file is not a valid dashboard definition [1]");
            }

            $value = $decoded[$property];
            if (!strlen($value) || !is_scalar($value)) {
                throw new ApplicationException("The uploaded file is not a valid dashboard definition [2]");
            }
        }

        $decodedDefinition = json_decode($decoded['definition']);
        if (!is_array($decodedDefinition)) {
            throw new ApplicationException('Invalid dashboard data');
        }

        $slug = strtolower($decoded['slug']);
        self::validateSlug($slug);

        $slug = self::uniqueSlug($slug);

        self::createDashboard(
            $decoded['name'],
            $slug,
            $decoded['icon'],
            $userId,
            $globalAccess,
            $decoded['definition']
        );

        return $slug;
    }

    private static function uniqueSlug(string $slug): string
    {
        $slug = strtolower($slug);
        $originalSlug = $slug;
        $index = 1;
        while (self::where('slug', $slug)->first()) {
            $index++;
            $slug = $originalSlug . '-' . $index;
        }

        return $slug;
    }

    private static function validateSlug($slug)
    {
        if (!preg_match('/^[0-9a-zA-Z\-]+$/', $slug)) {
            throw new ApplicationException('Invalid slug');
        }
    }

    /**
     * clearCache
     */
    public function clearCache()
    {
        Cache::forget(self::PERMISSION_CACHE_KEY);
    }

    /**
     * @deprecated
     */
    public static function listUserDashboards(User $user): array
    {
        $dashboards = self::orderBy('name')->get();
        $isSuperUser = self::userHasEditDashboardPermissions($user);
        $result = [];
        foreach ($dashboards as $dashboard) {
            if (
                !$isSuperUser &&
                !$user->hasPermission("dashboard.access_dashboard_{$dashboard->id}") &&
                !$dashboard->is_global
            ) {
                continue;
            }

            $result[] = $dashboard;
        }

        return $result;
    }

    /**
     * @deprecated unused
     */
    public static function getPermissionDefinitions(): array
    {
        return Cache::memo()->remember(self::PERMISSION_CACHE_KEY, 1440, function() {
            $dashboards = self::select('id', 'name')
                ->orderBy('name')
                ->get()
            ;

            $result = [];
            foreach ($dashboards as $index => $dashboard) {
                $result["dashboard.access_dashboard_{$dashboard->id}"] = [
                    'label' => __("Access :name Dashboard", ['name' => $dashboard->name]),
                    'tab' => 'Dashboard',
                    'order' => 600 + $index
                ];
            }
            return $result;
        });
    }

    /**
     * @deprecated use `BackendAuth::userHasAccess('dashboard.manage')`
     */
    public static function userHasEditDashboardPermissions(User $user)
    {
        return $user->isSuperUser() ||
            $user->hasPermission('dashboard.manage');
    }
}
