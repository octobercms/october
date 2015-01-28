<?php namespace Backend\Traits;

use Str;
use File;
use Lang;
use Input;
use Block;
use SystemException;

/**
 * Collapsable Widget Trait
 * Adds collapse/expand item features to back-end widgets
 *
 * @package october\backend
 * @author Alexey Bobkov, Samuel Georges
 */

trait CollapsableWidget
{
    protected $groupStatusCache = false;

    public function onGroupStatusUpdate()
    {
        $this->setGroupStatus(Input::get('group'), Input::get('status'));
    }

    protected function getGroupStatuses()
    {
        if ($this->groupStatusCache !== false) {
            return $this->groupStatusCache;
        }

        $groups = $this->getSession('groups', []);
        if (!is_array($groups)) {
            return $this->groupStatusCache = [];
        }

        return $this->groupStatusCache = $groups;
    }

    protected function setGroupStatus($group, $status)
    {
        $statuses = $this->getGroupStatuses();
        $statuses[$group] = $status;
        $this->groupStatusCache = $statuses;
        $this->putSession('groups', $statuses);
    }

    protected function getGroupStatus($group)
    {
        $statuses = $this->getGroupStatuses();
        if (array_key_exists($group, $statuses)) {
            return $statuses[$group];
        }

        return true;
    }
}
