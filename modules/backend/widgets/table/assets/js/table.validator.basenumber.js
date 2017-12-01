/*
 * Base class for number validators.
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

    var BaseNumber = function(options) {
        Base.call(this, options)
    };

    BaseNumber.prototype = Object.create(BaseProto)
    BaseNumber.prototype.constructor = BaseNumber

    BaseNumber.prototype.doCommonChecks = function(value) {
        if (this.options.min !== undefined || this.options.max !== undefined) {
            if (this.options.min !== undefined) {
                if (this.options.min.value === undefined)
                    throw new Error('The min.value parameter is not defined in the table validator configuration')

                if (value < this.options.min.value) {
                    return this.options.min.message !== undefined ?
                        this.options.min.message :
                        "The value should not be less than " + this.options.min.value
                }
            }

            if (this.options.max !== undefined) {
                if (this.options.max.value === undefined)
                    throw new Error('The max.value parameter is not defined in the table validator configuration')

                if (value > this.options.max.value) {
                    return this.options.max.message !== undefined ?
                        this.options.max.message :
                        "The value should not be more than " + this.options.max.value
                }
            }
        }

        return
    }

    $.oc.table.validator.baseNumber = BaseNumber
}(window.jQuery);