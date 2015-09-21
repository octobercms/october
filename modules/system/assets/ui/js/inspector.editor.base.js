/*
 * Inspector editor base class.
 */
+function ($) { "use strict";

    // NAMESPACES
    // ============================

    if ($.oc === undefined)
        $.oc = {}

    if ($.oc.inspector === undefined)
        $.oc.inspector = {}

    if ($.oc.inspector.propertyEditors === undefined)
        $.oc.inspector.propertyEditors = {}

    // CLASS DEFINITION
    // ============================

    var Base = $.oc.foundation.base,
        BaseProto = Base.prototype

    var BaseEditor = function(inspector, propertyDefinition, containerCell) {
        this.inspector = inspector
        this.propertyDefinition = propertyDefinition
        this.containerCell = containerCell
        this.groupIndex = null

        Base.call(this)

        this.init()
    }

    BaseEditor.prototype = Object.create(BaseProto)
    BaseEditor.prototype.constructor = Base

    BaseEditor.prototype.dispose = function() {
        this.inspector = null
        this.propertyDefinition = null
        this.containerCell = null

        BaseProto.dispose.call(this)
    }

    BaseEditor.prototype.init = function() {
        this.build()
        this.registerHandlers()
    }

    BaseEditor.prototype.build = function() {
        return null
    }

    BaseEditor.prototype.registerHandlers = function() {
    }

    BaseEditor.prototype.onInspectorPropertyChanged = function(property, value) {
    }

    BaseEditor.prototype.onExternalPropertyEditorHidden = function() {
    }

    BaseEditor.prototype.focus = function() {
    }

    BaseEditor.prototype.supportsExternalParameterEditor = function() {
        return true
    }

    BaseEditor.prototype.isGroupedEditor = function() {
        return false
    }

    BaseEditor.prototype.getGroupIndex = function() {
        if (this.groupIndex !== null) {
            return this.groupIndex
        }

        this.groupIndex = this.inspector.generateSequencedId()

        return this.groupIndex
    }

    BaseEditor.prototype.addGroupedRow = function(row) {
        if (this.inspector.isGroupExpanded(this.propertyDefinition.title)) {
            $.oc.foundation.element.addClass(row, 'expanded')
        }
        else {
            $.oc.foundation.element.addClass(row, 'collapsed')
        }

        $.oc.foundation.element.addClass(row, 'grouped')
        row.setAttribute('data-group-index', this.getGroupIndex())
    }

    /**
     * Updates displayed value in the editor UI. The value is already set 
     * in the Inspector and should be loaded from Inspector.
     */
    BaseEditor.prototype.updateDisplayedValue = function(value) {
    }

    BaseEditor.prototype.getPropertyName = function() {
        return this.propertyDefinition.property
    }

    $.oc.inspector.propertyEditors.base = BaseEditor
}(window.jQuery);