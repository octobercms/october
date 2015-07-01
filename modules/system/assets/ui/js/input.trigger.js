/*
 * The trigger API
 *
 * - Documentation: ../docs/input-trigger.md
 */
+function ($) { "use strict";

    var TriggerOn = function (element, options) {

        var $el = this.$el = $(element);

        this.options = options || {};

        // @deprecated remove if year >= 2016
        if (this.options.triggerType !== false && this.options.triggerAction === false) this.options.triggerAction = this.options.triggerType

        if (this.options.triggerCondition === false)
            throw new Error('Trigger condition is not specified.')

        if (this.options.trigger === false)
            throw new Error('Trigger selector is not specified.')

        if (this.options.triggerAction === false)
            throw new Error('Trigger action is not specified.')

        this.triggerCondition = this.options.triggerCondition

        if (this.options.triggerCondition.indexOf('value') == 0) {
            var match = this.options.triggerCondition.match(/[^[\]]+(?=])/g)
            this.triggerCondition = 'value'
            this.triggerConditionValue = (match) ? match : ""
        }

        this.triggerParent = this.options.triggerClosestParent !== undefined
            ? $el.closest(this.options.triggerClosestParent)
            : undefined

        if (this.triggerCondition == 'checked' || this.triggerCondition == 'value') {
            $(document).on('change', this.options.trigger, $.proxy(this.onConditionChanged, this))
        }

        var self = this
        $el.on('oc.triggerOn.update', function(e){
            e.stopPropagation()
            self.onConditionChanged()
        })

        self.onConditionChanged()
    }

    TriggerOn.prototype.onConditionChanged = function() {
        if (this.triggerCondition == 'checked') {
            this.updateTarget($(this.options.trigger + ':checked', this.triggerParent).length > 0)
        }
        else if (this.triggerCondition == 'value') {
            var trigger = $(this.options.trigger + ':checked', this.triggerParent),
                needle = trigger.length ? trigger.val() : $(this.options.trigger, this.triggerParent).val()

            this.updateTarget($.inArray(needle, this.triggerConditionValue) != -1)
        }
    }

    TriggerOn.prototype.updateTarget = function(status) {
        if (this.options.triggerAction == 'show')
            this.$el.toggleClass('hide', !status).trigger('hide.oc.triggerapi', [!status])
        else if (this.options.triggerAction == 'hide')
            this.$el.toggleClass('hide', status).trigger('hide.oc.triggerapi', [status])
        else if (this.options.triggerAction == 'enable')
            this.$el.prop('disabled', !status).trigger('disable.oc.triggerapi', [!status]).toggleClass('control-disabled', !status)
        else if (this.options.triggerAction == 'disable')
            this.$el.prop('disabled', status).trigger('disable.oc.triggerapi', [status]).toggleClass('control-disabled', status)
        else if (this.options.triggerAction == 'empty' && status)
            this.$el.trigger('empty.oc.triggerapi').val('')

        if (this.options.triggerAction == 'show' || this.options.triggerAction == 'hide')
            this.fixButtonClasses()

        $(window).trigger('resize')
    }

    TriggerOn.prototype.fixButtonClasses = function() {
        var group = this.$el.closest('.btn-group')

        if (group.length > 0 && this.$el.is(':last-child'))
            this.$el.prev().toggleClass('last', this.$el.hasClass('hide'))
    }

    TriggerOn.DEFAULTS = {
        triggerAction: false,
        triggerCondition: false,
        triggerClosestParent: undefined,
        trigger: false
    }

    // TRIGGERON PLUGIN DEFINITION
    // ============================

    var old = $.fn.triggerOn

    $.fn.triggerOn = function (option) {
        return this.each(function () {
            var $this = $(this)
            var data  = $this.data('oc.triggerOn')
            var options = $.extend({}, TriggerOn.DEFAULTS, $this.data(), typeof option == 'object' && option)

            if (!data) $this.data('oc.triggerOn', (data = new TriggerOn(this, options)))
        })
      }

    $.fn.triggerOn.Constructor = TriggerOn

    // TRIGGERON NO CONFLICT
    // =================

    $.fn.triggerOn.noConflict = function () {
        $.fn.triggerOn = old
        return this
    }

    // TRIGGERON DATA-API
    // ===============

    $(document).render(function(){
        $('[data-trigger]').triggerOn()
    })

}(window.jQuery);
