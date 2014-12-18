/*
 * TimePicker plugin
 * 
 * Data attributes:
 * - data-control="timepicker" - enables the plugin on an element
 *
 * JavaScript API:
 * $('a#someElement').timePicker({ option: 'value' })
 *
 * Dependences:
 * - Clockpicker plugin (jquery-clockpicker.js)
 */

+function ($) { "use strict";

    // DATEPICKER CLASS DEFINITION
    // ============================

    var TimePicker = function(element, options) {
        var self       = this
        this.options   = options
        this.$el       = $(element)
        this.$input    = this.$el.find('input:first')

        // Init

        var $form = this.$el.closest('form'),
            changeMonitor = $form.data('oc.changeMonitor')

        if (changeMonitor !== undefined)
            changeMonitor.pause()

        this.$input.clockpicker()

        if (changeMonitor !== undefined)
            changeMonitor.resume()
    }

    TimePicker.DEFAULTS = {
    }

    // DATEPICKER PLUGIN DEFINITION
    // ============================

    var old = $.fn.timePicker

    $.fn.timePicker = function (option) {
        var args = Array.prototype.slice.call(arguments, 1)
        return this.each(function () {
            var $this   = $(this)
            var data    = $this.data('oc.timepicker')
            var options = $.extend({}, TimePicker.DEFAULTS, $this.data(), typeof option == 'object' && option)
            if (!data) $this.data('oc.timepicker', (data = new TimePicker(this, options)))
            else if (typeof option == 'string') data[option].apply(data, args)
        })
    }

    $.fn.timePicker.Constructor = TimePicker

    // DATEPICKER NO CONFLICT
    // =================

    $.fn.timePicker.noConflict = function () {
        $.fn.timePicker = old
        return this
    }

    // DATEPICKER DATA-API
    // ===============

    $(document).on('render', function() {
        $('[data-control="timepicker"]').timePicker()
    });

}(window.jQuery);