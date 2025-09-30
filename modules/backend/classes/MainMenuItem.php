<?php namespace Backend\Classes;

use Html;
use October\Rain\Element\Navigation\ItemDefinition;

/**
 * MainMenuItem
 *
 * @method MainMenuItem owner(string $owner) owner
 * @method MainMenuItem iconSvg(null|string $iconSvg) iconSvg
 * @method MainMenuItem counter(mixed $counter) counter
 * @method MainMenuItem counterLabel(null|string $counterLabel) counterLabel
 * @method MainMenuItem attributes(array $attributes) attributes
 * @method MainMenuItem permissions(array $permissions) permissions
 * @method MainMenuItem sideMenu(SideMenuItem[] $sideMenu) sideMenu
 * @method MainMenuItem useDropdown(bool $useDropdown) useDropdown
 *
 * @package october\backend
 * @author Alexey Bobkov, Samuel Georges
 */
class MainMenuItem extends ItemDefinition
{
    /**
     * initDefaultValues for this scope
     */
    protected function initDefaultValues()
    {
        parent::initDefaultValues();

        $this
            ->order(500)
            ->permissions([])
            ->sideMenu([])
            ->useDropdown(true)
        ;
    }

    /**
     * addPermission
     * @param string $permission
     * @param array $definition
     */
    public function addPermission(string $permission, array $definition)
    {
        $this->config['permissions'][$permission] = $definition;
    }

    /**
     * addSideMenuItem
     * @param SideMenuItem $sideMenu
     */
    public function addSideMenuItem(SideMenuItem $sideMenu)
    {
        $this->config['sideMenu'][$sideMenu->code] = $sideMenu;
    }

    /**
     * getSideMenuItem
     */
    public function getSideMenuItem(string $code): ?SideMenuItem
    {
        return $this->config['sideMenu'][$code] ?? null;
    }

    /**
     * removeSideMenuItem
     * @param string $code
     */
    public function removeSideMenuItem(string $code)
    {
        unset($this->config['sideMenu'][$code]);
    }

    /**
     * itemAttributes returns HTML attributes for the list item
     */
    public function itemAttributes(): string
    {
        if ($this->attributes === null) {
            return '';
        }

        return Html::attributes(array_except($this->attributes, ['target']));
    }

    /**
     * linkAttributes returns HTML for the anchor link
     */
    public function linkAttributes(): string
    {
        if (!isset($this->attributes['target'])) {
            return '';
        }

        return Html::attributes(array_only($this->attributes, ['target']));
    }
}
