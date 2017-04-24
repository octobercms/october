<?php namespace Backend\Classes;

use System\Classes\PluginManager;
use October\Rain\Auth\Manager as RainAuthManager;

/**
 * Back-end authentication manager.
 *
 * @package october\backend
 * @author Alexey Bobkov, Samuel Georges
 */
class AuthManager extends RainAuthManager
{
    protected static $instance;

    protected $sessionKey = 'admin_auth';

    protected $userModel = 'Backend\Models\User';

    protected $groupModel = 'Backend\Models\UserGroup';

    protected $throttleModel = 'Backend\Models\UserThrottle';

    protected $requireActivation = false;

    //
    // Permission management
    //

    protected static $permissionDefaults = [
        'code'    => null,
        'label'   => null,
        'comment' => null,
        'order'   => 500
    ];

    /**
     * @var array Cache of registration callbacks.
     */
    protected $callbacks = [];

    /**
     * @var array List of registered permissions.
     */
    protected $permissions = [];

    /**
     * @var array Cache of registered permissions.
     */
    protected $permissionCache = false;

    /**
     * Registers a callback function that defines authentication permissions.
     * The callback function should register permissions by calling the manager's
     * registerPermissions() function. The manager instance is passed to the
     * callback function as an argument. Usage:
     *
     *     BackendAuth::registerCallback(function($manager){
     *         $manager->registerPermissions([...]);
     *     });
     *
     * @param callable $callback A callable function.
     */
    public function registerCallback(callable $callback)
    {
        $this->callbacks[] = $callback;
    }

    /**
     * Registers the back-end permission items.
     * The argument is an array of the permissions. The array keys represent the
     * permission codes, specific for the plugin/module. Each element in the
     * array should be an associative array with the following keys:
     * - label - specifies the menu label localization string key, required.
     * - order - a position of the item in the menu, optional.
     * - comment - a brief comment that describes the permission, optional.
     * - tab - assign this permission to a tabbed group, optional.
     * @param string $owner Specifies the menu items owner plugin or module in the format Vendor/Module.
     * @param array $definitions An array of the menu item definitions.
     */
    public function registerPermissions($owner, array $definitions)
    {
        foreach ($definitions as $code => $definition) {
            $permission = (object)array_merge(self::$permissionDefaults, array_merge($definition, [
                'code' => $code,
                'owner' => $owner
            ]));

            $this->permissions[] = $permission;
        }
    }

    /**
     * Returns a list of the registered permissions items.
     * @return array
     */
    public function listPermissions()
    {
        if ($this->permissionCache !== false) {
            return $this->permissionCache;
        }

        /*
         * Load module items
         */
        foreach ($this->callbacks as $callback) {
            $callback($this);
        }

        /*
         * Load plugin items
         */
        $plugins = PluginManager::instance()->getPlugins();

        foreach ($plugins as $id => $plugin) {
            $items = $plugin->registerPermissions();
            if (!is_array($items)) {
                continue;
            }

            $this->registerPermissions($id, $items);
        }

        /*
         * Sort permission items
         */
        usort($this->permissions, function ($a, $b) {
            if ($a->order == $b->order) {
                return 0;
            }

            return $a->order > $b->order ? 1 : -1;
        });

        return $this->permissionCache = $this->permissions;
    }

    /**
     * Returns an array of registered permissions, grouped by tabs.
     * @return array
     */
    public function listTabbedPermissions()
    {
        $tabs = [];

        foreach ($this->listPermissions() as $permission) {
            $tab = isset($permission->tab)
                ? $permission->tab
                : 'backend::lang.form.undefined_tab';

            if (!array_key_exists($tab, $tabs)) {
                $tabs[$tab] = [];
            }

            $tabs[$tab][] = $permission;
        }

        return $tabs;
    }
}
