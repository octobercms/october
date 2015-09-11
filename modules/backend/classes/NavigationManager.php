<?php namespace Backend\Classes;

use Event;
use BackendAuth;
use System\Classes\PluginManager;

/**
 * Manages the backend navigation.
 *
 * @package october\backend
 * @author Alexey Bobkov, Samuel Georges
 */
class NavigationManager
{
    use \October\Rain\Support\Traits\Singleton;

    /**
     * @var array Cache of registration callbacks.
     */
    protected $callbacks = [];

    /**
     * @var array List of registered items.
     */
    protected $items;

    protected $contextSidenavPartials = [];

    protected $contextOwner;
    protected $contextMainMenuItemCode;
    protected $contextSideMenuItemCode;

    protected static $mainItemDefaults = [
        'code'        => null,
        'label'       => null,
        'icon'        => null,
        'url'         => null,
        'permissions' => [],
        'order'       => 500,
        'sideMenu'    => []
    ];

    protected static $sideItemDefaults = [
        'code'        => null,
        'label'       => null,
        'icon'        => null,
        'url'         => null,
        'counter'     => null,
        'counterLabel'=> null,
        'order'       => -1,
        'attributes'  => [],
        'permissions' => []
    ];

    /**
     * @var System\Classes\PluginManager
     */
    protected $pluginManager;

    /**
     * Initialize this singleton.
     */
    protected function init()
    {
        $this->pluginManager = PluginManager::instance();
    }

    /**
     * Loads the menu items from modules and plugins
     * @return void
     */
    protected function loadItems()
    {
        /*
         * Load module items
         */
        foreach ($this->callbacks as $callback) {
            $callback($this);
        }

        /*
         * Load plugin items
         */
        $plugins = $this->pluginManager->getPlugins();

        foreach ($plugins as $id => $plugin) {
            $items = $plugin->registerNavigation();
            if (!is_array($items)) {
                continue;
            }

            $this->registerMenuItems($id, $items);
        }

        /*
         * Extensibility
         */
        Event::fire('backend.menu.extendItems', [$this]);

        /*
         * Sort menu items
         */
        uasort($this->items, function ($a, $b) {
            return $a->order - $b->order;
        });

        /*
         * Filter items user lacks permission for
         */
        $user = BackendAuth::getUser();
        $this->items = $this->filterItemPermissions($user, $this->items);

        foreach ($this->items as $item) {
            if (!$item->sideMenu || !count($item->sideMenu)) {
                continue;
            }

            /*
             * Apply incremental default orders
             */
            $orderCount = 0;
            foreach ($item->sideMenu as $sideMenuItem) {
                if ($sideMenuItem->order !== -1) continue;
                $sideMenuItem->order = ($orderCount += 100);
            }

            /*
             * Sort side menu items
             */
            uasort($item->sideMenu, function ($a, $b) {
                return $a->order - $b->order;
            });

            /*
             * Filter items user lacks permission for
             */
            $item->sideMenu = $this->filterItemPermissions($user, $item->sideMenu);
        }
    }

    /**
     * Registers a callback function that defines menu items.
     * The callback function should register menu items by calling the manager's
     * registerMenuItems() function. The manager instance is passed to the
     * callback function as an argument. Usage:
     * <pre>
     *   BackendMenu::registerCallback(function($manager){
     *       $manager->registerMenuItems([...]);
     *   });
     * </pre>
     * @param callable $callback A callable function.
     */
    public function registerCallback(callable $callback)
    {
        $this->callbacks[] = $callback;
    }

