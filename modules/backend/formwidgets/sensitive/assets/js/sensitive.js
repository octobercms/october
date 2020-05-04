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
        this.$sensitiveInput = this.$el
        this.$showIcon = this.$el.siblings('.toggle-icon:first')

        this.$showIcon.on('click', this.proxy(this.onToggle))
    }

    Sensitive.prototype.dispose = function () {
        this.$showIcon.off('click', this.proxy(this.onToggle))

        this.$sensitiveInput = null
        this.$showIcon = null
        this.$el = null

        BaseProto.dispose.call(this)
    }

    Sensitive.prototype.onToggle = function() {
        if (this.$sensitiveInput.attr('type') === 'password') {
            this.$sensitiveInput.attr('type', 'text');
        } else {
            this.$sensitiveInput.attr('type', 'password');
        }

        this.$showIcon.find('i').toggleClass('icon-eye icon-eye-slash');
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
