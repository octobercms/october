<?php namespace Backend\Classes;

use App;
use Log;
use Event;
use System;
use BackendAuth;
use System\Classes\PluginManager;
use SystemException;
use Throwable;

/**
 * NavigationManager manages the backend navigation.
 *
 * @package october\backend
 * @author Alexey Bobkov, Samuel Georges
 */
class NavigationManager
{
    use \Backend\Classes\NavigationManager\HasNavigationContext;
    use \Backend\Classes\NavigationManager\HasTailorNavigationContext;

    const ITEM_TYPE_ADD_BUTTON = 'add-button';

    /**
     * @var MainMenuItem[]|null items contains a list of registered items.
     */
    protected $items;

    /**
     * @var array|null menuDisplayTree
     */
    protected $menuDisplayTree;

    /**
     * instance creates a new instance of this singleton
     */
    public static function instance(): static
    {
        return App::make('backend.menu');
    }

    /**
     * registerCallback function that defines menu items.
     * The callback function should register menu items by calling the manager's
     * `registerMenuItems` method. The manager instance is passed to the callback
     * function as an argument. Usage:
     *
     *     BackendMenu::registerCallback(function ($manager) {
     *         $manager->registerMenuItems([...]);
     *     });
     *
     * @deprecated this will be removed in a later version
     * @param callable $callback A callable function.
     */
    public function registerCallback(callable $callback)
    {
        App::extendInstance('backend.menu', $callback);
    }

    /**
     * init this class items
     */
    public function init()
    {
        if ($this->items === null) {
            $this->loadItems();
        }
    }

    /**
     * loadItems from modules and plugins
     */
    protected function loadItems()
    {
        $this->items = [];

        // Load module items
        foreach (System::listModules() as $module) {
            if ($provider = App::getProvider($module . '\\ServiceProvider')) {
                $items = $provider->registerNavigation();
                if (is_array($items)) {
                    $this->registerMenuItems('October.'.$module, $items);
                }
            }
        }

        // Load plugin items, prevent system crashes
        foreach (PluginManager::instance()->getPlugins() as $id => $plugin) {
            try {
                $items = $plugin->registerNavigation();
                if (is_array($items)) {
                    $this->registerMenuItems($id, $items);
                }
            }
            catch (Throwable $ex) {
                Log::error($ex);
            }
        }

        // Load app items
        if ($app = App::getProvider(\App\Provider::class)) {
            $items = $app->registerNavigation();
            if (is_array($items)) {
                $this->registerMenuItems('October.App', $items);
            }
        }

        /**
         * @event backend.menu.extendItems
         * Provides an opportunity to manipulate the backend navigation
         *
         * Example usage:
         *
         *     Event::listen('backend.menu.extendItems', function ((\Backend\Classes\NavigationManager) $manager) {
         *         $manager->addMainMenuItems(...)
         *         $manager->addSideMenuItems(...)
         *         $manager->removeMainMenuItem(...)
         *     });
         *
         */
        Event::fire('backend.menu.extendItems', [$this]);

        // Sort menu items
        uasort($this->items, static function ($a, $b) {
            return (int) $a->order - (int) $b->order;
        });

        // Filter items user lacks permission for
        $user = BackendAuth::getUser();
        $this->items = $this->filterItemPermissions($user, $this->items);

        foreach ($this->items as $item) {
            $sideMenu = $item->sideMenu;
            if (!$sideMenu || !count($sideMenu)) {
                continue;
            }

            // Apply incremental default orders
            $orderCount = 0;
            foreach ($sideMenu as $sideMenuItem) {
                if ($sideMenuItem->order !== -1) {
                    continue;
                }
                $sideMenuItem->order = ($orderCount += 100);
            }

            // Sort side menu items
            uasort($sideMenu, static function ($a, $b) {
                return $a->order - $b->order;
            });

            // Filter items user lacks permission for
            $item->sideMenu($this->filterItemPermissions($user, $sideMenu));
        }
    }

