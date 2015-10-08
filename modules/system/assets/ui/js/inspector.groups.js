/*
 * Inspector grouping support.
 *
 */
+function ($) { "use strict";

    // GROUP MANAGER CLASS
    // ============================

    var GroupManager = function(controlId) {
        this.controlId = controlId
        this.rootGroup = null
        this.cachedGroupStatuses = null
    }

    GroupManager.prototype.createGroup = function(groupId, parentGroup) {
        var group = new Group(groupId)

        if (parentGroup) {
            parentGroup.groups.push(group)
            group.parentGroup = parentGroup // Circular reference, but memory leaks are not noticed
        }
        else {
            this.rootGroup = group
        }

        return group
    }

    GroupManager.prototype.getGroupIndex = function(group) {
        return group.getGroupIndex()
    }

    GroupManager.prototype.isParentGroupExpanded = function(group) {
        if (!group.parentGroup) {
            // The root group is always expanded
            return true
        }

        return this.isGroupExpanded(group.parentGroup)
    }

    GroupManager.prototype.isGroupExpanded = function(group) {
        if (!group.parentGroup) {
            // The root group is always expanded
            return true
        }

        var groupIndex = this.getGroupIndex(group),
            statuses = this.readGroupStatuses()

        if (statuses[groupIndex] !== undefined)
            return statuses[groupIndex]

        return false
    }

    GroupManager.prototype.setGroupStatus = function(groupIndex, expanded) {
        var statuses = this.readGroupStatuses()

        statuses[groupIndex] = expanded

        this.writeGroupStatuses(statuses)
    }

    GroupManager.prototype.readGroupStatuses = function() {
        if (this.cachedGroupStatuses !== null) {
            return this.cachedGroupStatuses
        }

        var statuses = getInspectorGroupStatuses()

        if (statuses[this.controlId] !== undefined) {
            this.cachedGroupStatuses = statuses[this.controlId]
        }
        else {
            this.cachedGroupStatuses = {}
        }

        return this.cachedGroupStatuses
    }

    GroupManager.prototype.writeGroupStatuses = function(updatedStatuses) {
        var statuses = getInspectorGroupStatuses()

        statuses[this.controlId] = updatedStatuses
        setInspectorGroupStatuses(statuses)

        this.cachedGroupStatuses = updatedStatuses
    }

    GroupManager.prototype.findGroupByIndex = function(index) {
        return this.rootGroup.findGroupByIndex(index)
    }

    GroupManager.prototype.findGroupRows = function(table, index, ignoreCollapsedSubgroups) {
        var group = this.findGroupByIndex(index)

        if (!group) {
            throw new Error('Cannot find the requested row group.')
        }

        return group.findGroupRows(table, ignoreCollapsedSubgroups, this)
    }

    GroupManager.prototype.markGroupRowInvalid = function(group, table) {
        var currentGroup = group

        while (currentGroup) {
            var row = currentGroup.findGroupRow(table)
            if (row) {
                $.oc.foundation.element.addClass(row, 'invalid')
            }

            currentGroup = currentGroup.parentGroup
        }
    }

    GroupManager.prototype.unmarkInvalidGroups = function(table) {
        var rows = table.querySelectorAll('tr.invalid')

        for (var i = rows.length-1; i >= 0; i--) {
            $.oc.foundation.element.removeClass(rows[i], 'invalid')
        }
    }

    GroupManager.prototype.isRowVisible = function(table, rowGroupIndex) {
        var group = this.findGroupByIndex(index)

        if (!group) {
            throw new Error('Cannot find the requested row group.')
        }

        var current = group

        while (current) {
            if (!this.isGroupExpanded(current)) {
                return false
            }

            current = current.parentGroup
        }

        return true
    }

    //
    // Internal functions
    //

    function getInspectorGroupStatuses() {
        var statuses = document.body.getAttribute('data-inspector-group-statuses')

        if (statuses !== null) {
            return JSON.parse(statuses)
        }

        return {}
    }

    function setInspectorGroupStatuses(statuses) {
        document.body.setAttribute('data-inspector-group-statuses', JSON.stringify(statuses))
    }

    // GROUP CLASS
    // ============================

    var Group = function(groupId) {
        this.groupId = groupId
        this.parentGroup = null
        this.groupIndex = null

        this.groups = []
    }

    Group.prototype.getGroupIndex = function() {
        if (this.groupIndex !== null) {
            return this.groupIndex
        }

        var result = '',
            current = this

        while (current) {
            if (result.length > 0) {
                result = current.groupId + '-' + result
            }
            else {
                result = String(current.groupId)
            }

            current = current.parentGroup
        }

        this.groupIndex = result

        return result
    }

    Group.prototype.findGroupByIndex = function(index) {
        if (this.getGroupIndex() == index) {
            return this
        }

        for (var i = this.groups.length-1; i >= 0; i--) {
            var groupResult = this.groups[i].findGroupByIndex(index)
            if (groupResult !== null) {
                return groupResult
            }
        }

        return null
    }

    Group.prototype.getLevel = function() {
        var current = this,
            level = -1

        while (current) {
            level++

            current = current.parentGroup
        }

        return level
    }

    Group.prototype.getGroupAndAllParents = function() {
        var current = this,
            result = []

        while (current) {
            result.push(current)

            current = current.parentGroup
        }

        return result
    }

    Group.prototype.findGroupRows = function(table, ignoreCollapsedSubgroups, groupManager) {
        var groupIndex = this.getGroupIndex(),
            rows = table.querySelectorAll('tr[data-parent-group-index="'+groupIndex+'"]'),
            result = Array.prototype.slice.call(rows) // Convert node list to array

        for (var i = 0, len = this.groups.length; i < len; i++) {
            var subgroup = this.groups[i]

            if (ignoreCollapsedSubgroups && !groupManager.isGroupExpanded(subgroup)) {
                continue
            }

            var subgroupRows = subgroup.findGroupRows(table, ignoreCollapsedSubgroups, groupManager)
            for (var j = 0, subgroupLen = subgroupRows.length; j < subgroupLen; j++) {
                result.push(subgroupRows[j])
            }
        }

        return result
    }

    Group.prototype.findGroupRow = function(table) {
        return table.querySelector('tr[data-group-index="'+this.groupIndex+'"]')
    }

    $.oc.inspector.groupManager = GroupManager
}(window.jQuery);