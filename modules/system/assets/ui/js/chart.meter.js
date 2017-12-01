/*
 * The goal meter plugin. 
 *
 * Applies the goal meter style to a scoreboard item.
 * 
 * Data attributes:
 * - data-control="goal-meter" - enables the goal meter plugin
 * - data-value - sets the value, in percents
 *
 * JavaScript API:
 * $('.scoreboard .goal-meter').goalMeter({value: 20})
 * $('.scoreboard .goal-meter').goalMeter(10) // Sets the current value
 */
+function ($) { "use strict";

    var GoalMeter = function (element, options) {
        var 
            $el = this.$el = $(element),
            self = this;

        this.options = options || {};

        this.$indicatorBar = $('<span/>').text(this.options.value + '%')
        this.$indicatorOuter = $('<span/>').addClass('goal-meter-indicator').append(this.$indicatorBar)

        $('p', this.$el).first().before(this.$indicatorOuter)

        window.setTimeout(function(){
            self.update(self.options.value)
        }, 200)
    }

    GoalMeter.prototype.update = function(value) {
        this.$indicatorBar.css('height', value + '%')
    }

    GoalMeter.DEFAULTS = {
        value: 50
    }

    // GOALMETER PLUGIN DEFINITION
    // ============================

    var old = $.fn.goalMeter

    $.fn.goalMeter = function (option) {
        return this.each(function () {
            var $this = $(this)
            var data  = $this.data('oc.goalMeter')
            var options = $.extend({}, GoalMeter.DEFAULTS, $this.data(), typeof option == 'object' && option)

            if (!data) 
                $this.data('oc.goalMeter', (data = new GoalMeter(this, options)))
            else
                data.update(option)
        })
    }

    $.fn.goalMeter.Constructor = GoalMeter

    // GOALMETER NO CONFLICT
    // =================

    $.fn.goalMeter.noConflict = function () {
        $.fn.goalMeter = old
        return this
    }

    // GOALMETER DATA-API
    // ===============


    $(document).render(function () {
        $('[data-control=goal-meter]').goalMeter()
    })

}(window.jQuery);