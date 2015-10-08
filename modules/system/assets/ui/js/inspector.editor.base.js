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
        this.validators = []

        Base.call(this)

        this.init()
    }

    BaseEditor.prototype = Object.create(BaseProto)
    BaseEditor.prototype.constructor = Base

    BaseEditor.prototype.dispose = function() {
        this.disposeValidators()

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
        this.validators = null

        BaseProto.dispose.call(this)
    }

    BaseEditor.prototype.init = function() {
        this.build()
        this.registerHandlers()
        this.createValidators()
    }

    BaseEditor.prototype.build = function() {
        return null
    }

    BaseEditor.prototype.registerHandlers = function() {
    }

    BaseEditor.prototype.onInspectorPropertyChanged = function(property, value) {
    }

    BaseEditor.prototype.focus = function() {
    }

    BaseEditor.prototype.hasChildSurface = function() {
        return this.childInspector !== null
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

    BaseEditor.prototype.throwError = function(errorMessage) {
        throw new Error(errorMessage + ' Property: ' + this.propertyDefinition.property)
    }

    //
    // Validation
    //

    BaseEditor.prototype.createValidators = function() {
        // Handle legacy validation syntax properties:
        //
        // - required
        // - validationPattern
        // - validationMessage 

        if ((this.propertyDefinition.required !== undefined ||
            this.propertyDefinition.validationPattern !== undefined ||
            this.propertyDefinition.validationMessage !== undefined) && 
            this.propertyDefinition.validation !== undefined) {
            this.throwError('Legacy and new validation syntax should not be mixed.')
        }

        if (this.propertyDefinition.required !== undefined) {
            var validator = new $.oc.inspector.validators.required({
                message: this.propertyDefinition.validationMessage
            })

            this.validators.push(validator)
        }

        if (this.propertyDefinition.validationPattern !== undefined) {
            var validator = new $.oc.inspector.validators.regex({
                message: this.propertyDefinition.validationMessage,
                pattern: this.propertyDefinition.validationPattern
            })

            this.validators.push(validator)
        }

        //
        // Handle new validation syntax
        //

        if (this.propertyDefinition.validation === undefined) {
            return
        }

        for (var validatorName in this.propertyDefinition.validation) {
            if ($.oc.inspector.validators[validatorName] == undefined) {
                this.throwError('Inspector validator "' + validatorName + '" is not found in the $.oc.inspector.validators namespace.')
            }

            var validator = new $.oc.inspector.validators[validatorName](
                    this.propertyDefinition.validation[validatorName]
                )

            this.validators.push(validator)
        }
    }

    BaseEditor.prototype.disposeValidators = function() {
        for (var i = 0, len = this.validators.length; i < len; i++) {
            this.validators[i].dispose()
        }
    }

    BaseEditor.prototype.validate = function() {
        for (var i = 0, len = this.validators.length; i < len; i++) {
            var validator = this.validators[i],
                value = this.inspector.getPropertyValue(this.propertyDefinition.property)

            if (value === undefined) {
                value = this.getUndefinedValue()
            }

            if (!validator.isValid(value)) {
                $.oc.flashMsg({text: validator.getMessage(), 'class': 'error', 'interval': 5})
                return false
            }
        }

        return true
    }

    BaseEditor.prototype.markInvalid = function() {
        $.oc.foundation.element.addClass(this.containerRow, 'invalid')
        this.inspector.getGroupManager().markGroupRowInvalid(this.parentGroup, this.inspector.getRootTable())

        this.inspector.getRootSurface().expandGroupParents(this.parentGroup)
        this.focus()
    }

    //
    // External editor
    //

    BaseEditor.prototype.supportsExternalParameterEditor = function() {
        return true
    }

    BaseEditor.prototype.onExternalPropertyEditorHidden = function() {
    }

    //
    // Grouping
    //

    BaseEditor.prototype.isGroupedEditor = function() {
        return false
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

    $.oc.inspector.propertyEditors.base = BaseEditor
}(window.jQuery);