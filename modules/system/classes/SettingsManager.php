<?php namespace System\Classes;

use Event;
use Backend;
use BackendAuth;
use System\Classes\PluginManager;
use SystemException;

/**
 * Manages the system settings.
 *
 * @package october\system
 * @author Alexey Bobkov, Samuel Georges
 */
class SettingsManager
{
    use \October\Rain\Support\Traits\Singleton;

    /**
     * Allocated category types
     */
    const CATEGORY_CMS = 'system::lang.system.categories.cms';
    const CATEGORY_MISC = 'system::lang.system.categories.misc';
    const CATEGORY_MAIL = 'system::lang.system.categories.mail';
    const CATEGORY_LOGS = 'system::lang.system.categories.logs';
    const CATEGORY_SHOP = 'system::lang.system.categories.shop';
    const CATEGORY_TEAM = 'system::lang.system.categories.team';
    const CATEGORY_USERS = 'system::lang.system.categories.users';
    const CATEGORY_SOCIAL = 'system::lang.system.categories.social';
    const CATEGORY_SYSTEM = 'system::lang.system.categories.system';
    const CATEGORY_EVENTS = 'system::lang.system.categories.events';
    const CATEGORY_CUSTOMERS = 'system::lang.system.categories.customers';
    const CATEGORY_MYSETTINGS = 'system::lang.system.categories.my_settings';

    /**
     * @var array Cache of registration callbacks.
     */
    protected $callbacks = [];

    /**
     * @var array List of registered items.
     */
    protected $items;

    /**
     * @var array Grouped collection of all items, by category.
     */
    protected $groupedItems;

    /**
     * @var string Active plugin or module owner.
     */
    protected $contextOwner;

    /**
     * @var string Active item code.
     */
    protected $contextItemCode;

    /**
     * @var array Settings item defaults.
     */
    protected static $itemDefaults = [
        'code'        => null,
        'label'       => null,
        'category'    => null,
        'icon'        => null,
        'url'         => null,
        'permissions' => [],
        'order'       => 500,
        'context'     => 'system',
        'keywords'    => null
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
            $items = $plugin->registerSettings();
            if (!is_array($items)) {
                continue;
            }

            $this->registerSettingItems($id, $items);
        }

        /*
         * Extensibility
         */
        Event::fire('system.settings.extendItems', [$this]);

        /*
         * Sort settings items
         */
        usort($this->items, function ($a, $b) {
            return $a->order - $b->order;
        });

        /*
         * Filter items user lacks permission for
         */
        $user = BackendAuth::getUser();
        $this->items = $this->filterItemPermissions($user, $this->items);

        /*
         * Process each item in to a category array
         */
        $catItems = [];
        foreach ($this->items as $code => $item) {
            $category = $item->category ?: self::CATEGORY_MISC;
            if (!isset($catItems[$category])) {
                $catItems[$category] = [];
            }

            $catItems[$category][$code] = $item;
        }

