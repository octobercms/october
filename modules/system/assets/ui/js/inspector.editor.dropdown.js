/*
 * Inspector checkbox dropdown class.
 */
+function ($) { "use strict";

    var Base = $.oc.inspector.propertyEditors.base,
        BaseProto = Base.prototype

    var DropdownEditor = function(inspector, propertyDefinition, containerCell, group) {
        this.indicatorContainer = null

        Base.call(this, inspector, propertyDefinition, containerCell, group)
    }

    DropdownEditor.prototype = Object.create(BaseProto)
    DropdownEditor.prototype.constructor = Base

    DropdownEditor.prototype.init = function() {
        this.dynamicOptions = this.propertyDefinition.options ? false : true
        this.initialization = false

        BaseProto.init.call(this)
    }

    DropdownEditor.prototype.dispose = function() {
        this.unregisterHandlers()
        this.destroyCustomSelect()

        this.indicatorContainer = null

        BaseProto.dispose.call(this)
    }

    //
    // Building
    //

    DropdownEditor.prototype.build = function() {
        var select = document.createElement('select')

        $.oc.foundation.element.addClass(this.containerCell, 'dropdown')
        $.oc.foundation.element.addClass(select, 'custom-select')

        if (!this.dynamicOptions) {
            this.loadStaticOptions(select)
        }

        this.containerCell.appendChild(select)

        this.initCustomSelect()

        if (this.dynamicOptions) {
           this.loadDynamicOptions(true)
        }
    }

    DropdownEditor.prototype.createOption = function(select, title, value) {
        var option = document.createElement('option')

        if (title !== null) {
            option.textContent = title
        }

        if (value !== null) {
            option.value = value
        }

        select.appendChild(option)
    }

    DropdownEditor.prototype.createOptions = function(select, options) {
        for (var value in options) {
            this.createOption(select, options[value], value)
        }
    }

    DropdownEditor.prototype.initCustomSelect = function() {
        var select = this.getSelect()

        if (Modernizr.touch) {
            return
        }

        var options = {
            dropdownCssClass: 'ocInspectorDropdown'
        }

        if (this.propertyDefinition.placeholder !== undefined) {
            options.placeholder = this.propertyDefinition.placeholder
        }

        $(select).select2(options)

        if (!Modernizr.touch) {
            this.indicatorContainer = $('.select2-container', this.containerCell)
            this.indicatorContainer.addClass('loading-indicator-container size-small')
        }
    }

    DropdownEditor.prototype.createPlaceholder = function(select) {
        var placeholder = this.propertyDefinition.placeholder

        if (placeholder !== undefined && !Modernizr.touch) {
            this.createOption(select, null, null)
        }

        if (placeholder !== undefined && Modernizr.touch) {
            this.createOption(select, placeholder, null)
        }
    }

    //
    // Helpers
    //

    DropdownEditor.prototype.getSelect = function() {
        return this.containerCell.querySelector('select')
    }

    DropdownEditor.prototype.clearOptions = function(select) {
        while (select.firstChild) {
            select.removeChild(select.firstChild)
        }
    }

    DropdownEditor.prototype.hasOptionValue = function(select, value) {
        var options = select.children

        for (var i = 0, len = options.length; i < len; i++) {
            if (options[i].value == value) {
                return true
            }
        }

        return false
    }

    //
    // Event handlers
    //

    DropdownEditor.prototype.registerHandlers = function() {
        var select = this.getSelect()

        $(select).on('change', this.proxy(this.onSelectionChange))
    }

    DropdownEditor.prototype.onSelectionChange = function() {
        var select = this.getSelect()

        this.inspector.setPropertyValue(this.propertyDefinition.property, select.value, this.initialization)
    }

    DropdownEditor.prototype.onInspectorPropertyChanged = function(property, value) {
        if (!this.propertyDefinition.depends || this.propertyDefinition.depends.indexOf(property) === -1) {
            return
        }

        var dependencyValues = this.getDependencyValues()

        if (this.prevDependencyValues === undefined || this.prevDependencyValues != dependencyValues) {
            this.loadDynamicOptions()
        }
    }

    DropdownEditor.prototype.onExternalPropertyEditorHidden = function() {
        this.loadDynamicOptions(false)
    }

    //
    // Editor API methods
    //

    DropdownEditor.prototype.updateDisplayedValue = function(value) {
        var select = this.getSelect()

        select.value = value
    }

    DropdownEditor.prototype.getUndefinedValue = function() {
        // Return default value if the default value is defined
        if (this.propertyDefinition.default !== undefined) {
            return this.propertyDefinition.default
        }

        // Return undefined if there's a placeholder value
        if (this.propertyDefinition.placeholder !== undefined) {
            return undefined
        }

        // Otherwise - return the first value in the list
        var select = this.getSelect()

        if (select) {
            return select.value
        }

        return undefined
    }

    //
    // Disposing
    //

    DropdownEditor.prototype.destroyCustomSelect = function() {
        var $select = $(this.getSelect())

        if ($select.data('select2') != null) {
            $select.select2('destroy')
        }
    }

    DropdownEditor.prototype.unregisterHandlers = function() {
        var select = this.getSelect()

        $(select).off('change', this.proxy(this.onSelectionChange))
    }

    //
    // Static options
    //

    DropdownEditor.prototype.loadStaticOptions = function(select) {
        var value = this.inspector.getPropertyValue(this.propertyDefinition.property)

        this.createPlaceholder(select)

        this.createOptions(select, this.propertyDefinition.options)

        if (value === undefined) {
            value = this.propertyDefinition.default
        }

        select.value = value
    }

    //
    // Dynamic options
    //

    DropdownEditor.prototype.loadDynamicOptions = function(initialization) {
        var currentValue = this.inspector.getPropertyValue(this.propertyDefinition.property),
            data = this.inspector.getValues(),
            self = this,
            $form = $(this.getSelect()).closest('form')

        if (currentValue === undefined) {
            currentValue = this.propertyDefinition.default
        }

        if (this.propertyDefinition.depends) {
            this.saveDependencyValues()
        }

        data['inspectorProperty'] = this.propertyDefinition.property
        data['inspectorClassName'] = this.inspector.options.inspectorClass

        this.showLoadingIndicator()

        $form.request('onInspectableGetOptions', {
            data: data,
        }).done(function dropdownOptionsRequestDoneClosure(data) {
            self.optionsRequestDone(data, currentValue, true)
        }).always(
            this.proxy(this.hideLoadingIndicator)
        )
    }

    DropdownEditor.prototype.saveDependencyValues = function() {
        this.prevDependencyValues = this.getDependencyValues()
    }

    DropdownEditor.prototype.getDependencyValues = function() {
        var result = ''

        for (var i = 0, len = this.propertyDefinition.depends.length; i < len; i++) {
            var property = this.propertyDefinition.depends[i],
                value = this.inspector.getPropertyValue(property)

            if (value === undefined) {
                value = '';
            }

            result += property + ':' + value + '-'
        }

        return result
    }

    DropdownEditor.prototype.showLoadingIndicator = function() {
        if (!Modernizr.touch) {
            this.indicatorContainer.loadIndicator()
        }
    }

    DropdownEditor.prototype.hideLoadingIndicator = function() {
        if (this.isDisposed()) {
            return
        }

        if (!Modernizr.touch) {
            this.indicatorContainer.loadIndicator('hide')
            this.indicatorContainer.loadIndicator('destroy')
        }
    }

    DropdownEditor.prototype.optionsRequestDone = function(data, currentValue, initialization) {
        if (this.isDisposed()) {
            // Handle the case when the asynchronous request finishes after
            // the editor is disposed
            return
        }

        var select = this.getSelect()

        // Without destroying and recreating the custom select
        // there could be detached DOM nodes.
        this.destroyCustomSelect()
        this.clearOptions(select)
        this.initCustomSelect()

        this.createPlaceholder(select)

        if (data.options) {
            for (var i = 0, len = data.options.length; i < len; i++) {
               this.createOption(select, data.options[i].title, data.options[i].value)
            }
        }

        if (this.hasOptionValue(select, currentValue)) {
            select.value = currentValue
        }
        else {
            select.selectedIndex = this.propertyDefinition.placeholder === undefined ? 0 : -1
        }

        this.initialization = initialization
        $(select).trigger('change')
        this.initialization = false
    }

    $.oc.inspector.propertyEditors.dropdown = DropdownEditor
}(window.jQuery);