/*
 * October charting utilities.
 */

+function ($) { "use strict";

    var ChartUtils = function() {}

    ChartUtils.prototype.defaultValueColor = '#b8b8b8';

    ChartUtils.prototype.getColor = function(index) {
        var
            colors = [
                '#95b753', '#cc3300', '#e5a91a', '#3366ff', '#ff0f00', '#ff6600',
                '#ff9e01', '#fcd202', '#f8ff01', '#b0de09', '#04d215', '#0d8ecf', '#0d52d1',
                '#2a0cd0', '#8a0ccf', '#cd0d74', '#754deb', '#dddddd', '#999999', '#333333',
                '#000000', '#57032a', '#ca9726', '#990000', '#4b0c25'
            ],
            colorIndex = index % (colors.length-1);

        return colors[colorIndex];
    }

    ChartUtils.prototype.loadListValues = function($list) {
        var result = {
            values: [],
            total: 0,
            max: 0
        }

        $('> li', $list).each(function(){
            var value = $(this).data('value')
                ? parseFloat($(this).data('value'))
                : parseFloat($('span', this).text());
            result.total += value
            result.values.push({value: value, color: $(this).data('color')})
            result.max = Math.max(result.max, value)
        })

        return result;
    }

    ChartUtils.prototype.getLegendLabel = function($legend, index) {
        return $('tr:eq('+index+') td:eq(1)', $legend).html();
    }

    ChartUtils.prototype.initLegendColorIndicators = function($legend) {
        var indicators = [];

        $('tr > td:first-child', $legend).each(function(){
            var indicator = $('<i></i>')
            $(this).prepend(indicator)
            indicators.push(indicator)
        })

        return indicators;
    }

    ChartUtils.prototype.createLegend = function($list) {
        var
            $legend = $('<div>').addClass('chart-legend'),
            $table = $('<table>')

        $legend.append($table)

        $('> li', $list).each(function(){
            var label = $(this).clone().children().remove().end().html();

            $table.append(
                $('<tr>')
                    .append($('<td class="indicator">'))
                    .append($('<td>').html(label))
                    .append($('<td>').addClass('value').html($('span', this).html()))
            )
        })

        $legend.insertAfter($list)
        $list.remove()

        return $legend;
    }

    ChartUtils.prototype.showTooltip = function(x, y, text) {
        var $tooltip = $('#chart-tooltip')

        if ($tooltip.length)
            $tooltip.remove()

        $tooltip = $('<div id="chart-tooltip">')
            .html(text)
            .css('visibility', 'hidden')

        x += 10
        y += 10

        $(document.body).append($tooltip)
        var tooltipWidth = $tooltip.outerWidth()
        if ((x + tooltipWidth) > $(window).width())
            x = $(window).width() - tooltipWidth - 10;

        $tooltip.css({top: y, left: x, visibility: 'visible'});
    }

    ChartUtils.prototype.hideTooltip = function() {
       $('#chart-tooltip').remove()
    }

    if ($.oc === undefined)
        $.oc = {}

    $.oc.chartUtils = new ChartUtils();
}(window.jQuery);
