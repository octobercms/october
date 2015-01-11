/*
 * Regex length table validator.
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

    var Regex = function(options) {
        Base.call(this, options)
    };

    Regex.prototype = Object.create(BaseProto)
    Regex.prototype.constructor = Regex

    /*
     * Validates a value and returns the error message. If there
     * are no errors, returns undefined.
     * The rowData parameter is an object containing all values in the
     * target row.
     */
    Regex.prototype.validateValue = function(value, rowData) {
        value = this.trim(value)

        if (value.length == 0)
            return

        if (this.options.pattern === undefined)
            throw new Error('The pattern parameter is not defined in the Regex table validator configuration')

        var regexObj = new RegExp(this.options.pattern, this.options.modifiers)

        if (!regexObj.test(value))
            return this.getMessage("Invalid value format.")

        return
    }

    $.oc.table.validator.regex = Regex
}(window.jQuery);