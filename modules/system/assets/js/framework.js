/* ========================================================================
 * OctoberCMS: front-end JavaScript framework
 * http://octobercms.com
 * ========================================================================
 * Copyright 2016-2020 Alexey Bobkov, Samuel Georges
 * ======================================================================== */

if (window.jQuery === undefined) {
    throw new Error('The jQuery library is not loaded. The OctoberCMS framework cannot be initialized.');
}
if (window.jQuery.request !== undefined) {
    throw new Error('The OctoberCMS framework is already loaded.');
}

+function ($) { "use strict";

    var Request = function (element, handler, options) {
        var $el = this.$el = $(element);
        this.options = options || {};

        /*
         * Validate handler name
         */
        if (handler === undefined) {
            throw new Error('The request handler name is not specified.')
        }

        if (!handler.match(/^(?:\w+\:{2})?on*/)) {
            throw new Error('Invalid handler name. The correct handler name format is: "onEvent".')
        }

        /*
         * Prepare the options
         */
        var $form = options.form ? $(options.form) : $el.closest('form'),
            $triggerEl = !!$form.length ? $form : $el,
            context = { handler: handler, options: options }

        /*
         * Validate the form client-side
         */
        if ((options.browserValidate !== undefined) && typeof document.createElement('input').reportValidity == 'function' && $form && $form[0] && !$form[0].checkValidity()) {
            $form[0].reportValidity();
            return false;
        }

        /*
         * Execute the request
         */
        $el.trigger('ajaxSetup', [context])
        var _event = jQuery.Event('oc.beforeRequest')
        $triggerEl.trigger(_event, context)
        if (_event.isDefaultPrevented()) return

        var loading = options.loading !== undefined ? options.loading : null,
            url = options.url !== undefined ? options.url : window.location.href,
            isRedirect = options.redirect !== undefined && options.redirect.length,
            useFlash = options.flash !== undefined,
            useFiles = options.files !== undefined

        if (useFiles && typeof FormData === 'undefined') {
            console.warn('This browser does not support file uploads via FormData')
            useFiles = false
        }

        if ($.type(loading) == 'string') {
            loading = $(loading)
        }

        /*
         * Request headers
         */
        var requestHeaders = {
            'X-OCTOBER-REQUEST-HANDLER': handler,
            'X-OCTOBER-REQUEST-PARTIALS': this.extractPartials(options.update)
        }

        if (useFlash) {
            requestHeaders['X-OCTOBER-REQUEST-FLASH'] = 1
        }

        var csrfToken = getXSRFToken()
        if (csrfToken) {
            requestHeaders['X-XSRF-TOKEN'] = csrfToken
        }

        /*
         * Request data
         */
        var requestData,
            inputName,
            data = {}

        $.each($el.parents('[data-request-data]').toArray().reverse(), function extendRequest() {
            $.extend(data, paramToObj('data-request-data', $(this).data('request-data')))
        })

        if ($el.is(':input') && !$form.length) {
            inputName = $el.attr('name')
            if (inputName !== undefined && options.data[inputName] === undefined) {
                options.data[inputName] = $el.val()
            }
        }

        if (options.data !== undefined && !$.isEmptyObject(options.data)) {
            $.extend(data, options.data)
        }

        if (useFiles) {
            requestData = new FormData($form.length ? $form.get(0) : undefined)

            if ($el.is(':file') && inputName) {
                $.each($el.prop('files'), function() {
                    requestData.append(inputName, this)
                })

                delete data[inputName]
            }

            $.each(data, function(key) {
                if (typeof Blob !== "undefined" && this instanceof Blob && this.filename) {
                    requestData.append(key, this, this.filename)
                } else {
                    requestData.append(key, this)
                }
            })
        }
        else {
            requestData = [$form.serialize(), $.param(data)].filter(Boolean).join('&')
        }

        /*
         * Request options
         */
        var requestOptions = {
            url: url,
            crossDomain: false,
            global: options.ajaxGlobal,
            context: context,
            headers: requestHeaders,
            success: function(data, textStatus, jqXHR) {
                /*
                 * Halt here if beforeUpdate() or data-request-before-update returns false
                 */
                if (this.options.beforeUpdate.apply(this, [data, textStatus, jqXHR]) === false) return
                if (options.evalBeforeUpdate && eval('(function($el, context, data, textStatus, jqXHR) {'+options.evalBeforeUpdate+'}.call($el.get(0), $el, context, data, textStatus, jqXHR))') === false) return

                /*
                 * Trigger 'ajaxBeforeUpdate' on the form, halt if event.preventDefault() is called
                 */
                var _event = jQuery.Event('ajaxBeforeUpdate')
                $triggerEl.trigger(_event, [context, data, textStatus, jqXHR])
                if (_event.isDefaultPrevented()) return

                if (useFlash && data['X_OCTOBER_FLASH_MESSAGES']) {
                    $.each(data['X_OCTOBER_FLASH_MESSAGES'], function(type, message) {
                        requestOptions.handleFlashMessage(message, type)
                    })
                }

                /*
                 * Proceed with the update process
                 */
                var updatePromise = requestOptions.handleUpdateResponse(data, textStatus, jqXHR)

                updatePromise.done(function() {
                    $triggerEl.trigger('ajaxSuccess', [context, data, textStatus, jqXHR])
                    options.evalSuccess && eval('(function($el, context, data, textStatus, jqXHR) {'+options.evalSuccess+'}.call($el.get(0), $el, context, data, textStatus, jqXHR))')
                })

                return updatePromise
            },
            error: function(jqXHR, textStatus, errorThrown) {
                var errorMsg,
                    updatePromise = $.Deferred()

                if ((window.ocUnloading !== undefined && window.ocUnloading) || errorThrown == 'abort')
                    return

                /*
                 * Disable redirects
                 */
                isRedirect = false
                options.redirect = null

                /*
                 * Error 406 is a "smart error" that returns response object that is
                 * processed in the same fashion as a successful response.
                 */
                if (jqXHR.status == 406 && jqXHR.responseJSON) {
                    errorMsg = jqXHR.responseJSON['X_OCTOBER_ERROR_MESSAGE']
                    updatePromise = requestOptions.handleUpdateResponse(jqXHR.responseJSON, textStatus, jqXHR)
                }
                /*
                 * Standard error with standard response text
                 */
                else {
                    errorMsg = jqXHR.responseText ? jqXHR.responseText : jqXHR.statusText
                    updatePromise.resolve()
                }

                updatePromise.done(function() {
                    $el.data('error-message', errorMsg)

                    /*
                     * Trigger 'ajaxError' on the form, halt if event.preventDefault() is called
                     */
                    var _event = jQuery.Event('ajaxError')
                    $triggerEl.trigger(_event, [context, errorMsg, textStatus, jqXHR])
                    if (_event.isDefaultPrevented()) return

                    /*
                     * Halt here if the data-request-error attribute returns false
                     */
                    if (options.evalError && eval('(function($el, context, errorMsg, textStatus, jqXHR) {'+options.evalError+'}.call($el.get(0), $el, context, errorMsg, textStatus, jqXHR))') === false)
                        return

                    requestOptions.handleErrorMessage(errorMsg)
                })

                return updatePromise
            },
            complete: function(data, textStatus, jqXHR) {
                $triggerEl.trigger('ajaxComplete', [context, data, textStatus, jqXHR])
                options.evalComplete && eval('(function($el, context, data, textStatus, jqXHR) {'+options.evalComplete+'}.call($el.get(0), $el, context, data, textStatus, jqXHR))')
            },

            /*
             * Custom function, requests confirmation from the user
             */
            handleConfirmMessage: function(message) {
                var _event = jQuery.Event('ajaxConfirmMessage')

                _event.promise = $.Deferred()
                if ($(window).triggerHandler(_event, [message]) !== undefined) {
                    _event.promise.done(function() {
                        options.confirm = null
                        new Request(element, handler, options)
                    })
                    return false
                }

                if (_event.isDefaultPrevented()) return
                if (message) return confirm(message)
            },

            /*
             * Custom function, display an error message to the user
             */
            handleErrorMessage: function(message) {
                var _event = jQuery.Event('ajaxErrorMessage')
                $(window).trigger(_event, [message])
                if (_event.isDefaultPrevented()) return
                if (message) alert(message)
            },

            /*
             * Custom function, focus fields with errors
             */
            handleValidationMessage: function(message, fields) {
                $triggerEl.trigger('ajaxValidation', [context, message, fields])

                var isFirstInvalidField = true
                $.each(fields, function focusErrorField(fieldName, fieldMessages) {
                    fieldName = fieldName.replace(/\.(\w+)/g, '[$1]')

                    var fieldElement = $form.find('[name="'+fieldName+'"], [name="'+fieldName+'[]"], [name$="['+fieldName+']"], [name$="['+fieldName+'][]"]').filter(':enabled').first()
                    if (fieldElement.length > 0) {

                        var _event = jQuery.Event('ajaxInvalidField')
                        $(window).trigger(_event, [fieldElement.get(0), fieldName, fieldMessages, isFirstInvalidField])

                        if (isFirstInvalidField) {
                            if (!_event.isDefaultPrevented()) fieldElement.focus()
                            isFirstInvalidField = false
                        }
                    }
                })
            },

            /*
             * Custom function, display a flash message to the user
             */
            handleFlashMessage: function(message, type) {},

            /*
             * Custom function, redirect the browser to another location
             */
            handleRedirectResponse: function(url) {
                window.location.assign(url)
            },

            /*
             * Custom function, handle any application specific response values
             * Using a promisary object here in case injected assets need time to load
             */
            handleUpdateResponse: function(data, textStatus, jqXHR) {

                /*
                 * Update partials and finish request
                 */
                var updatePromise = $.Deferred().done(function() {
                    for (var partial in data) {
                        /*
                         * If a partial has been supplied on the client side that matches the server supplied key, look up
                         * it's selector and use that. If not, we assume it is an explicit selector reference.
                         */
                        var selector = (options.update[partial]) ? options.update[partial] : partial
                        if ($.type(selector) == 'string' && selector.charAt(0) == '@') {
                            $(selector.substring(1)).append(data[partial]).trigger('ajaxUpdate', [context, data, textStatus, jqXHR])
                        }
                        else if ($.type(selector) == 'string' && selector.charAt(0) == '^') {
                            $(selector.substring(1)).prepend(data[partial]).trigger('ajaxUpdate', [context, data, textStatus, jqXHR])
                        }
                        else {
                            $(selector).trigger('ajaxBeforeReplace')
                            $(selector).html(data[partial]).trigger('ajaxUpdate', [context, data, textStatus, jqXHR])
                        }
                    }

                    /*
                     * Wait for .html() method to finish rendering from partial updates
                     */
                    setTimeout(function() {
                        $(window)
                            .trigger('ajaxUpdateComplete', [context, data, textStatus, jqXHR])
                            .trigger('resize')
                    }, 0)
                })

                /*
                 * Handle redirect
                 */
                if (data['X_OCTOBER_REDIRECT']) {
                    options.redirect = data['X_OCTOBER_REDIRECT']
                    isRedirect = true
                }

                if (isRedirect) {
                    requestOptions.handleRedirectResponse(options.redirect)
                }

                /*
                 * Handle validation
                 */
                if (data['X_OCTOBER_ERROR_FIELDS']) {
                    requestOptions.handleValidationMessage(data['X_OCTOBER_ERROR_MESSAGE'], data['X_OCTOBER_ERROR_FIELDS'])
                }

                /*
                 * Handle asset injection
                 */
                 if (data['X_OCTOBER_ASSETS']) {
                    assetManager.load(data['X_OCTOBER_ASSETS'], $.proxy(updatePromise.resolve, updatePromise))
                 }
                 else {
                    updatePromise.resolve()
                }

                return updatePromise
            }
        }

        if (useFiles) {
            requestOptions.processData = requestOptions.contentType = false
        }

        /*
         * Allow default business logic to be called from user functions
         */
        context.success = requestOptions.success
        context.error = requestOptions.error
        context.complete = requestOptions.complete
        requestOptions = $.extend(requestOptions, options)
        requestOptions.data = requestData

        /*
         * Initiate request
         */
        if (options.confirm && !requestOptions.handleConfirmMessage(options.confirm)) {
            return
        }

        if (loading) loading.show()
        $(window).trigger('ajaxBeforeSend', [context])
        $el.trigger('ajaxPromise', [context])

        return $.ajax(requestOptions)
            .fail(function(jqXHR, textStatus, errorThrown) {
                if (!isRedirect) {
                    $el.trigger('ajaxFail', [context, textStatus, jqXHR])
                }
                if (loading) loading.hide()
            })
            .done(function(data, textStatus, jqXHR) {
                if (!isRedirect) {
                    $el.trigger('ajaxDone', [context, data, textStatus, jqXHR])
                }
                if (loading) loading.hide()
            })
            .always(function(dataOrXhr, textStatus, xhrOrError) {
                $el.trigger('ajaxAlways', [context, dataOrXhr, textStatus, xhrOrError])
            })
    }

    Request.DEFAULTS = {
        update: {},
        type : 'POST',
        beforeUpdate: function(data, textStatus, jqXHR) {},
        evalBeforeUpdate: null,
        evalSuccess: null,
        evalError: null,
        evalComplete: null,
        ajaxGlobal: false
    }

    /*
     * Internal function, build a string of partials and their update elements.
     */
    Request.prototype.extractPartials = function(update) {
        var result = []

        for (var partial in update)
            result.push(partial)

        return result.join('&')
    }

    // REQUEST PLUGIN DEFINITION
    // ============================

    var old = $.fn.request

    $.fn.request = function(handler, option) {
        var args = arguments

        var $this = $(this).first()
        var data  = {
            evalBeforeUpdate: $this.data('request-before-update'),
            evalSuccess: $this.data('request-success'),
            evalError: $this.data('request-error'),
            evalComplete: $this.data('request-complete'),
            ajaxGlobal: $this.data('request-ajax-global'),
            confirm: $this.data('request-confirm'),
            redirect: $this.data('request-redirect'),
            loading: $this.data('request-loading'),
            flash: $this.data('request-flash'),
            files: $this.data('request-files'),
            browserValidate: $this.data('browser-validate'),
            form: $this.data('request-form'),
            url: $this.data('request-url'),
            update: paramToObj('data-request-update', $this.data('request-update')),
            data: paramToObj('data-request-data', $this.data('request-data'))
        }
        if (!handler) handler = $this.data('request')
        var options = $.extend(true, {}, Request.DEFAULTS, data, typeof option == 'object' && option)
        return new Request($this, handler, options)
    }

    $.fn.request.Constructor = Request

    $.request = function(handler, option) {
        return $(document).request(handler, option)
    }

    // REQUEST NO CONFLICT
    // =================

    $.fn.request.noConflict = function() {
        $.fn.request = old
        return this
    }

    // REQUEST DATA-API
    // ==============

    function paramToObj(name, value) {
        if (value === undefined) value = ''
        if (typeof value == 'object') return value

        try {
            return ocJSON("{" + value + "}")
        }
        catch (e) {
            throw new Error('Error parsing the '+name+' attribute value. '+e)
        }
    }

    function getXSRFToken() {
        var cookieValue = null
        if (document.cookie && document.cookie != '') {
            var cookies = document.cookie.split(';')
            for (var i = 0; i < cookies.length; i++) {
                var cookie = jQuery.trim(cookies[i])
                if (cookie.substring(0, 11) == ('XSRF-TOKEN' + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(11))
                    break
                }
            }
        }
        return cookieValue
    }

    $(document).on('change', 'select[data-request], input[type=radio][data-request], input[type=checkbox][data-request], input[type=file][data-request]', function documentOnChange() {
        $(this).request()
    })

    $(document).on('click', 'a[data-request], button[data-request], input[type=button][data-request], input[type=submit][data-request]', function documentOnClick(e) {
        e.preventDefault()

        $(this).request()

        if ($(this).is('[type=submit]'))
            return false
    })

    $(document).on('keydown', 'input[type=text][data-request], input[type=submit][data-request], input[type=password][data-request]', function documentOnKeydown(e) {
        if (e.key === 'Enter') {
            if (this.dataTrackInputTimer !== undefined)
                window.clearTimeout(this.dataTrackInputTimer)

            $(this).request()
            return false
        }
    })

    $(document).on('input', 'input[data-request][data-track-input]', function documentOnKeyup(e) {
        var
            $el = $(this),
            lastValue = $el.data('oc.lastvalue')

        if (!$el.is('[type=email],[type=number],[type=password],[type=search],[type=text]'))
            return

        if (lastValue !== undefined && lastValue == this.value)
            return

        $el.data('oc.lastvalue', this.value)

        if (this.dataTrackInputTimer !== undefined)
            window.clearTimeout(this.dataTrackInputTimer)

        var interval = $(this).data('track-input')
        if (!interval)
            interval = 300

        var self = this
        this.dataTrackInputTimer = window.setTimeout(function() {
            if (self.lastDataTrackInputRequest) {
                self.lastDataTrackInputRequest.abort();
            }
            self.lastDataTrackInputRequest = $(self).request();
        }, interval)
    })

    $(document).on('submit', '[data-request]', function documentOnSubmit() {
        $(this).request()
        return false
    })

    $(window).on('beforeunload', function documentOnBeforeUnload() {
        window.ocUnloading = true
    })

    /*
     * Invent our own event that unifies document.ready with window.ajaxUpdateComplete
     *
     * $(document).render(function() { })
     * $(document).on('render', function() { })
     */

    $(document).ready(function triggerRenderOnReady() {
        $(document).trigger('render')
    })

    $(window).on('ajaxUpdateComplete', function triggerRenderOnAjaxUpdateComplete() {
        $(document).trigger('render')
    })

    $.fn.render = function(callback) {
        $(document).on('render', callback)
    }

}(window.jQuery);

