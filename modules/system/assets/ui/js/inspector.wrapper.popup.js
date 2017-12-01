/*
 * Inspector popup wrapper.
 */
+function ($) { "use strict";

    // CLASS DEFINITION
    // ============================

    var Base = $.oc.inspector.wrappers.base,
        BaseProto = Base.prototype

    var InspectorPopup = function($element, surface, options) {
        this.$popoverContainer = null
        this.popoverObj = null
        this.cleaningUp = false

        Base.call(this, $element, surface, options)
    }

    InspectorPopup.prototype = Object.create(BaseProto)
    InspectorPopup.prototype.constructor = Base

    InspectorPopup.prototype.dispose = function() {
        this.unregisterHandlers()

        this.$popoverContainer = null
        this.popoverObj = null

        BaseProto.dispose.call(this)
    }

    InspectorPopup.prototype.createSurfaceAndUi = function(properties, values, title, description) {
        this.showPopover()

        this.initSurface(this.$popoverContainer.find('[data-surface-container]').get(0), properties, values)
        this.repositionPopover()

        this.registerPopupHandlers()
    }

    InspectorPopup.prototype.adoptSurface = function() {
        this.showPopover()

        this.surface.moveToContainer(this.$popoverContainer.find('[data-surface-container]').get(0))
        this.repositionPopover()

        this.registerPopupHandlers()

        BaseProto.adoptSurface.call(this)
    }

    InspectorPopup.prototype.cleanupAfterSwitch = function() {
        this.cleaningUp = true
        this.switched = true

        this.forceClose()

        // The parent cleanupAfterSwitch() is not called because
        // disposing happens in onHide() triggered by forceClose()
    }

    InspectorPopup.prototype.getPopoverContents = function() {
        return '<div class="popover-head">                          \
                    <h3 data-inspector-title></h3>                  \
                    <p data-inspector-description></p>              \
                    <button type="button" class="close"             \
                        data-dismiss="popover"                      \
                        aria-hidden="true">&times;</button>         \
                </div>                                              \
                <form autocomplete="off" onsubmit="return false">   \
                    <div data-surface-container></div>              \
                <form>'
    }

    InspectorPopup.prototype.showPopover = function() {
        var offset = this.$element.data('inspector-offset'),
            offsetX = this.$element.data('inspector-offset-x'),
            offsetY = this.$element.data('inspector-offset-y'),
            placement = this.$element.data('inspector-placement'),
            fallbackPlacement = this.$element.data('inspector-fallback-placement') 

        if (offset === undefined) {
            offset = 15
        }

        if (placement === undefined) {
            placement = 'bottom'
        }

        if (fallbackPlacement === undefined) {
            fallbackPlacement = 'bottom'
        }

        this.$element.ocPopover({
            content: this.getPopoverContents(),
            highlightModalTarget: true,
            modal: true,
            placement: placement,
            fallbackPlacement: fallbackPlacement,
            containerClass: 'control-inspector',
            container:  this.$element.data('inspector-container'),
            offset: offset,
            offsetX: offsetX,
            offsetY: offsetY,
            width: 400
        })

        this.setInspectorVisibleFlag(true)

        this.popoverObj = this.$element.data('oc.popover')
        this.$popoverContainer = this.popoverObj.$container

        this.$popoverContainer.addClass('inspector-temporary-placement')

        if (this.options.inspectorCssClass !== undefined) {
            this.$popoverContainer.addClass(this.options.inspectorCssClass)
        }

        if (this.options.containerSupported) {
            var moveToContainerButton = $('<span class="inspector-move-to-container oc-icon-download">')

            this.$popoverContainer.find('.popover-head').append(moveToContainerButton)
        }

        this.$popoverContainer.find('[data-inspector-title]').text(this.title)
        this.$popoverContainer.find('[data-inspector-description]').text(this.description)
    }

    InspectorPopup.prototype.repositionPopover = function() {
        this.popoverObj.reposition()
        this.$popoverContainer.removeClass('inspector-temporary-placement')
        this.$popoverContainer.find('div[data-surface-container] > div').trigger('focus-control')
    }

    InspectorPopup.prototype.forceClose = function() {
        this.$popoverContainer.trigger('close.oc.popover')
    }

    InspectorPopup.prototype.registerPopupHandlers = function() {
        this.surface.options.onPopupDisplayed = this.proxy(this.onPopupEditorDisplayed)
        this.surface.options.onPopupHidden = this.proxy(this.onPopupEditorHidden)
        this.popoverObj.options.onCheckDocumentClickTarget = this.proxy(this.onCheckDocumentClickTarget)

        this.$element.on('hiding.oc.popover', this.proxy(this.onBeforeHide))
        this.$element.on('hide.oc.popover', this.proxy(this.onHide))
        this.$popoverContainer.on('keydown', this.proxy(this.onPopoverKeyDown))

        if (this.options.containerSupported) {
            this.$popoverContainer.on('click', 'span.inspector-move-to-container', this.proxy(this.onMoveToContainer))
        }
    }

    InspectorPopup.prototype.unregisterHandlers = function() {
        this.popoverObj.options.onCheckDocumentClickTarget = null

        this.$element.off('hiding.oc.popover', this.proxy(this.onBeforeHide))
        this.$element.off('hide.oc.popover', this.proxy(this.onHide))
        this.$popoverContainer.off('keydown', this.proxy(this.onPopoverKeyDown))

        if (this.options.containerSupported) {
            this.$popoverContainer.off('click', 'span.inspector-move-to-container', this.proxy(this.onMoveToContainer))
        }

        this.surface.options.onPopupDisplayed = null
        this.surface.options.onPopupHidden = null
    }

    InspectorPopup.prototype.onBeforeHide = function(ev) {
        if (this.cleaningUp) {
            return
        }

        if (!this.surface.validate()) {
            ev.preventDefault()
            return false
        }

        if (!this.triggerHiding()) {
            ev.preventDefault()
            return false
        }

        this.applyValues()
    }

    InspectorPopup.prototype.onHide = function(ev) {
        this.dispose()
    }

    InspectorPopup.prototype.onPopoverKeyDown = function(ev) {
        if(ev.keyCode == 13) {
            $(ev.currentTarget).trigger('close.oc.popover')
        }
    }

    InspectorPopup.prototype.onPopupEditorDisplayed = function() {
        this.popoverObj.options.closeOnPageClick = false
        this.popoverObj.options.closeOnEsc = false
    }

    InspectorPopup.prototype.onPopupEditorHidden = function() {
        this.popoverObj.options.closeOnPageClick = true
        this.popoverObj.options.closeOnEsc = true
    }

    InspectorPopup.prototype.onCheckDocumentClickTarget = function(element) {
        if ($.contains(this.$element, element) || this.$element.get(0) === element) {
            return true
        }
    }

    InspectorPopup.prototype.onMoveToContainer = function() {
        $.oc.inspector.manager.switchToContainer(this)
    }

    $.oc.inspector.wrappers.popup = InspectorPopup
}(window.jQuery);