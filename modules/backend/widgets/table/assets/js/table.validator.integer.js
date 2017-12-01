/*
 * Integer table validator.
 */
+function ($) { "use strict";

    // NAMESPACE CHECK
    // ============================

    if ($.oc.table === undefined)
        throw new Error("The $.oc.table namespace is not defined. Make sure that the table.js script is loaded.");

    if ($.oc.table.validator === undefined)
        throw new Error("The $.oc.table.validator namespace is not defined. Make sure that the table.validator.base.js script is loaded.");

    if ($.oc.table.validator.baseNumber === undefined)
        throw new Error("The $.oc.table.validator.baseNumber namespace is not defined. Make sure that the table.validator.baseNumber.js script is loaded.");

    // CLASS DEFINITION
    // ============================

    var Base = $.oc.table.validator.baseNumber,
        BaseProto = Base.prototype

    var Integer = function(options) {
        Base.call(this, options)
    };

    Integer.prototype = Object.create(BaseProto)
    Integer.prototype.constructor = Integer

    /*
     * Validates a value and returns the error message. If there
     * are no errors, returns undefined.
     * The rowData parameter is an object containing all values in the
     * target row.
     */
    Integer.prototype.validateValue = function(value, rowData) {
        value = this.trim(value)

        if (value.length == 0)
            return

        var testResult = this.options.allowNegative ? 
            /^\-?[0-9]*$/.test(value) : 
            /^[0-9]*$/.test(value)

        if (!testResult) {
            var defaultMessage = this.options.allowNegative ?
                'The value should be an integer.' :
                'The value should be a positive integer';

            return this.getMessage(defaultMessage)
        }

        return this.doCommonChecks(parseInt(value))
    }

    $.oc.table.validator.integer = Integer
}(window.jQuery);