/*
 * Drop-down cell processor for the table control.
 */
+function ($) { "use strict";

    // NAMESPACE CHECK
    // ============================

    if ($.oc.table === undefined)
        throw new Error("The $.oc.table namespace is not defined. Make sure that the table.js script is loaded.");

    if ($.oc.table.processor === undefined)
        throw new Error("The $.oc.table.processor namespace is not defined. Make sure that the table.processor.base.js script is loaded.");

    // CLASS DEFINITION
    // ============================

    var Base = $.oc.table.processor.base,
        BaseProto = Base.prototype

    var DropdownProcessor = function(tableObj, columnName, columnConfiguration) {
        //
        // Parent constructor
        //

        Base.call(this, tableObj, columnName, columnConfiguration)
    }

    DropdownProcessor.prototype = Object.create(BaseProto)
    DropdownProcessor.prototype.constructor = DropdownProcessor

    DropdownProcessor.prototype.dispose = function() {
        BaseProto.dispose.call(this)
    }

    /*
     * Determines if the processor's cell is focusable.
     */
    DropdownProcessor.prototype.isCellFocusable = function() {
        return false
    }

    /*
     * Renders the cell in the normal (no edit) mode
     */
    DropdownProcessor.prototype.renderCell = function(value, cellContentContainer) {
        var self = this

        this.fetchOptions(function renderCellFetchOptions(options) {
            if ( options[value] !== undefined )
                value = options[value]

            self.createViewContainer(cellContentContainer, value)
            self = null
        })
    }

    /*
     * This method is called when the cell managed by the processor
     * is focused (clicked or navigated with the keyboard).
     */
    DropdownProcessor.prototype.onFocus = function(cellElement, isClick) {
        if (this.activeCell === cellElement)
            return

        this.activeCell = cellElement
        this.buildEditor(cellElement, this.getCellContentContainer(cellElement))
    }

    /*
     * Forces the processor to hide the editor when the user navigates
     * away from the cell. Processors can update the sell value in this method.
     * Processors must clear the reference to the active cell in this method.
     */
    DropdownProcessor.prototype.onUnfocus = function() {
        if (!this.activeCell)
            return

        var select = this.activeCell.querySelector('select')
        if (select) {
            // Update the cell value and remove the select element
            $(select).select2('destroy')

            var value = select.options[select.selectedIndex].value,
                text = select.options[select.selectedIndex].text

            this.tableObj.setCellValue(this.activeCell, value)
            this.setViewContainerValue(this.activeCell, text)

            select.parentNode.removeChild(select)
        }

        this.showViewContainer(this.activeCell)
        this.activeCell = null
    }


    DropdownProcessor.prototype.buildEditor = function(cellElement, cellContentContainer) {
        this.hideViewContainer(this.activeCell)

        // Create the select control 
        var select = document.createElement('select'),
            currentValue = this.tableObj.getCellValue(cellElement)

        this.fetchOptions(function renderCellFetchOptions(options) {
            for (var value  in options) {
                var option = document.createElement('option')
                option.value = value
                option.text = options[value]

                if (value == currentValue)
                    option.selected = true

                select.appendChild(option)
            }

            cellContentContainer.appendChild(select)
            $(select).select2()
            cellContentContainer = null
            select = null
        })
    }

    DropdownProcessor.prototype.fetchOptions = function(onSuccess) {
        // TODO: implement caching and AJAX support,
        // loading indicator is required here for AJAX-based options.
        //
        if ( this.columnConfiguration.options )
            onSuccess(this.columnConfiguration.options)
    }

    $.oc.table.processor.dropdown = DropdownProcessor;
}(window.jQuery);