/*
 * October CMS JSON Parser
 */
+function(window) { "use strict";
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

    // Global function
    window.ocJSON = function(json) {
        var jsonString = parse(json);
        return JSON.parse(jsonString);
    };

}(window);

/*
 * October CMS jQuery HTML Sanitizer
 * @see https://gist.github.com/ufologist/5a0da51b2b9ef1b861c30254172ac3c9
 */
+function(window) { "use strict";

    function trimAttributes(node) {
        $.each(node.attributes, function() {
            var attrName = this.name;
            var attrValue = this.value;

            /*
             * remove attributes where the names start with "on" (for example: onload, onerror...)
             * remove attributes where the value starts with the "javascript:" pseudo protocol (for example href="javascript:alert(1)")
             */
            if (attrName.indexOf('on') == 0 || attrValue.indexOf('javascript:') == 0) {
                $(node).removeAttr(attrName);
            }
        });
    }

    function sanitize(html) {
        /*
         * [jQuery.parseHTML(data [, context ] [, keepScripts ])](http://api.jquery.com/jQuery.parseHTML/) added: 1.8
         * Parses a string into an array of DOM nodes.
         *
         * By default, the context is the current document if not specified or given as null or undefined. If the HTML was to be used
         * in another document such as an iframe, that frame's document could be used.
         *
         * As of 3.0 the default behavior is changed.
         *
         * If the context is not specified or given as null or undefined, a new document is used.
         * This can potentially improve security because inline events will not execute when the HTML is parsed. Once the parsed HTML
         * is injected into a document it does execute, but this gives tools a chance to traverse the created DOM and remove anything
         * deemed unsafe. This improvement does not apply to internal uses of jQuery.parseHTML as they usually pass in the current
         * document. Therefore, a statement like $( "#log" ).append( $( htmlString ) ) is still subject to the injection of malicious code.
         *
         * without context do not execute script
         * $.parseHTML('<div><img src=1 onerror=alert(1)></div>');
         * $.parseHTML('<div><img src=1 onerror=alert(2)></div>', null);
         *
         * with context document execute script!
         * $.parseHTML('<div><img src=1 onerror=alert(3)></div>', document);
         *
         * Most jQuery APIs that accept HTML strings will run scripts that are included in the HTML. jQuery.parseHTML does not run scripts
         * in the parsed HTML unless keepScripts is explicitly true. However, it is still possible in most environments to execute scripts
         * indirectly, for example via the <img onerror> attribute.
         *
         * will return []
         * $.parseHTML('<script>alert(1)<\/script>', null, false);
         *
         * will return [script DOM element]
         * $.parseHTML('<script>alert(1)<\/script>', null, true);
         */
        var output = $($.parseHTML('<div>' + html + '</div>', null, false));
        output.find('*').each(function() {
            trimAttributes(this);
        });
        return output.html();
    }

    // Global function
    window.ocSanitize = function(html) {
        return sanitize(html)
    };

}(window);