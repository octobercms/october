/*
 * Float table validator.
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

    var Float = function(options) {
        Base.call(this, options)
    };

    Float.prototype = Object.create(BaseProto)
    Float.prototype.constructor = Float

    /*
     * Validates a value and returns the error message. If there
     * are no errors, returns undefined.
     * The rowData parameter is an object containing all values in the
     * target row.
     */
    Float.prototype.validateValue = function(value, rowData) {
        value = this.trim(value)

        if (value.length == 0)
            return

        var testResult = this.options.allowNegative ? 
            /^[-]?([0-9]+\.[0-9]+|[0-9]+)$/.test(value) : 
            /^([0-9]+\.[0-9]+|[0-9]+)$/.test(value)

        if (!testResult) {
            var defaultMessage = this.options.allowNegative ?
                'The value should be a floating point number.' :
                'The value should be a positive floating point number';

            return this.getMessage(defaultMessage)
        }

        return this.doCommonChecks(parseFloat(value))
    }

    $.oc.table.validator.float = Float
}(window.jQuery);