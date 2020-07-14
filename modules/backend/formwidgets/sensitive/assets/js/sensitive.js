/*
 * Sensitive field widget plugin.
 *
 * Data attributes:
 * - data-control="sensitive" - enables the plugin on an element
 *
 * JavaScript API:
 * $('div#someElement').sensitive({...})
 */
+function ($) { "use strict";
    var Base = $.oc.foundation.base,
        BaseProto = Base.prototype

    var Sensitive = function(element, options) {
        this.$el = $(element)
        this.options = options
        this.clean = Boolean(this.$el.data('clean'))
        this.hidden = true
        this.triggerElement = null

        this.$input = this.$el.find('[data-input]').first()
        this.$toggle = this.$el.find('[data-toggle]').first()
        this.$icon = this.$el.find('[data-icon]').first()
        this.$loader = this.$el.find('[data-loader]').first()
        this.$copy = this.$el.find('[data-copy]').first()

        $.oc.foundation.controlUtils.markDisposable(element)
        Base.call(this)
        this.init()
    }

    Sensitive.DEFAULTS = {
        readOnly: false,
        disabled: false,
        eventHandler: null,
        hideOnTabChange: false,
    }

    Sensitive.prototype = Object.create(BaseProto)
    Sensitive.prototype.constructor = Sensitive

    Sensitive.prototype.init = function() {
        this.$input.on('keydown', this.proxy(this.onInput))
        this.$toggle.on('click', this.proxy(this.onToggle))

        if (this.options.hideOnTabChange) {
            // Watch for tab change or minimise
            document.addEventListener('visibilitychange', this.proxy(this.onTabChange))
        }

        if (this.$copy.length) {
            this.$copy.on('click', this.proxy(this.onCopy))
        }

        $(window).on('ajaxSetup', this.proxy(this.onAjaxSetup))
        $(window).on('oc.beforeRequest', this.proxy(this.onBeforeRequest))
    }

    Sensitive.prototype.dispose = function () {
        this.$input.off('keydown', this.proxy(this.onInput))
        this.$toggle.off('click', this.proxy(this.onToggle))

        if (this.options.hideOnTabChange) {
            document.removeEventListener('visibilitychange', this.proxy(this.onTabChange))
        }

        if (this.$copy.length) {
            this.$copy.off('click', this.proxy(this.onCopy))
        }

        $(window).off('ajaxSetup', this.proxy(this.onAjaxSetup))
        $(window).off('oc.beforeRequest', this.proxy(this.onBeforeRequest))

        this.$input = this.$toggle = this.$icon = this.$loader = null
        this.$el = null

        BaseProto.dispose.call(this)
    }

    Sensitive.prototype.onInput = function() {
        if (this.clean) {
            this.clean = false
            this.$input.val('')
        }

        return true
    }

    Sensitive.prototype.onToggle = function() {
        if (this.$input.val() !== '' && this.clean) {
            this.reveal()
        } else {
            this.toggleVisibility()
        }

        return true
    }

    Sensitive.prototype.onTabChange = function() {
        if (document.hidden && !this.hidden) {
            this.toggleVisibility()
        }
    }

    Sensitive.prototype.onCopy = function() {
        var that = this,
            deferred = $.Deferred(),
            isHidden = this.hidden

        deferred.then(function () {
            if (that.hidden) {
                that.toggleVisibility()
            }

            that.$input.focus()
            that.$input.select()

            try {
                document.execCommand('copy')
            } catch (err) {
            }

            that.$input.blur()
            if (isHidden) {
                that.toggleVisibility()
            }
        })

        if (this.$input.val() !== '' && this.clean) {
            this.reveal(deferred)
        } else {
            deferred.resolve()
        }
    }

    Sensitive.prototype.onAjaxSetup = function (event, context) {
        // Don't track AJAX request if it is for revealing the value
        if (context.handler === this.options.eventHandler) {
            return
        }
        // Don't track AJAX requests if this field has been revealed
        if (!this.clean) {
            return
        }
        // Only track trigger elements if the AJAX request is for an element in the same form as this input
        if (!this.$el.closest('form').is($(event.target).closest('form'))) {
            return
        }

        this.triggerElement = event.target
    }

    Sensitive.prototype.onBeforeRequest = function (event, context) {
        var that = this,
            deferred = $.Deferred()

        // Don't track AJAX request if it is for revealing the value
        if (context.handler === this.options.eventHandler) {
            return
        }
        // Don't track AJAX requests if this field has been revealed
        if (!this.clean) {
            return
        }
        // Only defer AJAX requests for elements in the same form as this input
        if (!this.triggerElement || !this.$el.closest('form').is($(this.triggerElement).closest('form'))) {
            return
        }

        // Prevent the initial AJAX request and re-call it after revealing the value
        event.preventDefault()

        deferred.then(function () {
            if (!that.hidden) {
                that.toggleVisibility()
            }

            $(that.triggerElement).request()
        })

        this.reveal(deferred)
    }

    Sensitive.prototype.toggleVisibility = function() {
        if (this.hidden) {
            this.$input.attr('type', 'text')
        } else {
            this.$input.attr('type', 'password')
        }

        this.$icon.toggleClass('icon-eye icon-eye-slash')

        this.hidden = !this.hidden
    }

    Sensitive.prototype.reveal = function(deferred) {
        var that = this
        this.$icon.css({
            visibility: 'hidden'
        })
        this.$loader.removeClass('hide')

        this.$input.request(this.options.eventHandler, {
            success: function (data) {
                that.$input.val(data.value)
                that.clean = false

                that.$icon.css({
                    visibility: 'visible'
                })
                that.$loader.addClass('hide')

                that.toggleVisibility()

                if (deferred) {
                    deferred.resolve()
                }
            }
        })
    }

    var old = $.fn.sensitive

    $.fn.sensitive = function (option) {
        var args = Array.prototype.slice.call(arguments, 1), result
        this.each(function () {
            var $this   = $(this)
            var data    = $this.data('oc.sensitive')
            var options = $.extend({}, Sensitive.DEFAULTS, $this.data(), typeof option == 'object' && option)
            if (!data) $this.data('oc.sensitive', (data = new Sensitive(this, options)))
            if (typeof option == 'string') result = data[option].apply(data, args)
            if (typeof result != 'undefined') return false
        })

        return result ? result : this
    }

    $.fn.sensitive.noConflict = function () {
        $.fn.sensitive = old
        return this
    }

    $(document).render(function () {
        $('[data-control="sensitive"]').sensitive()
    });

}(window.jQuery);
