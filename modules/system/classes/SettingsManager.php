<?php namespace System\Classes;

use Backend;
use BackendAuth;
use System\Classes\PluginManager;

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
     * @var array Flat collection of all items.
     */
    protected $allItems;

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
        foreach ($this->items as $item) {
            $category = $item->category ?: 'Misc';
            if (!isset($catItems[$category])) {
                $catItems[$category] = [];
            }

            $catItems[$category][] = $item;
        }

        $this->allItems = $this->items;
        $this->items = $catItems;
    }

    /**
     * Returns a collection of all settings
     */
    public function listItems($context = null)
    {
        if ($this->items === null) {
            $this->loadItems();
        }

        if ($context !== null) {
            return $this->filterByContext($this->items, $context);
        }

        return $this->items;
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
     * callback function as an argument. Usage:
     * <pre>
     *   SettingsManager::registerCallback(function($manager){
     *       $manager->registerSettingItems([...]);
     *   });
     * </pre>
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
     * @param string $owner Specifies the setting items owner plugin or module in the format Vendor/Module.
     * @param array $definitions An array of the setting item definitions.
     */
    public function registerSettingItems($owner, array $definitions)
    {
        if (!$this->items) {
            $this->items = [];
        }

        foreach ($definitions as $code => $definition) {
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

            $this->items[] = (object)$item;
        }
    }

    /**
     * Sets the navigation context.
     * @param string $owner Specifies the setting items owner plugin or module in the format Vendor/Module.
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
        return (object)[
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
        if ($this->allItems === null) {
            $this->loadItems();
        }

        $owner = strtolower($owner);
        $code = strtolower($code);

        foreach ($this->allItems as $item) {
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
}
