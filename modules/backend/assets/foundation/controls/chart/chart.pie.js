/*
 * Pie chart control
 *
 * Data attributes:
 * - data-control="chart-pie" - enables the pie chart control
 * - data-size="200" - optional, size of the graph
 * - data-center-text - text to display inside the graph
 *
 * JavaScript API:
 * oc.fetchControl(element, 'chart-pie')
 *
 * Dependencies:
 * - Raphael (raphael-min.js)
 * - October chart utilities (chart.utils.js)
 */
oc.registerControl('chart-pie', class extends oc.ControlBase {
    init() {
        this.config = Object.assign({
            size: undefined,
            centerText: undefined,
            startAngle: 45
        }, this.config);
    }

    connect() {
        this.$el = $(this.element);
        // Canvas already drawn
        if ($('div.canvas', this.$el).length > 0) {
            return;
        }

        this.buildChart();
    }

    disconnect() {
        this.$el = null;
    }

    buildChart() {
        var size = this.size = (this.config.size !== undefined ? this.config.size : this.$el.height()),
            outerRadius = size/2 - 1,
            innerRadius = outerRadius - outerRadius/3.5,
            values = $.oc.chartUtils.loadListValues($('ul', this.$el)),
            $legend = $.oc.chartUtils.createLegend($('ul', this.$el)),
            indicators = $.oc.chartUtils.initLegendColorIndicators($legend),
            self = this;

        var $canvas = $('<div />').addClass('canvas').width(size).height(size);
        this.$el.prepend($canvas);

        // Truncate scoreboard in cases where there are more than 3 items
        $legend.height(size).css('overflow', 'hidden');

        Raphael($canvas.get(0), size, size, function(){
            self.paper = this;
            self.segments = this.set();

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

                return {path: path};
            };

            // Draw the background
            self.paper.circle(size/2, size/2, innerRadius + (outerRadius - innerRadius)/2)
                .attr({"stroke-width": outerRadius - innerRadius - 0.5})
                .attr({stroke: $.oc.chartUtils.defaultValueColor});

            // Add segments
            $.each(values.values, function(index, valueInfo) {
                var color = valueInfo.color !== undefined ? valueInfo.color : $.oc.chartUtils.getColor(index),
                    path = self.paper.path().attr({"stroke-width": 0}).attr({segment: [0, 0]}).attr({fill: color})

                self.segments.push(path)
                indicators[index].css('background-color', color)

                path.hover(function(ev){
                    $.oc.chartUtils.showTooltip(ev.pageX, ev.pageY,
                        $.trim($.oc.chartUtils.getLegendLabel($legend, index)) + ': <strong>'+valueInfo.value+'</strong>')
                }, function() {
                    $.oc.chartUtils.hideTooltip()
                })
            });

            // Animate segments
            var start = self.config.startAngle
            $.each(values.values, function(index, valueInfo) {
                var length = (values.total && valueInfo.value) ? 360/values.total * valueInfo.value : 0
                if (length == 360)
                    length--

                self.segments[index].animate({segment: [start, start + length]}, 1000, "bounce")
                start += length
            });
        })

        if (this.config.centerText !== undefined) {
            var $text = $('<span>').addClass('center').html(this.config.centerText);
            $canvas.append($text);
        }
    }

    arcCoords(radius, angle) {
        var
            a = Raphael.rad(angle),
            x = this.size/2 + radius * Math.cos(a),
            y = this.size/2 - radius * Math.sin(a);

        return {'x': x, 'y': y};
    }
});

// JQUERY PLUGIN DEFINITION
// ============================

$.fn.pieChart = function (option) {
    return this.each(function () {
        oc.observeControl(this, 'chart-pie');
    });
};