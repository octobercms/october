<?php namespace Backend\Traits;

/**
 * Collapsible Widget Trait
 * Adds collapse/expand item features to back-end widgets
 *
 * @package october\backend
 * @author Alexey Bobkov, Samuel Georges
 */

trait CollapsibleWidget
{
    /**
     * @var string The key name to use when storing collapsed states in the session.
     */
    public $collapseSessionKey = 'groups';

    /**
     * @var array|false Memory cache of collapsed states.
     */
    protected $collapseGroupStatusCache = false;

    /**
     * AJAX handler to toggle a collapsed state. This should take two post variables:
     * - group: The collapsible group name
     * - status: The state of the group. Usually a 1 or a 0.
     *
     * @return void
     */
    public function onSetCollapseStatus()
    {
        $this->setCollapseStatus(post('group'), post('status'));
    }

    /**
     * Returns the array of all collapsed states belonging to this widget.
     *
     * @return array
     */
    protected function getCollapseStatuses()
    {
        if ($this->collapseGroupStatusCache !== false) {
            return $this->collapseGroupStatusCache;
        }

        $groups = $this->getSession($this->collapseSessionKey, []);

        if (!is_array($groups)) {
            return $this->collapseGroupStatusCache = [];
        }

        return $this->collapseGroupStatusCache = $groups;
    }

    /**
     * Sets a collapsed state.
     *
     * @param string $group
     * @param string $status
     */
    protected function setCollapseStatus($group, $status)
    {
        $statuses = $this->getCollapseStatuses();

        $statuses[$group] = $status;

        $this->collapseGroupStatusCache = $statuses;

        $this->putSession($this->collapseSessionKey, $statuses);
    }

    /**
     * Gets a collapsed state.
     *
     * @param string $group
     * @param bool $default
     * @return bool|string
     */
    protected function getCollapseStatus($group, $default = true)
    {
        $statuses = $this->getCollapseStatuses();

        if (array_key_exists($group, $statuses)) {
            return $statuses[$group];
        }

        return $default;
    }
}
