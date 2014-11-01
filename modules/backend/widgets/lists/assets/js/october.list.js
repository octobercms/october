/*
 * List Widget
 *
 * Dependences:
 * - Row Link Plugin (october.rowlink.js)
 */
+function ($) { "use strict";

    var ListWidget = function (element, options) {

        var $el = this.$el = $(element);

        this.options = options || {};

        this.update()
    }

    ListWidget.DEFAULTS = {
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
            body = $('tbody', list)

        return  $('.list-checkbox input[type="checkbox"]', body).map(function(){
            var $el = $(this)
            if ($el.is(':checked'))
                return $el.val()
        }).get();
    }

    // LIST WIDGET PLUGIN DEFINITION
    // ============================

    var old = $.fn.listWidget

    $.fn.listWidget = function (option) {
        var args = arguments,
            result

        this.each(function () {
            var $this   = $(this)
            var data    = $this.data('oc.listwidget')
            var options = $.extend({}, ListWidget.DEFAULTS, $this.data(), typeof option == 'object' && option)
            if (!data) $this.data('oc.listwidget', (data = new ListWidget(this, options)))
            if (typeof option == 'string') result = data[option].call($this)
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

    // LIST WIDGET DATA-API
    // ==============
    
    $(document).render(function(){
        $('[data-control="listwidget"]').listWidget();
    })

}(window.jQuery);