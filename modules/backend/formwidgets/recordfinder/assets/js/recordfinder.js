/*
 * RecordFinder plugin
 *
 * Data attributes:
 * - data-control="recordfinder" - enables the plugin on an element
 * - data-option="value" - an option with a value
 *
 * JavaScript API:
 * $('a#someElement').recordFinder({ option: 'value' })
 *
 * Dependences:
 * - Some other plugin (filename.js)
 */

+function ($) { "use strict";

    // RECORDFINDER CLASS DEFINITION
    // ============================

    var RecordFinder = function(element, options) {
        var self       = this
        this.options   = options
        this.$el       = $(element)
    }

    RecordFinder.DEFAULTS = {
        refreshHandler: null,
        dataLocker: null
    }

    RecordFinder.prototype.updateRecord = function(linkEl, recordId) {
        if (!this.options.dataLocker) return
        var self = this
        $(this.options.dataLocker).val(recordId)

        this.$el.loadIndicator({ opaque: true })
        this.$el.request(this.options.refreshHandler, {
            success: function(data) {
                this.success(data)
                $(self.options.dataLocker).trigger('change')
            }
        })

        $(linkEl).closest('.recordfinder-popup').popup('hide')
    }

    // RECORDFINDER PLUGIN DEFINITION
    // ============================

    var old = $.fn.recordFinder

    $.fn.recordFinder = function (option) {
        var args = Array.prototype.slice.call(arguments, 1), result
        this.each(function () {
            var $this   = $(this)
            var data    = $this.data('oc.recordfinder')
            var options = $.extend({}, RecordFinder.DEFAULTS, $this.data(), typeof option == 'object' && option)
            if (!data) $this.data('oc.recordfinder', (data = new RecordFinder(this, options)))
            if (typeof option == 'string') result = data[option].apply(data, args)
            if (typeof result != 'undefined') return false
        })

        return result ? result : this
    }

    $.fn.recordFinder.Constructor = RecordFinder

    // RECORDFINDER NO CONFLICT
    // =================

    $.fn.recordFinder.noConflict = function () {
        $.fn.recordFinder = old
        return this
    }

    // RECORDFINDER DATA-API
    // ===============
    $(document).render(function () {
        $('[data-control="recordfinder"]').recordFinder()
    })

}(window.jQuery);
