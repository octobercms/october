/*
 * Inspector set editor class.
 *
 * This class uses $.oc.inspector.propertyEditors.checkbox editor.
 */
+function ($) { "use strict";

    var Base = $.oc.inspector.propertyEditors.base,
        BaseProto = Base.prototype

    var SetEditor = function(inspector, propertyDefinition, containerCell, group) {
        this.editors = []
        this.loadedItems = null

        Base.call(this, inspector, propertyDefinition, containerCell, group)
    }

    SetEditor.prototype = Object.create(BaseProto)
    SetEditor.prototype.constructor = Base

    SetEditor.prototype.init = function() {
        this.initControlGroup()

        BaseProto.init.call(this)
    }

    SetEditor.prototype.dispose = function() {
        this.disposeEditors()
        this.disposeControls()

        this.editors = null

        BaseProto.dispose.call(this)
    }

    //
    // Building
    //

    SetEditor.prototype.build = function() {
        var link = document.createElement('a')

        $.oc.foundation.element.addClass(link, 'trigger')
        link.setAttribute('href', '#')
        this.setLinkText(link)

        $.oc.foundation.element.addClass(this.containerCell, 'trigger-cell')

        this.containerCell.appendChild(link)

        if (this.propertyDefinition.items !== undefined) {
            this.loadStaticItems()
        }
        else {
            this.loadDynamicItems()
        }
    }

    SetEditor.prototype.loadStaticItems = function() {
        var itemArray = []

        for (var itemValue in this.propertyDefinition.items) {
            itemArray.push({
                value: itemValue,
                title: this.propertyDefinition.items[itemValue]
            })
        }

        for (var i = itemArray.length-1; i >=0; i--) {
            this.buildItemEditor(itemArray[i].value, itemArray[i].title)
        }
    }

    SetEditor.prototype.setLinkText = function(link, value) {
        var value = (value !== undefined && value !== null) ? value 
                : this.getNormalizedValue(),
            text = '[ ]'

        if (value === undefined) {
            value = this.propertyDefinition.default
        }

        if (value !== undefined && value.length !== undefined && value.length > 0 && typeof value !== 'string') {
            var textValues = []
            for (var i = 0, len = value.length; i < len; i++) {
                textValues.push(this.valueToText(value[i]))
            }

            text = '[' + textValues.join(', ') + ']'
            $.oc.foundation.element.removeClass(link, 'placeholder')
        }
        else {
            text = this.propertyDefinition.placeholder

            if ((typeof text === 'string' && text.length == 0) || text === undefined) {
                text = '[ ]'
            }
            $.oc.foundation.element.addClass(link, 'placeholder')
        }

        link.textContent = text
    }

    SetEditor.prototype.buildItemEditor = function(value, text) {
        var property = {
                title: text,
                itemType: 'property',
                groupIndex: this.group.getGroupIndex()
            },
            newRow = this.createGroupedRow(property),
            currentRow = this.containerCell.parentNode,
            tbody = this.containerCell.parentNode.parentNode, // row / tbody
            cell = document.createElement('td')

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
            editor = new $.oc.inspector.propertyEditors.checkbox(this, property, cell, this.group)

        this.editors.push[editor]
    }

    SetEditor.prototype.isCheckedByDefault = function(value) {
        if (!this.propertyDefinition.default) {
            return false
        }

        return this.propertyDefinition.default.indexOf(value) > -1
    }

    //
    // Dynamic items
    //

    SetEditor.prototype.showLoadingIndicator = function() {
        $(this.getLink()).loadIndicator()
    }

    SetEditor.prototype.hideLoadingIndicator = function() {
        if (this.isDisposed()) {
            return
        }

        var $link = $(this.getLink())

        $link.loadIndicator('hide')
        $link.loadIndicator('destroy')
    }

    SetEditor.prototype.loadDynamicItems = function() {
        var link = this.getLink(),
            data = this.inspector.getValues(),
            $form = $(link).closest('form')

        $.oc.foundation.element.addClass(link, 'loading-indicator-container size-small')
        this.showLoadingIndicator()

        data['inspectorProperty'] = this.propertyDefinition.property
        data['inspectorClassName'] = this.inspector.options.inspectorClass

        $form.request('onInspectableGetOptions', {
            data: data,
        })
        .done(this.proxy(this.itemsRequestDone))
        .always(this.proxy(this.hideLoadingIndicator))
    }

    SetEditor.prototype.itemsRequestDone = function(data, currentValue, initialization) {
        if (this.isDisposed()) {
            // Handle the case when the asynchronous request finishes after
            // the editor is disposed
            return
        }

        this.loadedItems = {}

        if (data.options) {
            for (var i = data.options.length-1; i >= 0; i--) {
                this.buildItemEditor(data.options[i].value, data.options[i].title)

                this.loadedItems[data.options[i].value] = data.options[i].title
            }
        }

        this.setLinkText(this.getLink())
    }

    //
    // Helpers
    //

    SetEditor.prototype.getLink = function() {
        return this.containerCell.querySelector('a.trigger')
    }

    SetEditor.prototype.getItemsSource = function() {
        if (this.propertyDefinition.items !== undefined) {
            return this.propertyDefinition.items
        }

        return this.loadedItems
    }

    SetEditor.prototype.valueToText = function(value) {
        var source = this.getItemsSource()

        if (!source) {
            return value
        }

        for (var itemValue in source) {
            if (itemValue == value) {
                return source[itemValue]
            }
        }

        return value
    }

    /* 
     * Removes items that don't exist in the defined items from
     * the value.
     */
    SetEditor.prototype.cleanUpValue = function(value) {
        if (!value) {
            return value
        }

        var result = [],
            source = this.getItemsSource()

        for (var i = 0, len = value.length; i < len; i++) {
            var currentValue = value[i]

            if (source[currentValue] !== undefined) {
                result.push(currentValue)
            }
        }

        return result
    }

    SetEditor.prototype.getNormalizedValue = function() {
        var value = this.inspector.getPropertyValue(this.propertyDefinition.property)

        if (value === null) {
            value = undefined
        }

        if (value === undefined) {
            return value
        }

        if (value.length === undefined || typeof value === 'string') {
            return undefined
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

        var value = this.getNormalizedValue()

        if (value === undefined) {
            return this.isCheckedByDefault(checkboxValue)
        }

        if (!value) {
            return false
        }

        return value.indexOf(checkboxValue) > -1
    }

    SetEditor.prototype.setPropertyValue = function(checkboxValue, isChecked) {
        var currentValue = this.getNormalizedValue()

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

        this.inspector.setPropertyValue(this.propertyDefinition.property, this.cleanUpValue(currentValue))
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

    SetEditor.prototype.disposeControls = function() {
        var link = this.getLink()

        if (this.propertyDefinition.items === undefined) {
            $(link).loadIndicator('destroy')
        }

        link.parentNode.removeChild(link)
    }

    $.oc.inspector.propertyEditors.set = SetEditor
}(window.jQuery);