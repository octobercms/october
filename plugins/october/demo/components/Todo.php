<?php namespace October\Demo\Components;

use Cms\Classes\ComponentBase;
use ApplicationException;

/**
 * Todo component
 */
class Todo extends ComponentBase
{
    public function componentDetails()
    {
        return [
            'name' => 'To Do List',
            'description' => 'Implements a simple to-do list.'
        ];
    }

    public function defineProperties()
    {
        return [
            'max' => [
                'description' => 'The most amount of To Do items allowed',
                'title' => 'Max items',
                'default' => 10,
                'type' => 'string',
                'validationPattern' => '^[0-9]+$',
                'validationMessage' => 'The Max Items value is required and should be integer.'
            ],
            'addDefault' => [
                'description' => 'Determines if default items must be added to the To Do list',
                'title' => 'Add default items',
                'type' => 'checkbox',
                'default' => 0
            ]
        ];
    }

    public function onRun()
    {
        if ($this->property('addDefault')) {
            $this->page['items'] = ['Learn October CMS'];
        }
    }

    public function onAddItem()
    {
        $items = post('items', []);

        if (count($items) >= $this->property('max')) {
            throw new ApplicationException(sprintf('Sorry only %s items are allowed.', $this->property('max')));
        }

        if (($newItem = post('newItem')) != '') {
            $items[] = $newItem;
        }

        $this->page['items'] = $items;
    }
}
