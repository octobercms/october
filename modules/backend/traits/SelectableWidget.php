<?php namespace Backend\Traits;

use Str;
use File;
use Lang;
use Input;
use Block;
use SystemException;

/**
 * Selectable Widget Trait
 * Adds item selection features to back-end widgets
 *
 * @package october\backend
 * @author Alexey Bobkov, Samuel Georges
 */

trait SelectableWidget
{
    protected $selectedItemsCache = false;

    protected $selectionInputName = 'object';

    public function onSelect()
    {
        $this->extendSelection();
    }

    protected function getSelectedItems()
    {
        if ($this->selectedItemsCache !== false) {
            return $this->selectedItemsCache;
        }

        $items = $this->getSession('selected', []);
        if (!is_array($items)) {
            return $this->selectedItemsCache = [];
        }

        return $this->selectedItemsCache = $items;
    }

    protected function extendSelection()
    {
        $items = Input::get($this->selectionInputName, []);
        $currentSelection = $this->getSelectedItems();

        $this->putSession('selected', array_merge($currentSelection, $items));
    }

    protected function resetSelection()
    {
        $this->putSession('selected', []);
    }

    protected function isItemSelected($itemId)
    {
        $selectedItems = $this->getSelectedItems();
        if (!is_array($selectedItems) || !isset($selectedItems[$itemId])) {
            return false;
        }

        return $selectedItems[$itemId];
    }
}
