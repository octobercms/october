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
    Base.prototype.renderCell = function(value, cellContentContainer) {
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
     * Processors must clear the reference to the active cell in this method.
     */
    Base.prototype.onUnfocus = function() {
    }

    /*
     * Determines if the keyboard navigation in the specified direction is allowed
     * by the cell processor. Some processors could reject the navigation, for example
     * the string processor could cancel the left array navigation if the caret 
     * in the text input is not in the beginning of the text.
     */
    Base.prototype.keyNavigationAllowed = function(ev, direction) {
        return true
    }

    /*
     * Returns the content container element of a cell
     */
    Base.prototype.getCellContentContainer = function(cellElement) {
        return cellElement.querySelector('.content-container')
    }

    /*
     * Creates a cell view data container (a DIV element that contains 
     * the current cell value). This functionality is required for most
     * of the processors, perhaps except the checkbox cell processor.
     */
    Base.prototype.createViewContainer = function(cellContentContainer, value) {
        var viewContainer = document.createElement('div')

        viewContainer.setAttribute('data-view-container', 'data-view-container')
        viewContainer.textContent = value

        cellContentContainer.appendChild(viewContainer)
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