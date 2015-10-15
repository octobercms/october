/*
 * Inspector container wrapper.
 */
+function ($) { "use strict";

    // CLASS DEFINITION
    // ============================

    var Base = $.oc.inspector.wrappers.base,
        BaseProto = Base.prototype

    var InspectorContainer = function($element, surface, options) {
        if (!options.container) {
            throw new Error('Cannot create Inspector container wrapper without a container element.')
        }

        this.surfaceContainer = null

        Base.call(this, $element, surface, options)
    }

    InspectorContainer.prototype = Object.create(BaseProto)
    InspectorContainer.prototype.constructor = Base

    InspectorContainer.prototype.init = function() {
        this.registerHandlers()

        BaseProto.init.call(this)
    }

    InspectorContainer.prototype.dispose = function() {
        this.unregisterHandlers()
        this.removeControls()

        this.surfaceContainer = null

        BaseProto.dispose.call(this)
    }

    InspectorContainer.prototype.createSurfaceAndUi = function(properties, values) {
        this.buildUi()

        this.initSurface(this.surfaceContainer, properties, values)
    }

    InspectorContainer.prototype.adoptSurface = function() {
        this.buildUi()

        this.surface.moveToContainer(this.surfaceContainer)
    }

    InspectorContainer.prototype.buildUi = function() {
        var scrollable = this.isScrollable(),
            head = this.buildHead(),
            layoutElements = this.buildLayout()

        layoutElements.headContainer.appendChild(head)

        if (scrollable) {
            var scrollpad = this.buildScrollpad()

            this.surfaceContainer = scrollpad.container
            layoutElements.bodyContainer.appendChild(scrollpad.scrollpad)

            $(scrollpad.scrollpad).scrollpad()
        }
        else {
            this.surfaceContainer = layoutElements.bodyContainer
        }

        this.setInspectorVisibleFlag(true)
    }

    InspectorContainer.prototype.buildHead = function() {
        var container = document.createElement('div'),
            header = document.createElement('h3'),
            paragraph = document.createElement('p'),
            detachButton = document.createElement('span'),
            closeButton = document.createElement('span')

        container.setAttribute('class', 'inspector-header')
        detachButton.setAttribute('class', 'oc-icon-external-link-square detach')
        closeButton.setAttribute('class', 'close')

        header.textContent = this.title
        paragraph.textContent = this.description
        closeButton.innerHTML = '&times;';

        container.appendChild(header)
        container.appendChild(paragraph)
        container.appendChild(detachButton)
        container.appendChild(closeButton)

        return container
    }

    InspectorContainer.prototype.buildScrollpad = function() {
        var scrollpad = document.createElement('div'),
            scrollWrapper = document.createElement('div'),
            scrollableContainer = document.createElement('div')

        scrollpad.setAttribute('class', 'control-scrollpad')
        scrollpad.setAttribute('data-control', 'scrollpad')
        scrollWrapper.setAttribute('class', 'scroll-wrapper inspector-wrapper')

        scrollpad.appendChild(scrollWrapper)
        scrollWrapper.appendChild(scrollableContainer)

        return {
            scrollpad: scrollpad,
            container: scrollableContainer
        }
    }

    InspectorContainer.prototype.buildLayout = function() {
        var layout = document.createElement('div'),
            headRow = document.createElement('div'),
            bodyRow = document.createElement('div'),
            bodyCell = document.createElement('div'),
            layoutRelative = document.createElement('div')

        layout.setAttribute('class', 'layout')
        headRow.setAttribute('class', 'layout-row min-size')
        bodyRow.setAttribute('class', 'layout-row')
        bodyCell.setAttribute('class', 'layout-cell')
        layoutRelative.setAttribute('class', 'layout-relative')

        bodyCell.appendChild(layoutRelative)
        bodyRow.appendChild(bodyCell)

        layout.appendChild(headRow)
        layout.appendChild(bodyRow)

        this.options.container.get(0).appendChild(layout)

        $.oc.foundation.controlUtils.markDisposable(layout)
        this.registerLayoutHandlers(layout)
  
        return {
            headContainer: headRow,
            bodyContainer: layoutRelative
        }
    }

    InspectorContainer.prototype.validateAndApply = function() {
        if (!this.surface.validate()) {
            return false
        }

        this.applyValues()
        return true
    }

    InspectorContainer.prototype.isScrollable = function() {
        return this.options.container.data('inspector-scrollable') !== undefined
    }

    InspectorContainer.prototype.getLayout = function() {
        return this.options.container.get(0).querySelector('div.layout')
    }

    InspectorContainer.prototype.registerLayoutHandlers = function(layout) {
        var $layout = $(layout)

        $layout.one('dispose-control', this.proxy(this.dispose))
        $layout.on('click', 'span.close', this.proxy(this.onClose))
        $layout.on('click', 'span.detach', this.proxy(this.onDetach))
    }

    InspectorContainer.prototype.registerHandlers = function() {
        this.options.container.on('apply.oc.inspector', this.proxy(this.onApplyValues))
        this.options.container.on('beforeContainerHide.oc.inspector', this.proxy(this.onBeforeHide))
    }

    InspectorContainer.prototype.unregisterHandlers = function() {
        var $layout = $(this.getLayout())

        this.options.container.off('apply.oc.inspector', this.proxy(this.onApplyValues))
        this.options.container.off('beforeContainerHide.oc.inspector', this.proxy(this.onBeforeHide))

        $layout.off('dispose-control', this.proxy(this.dispose))
        $layout.off('click', 'span.close', this.proxy(this.onClose))
        $layout.off('click', 'span.detach', this.proxy(this.onDetach))
    }

    InspectorContainer.prototype.removeControls = function() {
        if (this.isScrollable()) {
            this.options.container.find('.control-scrollpad').scrollpad('dispose')
        }

        var layout = this.getLayout()
        layout.parentNode.removeChild(layout)
    }

    InspectorContainer.prototype.onApplyValues = function(ev) {
        if (!this.validateAndApply()) {
            ev.preventDefault()
            return false
        }
    }

    InspectorContainer.prototype.onBeforeHide = function(ev) {
        if (!this.triggerHiding()) {
            ev.preventDefault()
            return false
        }
    }

    InspectorContainer.prototype.onClose = function(ev) {
        if (!this.validateAndApply()) {
            ev.preventDefault()
            return false
        }

        if (!this.triggerHiding()) {
            ev.preventDefault()
            return false
        }

        this.surface.dispose()

        this.dispose()
    }

    InspectorContainer.prototype.onDetach = function() {
        $.oc.inspector.manager.switchToPopup(this)
    }

    $.oc.inspector.wrappers.container = InspectorContainer
}(window.jQuery);