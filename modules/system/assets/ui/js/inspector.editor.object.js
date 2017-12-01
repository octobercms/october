/*
 * Inspector object editor class.
 *
 * This class uses other editors.
 */
+function ($) { "use strict";

    var Base = $.oc.inspector.propertyEditors.base,
        BaseProto = Base.prototype

    var ObjectEditor = function(inspector, propertyDefinition, containerCell, group) {
        if (propertyDefinition.properties === undefined) {
            this.throwError('The properties property should be specified in the object editor configuration.')
        }

        Base.call(this, inspector, propertyDefinition, containerCell, group)
    }

    ObjectEditor.prototype = Object.create(BaseProto)
    ObjectEditor.prototype.constructor = Base

    ObjectEditor.prototype.init = function() {
        this.initControlGroup()

        BaseProto.init.call(this)
    }

    //
    // Building
    //

    ObjectEditor.prototype.build = function() {
        var currentRow = this.containerCell.parentNode,
            inspectorContainer = document.createElement('div'),
            options = {
                enableExternalParameterEditor: false,
                onChange: this.proxy(this.onInspectorDataChange),
                inspectorClass: this.inspector.options.inspectorClass
            },
            values = this.inspector.getPropertyValue(this.propertyDefinition.property)

        if (values === undefined) {
            values = {}
        }

        this.childInspector = new $.oc.inspector.surface(inspectorContainer, 
            this.propertyDefinition.properties, 
            values, 
            this.inspector.getInspectorUniqueId() + '-' + this.propertyDefinition.property, 
            options,
            this.inspector,
            this.group,
            this.propertyDefinition.property)

        this.inspector.mergeChildSurface(this.childInspector, currentRow)
    }

    //
    // Helpers
    //

    ObjectEditor.prototype.cleanUpValue = function(value) {
        if (value === undefined || typeof value !== 'object') {
            return undefined
        }

        if (this.propertyDefinition.ignoreIfPropertyEmpty === undefined) {
            return value
        }

        return this.getValueOrRemove(value)
    }

    ObjectEditor.prototype.getValueOrRemove = function(value) {
        if (this.propertyDefinition.ignoreIfPropertyEmpty === undefined) {
            return value
        }

        var targetProperty = this.propertyDefinition.ignoreIfPropertyEmpty,
            targetValue = value[targetProperty]

        if (this.isEmptyValue(targetValue)) {
            return $.oc.inspector.removedProperty
        }

        return value
    }

    //
    // Editor API methods
    //

    ObjectEditor.prototype.supportsExternalParameterEditor = function() {
        return false
    }

    ObjectEditor.prototype.isGroupedEditor = function() {
        return true
    }

    ObjectEditor.prototype.getUndefinedValue = function() {
        var result = {}

        for (var i = 0, len = this.propertyDefinition.properties.length; i < len; i++) {
            var propertyName = this.propertyDefinition.properties[i].property,
                editor = this.childInspector.findPropertyEditor(propertyName)

            if (editor) {
                result[propertyName] = editor.getUndefinedValue()
            }
        }

        return this.getValueOrRemove(result)
    }

    ObjectEditor.prototype.validate = function(silentMode) {
        var values = this.childInspector.getValues()

        if (this.cleanUpValue(values) === $.oc.inspector.removedProperty) {
            // Ignore any validation rules if the object's required 
            // property is empty (ignoreIfPropertyEmpty)

            return true
        }

        return this.childInspector.validate(silentMode)
    }

    //
    // Event handlers
    //

    ObjectEditor.prototype.onInspectorDataChange = function(property, value) {
        var values = this.childInspector.getValues()

        this.inspector.setPropertyValue(this.propertyDefinition.property, this.cleanUpValue(values))
    }

    $.oc.inspector.propertyEditors.object = ObjectEditor
}(window.jQuery);