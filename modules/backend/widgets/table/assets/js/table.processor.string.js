/*
 * String cell processor for the table control.
 * The string processor allows to edit cell values with a simple
 * input control.
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

    var StringProcessor = function(tableObj, columnName) {
        //
        // State properties
        //

        //
        // Parent constructor
        //

        Base.call(this, tableObj, columnName)
    }

    StringProcessor.prototype = Object.create(BaseProto)
    StringProcessor.prototype.constructor = StringProcessor

    /*
     * Renders the cell in the normal (no edit) mode
     */
    StringProcessor.prototype.renderCell = function(value, cellElement) {
        this.createViewContainer(cellElement, value)
    }

    /*
     * This method is called when the cell managed by the processor
     * is focused (clicked or navigated with the keyboard).
     */
    StringProcessor.prototype.onFocus = function(cellElement, isClick) {
        if (this.activeCell === cellElement)
            return

        this.activeCell = cellElement
        this.buildEditor(cellElement)
    }

    StringProcessor.prototype.buildEditor = function(cellElement) {
        // Hide the view container
        this.hideViewContainer(this.activeCell)

        // Create the input control 
        var input = document.createElement('input')
        input.setAttribute('type', 'text')
        input.setAttribute('class', 'string-input')
        input.value = this.tableObj.getCellValue(cellElement)
        cellElement.appendChild(input)

        // Focus the element in the next frame. 
        // http://stackoverflow.com/questions/779379/why-is-settimeoutfn-0-sometimes-useful
        window.setTimeout(function focusInput(){
            input.focus()
        }, 0)
    }

    /*
     * Forces the processor to hide the editor when the user navigates
     * away from the cell.
     */
    StringProcessor.prototype.onUnfocus = function() {
        if (!this.activeCell)
            return

        var editor = this.activeCell.querySelector('.string-input')
        if (editor) {
            // Update the cell value and remove the editor
            this.tableObj.setCellValue(this.activeCell, editor.value)
            this.setViewContainerValue(this.activeCell, editor.value)
            editor.parentNode.removeChild(editor)
        }

        this.showViewContainer(this.activeCell)
        this.activeCell = null
    }

    $.oc.table.processor.string = StringProcessor;
}(window.jQuery);