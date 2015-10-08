/*
 * Inspector validator base class.
 */
+function ($) { "use strict";

    // NAMESPACES
    // ============================

      if ($.oc.inspector.validators === undefined)
        $.oc.inspector.validators = {}

    // CLASS DEFINITION
    // ============================

    var Base = $.oc.foundation.base,
        BaseProto = Base.prototype

    var BaseValidator = function(options) {
        this.options = options
        this.defaultMessage = 'Invalid property value'
    }

    BaseValidator.prototype = Object.create(BaseProto)
    BaseValidator.prototype.constructor = Base

    BaseValidator.prototype.dispose = function() {
        this.defaultMessage = null

        BaseProto.dispose.call(this)
    }

    BaseValidator.prototype.getMessage = function() {
        if (this.options.message !== undefined)
            return this.options.message

        return this.defaultMessage
    }

    BaseValidator.prototype.isScalar = function(value) {
        if (value === undefined || value === null) {
            return true
        }

        if (typeof value === 'string' || typeof value == 'number' || typeof value == 'boolean') {
            return true
        }

        return false
    }

    BaseValidator.prototype.isValid = function(value) {
        return true
    }

    $.oc.inspector.validators.base = BaseValidator
}(window.jQuery);