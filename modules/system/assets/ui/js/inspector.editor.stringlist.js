/*
 * Inspector string list editor class.
 */
+function ($) { "use strict";

    var Base = $.oc.inspector.propertyEditors.text,
        BaseProto = Base.prototype

    var StringListEditor = function(inspector, propertyDefinition, containerCell, group) {
        Base.call(this, inspector, propertyDefinition, containerCell, group)
    }

    StringListEditor.prototype = Object.create(BaseProto)
    StringListEditor.prototype.constructor = Base

    StringListEditor.prototype.setLinkText = function(link, value) {
        var value = value !== undefined ? value 
                : this.inspector.getPropertyValue(this.propertyDefinition.property)

        if (value === undefined) {
            value = this.propertyDefinition.default
        }

        this.checkValueType(value)

        if (!value) {
            value = this.propertyDefinition.placeholder
            $.oc.foundation.element.addClass(link, 'placeholder')

            if (!value) {
                value = '[]'
            }

            link.textContent = value
        } 
        else {
            $.oc.foundation.element.removeClass(link, 'placeholder')
    
            link.textContent = '[' + value.join(', ') + ']'
        }
    }

    StringListEditor.prototype.checkValueType = function(value) {
        if (value && Object.prototype.toString.call(value) !== '[object Array]') {
            this.throwError('The string list value should be an array.')
        }
    }

    StringListEditor.prototype.configurePopup = function(popup) {
        var $textarea = $(popup).find('textarea'),
            value = this.inspector.getPropertyValue(this.propertyDefinition.property)

        if (this.propertyDefinition.placeholder) {
            $textarea.attr('placeholder', this.propertyDefinition.placeholder)
        }

        if (value === undefined) {
            value = this.propertyDefinition.default
        }

        this.checkValueType(value)

        if (value && value.length) {
            $textarea.val(value.join('\n'))
        }

        $textarea.focus()
    }

    StringListEditor.prototype.handleSubmit = function($form) {
        var $textarea = $form.find('textarea'),
            link = this.getLink(),
            value = $.trim($textarea.val()),
            arrayValue = [],
            resultValue = []

        if (value.length) {
            value = value.replace(/\r\n/g, '\n')
            arrayValue = value.split('\n')

            for (var i = 0, len = arrayValue.length; i < len; i++) {
                var currentValue = $.trim(arrayValue[i])
                
                if (currentValue.length > 0) {
                    resultValue.push(currentValue)
                }
            }
        }

        this.inspector.setPropertyValue(this.propertyDefinition.property, resultValue)
// TODO: validate here
    }

    $.oc.inspector.propertyEditors.stringList = StringListEditor
}(window.jQuery);