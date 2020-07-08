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

        this.$input = this.$el.find('[data-input]').first()
        this.$toggle = this.$el.find('[data-toggle]').first()
        this.$icon = this.$el.find('[data-icon]').first()
        this.$loader = this.$el.find('[data-loader]').first()

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
    }

    Sensitive.prototype.dispose = function () {
        this.$input.on('keydown', this.proxy(this.onInput))
        this.$toggle.off('click', this.proxy(this.onToggle))

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

    Sensitive.prototype.toggleVisibility = function() {
        if (this.hidden) {
            this.$input.attr('type', 'text')
        } else {
            this.$input.attr('type', 'password')
        }

        this.$icon.toggleClass('icon-eye icon-eye-slash')

        this.hidden = !this.hidden
    }

    Sensitive.prototype.reveal = function() {
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
