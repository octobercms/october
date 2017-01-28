/*
 * Field Repeater plugin
 * 
 * Data attributes:
 * - data-control="fieldrepeater" - enables the plugin on an element
 * - data-option="value" - an option with a value
 *
 * JavaScript API:
 * $('a#someElement').fieldRepeater({...})
 */

+function ($) { "use strict";

    var Base = $.oc.foundation.base,
        BaseProto = Base.prototype

    // FIELD REPEATER CLASS DEFINITION
    // ============================

    var Repeater = function(element, options) {
        this.options   = options
        this.$el       = $(element)
        this.$sortable = $(options.sortableContainer, this.$el)

        $.oc.foundation.controlUtils.markDisposable(element)
        Base.call(this)
        this.init()
    }

    Repeater.prototype = Object.create(BaseProto)
    Repeater.prototype.constructor = Repeater

    Repeater.DEFAULTS = {
        sortableHandle: '.repeater-item-handle',
        sortableContainer: 'ul.field-repeater-items',
        titleFrom: null
    }

    Repeater.prototype.init = function() {
        this.bindSorting()

        this.$el.on('click', '> ul > li > .repeater-item-collapse .repeater-item-collapse-one', this.proxy(this.toggleCollapse))

        this.$el.one('dispose-control', this.proxy(this.dispose))
    }

    Repeater.prototype.dispose = function() {
        this.$sortable.sortable('destroy')

        this.$el.off('click', '> ul > li > .repeater-item-collapse .repeater-item-collapse-one', this.proxy(this.toggleCollapse))

        this.$el.off('dispose-control', this.proxy(this.dispose))
        this.$el.removeData('oc.repeater')

        this.$el = null
        this.$sortable = null
        this.options = null

        BaseProto.dispose.call(this)
    }

    // Deprecated
    Repeater.prototype.unbind = function() {
        this.dispose()
    }

    Repeater.prototype.bindSorting = function() {
        var sortableOptions = {
            handle: this.options.sortableHandle,
            nested: false
        }

        this.$sortable.sortable(sortableOptions)
    }

    Repeater.prototype.toggleCollapse = function(ev) {
        var $item = $(ev.target).closest('.field-repeater-item'),
            isCollapsed = $item.hasClass('collapsed')

        if (event.ctrlKey || event.metaKey) {
            isCollapsed ? this.expandAll() : this.collapseAll()
        }
        else {
            isCollapsed ? this.expand($item) : this.collapse($item)
        }
    }

    Repeater.prototype.collapseAll = function() {
        var self = this,
            items = $('.field-repeater-item', this.$el)

        $.each(items, function(key, item){
            self.collapse($(item))
        })
    }

    Repeater.prototype.expandAll = function() {
        var self = this,
            items = $('.field-repeater-item', this.$el)

        $.each(items, function(key, item){
            self.expand($(item))
        })
    }

    Repeater.prototype.collapse = function($item) {
        $item.addClass('collapsed')
        $('.repeater-item-collapsed-title', $item).text(this.getCollapseTitle($item));
    }

    Repeater.prototype.expand = function($item) {
        $item.removeClass('collapsed')
    }

    Repeater.prototype.getCollapseTitle = function($item) {
        var $target,
            defaultText = ''

        if (this.options.titleFrom) {
            $target = $('[data-field-name="'+this.options.titleFrom+'"]')
            if (!$target.length) {
                $target = $item
            }
        }
        else {
            $target = $item
        }

        var $textInput = $('input[type=text]:first', $target)
        if ($textInput.length) {
            return $textInput.val()
        }

        return defaultText
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
