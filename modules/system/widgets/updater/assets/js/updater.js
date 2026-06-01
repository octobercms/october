/*
 * Updates class
 *
 * Dependencies:
 * - Waterfall plugin (waterfall.js)
 */

+function ($) { "use strict";

    var Updater = function () {

        // Init
        this.init();
    }

    Updater.prototype.init = function() {
        this.activeStep = null;
        this.updateSteps = null;
        this.outputCount = 0;
        this.waitLongerTimer = null;
        this.hasTriedAgain = false;
        this.unloadEventHandler = (event) => {
            event.preventDefault();
            return event.returnValue = $('#executeMessage').data('unload-warning');
        };
    }

    Updater.prototype.check = function() {
        var $form = $('#updateForm'),
            self = this;

        $form.request('onCheckForUpdates').done(function() {
            self.evalConfirmedUpdates();
        });

        $form.on('change', '[data-important-update-select]', function() {
            var $el = $(this),
                selectedValue = $el.val(),
                $updateItem = $el.closest('.update-item');

            $updateItem.removeClass('item-danger item-muted item-success');

            if (selectedValue == 'confirm') {
                $updateItem.addClass('item-success');
            }
            else if (selectedValue == 'ignore' || selectedValue == 'skip') {
                $updateItem.addClass('item-muted');
            }
            else {
                $updateItem.addClass('item-danger');
            }

            self.evalConfirmedUpdates();
        });
    }

    Updater.prototype.evalConfirmedUpdates = function() {
        var $form = $('#updateForm'),
            hasConfirmed = false;

        $('[data-important-update-select]', $form).each(function() {
            if ($(this).val() == '') {
                hasConfirmed = true;
            }
        })

        if (hasConfirmed) {
            $('#updateListUpdateButton').prop('disabled', true);
            $('#updateListImportantLabel').show();
        }
        else {
            $('#updateListUpdateButton').prop('disabled', false);
            $('#updateListImportantLabel').hide();
        }
    }

    Updater.prototype.execute = function(steps) {
        this.updateSteps = steps;
        this.resetOutput();
        this.runUpdate();
    }

    Updater.prototype.runUpdate = function(fromStep) {
        var self = this;

        $.waterfall
            .apply(this, this.buildEventChain(this.updateSteps, fromStep))
            .fail(function(reason) {
                if (reason.constructor !== {}.constructor) {
                    reason = { reason: reason };
                }

                var template = $('#executeFailed').html(),
                    html = Mustache.render(template, reason);

                $('#executeActivity').hide();
                $('#executeStatus').html(html);

                if (self.shouldTryAgain(reason)) {
                    self.retryUpdate();
                }
            })
            .done(function() {
                self.setUnloadWarning(false);
            });
    }

    Updater.prototype.retryUpdate = function() {
        $('#executeActivity').show();
        $('#executeStatus').html('');

        this.resetOutput();
        this.runUpdate(this.activeStep);
    }

    Updater.prototype.buildEventChain = function(steps, fromStep) {
        var self = this,
            eventChain = [],
            skipStep = fromStep ? true : false;

        $.each(steps, function(index, step) {
            if (step == fromStep) {
                skipStep = false;
            }

            // Continue
            if (skipStep) {
                return true;
            }

            eventChain.push(function() {
                var deferred = $.Deferred();

                self.activeStep = step;
                self.resetOutput();
                self.setLoadingBar(true, step.label);

                $.request('onExecuteStep', {
                    data: step,
                    progressBar: false,
                    success: function(data) {
                        setTimeout(function() { deferred.resolve() }, 600);

                        if (step.type == 'final') {
                            self.setUnloadWarning(false);
                            this.success(data);
                        }
                        else {
                            self.setLoadingBar(false);
                        }
                    },
                    error: function(data, statusCode) {
                        self.setLoadingBar(false);
                        if (data && data.output) {
                            self.showOutput(data.output);
                        }

                        if (statusCode == 504) {
                            self.timeoutRejection(deferred);
                        }
                        else if (data) {
                            deferred.reject(data.error || (data + ""));
                        }
                        else {
                            deferred.reject('General Error. Status code: ' + statusCode);
                        }
                    }
                });

                return deferred;
            });
        });

        return eventChain;
    }

    Updater.prototype.timeoutRejection = function(deferred) {
        var webserverHints = '';
        [
            ['Apache', 'https://httpd.apache.org/docs/2.4/mod/core.html#timeout'],
            ['Nginx', 'http://nginx.org/en/docs/http/ngx_http_fastcgi_module.html#fastcgi_read_timeout']
        ]
        .forEach(function(webserver, index) {
            webserverHints += (index !== 0 ? ', ' : '') + '<a target=\"_blank\" rel=\"noopener noreferrer\" href=\"'+ webserver[1] +'\">' + webserver[0] +'</a>';
        });

        var $lang = document.querySelector('#executePopup');
        deferred.reject({
            reason: $lang.getAttribute('data-lang-operation-timeout-comment'),
            advice: $lang.getAttribute('data-lang-operation-timeout-hint').replace(':name', webserverHints)
        });
    }

    Updater.prototype.shouldTryAgain = function(reason) {
        if (this.hasTriedAgain) {
            return false;
        }
        this.hasTriedAgain = true;

        if (!reason || !reason.reason) {
            return false;
        }
        var message = reason.reason;

        // Source Guardian protection from hot swapping classes
        if (message.includes('SourceGuardian Loader')) {
            return true;
        }

        // Composer self updated and nuked itself
        if (message.includes('Composer') && message.includes('InstalledVersions.php')) {
            return true;
        }

        return false;
    }

    Updater.prototype.setLoadingBar = function(state, message) {
        var loadingBar = $('#executeLoadingBar'),
            messageDiv = $('#executeMessage');

        if (state) {
            loadingBar.removeClass('bar-loaded');
        }
        else {
            loadingBar.addClass('bar-loaded');
        }

        if (message) {
            messageDiv.text(message);
        }

        // Keep waiting message
        clearTimeout(this.waitLongerTimer);
        loadingBar.removeClass('fadeCycle');

        if (state) {
            this.waitLongerTimer = setTimeout(function() {
                messageDiv.text(messageDiv.data('wait-longer'));
                loadingBar.addClass('fadeCycle');
            }, 80 * 1000);
        }

        // Unload warning
        this.setUnloadWarning(state);
    }

    Updater.prototype.setUnloadWarning = function(state) {
        if (state) {
            addEventListener('beforeunload', this.unloadEventHandler, { capture: true });
        }
        else {
            removeEventListener('beforeunload', this.unloadEventHandler, { capture: true });
        }
    }

    Updater.prototype.showOutput = function(result) {
        var self = this;

        result.split(/\r?\n/).forEach(function(message) {
            self.outputMessage(message);
        });

        $('#executeOutput').show();

        // Scroll to bottom
        var $scrollbar = $('#executeOutput .control-scrollbar:first');
        $scrollbar.get(0).scrollTop = $scrollbar.get(0).scrollHeight;

        // Trigger scrollbar
        $(window).trigger('resize');
    }

    Updater.prototype.outputMessage = function(message) {
        if (typeof message !== 'string') {
            return;
        }

        if (message.trim().length === 0) {
            return;
        }

        this.outputCount++;

        var $updateItem = $('<div />').addClass('update-item').append(
            $('<dl />').append(
                $('<dt />').html(this.outputCount)
            ).append(
                $('<dd />').html(message)
            )
        );

        $('#executeOutput [data-output-items]:first').append($updateItem);

        // Trigger scrollbar
        $(window).trigger('resize');
    }

    Updater.prototype.resetOutput = function() {
        $('#executeOutput').hide();
        $('#executeOutput [data-output-items]:first').empty();
        this.outputCount = 0;
    }

    if ($.oc === undefined) {
        $.oc = {};
    }

    $.oc.updater = new Updater;

}(window.jQuery);
