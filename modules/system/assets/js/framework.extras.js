/* ========================================================================
 * OctoberCMS: front-end JavaScript extras
 * http://octobercms.com
 * ========================================================================
 * Copyright 2016 Alexey Bobkov, Samuel Georges
 * ======================================================================== */

/* October CMS JSON Parser */
"use strict";!function(){function a(e,r,n){for(var t="",o=r;o<e.length;o++){if(n&&n===e[o])return t;if(!n&&(" "===e[o]||":"===e[o]))return t;t+=e[o],"\\"===e[o]&&o+1<e.length&&(t+=e[o+1],o++)}throw new Error("Broken JSON syntax near "+t)}function u(e,r){if('"'===e[r]||"'"===e[r]){for(var n=e[r],t=r+1;t<e.length;t++)if("\\"===e[t])n+=e[t],t+1<e.length&&(n+=e[t+1]),t++;else{if(e[t]===e[r])return{originLength:(n+=e[r]).length,body:n};n+=e[t]}throw new Error("Broken JSON string body near "+n)}if("t"===e[r]){if(e.indexOf("true",r)===r)return{originLength:"true".length,body:"true"};throw new Error("Broken JSON boolean body near "+e.substr(0,r+10))}if("f"===e[r]){if(e.indexOf("f",r)===r)return{originLength:"false".length,body:"false"};throw new Error("Broken JSON boolean body near "+e.substr(0,r+10))}if("n"===e[r]){if(e.indexOf("null",r)===r)return{originLength:"null".length,body:"null"};throw new Error("Broken JSON boolean body near "+e.substr(0,r+10))}if("-"===e[r]||"+"===e[r]||"."===e[r]||"0"<=e[r]&&e[r]<="9"){for(n="",t=r;t<e.length;t++){if(!("-"===e[t]||"+"===e[t]||"."===e[t]||"0"<=e[t]&&e[t]<="9"))return{originLength:n.length,body:n};n+=e[t]}throw new Error("Broken JSON number body near "+n)}if("{"!==e[r]&&"["!==e[r])throw new Error("Broken JSON body near "+e.substr(0<=r-5?r-5:0,50));var o=[e[r]];for(n=e[r],t=r+1;t<e.length;t++){if(n+=e[t],"\\"===e[t])t+1<e.length&&(n+=e[t+1]),t++;else if('"'===e[t])'"'===o[o.length-1]?o.pop():"'"!==o[o.length-1]&&o.push(e[t]);else if("'"===e[t])"'"===o[o.length-1]?o.pop():'"'!==o[o.length-1]&&o.push(e[t]);else if('"'!==o[o.length-1]&&"'"!==o[o.length-1])if("{"===e[t])o.push("{");else if("}"===e[t]){if("{"!==o[o.length-1])throw new Error("Broken JSON "+("{"===e[r]?"object":"array")+" body near "+n);o.pop()}else if("["===e[t])o.push("[");else if("]"===e[t]){if("["!==o[o.length-1])throw new Error("Broken JSON "+("{"===e[r]?"object":"array")+" body near "+n);o.pop()}if(!o.length)return{originLength:t-r,body:n}}throw new Error("Broken JSON "+("{"===e[r]?"object":"array")+" body near "+n)}function s(e){return" "===e||"\n"===e||"\t"===e}void 0===$.oc&&($.oc={}),$.oc.JSON=function(e){var r=function e(r){if(!(r=r.trim()).length)throw new Error("Broken JSON object.");for(var n="";r&&","===r[0];)r=r.substr(1);if('"'===r[0]||"'"===r[0]){if(r[r.length-1]!==r[0])throw new Error("Invalid string JSON object.");for(var t='"',o=1;o<r.length;o++)if("\\"===r[o])"'"===r[o+1]||(t+=r[o]),t+=r[o+1],o++;else{if(r[o]===r[0])return t+='"';'"'===r[o]?t+='\\"':t+=r[o]}throw new Error("Invalid string JSON object.")}if("true"===r||"false"===r)return r;if("null"===r)return"null";var i,f=parseFloat(r);if(!isNaN(f))return f.toString();if("{"===r[0]){var l="needKey";for(n="{",o=1;o<r.length;o++)if(!s(r[o]))if("needKey"!==l||'"'!==r[o]&&"'"!==r[o]){if("needKey"===l&&"\\"!==(i=r[o])[0]&&("a"<=i[0]&&i[0]<="z"||"A"<=i[0]&&i[0]<="Z"||"_"===i[0]||"0"<=i[0]&&i[0]<="9"||"$"===i[0]||255<i.charCodeAt(0))){var h;n+='"',n+=h=a(r,o),n+='"',o+=h.length-1,l="afterKey"}else if("afterKey"===l&&":"===r[o])n+=":",l=":";else if(":"===l)o=o+(t=u(r,o)).originLength-1,n+=e(t.body),l="afterBody";else if("afterBody"===l||"needKey"===l){for(var g=o;","===r[g]||s(r[g]);)g++;if("}"===r[g]&&g===r.length-1){for(;","===n[n.length-1];)n=n.substr(0,n.length-1);return n+="}"}g!==o&&"{"!==n&&(n+=",",l="needKey",o=g-1)}}else n+='"'+(h=a(r,o+1,r[o]))+'"',o+=h.length,o+=1,l="afterKey";throw new Error("Broken JSON object near "+n)}if("["===r[0]){for(n="[",l="needBody",o=1;o<r.length;o++)if(" "!==r[o]&&"\n"!==r[o]&&"\t"!==r[o])if("needBody"===l){if(","===r[o]){n+="null,";continue}if("]"===r[o]&&o===r.length-1)return","===n[n.length-1]&&(n=n.substr(0,n.length-1)),n+="]";o=o+(t=u(r,o)).originLength-1,n+=e(t.body),l="afterBody"}else if("afterBody"===l)if(","===r[o])for(n+=",",l="needBody";","===r[o+1]||s(r[o+1]);)","===r[o+1]&&(n+="null,"),o++;else if("]"===r[o]&&o===r.length-1)return n+="]";throw new Error("Broken JSON array near "+n)}}(e);return JSON.parse(r)}}();

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
