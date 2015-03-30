/*
 * Media manager popup
 *
 */
+function ($) { "use strict";

    var Base = $.oc.foundation.base,
        BaseProto = Base.prototype

    var MediaManagerPopup = function(options) {
        this.options = $.extend({}, MediaManagerPopup.DEFAULTS, options)

        Base.call(this)

        this.show()
    }

    MediaManagerPopup.prototype = Object.create(BaseProto)
    MediaManagerPopup.prototype.constructor = MediaManagerPopup

    MediaManagerPopup.prototype.show = function() {
        var $popupRootElement = $('<div/>')

        if (this.options.alias === undefined)
            throw new Error('Media Manager popup option "alias" is not set.')

        $popupRootElement.popup({
            size: 'adaptive',
            adaptiveHeight: true,
            handler: this.options.alias + '::onLoadPopup'
        })
    }

    MediaManagerPopup.DEFAULTS = {
        alias: undefined
    }

    $.oc.mediaManager.popup = MediaManagerPopup
}(window.jQuery);