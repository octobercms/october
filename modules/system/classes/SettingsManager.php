<?php namespace System\Classes;

use App;
use Event;
use System;
use Backend;
use BackendAuth;
use SystemException;

/**
 * SettingsManager manages the system settings
 *
 * @package october\system
 * @author Alexey Bobkov, Samuel Georges
 */
class SettingsManager
{
    /**
     * Allocated category types
     */
    const CATEGORY_CMS = 'system::lang.system.categories.cms';
    const CATEGORY_MISC = 'system::lang.system.categories.misc';
    const CATEGORY_MAIL = 'system::lang.system.categories.mail';
    const CATEGORY_LOGS = 'system::lang.system.categories.logs';
    const CATEGORY_TEAM = 'system::lang.system.categories.team';
    const CATEGORY_USERS = 'system::lang.system.categories.users';
    const CATEGORY_SOCIAL = 'system::lang.system.categories.social';
    const CATEGORY_SYSTEM = 'system::lang.system.categories.system';
    const CATEGORY_EVENTS = 'system::lang.system.categories.events';
    const CATEGORY_BACKEND = 'system::lang.system.categories.backend';
    const CATEGORY_CUSTOMERS = 'system::lang.system.categories.customers';
    const CATEGORY_MYSETTINGS = 'system::lang.system.categories.my_settings';
    const CATEGORY_NOTIFICATIONS = 'system::lang.system.categories.notifications';
    const CATEGORY_SHOP = "Shop";
    const CATEGORY_GLOBALS = "Globals";
    const CATEGORY_COLLECTIONS = "Collections";

    /**
     * @var array items registered
     */
    protected $items;

    /**
     * @var array groupedItems by category
     */
    protected $groupedItems;

    /**
     * @var string contextOwner is the active plugin or module owner.
     */
    protected $contextOwner;

    /**
     * @var string contextItemCode for active item
     */
    protected $contextItemCode;

    /**
     * instance creates a new instance of this singleton
     */
    public static function instance(): static
    {
        return App::make('system.settings');
    }

    /**
     * registerCallback function that defines setting items.
     * The callback function should register setting items by calling the manager's
     * registerSettingItems() function. The manager instance is passed to the
     * callback function as an argument. Usage:
     *
     *     SettingsManager::registerCallback(function ($manager) {
     *         $manager->registerSettingItems([...]);
     *     });
     *
     * @deprecated this will be removed in a later version
     * @param callable $callback A callable function.
     */
    public function registerCallback(callable $callback)
    {
        App::extendInstance('system.settings', $callback);
    }

    /**
     * loadItems
     */
    protected function loadItems()
    {
        // Load module items
        foreach (System::listModules() as $module) {
            if ($provider = App::getProvider($module . '\\ServiceProvider')) {
                $items = $provider->registerSettings();
                if (is_array($items)) {
                    $this->registerSettingItems('October.'.$module, $items);
                }
            }
        }

        // Load plugin items
        foreach (PluginManager::instance()->getPlugins() as $id => $plugin) {
            $items = $plugin->registerSettings();
            if (is_array($items)) {
                $this->registerSettingItems($id, $items);
            }
        }

        // Load app items
        if ($app = App::getProvider(\App\Provider::class)) {
            $items = $app->registerSettings();
            if (is_array($items)) {
                $this->registerSettingItems('October.App', $items);
            }
        }

        /**
         * @event system.settings.extendItems
         * Provides an opportunity to manipulate the system settings manager
         *
         * Example usage:
         *
         *     Event::listen('system.settings.extendItems', function ((\System\Classes\SettingsManager) $settingsManager) {
         *         $settingsManager->addSettingItem(...)
         *         $settingsManager->removeSettingItem(...)
         *     });
         *
         */
        Event::fire('system.settings.extendItems', [$this]);

        // Sort settings items
        usort($this->items, function ($a, $b) {
            return $a->order - $b->order;
        });

        // Filter items user lacks permission for
        $user = BackendAuth::getUser();
        $this->items = $this->filterItemPermissions($user, $this->items);

        // Process each item in to a category array
        $catItems = [];
        foreach ($this->items as $code => $item) {
            // For YAML, eg: CATEGORY_SYSTEM
            if (defined("static::{$item->category}")) {
                $category = constant("static::{$item->category}");
            }
            else {
                $category = $item->category ?: self::CATEGORY_MISC;
            }
            if (!isset($catItems[$category])) {
                $catItems[$category] = [];
            }

            $catItems[$category][$code] = $item;
        }

        $this->groupedItems = $catItems;
    }

