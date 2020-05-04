+function ($) { "use strict";

    var Sensitive = function(element, options) {
        this.$el = $(element)
        this.init()
    }

    Sensitive.DEFAULTS = {
        readOnly: false,
        disabled: false
    }

    Sensitive.prototype.init = function() {
        var self = this
        this.$sensitiveField = this.$el
        this.$showIcon = this.$el.siblings('.toggle-icon:first')

        this.$showIcon.click(function(){
            self.togglePassword()
            self.toggleIcon()
        })
    }

    Sensitive.prototype.togglePassword = function() {
        if (this.$sensitiveField.attr("type") == "password") {
            this.$sensitiveField.attr("type", "text");
        } else {
            this.$sensitiveField.attr("type", "password");
        }
    }

    Sensitive.prototype.toggleIcon = function() {
        this.$showIcon.find('i').toggleClass("icon-eye icon-eye-slash");
    }

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

    $.fn.sensitive.Constructor = Sensitive

    $.fn.sensitive.noConflict = function () {
        $.fn.sensitive = old
        return this
    }

    $(document).render(function () {
        $('[data-control="sensitive"]').sensitive()
    });

}(window.jQuery);
