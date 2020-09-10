<?php namespace Backend\Facades;

use October\Rain\Support\Facade;

/**
 * BackendAuth facade
 *
 * @package october\backend
 *
 * @method static void registerCallback(callable $callback)
 * @method static void registerPermissions(string $owner, array $definitions)
 * @method static void removePermission(string $owner, string $code)
 * @method static array listPermissions()
 * @method static array listTabbedPermissions()
 * @method static array listPermissionsForRole(string $role, bool $includeOrphans = true)
 * @method static boolean hasPermissionsForRole(string $role)
 */
class BackendAuth extends Facade
{
    /**
     * Get the registered name of the component.
     *
     * Resolves to:
     * - Backend\Classes\AuthManager
     *
     * @return string
     */
    protected static function getFacadeAccessor()
    {
        return 'backend.auth';
    }
}
