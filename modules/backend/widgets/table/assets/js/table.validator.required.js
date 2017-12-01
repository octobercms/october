/*
 * Required table validator.
 */
+function ($) { "use strict";

    // NAMESPACE CHECK
    // ============================

    if ($.oc.table === undefined)
        throw new Error("The $.oc.table namespace is not defined. Make sure that the table.js script is loaded.");

    if ($.oc.table.validator === undefined)
        throw new Error("The $.oc.table.validator namespace is not defined. Make sure that the table.validator.base.js script is loaded.");

    // CLASS DEFINITION
    // ============================

    var Base = $.oc.table.validator.base,
        BaseProto = Base.prototype

    var Required = function(options) {
        Base.call(this, options)
    };

    Required.prototype = Object.create(BaseProto)
    Required.prototype.constructor = Required

    /*
     * Validates a value and returns the error message. If there
     * are no errors, returns undefined.
     * The rowData parameter is an object containing all values in the
     * target row.
     */
    Required.prototype.validateValue = function(value, rowData) {
        value = this.trim(value)

        if (value.length === 0)
            return this.getMessage("The value should not be empty.")

        return
    }

    $.oc.table.validator.required = Required
}(window.jQuery);