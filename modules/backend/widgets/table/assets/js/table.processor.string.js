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

    var StringProcessor = function(tableObj, columnName, columnConfiguration) {
        //
        // State properties
        //

        this.focusTimeoutHandler = this.onFocusTimeout.bind(this)

        //
        // Parent constructor
        //

        Base.call(this, tableObj, columnName, columnConfiguration)
    }

    StringProcessor.prototype = Object.create(BaseProto)
    StringProcessor.prototype.constructor = StringProcessor

    StringProcessor.prototype.dispose = function() {
        BaseProto.dispose.call(this)
        this.focusTimeoutHandler = null
    }

    /*
     * Renders the cell in the normal (no edit) mode
     */
    StringProcessor.prototype.renderCell = function(value, cellContentContainer) {
        this.createViewContainer(cellContentContainer, value)
    }

    /*
     * This method is called when the cell managed by the processor
     * is focused (clicked or navigated with the keyboard).
     */
    StringProcessor.prototype.onFocus = function(cellElement, isClick) {
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
    
    StringProcessor.prototype.buildEditor = function(cellElement, cellContentContainer) {
        // Hide the view container
        this.hideViewContainer(this.activeCell)

        // Create the input control 
        var input = document.createElement('input')
        input.setAttribute('type', 'text')
        input.setAttribute('class', 'string-input')
        input.value = this.tableObj.getCellValue(cellElement)

        if (this.columnConfiguration.readOnly) {
            input.setAttribute('readonly', true)
        }

        cellContentContainer.appendChild(input)

        this.setCaretPosition(input, 0)

        // Focus the element in the next frame.
        // http://stackoverflow.com/questions/779379/why-is-settimeoutfn-0-sometimes-useful
        window.setTimeout(this.focusTimeoutHandler, 0)
    }

    /*
     * Determines if the keyboard navigation in the specified direction is allowed
     * by the cell processor. Some processors could reject the navigation, for example
     * the string processor could cancel the left array navigation if the caret 
     * in the text input is not in the beginning of the text.
     */
    StringProcessor.prototype.keyNavigationAllowed = function(ev, direction) {
        if (direction != 'left' && direction != 'right')
            return true

        if (!this.activeCell)
            return true

        var editor = this.activeCell.querySelector('.string-input')
        if (!editor)
            return true

        var caretPosition = this.getCaretPosition(editor)

        if (direction == 'left')
            return caretPosition == 0

        if (direction == 'right')
            return caretPosition == editor.value.length

        return true
    }

    /*
     * This method is called when a cell value in the row changes.
     */
    StringProcessor.prototype.onRowValueChanged = function(columnName, cellElement) {
        if (columnName != this.columnName) {
            return
        }

        var value = this.tableObj.getCellValue(cellElement)

        this.setViewContainerValue(cellElement, value)
    }

    StringProcessor.prototype.onFocusTimeout = function() {
        if (!this.activeCell)
            return

        var editor = this.activeCell.querySelector('.string-input')
        if (!editor)
            return

        editor.focus()
        this.setCaretPosition(editor, 0)
    }

    StringProcessor.prototype.getCaretPosition = function(input) {
        // TODO: use the foundation library

        if (document.selection) { 
           var selection = document.selection.createRange()

           selection.moveStart('character', -input.value.length)
           return selection.text.length
        }

        if (input.selectionStart !== undefined)
           return input.selectionStart

        return 0
    }

    StringProcessor.prototype.setCaretPosition = function(input, position) {
        // TODO: use the foundation library

        if (document.selection) { 
            var range = input.createTextRange()

            setTimeout(function() {
                // Asynchronous layout update, better performance
                range.collapse(true)
                range.moveStart("character", position)
                range.moveEnd("character", 0)
                range.select()
            }, 0)
        }

        if (input.selectionStart !== undefined) {
            setTimeout(function() {
                // Asynchronous layout update
                input.selectionStart = position
                input.selectionEnd = position
            }, 0)
       }

        return 0
    }

    $.oc.table.processor.string = StringProcessor;
}(window.jQuery);