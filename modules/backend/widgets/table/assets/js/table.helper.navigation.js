/*
 * Navigation helper for the table widget.
 * Implements the keyboard navigation within the current page
 * and pagination.
 */
+function ($) { "use strict";

    // NAMESPACE CHECK
    // ============================

    if ($.oc.table === undefined)
        throw new Error("The $.oc.table namespace is not defined. Make sure that the table.js script is loaded.");

    if ($.oc.table.helper === undefined)
        $.oc.table.helper = {}

    // NAVIGATION CLASS DEFINITION
    // ============================

    var Navigation = function(tableObj) {
        // Reference to the table object
        this.tableObj = tableObj
    
        // Event handlers
        this.keydownHandler = this.onKeydown.bind(this)

        this.init()
    };

    Navigation.prototype.init = function() {
        this.registerHandlers()
    }

    Navigation.prototype.dispose = function() {
        // Unregister event handlers
        this.unregisterHandlers()

        // Remove the reference to the table object
        this.tableObj = null
    }

    Navigation.prototype.registerHandlers = function() {
        this.tableObj.el.addEventListener('keydown', this.keydownHandler)
    }

    Navigation.prototype.unregisterHandlers = function() {
        this.tableObj.el.removeEventListener('keydown', this.keydownHandler);
        this.keydownHandler = null
    }

    // KEYBOARD NAVIGATION
    // ============================

    Navigation.prototype.navigateDown = function(ev) {
        if (!this.tableObj.activeCell)
            return

        if (this.tableObj.activeCellProcessor && !this.tableObj.activeCellProcessor.keyNavigationAllowed(ev, 'down'))
            return

        var row = this.tableObj.activeCell.parentNode,
            newRow = !ev.shiftKey ? 
                row.nextElementSibling :
                row.parentNode.children[row.parentNode.children.length - 1]

        if (!newRow)
            return
        
        var cell = newRow.children[this.tableObj.activeCell.cellIndex]

        if (cell)
            this.tableObj.focusCell(cell)
    }

    Navigation.prototype.navigateUp = function(ev) {
        if (!this.tableObj.activeCell)
            return

        if (this.tableObj.activeCellProcessor && !this.tableObj.activeCellProcessor.keyNavigationAllowed(ev, 'up'))
            return

        var row = this.tableObj.activeCell.parentNode,
            newRow = !ev.shiftKey ? 
                row.previousElementSibling :
                row.parentNode.children[0]

        if (!newRow)
            return

        var cell = newRow.children[this.tableObj.activeCell.cellIndex]

        if (cell)
            this.tableObj.focusCell(cell)
    }

    Navigation.prototype.navigateLeft = function(ev) {
        if (!this.tableObj.activeCell)
            return

        if (this.tableObj.activeCellProcessor && !this.tableObj.activeCellProcessor.keyNavigationAllowed(ev, 'left'))
            return

        var row = this.tableObj.activeCell.parentNode,
            newIndex = !ev.shiftKey ? 
                this.tableObj.activeCell.cellIndex-1 :
                0

        var cell = row.children[newIndex]

        if (cell)
            this.tableObj.focusCell(cell)
    }

    Navigation.prototype.navigateRight = function(ev) {
        if (!this.tableObj.activeCell)
            return

        if (this.tableObj.activeCellProcessor && !this.tableObj.activeCellProcessor.keyNavigationAllowed(ev, 'right'))
            return

        var row = this.tableObj.activeCell.parentNode,
            newIndex = !ev.shiftKey ? 
                this.tableObj.activeCell.cellIndex+1 :
                row.children.length-1

        var cell = row.children[newIndex]

        if (cell)
            this.tableObj.focusCell(cell)
    }

    Navigation.prototype.navigateNext = function(ev) {
        if (!this.tableObj.activeCell)
            return

        if (this.tableObj.activeCellProcessor && !this.tableObj.activeCellProcessor.keyNavigationAllowed(ev, 'tab'))
            return

        var row = this.tableObj.activeCell.parentNode,
            cellCount = row.children.length,
            cellIndex = this.tableObj.activeCell.cellIndex

        if (!ev.shiftKey) {
            if (cellIndex < cellCount-1)
                this.tableObj.focusCell(row.children[cellIndex+1])
            else {
                if (row.nextElementSibling)
                    this.tableObj.focusCell(row.nextElementSibling.children[0])
            }
        } else {
            if (cellIndex > 0)
                this.tableObj.focusCell(row.children[cellIndex-1])
            else {
                if (row.previousElementSibling)
                    this.tableObj.focusCell(row.previousElementSibling.children[cellCount-1])
            }
        }

        this.tableObj.stopEvent(ev)
    }

    // EVENT HANDLERS
    // ============================

    Navigation.prototype.onKeydown = function(ev) {
        // Handle keyboard navigation events.

        if (ev.keyCode == 40)
            return this.navigateDown(ev)
        else if (ev.keyCode == 38)
            return this.navigateUp(ev)
        else if (ev.keyCode == 37)
            return this.navigateLeft(ev)
        if (ev.keyCode == 39)
            return this.navigateRight(ev)
        if (ev.keyCode == 9)
            return this.navigateNext(ev)
    }

    $.oc.table.helper.navigation = Navigation;
}(window.jQuery);