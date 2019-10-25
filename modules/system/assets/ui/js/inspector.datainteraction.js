/*
 * Inspector data interaction class.
 *
 * Provides methods for loading and writing Inspector configuration 
 * and values form and to inspectable elements.
 */
+function ($) { "use strict";

    // CLASS DEFINITION
    // ============================

    var Base = $.oc.foundation.base,
        BaseProto = Base.prototype

    var DataInteraction = function(element) {
        this.element = element

        Base.call(this)
    }

    DataInteraction.prototype = Object.create(BaseProto)
    DataInteraction.prototype.constructor = Base

    DataInteraction.prototype.dispose = function() {
        this.element = null

        BaseProto.dispose.call(this)
    }

    DataInteraction.prototype.getElementValuesInput = function() {
        return this.element.querySelector('input[data-inspector-values]')
    }

    DataInteraction.prototype.normalizePropertyCode = function(code, configuration) {
        var lowerCaseCode = code.toLowerCase()

        for (var index in configuration) {
            var propertyInfo = configuration[index]

            if (propertyInfo.property.toLowerCase() == lowerCaseCode) {
                return propertyInfo.property
            }
        }

        return code
    }

    DataInteraction.prototype.loadValues = function(configuration) {
        var valuesField = this.getElementValuesInput()

        if (valuesField) {
            var valuesStr = $.trim(valuesField.value)

            try {
                return valuesStr.length === 0 ? {} : $.parseJSON(valuesStr)
            }
            catch (err) {
                throw new Error('Error parsing Inspector field values. ' + err)
            }
        }

        var values = {},
            attributes = this.element.attributes

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

                var normalizedPropertyName = normalizePropertyCode(matches[1], configuration)
                values[normalizedPropertyName] = attribute.value
            }
        }

        return values
    }

    DataInteraction.prototype.loadConfiguration = function(onComplete) {
        var configurationField = this.element.querySelector('input[data-inspector-config]'),
            result = {
                configuration: {},
                title: null,
                description: null
            },
            $element = $(this.element)

        result.title = $element.data('inspector-title')
        result.description = $element.data('inspector-description')

        if (configurationField) {
            result.configuration = this.parseConfiguration(configurationField.value)

            onComplete(result, this)
            return
        }

        var $form = $element.closest('form'),
            data = $element.data(),
            self = this

        $.oc.stripeLoadIndicator.show()
        $form.request('onGetInspectorConfiguration', {
            data: data
        }).done(function inspectorConfigurationRequestDoneClosure(data) {
            self.configurartionRequestDone(data, onComplete, result)
        }).always(function() {
            $.oc.stripeLoadIndicator.hide()
        })
    }

    //
    // Internal methods
    //

    DataInteraction.prototype.parseConfiguration = function(configuration) {
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

    DataInteraction.prototype.configurartionRequestDone = function(data, onComplete, result) {
        result.configuration = this.parseConfiguration(data.configuration.properties)

        if (data.configuration.title !== undefined) {
            result.title = data.configuration.title
        }

        if (data.configuration.description !== undefined) {
            result.description = data.configuration.description
        }

        onComplete(result, this)
    }

    $.oc.inspector.dataInteraction = DataInteraction
}(window.jQuery);