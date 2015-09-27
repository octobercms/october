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
        this.containerRow = containerCell.parentNode
        this.groupIndex = null
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

    BaseEditor.prototype.getGroupIndex = function() {
        if (this.groupIndex !== null) {
            return this.groupIndex
        }

        this.groupIndex = this.inspector.generateGroupIndex(this.propertyDefinition.property)

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

    BaseEditor.prototype.getChildInspectorRows = function(level) {
        if (level === undefined) {
            level = 0
        }

        if (!this.childInspector) {
            return [this.containerRow]
        }

        var result = []

        if (level > 0) {
            result.push(this.containerRow)
        }

        for (var i = 0, len = this.childInspector.editors.length; i < len; i++) {
            var editor = this.childInspector.editors[i],
                childRows = editor.getChildInspectorRows(level+1)

            for (var j = 0, rowsLength = childRows.length; j < rowsLength; j++) {
                result.push(childRows[j])
            }
        }

        return result
    }

    BaseEditor.prototype.findEditorByInspectorIdAndPropertyName = function(inspectorId, propertyName) {
        if (this.inspector.getInspectorUniqueId() == inspectorId && this.propertyDefinition.property == propertyName) {
            return this
        }

        if (!this.hasChildSurface()) {
            return null
        }

        for (var i = this.childInspector.editors.length-1; i >= 0; i--) {
            var editor = this.childInspector.editors[i],
                result = editor.findEditorByInspectorIdAndPropertyName(inspectorId, propertyName)

            if (result) {
                return result
            }
        }

        return null
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