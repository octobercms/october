/*
 * Inspector required validator.
 */
+function ($) { "use strict";

    var Base = $.oc.inspector.validators.base,
        BaseProto = Base.prototype

    var RequiredValidator = function(options) {
        Base.call(this, options)

        this.defaultMessage = 'The property is required.'
    }

    RequiredValidator.prototype = Object.create(BaseProto)
    RequiredValidator.prototype.constructor = Base

    RequiredValidator.prototype.isValid = function(value) {
        if (value === undefined || value === null) {
            return this.getMessage()
        }

        if (typeof value === 'boolean') {
            return value ? null : this.getMessage()
        }

        if (typeof value === 'object') {
            return !$.isEmptyObject(value) ? null : this.getMessage()
        }

        return $.trim(String(value)).length > 0 ? null : this.getMessage()
    }

    $.oc.inspector.validators.required = RequiredValidator
}(window.jQuery);