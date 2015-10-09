/*
 * Inspector validation set class.
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

    var ValidationSet = function(options, propertyName) {
        this.validators = []

        this.options = options
        this.propertyName = propertyName
        Base.call(this)

        this.createValidators()
    }

    ValidationSet.prototype = Object.create(BaseProto)
    ValidationSet.prototype.constructor = Base

    ValidationSet.prototype.dispose = function() {
        this.disposeValidators()
        this.validators = null

        BaseProto.dispose.call(this)
    }

    ValidationSet.prototype.disposeValidators = function() {
        for (var i = 0, len = this.validators.length; i < len; i++) {
            this.validators[i].dispose()
        }
    }

    ValidationSet.prototype.throwError = function(errorMessage) {
        throw new Error(errorMessage + ' Property: ' + this.propertyName)
    }

    ValidationSet.prototype.createValidators = function() {
        // Handle legacy validation syntax properties:
        //
        // - required
        // - validationPattern
        // - validationMessage 

        if ((this.options.required !== undefined ||
            this.options.validationPattern !== undefined ||
            this.options.validationMessage !== undefined) && 
            this.options.validation !== undefined) {
            this.throwError('Legacy and new validation syntax should not be mixed.')
        }

        if (this.options.required !== undefined) {
            var validator = new $.oc.inspector.validators.required({
                message: this.options.validationMessage
            })

            this.validators.push(validator)
        }

        if (this.options.validationPattern !== undefined) {
            var validator = new $.oc.inspector.validators.regex({
                message: this.options.validationMessage,
                pattern: this.options.validationPattern
            })

            this.validators.push(validator)
        }

        //
        // Handle new validation syntax
        //

        if (this.options.validation === undefined) {
            return
        }

        for (var validatorName in this.options.validation) {
            if ($.oc.inspector.validators[validatorName] == undefined) {
                this.throwError('Inspector validator "' + validatorName + '" is not found in the $.oc.inspector.validators namespace.')
            }

            var validator = new $.oc.inspector.validators[validatorName](
                    this.options.validation[validatorName]
                )

            this.validators.push(validator)
        }
    }

    ValidationSet.prototype.validate = function(value) {
        try {
            for (var i = 0, len = this.validators.length; i < len; i++) {
                var validator = this.validators[i],
                    errorMessage = validator.isValid(value)

                if (typeof errorMessage === 'string') {
                    return errorMessage
                }
            }

            return null
        }
        catch (err) {
            this.throwError(err)
        }
    }

    $.oc.inspector.validationSet = ValidationSet
}(window.jQuery);