/*
 * Toolbar control.
 *
 * Makes toolbars drag/scrollable.
 * 
 * Data attributes:
 * - data-control="toolbar" - enables the toolbar plugin
 * - data-no-drag-support="true" - disables the drag support for the toolbar, leaving only the mouse wheel support
 * - data-use-native-drag="true" - if native CSS is enabled via "mobile" on the HTML tag, false by default
 *
 * JavaScript API:
 * $('#toolbar').toolbar()
 *
 * Require:
 * - storm/drag.scroll
 */
+function ($) { "use strict";

    var Base = $.oc.foundation.base,
        BaseProto = Base.prototype

    var Toolbar = function (element, options) {
        var
            $el = this.$el = $(element),
            $toolbar = $el.closest('.control-toolbar')

        $.oc.foundation.controlUtils.markDisposable(element)
        this.$toolbar = $toolbar

        this.options = options || {};

        var noDragSupport = options.noDragSupport !== undefined && options.noDragSupport

        Base.call(this)

        var scrollClassContainer = options.scrollClassContainer !== undefined
            ? options.scrollClassContainer
            : $el.parent()

        if (this.options.useNativeDrag) {
            $el.addClass('is-native-drag')
        }

        $el.dragScroll({
            scrollClassContainer: scrollClassContainer,
            useDrag: !noDragSupport,
            useNative: this.options.useNativeDrag
        })

        $('.form-control.growable', $toolbar).on('focus.toolbar', function(){
            update()
        })

        $('.form-control.growable', $toolbar).on('blur.toolbar', function(){
            update()
        })

        this.$el.one('dispose-control', this.proxy(this.dispose))

        function update() {
            $(window).trigger('resize')
        }
    }

    Toolbar.prototype = Object.create(BaseProto)
    Toolbar.prototype.constructor = Toolbar

    Toolbar.prototype.dispose = function() {
        this.$el.off('dispose-control', this.proxy(this.dispose))
        $('.form-control.growable', this.$toolbar).off('.toolbar')
        this.$el.dragScroll('dispose')
        this.$el.removeData('oc.toolbar')
        this.$el = null

        BaseProto.dispose.call(this)
    }

    Toolbar.DEFAULTS = {
        useNativeDrag: false
    }

    // TOOLBAR PLUGIN DEFINITION
    // ============================

    var old = $.fn.toolbar

    $.fn.toolbar = function (option) {
        var args = Array.prototype.slice.call(arguments, 1)

        return this.each(function () {
            var $this = $(this)
            var data  = $this.data('oc.toolbar')
            var options = $.extend({}, Toolbar.DEFAULTS, $this.data(), typeof option == 'object' && option)

            if (!data) $this.data('oc.toolbar', (data = new Toolbar(this, options)))
            if (typeof option == 'string') data[option].apply(data, args)
        })
      }

    $.fn.toolbar.Constructor = Toolbar

    // TOOLBAR NO CONFLICT
    // =================

    $.fn.toolbar.noConflict = function () {
        $.fn.toolbar = old
        return this
    }

    // TOOLBAR DATA-API
    // ===============

    $(document).on('render', function(){
        $('[data-control=toolbar]').toolbar()
    })

}(window.jQuery);