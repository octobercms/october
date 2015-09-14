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

    $.oc.inspector.propertyEditors.base = BaseEditor
}(window.jQuery);