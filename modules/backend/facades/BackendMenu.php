<?php namespace Backend\Facades;

use October\Rain\Support\Facade;

/**
 * @method static void registerCallback(callable $callback)
 * @method static void registerMenuItems(string $owner, array $definitions)
 * @method static void addMainMenuItems(string $owner, array $definitions)
 * @method static void addMainMenuItem(string $owner, $code, array $definition)
 * @method static \Backend\Classes\MainMenuItem getMainMenuItem(string $owner, string $code)
 * @method static void removeMainMenuItem(string $owner, string $code)
 * @method static void addSideMenuItems(string $owner, string $code, array $definitions)
 * @method static bool addSideMenuItem(string $owner, string $code, string $sideCode, array $definition)
 * @method static bool removeSideMenuItem(string $owner, string $code, string $sideCode)
 * @method static \Backend\Classes\MainMenuItem[] listMainMenuItems()
 * @method static \Backend\Classes\SideMenuItem[] listSideMenuItems(string|null $owner = null, string|null $code = null)
 * @method static void setContext(string $owner, string $mainMenuItemCode, string|null $sideMenuItemCode = null)
 * @method static void setContextOwner(string $owner)
 * @method static void setContextMainMenu(string $mainMenuItemCode)
 * @method static object getContext()
 * @method static void setContextSideMenu(string $sideMenuItemCode)
 * @method static bool isMainMenuItemActive(\Backend\Classes\MainMenuItem $item)
 * @method static \Backend\Classes\MainMenuItem|null getActiveMainMenuItem()
 * @method static bool isSideMenuItemActive(\Backend\Classes\SideMenuItem $item)
 * @method static void registerContextSidenavPartial(string $owner, string $mainMenuItemCode, string $partial)
 * @method static mixed getContextSidenavPartial(string $owner, string $mainMenuItemCode)
 *
 * @see \Backend\Classes\NavigationManager
 */
class BackendMenu extends Facade
{
    /**
     * Get the registered name of the component.
     *
     * @return string
     */
    protected static function getFacadeAccessor()
    {
        return 'backend.menu';
    }
}
