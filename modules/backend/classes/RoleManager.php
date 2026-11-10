<?php namespace Backend\Classes;

use App;
use Event;
use System;
use System\Classes\PluginManager;
use October\Rain\Exception\SystemException;

/**
 * RoleManager manages the backend roles and permissions.
 *
 * @package october\backend
 * @author Alexey Bobkov, Samuel Georges
 */
class RoleManager
{
    const ORPHAN_KEY = '*';

    /**
     * @var array|null permissions registered.
     */
    protected $permissions;

    /**
     * @var array|null permissionRoles is a list of registered permission roles.
     */
    protected $permissionRoles;

    /**
     * instance creates a new instance of this singleton
     */
    public static function instance(): static
    {
        return App::make('backend.roles');
    }

    /**
     * registerCallback registers a callback function that defines authentication permissions.
     * The callback function should register permissions by calling the manager's
     * registerPermissions() function. The manager instance is passed to the
     * callback function as an argument. Usage:
     *
     *     RoleManager::registerCallback(function ($manager) {
     *         $manager->registerPermissions([...]);
     *     });
     *
     * @deprecated this will be removed in a later version
     * @param callable $callback A callable function.
     */
    public function registerCallback(callable $callback)
    {
        App::extendInstance('backend.roles', $callback);
    }

    /**
     * init this class items
     */
    public function init()
    {
        if ($this->permissions === null) {
            $this->loadPermissions();
        }
    }

    /**
     * loadItems from modules and plugins
     */
    protected function loadPermissions()
    {
        $this->permissions = [];

        // Load module items
        foreach (System::listModules() as $module) {
            if ($provider = App::getProvider($module . '\\ServiceProvider')) {
                $items = $provider->registerPermissions();
                if (is_array($items)) {
                    $this->registerPermissions('October.'.$module, $items);
                }
            }
        }

        // Load plugin items
        foreach (PluginManager::instance()->getPlugins() as $id => $plugin) {
            $items = $plugin->registerPermissions();
            if (is_array($items)) {
                $this->registerPermissions($id, $items);
            }
        }

        // Load app items
        if ($app = App::getProvider(\App\Provider::class)) {
            $items = $app->registerPermissions();
            if (is_array($items)) {
                $this->registerPermissions('October.App', $items);
            }
        }

        /**
         * @event backend.roles.extendPermissions
         * Provides an opportunity to manipulate the permissions
         *
         * Example usage:
         *
         *     Event::listen('backend.roles.extendPermissions', function ((\Backend\Classes\RoleManager) $manager) {
         *         $manager->registerPermissions(...)
         *     });
         *
         */
        Event::fire('backend.roles.extendPermissions', [$this]);

        // Sort permission items
        usort($this->permissions, function ($a, $b) {
            if ($a->order === $b->order) {
                return 0;
            }

            return $a->order > $b->order ? 1 : -1;
        });
    }

    /**
     * registerPermissions registers the back-end permission items.
     * The argument is an array of the permissions. The array keys represent the
     * permission codes, specific for the plugin/module. Each element in the
     * array should be an associative array with the following keys:
     * - label - specifies the menu label localization string key, required.
     * - order - a position of the item in the menu, optional.
     * - comment - a brief comment that describes the permission, optional.
     * - tab - assign this permission to a tabbed group, optional.
     * @param string $owner Specifies the permissions' owner plugin or module in the format Author.Plugin
     * @param array $definitions An array of the menu item definitions.
     */
    public function registerPermissions($owner, array $definitions)
    {
        $this->init();

        foreach ($definitions as $code => $definition) {
            if ($definition && is_array($definition)) {
                $permission = new RolePermission(array_merge($definition, [
                    'code' => $code,
                    'owner' => $owner
                ]));

                $this->permissions[] = $permission;
            }
        }
    }

    /**
     * removePermission removes a single back-end permission. Where owner specifies the
     * permissions' owner plugin or module in the format Author.Plugin. Where code is
     * the permission to remove.
     */
    public function removePermission(string $owner, string $code)
    {
        if ($this->permissions === null) {
            throw new SystemException('Unable to remove permissions before they are loaded.');
        }

        $ownerPermissions = array_filter($this->permissions, function ($permission) use ($owner) {
            return $permission->owner === $owner;
        });

        foreach ($ownerPermissions as $key => $permission) {
            if ($permission->code === $code) {
                unset($this->permissions[$key]);
            }
        }
    }

    /**
     * listPermissions returns a list of the registered permissions items.
     */
    public function listPermissions(): array
    {
        $this->init();

        return $this->permissions;
    }

    /**
     * listPermissionsForUser returns permissions that the user has access to.
     */
    public function listPermissionsForUser($user): array
    {
        return array_filter($this->listPermissions(), function($permission) use ($user) {
            return $user->hasAccess($permission->code);
        });
    }

    /**
     * listPermissionsForRole returns an array of registered permissions belonging to a
     * given role code.
     * @param string $role
     * @param bool $includeOrphans
     */
    public function listPermissionsForRole($role, $includeOrphans = true): array
    {
        if ($this->permissionRoles === null) {
            $this->permissionRoles = [];

            foreach ($this->listPermissions() as $permission) {
                if ($permission->roles) {
                    foreach ((array) $permission->roles as $_role) {
                        $this->permissionRoles[$_role][$permission->code] = 1;
                    }
                }
                else {
                    $this->permissionRoles[self::ORPHAN_KEY][$permission->code] = 1;
                }
            }
        }

        $result = $this->permissionRoles[$role] ?? [];

        if ($includeOrphans) {
            $result += $this->permissionRoles[self::ORPHAN_KEY] ?? [];
        }

        return $result;
    }

    /**
     * hasPermissionsForRole checks if the user has the permissions for a role.
     */
    public function hasPermissionsForRole($role): bool
    {
        if ($role === self::ORPHAN_KEY) {
            return false;
        }

        return !!$this->listPermissionsForRole($role, false);
    }

    /**
     * resetCache resets any memory or cache involved with the sites
     */
    public function resetCache()
    {
        $this->permissions = null;
        $this->permissionRoles = null;
    }
}