    /**
     * Registers the back-end menu items.
     * The argument is an array of the main menu items. The array keys represent the
     * menu item codes, specific for the plugin/module. Each element in the
     * array should be an associative array with the following keys:
     * - label - specifies the menu label localization string key, required.
     * - icon - an icon name from the Font Awesome icon collection, required.
     * - url - the back-end relative URL the menu item should point to, required.
     * - permissions - an array of permissions the back-end user should have, optional.
     *   The item will be displayed if the user has any of the specified permissions.
     * - order - a position of the item in the menu, optional.
     * - sideMenu - an array of side menu items, optional. If provided, the array items
     *   should represent the side menu item code, and each value should be an associative
     *   array with the following keys:
     * - label - specifies the menu label localization string key, required.
     * - icon - an icon name from the Font Awesome icon collection, required.
     * - url - the back-end relative URL the menu item should point to, required.
     * - attributes - an array of attributes and values to apply to the menu item, optional.
     * - permissions - an array of permissions the back-end user should have, optional.
     * - counter - an optional numeric value to output near the menu icon. The value should be
     *   a number or a callable returning a number.
     * - counterLabel - an optional string value to describe the numeric reference in counter.
     * @param string $owner Specifies the menu items owner plugin or module in the format Author.Plugin.
     * @param array $definitions An array of the menu item definitions.
     */
    public function registerMenuItems($owner, array $definitions)
    {
        if (!$this->items) {
            $this->items = [];
        }

        foreach ($definitions as $code => $definition) {
            $item = (object) array_merge(self::$mainItemDefaults, array_merge($definition, [
                'code'  => $code,
                'owner' => $owner
            ]));

            foreach ($item->sideMenu as $sideMenuItemCode => $sideMenuDefinition) {
                $item->sideMenu[$sideMenuItemCode] = (object) array_merge(
                    self::$sideItemDefaults,
                    array_merge($sideMenuDefinition, [
                        'code'  => $sideMenuItemCode,
                        'owner' => $owner
                    ])
                );
            }

            $itemKey = $this->makeItemKey($owner, $code);
            $this->items[$itemKey] = $item;
        }
    }

    /**
     * Dynamically add an array of main menu items
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
     * Dynamically add a single main menu item
     * @param string $owner
     * @param string $code
     * @param array  $definitions
     */
    public function addMainMenuItem($owner, $code, array $definition)
    {
        $sideMenu = isset($definition['sideMenu']) ? $definition['sideMenu'] : null;

        $itemKey = $this->makeItemKey($owner, $code);
        if (isset($this->items[$itemKey])) {
            $definition = array_merge((array) $this->items[$itemKey], $definition);
        }

        $item = (object) array_merge(self::$mainItemDefaults, array_merge($definition, [
            'code'  => $code,
            'owner' => $owner
        ]));

        $this->items[$itemKey] = $item;

        if ($sideMenu !== null) {
            $this->addSideMenuItems($owner, $code, $sideMenu);
        }
    }

    /**
     * Removes a single main menu item
     */
    public function removeMainMenuItem($owner, $code)
    {
        $itemKey = $this->makeItemKey($owner, $code);
        unset($this->items[$itemKey]);
    }

    /**
     * Dynamically add an array of side menu items
     * @param string $owner
     * @param string $code
     * @param array  $definitions
     */
    public function addSideMenuItems($owner, $code, array $definitions)
    {
        foreach ($definitions as $sideCode => $definition) {
            $this->addSideMenuItem($owner, $code, $sideCode, $definition);
        }
    }

    /**
     * Dynamically add a single side menu item
     * @param string $owner
     * @param string $code
     * @param string $sideCode
     * @param array  $definitions
     */
    public function addSideMenuItem($owner, $code, $sideCode, array $definition)
    {
        $itemKey = $this->makeItemKey($owner, $code);
        if (!isset($this->items[$itemKey])) {
            return false;
        }

        $definition = array_merge($definition, [
            'code'  => $sideCode,
            'owner' => $owner
        ]);

        $mainItem = $this->items[$itemKey];
        if (isset($mainItem->sideMenu[$sideCode])) {
            $definition = array_merge((array) $mainItem->sideMenu[$sideCode], $definition);
        }

        $item = (object) array_merge(self::$sideItemDefaults, $definition);
        $this->items[$itemKey]->sideMenu[$sideCode] = $item;
    }

    /**
     * Removes a single main menu item
     */
    public function removeSideMenuItem($owner, $code, $sideCode)
    {
        $itemKey = $this->makeItemKey($owner, $code);
        if (!isset($this->items[$itemKey])) {
            return false;
        }

        $mainItem = $this->items[$itemKey];
        unset($mainItem->sideMenu[$sideCode]);
    }

    /**
     * Returns a list of the main menu items.
     * @return array
     */
    public function listMainMenuItems()
    {
        if ($this->items === null) {
            $this->loadItems();
        }

        return $this->items;
    }

    /**
     * Returns a list of side menu items for the currently active main menu item.
     * The currently active main menu item is set with the setContext methods.
     */
    public function listSideMenuItems()
    {
        $activeItem = null;

        foreach ($this->listMainMenuItems() as $item) {
            if ($this->isMainMenuItemActive($item)) {
                $activeItem = $item;
                break;
            }
        }

        if (!$activeItem) {
            return [];
        }

        $items = $activeItem->sideMenu;

        foreach ($items as $item) {
            if ($item->counter !== null && is_callable($item->counter)) {
                $item->counter = call_user_func($item->counter, $item);
            }
        }

        return $items;
    }