    /**
     * registerMenuItems for the back-end menu items.
     * The argument is an array of the main menu items. The array keys represent the
     * menu item codes, specific for the plugin/module. Each element in the
     * array should be an associative array with the following keys:
     * - label - specifies the menu label localization string key, required.
     * - icon - an icon name from the Font Awesome icon collection, required.
     * - url - the back-end relative URL the menu item should point to, required.
     * - permissions - an array of permissions the back-end user should have, optional.
     *   The item will be displayed if the user has any of the specified permissions.
     * - order - a position of the item in the menu, optional.
     * - counter - an optional numeric value to output near the menu icon. The value should be
     *   a number or a callable returning a number.
     * - counterLabel - an optional string value to describe the numeric reference in counter.
     * - sideMenu - an array of side menu items, optional. If provided, the array items
     *   should represent the side menu item code, and each value should be an associative
     *   array with the following keys:
     *      - label - specifies the menu label localization string key, required.
     *      - icon - an icon name from the Font Awesome icon collection, required.
     *      - url - the back-end relative URL the menu item should point to, required.
     *      - attributes - an array of attributes and values to apply to the menu item, optional.
     *      - permissions - an array of permissions the back-end user should have, optional.
     *      - counter - an optional numeric value to output near the menu icon. The value should be
     *        a number or a callable returning a number.
     *      - counterLabel - an optional string value to describe the numeric reference in counter.
     * @param string $owner Specifies the menu items owner plugin or module in the format Author.Plugin.
     * @param array $definitions An array of the menu item definitions.
     */
    public function registerMenuItems($owner, array $definitions)
    {
        $this->init();

        $this->addMainMenuItems($owner, $definitions);
    }

    /**
     * addMainMenuItems dynamically adds an array of main menu items.
     * @param string $owner
     * @param array  $definitions
     */
    public function addMainMenuItems($owner, array $definitions)
    {
        foreach ($definitions as $code => $definition) {
            $this->addMainMenuItem($owner, $code, $definition);
        }
    }

    /**
     * addMainMenuItem dynamically adds a single main menu item.
     * @param string $owner
     * @param string $code
     * @param array  $definition
     */
    public function addMainMenuItem($owner, $code, array $definition)
    {
        if ($this->items === null) {
            throw new SystemException('Unable to add navigation items before they are loaded.');
        }

        $itemKey = $this->makeItemKey($owner, $code);

        if (isset($this->items[$itemKey])) {
            $definition = array_merge(
                $this->items[$itemKey]->toArray(),
                $definition
            );
        }

        $item = array_merge($definition, [
            'code'  => $code,
            'owner' => $owner
        ]);

        $sideMenu = array_pull($item, 'sideMenu');

        $this->items[$itemKey] = $this->defineMainMenuItem($item);

        if (is_array($sideMenu)) {
            $this->addSideMenuItems($owner, $code, $sideMenu);
        }
    }

    /**
     * defineMainMenuItem
     */
    protected function defineMainMenuItem(array $config): MainMenuItem
    {
        return (new MainMenuItem)->useConfig($config);
    }

    /**
     * getMainMenuItem returns a main menu item
     */
    public function getMainMenuItem(string $owner, string $code): ?MainMenuItem
    {
        $itemKey = $this->makeItemKey($owner, $code);

        return $this->items[$itemKey] ?? null;
    }

    /**
     * removeMainMenuItem removes a single main menu item
     * @param $owner
     * @param $code
     */
    public function removeMainMenuItem($owner, $code)
    {
        if ($this->items === null) {
            throw new SystemException('Unable to remove navigation items before they are loaded.');
        }

        $itemKey = $this->makeItemKey($owner, $code);

        unset($this->items[$itemKey]);
    }

