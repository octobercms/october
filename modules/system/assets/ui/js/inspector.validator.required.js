/*
 * Inspector required validator.
 */
+function ($) { "use strict";

    var Base = $.oc.inspector.validators.base,
        BaseProto = Base.prototype

    var RequiredValidator = function(options) {
        Base.call(this, options)
    }

    RequiredValidator.prototype = Object.create(BaseProto)
    RequiredValidator.prototype.constructor = Base

    RequiredValidator.prototype.isValid = function(value) {
        if (value === undefined || value === null) {
            return false
        }

        if (typeof value === 'boolean') {
            return value
        }

        if (typeof value === 'object') {
            return !$.isEmptyObject(value)
        }

        return $.trim(String(value)).length > 0
    }

    $.oc.inspector.validators.required = RequiredValidator
}(window.jQuery);