<?php namespace Backend\Classes\NavigationManager;

/**
 * HasNavigationContext
 *
 * @package october\backend
 * @author Alexey Bobkov, Samuel Georges
 */
trait HasNavigationContext
{
    /**
     * @var string contextOwner
     */
    protected $contextOwner;

    /**
     * @var string contextMainMenuItemCode
     */
    protected $contextMainMenuItemCode;

    /**
     * @var string contextSideMenuItemCode
     */
    protected $contextSideMenuItemCode;

    /**
     * @var array contextSidenavPartials
     */
    protected $contextSidenavPartials = [];

    /**
     * setContext sets the navigation context for the current controller. The function sets
     * the navigation owner, main menu item code and the side menu item code (optional).
     * The navigation owner is in the format of Author.Plugin or Module name.
     * @param string $owner
     * @param string $mainMenuItemCode
     * @param string $sideMenuItemCode
     */
    public function setContext($owner, $mainMenuItemCode, $sideMenuItemCode = null)
    {
        $this->setContextOwner($owner);
        $this->setContextMainMenu($mainMenuItemCode);
        $this->setContextSideMenu($sideMenuItemCode);
    }

    /**
     * setContextOwner sets the navigation context owner.
     * The navigation owner is in the format of Author.Plugin or Module name.
     * @param string $owner
     */
    public function setContextOwner($owner)
    {
        $this->contextOwner = $owner;
    }

    /**
     * setContextMainMenu specifies a code of the main menu item in the current
     * navigation context.
     * @param string $mainMenuItemCode
     */
    public function setContextMainMenu($mainMenuItemCode)
    {
        $this->contextMainMenuItemCode = $mainMenuItemCode;
    }

    /**
     * setContextSideMenu specifies a code of the side menu item in the current navigation context.
     * If the code is set to TRUE, the first item will be flagged as active.
     * @param string $sideMenuItemCode
     */
    public function setContextSideMenu($sideMenuItemCode)
    {
        $this->contextSideMenuItemCode = $sideMenuItemCode;
    }

    /**
     * getContext returns information about the current navigation context.
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
     * isMainMenuItemActive determines if a main menu item is active.
     * Returns true if the menu item is active.
     * @param \Backend\Classes\MainMenuItem $item
     * @return bool
     */
    public function isMainMenuItemActive($item)
    {
        return $this->contextOwner === $item->owner && $this->contextMainMenuItemCode === $item->code;
    }

    /**
     * isDashboardItemActive determines if the dashboard is active.
     * @return bool
     */
    public function isDashboardItemActive()
    {
        return $this->contextOwner === 'October.Dashboard' && $this->contextMainMenuItemCode === 'dashboard';
    }

    /**
     * isSideMenuItemActive determines if a side menu item is active.
     * @param SideMenuItem $item
     */
    public function isSideMenuItemActive($item): bool
    {
        if ($this->contextSideMenuItemCode === true) {
            $this->contextSideMenuItemCode = null;
            return true;
        }

        return $this->contextOwner === $item->owner && $this->contextSideMenuItemCode === $item->code;
    }


    /**
     * isSideMenuItemActive determines if a side menu item is active.
     * @param SideMenuItem $item
     */
    public function isSideMenuItemVisible($item): bool
    {
        if (!$item->visibleOn) {
            return true;
        }

        if ($this->contextOwner === $item->owner && in_array($this->contextSideMenuItemCode, (array) $item->visibleOn)) {
            return true;
        }

        return false;
    }

    /**
     * registerContextSidenavPartial registers a special side navigation partial for a specific
     * main menu. The sidenav partial replaces the standard side navigation.
     * @param string $owner Specifies the navigation owner in the format Vendor/Module.
     * @param string $mainMenuItemCode Specifies the main menu item code.
     * @param string $partial Specifies the partial name.
     */
    public function registerContextSidenavPartial($owner, $mainMenuItemCode, $partial)
    {
        $this->contextSidenavPartials[$owner.$mainMenuItemCode] = $partial;
    }

    /**
     * getContextSidenavPartial returns the side navigation partial for a specific main menu
     * previously registered with the registerContextSidenavPartial() method.
     * @param string $owner Specifies the navigation owner in the format Vendor/Module.
     * @param string $mainMenuItemCode Specifies the main menu item code.
     * @return mixed Returns the partial name or null.
     */
    public function getContextSidenavPartial($owner, $mainMenuItemCode)
    {
        $key = $owner.$mainMenuItemCode;

        return $this->contextSidenavPartials[$key] ?? null;
    }
}
