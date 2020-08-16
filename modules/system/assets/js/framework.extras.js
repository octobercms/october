/* ========================================================================
 * OctoberCMS: front-end JavaScript extras
 * http://octobercms.com
 * ========================================================================
 * Copyright 2016-2020 Alexey Bobkov, Samuel Georges
 * ======================================================================== */

+function ($) { "use strict";
    if ($.oc === undefined)
        $.oc = {}

    // @todo Provide an interface for configuration
    // - Custom loader CSS class
    // - Custom stripe loader color
    // - Flash message interval

    var LOADER_CLASS = 'oc-loading';

    // FLASH HANDLING
    // ============================

    $(document).on('ajaxSetup', '[data-request][data-request-flash]', function(event, context) {
        context.options.handleErrorMessage = function(message) {
            $.oc.flashMsg({ text: message, class: 'error' })
        }

        context.options.handleFlashMessage = function(message, type) {
            $.oc.flashMsg({ text: message, class: type })
        }
    })

    // FORM VALIDATION
    // ============================

    $(document).on('ajaxValidation', '[data-request][data-request-validate]', function(event, context, errorMsg, fields) {
        var $this = $(this).closest('form'),
            $container = $('[data-validate-error]', $this),
            messages = [],
            $field

        $.each(fields, function(fieldName, fieldMessages) {
            $field = $('[data-validate-for="'+fieldName+'"]', $this)
            messages = $.merge(messages, fieldMessages)
            if (!!$field.length) {
                if (!$field.text().length || $field.data('emptyMode') == true) {
                    $field
                        .data('emptyMode', true)
                        .text(fieldMessages.join(', '))
                }
                $field.addClass('visible')
            }
        })

        if (!!$container.length) {
            $container = $('[data-validate-error]', $this)
        }

        if (!!$container.length) {
            var $oldMessages = $('[data-message]', $container)
            $container.addClass('visible')

            if (!!$oldMessages.length) {
                var $clone = $oldMessages.first()

                $.each(messages, function(key, message) {
                    $clone.clone().text(message).insertAfter($clone)
                })

                $oldMessages.remove()
            }
            else {
                $container.text(errorMsg)
            }
        }

        $this.one('ajaxError', function(event){
            event.preventDefault()
        })
    })

    $(document).on('ajaxPromise', '[data-request][data-request-validate]', function() {
        var $this = $(this).closest('form')
        $('[data-validate-for]', $this).removeClass('visible')
        $('[data-validate-error]', $this).removeClass('visible')
    })

    // LOADING BUTTONS
    // ============================

    $(document)
        .on('ajaxPromise', '[data-request]', function() {
            var $target = $(this)

            if ($target.data('attach-loading') !== undefined) {
                $target
                    .addClass(LOADER_CLASS)
                    .prop('disabled', true)
            }

            if ($target.is('form')) {
                $('[data-attach-loading]', $target)
                    .addClass(LOADER_CLASS)
                    .prop('disabled', true)
            }
        })
        .on('ajaxFail ajaxDone', '[data-request]', function() {
            var $target = $(this)

            if ($target.data('attach-loading') !== undefined) {
                $target
                    .removeClass(LOADER_CLASS)
                    .prop('disabled', false)
            }

            if ($target.is('form')) {
                $('[data-attach-loading]', $target)
                    .removeClass(LOADER_CLASS)
                    .prop('disabled', false)
            }
        })

    // STRIPE LOAD INDICATOR
    // ============================

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

        if (this.counter > 1) {
            return
        }

        this.indicator.removeClass('loaded')
        $(document.body).addClass('oc-loading')
    }

    StripeLoadIndicator.prototype.hide = function(force) {
        this.counter--

        if (force !== undefined && force) {
            this.counter = 0
        }

        if (this.counter <= 0) {
            this.indicator.addClass('loaded')
            $(document.body).removeClass('oc-loading')
        }
    }

    $.oc.stripeLoadIndicator = new StripeLoadIndicator()

    // STRIPE LOAD INDICATOR DATA-API
    // ============================

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
        })
        .on('ajaxFail ajaxDone', '[data-request]', function(event) {
            event.stopPropagation()
            $.oc.stripeLoadIndicator.hide()
        })

    // FLASH MESSAGE
    // ============================

    var FlashMessage = function (options, el) {
        var
            options = $.extend({}, FlashMessage.DEFAULTS, options),
            $element = $(el)

        $('body > p.flash-message').remove()

        if ($element.length == 0) {
            $element = $('<p />').addClass(options.class).html(options.text)
        }

        $element
            .addClass('flash-message fade')
            .attr('data-control', null)
            .on('click', 'button', remove)
            .on('click', remove)
            .append('<button type="button" class="close" aria-hidden="true">&times;</button>')

        $(document.body).append($element)

        setTimeout(function() {
            $element.addClass('in')
        }, 100)

        var timer = window.setTimeout(remove, options.interval * 1000)

        function removeElement() {
            $element.remove()
        }

        function remove() {
            window.clearInterval(timer)

            $element.removeClass('in')
            $.support.transition && $element.hasClass('fade')
                ? $element
                    .one($.support.transition.end, removeElement)
                    .emulateTransitionEnd(500)
                : removeElement()
        }
    }

    FlashMessage.DEFAULTS = {
        class: 'success',
        text: 'Default text',
        interval: 5
    }

    if ($.oc === undefined)
        $.oc = {}

    $.oc.flashMsg = FlashMessage

    // FLASH MESSAGE DATA-API
    // ===============

    $(document).render(function(){
        $('[data-control=flash-message]').each(function(){
            $.oc.flashMsg($(this).data(), this)
        })
    })

}(window.jQuery);
