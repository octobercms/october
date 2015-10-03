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

    var BaseEditor = function(inspector, propertyDefinition, containerCell, group) {
        this.inspector = inspector
        this.propertyDefinition = propertyDefinition
        this.containerCell = containerCell
        this.containerRow = containerCell.parentNode
        this.parentGroup = group
        this.group = null // Group created by a grouped editor, for example by the set editor
        this.childInspector = null

        Base.call(this)

        this.init()
    }

    BaseEditor.prototype = Object.create(BaseProto)
    BaseEditor.prototype.constructor = Base

    BaseEditor.prototype.dispose = function() {
        if (this.childInspector) {
            this.childInspector.dispose()
        }

        this.inspector = null
        this.propertyDefinition = null
        this.containerCell = null
        this.containerRow = null
        this.childInspector = null
        this.parentGroup = null
        this.group = null

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

    BaseEditor.prototype.hasChildSurface = function() {
        return this.childInspector !== null
    }

    BaseEditor.prototype.initControlGroup = function() {
        this.group = this.inspector.getGroupManager().createGroup(this.propertyDefinition.property, this.parentGroup)
    }

    BaseEditor.prototype.createGroupedRow = function(property) {
        var row = this.inspector.buildRow(property, this.group),
            groupedClass = this.inspector.getGroupManager().isGroupExpanded(this.group) ? 'expanded' : 'collapsed'

        this.inspector.applyGroupLevelToRow(row, this.group)

        $.oc.foundation.element.addClass(row, 'property')
        $.oc.foundation.element.addClass(row, groupedClass)
        return row
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

    BaseEditor.prototype.getUndefinedValue = function() {
        return this.propertyDefinition.default === undefined ? undefined : this.propertyDefinition.default
    }

    $.oc.inspector.propertyEditors.base = BaseEditor
}(window.jQuery);