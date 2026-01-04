/*
 * Backend Snackbar system
 *
 * JavaScript API:
 * $.oc.snackbar.show('Message', {timeout: 5000, action: {label: 'Retry', callback: onRetry}});
 *
 * Snackbars disappear automatically, but can be dismissed by users.
 * The default timeout is 4 seconds. The action parameter is optional.
 * Action label and callback properties are required.
 */

+(function($) {
    'use strict';
    if ($.oc === undefined) $.oc = {};

    var Snackbar = function() {
        var queue = [],
            lastUniqueId = 0,
            displayedMessage = null;

        function validateOptions(options) {
            if (options === undefined) {
                return;
            }

            if (typeof options !== 'object') {
                throw new Error('Snackbar options must be an object');
            }

            if (options.replace !== undefined) {
                if (typeof options.replace !== 'number') {
                    throw new Error('Snackbar options.replace must be a number');
                }
            }

            if (options.timeout !== undefined) {
                if (typeof options.timeout !== 'number') {
                    throw new Error('Snackbar options.timeout must be a number');
                }

                if (options.timeout < 2000) {
                    throw new Error('Snackbar options.timeout cannot be lower than 2000');
                }

                if (options.timeout > 8000) {
                    throw new Error('Snackbar options.timeout cannot be higher than 8000');
                }
            }

            if (options.action !== undefined) {
                if (typeof options.action !== 'object') {
                    throw new Error('Snackbar options.action must be an object');
                }

                if (typeof options.action.label !== 'string') {
                    throw new Error('Snackbar options.action.label must be a string');
                }

                if (typeof options.action.callback !== 'function') {
                    throw new Error('Snackbar options.action.callback must be a function');
                }
            }
        }

        function runQueue() {
            if (displayedMessage !== null) {
                return;
            }

            var parameters = queue.shift();
            if (parameters === undefined) {
                return;
            }

            buildSnackbar(parameters);
        }

        function makeUniqueId() {
            return ++lastUniqueId;
        }

        function buildSnackbar(parameters) {
            displayedMessage = {
                uniqueId: parameters.uniqueId
            };

            var $element = $(
                    '\
                    <div class="october-snackbar"> \
                        <div class="snackbar-label"></div> \
                        <button class="snackbar-dismiss" aria-title="Dismiss">X</button> \
                    </div>'
                ),
                $label = $element.find('.snackbar-label');

            $label.text(parameters.message);
            $element.find('.snackbar-dismiss').one('click.snackbar', function() {
                hideSnackbar($element, parameters.options);
            });

            if (parameters.options && parameters.options.action) {
                var $actionButton = $('<button class="snackbar-action"></button>');

                $actionButton.text(parameters.options.action.label);
                $actionButton.one('click.snackbar', function() {
                    parameters.options.action.callback();
                    hideSnackbar($element, parameters.options);
                });

                $actionButton.insertAfter($label);
            }

            $(document.body).append($element);

            displayedMessage.element = $element;
            displayedMessage.uniqueId = parameters.uniqueId;
            displayedMessage.options = parameters.options;

            setTimeout(function() {
                $element.addClass('enter');

                setTimeout(function() {
                    $element.addClass('show-snackbar');

                    startHideTimeout($element, parameters.options);
                }, 20);
            }, 1);
        }

        function startHideTimeout($element, options) {
            var timeout = 2000;

            if (options && options.timeout) {
                timeout = options.timeout;
            }

            options.timeoutId = setTimeout(function() {
                hideSnackbar($element, options);
            }, timeout);
        }

        function hideSnackbar($element, options) {
            $element.find('button').off('.snackbar');
            $element.removeClass('show-snackbar');

            clearTimeout(options.timeoutId);

            setTimeout(function() {
                displayedMessage = null;
                $element.remove();
                runQueue();
            }, 210);
        }

        function forceHideSnackbar($element, options) {
            clearTimeout(options.timeoutId);

            options.timeoutId = setTimeout(function() {
                hideSnackbar($element, options);
            }, 200);
        }

        function removeFromQueue(uniqueId) {
            for (var index = 0; index < queue.length; index++) {
                if (queue[index].uniqueId == uniqueId) {
                    queue.splice(index, 1);
                    return;
                }
            }
        }

        this.show = function(message, options) {
            validateOptions(options);

            if (options && options.replace) {
                if (displayedMessage && options.replace === displayedMessage.uniqueId) {
                    forceHideSnackbar(displayedMessage.element, displayedMessage.options);
                }
                else {
                    removeFromQueue(options.replace);
                }
            }

            var uniqueId = makeUniqueId();
            queue.push({
                message: message,
                options: options || {},
                uniqueId: uniqueId
            });

            runQueue();

            return uniqueId;
        };

        this.hide = function(uniqueId) {
            if (displayedMessage && uniqueId === displayedMessage.uniqueId) {
                forceHideSnackbar(displayedMessage.element, displayedMessage.options);
            }
        };
    };

    oc.snackbar = new Snackbar();

    // @deprecated
    $.oc.snackbar = oc.snackbar;
})(window.jQuery);
