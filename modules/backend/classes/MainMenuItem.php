<?php namespace Backend\Classes;

use October\Rain\Exception\SystemException;

/**
 * Class MainMenuItem
 *
 * @package Backend\Classes
 */
class MainMenuItem
{
    /**
     * @var string
     */
    public $code;

    /**
     * @var string
     */
    public $owner;

    /**
     * @var string
     */
    public $label;

    /**
     * @var null|string
     */
    public $icon;

    /**
     * @var null|string
     */
    public $iconSvg;

    /**
     * @var mixed
     */
    public $counter;

    /**
     * @var null|string
     */
    public $counterLabel;

    /**
     * @var null|string
     */
     public $badge;

    /**
     * @var string
     */
    public $url;

    /**
     * @var array
     */
    public $permissions = [];

    /**
     * @var int
     */
    public $order = 500;

    /**
     * @var SideMenuItem[]
     */
    public $sideMenu = [];

    /**
     * @param string $permission
     * @param array $definition
     */
    public function addPermission(string $permission, array $definition)
    {
        $this->permissions[$permission] = $definition;
    }

    /**
     * @param SideMenuItem $sideMenu
     */
    public function addSideMenuItem(SideMenuItem $sideMenu)
    {
        $this->sideMenu[$sideMenu->code] = $sideMenu;
    }

    /**
     * @param string $code
     * @return SideMenuItem
     * @throws SystemException
     */
    public function getSideMenuItem(string $code)
    {
        if (!array_key_exists($code, $this->sideMenu)) {
            throw new SystemException('No sidenavigation item available with code ' . $code);
        }

        return $this->sideMenu[$code];
    }

    /**
     * @param string $code
     */
    public function removeSideMenuItem(string $code)
    {
        unset($this->sideMenu[$code]);
    }

    /**
     * @param array $data
     * @return static
     */
    public static function createFromArray(array $data)
    {
        $instance = new static();
        $instance->code = $data['code'];
        $instance->owner = $data['owner'];
        $instance->label = $data['label'];
        $instance->url = $data['url'];
        $instance->icon = $data['icon'] ?? null;
        $instance->iconSvg = $data['iconSvg'] ?? null;
        $instance->counter = $data['counter'] ?? null;
        $instance->counterLabel = $data['counterLabel'] ?? null;
        $instance->badge = $data['badge'] ?? null;
        $instance->permissions = $data['permissions'] ?? $instance->permissions;
        $instance->order = $data['order'] ?? $instance->order;
        return $instance;
    }
}
