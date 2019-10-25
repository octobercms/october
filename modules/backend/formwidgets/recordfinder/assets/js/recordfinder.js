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

    var Base = $.oc.foundation.base,
        BaseProto = Base.prototype

    // RECORDFINDER CLASS DEFINITION
    // ============================

    var RecordFinder = function(element, options) {
        this.$el       = $(element)
        this.options   = options || {}

        $.oc.foundation.controlUtils.markDisposable(element)
        Base.call(this)
        this.init()
    }

    RecordFinder.prototype = Object.create(BaseProto)
    RecordFinder.prototype.constructor = RecordFinder

    RecordFinder.prototype.init = function() {
        this.$el.on('dblclick', this.proxy(this.onDoubleClick))
        this.$el.one('dispose-control', this.proxy(this.dispose))
    }

    RecordFinder.prototype.dispose = function() {
        this.$el.off('dblclick', this.proxy(this.onDoubleClick))
        this.$el.off('dispose-control', this.proxy(this.dispose))
        this.$el.removeData('oc.recordfinder')

        this.$el = null

        // In some cases options could contain callbacks, 
        // so it's better to clean them up too.
        this.options = null

        BaseProto.dispose.call(this)
    }

    RecordFinder.DEFAULTS = {
        refreshHandler: null,
        dataLocker: null
    }

    RecordFinder.prototype.onDoubleClick = function(linkEl, recordId) {
        $('.btn.find-record', this.$el).trigger('click')
    }

    RecordFinder.prototype.updateRecord = function(linkEl, recordId) {
        if (!this.options.dataLocker) return

        // Selector name must be used because by the time success runs
        // - this.options will be disposed
        // - $locker element will be replaced
        var locker = this.options.dataLocker

        $(locker).val(recordId)

        this.$el.loadIndicator({ opaque: true })
        this.$el.request(this.options.refreshHandler, {
            success: function(data) {
                this.success(data)
                $(locker).trigger('change')
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
