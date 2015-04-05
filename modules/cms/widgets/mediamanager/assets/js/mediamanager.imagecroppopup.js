/*
 * Media manager image editor popup
 */
+function ($) { "use strict";

    if ($.oc.mediaManager === undefined)
        $.oc.mediaManager = {}

    var Base = $.oc.foundation.base,
        BaseProto = Base.prototype

    var MediaManagerImageCropPopup = function(path, options) {
        this.$popupRootElement = null

        this.options = $.extend({}, MediaManagerImageCropPopup.DEFAULTS, options)
        this.path = path

        Base.call(this)

        this.init()
        this.show()
    }

    MediaManagerImageCropPopup.prototype = Object.create(BaseProto)
    MediaManagerImageCropPopup.prototype.constructor = MediaManagerImageCropPopup

    MediaManagerImageCropPopup.prototype.dispose = function() {
        this.unregisterHandlers()

        this.$popupRootElement.remove()
        this.$popupRootElement = null
        this.$popupElement = null

        BaseProto.dispose.call(this)
    }

    MediaManagerImageCropPopup.prototype.init = function() {
        if (this.options.alias === undefined)
            throw new Error('Media Manager image crop popup option "alias" is not set.')

        this.$popupRootElement = $('<div/>')
        this.registerHandlers()
    }

    MediaManagerImageCropPopup.prototype.show = function() {
        var data = {
            path: this.path
        }

        this.$popupRootElement.popup({
            extraData: data,
            size: 'adaptive',
            adaptiveHeight: true,
            handler: this.options.alias + '::onLoadImageCropPopup'
        })
    }

    MediaManagerImageCropPopup.prototype.registerHandlers = function() {
        this.$popupRootElement.one('hide.oc.popup', this.proxy(this.onPopupHidden))
        this.$popupRootElement.one('shown.oc.popup', this.proxy(this.onPopupShown))
    }

    MediaManagerImageCropPopup.prototype.unregisterHandlers = function() {
    }

    MediaManagerImageCropPopup.prototype.hide = function() {
        if (this.$popupElement)
            this.$popupElement.trigger('close.oc.popup')
    }

    // EVENT HANDLERS
    // ============================

    MediaManagerImageCropPopup.prototype.onPopupHidden = function(event, element, popup) {
        // Release clickedElement reference inside redactor.js
        // If we don't do it, the image editor popup DOM elements 
        // won't be removed from the memory.
        $(document).trigger('mousedown')

        this.dispose()
    }

    MediaManagerImageCropPopup.prototype.onPopupShown = function(event, element, popup) {
        this.$popupElement = popup
    }

    MediaManagerImageCropPopup.DEFAULTS = {
        alias: undefined,
        onDone: undefined
    }

    $.oc.mediaManager.imageCropPopup = MediaManagerImageCropPopup
}(window.jQuery);