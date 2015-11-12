/*
 * Inspector length validator.
 */
+function ($) { "use strict";

    var Base = $.oc.inspector.validators.base,
        BaseProto = Base.prototype

    var LengthValidator = function(options) {
        Base.call(this, options)
    }

    LengthValidator.prototype = Object.create(BaseProto)
    LengthValidator.prototype.constructor = Base

    LengthValidator.prototype.isValid = function(value) {
        if (value === undefined || value === null) {
            return null
        }

        if (typeof value == 'boolean') {
            this.throwError('The Length Inspector validator cannot work with Boolean values.')

        }

        var length = null

        if(Object.prototype.toString.call(value) === '[object Array]' || typeof value === 'string') {
            length = value.length
        }
        else if (typeof value === 'object') {
            length = this.getObjectLength(value)
        }

        if (this.options.min !== undefined || this.options.max !== undefined) {
            if (this.options.min !== undefined) {
                if (this.options.min.value === undefined) {
                    throw new Error('The min.value parameter is not defined in the Length Inspector validator configuration.')
                }

                if (length < this.options.min.value) {
                    return this.options.min.message !== undefined ?
                        this.options.min.message :
                        "The value should not be shorter than " + this.options.min.value
                }
            }

            if (this.options.max !== undefined) {
                if (this.options.max.value === undefined)
                    throw new Error('The max.value parameter is not defined in the Length Inspector validator configuration.')

                if (length > this.options.max.value) {
                    return this.options.max.message !== undefined ?
                        this.options.max.message :
                        "The value should not be longer than " + this.options.max.value
                }
            }
        }
    }

    LengthValidator.prototype.getObjectLength = function(value) {
        var result = 0

        for (var key in value) {
            result++
        }

        return result
    }

    $.oc.inspector.validators.length = LengthValidator
}(window.jQuery);