/* ========================================================================
 * October CMS: front-end JavaScript framework
 * http://octobercms.com
 * ========================================================================
 * Copyright 2014 Alexey Bobkov, Samuel Georges
 *
 * ======================================================================== */

if (window.jQuery === undefined)
    throw new Error('The jQuery library is not loaded. The October CMS framework cannot be initialized.');

+function ($) { "use strict";

    var Request = function (element, handler, options) {
        var $el = this.$el = $(element);
        this.options = options || {};

        /*
         * Validate handler name
         */

        if (handler == undefined)
            throw new Error('The request handler name is not specified.')

        if (!handler.match(/^(?:\w+\:{2})?on*/))
            throw new Error('Invalid handler name. The correct handler name format is: "onEvent".')

        /*
         * Detect if page is refreshed to stop any active ajax errors
         */

        var isUnloading = false
        $(window).on('beforeunload', function() { isUnloading = true })

        /*
         * Custom function, requests confirmation from the user
         */

        function handleConfirmMessage(message) {
            var _event = jQuery.Event('ajaxConfirmMessage')

            _event.promise = $.Deferred()
            if ($(window).triggerHandler(_event, [message]) !== undefined) {
                _event.promise.done(function(){
                    options.confirm = null
                    new Request(element, handler, options)
                })
                return false
            }

            if (_event.isDefaultPrevented()) return
            if (message) return confirm(message)
        }

        /*
         * Initiate request
         */

        if (options.confirm && !handleConfirmMessage(options.confirm))
            return

        var
            form = $el.closest('form'),
            context = { handler: handler, options: options },
            loading = options.loading !== undefined && options.loading.length ? $(options.loading) : null,
            isRedirect = options.redirect !== undefined && options.redirect.length

        var _event = jQuery.Event('oc.beforeRequest')
        form.trigger(_event, context)
        if (_event.isDefaultPrevented()) return

        var data = [form.serialize()]

        $.each($el.parents('[data-request-data]').toArray().reverse(), function(){
            data.push($.param(paramToObj('data-request-data', $(this).data('request-data'))))
        })

        if ($el.is(':input') && !form.length) {
            var inputName = $el.attr('name')
            if (options.data[inputName] === undefined)
                options.data[inputName] = $el.val()
        }

        if (options.data !== undefined && !$.isEmptyObject(options.data))
            data.push($.param(options.data))

        var requestOptions = {
            context: context,
            headers: {
                'X-OCTOBER-REQUEST-HANDLER': handler,
                'X-OCTOBER-REQUEST-PARTIALS': this.extractPartials(options.update)
            },
            success: function(data, textStatus, jqXHR) {
                /*
                 * Halt here if beforeUpdate() or data-request-before-update returns false
                 */
                if (this.options.beforeUpdate.apply(this, [data, textStatus, jqXHR]) === false) return
                if (options.evalBeforeUpdate && eval('(function($el, context, data, textStatus, jqXHR) {'+options.evalBeforeUpdate+'}($el, context, data, textStatus, jqXHR))') === false) return

                /*
                 * Trigger 'ajaxBeforeUpdate' on the form, halt if event.preventDefault() is called
                 */
                var _event = jQuery.Event('ajaxBeforeUpdate')
                form.trigger(_event, [context, data, textStatus, jqXHR])
                if (_event.isDefaultPrevented()) return

                /*
                 * Proceed with the update process
                 */
                var updatePromise = requestOptions.handleUpdateResponse(data, textStatus, jqXHR)

                updatePromise.done(function(){
                    form.trigger('ajaxSuccess', [context, data, textStatus, jqXHR])
                    options.evalSuccess && eval('(function($el, context, data, textStatus, jqXHR) {'+options.evalSuccess+'}($el, context, data, textStatus, jqXHR))')
                })

                return updatePromise
            },
            error: function(jqXHR, textStatus, errorThrown) {
                var errorMsg,
                    updatePromise = $.Deferred()

                if (isUnloading)
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

                updatePromise.done(function(){
                    $el.data('error-message', errorMsg)

                    /*
                     * Trigger 'ajaxError' on the form, halt if event.preventDefault() is called
                     */
                    var _event = jQuery.Event('ajaxError')
                    form.trigger(_event, [context, textStatus, jqXHR])
                    if (_event.isDefaultPrevented()) return

                    /*
                     * Halt here if the data-request-error attribute returns false
                     */
                    if (options.evalError && eval('(function($el, context, textStatus, jqXHR) {'+options.evalError+'}($el, context, textStatus, jqXHR))') === false)
                        return

                    requestOptions.handleErrorMessage(errorMsg)
                })

                return updatePromise
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
             * Custom function, handle any application specific response values
             * Using a promisary object here in case injected assets need time to load
             */
            handleUpdateResponse: function(data, textStatus, jqXHR) {

                /*
                 * Update partials and finish request
                 */
                var updatePromise = $.Deferred().done(function(){
                    for (var partial in data) {
                        /*
                         * If a partial has been supplied on the client side that matches the server supplied key, look up 
                         * it's selector and use that. If not, we assume it is an explicit selector reference.
                         */
                        var selector = (options.update[partial]) ? options.update[partial] : partial
                        if (jQuery.type(selector) == 'string' && selector.charAt(0) == '@') {
                            $(selector.substring(1)).append(data[partial]).trigger('ajaxUpdate', [context, data, textStatus, jqXHR])
                        } else if (jQuery.type(selector) == 'string' && selector.charAt(0) == '^') {
                            $(selector.substring(1)).prepend(data[partial]).trigger('ajaxUpdate', [context, data, textStatus, jqXHR])
                        } else
                            $(selector).html(data[partial]).trigger('ajaxUpdate', [context, data, textStatus, jqXHR])
                    }

                    /*
                     * Wait for .html() method to finish rendering from partial updates
                     */
                    setTimeout(function(){
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

                if (isRedirect)
                    window.location.href = options.redirect

                /*
                 * Focus fields with errors
                 */
                if (data['X_OCTOBER_ERROR_FIELDS']) {
                    var isFirstInvalidField = true
                    $.each(data['X_OCTOBER_ERROR_FIELDS'], function(fieldName, fieldMessages){
                        var fieldElement = form.find('[name="'+fieldName+'"], [name="'+fieldName+'[]"], [name$="['+fieldName+']"], [name$="['+fieldName+'][]"]').filter(':enabled').first()
                        if (fieldElement.length > 0) {

                            var _event = jQuery.Event('ajaxInvalidField')
                            $(window).trigger(_event, [fieldElement, fieldName, fieldMessages, isFirstInvalidField])

                            if (isFirstInvalidField) {
                                if (!_event.isDefaultPrevented()) fieldElement.focus()
                                isFirstInvalidField = false
                            }
                        }
                    })
                }

                /*
                 * Handle asset injection
                 */
                 if (data['X_OCTOBER_ASSETS']) {
                    assetManager.load(data['X_OCTOBER_ASSETS'], function(){
                        updatePromise.resolve()
                    })
                 }
                 else
                    updatePromise.resolve()

                return updatePromise
            }
        }

        /*
         * Allow default business logic to be called from user functions
         */
        context.success = requestOptions.success
        context.error = requestOptions.error
        requestOptions = $.extend(requestOptions, options)

        requestOptions.data = data.join('&')

        if (loading) loading.show()

        $(window).trigger('ajaxBeforeSend', [context])
        $el.trigger('ajaxPromise', [context])
        return $.ajax(requestOptions)
            .fail(function(jqXHR, textStatus, errorThrown){
                if (!isRedirect) {
                    $el.trigger('ajaxFail', [context, textStatus, jqXHR])
                    if (loading) loading.hide()
                }
            })
            .done(function(data, textStatus, jqXHR){
                if (!isRedirect) {
                    $el.trigger('ajaxDone', [context, data, textStatus, jqXHR])
                    if (loading) loading.hide()
                }
            })
            .always(function(dataOrXhr, textStatus, xhrOrError){
                $el.trigger('ajaxAlways', [context, dataOrXhr, textStatus, xhrOrError])
            })
    }

    Request.DEFAULTS = {
        update: {},
        type : 'POST',
        beforeUpdate: function(data, textStatus, jqXHR) {},
        evalBeforeUpdate: null,
        evalSuccess: null,
        evalError: null
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

    $.fn.request = function (handler, option) {
        var args = arguments

        var $this = $(this).first()
        var data  = {
            evalBeforeUpdate: $this.data('request-before-update'),
            evalSuccess: $this.data('request-success'),
            evalError: $this.data('request-error'),
            confirm: $this.data('request-confirm'),
            redirect: $this.data('request-redirect'),
            loading: $this.data('request-loading'),
            update: paramToObj('data-request-update', $this.data('request-update')),
            data: paramToObj('data-request-data', $this.data('request-data'))
        }
        if (!handler) handler = $this.data('request')
        var options = $.extend(true, {}, Request.DEFAULTS, data, typeof option == 'object' && option)
        return new Request($this, handler, options)
    }

    $.fn.request.Constructor = Request

    $.request = function (handler, option) {
        return $('<form />').request(handler, option)
    }

    // REQUEST NO CONFLICT
    // =================

    $.fn.request.noConflict = function () {
        $.fn.request = old
        return this
    }

    // REQUEST DATA-API
    // ==============

    function paramToObj(name, value) {
        if (value === undefined) value = ''
        if (typeof value == 'object') return value

        try {
            return JSON.parse(JSON.stringify(eval("({" + value + "})")))
        }
        catch (e) {
            throw new Error('Error parsing the '+name+' attribute value. '+e)
        }
    }

    $(document).on('change', 'select[data-request], input[type=radio][data-request], input[type=checkbox][data-request]', function(){
        $(this).request()
    })

    $(document).on('click', 'a[data-request], button[data-request], input[type=button][data-request], input[type=submit][data-request]', function(){
        $(this).request()
        return false
    })

    $(document).on('keydown', 'input[type=text][data-request], input[type=submit][data-request], input[type=password][data-request]', function(e){
        if (e.keyCode == 13) {
            if (this.dataTrackInputTimer !== undefined)
                window.clearTimeout(this.dataTrackInputTimer)

            $(this).request()
            return false
        }
    })

    $(document).on('keyup', 'input[type=text][data-request][data-track-input], input[type=password][data-request][data-track-input]', function(e){
        var
            $el = $(this),
            lastValue = $el.data('oc.lastvalue')

        if (lastValue !== undefined && lastValue == this.value)
            return

        $el.data('oc.lastvalue', this.value)

        if (this.dataTrackInputTimer !== undefined)
            window.clearTimeout(this.dataTrackInputTimer)

        var interval = $(this).data('track-input')
        if (!interval)
            interval = 300

        var self = this
        this.dataTrackInputTimer = window.setTimeout(function(){
            $(self).request()
        }, interval)
    })

    $(document).on('submit', '[data-request]', function(){
        $(this).request()
        return false
    })

    /*
     * Invent our own event that unifies document.ready with window.ajaxUpdateComplete
     * 
     * $(document).render(function() { })
     * $(document).on('render', function(){ })
     */

    $(document).ready(function(){
        $(document).trigger('render')
    })

    $(window).on('ajaxUpdateComplete', function() {
        $(document).trigger('render')
    })

    $.fn.render = function(callback) {
        $(document).on('render', callback)
    }

}(window.jQuery);
