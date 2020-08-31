/*
 * List Widget
 *
 * Dependences:
 * - Row Link Plugin (system/assets/ui/js/list.rowlink.js)
 */
+function ($) { "use strict";
    var Base = $.oc.foundation.base,
        BaseProto = Base.prototype

    var ListWidget = function (element, options) {

        var $el = this.$el = $(element)

        this.options = options || {}

        var scrollClassContainer = options.scrollClassContainer !== undefined
            ? options.scrollClassContainer
            : $el.parent()

        $el.dragScroll({
            scrollClassContainer: scrollClassContainer,
            scrollSelector: 'thead',
            dragSelector: 'thead'
        })

        $.oc.foundation.controlUtils.markDisposable(element)
        Base.call(this)

        this.init()
        this.update()
    }

    ListWidget.DEFAULTS = {
    }

    ListWidget.prototype = Object.create(BaseProto)
    ListWidget.prototype.constructor = ListWidget

    ListWidget.prototype.init = function() {
        this.$el.find('.control-pagination [data-request]').on('ajaxSetup', this.proxy(this.addCheckedToPaginate))
    }

    ListWidget.prototype.dispose = function() {
        this.$el.find('.control-pagination [data-request]').off('ajaxSetup', this.proxy(this.addCheckedToPaginate))

        this.$el = null

        BaseProto.dispose.call(this)
    }

    ListWidget.prototype.update = function() {
        var
            list = this.$el,
            head = $('thead', list),
            body = $('tbody', list),
            foot = $('tfoot', list)

        /*
         * Bind check boxes
         */
        $('.list-checkbox input[type="checkbox"]', body).each(function(){
            var $el = $(this)
            if ($el.is(':checked'))
                $el.closest('tr').addClass('active')
        })

        head.on('change', '.list-checkbox input[type="checkbox"]', function(){
            var $el = $(this),
                checked = $el.is(':checked')

            $('.list-checkbox input[type="checkbox"]', body).prop('checked', checked)
            if (checked)
                $('tr', body).addClass('active')
            else
                $('tr', body).removeClass('active')
        })

        body.on('change', '.list-checkbox input[type="checkbox"]', function(){
            var $el = $(this),
                checked = $el.is(':checked')

            if (checked) {
                $el.closest('tr').addClass('active')
            }
            else {
                $('.list-checkbox input[type="checkbox"]', head).prop('checked', false)
                $el.closest('tr').removeClass('active')
            }
        })
    }

    ListWidget.prototype.getChecked = function() {
        var
            list = this.$el,
            body = $('tbody', list),
            checked = []

        checked = $('.list-checkbox input[type="checkbox"]', body).map(function(){
            var $el = $(this)
            if ($el.is(':checked'))
                return $el.val()
        }).get()

        $(list).find('input[data-other-checked]').each(function () {
            checked.push($(this).val())
        })

        return checked
    }

    ListWidget.prototype.toggleChecked = function(el) {
        var $checkbox = $('.list-checkbox input[type="checkbox"]', $(el).closest('tr'))
        $checkbox.prop('checked', !$checkbox.is(':checked')).trigger('change')
    }

    ListWidget.prototype.addCheckedToPaginate = function(evt, context) {
        if (!context.options.data.checked) {
            context.options.data.checked = this.getChecked()
        }
    }

    // LIST WIDGET PLUGIN DEFINITION
    // ============================

    var old = $.fn.listWidget

    $.fn.listWidget = function (option) {
        var args = Array.prototype.slice.call(arguments, 1), result

        this.each(function () {
            var $this   = $(this)
            var data    = $this.data('oc.listwidget')
            var options = $.extend({}, ListWidget.DEFAULTS, $this.data(), typeof option == 'object' && option)
            if (!data) $this.data('oc.listwidget', (data = new ListWidget(this, options)))
            if (typeof option == 'string') result = data[option].apply(data, args)
            if (typeof result != 'undefined') return false
        })

        return result ? result : this
    }

    $.fn.listWidget.Constructor = ListWidget

    // LIST WIDGET NO CONFLICT
    // =================

    $.fn.listWidget.noConflict = function () {
        $.fn.listWidget = old
        return this
    }

    // LIST WIDGET HELPERS
    // =================

    if ($.oc === undefined)
        $.oc = {}

    $.oc.listToggleChecked = function(el) {
        $(el)
            .closest('[data-control="listwidget"]')
            .listWidget('toggleChecked', el)
    }

    $.oc.listGetChecked = function(el) {
        return $(el)
            .closest('[data-control="listwidget"]')
            .listWidget('getChecked')
    }

    // LIST WIDGET DATA-API
    // ==============

    $(document).render(function(){
        $('[data-control="listwidget"]').listWidget()
    })

}(window.jQuery);
