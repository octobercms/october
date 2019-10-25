<?php namespace Backend\Traits;

/**
 * Collapsable Widget Trait
 * Adds collapse/expand item features to back-end widgets
 *
 * @package october\backend
 * @author Alexey Bobkov, Samuel Georges
 */

trait CollapsableWidget
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

    //
    // Deprecations, remove if year >= 2019
    //

    /**
     * @deprecated  onGroupStatusUpdate is deprecated. Please update onSetCollapseStatus instead.
     */
    public function onGroupStatusUpdate()
    {
        traceLog('onGroupStatusUpdate is deprecated. Please update onSetCollapseStatus instead. Class: '.get_class($this));
        $this->onSetCollapseStatus();
    }

    /**
     * @deprecated - getGroupStatuses is deprecated. Please update getCollapseStatuses instead.
     */
    protected function getGroupStatuses()
    {
        traceLog('getGroupStatuses is deprecated. Please update getCollapseStatuses instead. Class: '.get_class($this));
        return $this->getCollapseStatuses();
    }

    /**
     * @deprecated - setGroupStatus is deprecated. Please update setCollapseStatus instead.
     */
    protected function setGroupStatus($group, $status)
    {
        traceLog('setGroupStatus is deprecated. Please update setCollapseStatus instead. Class: '.get_class($this));
        return $this->setCollapseStatus($group, $status);
    }

    /**
     * @deprecated - getGroupStatus is deprecated. Please update getCollapseStatus instead.
     */
    protected function getGroupStatus($group, $default = true)
    {
        traceLog('getGroupStatus is deprecated. Please update getCollapseStatus instead. Class: '.get_class($this));
        return $this->getCollapseStatus($group, $default);
    }
}
