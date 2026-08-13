<?php namespace System\Classes;

use Html;
use October\Rain\Element\Navigation\ItemDefinition;

/**
 * SettingsMenuItem
 *
 * @method SettingsMenuItem owner(string $owner) owner
 * @method SettingsMenuItem iconSvg(null|string $iconSvg) iconSvg
 * @method SettingsMenuItem counter(mixed $counter) counter
 * @method SettingsMenuItem counterLabel(null|string $counterLabel) counterLabel
 * @method SettingsMenuItem attributes(array $attributes) attributes
 * @method SettingsMenuItem permissions(array $permissions) permissions
 * @method SettingsMenuItem context(string $context) context as system, mysettings
 * @method SettingsMenuItem class(string $class) class for the model or other management record
 * @method SettingsMenuItem size(string $size) size as tiny, small, medium, large, huge, giant, adaptive
 *
 * @package october\backend
 * @author Alexey Bobkov, Samuel Georges
 */
class SettingsMenuItem extends ItemDefinition
{
    /**
     * initDefaultValues for this scope
     */
    protected function initDefaultValues()
    {
        parent::initDefaultValues();

        $this
            ->order(500)
            ->context('system')
            ->attributes([])
            ->permissions([])
        ;
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
