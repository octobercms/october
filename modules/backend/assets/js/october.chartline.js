/*
 * Line Chart Plugin
 *
 * Data attributes:
 * - data-control="chart-line" - enables the line chart plugin
 * - data-reset-zoom-link="#reset-zoom" - specifies a link to reset zoom
 * - data-zoomable - indicates that the chart is zoomable
 * - data-time-mode="weeks" - if the "weeks" value is specified and the xaxis mode is "time", the X axis labels will be displayed as week end dates.
 * - data-chart-options="xaxis: {mode: 'time'}" - specifies the Flot configuration in JSON format. See https://github.com/flot/flot/blob/master/API.md for details.
 *
 * Data sets are defined with the SPAN elements inside the chart element: <span data-chart="dataset" data-set-data="[0,0],[1,19]">
 * Data set elements could contain data attributes with names in the format "data-set-color". The names for the data set
 * attributes are described in the Flot documentation: https://github.com/flot/flot/blob/master/API.md#data-format
 *
 * JavaScript API:
 * $('.chart').chartLine({ resetZoomLink:'#reset-zoom' })
 *
 *
 * Dependences: 
 * - Flot (jquery.flot.js)
 * - Flot Pie (jquery.flot.pie.js)
 * - Flot Tooltip (jquery.flot.tooltip.js)
 * - Flot Selection (jquery.flot.selection.js)
 * - Flot Resize (jquery.flot.resize.js)
 * - Flot Time (jquery.flot.time.js)
 * - Flot Order Bars (jquery.orderBars.js)
 */

+function ($) { "use strict";

    // LINE CHART CLASS DEFINITION
    // ============================

    var ChartLine = function(element, options) {
        var self = this

        /*
         * Flot options
         */
        this.chartOptions = {
            xaxis: { 
                mode: "time", 
                tickLength: 5
            },
            selection: { mode: "x" },
            grid: { 
                markingsColor:   "rgba(0,0,0, 0.02)",
                backgroundColor: { colors: ["#fff", "#fff"] },
                borderColor:     "#7bafcc",
                borderWidth:     0,
                color:           "#ddd",
                hoverable:       true,
                clickable:       true,
                labelMargin:     10
            },
            series: {
                lines: {
                    show: true,
                    fill: true
                },
                points: {
                    show: true
                }
            },
            tooltip: true,
            tooltipOpts: {
                defaultTheme: false,
                content:      "%x: <strong>%y</strong>",
                dateFormat:   "%y-%0m-%0d",
                shifts: {
                    x: 10,
                    y: 20
                }
            },
            legend: {
                show: true,
                noColumns: 2
            }
        }

        this.defaultDataSetOptions = {
            shadowSize: 0
        }

        var parsedOptions = {}
        try {
            parsedOptions = JSON.parse(JSON.stringify(eval("({" + options.chartOptions + "})")));
        } catch (e) {
            throw new Error('Error parsing the data-chart-options attribute value. '+e);
        }

        this.chartOptions = $.extend({}, this.chartOptions, parsedOptions)

        this.options       = options,
        this.$el           = $(element)
        this.fullDataSet   = []
        this.resetZoomLink = $(options.resetZoomLink)

        this.$el.trigger('oc.chartLineInit', [this])

        /*
         * Bind Events
         */

        this.resetZoomLink.on('click', $.proxy(this.clearZoom, this));

        if (this.options.zoomable) {
            this.$el.on("plotselected", function (event, ranges) {
                var newCoords = { 
                    xaxis: { min: ranges.xaxis.from, max: ranges.xaxis.to } 
                }
                
                $.plot(self.$el, self.fullDataSet, $.extend(true, {}, self.chartOptions, newCoords))
                self.resetZoomLink.show()
            });
        }
        
        /*
         * Markings Helper
         */

        if (this.chartOptions.xaxis.mode == "time" && this.options.timeMode == "weeks")
            this.chartOptions.markings = weekendAreas

        function weekendAreas(axes) {
            var markings = [],
                d = new Date(axes.xaxis.min);
            
            // Go to the first Saturday
            d.setUTCDate(d.getUTCDate() - ((d.getUTCDay() + 1) % 7))
            d.setUTCSeconds(0)
            d.setUTCMinutes(0)
            d.setUTCHours(0)
            var i = d.getTime()
            
            do {
                // When we don't set yaxis, the rectangle automatically
                // extends to infinity upwards and downwards
                markings.push({ xaxis: { from: i, to: i + 2 * 24 * 60 * 60 * 1000 } })
                i += 7 * 24 * 60 * 60 * 1000
            } while (i < axes.xaxis.max)

            return markings
        }

        /*
         * Process the datasets
         */

        this.initializing = true

        this.$el.find('>[data-chart="dataset"]').each(function(){
            var data = $(this).data(),
                processedData = {};

            for (var key in data) {
                var normalizedKey = key.substring(3),
                    value = data[key];

                normalizedKey = normalizedKey.charAt(0).toLowerCase() + normalizedKey.slice(1);
                if (normalizedKey == 'data')
                    value = JSON.parse('['+value+']');

                processedData[normalizedKey] = value;
            }

            self.addDataSet($.extend({}, self.defaultDataSetOptions, processedData));
        })

        /*
         * Build chart
         */

        this.initializing = false
        this.rebuildChart()
    }

    ChartLine.DEFAULTS = {
        chartOptions: "",
        timeMode: null,
        zoomable: false
    }

    /*
     * Adds a data set to the chart. 
     * See https://github.com/flot/flot/blob/master/API.md#data-format for the list
     * of supported data set options.
     */
    ChartLine.prototype.addDataSet = function (dataSet) {
        this.fullDataSet.push(dataSet)

        if (!this.initializing)
            this.rebuildChart()
    }

    ChartLine.prototype.rebuildChart = function() {
        this.$el.trigger('oc.beforeChartLineRender', [this])

        $.plot(this.$el, this.fullDataSet, this.chartOptions)
    }

    ChartLine.prototype.clearZoom = function() {
        this.rebuildChart()
        this.resetZoomLink.hide()
    }

    // LINE CHART PLUGIN DEFINITION
    // ============================

    var old = $.fn.chartLine

    $.fn.chartLine = function (option) {
        return this.each(function () {
            var $this   = $(this)
            var data    = $this.data('october.chartLine')
            var options = $.extend({}, ChartLine.DEFAULTS, $this.data(), typeof option == 'object' && option)
            if (!data) $this.data('october.chartLine', (data = new ChartLine(this, options)))
            if (typeof option == 'string') data[option].call($this)
        })
    }

    $.fn.chartLine.Constructor = ChartLine

    // LINE CHART NO CONFLICT
    // =================

    $.fn.chartLine.noConflict = function () {
        $.fn.chartLine = old
        return this
    }


    // LINE CHART DATA-API
    // ===============
    $(document).render(function () {
        $('[data-control="chart-line"]').chartLine()
    })

}(window.jQuery);
