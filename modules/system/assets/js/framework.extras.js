/* ========================================================================
 * OctoberCMS: front-end JavaScript extras
 * http://octobercms.com
 * ========================================================================
 * Copyright 2016 Alexey Bobkov, Samuel Georges
 * ======================================================================== */

/*
 * The stripe loading indicator.
 *
 * Displays the animated loading indicator stripe at the top of the page.
 *
 * JavaScript API:
 * $.oc.stripeLoadIndicator.show(event)
 * $.oc.stripeLoadIndicator.hide()
 *
 * By default if the show() method has been called several times, the hide() method should be
 * called the same number of times in order to hide the stripe. Use hide(true) to hide the 
 * indicator forcibly.
 */
+function ($) { "use strict";
    if ($.oc === undefined)
        $.oc = {}

    var StripeLoadIndicator = function() {
        var self = this
        this.counter = 0
        this.indicator = $('<div/>').addClass('stripe-loading-indicator loaded')
                            .append($('<div />').addClass('stripe'))
                            .append($('<div />').addClass('stripe-loaded'))
        this.stripe = this.indicator.find('.stripe')

        $(document).ready(function() {
            $(document.body).append(self.indicator)
        })
    }

    StripeLoadIndicator.prototype.show = function() {
        this.counter++

        // Restart the animation
        this.stripe.after(this.stripe = this.stripe.clone()).remove()

        if (this.counter > 1)
            return

        this.indicator.removeClass('loaded')
        $(document.body).addClass('oc-loading')
    }

    StripeLoadIndicator.prototype.hide = function(force) {
        this.counter--
        if (force !== undefined && force)
            this.counter = 0

        if (this.counter <= 0) {
            this.indicator.addClass('loaded')
            $(document.body).removeClass('oc-loading')
        }
    }

    $.oc.stripeLoadIndicator = new StripeLoadIndicator()

    // STRIPE LOAD INDICATOR DATA-API
    // ==============

    $(document)
        .on('ajaxPromise', '[data-request]', function(event) {
            // Prevent this event from bubbling up to a non-related data-request
            // element, for example a <form> tag wrapping a <button> tag
            event.stopPropagation()

            $.oc.stripeLoadIndicator.show()

            // This code will cover instances where the element has been removed
            // from the DOM, making the resolution event below an orphan.
            var $el = $(this)
            $(window).one('ajaxUpdateComplete', function() {
                if ($el.closest('html').length === 0)
                    $.oc.stripeLoadIndicator.hide()
             })
        }).on('ajaxFail ajaxDone', '[data-request]', function(event) {
            event.stopPropagation()
            $.oc.stripeLoadIndicator.hide()
        })

}(window.jQuery);
