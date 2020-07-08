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

    var Sensitive = function(element) {
        this.$el = $(element)

        Base.call(this)
        this.init()
    }

    Sensitive.DEFAULTS = {
        readOnly: false,
        disabled: false
    }

    Sensitive.prototype = Object.create(BaseProto)
    Sensitive.prototype.constructor = Sensitive

    Sensitive.prototype.init = function() {
        this.$input = this.$el.find('[data-input]').first()
        this.$toggle = this.$el.find('[data-toggle]').first()
        this.$icon = this.$el.find('[data-icon]').first()
        this.$loader = this.$el.find('[data-loader]').first()

        this.clean = Boolean(this.$el.data('clean'))

        this.$input.on('keydown', this.proxy(this.onInput))
        this.$toggle.on('click', this.proxy(this.onToggle))
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

    Sensitive.prototype.toggleVisibility = function() {
        if (this.$input.attr('type') === 'password') {
            this.$input.attr('type', 'text')
        } else {
            this.$input.attr('type', 'password')
        }

        this.$icon.toggleClass('icon-eye icon-eye-slash')
    }

    Sensitive.prototype.reveal = function() {
        var that = this
        this.$icon.css({
            visibility: 'hidden'
        })
        this.$loader.removeClass('hide')

        this.$input.request(this.$input.data('eventHandler'), {
            data: {
                fieldId: this.$input.attr('id'),
            },
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
