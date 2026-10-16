/*
 * Ajax Popup plugin
 *
 * Documentation: ../docs/popup.md
 *
 * Require:
 *  - bootstrap/modal
 */

+function($) { "use strict";

    var Base = $.oc.foundation.base,
        BaseProto = Base.prototype

    // POPUP CLASS DEFINITION
    // ============================

    var Popup = function(element, options) {
        this.options = options;
        this.$el = $(element);
        this.$container = null;
        this.$modal = null;
        this.$backdrop = null;
        this.isOpen = false;
        this.isLoading = false;
        this.firstDiv = null;
        this.allowHide = true;

        this.$container = this.createPopupContainer()
        this.$content = $('.modal-content:first', this.$container);
        this.$dialog = $('.modal-dialog:first', this.$container);
        this.$modal = this.$container.modal({
            show: false,
            backdrop: false,
            keyboard: this.options.keyboard,
            focus: false
        });

        $.oc.foundation.controlUtils.markDisposable(element);
        Base.call(this);

        this.initEvents();
        this.init();
    }

    Popup.prototype = Object.create(BaseProto)
    Popup.prototype.constructor = Popup

    Popup.DEFAULTS = {
        ajax: null,
        handler: null,
        keyboard: true,
        extraData: {},
        content: null,
        size: null,
        adaptiveHeight: false,
        zIndex: null
    }

    Popup.prototype.init = function() {
        var self = this;

        // Do not allow the same popup to open twice
        if (self.isOpen) {
            return;
        }

        // Show loading panel
        this.setBackdrop(true);

        if (!this.options.content) {
            this.setLoading(true);
        }

        // October AJAX
        if (this.options.handler) {
            this.$el.request(this.options.handler, {
                data: paramToObj('data-extra-data', this.options.extraData),
                success: function(data, statusCode, xhr) {
                    if (data instanceof Blob) {
                        if (self.isLoading) {
                            self.hideLoading();
                        }
                        else {
                            self.hide();
                        }
                        self.triggerEvent('popup:download');
                        this.success(data, statusCode, xhr);
                        return;
                    }

                    this.success(data, statusCode, xhr).done(function() {
                        self.setContent(data.result);
                        $(window).trigger('ajaxUpdateComplete', [this, data, statusCode, xhr]);
                        self.triggerEvent('popupComplete');
                        self.triggerEvent('complete.oc.popup');
                    });
                },
                error: function(data, statusCode, xhr) {
                    this.error(data, statusCode, xhr).done(function() {
                        if (self.isLoading) {
                            self.hideLoading();
                        }
                        else {
                            self.hide();
                        }
                        self.triggerEvent('popupError');
                        self.triggerEvent('error.oc.popup');
                    });
                },
                cancel: function() {
                    if (self.isLoading) {
                        self.hideLoading();
                    }
                    else {
                        self.hide();
                    }
                }
            });

        }
        // Regular AJAX
        else if (this.options.ajax) {
            $.ajax({
                url: this.options.ajax,
                data: paramToObj('data-extra-data', this.options.extraData),
                success: function(data) {
                    self.setContent(data)
                },
                cache: false
            });
        }
        // Specified content
        else if (this.options.content) {
            var content = typeof this.options.content == 'function'
                ? this.options.content.call(this.$el[0], this)
                : this.options.content;

            this.setContent(content);
        }
    }

    Popup.prototype.initEvents = function() {
        var self = this;

        // Duplicate the popup reference on the .control-popup container
        this.$container.data('oc.popup', this);

        // Hook in to BS Modal events
        this.$modal.on('hide.bs.modal', function() {
            self.triggerEvent('hide.oc.popup');
            self.isOpen = false;
            self.setBackdrop(false);
        });

        this.$modal.on('hidden.bs.modal', function() {
            self.triggerEvent('hidden.oc.popup');
            $.oc.foundation.controlUtils.disposeControls(self.$container.get(0));
            self.$container.remove();
            $(document.body).removeClass('modal-open');
            self.dispose();
        });

        this.$modal.on('show.bs.modal', function() {
            self.isOpen = true;
            self.setBackdrop(true);
            $(document.body).addClass('modal-open');
        });

        this.$modal.on('shown.bs.modal', function() {
            self.triggerEvent('shown.oc.popup');
        });

        this.$modal.on('close.oc.popup', function() {
            self.hide();
            return false;
        });

        oc.Events.dispatch('popup:show');
    }

    Popup.prototype.dispose = function() {
        this.$modal.off('hide.bs.modal');
        this.$modal.off('hidden.bs.modal');
        this.$modal.off('show.bs.modal');
        this.$modal.off('shown.bs.modal');
        this.$modal.off('close.oc.popup');

        this.$el.off('dispose-control', this.proxy(this.dispose));
        this.$el.removeData('oc.popup');
        this.$container.removeData('oc.popup');

        this.$container = null;
        this.$content = null;
        this.$dialog = null;
        this.$modal = null;
        this.$el = null;

        // In some cases options could contain callbacks,
        // so it's better to clean them up too.
        this.options = null;

        BaseProto.dispose.call(this);
    }

    Popup.prototype.createPopupContainer = function() {
        var
            modal = $('<div />').prop({
                class: 'control-popup modal fade',
                role: 'dialog',
                tabindex: -1
            }),
            modalDialog = $('<div />').addClass('modal-dialog'),
            modalContent = $('<div />').addClass('modal-content');

        if (this.options.size) {
            modalDialog.addClass('size-' + this.options.size);
        }

        if (this.options.adaptiveHeight) {
            modalDialog.addClass('adaptive-height');
        }

        if (this.options.zIndex !== null) {
            modal.css('z-index', this.options.zIndex + 20);
        }

        return modal.append(modalDialog.append(modalContent));
    }

    Popup.prototype.setContent = function(contents) {
        var contentNode = $(contents);

        // Set the popup size from the inner contents instead
        // of needing it from the calling code
        if (contentNode.data('popup-size')) {
            this.$dialog.addClass('size-' + contentNode.data('popup-size'));
        }
        else {
            var $defaultSize = $('[data-popup-size]', contentNode);
            if ($defaultSize.length > 0) {
                this.$dialog.addClass('size-' + $defaultSize.data('popup-size'));
            }
        }

        this.setLoading(false);
        this.$modal.modal('show');
        this.$content.html(contentNode);
        this.triggerShowEvent();

        // Duplicate the popup object reference on to the first div
        // inside the popup. Eg: $('#firstDiv').popup('hide')
        this.firstDiv = this.$content.find('>div:first');
        if (this.firstDiv.length > 0) {
            this.firstDiv.data('oc.popup', this)
        }

        var $defaultFocus = $('[default-focus],[autofocus]', this.$content);
        if ($defaultFocus.is(":visible")) {
            window.setTimeout(function() {
                $defaultFocus.focus();
                $defaultFocus = null;
            }, 300);
        }
    }

    Popup.prototype.setBackdrop = function(val) {
        if (val && !this.$backdrop) {
            this.$backdrop = $('<div class="popup-backdrop fade" />');

            if (this.options.zIndex !== null) {
                this.$backdrop.css('z-index', this.options.zIndex);
            }

            this.$backdrop.appendTo(document.body);

            this.$backdrop.addClass('show');
            this.$backdrop.append($('<div class="modal-content popup-loading-indicator" />'));
        }
        else if (!val && this.$backdrop) {
            this.$backdrop.remove();
            this.$backdrop = null;
        }
    }

    Popup.prototype.setLoading = function(val) {
        if (!this.$backdrop) {
            return;
        }

        this.isLoading = val;

        if (val) {
            setTimeout(() => {
                if (this.$backdrop) {
                    this.$backdrop.addClass('loading');
                }
            }, 100);
        }
        else {
            setTimeout(() => {
                if (this.$backdrop) {
                    this.$backdrop.removeClass('loading');
                }
            }, 100);
        }
    }

    Popup.prototype.setShake = function() {
        var self = this;

        this.$content.addClass('popup-shaking');

        setTimeout(function() {
            self.$content.removeClass('popup-shaking');
        }, 1000)
    }

    Popup.prototype.hideLoading = function(val) {
        this.setLoading(false);

        // Wait for animations to complete
        var self = this;
        setTimeout(function() { self.setBackdrop(false) }, 250);
        setTimeout(function() { self.hide() }, 300);
    }

    Popup.prototype.triggerEvent = function(eventName, params) {
        if (!params) {
            params = [this.$el, this.$modal];
        }

        var eventObject = jQuery.Event(eventName, { relatedTarget: this.$container.get(0) });

        this.$el.trigger(eventObject, params);

        if (this.firstDiv) {
            this.firstDiv.trigger(eventObject, params);
        }
    }

    Popup.prototype.reload = function() {
        this.init();
    }

    Popup.prototype.show = function() {
        this.$modal.modal('show');
        this.triggerShowEvent();
    }

    Popup.prototype.triggerShowEvent = function() {
        this.$modal.on('click.dismiss.popup', '[data-dismiss="popup"]', $.proxy(this.hide, this));
        this.triggerEvent('popupShow');
        this.triggerEvent('show.oc.popup');

        // Fixes an issue where the Modal makes `position: fixed` elements relative to itself
        // https://github.com/twbs/bootstrap/issues/15856
        this.$dialog.css('transform', 'inherit');
    }

    Popup.prototype.hide = function() {
        if (!this.isOpen) return

        this.triggerEvent('popupHide');
        this.triggerEvent('hide.oc.popup');

        if (this.allowHide) {
            this.$modal.modal('hide');
        }

        // Fixes an issue where the Modal makes `position: fixed` elements relative to itself
        // https://github.com/twbs/bootstrap/issues/15856
        this.$dialog.css('transform', '');
    }

    /*
     * Hide the popup without destroying it,
     * you should call .hide() once finished
     */
    Popup.prototype.visible = function(val) {
        if (val) {
            this.$modal.addClass('show');
        }
        else {
            this.$modal.removeClass('show');
        }

        this.setBackdrop(val);
    }

    Popup.prototype.toggle = function() {
        this.triggerEvent('toggle.oc.popup', [this.$modal]);

        this.$modal.modal('toggle');
    }

    /*
     * Lock the popup from closing
     */
    Popup.prototype.lock = function(val) {
        this.allowHide = !val;
    }

    // POPUP PLUGIN DEFINITION
    // ============================

    var old = $.fn.popup;

    $.fn.popup = function(option) {
        var args = Array.prototype.slice.call(arguments, 1);
        return this.each(function() {
            var $this   = $(this)
            var data    = $this.data('oc.popup')
            var options = $.extend({}, Popup.DEFAULTS, $this.data(), typeof option == 'object' && option)
            if (!data) $this.data('oc.popup', (data = new Popup(this, options)))
            else if (typeof option == 'string') data[option].apply(data, args)
            else data.reload()
        });
    }

    $.fn.popup.Constructor = Popup;

    $.popup = function(option) {
        return $('<a />').popup(option);
    }

    // POPUP NO CONFLICT
    // =================

    $.fn.popup.noConflict = function() {
        $.fn.popup = old;
        return this;
    }

    // POPUP DATA-API
    // ===============

    function paramToObj(name, value) {
        if (value === undefined) value = '';
        if (typeof value == 'object') return value;

        try {
            return oc.parseJSON("{" + value + "}");
        }
        catch (e) {
            throw new Error('Error parsing the '+name+' attribute value. '+e);
        }
    }

    $(document).on('click.oc.popup', '[data-control~="popup"]', function(event) {
        event.preventDefault();

        $(this).popup();
    });

    // Popup loading indicator will only show if the handlers are an exact match.
    $(document)
        // Prevent subsequent requests while loading (mis-doubleclick)
        .on('ajax:setup', '[data-popup-load-indicator]', function(event) {
            if ($(this).data('request') !== event.detail.context.handler) return;
            if (!$(this).closest('.control-popup').hasClass('show')) event.preventDefault();
        })
        // Hide popup during AJAX
        .on('ajax:promise', '[data-popup-load-indicator]', function(event) {
            if ($(this).data('request') !== event.detail.context.handler) return;
            $(this).closest('.control-popup').removeClass('show').popup('setLoading', true);
        })
        // Request failed, show popup again
        .on('ajax:fail', '[data-popup-load-indicator]', function(event) {
            if ($(this).data('request') !== event.detail.context.handler) return;
            $(this).closest('.control-popup').addClass('show').popup('setLoading', false).popup('setShake');
        })
        // Request complete, hide loader
        .on('ajax:done', '[data-popup-load-indicator]', function(event) {
            if ($(this).data('request') !== event.detail.context.handler) return;
            $(this).closest('.control-popup').popup('hideLoading');
        });

    oc.popup = Popup;

    // This function transfers the supplied variables as hidden form inputs,
    // to any popup that is spawned within the supplied container. The spawned
    // popup must contain a form element.
    oc.popup.bindToPopups = (container, vars) => {
        $(container).on('show.oc.popup', function(event, $trigger, $modal){
            var $form = $('form', $modal)
            $.each(vars, function(name, value){
                $form.prepend($('<input />').attr({ type: 'hidden', name: name, value: value }));
            });

            // Popups spawned within this popup need the variables too
            oc.popup.bindToPopups($modal, vars);
        });
    };

    // This will focus the first element if no other autofocus attribute is found,
    // uses a specific delay to account for the CSS animations used by the modal.
    oc.popup.focusFirstInput = (container) => {
        setTimeout(function() {
            var $container = $(container);
            if (!$('[default-focus],[autofocus]', $container).length) {
                $('input.form-control:first', $container).focus();
            }
        }, 310);
    };

}(window.jQuery);
