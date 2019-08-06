/* ========================================================================
 * OctoberCMS: front-end JavaScript extras
 * http://octobercms.com
 * ========================================================================
 * Copyright 2016 Alexey Bobkov, Samuel Georges
 * ======================================================================== */

/*
 * October CMS JSON Parser
 */
"use strict";

(function() {
    /**
     * parse key
     * @param str
     * @param pos
     * @param quote
     * @returns {string}
     */
    function parseKey(str, pos, quote) {
        var key = "";
        for (var i = pos; i < str.length; i++) {
            if (quote && quote === str[i]) {
                return key;
            } else if (!quote && (str[i] === " " || str[i] === ":")) {
                return key;
            }

            key += str[i];

            if (str[i] === "\\" && i + 1 < str.length) {
                key += str[i + 1];
                i++;
            }
        }
        throw new Error("Broken JSON syntax near " + key);
    }

    /*
     * get body
     * @param str
     * @param pos
     * @returns {*}
     */
    function getBody(str, pos) {
        // parse string body
        if (str[pos] === "\"" || str[pos] === "'") {
            var body = str[pos];
            for (var i = pos + 1; i < str.length; i++) {
                if (str[i] === "\\") {
                    body += str[i];
                    if (i + 1 < str.length) body += str[i + 1];
                    i++;
                } else if (str[i] === str[pos]) {
                    body += str[pos];
                    return {
                        originLength: body.length,
                        body: body
                    };
                } else body += str[i];
            }
            throw new Error("Broken JSON string body near " + body);
        }

        // parse true / false
        if (str[pos] === "t") {
            if (str.indexOf("true", pos) === pos) {
                return {
                    originLength: "true".length,
                    body: "true"
                };
            }
            throw new Error("Broken JSON boolean body near " + str.substr(0, pos + 10));
        }
        if (str[pos] === "f") {
            if (str.indexOf("f", pos) === pos) {
                return {
                    originLength: "false".length,
                    body: "false"
                };
            }
            throw new Error("Broken JSON boolean body near " + str.substr(0, pos + 10));
        }

        // parse null
        if (str[pos] === "n") {
            if (str.indexOf("null", pos) === pos) {
                return {
                    originLength: "null".length,
                    body: "null"
                };
            }
            throw new Error("Broken JSON boolean body near " + str.substr(0, pos + 10));
        }

        // parse number
        if (str[pos] === "-" || str[pos] === "+" || str[pos] === "." || (str[pos] >= "0" && str[pos] <= "9")) {
            var body = "";
            for (var i = pos; i < str.length; i++) {
                if (str[i] === "-" || str[i] === "+" || str[i] === "." || (str[i] >= "0" && str[i] <= "9")) {
                    body += str[i];
                } else {
                    return {
                        originLength: body.length,
                        body: body
                    };
                }
            }
            throw new Error("Broken JSON number body near " + body);
        }

        // parse object
        if (str[pos] === "{" || str[pos] === "[") {
            var stack = [str[pos]];
            var body = str[pos];
            for (var i = pos + 1; i < str.length; i++) {
                body += str[i];
                if (str[i] === "\\") {
                    if (i + 1 < str.length) body += str[i + 1];
                    i++;
                } else if (str[i] === "\"") {
                    if (stack[stack.length - 1] === "\"") {
                        stack.pop();
                    } else if (stack[stack.length - 1] !== "'") {
                        stack.push(str[i]);
                    }
                } else if (str[i] === "'") {
                    if (stack[stack.length - 1] === "'") {
                        stack.pop();
                    } else if (stack[stack.length - 1] !== "\"") {
                        stack.push(str[i]);
                    }
                } else if (stack[stack.length - 1] !== "\"" && stack[stack.length - 1] !== "'") {
                    if (str[i] === "{") {
                        stack.push("{");
                    } else if (str[i] === "}") {
                        if (stack[stack.length - 1] === "{") {
                            stack.pop();
                        } else {
                            throw new Error("Broken JSON " + (str[pos] === "{" ? "object" : "array") + " body near " + body);
                        }
                    } else if (str[i] === "[") {
                        stack.push("[");
                    } else if (str[i] === "]") {
                        if (stack[stack.length - 1] === "[") {
                            stack.pop();
                        } else {
                            throw new Error("Broken JSON " + (str[pos] === "{" ? "object" : "array") + " body near " + body);
                        }
                    }
                }
                if (!stack.length) {
                    return {
                        originLength: i - pos,
                        body: body
                    };
                }
            }
            throw new Error("Broken JSON " + (str[pos] === "{" ? "object" : "array") + " body near " + body);
        }
        throw new Error("Broken JSON body near " + str.substr((pos - 5 >= 0) ? pos - 5 : 0, 50));
    }

    /*
     * This is a char can be key head
     * @param ch
     * @returns {boolean}
     */
    function canBeKeyHead(ch) {
        if (ch[0] === "\\") return false;
        if ((ch[0] >= 'a' && ch[0] <= 'z') || (ch[0] >= 'A' && ch[0] <= 'Z') || ch[0] === '_') return true;
        if (ch[0] >= '0' && ch[0] <= '9') return true;
        if (ch[0] === '$') return true;
        if (ch.charCodeAt(0) > 255) return true;
        return false;
    }

    function isBlankChar(ch) {
        return ch === " " || ch === "\n" || ch === "\t";
    }

    /*
     * parse JSON
     * @param str
     */
    function parse(str) {
        str = str.trim();
        if (!str.length) throw new Error("Broken JSON object.");
        var result = "";

        /*
         * the mistake ','
         */
        while (str && str[0] === ",") {
            str = str.substr(1);
        }

        /*
         * string
         */
        if (str[0] === "\"" || str[0] === "'") {
            if (str[str.length - 1] !== str[0]) {
                throw new Error("Invalid string JSON object.");
            }

            var body = "\"";
            for (var i = 1; i < str.length; i++) {
                if (str[i] === "\\") {
                    if (str[i + 1] === "'") {
                        body += str[i + 1]
                    } else {
                        body += str[i];
                        body += str[i + 1];
                    }
                    i++;
                } else if (str[i] === str[0]) {
                    body += "\"";
                    return body
                } else if (str[i] === "\"") {
                    body += "\\\""
                } else body += str[i];
            }
            throw new Error("Invalid string JSON object.");
        }

        /*
         * boolean
         */
        if (str === "true" || str === "false") {
            return str;
        }

        /*
         * null
         */
        if (str === "null") {
            return "null";
        }

        /*
         * number
         */
        var num = parseFloat(str);
        if (!isNaN(num)) {
            return num.toString();
        }

        /*
         * object
         */
        if (str[0] === "{") {
            var type = "needKey";
            var result = "{";

            for (var i = 1; i < str.length; i++) {
                if (isBlankChar(str[i])) {
                    continue;
                } else if (type === "needKey" && (str[i] === "\"" || str[i] === "'")) {
                    var key = parseKey(str, i + 1, str[i]);
                    result += "\"" + key + "\"";
                    i += key.length;
                    i += 1;
                    type = "afterKey";
                } else if (type === "needKey" && canBeKeyHead(str[i])) {
                    var key = parseKey(str, i);
                    result += "\"";
                    result += key;
                    result += "\"";
                    i += key.length - 1;
                    type = "afterKey";
                } else if (type === "afterKey" && str[i] === ":") {
                    result += ":";
                    type = ":";
                } else if (type === ":") {
                    var body = getBody(str, i);

                    i = i + body.originLength - 1;
                    result += parse(body.body);

                    type = "afterBody";
                } else if (type === "afterBody" || type === "needKey") {
                    var last = i;
                    while (str[last] === "," || isBlankChar(str[last])) {
                        last++;
                    }
                    if (str[last] === "}" && last === str.length - 1) {
                        while (result[result.length - 1] === ",") {
                            result = result.substr(0, result.length - 1);
                        }
                        result += "}";
                        return result;
                    } else if (last !== i && result !== "{") {
                        result += ",";
                        type = "needKey";
                        i = last - 1;
                    }
                }
            }
            throw new Error("Broken JSON object near " + result);
        }

        /*
         * array
         */
        if (str[0] === "[") {
            var result = "[";
            var type = "needBody";
            for (var i = 1; i < str.length; i++) {
                if (" " === str[i] || "\n" === str[i] || "\t" === str[i]) {
                    continue;
                } else if (type === "needBody") {
                    if (str[i] === ",") {
                        result += "null,";
                        continue;
                    }
                    if (str[i] === "]" && i === str.length - 1) {
                        if (result[result.length - 1] === ",") result = result.substr(0, result.length - 1);
                        result += "]";
                        return result;
                    }

                    var body = getBody(str, i);

                    i = i + body.originLength - 1;
                    result += parse(body.body);

                    type = "afterBody";
                } else if (type === "afterBody") {
                    if (str[i] === ",") {
                        result += ",";
                        type = "needBody";

                        // deal with mistake ","
                        while (str[i + 1] === "," || isBlankChar(str[i + 1])) {
                            if (str[i + 1] === ",") result += "null,";
                            i++;
                        }
                    } else if (str[i] === "]" && i === str.length - 1) {
                        result += "]";
                        return result;
                    }
                }
            }
            throw new Error("Broken JSON array near " + result);
        }
    }

    var g = (typeof exports === "undefined") ? (window.octoberJSON = {}) : exports;

    /*
     * parse October JSON string into JSON object
     * @param json
     * @returns {*}
     */
    g.parse = function(json) {
        var jsonString = parse(json);
        return JSON.parse(jsonString);
    };
})();

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
