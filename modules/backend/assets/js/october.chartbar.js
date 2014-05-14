/*
 * The bar chart plugin. 
 * 
 * Data attributes:
 * - data-control="chart-bar" - enables the bar chart plugin
 * - data-height="200" - optional, height of the graph
 * - data-full-width="1" - optional, determines whether the chart should use the full width of the container
 *
 * JavaScript API:
 * $('.scoreboard .chart').barChart()
 *
 * Dependences: 
 * - Raphaël (raphael-min.js)
 * - October chart utilities (october.chartutils.js)
 */
+function ($) { "use strict";

    var BarChart = function (element, options) {
        this.options = options || {};

        var 
            $el = this.$el = $(element),
            size = this.size = $el.height(),
            total = 0,
            self = this,
            values = $.oc.chartUtils.loadListValues($('ul', $el)),
            $legend = $.oc.chartUtils.createLegend($('ul', $el)),
            indicators = $.oc.chartUtils.initLegendColorIndicators($legend),
            isFullWidth = this.isFullWidth(),
            chartHeight = this.options.height !== undefined ? this.options.height : size,
            chartWidth = isFullWidth ? this.$el.width() : size,
            barWidth = (chartWidth - (values.values.length-1)*this.options.gap)/values.values.length

        var $canvas = $('<div/>').addClass('canvas').height(chartHeight).width(isFullWidth ? '100%' : chartWidth)
        $el.prepend($canvas)
        $el.toggleClass('full-width', isFullWidth)

        Raphael($canvas.get(0), isFullWidth ? '100%' : chartWidth, chartHeight, function(){
            self.paper = this;
            self.bars = this.set()

            self.paper.customAttributes.bar = function (start, height) {
                return {
                    path: [
                        ["M", start, chartWidth], 
                        ["L", start, chartHeight-height],
                        ["L", start + barWidth, chartHeight-height],
                        ["L", start + barWidth, chartWidth],
                        ["Z"]
                    ]
                }
            }

            // Add bars
            var start = 0;
            $.each(values.values, function(index, valueInfo) {
                var color = valueInfo.color !== undefined ? valueInfo.color : $.oc.chartUtils.getColor(index),
                    path = self.paper.path().attr({"stroke-width": 0}).attr({bar: [start, 0]}).attr({fill: color})

                self.bars.push(path)
                indicators[index].css('background-color', color)
                start += barWidth + self.options.gap

                path.hover(function(ev){
                    $.oc.chartUtils.showTooltip(ev.pageX, ev.pageY, 
                        $.trim($.oc.chartUtils.getLegendLabel($legend, index)) + ': <strong>'+valueInfo.value+'</stong>')
                }, function() {
                    $.oc.chartUtils.hideTooltip()
                })
            })

            // Animate bars
            start = 0
            $.each(values.values, function(index, valueInfo) {
                var height = chartHeight/values.max * valueInfo.value;

                self.bars[index].animate({bar: [start, height]}, 1000, "bounce")
                start += barWidth + self.options.gap;
            })

            // Update the full-width chart when the window is redized
            if (isFullWidth) {
                $(window).on('resize', function(){
                    chartWidth = self.$el.width(),
                    barWidth = (chartWidth - (values.values.length-1)*self.options.gap)/values.values.length

                    var start = 0
                    $.each(values.values, function(index, valueInfo) {
                        var height = chartHeight/values.max * valueInfo.value;

                        self.bars[index].animate({bar: [start, height]}, 10, "bounce")
                        start += barWidth + self.options.gap;
                    })
                })
            }
        });
    }

    BarChart.prototype.isFullWidth = function() {
        return this.options.fullWidth !== undefined && this.options.fullWidth
    }

    BarChart.DEFAULTS = {
        gap: 2
    }

    // BARCHART PLUGIN DEFINITION
    // ============================

    var old = $.fn.barChart

    $.fn.barChart = function (option) {
        return this.each(function () {
            var $this = $(this)
            var data  = $this.data('oc.barChart')
            var options = $.extend({}, BarChart.DEFAULTS, $this.data(), typeof option == 'object' && option)

            if (!data)
                $this.data('oc.barChart', (data = new BarChart(this, options)))
        })
      }

    $.fn.barChart.Constructor = BarChart

    // BARCHART NO CONFLICT
    // =================

    $.fn.barChart.noConflict = function () {
        $.fn.barChart = old
        return this
    }

    // BARCHART DATA-API
    // ===============

    $(document).render(function () {
        $('[data-control=chart-bar]').barChart()
    })

}(window.jQuery);