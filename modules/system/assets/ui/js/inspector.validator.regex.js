/*
 * Inspector regex validator.
 */
+function ($) { "use strict";

    var Base = $.oc.inspector.validators.base,
        BaseProto = Base.prototype

    var RegexValidator = function(options) {
        Base.call(this, options)
    }

    RegexValidator.prototype = Object.create(BaseProto)
    RegexValidator.prototype.constructor = Base

    RegexValidator.prototype.isValid = function(value) {
        if (this.options.pattern === undefined) {
            this.throwError('The pattern parameter is not defined in the Regex Inspector validator configuration.')
        }

        if (!this.isScalar(value)) {
            this.throwError('The Regex Inspector validator can only be used with string values.')
        }

        if (value === undefined || value === null) {
            return null
        }

        var string = $.trim(String(value))

        if (string.length === 0) {
            return null
        }

        var regexObj = new RegExp(this.options.pattern, this.options.modifiers)

        return regexObj.test(string) ? null : this.getMessage()
    }

    $.oc.inspector.validators.regex = RegexValidator
}(window.jQuery);