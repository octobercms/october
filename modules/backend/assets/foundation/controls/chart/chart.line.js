/*
 * Line chart control
 *
 * Data attributes:
 * - data-control="chart-line" - enables the line chart control
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
 * oc.fetchControl(element, 'chart-line')
 *
 * Dependencies:
 * - Flot (jquery.flot.js)
 * - Flot Tooltip (jquery.flot.tooltip.js)
 * - Flot Resize (jquery.flot.resize.js)
 * - Flot Time (jquery.flot.time.js)
 */
oc.registerControl('chart-line', class extends oc.ControlBase {
    init() {
        this.config = Object.assign({
            chartOptions: "",
            timeMode: null,
            zoomable: false,
            resetZoomLink: null
        }, this.config);
    }

    connect() {
        this.$el = $(this.element);
        this.fullDataSet = [];
        var isDark = document.documentElement.getAttribute('data-bs-theme') === 'dark';
        var colorBackground = '#fff',
            colorMarkings = 'rgba(0,0,0,0.02)';

        if (isDark) {
            colorBackground = '#1e2227';
            colorMarkings = 'rgba(255,255,255,0.02)';
        }

        // Flot options
        this.chartOptions = {
            xaxis: {
                mode: "time",
                tickLength: 5
            },
            selection: { mode: "x" },
            grid: {
                markingsColor: colorMarkings,
                backgroundColor: { colors: [colorBackground, colorBackground] },
                borderColor: "#7bafcc",
                borderWidth: 0,
                color: colorBackground,
                hoverable: true,
                clickable: true,
                labelMargin: 10
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
                content: "%x: <strong>%y</strong>",
                dateFormat: "%y-%0m-%0d",
                shifts: {
                    x: 10,
                    y: 20
                }
            },
            legend: {
                show: true,
                noColumns: 2
            }
        };

        this.defaultDataSetOptions = {
            shadowSize: 0
        };

        var parsedOptions = {};
        try {
            parsedOptions = oc.parseJSON("{" + this.config.chartOptions + "}");
        }
        catch (e) {
            throw new Error('Error parsing the data-chart-options attribute value. '+e);
        }

        this.chartOptions = $.extend({}, this.chartOptions, parsedOptions);

        this.resetZoomLink = $(this.config.resetZoomLink);

        this.$el.trigger('oc.chartLineInit', [this]);

        // Bind events
        if (this.config.resetZoomLink) {
            this.resetZoomLink.on('click', this.proxy(this.clearZoom));
        }

        if (this.config.zoomable) {
            this.$el.on("plotselected", this.proxy(this.onPlotSelected));
        }

        // Markings helper
        if (this.chartOptions.xaxis.mode == "time" && this.config.timeMode == "weeks") {
            this.chartOptions.markings = this.weekendAreas;
        }

        // Process the datasets
        this.initializing = true;
        var self = this;

        this.$el.find('>[data-chart="dataset"]').each(function(){
            var data = $(this).data(),
                processedData = {};

            for (var key in data) {
                var normalizedKey = key.substring(3),
                    value = data[key];

                normalizedKey = normalizedKey.charAt(0).toLowerCase() + normalizedKey.slice(1);
                if (normalizedKey == 'data')
                    value = Array.isArray(value) ? [value] : JSON.parse('['+value+']');

                processedData[normalizedKey] = value;
            }

            self.addDataSet($.extend({}, self.defaultDataSetOptions, processedData));
        });

        // Build chart
        this.initializing = false;
        this.rebuildChart();
    }

    disconnect() {
        if (this.config.resetZoomLink) {
            this.resetZoomLink.off('click', this.proxy(this.clearZoom));
        }

        if (this.config.zoomable) {
            this.$el.off("plotselected", this.proxy(this.onPlotSelected));
        }

        this.resetZoomLink = null;
        this.$el = null;
    }

    onPlotSelected(event, ranges) {
        var newCoords = {
            xaxis: { min: ranges.xaxis.from, max: ranges.xaxis.to }
        };

        $.plot(this.$el, this.fullDataSet, $.extend(true, {}, this.chartOptions, newCoords));
        this.resetZoomLink.show();
    }

    weekendAreas(axes) {
        var markings = [],
            d = new Date(axes.xaxis.min);

        // Go to the first Saturday
        d.setUTCDate(d.getUTCDate() - ((d.getUTCDay() + 1) % 7));
        d.setUTCSeconds(0);
        d.setUTCMinutes(0);
        d.setUTCHours(0);
        var i = d.getTime();

        do {
            markings.push({ xaxis: { from: i, to: i + 2 * 24 * 60 * 60 * 1000 } });
            i += 7 * 24 * 60 * 60 * 1000;
        } while (i < axes.xaxis.max);

        return markings;
    }

    addDataSet(dataSet) {
        this.fullDataSet.push(dataSet);

        if (!this.initializing) {
            this.rebuildChart();
        }
    }

    rebuildChart() {
        this.$el.trigger('oc.beforeChartLineRender', [this]);

        $.plot(this.$el, this.fullDataSet, this.chartOptions);
    }

    clearZoom() {
        this.rebuildChart();
        this.resetZoomLink.hide();
    }
});

// JQUERY PLUGIN DEFINITION
// ============================

$.fn.chartLine = function (option) {
    return this.each(function () {
        oc.observeControl(this, 'chart-line');
    });
};