    /**
     * Sets the navigation context.
     * The function sets the navigation owner, main menu item code and the side menu item code.
     * @param string $owner Specifies the navigation owner in the format Vendor/Module
     * @param string $mainMenuItemCode Specifies the main menu item code
     * @param string $sideMenuItemCode Specifies the side menu item code
     */
    public function setContext($owner, $mainMenuItemCode, $sideMenuItemCode = null)
    {
        $this->setContextOwner($owner);
        $this->setContextMainMenu($mainMenuItemCode);
        $this->setContextSideMenu($sideMenuItemCode);
    }

    /**
     * Sets the navigation context.
     * The function sets the navigation owner.
     * @param string $owner Specifies the navigation owner in the format Vendor/Module
     */
    public function setContextOwner($owner)
    {
        $this->contextOwner = $owner;
    }

    /**
     * Specifies a code of the main menu item in the current navigation context.
     * @param string $mainMenuItemCode Specifies the main menu item code
     */
    public function setContextMainMenu($mainMenuItemCode)
    {
        $this->contextMainMenuItemCode = $mainMenuItemCode;
    }

    /**
     * Returns information about the current navigation context.
     * @return mixed Returns an object with the following fields:
     * - mainMenuCode
     * - sideMenuCode
     * - owner
     */
    public function getContext()
    {
        return (object)[
            'mainMenuCode' => $this->contextMainMenuItemCode,
            'sideMenuCode' => $this->contextSideMenuItemCode,
            'owner' => $this->contextOwner
        ];
    }

    /**
     * Specifies a code of the side menu item in the current navigation context.
     * If the code is set to TRUE, the first item will be flagged as active.
     * @param string $sideMenuItemCode Specifies the side menu item code
     */
    public function setContextSideMenu($sideMenuItemCode)
    {
        $this->contextSideMenuItemCode = $sideMenuItemCode;
    }

    /**
     * Determines if a main menu item is active.
     * @param mixed $item Specifies the item object.
     * @return boolean Returns true if the menu item is active.
     */
    public function isMainMenuItemActive($item)
    {
        return $this->contextOwner == $item->owner && $this->contextMainMenuItemCode == $item->code;
    }

    /**
     * Returns the currently active main menu item
     * @param mixed $item Returns the item object or null.
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
     * Determines if a side menu item is active.
     * @param mixed $item Specifies the item object.
     * @return boolean Returns true if the side item is active.
     */
    public function isSideMenuItemActive($item)
    {
        if ($this->contextSideMenuItemCode === true) {
            $this->contextSideMenuItemCode = null;
            return true;
        }

        return $this->contextOwner == $item->owner && $this->contextSideMenuItemCode == $item->code;
    }

    /**
     * Registers a special side navigation partial for a specific main menu.
     * The sidenav partial replaces the standard side navigation.
     * @param string $owner Specifies the navigation owner in the format Vendor/Module.
     * @param string $mainMenuItemCode Specifies the main menu item code.
     * @param string $partial Specifies the partial name.
     */
    public function registerContextSidenavPartial($owner, $mainMenuItemCode, $partial)
    {
        $this->contextSidenavPartials[$owner.$mainMenuItemCode] = $partial;
    }

    /**
     * Returns the side navigation partial for a specific main menu previously registered
     * with the registerContextSidenavPartial() method.
     *
     * @param string $owner Specifies the navigation owner in the format Vendor/Module.
     * @param string $mainMenuItemCode Specifies the main menu item code.
     * @return mixed Returns the partial name or null.
     */
    public function getContextSidenavPartial($owner, $mainMenuItemCode)
    {
        $key = $owner.$mainMenuItemCode;

        return array_key_exists($key, $this->contextSidenavPartials)
            ? $this->contextSidenavPartials[$key]
            : null;
    }

    /**
     * Removes menu items from an array if the supplied user lacks permission.
     * @param User $user A user object
     * @param array $items A collection of menu items
     * @return array The filtered menu items
     */
    protected function filterItemPermissions($user, array $items)
    {
        if (!$user) {
            return $items;
        }

        $items = array_filter($items, function ($item) use ($user) {
            if (!$item->permissions || !count($item->permissions)) {
                return true;
            }

            return $user->hasAnyAccess($item->permissions);
        });

        return $items;
    }

    /**
     * Internal method to make a unique key for an item.
     * @param  object $item
     * @return string
     */
    protected function makeItemKey($owner, $code)
    {
        return strtoupper($owner).'.'.strtoupper($code);
    }
}
