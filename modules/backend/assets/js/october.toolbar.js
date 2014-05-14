/*
 * Toolbar control.
 *
 * Makes toolbars drag/scrollable.
 * 
 * Data attributes:
 * - data-control="toolbar" - enables the toolbar plugin
 *
 * JavaScript API:
 * $('#toolbar').toolbar()
 *
 * Dependences: 
 * - Drag Scroll (october.dragscroll.js)
 */
+function ($) { "use strict";

    var Toolbar = function (element, options) {
        var
            $el = this.$el = $(element),
            $toolbar = $el.closest('.control-toolbar')

        this.options = options || {};

        var scrollClassContainer = options.scrollClassContainer !== undefined ?
            options.scrollClassContainer :
            $el.parent()

        $el.dragScroll({
            scrollClassContainer: scrollClassContainer
        })

        $('.form-control.growable', $toolbar).on('focus', function(){
            update()
        })

        $('.form-control.growable', $toolbar).on('blur', function(){
            update()
        })

        function update() {
            $(window).trigger('resize')
        }
    }

    Toolbar.DEFAULTS = {}

    // TOOLBAR PLUGIN DEFINITION
    // ============================

    var old = $.fn.toolbar

    $.fn.toolbar = function (option) {
        return this.each(function () {
            var $this = $(this)
            var data  = $this.data('oc.toolbar')
            var options = $.extend({}, Toolbar.DEFAULTS, $this.data(), typeof option == 'object' && option)

            if (!data) $this.data('oc.toolbar', (data = new Toolbar(this, options)))
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