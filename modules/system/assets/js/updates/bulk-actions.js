/*
 * Bulk actions plugin
 *
 * Data attributes:
 * - data-control="bulk-actions" - enables the plugin on an element
 *
 * JavaScript API:
 * $('div').bulkActions()
 */

+function ($) { "use strict";

    // BULK ACTIONS CLASS DEFINITION
    // ============================

    var BulkActions = function(element, options) {
        this.options   = options
        this.$el       = $(element)

        // Init
        this.init()
    }

    BulkActions.DEFAULTS = {}

    BulkActions.prototype.init = function() {
        this.activeAction = null
        this.$primaryBtn = $('[data-primary-button]', this.$el)
        this.$toggleBtn = $('.dropdown-toggle', this.$el)
        this.$dropdownMenu = $('.dropdown-menu', this.$el)
        this.baseCss = this.$primaryBtn.attr('class')

        this.$primaryBtn.on('click', $.proxy(this.onClickPrimaryButton, this))
        this.$dropdownMenu.on('click', 'li > a', $.proxy(this.onClickMenuItem, this))

        this.setActiveItem($('li > a:first', this.$dropdownMenu))
    }

    BulkActions.prototype.onClickPrimaryButton = function() {
        if (!this.activeAction) {
            throw new Error('Bulk action not found')
        }

        this.$primaryBtn.data('request-data', {
            checked: $('.control-list').listWidget('getChecked'),
            action: this.activeAction
        })
    }

    BulkActions.prototype.onClickMenuItem = function(ev) {
        this.setActiveItem($(ev.target))
        this.$primaryBtn.click()
    }

    BulkActions.prototype.setActiveItem = function($el) {
        this.$toggleBtn.blur()
        this.activeAction = $el.data('action')
        this.$primaryBtn.text($el.text())
        this.$primaryBtn.attr('class', this.baseCss)
        this.$primaryBtn.addClass($el.attr('class'))
        this.$primaryBtn.data('request-confirm', $el.data('confirm'))
    }

    // BULK ACTIONS PLUGIN DEFINITION
    // ============================

    var old = $.fn.bulkActions

    $.fn.bulkActions = function (option) {
        var args = Array.prototype.slice.call(arguments, 1), result
        this.each(function () {
            var $this   = $(this)
            var data    = $this.data('oc.bulkactions')
            var options = $.extend({}, BulkActions.DEFAULTS, $this.data(), typeof option == 'object' && option)
            if (!data) $this.data('oc.bulkactions', (data = new BulkActions(this, options)))
            if (typeof option == 'string') result = data[option].apply(data, args)
            if (typeof result != 'undefined') return false
        })

        return result ? result : this
    }

    $.fn.bulkActions.Constructor = BulkActions

    // BULK ACTIONS NO CONFLICT
    // =================

    $.fn.bulkActions.noConflict = function () {
        $.fn.bulkActions = old
        return this
    }

    // BULK ACTIONS DATA-API
    // ===============

    $(document).render(function() {
        $('[data-control="bulk-actions"]').bulkActions()
    });

}(window.jQuery);
