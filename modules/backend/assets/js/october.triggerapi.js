/*
 * The trigger API.
 *
 * The API allows to change elements' visibility or status (enabled/disabled) basing on
 * other elements' statuses. Example: enable a button if any checkbox inside another
 * element is checked.
 * 
 * Supported data attributes:
 * - data-trigger-action, values: show, hide, enable, disable, empty
 * - data-trigger: a CSS selector for elements that trigger the action (checkboxes)
 * - data-trigger-condition, values:
 *       - checked: determines the condition the elements specified in the data-trigger
 *                  should satisfy in order the condition to be considered as "true".
 *       - value[somevalue]: determines if the value of data-trigger equals the specified value (somevalue)
 *                           the condition is considered "true".
 * - data-trigger-closest-parent: optional, specifies a CSS selector for a closest common parent
 *   for the source and destination input elements.
 *
 * Example: <input type="button" class="btn disabled"
 *             data-trigger-action="enable"
 *             data-trigger="#cblist input[type=checkbox]"
 *             data-trigger-condition="checked" ... >
 *
 * Supported events:
 * - oc.triggerOn.update - triggers the update. Trigger this event on the element the plugin is bound to to 
 *   force it to check the condition and update itself. This is useful when the page content is updated with AJAX.
 *
 * JavaScript API:
 * $('#mybutton').triggerOn({ triggerCondition: 'checked', trigger: '#cblist input[type=checkbox]', triggerAction: 'enable' })
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
            var trigger = $(this.options.trigger + ':checked', this.triggerParent);
            if (trigger.length) {
                this.updateTarget(trigger.val() == this.triggerConditionValue)
            } else {
                this.updateTarget($(this.options.trigger, this.triggerParent).val() == this.triggerConditionValue)
            }
        }
    }

    TriggerOn.prototype.updateTarget = function(status) {
        if (this.options.triggerAction == 'show')
            this.$el.toggleClass('hide', !status).trigger('hide', [!status])
        else if (this.options.triggerAction == 'hide')
            this.$el.toggleClass('hide', status).trigger('hide', [status])
        else if (this.options.triggerAction == 'enable')
            this.$el.prop('disabled', !status).trigger('disable', [!status]).toggleClass('control-disabled', !status)
        else if (this.options.triggerAction == 'disable')
            this.$el.prop('disabled', status).trigger('disable', [status]).toggleClass('control-disabled', status)
        else if (this.options.triggerAction == 'empty' && status)
            this.$el.trigger('empty').val('')

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
