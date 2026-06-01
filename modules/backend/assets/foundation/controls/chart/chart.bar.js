/*
 * Bar chart control
 *
 * Data attributes:
 * - data-control="chart-bar" - enables the bar chart control
 * - data-height="200" - optional, height of the graph
 * - data-full-width="1" - optional, determines whether the chart should use the full width of the container
 *
 * JavaScript API:
 * oc.fetchControl(element, 'chart-bar')
 *
 * Dependencies:
 * - Raphael (raphael-min.js)
 */
oc.registerControl('chart-bar', class extends oc.ControlBase {
    init() {
        this.config = Object.assign({
            gap: 2,
            height: undefined,
            fullWidth: undefined
        }, this.config);
    }

    connect() {
        this.$el = $(this.element);
        this.buildChart();
    }

    disconnect() {
        $(window).off('resize', this.proxy(this.onResize));
        this.$el = null;
    }

    isFullWidth() {
        return this.config.fullWidth !== undefined && this.config.fullWidth;
    }

    buildChart() {
        var self = this,
            size = this.size = this.$el.height(),
            values = $.oc.chartUtils.loadListValues($('ul', this.$el)),
            $legend = $.oc.chartUtils.createLegend($('ul', this.$el)),
            indicators = $.oc.chartUtils.initLegendColorIndicators($legend),
            isFullWidth = this.isFullWidth(),
            chartHeight = this.config.height !== undefined ? this.config.height : size,
            chartWidth = isFullWidth ? this.$el.width() : size,
            barWidth = (chartWidth - (values.values.length-1)*this.config.gap)/values.values.length;

        var $canvas = $('<div/>').addClass('canvas').height(chartHeight).width(isFullWidth ? '100%' : chartWidth);
        this.$el.prepend($canvas);
        this.$el.toggleClass('full-width', isFullWidth);

        Raphael($canvas.get(0), isFullWidth ? '100%' : chartWidth, chartHeight, function(){
            self.paper = this;
            self.bars = this.set();

            self.paper.customAttributes.bar = function (start, height) {
                return {
                    path: [
                        ["M", start, chartHeight],
                        ["L", start, chartHeight-height],
                        ["L", start + barWidth, chartHeight-height],
                        ["L", start + barWidth, chartHeight],
                        ["Z"]
                    ]
                };
            };

            // Add bars
            var start = 0;
            $.each(values.values, function(index, valueInfo) {
                var color = valueInfo.color !== undefined ? valueInfo.color : $.oc.chartUtils.getColor(index),
                    path = self.paper.path().attr({"stroke-width": 0}).attr({bar: [start, 0]}).attr({fill: color});

                self.bars.push(path);
                indicators[index].css('background-color', color);
                start += barWidth + self.config.gap;

                path.hover(function(ev){
                    $.oc.chartUtils.showTooltip(ev.pageX, ev.pageY,
                        $.trim($.oc.chartUtils.getLegendLabel($legend, index)) + ': <strong>'+valueInfo.value+'</strong>')
                }, function() {
                    $.oc.chartUtils.hideTooltip()
                });
            });

            // Animate bars
            start = 0;
            $.each(values.values, function(index, valueInfo) {
                var height = (values.max && valueInfo.value) ? chartHeight/values.max * valueInfo.value : 0;

                self.bars[index].animate({bar: [start, height]}, 1000, "bounce");
                start += barWidth + self.config.gap;
            });

            // Update the full-width chart when the window is resized
            if (isFullWidth) {
                $(window).on('resize', self.proxy(self.onResize));
                self._resizeData = { values: values, chartHeight: chartHeight };
            }
        });
    }

    onResize() {
        if (!this._resizeData) {
            return;
        }

        var values = this._resizeData.values,
            chartHeight = this._resizeData.chartHeight,
            chartWidth = this.$el.width(),
            barWidth = (chartWidth - (values.values.length-1)*this.config.gap)/values.values.length;

        var start = 0;
        var self = this;
        $.each(values.values, function(index, valueInfo) {
            var height = (values.max && valueInfo.value) ? chartHeight/values.max * valueInfo.value : 0;

            self.bars[index].animate({bar: [start, height]}, 10, "bounce");
            start += barWidth + self.config.gap;
        });
    }
});

// JQUERY PLUGIN DEFINITION
// ============================

$.fn.barChart = function (option) {
    return this.each(function () {
        oc.observeControl(this, 'chart-bar');
    });
};
