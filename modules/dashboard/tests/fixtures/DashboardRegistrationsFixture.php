<?php

use System\Classes\PluginManager;

/**
 * DashboardRegistrationsFixture replaces the values collected from the registerDashboards methods.
 */
trait DashboardRegistrationsFixture
{
    /**
     * registerDashboardsAs replaces the registerDashboards values of all modules and plugins, keyed by owner.
     */
    protected function registerDashboardsAs(array $bundles): void
    {
        $manager = PluginManager::instance();
        $cacheKey = self::callProtectedMethod($manager, 'getRegistrationCacheKey', ['registerDashboards']);

        $cache = self::getProtectedProperty($manager, 'registrationMethodCache');
        $cache[$cacheKey] = $bundles;

        self::setProtectedProperty($manager, 'registrationMethodCache', $cache);
    }
}
