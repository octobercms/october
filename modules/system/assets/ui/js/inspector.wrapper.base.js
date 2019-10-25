/*
 * Inspector wrapper base class.
 */
+function ($) { "use strict";

    // NAMESPACES
    // ============================

    if ($.oc.inspector === undefined)
        $.oc.inspector = {}

    if ($.oc.inspector.wrappers === undefined)
        $.oc.inspector.wrappers = {}

    // CLASS DEFINITION
    // ============================

    var Base = $.oc.foundation.base,
        BaseProto = Base.prototype

    var BaseWrapper = function($element, sourceWrapper, options) {
        this.$element = $element

        this.options = $.extend({}, BaseWrapper.DEFAULTS, typeof options == 'object' && options)
        this.switched = false
        this.configuration = null

        Base.call(this)

        if (!sourceWrapper) {
            if (!this.triggerShowingAndInit()) {
                // this.init() is called inside triggerShowing()

                return
            }

            this.surface = null
            this.title = null
            this.description = null
        } 
        else {
            this.surface = sourceWrapper.surface
            this.title = sourceWrapper.title
            this.description = sourceWrapper.description

            sourceWrapper = null

            this.init()
        }
    }

    BaseWrapper.prototype = Object.create(BaseProto)
    BaseWrapper.prototype.constructor = Base

    BaseWrapper.prototype.dispose = function() {
        if (!this.switched) {
            this.$element.removeClass('inspector-open')
            this.setInspectorVisibleFlag(false)

            this.$element.trigger('hidden.oc.inspector')
        }

        if (this.surface !== null && this.surface.options.onGetInspectableElement === this.proxy(this.onGetInspectableElement)) {
            this.surface.options.onGetInspectableElement = null
        }

        this.surface = null
        this.$element = null
        this.title = null
        this.description = null
        this.configuration = null

        BaseProto.dispose.call(this)
    }

    BaseWrapper.prototype.init = function() {
        // Wrappers can create a new surface or inject an existing
        // surface to the UI they manage.
        //
        // If there is no surface provided in the wrapper constructor,
        // the wrapper first loads the Inspector configuration and values
        // and then calls the createSurfaceAndUi() method with all information
        // required for creating a new Inspector surface and UI.

        if (!this.surface) {
            this.loadConfiguration()
        }
        else {
            this.adoptSurface()
        }

        this.$element.addClass('inspector-open')
    }

    //
    // Helper methods
    //

    BaseWrapper.prototype.getElementValuesInput = function() {
        return this.$element.find('> input[data-inspector-values]')
    }

    BaseWrapper.prototype.normalizePropertyCode = function(code, configuration) {
        var lowerCaseCode = code.toLowerCase()

        for (var index in configuration) {
            var propertyInfo = configuration[index]

            if (propertyInfo.property.toLowerCase() == lowerCaseCode) {
                return propertyInfo.property
            }
        }

        return code
    }

    BaseWrapper.prototype.isExternalParametersEditorEnabled = function() {
        return this.$element.closest('[data-inspector-external-parameters]').length > 0
    }

    BaseWrapper.prototype.initSurface = function(containerElement, properties, values) {
        var options = this.$element.data() || {}

        options.enableExternalParameterEditor = this.isExternalParametersEditorEnabled()
        options.onGetInspectableElement = this.proxy(this.onGetInspectableElement)

        this.surface = new $.oc.inspector.surface(
            containerElement,
            properties,
            values,
            $.oc.inspector.helpers.generateElementUniqueId(this.$element.get(0)),
            options)
    }

    BaseWrapper.prototype.isLiveUpdateEnabled = function() {
        return false
    }

    //
    // Wrapper API
    //

    BaseWrapper.prototype.createSurfaceAndUi = function(properties, values) {

    }

    BaseWrapper.prototype.setInspectorVisibleFlag = function(value) {
        this.$element.data('oc.inspectorVisible', value)
    }

    BaseWrapper.prototype.adoptSurface = function() {
        this.surface.options.onGetInspectableElement = this.proxy(this.onGetInspectableElement)
    }

    BaseWrapper.prototype.cleanupAfterSwitch = function() {
        this.switched = true
        this.dispose()
    }

    //
    // Values
    //

    BaseWrapper.prototype.loadValues = function(configuration) {
        var $valuesField = this.getElementValuesInput()

        if ($valuesField.length > 0) {
            var valuesStr = $.trim($valuesField.val())

            try {
                return valuesStr.length === 0 ? {} : $.parseJSON(valuesStr)
            }
            catch (err) {
                throw new Error('Error parsing Inspector field values. ' + err)
            }
        }

        var values = {},
            attributes = this.$element.get(0).attributes

        for (var i=0, len = attributes.length; i < len; i++) {
            var attribute = attributes[i],
                matches = []

            if (matches = attribute.name.match(/^data-property-(.*)$/)) {
                // Important - values contained in data-property-xxx attributes are
                // considered strings and never parsed with JSON. The use of the
                // data-property-xxx attributes is very limited - they're only
                // used in Pages for creating snippets from partials, where properties 
                // are created with a table UI widget, which doesn't allow creating 
                // properties of any complex types.
                //
                // There is no a technically reliable way to determine when a string
                // is a JSON data or a regular string. Users can enter a value
                // like [10], which is a proper JSON value, but meant to be a string.
                //
                // One possible way to resolve it, if to check the property type loaded
                // from the configuration and see if the corresponding editor expects
                // complex data.

                var normalizedPropertyName = this.normalizePropertyCode(matches[1], configuration)
                values[normalizedPropertyName] = attribute.value
            }
        }

        return values
    }

    BaseWrapper.prototype.applyValues = function(liveUpdateMode) {
        var $valuesField = this.getElementValuesInput(),
            values = liveUpdateMode ? 
                        this.surface.getValidValues() : 
                        this.surface.getValues()

        if (liveUpdateMode) {
            // In the live update mode, when only valid values are applied,
            // we don't want to change all other values (invalid properties).

            var existingValues = this.loadValues(this.configuration)

            for (var property in values) {
                if (values[property] !== $.oc.inspector.invalidProperty) {
                    existingValues[property] = values[property]
                }
            }

            // Properties that use settings like ignoreIfPropertyEmpty could 
            // be removed from the list returned by getValidValues(). Removed
            // properties should be removed from the result list.

            var filteredValues = {}

            for (var property in existingValues) {
                if (values.hasOwnProperty(property)) {
                    filteredValues[property] = existingValues[property]
                }
            }


            values = filteredValues
        }

        if ($valuesField.length > 0) {
            $valuesField.val(JSON.stringify(values))
        } 
        else {
            for (var property in values) {
                var value = values[property]

                if ($.isArray(value) ||$.isPlainObject(value)) {
                    throw new Error('Inspector data-property-xxx attributes do not support complex values. Property: ' + property)
                }

                this.$element.attr('data-property-' + property, value)
            }
        }

        // In the live update mode the livechange event is triggered 
        // regardless of whether Surface properties match or don't match
        // the original properties of the inspectable element. Without it
        // there could be undesirable side effects.

        if (liveUpdateMode) {
            this.$element.trigger('livechange')
        }
        else {
            var hasChanges = false

            if (this.isLiveUpdateEnabled()) {
                var currentValues = this.loadValues(this.configuration)

                // If the Inspector setup supports the live update mode,
                // evaluate changes as a difference between the current element
                // properties and internal properties stored in the Surface.
                // If there is no differences, the properties have already
                // been applied with a preceding live update.
                hasChanges = this.surface.hasChanges(currentValues)
            }
            else {
                hasChanges = this.surface.hasChanges()
            }

            if (hasChanges) {
                this.$element.trigger('change')
            }
        }
    }

    //
    // Configuration
    //

    BaseWrapper.prototype.loadConfiguration = function() {
        var configString = this.$element.data('inspector-config'),
            result = {
                properties: {},
                title: null,
                description: null
            }

        result.title = this.$element.data('inspector-title')
        result.description = this.$element.data('inspector-description')

        if (configString !== undefined) {
            result.properties = this.parseConfiguration(configString)

            this.configurationLoaded(result)
            return
        }

        var $configurationField = this.$element.find('> input[data-inspector-config]')

        if ($configurationField.length > 0) {
            result.properties = this.parseConfiguration($configurationField.val())

            this.configurationLoaded(result)
            return
        }

        var $form = this.$element.closest('form'),
            data = this.$element.data(),
            self = this

        $.oc.stripeLoadIndicator.show()
        $form.request('onGetInspectorConfiguration', {
            data: data
        }).done(function inspectorConfigurationRequestDoneClosure(data) {
            self.onConfigurartionRequestDone(data, result)
        }).always(function() {
            $.oc.stripeLoadIndicator.hide()
        })
    }

    BaseWrapper.prototype.parseConfiguration = function(configuration) {
        if (!$.isArray(configuration) && !$.isPlainObject(configuration)) {
            if ($.trim(configuration) === 0) {
                return {}
            }

            try {
               return $.parseJSON(configuration)
            }
            catch(err) {
                throw new Error('Error parsing Inspector configuration. ' + err)
            }
        }
        else {
            return configuration
        }
    }

    BaseWrapper.prototype.configurationLoaded = function(configuration) {
        var values = this.loadValues(configuration.properties)

        this.title = configuration.title
        this.description = configuration.description
        this.configuration = configuration

        this.createSurfaceAndUi(configuration.properties, values)
    }

    BaseWrapper.prototype.onConfigurartionRequestDone = function(data, result) {
        result.properties = this.parseConfiguration(data.configuration.properties)

        if (data.configuration.title !== undefined) {
            result.title = data.configuration.title
        }

        if (data.configuration.description !== undefined) {
            result.description = data.configuration.description
        }

        this.configurationLoaded(result)
    }

    //
    // Events
    //

    BaseWrapper.prototype.triggerShowingAndInit = function() {
        var e = $.Event('showing.oc.inspector')

        this.$element.trigger(e, [{callback: this.proxy(this.init)}])
        if (e.isDefaultPrevented()) {
            this.$element = null

            return false
        }

        if (!e.isPropagationStopped()) {
            this.init()
        }
    }

    BaseWrapper.prototype.triggerHiding = function() {
        var hidingEvent = $.Event('hiding.oc.inspector'),
            values = this.surface.getValues()

        this.$element.trigger(hidingEvent, [{values: values}])
        return !hidingEvent.isDefaultPrevented();
    }

    BaseWrapper.prototype.onGetInspectableElement = function() {
        return this.$element
    }

    BaseWrapper.DEFAULTS = {
        containerSupported: false
    }

    $.oc.inspector.wrappers.base = BaseWrapper
}(window.jQuery);