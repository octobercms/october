/*
 * Base class for the table cell processors.
 */
+function ($) { "use strict";

    // PROCESSOR NAMESPACES
    // ============================

    if ($.oc.table === undefined)
        throw new Error("The $.oc.table namespace is not defined. Make sure that the table.js script is loaded.");

    if ($.oc.table.processor === undefined)
        $.oc.table.processor = {}

    // CLASS DEFINITION
    // ============================

    var Base = function(tableObj, columnName) {
        //
        // State properties
        //

        this.tableObj = tableObj

        this.columnName = columnName

        this.activeCell = null

        // Register event handlers
        this.registerHandlers()
    }

    Base.prototype.dispose = function() {
        // Register event handlers
        this.unregisterHandlers()

        // Remove references to the DOM
        this.tableObj = null

        this.activeCell = null
    }

    /*
     * Renders the cell in the normal (no edit) mode
     */
    Base.prototype.renderCell = function(value, cellElement) {
    }

    /*
     * Registers event handlers required for the cell processor.
     * Event handers should be bound to the container control element 
     * (not to the table element).
     */
    Base.prototype.registerHandlers = function() {
    }

    /*
     * Unregisters event handlers previously registered with 
     * registerHandlers().
     */
    Base.prototype.unregisterHandlers = function() {
    }

    /*
     * This method is called when the cell managed by the processor
     * is focused (clicked or navigated with the keyboard).
     */
    Base.prototype.onFocus = function(cellElement, isClick) {
    }


    /*
     * Forces the processor to hide the editor when the user navigates
     * away from the cell. Processors can update the sell value in this method.
     */
    Base.prototype.onUnfocus = function() {
    }

    /*
     * Creates a cell view data container (a DIV element that contains 
     * the current cell value). This functionality is required for most
     * of the processors, perhaps except the checkbox cell processor.
     */
    Base.prototype.createViewContainer = function(cellElement, value) {
        var viewContainer = document.createElement('div')

        viewContainer.setAttribute('data-view-container', 'data-view-container')
        viewContainer.textContent = value

        cellElement.appendChild(viewContainer)
    }

    /*
     * Returns the cell's view container element.
     */
    Base.prototype.getViewContainer = function(cellElement) {
        return cellElement.querySelector('[data-view-container]')
    }

    /*
     * Displays the view container
     */
    Base.prototype.showViewContainer = function(cellElement) {
        return this.getViewContainer(cellElement).setAttribute('class', '')
    }

    /*
     * Hides the view container
     */
    Base.prototype.hideViewContainer = function(cellElement) {
        return this.getViewContainer(cellElement).setAttribute('class', 'hide')
    }

    /*
     * Sets visual value for the view container
     */
    Base.prototype.setViewContainerValue = function(cellElement, value) {
        return this.getViewContainer(cellElement).textContent = value
    }

    $.oc.table.processor.base = Base
}(window.jQuery);