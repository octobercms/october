/*
 * Callout
 *
 * Supported options:
 *  - xxx - none
 * 
 * Events:
 * - close.oc.callout - triggered when a node on the tree is moved.
 * 
 * Dependences:
 */
+function ($) {
    'use strict';

    // CALLOUT CLASS DEFINITION
    // ======================

    var dismiss = '[data-dismiss="callout"]'
    var Callout   = function (el) {
        $(el).on('click', dismiss, this.close)
    }

    Callout.prototype.close = function (e) {
        var $this    = $(this)
        var selector = $this.attr('data-target')

        if (!selector) {
            selector = $this.attr('href')
            selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
        }

        var $parent = $(selector)

        if (e) e.preventDefault()

        if (!$parent.length) {
            $parent = $this.hasClass('callout') ? $this : $this.parent()
        }

        $parent.trigger(e = $.Event('close.oc.callout'))

        if (e.isDefaultPrevented()) return

        $parent.removeClass('in')

        function removeElement() {
            $parent.trigger('closed.oc.callout').remove()
        }

        $.support.transition && $parent.hasClass('fade') ?
            $parent
                .one($.support.transition.end, removeElement)
                .emulateTransitionEnd(500) :
            removeElement()
    }

    // CALLOUT PLUGIN DEFINITION
    // =======================

    var old = $.fn.callout

    $.fn.callout = function (option) {
        return this.each(function () {
            var $this = $(this)
            var data  = $this.data('oc.callout')

            if (!data) $this.data('oc.callout', (data = new Callout(this)))
            if (typeof option == 'string') data[option].call($this)
        })
    }

    $.fn.callout.Constructor = Callout

    // CALLOUT NO CONFLICT
    // =================

    $.fn.callout.noConflict = function () {
        $.fn.callout = old
        return this
    }

    // CALLOUT DATA-API
    // ==============

    $(document).on('click.oc.callout.data-api', dismiss, Callout.prototype.close)

}(jQuery);
