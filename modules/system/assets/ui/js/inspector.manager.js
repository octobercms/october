/*
 * Inspector management functions.
 *
 * Watches inspectable elements clicks and creates Inspector surfaces in popups
 * and containers.
 */
+function ($) { "use strict";
    var Base = $.oc.foundation.base,
        BaseProto = Base.prototype

    var InspectorManager = function() {
        Base.call(this)

        this.init()
    }

    InspectorManager.prototype = Object.create(BaseProto)
    InspectorManager.prototype.constructor = Base

    InspectorManager.prototype.init = function() {
        $(document).on('click', '[data-inspectable]', this.proxy(this.onInspectableClicked))
    }

    InspectorManager.prototype.getContainerElement = function($element) {
        var $containerHolder = $element.closest('[data-inspector-container]')
        if ($containerHolder.length === 0) {
            return null
        }

        var $container = $containerHolder.find($containerHolder.data('inspector-container'))
        if ($container.length === 0) {
            throw new Error('Inspector container ' + $containerHolder.data['inspector-container'] + ' element is not found.')
        }

        return $container
    }

    InspectorManager.prototype.createInspectorPopup = function($element, containerSupported) {
        new $.oc.inspector.wrappers.popup($element, null, {
            containerSupported: containerSupported
        })
    }

    InspectorManager.prototype.createInspectorContainer = function($element, $container) {
        new $.oc.inspector.wrappers.container($element, null, {
            containerSupported: true,
            container: $container
        })
    }

    InspectorManager.prototype.switchToPopup = function(wrapper) {
        new $.oc.inspector.wrappers.popup(wrapper.$element, wrapper, {
            containerSupported: true
        })

        wrapper.cleanupAfterSwitch()
        this.setContainerPreference(false)
    }

    InspectorManager.prototype.switchToContainer = function(wrapper) {
        var $container = this.getContainerElement(wrapper.$element)

        if (!$container) {
            throw new Error('Cannot switch to container: a container element is not found')
        }

        new $.oc.inspector.wrappers.container(wrapper.$element, wrapper, {
            containerSupported: true,
            container: $container
        })

        wrapper.cleanupAfterSwitch()
        this.setContainerPreference(true)
    }

    InspectorManager.prototype.createInspector = function($element) {
        var $container = this.getContainerElement($element)

        // If there's no container option, create the Inspector popup
        //
        if (!$container) {
            this.createInspectorPopup($element, false)
        } 
        else {
            // If the container is already in use, apply values to the inspectable elements
            if (!this.applyValuesFromContainer($container) || !this.containerHidingAllowed($container)) {
                return
            }

            // Dispose existing container wrapper, if any
            $.oc.foundation.controlUtils.disposeControls($container.get(0))
            
            if (!this.getContainerPreference()) {
                // If container is not a preferred option, create Inspector popoup
                this.createInspectorPopup($element, true)
            }
            else {
                // Otherwise, create Inspector in the container
                this.createInspectorContainer($element, $container)
            }
        }
    }

    InspectorManager.prototype.getContainerPreference = function() {
        if (!Modernizr.localstorage) {
            return false
        }

        return localStorage.getItem('oc.inspectorUseContainer') === "true"
    }

    InspectorManager.prototype.setContainerPreference = function(value) {
        if (!Modernizr.localstorage) {
            return
        }

        return localStorage.setItem('oc.inspectorUseContainer', value ? "true" : "false")
    }

    InspectorManager.prototype.applyValuesFromContainer = function($container) {
        var applyEvent = $.Event('apply.oc.inspector')

        $container.trigger(applyEvent)
        if (applyEvent.isDefaultPrevented()) {
            return false
        }

        return true
    }

    InspectorManager.prototype.containerHidingAllowed = function($container) {
        var allowedEvent = $.Event('beforeContainerHide.oc.inspector')

        $container.trigger(allowedEvent)
        if (allowedEvent.isDefaultPrevented()) {
            return false
        }

        return true
    }

    InspectorManager.prototype.onInspectableClicked = function(ev) {
        var $element = $(ev.currentTarget)

        if ($element.data('oc.inspectorVisible'))
            return false

        this.createInspector($element)
    }

    $.oc.inspector.manager = new InspectorManager()
}(window.jQuery);