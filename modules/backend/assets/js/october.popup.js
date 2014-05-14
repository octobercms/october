/*
 * Ajax Popup plugin
 * 
 * Data attributes:
 * - data-control="popup" - enables the ajax popup plugin
 * - data-ajax="popup-content.htm" - ajax content to load
 * - data-handler="widget:pluginName" - October ajax request name
 * - data-keyboard="false" - Allow popup to be closed with the keyboard
 * - data-request-data="file_id: 1" - October ajax request data
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
        this.options   = options
        this.$el       = $(element)
        this.$target   = null
        this.$modal    = null
        this.$backdrop = null
        this.isOpen    = false
        this.isAjax    = false
        this.firstDiv  = null
        this.allowHide = true

        this.$target = this.createPopupContainer()
        this.$content = this.$target.find('.modal-content:first')
        this.$modal = this.$target.modal({ show: false, backdrop: false, keyboard: this.options.keyboard })
        this.isAjax = this.options.handler || this.options.ajax

        /*
         * Hook in to BS Modal events
         */
        this.$modal.on('hide.bs.modal', function(){
            self.isOpen = false
            self.setBackdrop(false)

            if (self.isAjax) {
                // Wait for animation to complete
                setTimeout(function() { self.$content.empty() }, 500)
            }
        })
        
        this.$modal.on('show.bs.modal', function(){
            self.isOpen = true
            self.setBackdrop(true)
        })

        this.$modal.on('close.oc.popup', function(){
            self.$modal.modal('hide')
            return false
        })

        this.init()
    }

    Popup.DEFAULTS = {
        ajax: null,
        handler: null,
        keyboard: true,
        extraData: {}
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
        this.setLoading(true)

        /*
         * October AJAX
         */
        if (this.options.handler) {

            this.$el.request(this.options.handler, {
                data: this.options.extraData,
                success: function(data, textStatus, jqXHR) {
                    self.setContent(data.result)
                    $(window).trigger('ajaxUpdateComplete', [this, data, textStatus, jqXHR])
                    self.triggerEvent('popupComplete')
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    alert(jqXHR.responseText.length ? jqXHR.responseText : jqXHR.statusText)
                    self.hide()
                    self.triggerEvent('popupError')
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
            });

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

        return modal.append(modalDialog.append(modalContent))
    }

    Popup.prototype.setContent = function(contents) {
        this.show()
        this.setLoading(false)
        this.$content.html(contents)

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

            this.$backdrop.append($('<div class="popup-loading-indicator modal-content" />'))
        }
        else if (!val && this.$backdrop) {
            this.$backdrop.remove()
            this.$backdrop = null;
        }
    }
    
    Popup.prototype.setLoading = function(val) {
        if (!this.$backdrop)
            return;

        var self = this;
        if (val) {
            setTimeout(function(){ self.$backdrop.addClass('loading'); }, 100)
        } 
        else {
            this.$backdrop.removeClass('loading');
        }
    }

    Popup.prototype.triggerEvent = function(eventName, params) {
        if (!params)
            params = [this.$el, this.$modal]

        this.$el.trigger(eventName, params)

        if (this.firstDiv)
            this.firstDiv.trigger(eventName, params)
    }

    Popup.prototype.reload = function() {
        this.init()
    }

    Popup.prototype.show = function() {
        this.$modal.on('click.dismiss.popup', '[data-dismiss="popup"]', $.proxy(this.hide, this))
        this.triggerEvent('popupShow')

        this.$modal.modal('show')
    }

    Popup.prototype.hide = function() {
        this.triggerEvent('popupHide')

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
        this.triggerEvent('popupToggle', [this.$modal])
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

}(window.jQuery);
