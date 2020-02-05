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
     * @return string
     */
    public function getCode(): string
    {
        return $this->code;
    }

    /**
     * @param string $code
     */
    public function setCode(string $code)
    {
        $this->code = $code;
    }

    /**
     * @return string
     */
    public function getOwner(): string
    {
        return $this->owner;
    }

    /**
     * @param string $owner
     */
    public function setOwner(string $owner)
    {
        $this->owner = $owner;
    }

    /**
     * @return string
     */
    public function getLabel(): string
    {
        return $this->label;
    }

    /**
     * @param string $label
     */
    public function setLabel(string $label)
    {
        $this->label = $label;
    }

    /**
     * @return string|null
     */
    public function getIcon()
    {
        return $this->icon;
    }

    /**
     * @param string|null $icon
     */
    public function setIcon($icon)
    {
        $this->icon = $icon;
    }

    /**
     * @return string|null
     */
    public function getIconSvg()
    {
        return $this->iconSvg;
    }

    /**
     * @param string|null $iconSvg
     */
    public function setIconSvg($iconSvg)
    {
        $this->iconSvg = $iconSvg;
    }

    /**
     * @return mixed
     */
    public function getCounter()
    {
        return $this->counter;
    }

    /**
     * @param mixed $counter
     */
    public function setCounter($counter)
    {
        $this->counter = $counter;
    }

    /**
     * @return string|null
     */
    public function getCounterLabel()
    {
        return $this->counterLabel;
    }

    /**
     * @param string|null $counterLabel
     */
    public function setCounterLabel($counterLabel)
    {
        $this->counterLabel = $counterLabel;
    }

    /**
     * @return string
     */
    public function getUrl(): string
    {
        return $this->url;
    }

    /**
     * @param string $url
     */
    public function setUrl(string $url)
    {
        $this->url = $url;
    }

    /**
     * @return array
     */
    public function getPermissions(): array
    {
        return $this->permissions;
    }

    /**
     * @param array $permissions
     */
    public function setPermissions(array $permissions)
    {
        $this->permissions = $permissions;
    }

    /**
     * @param string $permission
     * @param array $definition
     */
    public function addPermission(string $permission, array $definition)
    {
        $this->permissions[$permission] = $definition;
    }

    /**
     * @return int
     */
    public function getOrder(): int
    {
        return $this->order;
    }

    /**
     * @param int $order
     */
    public function setOrder(int $order)
    {
        $this->order = $order;
    }

    /**
     * @return array
     */
    public function getSideMenu(): array
    {
        return $this->sideMenu;
    }

    /**
     * @param SideMenuItem $sideMenu
     */
    public function addSideMenuItem(SideMenuItem $sideMenu)
    {
        $this->sideMenu[$sideMenu->getCode()] = $sideMenu;
    }

    /**
     * @param string $code
     * @return SideMenuItem
     * @throws SystemException
     */
    public function getSideMenuItem(string $code): SideMenuItem
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
    public static function createFromArray(array $data): self
    {
        $instance = new self();
        $instance->code = $data['code'];
        $instance->owner = $data['owner'];
        $instance->label = $data['label'];
        $instance->url = $data['url'];
        $instance->icon = $data['icon'] ?? null;
        $instance->iconSvg = $data['iconSvg'] ?? null;
        $instance->counter = $data['counter'] ?? null;
        $instance->counterLabel = $data['counterLabel'] ?? null;
        $instance->permissions = $data['permissions'] ?? $instance->permissions;
        $instance->order = $data['order'] ?? $instance->order;
        return $instance;
    }
}
