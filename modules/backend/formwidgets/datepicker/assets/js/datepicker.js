/*
 * DatePicker plugin
 * 
 * Data attributes:
 * - data-control="datepicker" - enables the plugin on an element
 * - data-min-date="value" - minimum date to allow
 * - data-max-date="value" - maximum date to allow
 * - data-year-range="value" - range of years to display
 *
 * JavaScript API:
 * $('a#someElement').datePicker({ option: 'value' })
 *
 * Dependences:
 * - Pikaday plugin (pikaday.js)
 * - Pikaday jQuery addon (pikaday.jquery.js)
 */

+function ($) { "use strict";

    // DATEPICKER CLASS DEFINITION
    // ============================

    var DatePicker = function(element, options) {
        var self       = this
        this.options   = options
        this.$el       = $(element)
        this.$input    = this.$el.find('input:first')

        // Init

        var $form = this.$el.closest('form'),
            changeMonitor = $form.data('oc.changeMonitor')

        if (changeMonitor !== undefined)
            changeMonitor.pause()

        this.$input.pikaday({
            minDate: new Date(options.minDate),
            maxDate: new Date(options.maxDate),
            yearRange: options.yearRange,
            setDefaultDate: moment(this.$input.val()).toDate(),
            onOpen: function() {
                var $field = $(this._o.trigger)

                $(this.el).css({
                    left: 'auto',
                    right: $(window).width() - $field.offset().left - $field.outerWidth()
                })
            }
        })

        if (changeMonitor !== undefined)
            changeMonitor.resume()
    }

    DatePicker.DEFAULTS = {
        minDate: '2000-01-01',
        maxDate: '2020-12-31',
        yearRange: 10
    }

    // DATEPICKER PLUGIN DEFINITION
    // ============================

    var old = $.fn.datePicker

    $.fn.datePicker = function (option) {
        var args = Array.prototype.slice.call(arguments, 1)
        return this.each(function () {
            var $this   = $(this)
            var data    = $this.data('oc.datepicker')
            var options = $.extend({}, DatePicker.DEFAULTS, $this.data(), typeof option == 'object' && option)
            if (!data) $this.data('oc.datepicker', (data = new DatePicker(this, options)))
            else if (typeof option == 'string') data[option].apply(data, args)
        })
    }

    $.fn.datePicker.Constructor = DatePicker

    // DATEPICKER NO CONFLICT
    // =================

    $.fn.datePicker.noConflict = function () {
        $.fn.datePicker = old
        return this
    }

    // DATEPICKER DATA-API
    // ===============

    $(document).on('render', function() {
        $('[data-control="datepicker"]').datePicker()
    });

}(window.jQuery);