/*
 * The pie chart plugin.
 * 
 * Data attributes:
 * - data-control="chart-pie" - enables the pie chart plugin
 * - data-size="200" - optional, size of the graph
 * - data-center-text - text to display inside the graph
 *
 * JavaScript API:
 * $('.scoreboard .chart').pieChart()
 *
 * Dependences:
 * - Raphaël (raphael-min.js)
 * - October chart utilities (october.chartutils.js)
 */
+function ($) { "use strict";

    var PieChart = function (element, options) {
        this.options = options || {};

        var 
            $el = this.$el = $(element),
            size = this.size = (this.options.size !== undefined ? this.options.size : $el.height()),
            outerRadius = size/2 - 1,
            innerRadius = outerRadius - outerRadius/3.5,
            total = 0,
            values = $.oc.chartUtils.loadListValues($('ul', $el)),
            $legend = $.oc.chartUtils.createLegend($('ul', $el)),
            indicators = $.oc.chartUtils.initLegendColorIndicators($legend),
            self = this;

        var $canvas = $('<div/>').addClass('canvas').width(size).height(size)
        $el.prepend($canvas)

        Raphael($canvas.get(0), size, size, function(){
            self.paper = this;
            self.segments = this.set()

            self.paper.customAttributes.segment = function (startAngle, endAngle) {
                var 
                    p1 = self.arcCoords(outerRadius, startAngle),
                    p2 = self.arcCoords(outerRadius, endAngle),
                    p3 = self.arcCoords(innerRadius, endAngle),
                    p4 = self.arcCoords(innerRadius, startAngle),
                    flag = (endAngle - startAngle) > 180,
                    path = [
                        ["M", p1.x, p1.y], 
                        ["A", outerRadius, outerRadius, 0, +flag, 0, p2.x, p2.y],
                        ["L", p3.x, p3.y],
                        ["A", innerRadius, innerRadius, 0, +flag, 1, p4.x, p4.y],
                        ["Z"]
                    ];

                return {path: path}
            }

            // Draw the background
            self.paper.circle(size/2, size/2, innerRadius + (outerRadius - innerRadius)/2)
                .attr({"stroke-width": outerRadius - innerRadius - 0.5})
                .attr({stroke: $.oc.chartUtils.defaultValueColor})

            // Add segments
            $.each(values.values, function(index, valueInfo) {
                var color = valueInfo.color !== undefined ? valueInfo.color : $.oc.chartUtils.getColor(index),
                    path = self.paper.path().attr({"stroke-width": 0}).attr({segment: [0, 0]}).attr({fill: color})

                self.segments.push(path)
                indicators[index].css('background-color', color)

                path.hover(function(ev){
                    $.oc.chartUtils.showTooltip(ev.pageX, ev.pageY, 
                        $.trim($.oc.chartUtils.getLegendLabel($legend, index)) + ': <strong>'+valueInfo.value+'</stong>')
                }, function() {
                    $.oc.chartUtils.hideTooltip()
                })
            })

            // Animate segments
            var start = self.options.startAngle;
            $.each(values.values, function(index, valueInfo) {
                var length = 360/values.total * valueInfo.value;
                if (length == 360)
                    length--;

                self.segments[index].animate({segment: [start, start + length]}, 1000, "bounce")
                start += length
            })
        });

        if (this.options.centerText !== undefined) {
            var $text = $('<span>').addClass('center').html(this.options.centerText)
            $canvas.append($text)
        }
    }

    PieChart.prototype.arcCoords = function(radius, angle) {
      var 
        a = Raphael.rad(angle),
        x = this.size/2 + radius * Math.cos(a),
        y = this.size/2 - radius * Math.sin(a);

        return {'x': x, 'y': y}
    }

    PieChart.DEFAULTS = {
        startAngle: 45
    }

    // PIECHART PLUGIN DEFINITION
    // ============================

    var old = $.fn.pieChart

    $.fn.pieChart = function (option) {
        return this.each(function () {
            var $this = $(this)
            var data  = $this.data('oc.pieChart')
            var options = $.extend({}, PieChart.DEFAULTS, $this.data(), typeof option == 'object' && option)

            if (!data) 
                $this.data('oc.pieChart', (data = new PieChart(this, options)))
        })
      }

    $.fn.pieChart.Constructor = PieChart

    // PIECHART NO CONFLICT
    // =================

    $.fn.pieChart.noConflict = function () {
        $.fn.pieChart = old
        return this
    }

    // PIECHART DATA-API
    // ===============

    $(document).render(function () {
        $('[data-control=chart-pie]').pieChart()
    })

}(window.jQuery);