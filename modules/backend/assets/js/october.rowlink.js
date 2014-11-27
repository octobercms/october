/*
 * Table row linking plugin
 * 
 * Data attributes:
 * - data-control="rowlink" - enables the plugin on an element
 *
 * JavaScript API:
 * $('a#someElement').rowLink()
 *
 * Dependences:
 * - Null
 */

+function ($) { "use strict";

    // ROWLINK CLASS DEFINITION
    // ============================

    var RowLink = function(element, options) {
        var self       = this
        this.options   = options
        this.$el       = $(element)

        var tr = this.$el.prop('tagName') == 'TR'
            ? this.$el
            : this.$el.find('tr:has(td)')

        tr.each(function(){

            var link = $(this).find(options.target).filter(function(){
                return !$(this).closest('td').hasClass(options.excludeClass) && !$(this).hasClass(options.excludeClass)
            }).first()

            if (!link.length) return

            var href = link.attr('href'),
                onclick = (typeof link.get(0).onclick == "function") ? link.get(0).onclick : null

            $(this).find('td').not('.' + options.excludeClass).click(function() {
                if (onclick)
                    onclick.apply(link.get(0))
                else
                    window.location = href;
            })

            $(this).addClass(options.linkedClass)
            link.hide().after(link.html())
        })

    }

    RowLink.DEFAULTS = {
        target: 'a',
        excludeClass: 'nolink',
        linkedClass: 'rowlink'
    }

    // ROWLINK PLUGIN DEFINITION
    // ============================

    var old = $.fn.rowLink

    $.fn.rowLink = function (option) {
        var args = Array.prototype.slice.call(arguments, 1)
        return this.each(function () {
            var $this   = $(this)
            var data    = $this.data('oc.rowlink')
            var options = $.extend({}, RowLink.DEFAULTS, $this.data(), typeof option == 'object' && option)
            if (!data) $this.data('oc.rowlink', (data = new RowLink(this, options)))
            else if (typeof option == 'string') data[option].apply(data, args)
        })
    }

    $.fn.rowLink.Constructor = RowLink

    // ROWLINK NO CONFLICT
    // =================

    $.fn.rowLink.noConflict = function () {
        $.fn.rowLink = old
        return this
    }

    // ROWLINK DATA-API
    // ===============

    $(document).render(function() {
        $('[data-control="rowlink"]').rowLink()
    })

}(window.jQuery);