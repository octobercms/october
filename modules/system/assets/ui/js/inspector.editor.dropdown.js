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

    DropdownEditor.prototype.formatSelectOption = function(state) {
        if (!state.id)
            return state.text; // optgroup

        var option = state.element,
            iconClass = option.getAttribute('data-icon'),
            imageSrc = option.getAttribute('data-image')

        if (iconClass) {
            return '<i class="select-icon '+iconClass+'"></i> ' + state.text
        }

        if (imageSrc) {
            return '<img class="select-image" src="'+imageSrc+'" alt="" /> ' + state.text
        }

        return state.text
    }

    DropdownEditor.prototype.createOption = function(select, title, value) {
        var option = document.createElement('option')

        if (title !== null) {
            if (!$.isArray(title)) {
                option.textContent = title
            }
            else {
                if (title[1].indexOf('.') !== -1) {
                    option.setAttribute('data-image', title[1])
                }
                else {
                    option.setAttribute('data-icon', title[1])
                }

                option.textContent = title[0]
            }
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

        var options = {
            dropdownCssClass: 'ocInspectorDropdown'
        }

        if (this.propertyDefinition.emptyOption !== undefined) {
            options.placeholder = this.propertyDefinition.emptyOption
        }
        if (this.propertyDefinition.placeholder !== undefined) {
            options.placeholder = this.propertyDefinition.placeholder
        }

        options.templateResult = this.formatSelectOption
        options.templateSelection = this.formatSelectOption
        options.escapeMarkup = function(m) {
            return m
        }

        $(select).select2(options)

        if (!Modernizr.touchevents) {
            this.indicatorContainer = $('.select2-container', this.containerCell)
            this.indicatorContainer.addClass('loading-indicator-container size-small')
        }
    }

    DropdownEditor.prototype.createPlaceholder = function(select) {
        var placeholder = this.propertyDefinition.placeholder || this.propertyDefinition.emptyOption

        if (placeholder !== undefined && !Modernizr.touchevents) {
            this.createOption(select, null, null)
        }

        if (placeholder !== undefined && Modernizr.touchevents) {
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

    DropdownEditor.prototype.normalizeValue = function(value) {
        if (!this.propertyDefinition.booleanValues) {
            return value
        }

        var str = String(value)

        if (str.length === 0) {
            return ''
        }

        if (str === 'true') {
            return true
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

        this.inspector.setPropertyValue(this.propertyDefinition.property, this.normalizeValue(select.value), this.initialization)
    }

    DropdownEditor.prototype.onInspectorPropertyChanged = function(property) {
        if (!this.propertyDefinition.depends || this.propertyDefinition.depends.indexOf(property) === -1) {
            return
        }

        var dependencyValues = this.getDependencyValues()

        if (this.prevDependencyValues === undefined || this.prevDependencyValues != dependencyValues) {
            this.loadDynamicOptions()
        }
    }

    DropdownEditor.prototype.onExternalPropertyEditorHidden = function() {
        if (this.dynamicOptions) {
            this.loadDynamicOptions(false)
        }
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
            return this.normalizeValue(select.value)
        }

        return undefined
    }

    DropdownEditor.prototype.isEmptyValue = function(value) {
        if (this.propertyDefinition.booleanValues) {
            if (value === '') {
                return true
            }

            return false
        }

        return BaseProto.isEmptyValue.call(this, value)
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
            data = this.getRootSurface().getValues(),
            self = this,
            $form = $(this.getSelect()).closest('form'),
            dependents = this.inspector.findDependentProperties(this.propertyDefinition.property)

        if (currentValue === undefined) {
            currentValue = this.propertyDefinition.default
        }

        var callback = function dropdownOptionsRequestDoneClosure(data) {
            self.hideLoadingIndicator()
            self.optionsRequestDone(data, currentValue, true)

            if (dependents.length > 0) {
                for (var i in dependents) {
                    var editor = self.inspector.findPropertyEditor(dependents[i])
                    if (editor && typeof editor.onInspectorPropertyChanged === 'function') {
                        editor.onInspectorPropertyChanged(self.propertyDefinition.property)
                    }
                }
            }
        }

        if (this.propertyDefinition.depends) {
            this.saveDependencyValues()
        }

        data['inspectorProperty'] = this.getPropertyPath()
        data['inspectorClassName'] = this.inspector.options.inspectorClass

        this.showLoadingIndicator()

        if (this.triggerGetOptions(data, callback) === false) {
            return
        }

        $form.request('onInspectableGetOptions', {
            data: data,
        }).done(callback).always(
            this.proxy(this.hideLoadingIndicator)
        )
    }

    DropdownEditor.prototype.triggerGetOptions = function(values, callback) {
        var $inspectable = this.getInspectableElement()
        if (!$inspectable) {
            return true
        }

        var optionsEvent = $.Event('dropdownoptions.oc.inspector')

        $inspectable.trigger(optionsEvent, [{
            values: values,
            callback: callback,
            property: this.inspector.getPropertyPath(this.propertyDefinition.property),
            propertyDefinition: this.propertyDefinition
        }])

        if (optionsEvent.isDefaultPrevented()) {
            return false
        }

        return true
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
        if (!Modernizr.touchevents) {
            this.indicatorContainer.loadIndicator()
        }
    }

    DropdownEditor.prototype.hideLoadingIndicator = function() {
        if (this.isDisposed()) {
            return
        }

        if (!Modernizr.touchevents) {
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
