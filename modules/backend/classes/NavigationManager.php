<?php namespace Backend\Classes;

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
    private $callbacks = [];

    /**
     * @var array List of registered items.
     */
    private $items;

    private $contextOwner;
    private $contextMainMenuItemCode;
    private $contextSideMenuItemCode;

    static $mainItemDefaults = [
        'code'        => null,
        'label'       => null,
        'icon'        => null,
        'url'         => null,
        'permissions' => [],
        'order'       => 100,
        'sideMenu'    => []
    ];

    static $sideItemDefaults = [
        'code'        => null,
        'label'       => null,
        'icon'        => null,
        'url'         => null,
        'counter'     => null,
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
            if (!is_array($items))
                continue;

            $this->registerMenuItems($id, $items);
        }

        /*
         * Sort menu items
         */
        usort($this->items, function($a, $b) {
            if ($a->order == $b->order)
                return 0;

            return $a->order > $b->order ? 1 : -1;
        });

        /*
         * Filter items user lacks permission for
         */
        $user = BackendAuth::getUser();
        $this->items = $this->filterItemPermissions($user, $this->items);

        foreach ($this->items as $item) {
            if (!$item->sideMenu || !count($item->sideMenu))
                continue;

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
     * @param string $owner Specifies the menu items owner plugin or module in the format Vendor/Module.
     * @param array $definitions An array of the menu item definitions.
     */
    public function registerMenuItems($owner, array $definitions)
    {
        if (!$this->items)
            $this->items = [];

        foreach ($definitions as $code => $definition) {
            $item = (object)array_merge(self::$mainItemDefaults, array_merge($definition, [
                'code' => $code,
                'owner' => $owner
            ]));

            foreach ($item->sideMenu as $sideMenuItemCode => $sideMenuDefinition) {
                $item->sideMenu[$sideMenuItemCode] = (object)array_merge(
                    self::$sideItemDefaults,
                    array_merge($sideMenuDefinition, [
                        'code' => $sideMenuItemCode,
                        'owner' => $owner
                    ])
                );
            }

            $this->items[] = $item;
        }
    }

    /**
     * Returns a list of the main menu items.
     * @return array
     */
    public function listMainMenuItems()
    {
        if ($this->items === null)
            $this->loadItems();

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

        if (!$activeItem)
            return [];

        $items = $activeItem->sideMenu;

        foreach ($items as $item) {
            if ($item->counter !== null && is_callable($item->counter))
                $item->counter = call_user_func($item->counter, $item);
        }

        return $items;
    }

    /**
     * Sets the navigation context.
     * The function sets the navigation owner, main menu item code and the side menu item code.
     * @param string @owner Specifies the navigation owner in the format Vendor/Module
     * @param string @mainMenuItemCode Specifies the main menu item code
     * @param string @sideMenuItemCode Specifies the side menu item code
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
     * @param string @owner Specifies the navigation owner in the format Vendor/Module
     */
    public function setContextOwner($owner)
    {
        $this->contextOwner = $owner;
    }

    /**
     * Specifies a code of the main menu item in the current navigation context.
     * @param string @mainMenuItemCode Specifies the main menu item code
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
     */
    public function getContext()
    {
        return (object)[
            'mainMenuCode' => $this->contextMainMenuItemCode,
            'sideMenuCode' => $this->contextSideMenuItemCode
        ];
    }

    /**
     * Specifies a code of the side menu item in the current navigation context.
     * @param string @sideMenuItemCode Specifies the side menu item code
     */
    public function setContextSideMenu($sideMenuItemCode) 
    {
        $this->contextSideMenuItemCode = $sideMenuItemCode;
    }

    /**
     * Determines if a main menu item is active.
     * @param mixed @item Specifies the item object.
     * @return boolean Returns true if the menu item is active.
     */
    public function isMainMenuItemActive($item)
    {
        return $this->contextOwner == $item->owner && $this->contextMainMenuItemCode == $item->code;
    }

    /**
     * Determines if a side menu item is active.
     * @param mixed @item Specifies the item object.
     * @return boolean Returns true if the side item is active.
     */
    public function isSideMenuItemActive($item)
    {
        return $this->contextOwner == $item->owner && $this->contextSideMenuItemCode == $item->code;
    }

    /**
     * Removes menu items from an array if the supplied user lacks permission.
     * @param User $user A user object
     * @param array $items A collection of menu items
     * @return array The filtered menu items
     */
    private function filterItemPermissions($user, array $items)
    {
        $items = array_filter($items, function($item) use ($user) {
            if (!$item->permissions || !count($item->permissions))
                return true;

            return $user->hasAnyAccess($item->permissions);
        });

        return $items;
    }
}