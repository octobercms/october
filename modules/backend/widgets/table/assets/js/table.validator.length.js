/*
 * String length table validator.
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

    var Length = function(options) {
        Base.call(this, options)
    };

    Length.prototype = Object.create(BaseProto)
    Length.prototype.constructor = Length

    /*
     * Validates a value and returns the error message. If there
     * are no errors, returns undefined.
     * The rowData parameter is an object containing all values in the
     * target row.
     */
    Length.prototype.validateValue = function(value, rowData) {
        value = this.trim(value)

        if (value.length == 0)
            return

        if (this.options.min !== undefined || this.options.max !== undefined) {
            if (this.options.min !== undefined) {
                if (this.options.min.value === undefined)
                    throw new Error('The min.value parameter is not defined in the Length table validator configuration')

                if (value.length < this.options.min.value) {
                    return this.options.min.message !== undefined ?
                        this.options.min.message :
                        "The string should not be shorter than " + this.options.min.value
                }
            }

            if (this.options.max !== undefined) {
                if (this.options.max.value === undefined)
                    throw new Error('The max.value parameter is not defined in the Length table validator configuration')

                if (value.length > this.options.max.value) {
                    return this.options.max.message !== undefined ?
                        this.options.max.message :
                        "The string should not be longer than " + this.options.max.value
                }
            }
        }

        return
    }

    $.oc.table.validator.length = Length
}(window.jQuery);