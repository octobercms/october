/*
 * Ajax Popup plugin
 *
 * Options:
 * - content: content HTML string or callback
 * 
 * Data attributes:
 * - data-control="popup" - enables the ajax popup plugin
 * - data-ajax="popup-content.htm" - ajax content to load
 * - data-handler="widget:pluginName" - October ajax request name
 * - data-keyboard="false" - Allow popup to be closed with the keyboard
 * - data-request-data="file_id: 1" - October ajax request data
 * - data-size="large" - Popup size, available sizes: giant, huge, large, small, tiny
 *
 * JavaScript API:
 * $('a#someLink').popup({ ajax: 'popup-content.htm' })
 * $('a#someLink').popup({ handler: 'onOpenPopupForm' })
 *
 * Dependences:
 * - Bootstrap Modal (modal.js)
 */

+function ($) { "use strict";

    // POPUP CLASS DEFINITION
    // ============================

    var Popup = function(element, options) {
        var self = this
        this.options    = options
        this.$el        = $(element)
        this.$container = null
        this.$modal     = null
        this.$backdrop  = null
        this.isOpen     = false
        this.firstDiv   = null
        this.allowHide  = true

        this.$container = this.createPopupContainer()
        this.$content = this.$container.find('.modal-content:first')
        this.$modal = this.$container.modal({ show: false, backdrop: false, keyboard: this.options.keyboard })

        /*
         * Duplicate the popup reference on the .control-popup container
         */
        this.$container.data('oc.popup', this)

        /*
         * Hook in to BS Modal events
         */
        this.$modal.on('hide.bs.modal', function(){
            self.isOpen = false
            self.setBackdrop(false)
        })

        this.$modal.on('hidden.bs.modal', function(){
            self.$container.remove()
            self.$el.data('oc.popup', null)
        })

        this.$modal.on('show.bs.modal', function(){
            self.isOpen = true
            self.setBackdrop(true)
        })

        this.$modal.on('shown.bs.modal', function(){
            self.triggerEvent('shown.oc.popup')
        })

        this.$modal.on('close.oc.popup', function(){
            self.hide()
            return false
        })

        this.init()
    }

    Popup.DEFAULTS = {
        ajax: null,
        handler: null,
        keyboard: true,
        extraData: {},
        content: null,
        size: null
    }

    Popup.prototype.init = function(){
        var self = this

        /*
         * Do not allow the same popup to open twice
         */
        if (self.isOpen)
            return

        /*
         * Show loading panel
         */
        this.setBackdrop(true)

        if (!this.options.content)
            this.setLoading(true)

        /*
         * October AJAX
         */
        if (this.options.handler) {

            this.$el.request(this.options.handler, {
                data: this.options.extraData,
                success: function(data, textStatus, jqXHR) {
                    this.success(data, textStatus, jqXHR).done(function(){
                        self.setContent(data.result)
                        $(window).trigger('ajaxUpdateComplete', [this, data, textStatus, jqXHR])
                        self.triggerEvent('popupComplete') // Deprecated
                        self.triggerEvent('complete.oc.popup')
                    })
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    this.error(jqXHR, textStatus, errorThrown).done(function(){
                        self.hide()
                        self.triggerEvent('popupError') // Deprecated
                        self.triggerEvent('error.oc.popup')
                    })
                }
            })

        }

        /*
         * Regular AJAX
         */
        else if (this.options.ajax) {

            $.ajax({
                url: this.options.ajax,
                data: this.options.extraData,
                success: function(data) {
                    self.setContent(data)
                },
                cache: false
            })

        }

        /*
         * Specified content
         */
        else if (this.options.content) {

            var content = typeof this.options.content == 'function'
                ? this.options.content.call(this.$el[0], this)
                : this.options.content

            this.setContent(content)
        }
    }

    Popup.prototype.createPopupContainer = function() {
        var
            modal = $('<div />').prop({
                class: 'control-popup modal fade',
                role: 'dialog',
                tabindex: -1
            }),
            modalDialog = $('<div />').addClass('modal-dialog'),
            modalContent = $('<div />').addClass('modal-content')

        if (this.options.size)
            modalDialog.addClass('size-' + this.options.size)

        return modal.append(modalDialog.append(modalContent))
    }

    Popup.prototype.setContent = function(contents) {
        this.$content.html(contents)
        this.setLoading(false)
        this.show()

        // Duplicate the popup object reference on to the first div
        // inside the popup. Eg: $('#firstDiv').popup('hide')
        this.firstDiv = this.$content.find('>div:first')
        if (this.firstDiv.length > 0)
            this.firstDiv.data('oc.popup', this)
    }

    Popup.prototype.setBackdrop = function(val) {
        if (val && !this.$backdrop) {
            this.$backdrop = $('<div class="popup-backdrop fade" />')
                .appendTo(document.body)

            this.$backdrop.addClass('in')
            this.$backdrop.append($('<div class="modal-content popup-loading-indicator" />'))
        }
        else if (!val && this.$backdrop) {
            this.$backdrop.remove()
            this.$backdrop = null
        }
    }

    Popup.prototype.setLoading = function(val) {
        if (!this.$backdrop)
            return;

        var self = this
        if (val) {
            setTimeout(function(){ self.$backdrop.addClass('loading'); }, 100)
        }
        else {
            this.$backdrop.removeClass('loading');
        }
    }

    Popup.prototype.hideLoading = function(val) {
        this.setLoading(false)

        // Wait for animations to complete
        var self = this
        setTimeout(function() { self.setBackdrop(false) }, 250)
        setTimeout(function() { self.hide() }, 500)
    }

    Popup.prototype.triggerEvent = function(eventName, params) {
        if (!params)
            params = [this.$el, this.$modal]

        var eventObject = jQuery.Event(eventName, { relatedTarget: this.$container.get(0) })

        this.$el.trigger(eventObject, params)

        if (this.firstDiv)
            this.firstDiv.trigger(eventObject, params)
    }

    Popup.prototype.reload = function() {
        this.init()
    }

    Popup.prototype.show = function() {
        this.$modal.modal('show')

        this.$modal.on('click.dismiss.popup', '[data-dismiss="popup"]', $.proxy(this.hide, this))
        this.triggerEvent('popupShow') // Deprecated
        this.triggerEvent('show.oc.popup')
    }

    Popup.prototype.hide = function() {
        this.triggerEvent('popupHide') // Deprecated
        this.triggerEvent('hide.oc.popup')

        if (this.allowHide)
            this.$modal.modal('hide')
    }

    /*
     * Hide the popup without destroying it,
     * you should call .hide() once finished
     */
    Popup.prototype.visible = function(val) {
        if (val)
            this.$modal.addClass('in')
        else
            this.$modal.removeClass('in')
        this.setBackdrop(val)
    }

    Popup.prototype.toggle = function() {
        this.triggerEvent('popupToggle', [this.$modal]) // Deprecated
        this.triggerEvent('toggle.oc.popup', [this.$modal])

        this.$modal.modal('toggle')
    }

    /*
     * Lock the popup from closing
     */
    Popup.prototype.lock = function(val) {
        this.allowHide = !val
    }

    // POPUP PLUGIN DEFINITION
    // ============================

    var old = $.fn.popup

    $.fn.popup = function (option) {
        var args = Array.prototype.slice.call(arguments, 1)
        return this.each(function () {
            var $this   = $(this)
            var data    = $this.data('oc.popup')
            var options = $.extend({}, Popup.DEFAULTS, $this.data(), typeof option == 'object' && option)
            if (!data) $this.data('oc.popup', (data = new Popup(this, options)))
            else if (typeof option == 'string') data[option].apply(data, args)
            else data.reload()
        })
    }

    $.fn.popup.Constructor = Popup

    $.popup = function (option) {
        return $('<a />').popup(option)
    }

    // POPUP NO CONFLICT
    // =================

    $.fn.popup.noConflict = function () {
        $.fn.popup = old
        return this
    }

    // POPUP DATA-API
    // ===============

    $(document).on('click.oc.popup', '[data-control="popup"]', function() {
        $(this).popup()

        return false
    });

    /*
     * Only use the popup loading indicator if the handlers are an exact match.
     */
    $(document)
        .on('ajaxPromise', '[data-popup-load-indicator]', function(event, context) {
            if ($(this).data('request') != context.handler) return
            $(this).closest('.control-popup').removeClass('in').popup('setLoading', true)
        })
        .on('ajaxFail', '[data-popup-load-indicator]', function(event, context) {
            if ($(this).data('request') != context.handler) return
            $(this).closest('.control-popup').addClass('in').popup('setLoading', false)
        })
        .on('ajaxDone', '[data-popup-load-indicator]', function(event, context) {
            if ($(this).data('request') != context.handler) return
            $(this).closest('.control-popup').popup('hideLoading')
        })

}(window.jQuery);
