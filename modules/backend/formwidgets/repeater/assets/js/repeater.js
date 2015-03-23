/*
 * Field Repeater plugin
 * 
 * Data attributes:
 * - data-control="fieldrepeater" - enables the plugin on an element
 * - data-option="value" - an option with a value
 *
 * JavaScript API:
 * $('a#someElement').fieldRepeater({ option: 'value' })
 *
 * Dependences: 
 * - Some other plugin (filename.js)
 */

+function ($) { "use strict";

    // FIELD REPEATER CLASS DEFINITION
    // ============================

    var Repeater = function(element, options) {
        this.options   = options
        this.$el       = $(element)

        // Init
        this.init()
    }

    Repeater.DEFAULTS = {
        option: 'default'
    }

    Repeater.prototype.init = function() {
        // Init with no arguments
        this.bindSorting()
    }

    Repeater.prototype.bindSorting = function() {

        var sortableOptions = {
            // useAnimation: true,
            handle: '.repeater-item-handle',
            nested: false
        }

        $('ul.field-repeater-items', this.$el).sortable(sortableOptions)
    }

    Repeater.prototype.unbind = function() {
        this.$el.find('ul.field-repeater-items').sortable('destroy')
        this.$el.removeData('oc.repeater')
    }

    // FIELD REPEATER PLUGIN DEFINITION
    // ============================

    var old = $.fn.fieldRepeater

    $.fn.fieldRepeater = function (option) {
        var args = Array.prototype.slice.call(arguments, 1), result
        this.each(function () {
            var $this   = $(this)
            var data    = $this.data('oc.repeater')
            var options = $.extend({}, Repeater.DEFAULTS, $this.data(), typeof option == 'object' && option)
            if (!data) $this.data('oc.repeater', (data = new Repeater(this, options)))
            if (typeof option == 'string') result = data[option].apply(data, args)
            if (typeof result != 'undefined') return false
        })

        return result ? result : this
    }

    $.fn.fieldRepeater.Constructor = Repeater

    // FIELD REPEATER NO CONFLICT
    // =================

    $.fn.fieldRepeater.noConflict = function () {
        $.fn.fieldRepeater = old
        return this
    }

    // FIELD REPEATER DATA-API
    // ===============

    $(document).render(function() {
        $('[data-control="fieldrepeater"]').fieldRepeater()
    });

}(window.jQuery);