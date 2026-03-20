// Set oc namespace from jax
window.oc = window.jax;
window.oc.serializeJSON = window.oc.values;

// jQuery compatibility layer
(function() {
    // Avoid detection from webpack
    var $ = window['jQ' + 'uery'];
    if ($ === undefined) {
        return;
    }

    bindRequestFunc();
    bindRenderFunc();
    bindjQueryEvents();
    bindOcNamespace();

    function bindRequestFunc() {
        var old = $.fn.request;

        $.fn.request = function(handler, option) {
            var options = typeof option === 'object' ? option : {};
            return oc.request(this.get(0), handler, options);
        }

        $.fn.request.Constructor = oc.request;

        // Basic function
        $.request = function(handler, option) {
            return $(document).request(handler, option);
        }

        // No conflict
        $.fn.request.noConflict = function() {
            $.fn.request = old;
            return this;
        }
    }

    function bindRenderFunc() {
        $.fn.render = function(callback) {
            $(document).on('render', callback);
        };
    }

    function bindOcNamespace() {
        if ($.oc === undefined) {
            $.oc = {};
        }

        $.oc.flashMsg = window.jax.flashMsg;
        $.oc.stripeLoadIndicator = window.jax.progressBar;
    }

    function bindjQueryEvents() {
        // Element
        migratejQueryEvent(document, 'ajax:setup', 'ajaxSetup', ['context']);
        migratejQueryEvent(document, 'ajax:promise', 'ajaxPromise', ['context']);
        migratejQueryEvent(document, 'ajax:fail', 'ajaxFail', ['context', 'data', 'responseCode', 'xhr']);
        migratejQueryEvent(document, 'ajax:done', 'ajaxDone', ['context', 'data', 'responseCode', 'xhr']);
        migratejQueryEvent(document, 'ajax:always', 'ajaxAlways', ['context', 'data', 'responseCode', 'xhr']);
        migratejQueryEvent(document, 'ajax:before-redirect', 'ajaxRedirect');

        // Updated Element
        migratejQueryEvent(document, 'ajax:update', 'ajaxUpdate', ['context', 'data', 'responseCode', 'xhr']);
        migratejQueryEvent(document, 'ajax:before-replace', 'ajaxBeforeReplace');

        // Trigger Element
        migratejQueryEvent(document, 'ajax:before-request', 'oc.beforeRequest', ['context']);
        migratejQueryEvent(document, 'ajax:before-update', 'ajaxBeforeUpdate', ['context', 'data', 'responseCode', 'xhr']);
        migratejQueryEvent(document, 'ajax:request-success', 'ajaxSuccess', ['context', 'data', 'responseCode', 'xhr']);
        migratejQueryEvent(document, 'ajax:request-complete', 'ajaxComplete', ['context', 'data', 'responseCode', 'xhr']);
        migratejQueryEvent(document, 'ajax:request-error', 'ajaxError', ['context', 'message', 'responseCode', 'xhr']);
        migratejQueryEvent(document, 'ajax:before-validate', 'ajaxValidation', ['context', 'message', 'fields']);

        // Window
        migratejQueryEvent(window, 'ajax:before-send', 'ajaxBeforeSend', ['context']);
        migratejQueryEvent(window, 'ajax:update-complete', 'ajaxUpdateComplete', ['context', 'data', 'responseCode', 'xhr']);
        migratejQueryEvent(window, 'ajax:invalid-field', 'ajaxInvalidField', ['element', 'fieldName', 'errorMsg', 'isFirst']);
        migratejQueryEvent(window, 'ajax:confirm-message', 'ajaxConfirmMessage', ['message', 'promise']);
        migratejQueryEvent(window, 'ajax:error-message', 'ajaxErrorMessage', ['message']);

        // Data adapter
        migratejQueryAttachData(document, 'ajax:setup', 'a[data-request], button[data-request], form[data-request], a[data-handler], button[data-handler]');
    }

    function migratejQueryEvent(target, jsName, jqName, detailNames) {
        detailNames = detailNames || [];
        $(target).on(jsName, function(ev) {
            triggerjQueryEvent(ev.originalEvent, jqName, detailNames);
        });
    }

    function triggerjQueryEvent(ev, eventName, detailNames) {
        detailNames = detailNames || [];
        var jQueryEvent = $.Event(eventName),
            args = buildDetailArgs(ev, detailNames);

        $(ev.target).trigger(jQueryEvent, args);

        if (jQueryEvent.isDefaultPrevented()) {
            ev.preventDefault();
        }
    }

    function buildDetailArgs(ev, detailNames) {
        var args = [];

        detailNames.forEach(function(name) {
            args.push(ev.detail[name]);
        });

        return args;
    }

    // For instances where data() is populated in the jQ instance
    function migratejQueryAttachData(target, eventName, selector) {
        $(target).on(eventName, selector, function(event) {
            var dataObj = $(this).data('request-data');
            if (!dataObj) {
                return;
            }

            var options = event.detail.context.options;
            if (dataObj.constructor === {}.constructor) {
                Object.assign(options.data, dataObj);
            }
            else if (typeof dataObj === 'string') {
                Object.assign(options.data, paramToObj('request-data', dataObj));
            }
        });
    }

    function paramToObj(name, value) {
        if (value === undefined) {
            value = '';
        }

        if (typeof value === 'object') {
            return value;
        }

        if (value.charAt(0) !== '{') {
            value = "{" + value + "}";
        }

        try {
            return oc.parseJSON(value);
        }
        catch (e) {
            throw new Error('Error parsing the ' + name + ' attribute value. ' + e);
        }
    }
})();
