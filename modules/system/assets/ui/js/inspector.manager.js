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

    InspectorManager.prototype.loadElementOptions = function($element) {
        var options = {}

        // Only specific options are allowed, don't load all options with data()
        //
        if ($element.data('inspector-css-class')) {
            options.inspectorCssClass = $element.data('inspector-css-class')
        }

        return options
    }

    InspectorManager.prototype.createInspectorPopup = function($element, containerSupported) {
        var options = $.extend(this.loadElementOptions($element), {
                containerSupported: containerSupported
            })

        new $.oc.inspector.wrappers.popup($element, null, options)
    }

    InspectorManager.prototype.createInspectorContainer = function($element, $container) {
        var options = $.extend(this.loadElementOptions($element), {
                containerSupported: true,
                container: $container
            })

        new $.oc.inspector.wrappers.container($element, null, options)
    }

    InspectorManager.prototype.switchToPopup = function(wrapper) {
        var options = $.extend(this.loadElementOptions(wrapper.$element), {
                containerSupported: true
            })

        new $.oc.inspector.wrappers.popup(wrapper.$element, wrapper, options)

        wrapper.cleanupAfterSwitch()
        this.setContainerPreference(false)
    }

    InspectorManager.prototype.switchToContainer = function(wrapper) {
        var $container = this.getContainerElement(wrapper.$element),
            options = $.extend(this.loadElementOptions(wrapper.$element), {
                containerSupported: true,
                container: $container
            })

        if (!$container) {
            throw new Error('Cannot switch to container: a container element is not found')
        }

        new $.oc.inspector.wrappers.container(wrapper.$element, wrapper, options)

        wrapper.cleanupAfterSwitch()
        this.setContainerPreference(true)
    }

    InspectorManager.prototype.createInspector = function(element) {
        var $element = $(element)

        if ($element.data('oc.inspectorVisible')) {
            return false
        }

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
        return !applyEvent.isDefaultPrevented();
    }

    InspectorManager.prototype.containerHidingAllowed = function($container) {
        var allowedEvent = $.Event('beforeContainerHide.oc.inspector')

        $container.trigger(allowedEvent)
        return !allowedEvent.isDefaultPrevented();
    }

    InspectorManager.prototype.onInspectableClicked = function(ev) {
        var $element = $(ev.currentTarget)

        if (this.createInspector($element) === false) {
            return false
        }
    }

    $.oc.inspector.manager = new InspectorManager()

    $.fn.inspector = function () {
        return this.each(function () {
            $.oc.inspector.manager.createInspector(this)
        })
    }
}(window.jQuery);