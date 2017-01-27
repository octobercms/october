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
        this.$sortable = $(options.sortableContainer, this.$el)

        // Init
        this.init()
    }

    Repeater.DEFAULTS = {
        sortableHandle: '.repeater-item-handle',
        sortableContainer: 'ul.field-repeater-items'
    }

    Repeater.prototype.init = function() {
        // Init with no arguments
        this.bindSorting()

        var self = this
        this.$el.on('click', '.repeater-item-collapse-one', self.toggleCollapse)
        this.$el.on('click', '.repeater-collapse-all', self.collapseAll)
        this.$el.on('click', '.repeater-expand-all', self.expandAll)
    }

    Repeater.prototype.bindSorting = function() {
        var sortableOptions = {
            handle: this.options.sortableHandle,
            nested: false
        }

        this.$sortable.sortable(sortableOptions)
    }

    Repeater.prototype.unbind = function() {
        this.$sortable.sortable('destroy')
        this.$el.removeData('oc.repeater')
    }

    Repeater.prototype.toggleCollapse = function() {
        var $item = $(this).closest('.field-repeater-item')

        if ($item.hasClass('collapsed')) {
            Repeater.prototype.expand($item)
        } else {
            Repeater.prototype.collapse($item)
        }
    }

    Repeater.prototype.collapseAll = function() {
        var items = $(this).closest('.field-repeater').find('.field-repeater-item')

        $.each(items, function(key, item){
            Repeater.prototype.collapse($(item))
        })
    }

    Repeater.prototype.expandAll = function() {
        var items = $(this).closest('.field-repeater').find('.field-repeater-item')

        $.each(items, function(key, item){
            Repeater.prototype.expand($(item))
        })
    }

    Repeater.prototype.collapse = function($item) {
        $item.addClass('collapsed')

        var $textInput = $item.find('input[type=text]').first()
        if($textInput.length) {
            $item.find('.repeater-item-collapsed-title').text($textInput.val());
        }
    }

    Repeater.prototype.expand = function($item) {
        $item.removeClass('collapsed')
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