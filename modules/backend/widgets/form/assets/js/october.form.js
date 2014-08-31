/*
 * Form Widget
 *
 * Dependences:
 * - Nil
 */
+function ($) { "use strict";

    var FormWidget = function (element, options) {

        var $el = this.$el = $(element);

        this.options = options || {};

        this.bindDependants()
    }

    FormWidget.DEFAULTS = {
        refreshHandler: null
    }

    /*
     * Bind dependant fields
     */
    FormWidget.prototype.bindDependants = function() {
        var self = this,
            form = this.$el,
            formEl = form.closest('form'),
            fieldMap = {}

        /*
         * Map master and slave field map
         */
        form.find('[data-field-depends]').each(function(){
            var name = $(this).data('field-name'),
                depends = $(this).data('field-depends')

            $.each(depends, function(index, depend){
                if (!fieldMap[depend])
                    fieldMap[depend] = { fields: [] }

                fieldMap[depend].fields.push(name)
            })
        })

        /*
         * When a master is updated, refresh its slaves
         */
        $.each(fieldMap, function(fieldName, toRefresh){
            form.find('[data-field-name="'+fieldName+'"]')
                .on('change', 'select, input', function(){
                    formEl.request(self.options.refreshHandler, {
                        data: toRefresh
                    })

                    $.each(toRefresh.fields, function(index, field){
                        form.find('[data-field-name="'+field+'"]')
                            .addClass('loading-indicator-container size-form-field')
                            .loadIndicator()
                    })
                })
        })

    }

    // FORM WIDGET PLUGIN DEFINITION
    // ============================

    var old = $.fn.formWidget

    $.fn.formWidget = function (option) {
        var args = arguments,
            result

        this.each(function () {
            var $this   = $(this)
            var data    = $this.data('oc.formwidget')
            var options = $.extend({}, FormWidget.DEFAULTS, $this.data(), typeof option == 'object' && option)
            if (!data) $this.data('oc.formwidget', (data = new FormWidget(this, options)))
            if (typeof option == 'string') result = data[option].call($this)
            if (typeof result != 'undefined') return false
        })

        return result ? result : this
      }

    $.fn.formWidget.Constructor = FormWidget

    // FORM WIDGET NO CONFLICT
    // =================

    $.fn.formWidget.noConflict = function () {
        $.fn.formWidget = old
        return this
    }

    // FORM WIDGET DATA-API
    // ==============

    $(document).render(function(){
        $('[data-control="formwidget"]').formWidget();
    })

}(window.jQuery);