/*
 * Flyout plugin.
 */
+function ($) { "use strict";

    var Base = $.oc.foundation.base,
        BaseProto = Base.prototype

    // SCROLLPAD CLASS DEFINITION
    // ============================

    var Flyout = function(element, options) {
        this.$el = $(element)
        this.$overlay = null
        this.options = options

        Base.call(this)

        this.init()
    }

    Flyout.prototype = Object.create(BaseProto)
    Flyout.prototype.constructor = Flyout

    Flyout.prototype.dispose = function() {
        this.removeOverlay()
        this.$el.removeData('oc.flyout')
        this.$el = null

        if (this.options.flyoutToggle) {
            this.removeToggle()
        }

        BaseProto.dispose.call(this)
    }

    Flyout.prototype.show = function() {
        var $cells = this.$el.find('> .layout-cell'),
            $flyout = this.$el.find('> .flyout')

        this.removeOverlay()

        for (var i = 0; i < $cells.length; i++) {
            var $cell = $($cells[i]),
                width = $cell.width()

            $cell.css('width', width)
        }

        this.createOverlay()

        window.setTimeout(this.proxy(this.setBodyClass), 1)
        $flyout.css('width', this.options.flyoutWidth)

        this.hideToggle()
    }

    Flyout.prototype.hide = function() {
        var $cells = this.$el.find('> .layout-cell'),
            $flyout = this.$el.find('> .flyout')

        for (var i = 0; i < $cells.length; i++) {
            var $cell = $($cells[i])

            $cell.css('width', '')
        }

        $flyout.css('width', 0)

        window.setTimeout(this.proxy(this.removeBodyClass), 1)
        window.setTimeout(this.proxy(this.removeOverlayAndShowToggle), 300)
    }

    // FLYOUT INTERNAL METHODS
    // ============================

    Flyout.prototype.init = function() {
        this.build()
    }

    Flyout.prototype.build = function() {
        if (this.options.flyoutToggle) {
            this.buildToggle()
        }
    }

    Flyout.prototype.buildToggle = function() {
        var $toggleContainer = $(this.options.flyoutToggle),
            $toggle = $('<div class="flyout-toggle"><i class="icon-chevron-right"></i></div>')

        $toggle.on('click', this.proxy(this.show))
        $toggleContainer.append($toggle)
    }

    Flyout.prototype.removeToggle = function() {
        var $toggle = this.getToggle()

        $toggle.off('click', this.proxy(this.show))
        $toggle.remove()
    }

    Flyout.prototype.hideToggle = function() {
        if (!this.options.flyoutToggle) {
            return
        }

        this.getToggle().hide()
    }

    Flyout.prototype.showToggle = function() {
        if (!this.options.flyoutToggle) {
            return
        }

        this.getToggle().show()
    }

    Flyout.prototype.getToggle = function() {
        var $toggleContainer = $(this.options.flyoutToggle)

        return $toggleContainer.find('.flyout-toggle')
    }

    Flyout.prototype.setBodyClass = function() {
        $(document.body).addClass('flyout-visible')
    }

    Flyout.prototype.removeBodyClass = function() {
        $(document.body).removeClass('flyout-visible')
    }

    Flyout.prototype.createOverlay = function() {
        this.$overlay = $('<div class="flyout-overlay"/>')

        var position = this.$el.offset()

        this.$overlay.css({
            top: position.top,
            left: this.options.flyoutWidth
        })

        this.$overlay.on('click', this.proxy(this.onOverlayClick))
        $(document.body).on('keydown', this.proxy(this.onDocumentKeydown))

        $(document.body).append(this.$overlay)
    }

    Flyout.prototype.removeOverlay = function() {
        if (!this.$overlay) {
            return
        }

        this.$overlay.off('click', this.proxy(this.onOverlayClick))
        $(document.body).off('keydown', this.proxy(this.onDocumentKeydown))

        this.$overlay.remove()
        this.$overlay = null
    }

    Flyout.prototype.removeOverlayAndShowToggle = function() {
        this.removeOverlay()
        this.showToggle()
    }

    // EVENT HANDLERS
    // ============================

    Flyout.prototype.onOverlayClick = function() {
        this.hide()
    }

    Flyout.prototype.onDocumentKeydown = function(ev) {
        if (ev.which == 27) {
            this.hide();
        }
    }

    // FLYOUT PLUGIN DEFINITION
    // ============================

    Flyout.DEFAULTS = {
        flyoutWidth: 400,
        flyoutToggle: null
    }

    var old = $.fn.flyout

    $.fn.flyout = function (option) {
        var args = Array.prototype.slice.call(arguments, 1), 
            result = undefined

        this.each(function () {
            var $this   = $(this)
            var data    = $this.data('oc.flyout')
            var options = $.extend({}, Flyout.DEFAULTS, $this.data(), typeof option == 'object' && option)
            if (!data) $this.data('oc.flyout', (data = new Flyout(this, options)))
            if (typeof option == 'string') result = data[option].apply(data, args)
            if (typeof result != 'undefined') return false
        })
        
        return result ? result : this
    }

    $.fn.flyout.Constructor = Flyout

    // FLYOUT NO CONFLICT
    // =================

    $.fn.flyout.noConflict = function () {
        $.fn.flyout = old
        return this
    }

    // FLYOUT DATA-API
    // ===============

    // Currently flyouts don't use the document render event
    // and can't be created dynamically (performance considerations).
    $(document).on('ready', function(){
        $('div[data-control=flyout]').flyout()
    })
}(window.jQuery);