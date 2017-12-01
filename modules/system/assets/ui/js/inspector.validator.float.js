/*
 * Inspector float validator.
 */
+function ($) { "use strict";

    var Base = $.oc.inspector.validators.baseNumber,
        BaseProto = Base.prototype

    var FloatValidator = function(options) {
        Base.call(this, options)
    }

    FloatValidator.prototype = Object.create(BaseProto)
    FloatValidator.prototype.constructor = Base

    FloatValidator.prototype.isValid = function(value) {
        if (!this.isScalar(value) || typeof value == 'boolean') {
            this.throwError('The Float Inspector validator can only be used with string values.')
        }

        if (value === undefined || value === null) {
            return null
        }

        var string = $.trim(String(value))

        if (string.length === 0) {
            return null
        }

        var testResult = this.options.allowNegative ? 
            /^[-]?([0-9]+\.[0-9]+|[0-9]+)$/.test(string) : 
            /^([0-9]+\.[0-9]+|[0-9]+)$/.test(string)

        if (!testResult) {
            var defaultMessage = this.options.allowNegative ?
                'The value should be a floating point number.' :
                'The value should be a positive floating point number.';

            return this.getMessage(defaultMessage)
        }

        return this.doCommonChecks(parseFloat(string))
    }

    $.oc.inspector.validators.float = FloatValidator
}(window.jQuery);