/*
 * Inspector object editor class.
 *
 * This class uses other editors.
 */
+function ($) { "use strict";

    var Base = $.oc.inspector.propertyEditors.base,
        BaseProto = Base.prototype

    var ObjectEditor = function(inspector, propertyDefinition, containerCell) {
       
        if (propertyDefinition.properties === undefined) {
            throw new Error('The properties property should be specified in the object editor configuration. Property: ' + propertyDefinition.property)
        }

        Base.call(this, inspector, propertyDefinition, containerCell)
    }

    ObjectEditor.prototype = Object.create(BaseProto)
    ObjectEditor.prototype.constructor = Base

    //
    // Building
    //

    ObjectEditor.prototype.build = function() {
        var currentRow = this.containerCell.parentNode,
            inspectorContainer = document.createElement('div'),
            options = {
                enableExternalParameterEditor: false,
                surfaceLevel: this.inspector.options.surfaceLevel + 1
            },
            values = this.inspector.getPropertyValue(this.propertyDefinition.property)

        if (values === undefined) {
            values = {}
        }

        // this.containerCell.appendChild(inspectorContainer)

        this.childInspector = new $.oc.inspector.surface(inspectorContainer, 
            this.propertyDefinition.properties, 
            values, 
            this.inspector.getInspectorUniqueId() + '-' + this.propertyDefinition.property, 
            options,
            this.inspector)

        this.inspector.mergeChildSurface(this.childInspector, currentRow)
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

    $.oc.inspector.propertyEditors.object = ObjectEditor
}(window.jQuery);