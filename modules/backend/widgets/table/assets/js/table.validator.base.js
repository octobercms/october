/*
 * Base class for the table validators.
 */
+function ($) { "use strict";

    // VALIDATOR NAMESPACES
    // ============================

    if ($.oc.table === undefined)
        throw new Error("The $.oc.table namespace is not defined. Make sure that the table.js script is loaded.");

    if ($.oc.table.validator === undefined)
        $.oc.table.validator = {}

    // CLASS DEFINITION
    // ============================

    var Base = function(options) {
        //
        // State properties
        //

        this.options = options
    }

    /*
     * Validates a value and returns the error message. If there
     * are no errors, returns undefined.
     * The rowData parameter is an object containing all values in the
     * target row.
     */
    Base.prototype.validate = function(value, rowData) {
        if (this.options.requiredWith !== undefined && !this.rowHasValue(this.options.requiredWith, rowData))
            return

        return this.validateValue(value, rowData)
    }

    /*
     * Validates a value and returns the error message. If there
     * are no errors, returns undefined. This method should be redefined
     * in descendant classes.
     * The rowData parameter is an object containing all values in the
     * target row.
     */
    Base.prototype.validateValue = function(value, rowData) {
        
    }

    Base.prototype.trim = function(value) {
        if (String.prototype.trim)
            return value.trim()

        return value.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '')
    }

    Base.prototype.getMessage = function(defaultValue) {
        if (this.options.message !== undefined)
            return this.options.message

        return defaultValue
    }

    Base.prototype.rowHasValue = function(columnName, rowData) {
        if (rowData[columnName] === undefined)
            return false

        if (typeof rowData[columnName] == 'boolean')
            return rowData[columnName]

        var value = this.trim(String(rowData[columnName]))

        return value.length > 0
    }

    $.oc.table.validator.base = Base;
}(window.jQuery);