/*
 * Inspector set editor class.
 *
 * This class uses $.oc.inspector.propertyEditors.checkbox editor.
 */
+function ($) { "use strict";

    var Base = $.oc.inspector.propertyEditors.base,
        BaseProto = Base.prototype

    var SetEditor = function(inspector, propertyDefinition, containerCell) {
        this.editors = []

        Base.call(this, inspector, propertyDefinition, containerCell)
    }

    SetEditor.prototype = Object.create(BaseProto)
    SetEditor.prototype.constructor = Base

    SetEditor.prototype.dispose = function() {
        this.disposeEditors()

        this.editors = null

        BaseProto.dispose.call(this)
    }

    //
    // Building
    //

    SetEditor.prototype.build = function() {
        if (!this.propertyDefinition.items) {
            throw new Error('The items are not defined for the set-typed property "' + this.propertyDefinition.property + '"')
        }

        var link = document.createElement('a')

        $.oc.foundation.element.addClass(link, 'trigger')
        link.setAttribute('href', '#')
        link.setAttribute('data-group-index', this.getGroupIndex())
        this.setLinkText(link)

        $.oc.foundation.element.addClass(this.containerCell, 'set')

        this.containerCell.appendChild(link)

        for (var itemValue in this.propertyDefinition.items) {
            this.buildItemEditor(itemValue, this.propertyDefinition.items[itemValue])
        }
    }

    SetEditor.prototype.setLinkText = function(link, value) {
        var value = value !== undefined ? value 
                : this.inspector.getPropertyValue(this.propertyDefinition.property),
            text = '[]'

        if (value === undefined) {
            value = this.propertyDefinition.default
        }

        if (value !== undefined && value.length !== undefined && value.length > 0) {
            var textValues = []
            for (var i = 0, len = value.length; i < len; i++) {
                textValues.push(this.valueToText(value[i]))
            }

            text = '[' + textValues.join(', ') + ']'
            $.oc.foundation.element.removeClass(link, 'placeholder')
        } else {
            text = this.propertyDefinition.placeholder
            $.oc.foundation.element.addClass(link, 'placeholder')
        }

        link.textContent = text
    }

    SetEditor.prototype.buildItemEditor = function(value, text) {
        var property = {
                title: text,
                itemType: 'property'
            },
            newRow = this.inspector.buildRow(property),
            currentRow = this.containerCell.parentNode,
            tbody = this.containerCell.parentNode.parentNode, // row / tbody
            cell = document.createElement('td')

        this.addGroupedRow(newRow)
        this.buildCheckbox(cell, value, text)

        newRow.appendChild(cell)
        tbody.insertBefore(newRow, currentRow.nextSibling)
    }

    SetEditor.prototype.buildCheckbox = function(cell, value, title) {
        var property = {
                property: value,
                title: title,
                default: this.isCheckedByDefault(value)
            },
            editor = new $.oc.inspector.propertyEditors.checkbox(this, property, cell)
    }

    SetEditor.prototype.isCheckedByDefault = function(value) {
        if (!this.propertyDefinition.default) {
            return false
        }

        return this.propertyDefinition.default.indexOf(value) > -1
    }
    
    //
    // Helpers
    //

    SetEditor.prototype.getLink = function() {
        return this.containerCell.querySelector('a.trigger')
    }

    SetEditor.prototype.valueToText = function(value) {
        if (!this.propertyDefinition.items) {
            return value
        }

        for (var itemValue in this.propertyDefinition.items) {
            if (itemValue == value) {
                return this.propertyDefinition.items[itemValue]
            }
        }

        return value
    }

    //
    // Editor API methods
    //

    SetEditor.prototype.supportsExternalParameterEditor = function() {
        return false
    }

    SetEditor.prototype.isGroupedEditor = function() {
        return true
    }

    //
    // Inspector API methods
    //
    // This editor creates checkbox editor and acts as a container Inspector
    // for them. The methods in this section emulate and proxy some functionality
    // of the Inspector.
    //

    SetEditor.prototype.getPropertyValue = function(checkboxValue) {
        // When a checkbox requests the property value, we return
        // TRUE if the checkbox value is listed in the current values of
        // the set.
        // For example, the available set items are [create, update], the 
        // current set value is [create] and checkboxValue is "create".
        // The result of the method will be TRUE.

        var value = this.inspector.getPropertyValue(this.propertyDefinition.property)

        if (value === undefined) {
            return this.isCheckedByDefault(checkboxValue)
        }

        if (!value) {
            return false
        }

        return value.indexOf(checkboxValue) > -1
    }

    SetEditor.prototype.setPropertyValue = function(checkboxValue, isChecked) {
        var currentValue = this.inspector.getPropertyValue(this.propertyDefinition.property)

        if (currentValue === undefined) {
            currentValue = this.propertyDefinition.default
        }

        if (!currentValue) {
            currentValue = []
        }

        if (isChecked) {
            if (currentValue.indexOf(checkboxValue) === -1) {
                currentValue.push(checkboxValue)
            }
        }
        else {
            var index = currentValue.indexOf(checkboxValue)
            if (index !== -1) {
                currentValue.splice(index, 1)
            }
        }

        this.inspector.setPropertyValue(this.propertyDefinition.property, currentValue)
        this.setLinkText(this.getLink())
    }

    SetEditor.prototype.generateSequencedId = function() {
        return this.inspector.generateSequencedId()
    }

    //
    // Disposing
    //

    SetEditor.prototype.disposeEditors = function() {
        for (var i = 0, len = this.editors.length; i < len; i++) {
            var editor = this.editors[i]

            editor.dispose()
        }
    }

    $.oc.inspector.propertyEditors.set = SetEditor
}(window.jQuery);