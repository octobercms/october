/*
 * External parameter editor for Inspector.
 *
 * The external parameter editor allows to use URL and 
 * other external parameters as values for the inspectable
 * properties.
 *
 */
+function ($) { "use strict";

    // NAMESPACES
    // ============================

    if ($.oc === undefined)
        $.oc = {}

    if ($.oc.inspector === undefined)
        $.oc.inspector = {}

    // CLASS DEFINITION
    // ============================

    var Base = $.oc.foundation.base,
        BaseProto = Base.prototype

    var ExternalParameterEditor = function(inspector, propertyDefinition, containerCell, initialValue) {
        this.inspector = inspector
        this.propertyDefinition = propertyDefinition
        this.containerCell = containerCell
        this.initialValue = initialValue

        Base.call(this)

        this.init()
    }

    ExternalParameterEditor.prototype = Object.create(BaseProto)
    ExternalParameterEditor.prototype.constructor = Base

    ExternalParameterEditor.prototype.dispose = function() {
        this.disposeControls()
        this.unregisterHandlers()

        this.inspector = null
        this.propertyDefinition = null
        this.containerCell = null
        this.initialValue = null

        BaseProto.dispose.call(this)
    }

    ExternalParameterEditor.prototype.init = function() {
        this.tooltipText = 'Click to enter the external parameter name to load the property value from'

        this.build()
        this.registerHandlers()
        this.setInitialValue()
    }

    /**
     * Builds the external parameter editor markup:
     *
     * <div class="external-param-editor-container">
     *     <input> <-- original property editing input/markup
     *     <div class="external-editor">               
     *         <div class="controls">                  
     *             <input type="text" tabindex="-1"/>  
     *             <a href="#" tabindex="-1">          
     *                 <i class="oc-icon-terminal"></i>
     *             </a>                                
     *         </div>                                  
     *     </div>
     * </div>
     */
    ExternalParameterEditor.prototype.build = function() {
        var container = document.createElement('div'),
            editor = document.createElement('div'),
            controls = document.createElement('div'),
            input = document.createElement('input'),
            link = document.createElement('a'),
            icon = document.createElement('i')

        container.setAttribute('class', 'external-param-editor-container')
        editor.setAttribute('class', 'external-editor')
        controls.setAttribute('class', 'controls')
        input.setAttribute('type', 'text')
        input.setAttribute('tabindex', '-1')

        link.setAttribute('href', '#')
        link.setAttribute('class', 'external-editor-link')
        link.setAttribute('tabindex', '-1')
        link.setAttribute('title', this.tooltipText)
        $(link).tooltip({'container': 'body', delay: 500})

        icon.setAttribute('class', 'oc-icon-terminal')

        link.appendChild(icon)
        controls.appendChild(input)
        controls.appendChild(link)
        editor.appendChild(controls)

        while (this.containerCell.firstChild) {
            var child = this.containerCell.firstChild

            container.appendChild(child)
        }

        container.appendChild(editor)
        this.containerCell.appendChild(container)
    }

    ExternalParameterEditor.prototype.setInitialValue = function() {
        if (!this.initialValue) {
            return
        }

        if (typeof this.initialValue !== 'string') {
            return
        }

        var matches = []
        if (matches = this.initialValue.match(/^\{\{([^\}]+)\}\}$/)) {
            var value = $.trim(matches[1])

            if (value.length > 0) {
                this.showEditor(true)
                this.getInput().value = value
                this.inspector.setPropertyValue(this.propertyDefinition.property, null, true, true)
            }
        }
    }

    ExternalParameterEditor.prototype.showEditor = function(building) {
        var editor = this.getEditor(),
            input = this.getInput(),
            container = this.getContainer(),
            link = this.getLink()

        var position = $(editor).position()

        if (!building) {
            editor.style.right = 0
            editor.style.left = position.left + 'px'
        }
        else {
            editor.style.right = 0
        }

        setTimeout(this.proxy(this.repositionEditor), 0)

        $.oc.foundation.element.addClass(container, 'editor-visible')
        link.setAttribute('data-original-title', 'Click to enter the property value')

        this.toggleEditorVisibility(false)
        input.setAttribute('tabindex', 0)

        if (!building) {
            input.focus()
        }
    }

    ExternalParameterEditor.prototype.repositionEditor = function() {
        this.getEditor().style.left = 0
        this.containerCell.scrollTop = 0
    }

    ExternalParameterEditor.prototype.hideEditor = function() {
        var editor = this.getEditor(),
            container = this.getContainer()

        editor.style.left = 'auto'
        editor.style.right = '30px'

        $.oc.foundation.element.removeClass(container, 'editor-visible')
        $.oc.foundation.element.removeClass(this.containerCell, 'active')

        var propertyEditor = this.inspector.findPropertyEditor(this.propertyDefinition.property)

        if (propertyEditor) {
            propertyEditor.onExternalPropertyEditorHidden()
        }
    }

    ExternalParameterEditor.prototype.toggleEditor = function(ev) {
        $.oc.foundation.event.stop(ev)

        var link = this.getLink(),
            container = this.getContainer(),
            editor = this.getEditor()

        $(link).tooltip('hide')

        if (!this.isEditorVisible()) {
            this.showEditor()
            return
        }

        var left = container.offsetWidth

        editor.style.left = left + 'px'
        link.setAttribute('data-original-title', this.tooltipText)
        this.getInput().setAttribute('tabindex', '-1')

        this.toggleEditorVisibility(true)

        setTimeout(this.proxy(this.hideEditor), 200)
    }

    ExternalParameterEditor.prototype.toggleEditorVisibility = function(show) {
        var container = this.getContainer(),
            children = container.children,
            height = 19 

        // Fixed value instead of trying to get the container cell height.
        // If the editor is contained in initially hidden editor (collapsed group),
        // the container cell will be unknown.

        if (!show) {
            /*
            height = this.containerCell.getAttribute('data-inspector-cell-height')

            if (!height) {
                height = $(this.containerCell).height()
                this.containerCell.setAttribute('data-inspector-cell-height', height)
            }
            */
        }

        for (var i = 0, len = children.length; i < len; i++) {
            var element = children[i]

            if ($.oc.foundation.element.hasClass(element, 'external-editor')) {
                continue
            }

            if (show) {
                $.oc.foundation.element.removeClass(element, 'hide')
            }
            else {
                container.style.height = height + 'px'
                $.oc.foundation.element.addClass(element, 'hide')
            }
        }
    }

    ExternalParameterEditor.prototype.focus = function() {
        this.getInput().focus()
    }

    ExternalParameterEditor.prototype.validate = function(silentMode) {
        var value = $.trim(this.getValue())

        if (value.length === 0) {
            if (!silentMode) {
                $.oc.flashMsg({text: 'Please enter the external parameter name.', 'class': 'error', 'interval': 5})
                this.focus()
            }

            return false
        }

        return true
    }

    //
    // Event handlers
    //

    ExternalParameterEditor.prototype.registerHandlers = function() {
        var input = this.getInput()

        this.getLink().addEventListener('click', this.proxy(this.toggleEditor))
        input.addEventListener('focus', this.proxy(this.onInputFocus))
        input.addEventListener('change', this.proxy(this.onInputChange))
    }

    ExternalParameterEditor.prototype.onInputFocus = function() {
        this.inspector.makeCellActive(this.containerCell)
    }

    ExternalParameterEditor.prototype.onInputChange = function() {
        this.inspector.markPropertyChanged(this.propertyDefinition.property, true)
    }

    //
    // Disposing
    //

    ExternalParameterEditor.prototype.unregisterHandlers = function() {
        var input = this.getInput()

        this.getLink().removeEventListener('click', this.proxy(this.toggleEditor))
        input.removeEventListener('focus', this.proxy(this.onInputFocus))
        input.removeEventListener('change', this.proxy(this.onInputChange))
    }

    ExternalParameterEditor.prototype.disposeControls = function() {
        $(this.getLink()).tooltip('destroy')
    }

    //
    // Helpers
    //

    ExternalParameterEditor.prototype.getInput = function() {
        return this.containerCell.querySelector('div.external-editor input')
    }

    ExternalParameterEditor.prototype.getValue = function() {
        return this.getInput().value
    }

    ExternalParameterEditor.prototype.getLink = function() {
        return this.containerCell.querySelector('a.external-editor-link')
    }

    ExternalParameterEditor.prototype.getContainer = function() {
        return this.containerCell.querySelector('div.external-param-editor-container')
    }

    ExternalParameterEditor.prototype.getEditor = function() {
        return this.containerCell.querySelector('div.external-editor')
    }

    ExternalParameterEditor.prototype.getPropertyName = function() {
        return this.propertyDefinition.property
    }

    ExternalParameterEditor.prototype.isEditorVisible = function() {
        return $.oc.foundation.element.hasClass(this.getContainer(), 'editor-visible')
    }

    $.oc.inspector.externalParameterEditor = ExternalParameterEditor
}(window.jQuery);