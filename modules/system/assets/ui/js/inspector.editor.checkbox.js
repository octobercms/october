/*
 * Inspector checkbox editor class.
 *
 * This editor is used in $.oc.inspector.propertyEditors.set class.
 * If updates that affect references to this.inspector and propertyDefinition are done,
 * the propertyEditors.set class implementation should be reviewed.
 */
+function ($) { "use strict";

    var Base = $.oc.inspector.propertyEditors.base,
        BaseProto = Base.prototype

    var CheckboxEditor = function(inspector, propertyDefinition, containerCell, group) {
        Base.call(this, inspector, propertyDefinition, containerCell, group)
    }

    CheckboxEditor.prototype = Object.create(BaseProto)
    CheckboxEditor.prototype.constructor = Base

    CheckboxEditor.prototype.dispose = function() {
        this.unregisterHandlers()

        BaseProto.dispose.call(this)
    }

    CheckboxEditor.prototype.build = function() {
        var editor = document.createElement('input'),
            container = document.createElement('div'),
            value = this.inspector.getPropertyValue(this.propertyDefinition.property),
            label = document.createElement('label'),
            isChecked = false,
            id = this.inspector.generateSequencedId()

        container.setAttribute('tabindex', 0)
        container.setAttribute('class', 'custom-checkbox nolabel')

        editor.setAttribute('type', 'checkbox')
        editor.setAttribute('value', '1')
        editor.setAttribute('placeholder', 'placeholder')
        editor.setAttribute('id', id)

        label.setAttribute('for', id)
        label.textContent = this.propertyDefinition.title

        container.appendChild(editor)
        container.appendChild(label)

        if (value === undefined) {
            if (this.propertyDefinition.default !== undefined) {
                isChecked = this.normalizeCheckedValue(this.propertyDefinition.default)
            }
        } 
        else {
            isChecked = this.normalizeCheckedValue(value)
        }
        
        editor.checked = isChecked

        this.containerCell.appendChild(container)
    }

    CheckboxEditor.prototype.normalizeCheckedValue = function(value) {
         if (value == '0' || value == 'false') {
             return false
         }

        return value
    }

    CheckboxEditor.prototype.getInput = function() {
        return this.containerCell.querySelector('input')
    }

    CheckboxEditor.prototype.focus = function() {
        this.getInput().parentNode.focus()
    }

    CheckboxEditor.prototype.updateDisplayedValue = function(value) {
        this.getInput().checked = this.normalizeCheckedValue(value)
    }

    CheckboxEditor.prototype.registerHandlers = function() {
        var input = this.getInput()

        input.addEventListener('change', this.proxy(this.onInputChange))
    }

    CheckboxEditor.prototype.unregisterHandlers = function() {
        var input = this.getInput()

        input.removeEventListener('change', this.proxy(this.onInputChange))
    }

    CheckboxEditor.prototype.onInputChange = function() {
        var isChecked = this.getInput().checked

        this.inspector.setPropertyValue(this.propertyDefinition.property, isChecked ? 1 : 0)
    }

    $.oc.inspector.propertyEditors.checkbox = CheckboxEditor
}(window.jQuery);