    /**
     * listItems returns a collection of all settings by group, filtered by context
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
     * listAllItems as a flat array
     */
    public function listAllItems(?string $context = null): array
    {
        if ($this->items === null) {
            $this->loadItems();
        }

        // Emulate groups for filterByContext by wrapping and unwrapping
        if ($context !== null) {
            return $this->filterByContext([$this->items], $context)[0];
        }

        return $this->items;
    }

    /**
     * filterByContext filters a set of items by a given context.
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
     * registerSettingItems registers the backend setting items.
     * The argument is an array of the settings items. The array keys represent the
     * setting item codes, specific for the plugin/module. Each element in the
     * array should be an associative array with the following keys:
     * - label - specifies the settings label localization string key, required.
     * - icon - an icon name from the Font Awesome icon collection, required if iconSvg is not provided.
     * - iconSvg - path to a SVG icon file.
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
     * addSettingItems dynamically adds an array of setting items
     * @param string $owner
     * @param array  $definitions
     */
    public function addSettingItems($owner, array $definitions)
    {
        foreach ($definitions as $code => $definition) {
            if ($definition && is_array($definition)) {
                $this->addSettingItem($owner, $code, $definition);
            }
        }
    }

    /**
     * addSettingItem dynamically adds a single setting item
     * @param string $owner
     * @param string $code
     * @param array  $definitions
     */
    public function addSettingItem($owner, $code, array $definition)
    {
        $itemKey = $this->makeItemKey($owner, $code);

        if (isset($this->items[$itemKey])) {
            $definition = array_merge((array) $this->items[$itemKey], $definition);
        }

        $item = array_merge($definition, [
            'code' => $code,
            'owner' => $owner
        ]);

        // Link to the generic settings page if a URL is not provided
        if (isset($item['class']) && !isset($item['url'])) {
            $uri = [];

            if (strpos($owner, '.') !== false) {
                [$author, $plugin] = explode('.', $owner);
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

        $this->items[$itemKey] = $this->defineSettingsMenuItem($item);
    }

    /**
     * defineSettingsMenuItem
     */
    protected function defineSettingsMenuItem(array $config): SettingsMenuItem
    {
        return (new SettingsMenuItem)->useConfig($config);
    }

    /**
     * removeSettingItem using its owner and code
     * @param string $owner
     * @param string $code
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
     * setContext sets the navigation context. The owner specifies the setting items owner
     * plugin or module in the format Vendor.Module. The code specifies the settings item code.
     * @param string $owner
     * @param string $code
     */
    public static function setContext($owner, $code)
    {
        $instance = self::instance();

        $instance->contextOwner = strtolower($owner);

        $instance->contextItemCode = strtolower($code);
    }

    /**
     * getContext returns information about the current settings context.
     * Returns an object with the following fields:
     * - itemCode
     * - owner
     * @return mixed
     */
    public function getContext()
    {
        return (object) [
            'itemCode' => $this->contextItemCode,
            'owner' => $this->contextOwner
        ];
    }

    /**
     * findSettingItem locates a setting item object by its owner and code.
     * Returns the item object or FALSE if nothing is found.
     * @param string $owner
     * @param string $code
     * @return mixed
     */
    public function findSettingItem($owner, $code)
    {
        if ($this->items === null) {
            $this->loadItems();
        }

        $owner = strtolower($owner);
        $code = strtolower($code);

        foreach ($this->items as $item) {
            if (strtolower($item->owner) === $owner && strtolower($item->code) === $code) {
                return $item;
            }
        }

        return false;
    }

    /**
     * filterItemPermissions removes settings items if the supplied user lacks permission.
     * Returns the filtered settings items.
     * @param User $user
     * @param array $items
     * @return array
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
     * makeItemKey is an internal method to make a unique key for an item.
     * @param  object $item
     * @return string
     */
    protected function makeItemKey($owner, $code)
    {
        return strtoupper($owner).'.'.strtoupper($code);
    }
}
