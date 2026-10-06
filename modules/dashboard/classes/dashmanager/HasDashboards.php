<?php namespace Dashboard\Classes\DashManager;

use BackendAuth;

/**
 * HasDashboards
 *
 * @package october\dashboard
 * @author Alexey Bobkov, Samuel Georges
 */
trait HasDashboards
{
    /**
     * listDashboardDefinitions returns registered dashboard definitions keyed by code, loading those supplied as a YAML file path
     */
    public function listDashboardDefinitions(): array
    {
        $result = [];
        foreach ($this->listRegistrations('dashboards') as $code => $definition) {
            $result[$code] = (array) $this->makeConfig($definition);
        }

        return $result;
    }

    /**
     * hasDashboardAccess returns false when a registered dashboard requires permissions the user does not have
     */
    public function hasDashboardAccess(string $code, $user = null): bool
    {
        $permissions = $this->listDashboardDefinitions()[$code]['permissions'] ?? null;
        if (!$permissions) {
            return true;
        }

        $user = $user ?: BackendAuth::getUser();

        return $user && $user->hasAccess($permissions, false);
    }
}
