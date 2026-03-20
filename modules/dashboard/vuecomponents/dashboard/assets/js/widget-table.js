import WidgetBase from './widget-base.js';

export default {
    extends: WidgetBase,
    data: function () {
        return {
            paginating: false
        }
    },
    computed: {
        metricColumnCount: function () {
            let columnCount = 0;
            if (this.configuration && this.configuration.metrics) {
                this.configuration.metrics.forEach(metric => {
                    columnCount += metric.displayRelativeBar ? 2 : 1;
                })
            }

            return columnCount;
        },

        dimensionFieldColumnCount: function () {
            let dimensionFieldColumnCount = 0;
            if (this.configuration && this.configuration.dimension_fields) {
                dimensionFieldColumnCount = this.configuration.dimension_fields.length;
            }

            return dimensionFieldColumnCount;
        },

        tableStyle: function () {
            let columnCount = this.metricColumnCount;
            const metricsColumns = 'auto '.repeat(columnCount);

            let dimensionFieldColumnCount = this.dimensionFieldColumnCount;
            const dimensionFieldColumns = '1fr '.repeat(dimensionFieldColumnCount);

            const dimensionColumnWidth = dimensionFieldColumnCount > 0 ? 'auto' : '1fr';
            return {
                'grid-template-columns': dimensionColumnWidth + ' ' + dimensionFieldColumns + ' ' + metricsColumns
            };
        },

        fullWidthColumnStyle: function () {
            let columnCount = 1 + this.metricColumnCount + this.dimensionFieldColumnCount;

            return {
                'grid-column': 'span ' + columnCount
            };
        },

        currentPage: function () {
            const result = this.store.getSystemDataFlag(this.widget, 'current_page');
            if (result === undefined) {
                return 0;
            }

            return result;
        },

        startRecordDisplayIndex: function () {
            return this.currentPage * this.configuration.records_per_page + 1;
        },

        endRecordDisplayIndex: function () {
            return this.startRecordDisplayIndex + this.loadedValue.length - 1;
        },

        totalPages: function () {
            if (!this.configuration.records_per_page) {
                return 0;
            }

            return Math.ceil(this.totalRecords / this.configuration.records_per_page);
        },
    },
    methods: {
        getRequestDimension: function () {
            return this.widget.configuration.dimension;
        },

        getRequestMetrics: function () {
            if (!Array.isArray(this.widget.configuration.metrics)) {
                return [];
            }

            return this.widget.configuration.metrics.map(item => item.metric)
        },

        getRequestExtraData: function () {
            return {
                current_page: this.currentPage
            }
        },

        makeDefaultConfigAndData: function () {
            // Vue 3: Direct assignment is reactive
            this.widget.configuration.title = oc.t("Table");
            this.widget.configuration.metrics = [];
        },

        getDimensionText: function (text) {
            if (text === null || text === undefined) {
                return oc.t("[not set]");
            }

            const str = String(text);
            if (!str.length) {
                return oc.t("[not set]");
            }

            return str;
        },

        extendConfigurationBeforeDataFetch: function (widgetConfiguration) {
            if (!widgetConfiguration.metrics) {
                return;
            }
        },

        getSettingsConfiguration: function () {
            const suppress = [];
            const result = [];
            this.addTitleConfigurationProp(result, true);
            this.addDataSourceProps(result, oc.t("General"));
            this.addDataSourceConfigurationProps(result, [], suppress);

            const limitProp = this.findConfigurationProp(result, 'limit');
            Object.assign(limitProp, {
                type: 'string',
                visibility: {
                    source_property: 'records_per_page',
                    inverse: true,
                    value: '--any--'
                }
            });

            const metricsProp = this.findConfigurationProp(result, 'metrics');
            metricsProp.itemProperties.push({
                property: 'displayRelativeBar',
                title: oc.t("Display relative bars"),
                type: 'checkbox'
            })

            this.addConfigurationPropBefore(result, 'limit', {
                property: 'records_per_page',
                tab: oc.t("Sorting & Filtering"),
                title: oc.t("Records per page"),
                type: 'string',
                placeholder: oc.t("Leave empty to disable pagination"),
                validation: {
                    integer: {
                        allowNegative: false,
                        message: oc.t("Enter a positive number or leave empty to display all records."),
                        min: {
                            value: 1,
                            message: oc.t("Enter a positive number or leave empty to display all records.")
                        }
                    }
                }
            });

            result.push({
                property: 'dimension_fields',
                tab: oc.t("General"),
                title: oc.t("Extra table fields"),
                type: 'set',
                depends: ['dataSource', 'dimension'],
                dataCacheKeyName: 'ds-dimension-fields',
                dataCacheKeyPropertyNames: ['dataSource', 'dimension'],
            });

            return result;
        },

        getRecordValueClean: function (metricCode, record) {
            return record['oc_metric_' + metricCode];
        },

        getRecordValue: function (metricCode, record) {
            return this.formatRecordMetricValue(metricCode, record);
        },

        getRecordCssClass(paginating, record) {
            return {
                paginating: !!paginating,
                hide_link: typeof record.oc_record_url !== 'string'
            };
        },

        getRecordTotalRelativeValueClean: function (metricCode, record) {
            const recordValue = this.getRecordValueClean(metricCode, record);
            const total = this.getMetricTotalClean(metricCode);

            if (total === null) {
                return null;
            }

            if (total !== 0 && !isNaN(total) && !isNaN(recordValue)) {
                const result = (recordValue / total * 100).toFixed(2);
                return result;
            }

            return null;
        },

        getRecordTotalRelativeValue: function (metricCode, record) {
            const result = this.getRecordTotalRelativeValueClean(metricCode, record);
            if (result === null) {
                return '';
            }

            return '(' + result + '%)';
        },

        getRelativeBarStyle: function (metricCode, record, color) {
            const relativeValue = this.getRecordTotalRelativeValueClean(metricCode, record);
            if (relativeValue === null) {
                return {};
            }

            return {
                width: relativeValue + '%',
                background: color
            };
        },

        onConfigurationUpdated: function () {
            this.store.setSystemDataFlag(this.widget, 'current_page', 0);
        },

        onPrevPageClick: function () {
            if (this.currentPage <= 0) {
                return;
            }

            this.paginating = true;
            this.store.setSystemDataFlag(this.widget, 'current_page', this.currentPage - 1);
            this.$emit('reload');
        },

        onNextPageClick: function () {
            if (this.currentPage >= this.totalPages - 1) {
                return;
            }

            this.paginating = true;
            this.store.setSystemDataFlag(this.widget, 'current_page', this.currentPage + 1);
            this.$emit('reload');
        }
    },
    mounted: function () {
    },
    watch: {
        loading: function (newValue, oldValue) {
            if (!newValue) {
                this.paginating = false;
            }
        }
    }
};