    /**
     * addSideMenuItems dynamically adds an array of side menu items
     * @param string $owner
     * @param string $code
     * @param array  $definitions
     */
    public function addSideMenuItems($owner, $code, array $definitions)
    {
        foreach ($definitions as $sideCode => $definition) {
            if (is_array($definition)) {
                $this->addSideMenuItem($owner, $code, $sideCode, $definition);
            }
        }
    }

    /**
     * addSideMenuItem dynamically add a single side menu item
     * @param string $owner
     * @param string $code
     * @param string $sideCode
     * @param array $definition
     * @return bool
     */
    public function addSideMenuItem($owner, $code, $sideCode, array $definition)
    {
        if ($this->items === null) {
            throw new SystemException('Unable to add navigation items before they are loaded.');
        }

        $itemKey = $this->makeItemKey($owner, $code);

        if (!isset($this->items[$itemKey])) {
            return false;
        }

        $mainItem = $this->items[$itemKey];

        $definition = array_merge($definition, [
            'code'  => $sideCode,
            'owner' => $owner
        ]);

        if (isset($mainItem->sideMenu[$sideCode])) {
            $definition = array_merge(
                $mainItem->sideMenu[$sideCode]->toArray(),
                $definition
            );
        }

        $item = $this->defineSideMenuItem($definition);

        $this->items[$itemKey]->addSideMenuItem($item);

        return true;
    }

    /**
     * defineSideMenuItem
     */
    protected function defineSideMenuItem(array $config): SideMenuItem
    {
        return (new SideMenuItem)->useConfig($config);
    }

    /**
     * getSideMenuItem returns a side menu item
     */
    public function getSideMenuItem(string $owner, string $code, string $sideCode): ?SideMenuItem
    {
        return $this->getMainMenuItem($owner, $code)?->getSideMenuItem($sideCode);
    }

    /**
     * removeSideMenuItems with multiple codes
     * @param string $owner
     * @param string $code
     * @param array  $sideCodes
     * @return void
     */
    public function removeSideMenuItems($owner, $code, $sideCodes)
    {
        foreach ($sideCodes as $sideCode) {
            $this->removeSideMenuItem($owner, $code, $sideCode);
        }
    }

    /**
     * removeSideMenuItem removes a single main menu item
     * @param string $owner
     * @param string $code
     * @param string $sideCode
     * @return bool
     */
    public function removeSideMenuItem($owner, $code, $sideCode)
    {
        if ($this->items === null) {
            throw new SystemException('Unable to remove navigation items before they are loaded.');
        }

        $itemKey = $this->makeItemKey($owner, $code);
        if (!isset($this->items[$itemKey])) {
            return false;
        }

        $mainItem = $this->items[$itemKey];
        $mainItem->removeSideMenuItem($sideCode);
        return true;
    }

    /**
     * listMainMenuItems returns a list of the main menu items.
     * @return array
     */
    public function listMainMenuItems()
    {
        $this->init();

        foreach ($this->items as $item) {
            if ($item->counter === false) {
                continue;
            }

            // Counter specified
            $item->counter = $this->getCallableCounterValue($item);

            // Guess counter from sub items
            if ($item->counter === null && ($sideItems = $this->listSideMenuItems($item->owner, $item->code))) {
                $subCount = 0;
                foreach ($sideItems as $sideItem) {
                    if ($sideItem->counter !== null) {
                        $subCount += $sideItem->counter;
                    }
                }
                if ($subCount > 0) {
                    $item->counter = $subCount;
                }
            }
        }

        return $this->items;
    }

    /**
     * listSideMenuItems returns a list of side menu items for the currently active main menu item.
     * The currently active main menu item is set with the setContext methods.
     * @param null $owner
     * @param null $code
     * @return SideMenuItem[]
     * @throws SystemException
     */
    public function listSideMenuItems($owner = null, $code = null)
    {
        $this->init();

        $activeItem = null;

        if ($owner !== null && $code !== null) {
            $activeItem = $this->items[$this->makeItemKey($owner, $code)] ?? null;
        }
        else {
            foreach ($this->listMainMenuItems() as $item) {
                if ($this->isMainMenuItemActive($item)) {
                    $activeItem = $item;
                    break;
                }
            }
        }

        if (!$activeItem) {
            return [];
        }

        $items = $activeItem->sideMenu;

        // Process counters
        foreach ($items as $item) {
            $item->counter = $this->getCallableCounterValue($item);
        }

        return $items;
    }

