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

    var Base = function(tableObj, columnName, columnConfiguration) {
        //
        // State properties
        //

        this.tableObj = tableObj

        this.columnName = columnName

        this.columnConfiguration = columnConfiguration

        this.activeCell = null

        this.validators = []

        // Register event handlers
        this.registerHandlers()

        // Initialize validators
        this.initValidators()
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
     * Event handler for the keydown event. The table class calls this method
     * for all processors.
     */
    Base.prototype.onKeyDown = function(ev) {
    }

    /*
     * Event handler for the click event. The table class calls this method
     * for all processors.
     */
    Base.prototype.onClick = function(ev) {
    }

    /*
     * This method is called when a cell value in the row changes.
     */
    Base.prototype.onRowValueChanged = function(columnName, cellElement) {
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
     * Determines if the processor's cell is focusable.
     */
    Base.prototype.isCellFocusable = function() {
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

        return viewContainer
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

    /*
     * Determines whether the specified element is some element created by the 
     * processor. 
     */
    Base.prototype.elementBelongsToProcessor = function(element) {
        return false
    }

    Base.prototype.initValidators = function() {
        if (this.columnConfiguration.validation === undefined)
            return

        for (var validatorName in this.columnConfiguration.validation) {
            if ($.oc.table.validator === undefined || $.oc.table.validator[validatorName] == undefined)
                throw new Error('The table cell validator "'+validatorName+'" for the column "'+this.columnName+'" is not ' +
                    'found in the $.oc.table.validator namespace.')

            var validator = new $.oc.table.validator[validatorName](
                    this.columnConfiguration.validation[validatorName]
                )

            this.validators.push(validator)
        }
    }

    Base.prototype.validate = function(value, rowData) {
        for (var i=0, len=this.validators.length; i<len; i++) {
            var message = this.validators[i].validate(value, rowData)

            if (message !== undefined)
                return message
        }
    }

    $.oc.table.processor.base = Base
}(window.jQuery);