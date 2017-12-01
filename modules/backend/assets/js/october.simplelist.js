/*
 * SimpleList control.
 *
 * Data attributes:
 * - data-control="simplelist" - enables the simplelist plugin
 *
 * JavaScript API:
 * $('#simplelist').simplelist()
 *
 * Dependences:
 * - Sortable (jquery-sortable.js)
 */
+function ($) { "use strict";

    var SimpleList = function (element, options) {

        var $el = this.$el = $(element)

        this.options = options || {}

        if ($el.hasClass('is-sortable')) {

            /*
             * Make each list inside sortable
             */
            var sortableOptions = {
                distance: 10
            }
            if (this.options.sortableHandle)
                sortableOptions[handle] = this.options.sortableHandle

            $el.find('> ul, > ol').sortable(sortableOptions)
        }

        if ($el.hasClass('is-scrollable')) {

            /*
             * Inject a scrollbar container
             */
            $el.wrapInner($('<div />').addClass('control-scrollbar'))
            var $scrollbar = $el.find('>.control-scrollbar:first')
            $scrollbar.scrollbar()
        }
    }

    SimpleList.DEFAULTS = {
        sortableHandle: null
    }

    // SIMPLE LIST PLUGIN DEFINITION
    // ============================

    var old = $.fn.simplelist

    $.fn.simplelist = function (option) {
        return this.each(function () {
            var $this = $(this)
            var data  = $this.data('oc.simplelist')
            var options = $.extend({}, SimpleList.DEFAULTS, $this.data(), typeof option == 'object' && option)
            if (!data) $this.data('oc.simplelist', (data = new SimpleList(this, options)))
        })
      }

    $.fn.simplelist.Constructor = SimpleList

    // SIMPLE LIST NO CONFLICT
    // =================

    $.fn.simplelist.noConflict = function () {
        $.fn.simplelist = old
        return this
    }

    // SIMPLE LIST DATA-API
    // ===============

    $(document).render(function(){
        $('[data-control="simplelist"]').simplelist()
    })

}(window.jQuery);
