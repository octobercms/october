<?php namespace Backend\Models;

use Backend\Classes\RoleManager;
use October\Rain\Auth\Models\Role as RoleBase;

/**
 * UserRole for an administrator
 *
 * @package october\backend
 * @author Alexey Bobkov, Samuel Georges
 */
class UserRole extends RoleBase
{
    use \October\Rain\Database\Traits\Sortable;

    const CODE_DEVELOPER = 'developer';
    const CODE_PUBLISHER = 'publisher';

    /**
     * @var string table associated with the model
     */
    protected $table = 'backend_user_roles';

    /**
     * @var array rules for validation
     */
    public $rules = [
        'name' => 'required|between:2,128|unique:backend_user_roles',
        'code' => 'unique:backend_user_roles',
    ];

    /**
     * @var array hasMany relationship
     */
    public $hasMany = [
        'users' => [User::class, 'key' => 'role_id']
    ];

    /**
     * @var array fillable fields
     */
    protected $fillable = [
        'name',
        'code',
        'description',
        'color_background'
    ];

    /**
     * filterFields used by the form controller
     */
    public function filterFields($fields)
    {
        if ($this->is_system) {
            $fields->code->disabled = true;
            $fields->permissions->disabled = true;
        }
    }

    /**
     * afterFetch event
     */
    public function afterFetch()
    {
        if ($this->is_system) {
            $this->permissions = $this->getDefaultPermissions();
        }

        if (is_array($this->permissions)) {
            $this->permissions = static::applyPermissionPatches($this->permissions);
        }
    }

    /**
     * beforeSave event
     */
    public function beforeSave()
    {
        if ($this->isSystemRole()) {
            $this->is_system = true;
            $this->permissions = [];
        }
    }

    /**
     * isSystemRole checks if a role is locked by the system
     */
    public function isSystemRole(): bool
    {
        if (!$this->code || !strlen(trim($this->code))) {
            return false;
        }

        if ($this->is_system || in_array($this->code, [
            self::CODE_DEVELOPER,
            self::CODE_PUBLISHER
        ])) {
            return true;
        }

        return RoleManager::instance()->hasPermissionsForRole($this->code);
    }

    /**
     * duplicateRole returns an unsaved copy of this role with its permissions, excluding its code and users.
     */
    public function duplicateRole(): static
    {
        $copy = new static;
        $copy->name = sprintf("%s (%s)", $this->name, __("Copy"));
        $copy->description = $this->description;
        $copy->color_background = $this->color_background;
        $copy->permissions = $this->permissions ?: [];

        return $copy;
    }

    /**
     * getDefaultPermissions returns default permissions for a role
     */
    public function getDefaultPermissions()
    {
        return RoleManager::instance()->listPermissionsForRole($this->code);
    }

    /**
     * applyPermissionPatches replaces old permission codes with new ones. It leaves
     * the old ones in place since there shouldn't be any harm in doing so.
     */
    public static function applyPermissionPatches(array $permissions): array
    {
        $toReplace = [
            'admins.manage.roles' => 'admins.roles',
            'admins.manage.groups' => 'admins.groups',
        ];

        foreach ($permissions as $key => $value) {
            if (!isset($toReplace[$key])) {
                continue;
            }

            $permissions[$toReplace[$key]] = $value;
        }

        return $permissions;
    }
}
