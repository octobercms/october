/*
 * Checkbox cell processor for the table control.
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

    var CheckboxProcessor = function(tableObj, columnName, columnConfiguration) {
        //
        // Parent constructor
        //

        Base.call(this, tableObj, columnName, columnConfiguration)
    }

    CheckboxProcessor.prototype = Object.create(BaseProto)
    CheckboxProcessor.prototype.constructor = CheckboxProcessor

    CheckboxProcessor.prototype.dispose = function() {
        BaseProto.dispose.call(this)
    }

    /*
     * Determines if the processor's cell is focusable.
     */
    CheckboxProcessor.prototype.isCellFocusable = function() {
        return false
    }

    /*
     * Renders the cell in the normal (no edit) mode
     */
    CheckboxProcessor.prototype.renderCell = function(value, cellContentContainer) {
        var checkbox = document.createElement('div')
        checkbox.setAttribute('data-checkbox-element', 'true')
        checkbox.setAttribute('tabindex', '0')

        if (value && value != 0 && value != "false")
            checkbox.setAttribute('class', 'checked')

        cellContentContainer.appendChild(checkbox)
    }

    /*
     * This method is called when the cell managed by the processor
     * is focused (clicked or navigated with the keyboard).
     */
    CheckboxProcessor.prototype.onFocus = function(cellElement, isClick) {
        cellElement.querySelector('div[data-checkbox-element]').focus()
    }

    /*
     * Event handler for the keydown event. The table class calls this method
     * for all processors.
     */
    CheckboxProcessor.prototype.onKeyDown = function(ev) {
        if (ev.keyCode == 32)
            this.onClick(ev)
    }

    /*
     * Event handler for the click event. The table class calls this method
     * for all processors.
     */
    CheckboxProcessor.prototype.onClick = function(ev) {
        var target = this.tableObj.getEventTarget(ev, 'DIV')

        if (target.getAttribute('data-checkbox-element')) {
            this.changeState(target)
        }
    }

    CheckboxProcessor.prototype.changeState = function(divElement) {
        var cell = divElement.parentNode.parentNode

        if (divElement.getAttribute('class') == 'checked') {
            divElement.setAttribute('class', '')
            this.tableObj.setCellValue(cell, 0)
        } else {
            divElement.setAttribute('class', 'checked')
            this.tableObj.setCellValue(cell, 1)
        }
    }

    $.oc.table.processor.checkbox = CheckboxProcessor;
}(window.jQuery);