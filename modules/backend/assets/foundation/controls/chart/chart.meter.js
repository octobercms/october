/*
 * Goal meter control
 *
 * Applies the goal meter style to a scoreboard item.
 *
 * Data attributes:
 * - data-control="goal-meter" - enables the goal meter control
 * - data-value - sets the value, in percents
 *
 * JavaScript API:
 * oc.fetchControl(element, 'goal-meter')
 */
oc.registerControl('goal-meter', class extends oc.ControlBase {
    init() {
        this.config = Object.assign({
            value: 50
        }, this.config);
    }

    connect() {
        this.$el = $(this.element);
        // Canvas already drawn
        if ($('span.goal-meter-indicator', this.$el).length > 0) {
            return;
        }

        this.$indicatorBar = $('<span />').text(this.config.value + '%');
        this.$indicatorOuter = $('<span />').addClass('goal-meter-indicator').append(this.$indicatorBar);

        $('p', this.$el).first().before(this.$indicatorOuter);

        window.setTimeout(() => {
            this.update(this.config.value);
        }, 200);
    }

    disconnect() {
        this.$indicatorBar = null;
        this.$indicatorOuter = null;
        this.$el = null;
    }

    update(value) {
        this.$indicatorBar.css('height', value + '%');
    }
});

// JQUERY PLUGIN DEFINITION
// ============================

$.fn.goalMeter = function (option) {
    return this.each(function () {
        var instance = oc.observeControl(this, 'goal-meter');
        if (typeof option === 'number' && instance) {
            instance.update(option);
        }
    });
};