        $this->groupedItems = $catItems;
    }

    /**
     * Returns a collection of all settings by group, filtered by context
     * @param  string $context
     * @return array
     */
    public function listItems($context = null)
    {
        if ($this->items === null) {
            $this->loadItems();
        }

        if ($context !== null) {
            return $this->filterByContext($this->groupedItems, $context);
        }

        return $this->groupedItems;
    }

    /**
     * Filters a set of items by a given context.
     * @param  array $items
     * @param  string $context
     * @return array
     */
    protected function filterByContext($items, $context)
    {
        $filteredItems = [];
        foreach ($items as $categoryName => $category) {

            $filteredCategory = [];
            foreach ($category as $item) {
                $itemContext = is_array($item->context) ? $item->context : [$item->context];
                if (in_array($context, $itemContext)) {
                    $filteredCategory[] = $item;
                }
            }

            if (count($filteredCategory)) {
                $filteredItems[$categoryName] = $filteredCategory;
            }
        }

        return $filteredItems;
    }

    /**
     * Registers a callback function that defines setting items.
     * The callback function should register setting items by calling the manager's
     * registerSettingItems() function. The manager instance is passed to the
     * callback function as an argument.
     * Usage:
     *
     *     SettingsManager::registerCallback(function($manager){
     *         $manager->registerSettingItems([...]);
     *     });
     *
     * @param callable $callback A callable function.
     */
    public function registerCallback(callable $callback)
    {
        $this->callbacks[] = $callback;
    }

    /**
     * Registers the back-end setting items.
     * The argument is an array of the settings items. The array keys represent the
     * setting item codes, specific for the plugin/module. Each element in the
     * array should be an associative array with the following keys:
     * - label - specifies the settings label localization string key, required.
     * - icon - an icon name from the Font Awesome icon collection, required.
     * - url - the back-end relative URL the setting item should point to.
     * - class - the back-end relative URL the setting item should point to.
     * - permissions - an array of permissions the back-end user should have, optional.
     *   The item will be displayed if the user has any of the specified permissions.
     * - order - a position of the item in the setting, optional.
     * - category - a string to assign this item to a category, optional.
     * @param string $owner Specifies the setting items owner plugin or module in the format Vendor.Module.
     * @param array $definitions An array of the setting item definitions.
     */
    public function registerSettingItems($owner, array $definitions)
    {
        if (!$this->items) {
            $this->items = [];
        }

        $this->addSettingItems($owner, $definitions);
    }

    /**
     * Dynamically add an array of setting items
     * @param string $owner
     * @param array  $definitions
     */
    public function addSettingItems($owner, array $definitions)
    {
        foreach ($definitions as $code => $definition) {
            $this->addSettingItem($owner, $code, $definition);
        }
    }

    /**
     * Dynamically add a single setting item
     * @param string $owner
     * @param string $code
     * @param array  $definitions
     */
    public function addSettingItem($owner, $code, array $definition)
    {
        $itemKey = $this->makeItemKey($owner, $code);

        $item = array_merge(self::$itemDefaults, array_merge($definition, [
            'code' => $code,
            'owner' => $owner
        ]));

        /*
         * Link to the generic settings page
         */
        if (isset($item['class'])) {
            $uri = [];

            if (strpos($owner, '.') !== null) {
                list($author, $plugin) = explode('.', $owner);
                $uri[] = strtolower($author);
                $uri[] = strtolower($plugin);
            }
            else {
                $uri[] = strtolower($owner);
            }

            $uri[] = strtolower($code);
            $uri =  implode('/', $uri);
            $item['url'] = Backend::url('system/settings/update/' . $uri);
        }

        $this->items[$itemKey] = (object) $item;
    }

    /**
     * Removes a single setting item
     */
    public function removeSettingItem($owner, $code)
    {
        if (!$this->items) {
            throw new SystemException('Unable to remove settings item before items are loaded.');
        }

        $itemKey = $this->makeItemKey($owner, $code);
        unset($this->items[$itemKey]);

        if ($this->groupedItems) {
            foreach ($this->groupedItems as $category => $items) {
                if (isset($items[$itemKey])) {
                    unset($this->groupedItems[$category][$itemKey]);
                }
            }
        }
    }

    /**
     * Sets the navigation context.
     * @param string $owner Specifies the setting items owner plugin or module in the format Vendor.Module.
     * @param string $code Specifies the settings item code.
     */
    public static function setContext($owner, $code)
    {
        $instance = self::instance();

        $instance->contextOwner = strtolower($owner);
        $instance->contextItemCode = strtolower($code);
    }

    /**
     * Returns information about the current settings context.
     * @return mixed Returns an object with the following fields:
     * - itemCode
     * - owner
     */
    public function getContext()
    {
        return (object) [
            'itemCode' => $this->contextItemCode,
            'owner' => $this->contextOwner
        ];
    }

    /**
     * Locates a setting item object by it's owner and code
     * @param string $owner
     * @param string $code
     * @return mixed The item object or FALSE if nothing is found
     */
    public function findSettingItem($owner, $code)
    {
        if ($this->items === null) {
            $this->loadItems();
        }

        $owner = strtolower($owner);
        $code = strtolower($code);

        foreach ($this->items as $item) {
            if (strtolower($item->owner) == $owner && strtolower($item->code) == $code) {
                return $item;
            }
        }

        return false;
    }

    /**
     * Removes settings items from an array if the supplied user lacks permission.
     * @param User $user A user object
     * @param array $items A collection of setting items
     * @return array The filtered settings items
     */
    protected function filterItemPermissions($user, array $items)
    {
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
