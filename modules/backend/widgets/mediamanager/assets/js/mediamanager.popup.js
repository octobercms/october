/*
 * Media manager popup
 */
+function ($) { "use strict";

    if ($.oc.mediaManager === undefined)
        $.oc.mediaManager = {}

    var Base = $.oc.foundation.base,
        BaseProto = Base.prototype

    var MediaManagerPopup = function(options) {
        this.$popupRootElement = null

        this.options = $.extend({}, MediaManagerPopup.DEFAULTS, options)

        Base.call(this)

        this.init()
        this.show()
    }

    MediaManagerPopup.prototype = Object.create(BaseProto)
    MediaManagerPopup.prototype.constructor = MediaManagerPopup

    MediaManagerPopup.prototype.dispose = function() {
        this.unregisterHandlers()

        this.$popupRootElement.remove()
        this.$popupRootElement = null
        this.$popupElement = null

        BaseProto.dispose.call(this)
    }

    MediaManagerPopup.prototype.init = function() {
        if (this.options.alias === undefined)
            throw new Error('Media Manager popup option "alias" is not set.')

        this.$popupRootElement = $('<div/>')
        this.registerHandlers()
    }

    MediaManagerPopup.prototype.registerHandlers = function() {
        this.$popupRootElement.one('hide.oc.popup', this.proxy(this.onPopupHidden))
        this.$popupRootElement.one('shown.oc.popup', this.proxy(this.onPopupShown))
    }

    MediaManagerPopup.prototype.unregisterHandlers = function() {
        this.$popupElement.off('popupcommand', this.proxy(this.onPopupCommand))
        this.$popupRootElement.off('popupcommand', this.proxy(this.onPopupCommand))
    }

    MediaManagerPopup.prototype.show = function() {
        var data = {
            bottomToolbar: this.options.bottomToolbar ? 1 : 0,
            cropAndInsertButton: this.options.cropAndInsertButton ? 1 : 0
        }

        this.$popupRootElement.popup({
            extraData: data,
            size: 'adaptive',
            adaptiveHeight: true,
            handler: this.options.alias + '::onLoadPopup'
        })
    }

    MediaManagerPopup.prototype.hide = function() {
        if (this.$popupElement)
            this.$popupElement.trigger('close.oc.popup')
    }

    MediaManagerPopup.prototype.getMediaManagerElement = function() {
        return this.$popupElement.find('[data-control="media-manager"]')
    }

    MediaManagerPopup.prototype.insertMedia = function() {
        var items = this.getMediaManagerElement().mediaManager('getSelectedItems')

        if (this.options.onInsert !== undefined)
            this.options.onInsert.call(this, items)
    }

    MediaManagerPopup.prototype.insertCroppedImage = function(imageItem) {
        if (this.options.onInsert !== undefined)
            this.options.onInsert.call(this, [imageItem])
    }

    // EVENT HANDLERS
    // ============================

    MediaManagerPopup.prototype.onPopupHidden = function(event, element, popup) {
        var mediaManager = this.getMediaManagerElement()

        mediaManager.mediaManager('dispose')
        mediaManager.remove()

        // Release clickedElement reference inside redactor.js
        // If we don't do it, the Media Manager popup DOM elements 
        // won't be removed from the memory.
        $(document).trigger('mousedown')

        this.dispose()

        if (this.options.onClose !== undefined)
            this.options.onClose.call(this)
    }

    MediaManagerPopup.prototype.onPopupShown = function(event, element, popup) {
        this.$popupElement = popup
        this.$popupElement.on('popupcommand', this.proxy(this.onPopupCommand))

        // Unfocus the Redactor field, otherwise all keyboard commands
        // in the Media Manager popup translate to Redactor.
        this.getMediaManagerElement().mediaManager('selectFirstItem')
    }

    MediaManagerPopup.prototype.onPopupCommand = function(ev, command, param) {
        switch (command) {
            case 'insert' : 
                this.insertMedia()
            break;
            case 'insert-cropped' : 
                this.insertCroppedImage(param)
            break;
        }

        return false
    }

    MediaManagerPopup.DEFAULTS = {
        alias: undefined,
        bottomToolbar: true,
        cropAndInsertButton: false,
        onInsert: undefined,
        onClose: undefined
    }

    $.oc.mediaManager.popup = MediaManagerPopup
}(window.jQuery);