/*
 * The form change monitor API. 
 *
 * This plugin allows to monitor changes in a form. 
 * The script adds the "oc-data-changed" class to the form element when the form data is changed.
 * 
 * Supported data attributes:
 * - data-change-monitor - enables the plugin form a form
 * - data-window-close-confirm - confirmation message to show when a browser window is closing and there is unsaved data
 *
 * Example: <form 
 *              data-change-monitor
                data-window-close-confirm="There is unsaved data"
 *             ...
 *          >
 *
 * Supported events:
 * - change - marks the form data as "changed". The event can be triggered on any
 *   element within a form or on a form itself.
 * - unchange.oc.changeMonitor - marks the form data as "unchanged". The event can be triggered on any
 *   element within a form or on a form itself.
 * - pause.oc.changeMonitor - temporary pauses the change monitoring. The event can be triggered on any
 *   element within a form or on a form itself.
 * - resume.oc.changeMonitor - resumes the change monitoring. The event can be triggered on any
 *   element within a form or on a form itself.
 *
 * Triggered events: 
 * - changed.oc.changeMonitor - triggered when the form data changes.
 * - unchanged.oc.changeMonitor - triggered when the form data unchanges.
 *
 * JavaScript API:
 * $('#form').changeMonitor()
 */
+function ($) { "use strict";

    var ChangeMonitor = function (element, options) {
        var $el = this.$el = $(element);

        this.paused = false
            
        this.options = options || {}
        this.init()
    }

    ChangeMonitor.prototype.init = function() {
        this.$el.on('change', $.proxy(this.change, this))
        this.$el.on('unchange.oc.changeMonitor', $.proxy(this.unchange, this))
        this.$el.on('pause.oc.changeMonitor ', $.proxy(this.pause, this))
        this.$el.on('resume.oc.changeMonitor ', $.proxy(this.resume, this))

        this.$el.on('keyup input paste', 'input, textarea:not(.ace_text-input)', $.proxy(this.onInputChange, this))
        $('input:not([type=hidden]), textarea:not(.ace_text-input)', this.$el).each(function() {
            $(this).data('oldval.oc.changeMonitor', $(this).val());
        })

        if (this.options.windowCloseConfirm)
            $(window).on('beforeunload', $.proxy(this.onBeforeUnload, this))
    }

    ChangeMonitor.prototype.change = function(ev, inputChange) {
        if (this.paused)
            return

        if (!inputChange) {
            var type = $(ev.target).attr('type')
            if (type == 'text' || type == "password")
                return
        }

        if (!this.$el.hasClass('oc-data-changed')) {
            this.$el.trigger('changed.oc.changeMonitor')
            this.$el.addClass('oc-data-changed')
        }
    }

    ChangeMonitor.prototype.unchange = function() {
        if (this.paused)
            return

        if (this.$el.hasClass('oc-data-changed')) {
            this.$el.trigger('unchanged.oc.changeMonitor')
            this.$el.removeClass('oc-data-changed')
        }
    }

    ChangeMonitor.prototype.onInputChange = function(ev) {
        if (this.paused)
            return

        var $el = $(ev.target)
        if ($el.data('oldval.oc.changeMonitor') != $el.val()) {

            $el.data('oldval.oc.changeMonitor', $el.val());
            this.change(ev, true);
        }
    }

    ChangeMonitor.prototype.pause = function() {
        this.paused = true
    }

    ChangeMonitor.prototype.resume = function() {
        this.paused = false
    }

    ChangeMonitor.prototype.onBeforeUnload = function() {
        if ($.contains(document.documentElement, this.$el.get(0)) && this.$el.hasClass('oc-data-changed'))
            return this.options.windowCloseConfirm
    }

    ChangeMonitor.DEFAULTS = {
        windowCloseConfirm: false
    }

    // CHANGEMONITOR PLUGIN DEFINITION
    // ===============================

    var old = $.fn.changeMonitor

    $.fn.changeMonitor = function (option) {
        return this.each(function () {
            var $this = $(this)
            var data  = $this.data('oc.changeMonitor')
            var options = $.extend({}, ChangeMonitor.DEFAULTS, $this.data(), typeof option == 'object' && option)

            if (!data) $this.data('oc.changeMonitor', (data = new ChangeMonitor(this, options)))
        })
      }

    $.fn.changeMonitor.Constructor = ChangeMonitor

    // CHANGEMONITOR NO CONFLICT
    // ===============================

    $.fn.changeMonitor.noConflict = function () {
        $.fn.changeMonitor = old
        return this
    }

    // CHANGEMONITOR DATA-API
    // ===============================

    $(document).render(function(){
        $('[data-change-monitor]').changeMonitor()
    })

}(window.jQuery);