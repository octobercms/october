import DataHelper from '../../../../assets/js/classes/data-helper.js';
import WidgetBase from './widget-base.js';

const dataHelper = DataHelper.instance();

const pieColors = [
    '#6A6CF7', '#0EA5E9', '#84CC16', '#F59E0B', '#EF4444',
    '#A855F7', '#14B8A6', '#EC4899', '#64748B', '#F97316'
];

function formatInterval(interval, date) {
    if (interval === 'month') {
        return date.format('MMM, YYYY');
    }

    if (interval === 'quarter') {
        return date.format('[Q]Q YYYY');
    }

    if (interval === 'year') {
        return date.format('YYYY');
    }

    return date.format('MMM D, YYYY');
}

export default {
    extends: WidgetBase,
    data: function () {
        return {
            chart: null,
            lastGroupInterval: null
        }
    },
    computed: {
        isPieChart: function () {
            return ['pie', 'doughnut'].includes(this.configuration.chartType);
        }
    },
    methods: {
        getChartConfig: function () {
            if (this.isPieChart) {
                return this.getPieChartConfig();
            }

            const theme = $('html').data('bs-theme');
            const axisColor = theme === 'dark' ? '#6C757D' : '#E3EAEC';

            const interval = this.store.state.range.interval;
            const isDateDimension = this.configuration.dimension === 'date';
            let xAxisType = isDateDimension ? 'time' : 'category';
            // if (isDateDimension && this.store.state.range.interval !== 'day') {
                xAxisType = 'category';
            // }

            const reverseXAxis = xAxisType === 'time' &&
                this.configuration.sortBy === 'oc_dimension' &&
                this.configuration.sortOrder === 'desc';

            const metricsData = this.metricsData;
            const chartType = this.configuration.chartType;
            const barChartType = chartType === 'bar' || chartType === 'stacked-bar';
            let chartJsType = 'line';
            if (barChartType) {
                chartJsType = 'bar';
            }

            let indexAxis = 'x';
            if (barChartType && this.configuration.barDirection === 'horizontal') {
                indexAxis = 'y';
            }

            const metrics = this.getRequestMetrics();
            const datasets = [];

            metrics.forEach(metric => {
                const metricConfiguration = this.getMetricConfigurationByCode(metric);
                const lineColor = metricConfiguration ? metricConfiguration.color : '#6A6CF7';
                const bgColor = barChartType ? lineColor : dataHelper.hexToRgbaBackground(lineColor);

                datasets.push({
                    axis: indexAxis,
                    data: [],
                    label: metricsData[metric].label,
                    pointBackgroundColor: lineColor,
                    backgroundColor: bgColor,
                    borderColor: lineColor,
                    tension: 0.3,
                    formatting: this.getMetricIntlFormatOptions(metric)
                });
            })

            const result = {
                type: chartJsType,
                data: {
                    labels: [],
                    datasets: datasets
                },
                options: {
                    indexAxis: indexAxis,
                    datasets: {
                        line: {
                            fill: true,
                            pointRadius: 2,
                            borderWidth: 2,
                            spanGaps: true,
                        },
                        bar: {
                            borderRadius: 5,
                            borderWidth: 1,
                        }
                    },
                    maintainAspectRatio: false,
                    animation: false,
                    responsive: true,
                    layout: {
                        padding: {
                            top: 30
                        }
                    },
                    plugins: {
                        legend: {
                            display: false
                        },
                        tooltip: {
                            cornerRadius: 2,
                            callbacks: {
                                title: function (tooltipItem) {
                                    if (isDateDimension) {
                                        return formatInterval(interval, moment(tooltipItem[0].label));
                                    }

                                    return tooltipItem[0].label;
                                },
                                labelColor: function(tooltipItem, chart) {
                                    return {
                                        borderWidth: 0,
                                        backgroundColor: datasets[tooltipItem.datasetIndex].borderColor,
                                        borderRadius: 2
                                    };
                                },
                                label: (context) => {
                                    // Never display a label for null values.
                                    if (!context.parsed.y) {
                                        return null
                                    }

                                    let label = context.dataset.label || '';
                                    if (label) {
                                        label += ': ';
                                    }

                                    const valueAxis = indexAxis === 'x' ? 'y' : 'x';
                                    const formattedValue = context.dataset.formattedData
                                        ? context.dataset.formattedData[context.dataIndex]
                                        : null;

                                    label += dataHelper.formatDisplayValue(
                                        context.parsed[valueAxis],
                                        formattedValue,
                                        context.dataset.formatting,
                                        this.store.state.locale
                                    )

                                    return label;
                                }
                            }
                        }
                    },
                    scales: {
                        x: {
                            border: {
                                color: axisColor,
                                dash: [2, 2]
                            },
                            time: {
                                parser: 'YYYY-MM-DD',
                                displayFormats: {
                                    day: 'MMM D, YYYY'
                                }
                            },
                            ticks: {
                                autoSkip: indexAxis !== 'y',
                                maxRotation: 0,
                                minRotation: 0,
                                maxTicksLimit: indexAxis === 'y' ? 5 : undefined,
                                callback: function (value, index, values) {
                                    if (!isDateDimension) {
                                        return this.getLabelForValue(value);
                                    }

                                    let date = xAxisType === 'time' ?
                                        moment(value) :
                                        moment(this.getLabelForValue(value), "YYYY-MM-DD");

                                    return formatInterval(interval, date);
                                }
                            },
                            stacked: chartType === 'stacked-bar'
                        },
                        y: {
                            border: {
                                color: axisColor,
                                dash: [2, 2]
                            },
                            beginAtZero: true,
                            ticks: {
                                autoSkip: indexAxis === 'y' ? false : undefined,
                                maxTicksLimit: indexAxis !== 'y' ? 5 : undefined,
                            },
                            stacked: chartType === 'stacked-bar'
                        }
                    }
                }
            };

            result.options.scales[indexAxis].type = xAxisType;
            result.options.scales[indexAxis].reverse = reverseXAxis;

            if (indexAxis === 'x') {
                result.options.plugins.tooltip.mode = 'index';
                result.options.plugins.tooltip.intersect = false;
            }

            return result;
        },

        getPieChartConfig: function () {
            const metricsData = this.metricsData;
            const container = this.$el.closest('.widget-inner-container');

            // Slices are separated with the widget background color, so they work with any theme
            const sliceBorderColor = container ? getComputedStyle(container).backgroundColor : '#FFFFFF';

            const datasets = this.getRequestMetrics().map(metric => {
                return {
                    data: [],
                    label: metricsData[metric].label,
                    backgroundColor: (context) => pieColors[context.dataIndex % pieColors.length],
                    borderColor: sliceBorderColor,
                    borderWidth: 2,
                    formatting: this.getMetricIntlFormatOptions(metric)
                };
            });

            return {
                type: this.configuration.chartType,
                data: {
                    labels: [],
                    datasets: datasets
                },
                options: {
                    maintainAspectRatio: false,
                    animation: false,
                    responsive: true,
                    layout: {
                        padding: 10
                    },
                    plugins: {
                        legend: {
                            position: 'right',
                            labels: {
                                usePointStyle: true,
                                pointStyle: 'circle',
                                boxWidth: 8,
                                boxHeight: 8
                            }
                        },
                        tooltip: {
                            cornerRadius: 2,
                            callbacks: {
                                label: (context) => {
                                    const formattedValue = context.dataset.formattedData
                                        ? context.dataset.formattedData[context.dataIndex]
                                        : null;

                                    return context.dataset.label + ': ' + dataHelper.formatDisplayValue(
                                        context.parsed,
                                        formattedValue,
                                        context.dataset.formatting,
                                        this.store.state.locale
                                    );
                                }
                            }
                        }
                    }
                }
            };
        },

        getRequestDimension: function () {
            return this.widget.configuration.dimension;
        },

        reloadOnGroupIntervalChange: function () {
            return true;
        },

        getRequestMetrics: function () {
            if (!Array.isArray(this.widget.configuration.metrics)) {
                return [];
            }

            return this.widget.configuration.metrics.map(item => item.metric)
        },

        makeDefaultConfigAndData: function () {
            // Vue 3: Direct assignment is reactive
            this.widget.configuration.title = oc.t("Chart");
        },

        getMetricConfigurationByCode: function (metricCode) {
            if (!Array.isArray(this.widget.configuration.metrics)) {
                return null;
            }

            const metrics = this.widget.configuration.metrics;
            for (let metricIndex = 0; metricIndex < metrics.length; metricIndex++) {
                if (metrics[metricIndex].metric === metricCode) {
                    return metrics[metricIndex];
                }
            }

            return null;
        },

        getSettingsConfiguration: function () {
            const result = [];
            this.addTitleConfigurationProp(result, true);

            result.push({
                property: 'chartType',
                tab: oc.t("General"),
                title: oc.t("Chart type"),
                type: 'dropdown',
                options: {
                    'bar': oc.t("Bar"),
                    'stacked-bar': oc.t("Stacked Bar"),
                    'line': oc.t("Line"),
                    'pie': oc.t("Pie"),
                    'doughnut': oc.t("Doughnut")
                }
            });

            result.push({
                property: 'barDirection',
                tab: oc.t("General"),
                title: oc.t("Direction"),
                type: 'dropdown',
                default: 'vertical',
                options: {
                    vertical: oc.t("Vertical"),
                    horizontal: oc.t("Horizontal"),
                },
                visibility: {
                    source_property: 'chartType',
                    value: ['bar', 'stacked-bar']
                },
            });

            this.addDataSourceProps(result, oc.t("General"));
            this.addDataSourceConfigurationProps(result, [], ['auto_update']);

            return result;
        },

        buildChart: function () {
            const ctx = this.$refs.canvas.getContext('2d');
            this.chart = Vue.markRaw(new Chart(ctx, this.getChartConfig()));
        },

        populateChart: function () {
            dataHelper.pushChartData(
                this.chart.data,
                this.loadedValue,
                this.getRequestMetrics(),
                false, // Keep null values to create gaps in the chart
                oc.t("[not set]")
            );

            if (this.isPieChart && this.configuration.dimension === 'date') {
                const interval = this.store.state.range.interval;
                this.chart.data.labels = this.chart.data.labels.map(label => formatInterval(interval, moment(label)));
            }

            this.chart.update();
        }
    },
    mounted: function () {
        if (this.isConfigured && this.metricsData) {
            this.buildChart();

            // If the data already exists, which can happen if
            // the chart was moved, populate the chart immediately.
            if (this.loadedValue) {
                this.populateChart()
            }
        }
    },
    watch: {
        loadedValue: function () {
            if (!this.chart) {
                this.buildChart();
            } else {
                if (this.lastGroupInterval !== this.store.state.range.interval) {
                    this.chart.destroy();
                    this.buildChart();
                }
            }

            this.lastGroupInterval = this.store.state.range.interval;

            this.populateChart();
        },
        configuration: {
            handler(newVal, oldVal) {
                if (this.chart && this.isConfigured) {
                    this.chart.destroy();
                    this.buildChart();
                }
            },
            deep: true
        }
    },
    beforeUnmount: function() {
        if (this.chart) {
            this.chart.destroy();
            this.chart = null;
        }
    }
};