    /**
     * listMainMenuItemsWithSubitems prepares data for displaying the top menu and side
     * (collapsible) menu. Uses caching to avoid running counter functions twice.
     */
    public function listMainMenuItemsWithSubitems()
    {
        if ($this->menuDisplayTree !== null) {
            return $this->menuDisplayTree;
        }

        $mainMenuItems = $this->listMainMenuItems();
        $this->menuDisplayTree = [];

        foreach ($mainMenuItems as $mainMenuItem) {
            $subMenuItems = $this->listSideMenuItems($mainMenuItem->owner, $mainMenuItem->code);

            $this->menuDisplayTree[] = (object)[
                'mainMenuItem' => $mainMenuItem,
                'subMenuItems' => $subMenuItems,
                'subMenuHasDropdown' => $mainMenuItem->useDropdown && count($subMenuItems)
            ];
        }

        return $this->menuDisplayTree;
    }

    /**
     * listMainMenuSubItems uses cached result of listMainMenuItemsWithSubitems to return
     * submenu items and avoid duplicate counter calls.
     */
    public function listMainMenuSubItems()
    {
        $allItems = $this->listMainMenuItemsWithSubitems();

        foreach ($allItems as $itemInfo) {
            if ($this->isMainMenuItemActive($itemInfo->mainMenuItem)) {
                return $itemInfo->subMenuItems;
            }
        }

        return [];
    }

    /**
     * getActiveMainMenuItem returns the currently active main menu item
     * @return null|MainMenuItem $item Returns the item object or null.
     * @throws SystemException
     */
    public function getActiveMainMenuItem()
    {
        foreach ($this->listMainMenuItems() as $item) {
            if ($this->isMainMenuItemActive($item)) {
                return $item;
            }
        }

        return null;
    }

    /**
     * getCallableCounterValue returns the counter value for a menu item
     */
    protected function getCallableCounterValue($item)
    {
        $counterValue = $item->counter;

        if (empty($counterValue)) {
            return null;
        }

        if (is_int($counterValue)) {
            return $counterValue;
        }

        if (
            is_string($counterValue) &&
            strpos($counterValue, '::') !== false &&
            ($staticMethod = explode('::', $counterValue)) &&
            count($staticMethod) === 2 &&
            is_callable($staticMethod)
        ) {
            return $staticMethod($item);
        }

        if (is_callable($counterValue)) {
            return $counterValue($item);
        }

        return (int) $item->counter;
    }

    /**
     * filterItemPermissions removes menu items from an array if the supplied user lacks permission.
     * @param \Backend\Models\User $user A user object
     * @param MainMenuItem[]|SideMenuItem[] $items A collection of menu items
     * @return array The filtered menu items
     */
    protected function filterItemPermissions($user, array $items)
    {
        if (!$user) {
            return $items;
        }

        $items = array_filter($items, static function ($item) use ($user) {
            if (!$item->permissions || !count($item->permissions)) {
                return true;
            }

            return $user->hasAnyAccess($item->permissions);
        });

        return $items;
    }

    /**
     * makeItemKey is an internal method to make a unique key for an item.
     * @param string $owner
     * @param string $code
     * @return string
     */
    protected function makeItemKey($owner, $code)
    {
        return strtoupper($owner).'.'.strtoupper($code);
    }

    /**
     * resetCache resets any memory or cache involved with the sites
     */
    public function resetCache()
    {
        $this->items = null;
        $this->menuDisplayTree = null;
    }
}
