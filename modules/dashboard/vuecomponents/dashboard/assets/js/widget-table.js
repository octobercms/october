Vue.component('dashboard-component-dashboard-widget-table', {
    extends: Vue.options.components['dashboard-component-dashboard-widget-base'],
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
            Vue.set(this.widget.configuration, 'title', 'Table');
            Vue.set(this.widget.configuration, 'metrics', []);
        },

        getDimensionText: function (text) {
            if (text === null || text === undefined) {
                return oc.lang.get('dashboard.value_not_set');
            }

            const str = String(text);
            if (!str.length) {
                return oc.lang.get('dashboard.value_not_set');
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
            this.addDataSourceProps(result, oc.lang.get('dashboard.tab_general'));
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
                title: oc.lang.get('dashboard.prop_display_relative_bar'),
                type: 'checkbox'
            })

            this.addConfigurationPropBefore(result, 'limit', {
                property: 'records_per_page',
                tab: oc.lang.get('dashboard.tab_sorting_filtering'),
                title: oc.lang.get('dashboard.prop_records_per_page'),
                type: 'string',
                placeholder: oc.lang.get('dashboard.records_per_page_placeholder'),
                validation: {
                    integer: {
                        allowNegative: false,
                        message: oc.lang.get('dashboard.records_per_page_invalid'),
                        min: {
                            value: 1,
                            message: oc.lang.get('dashboard.records_per_page_invalid')
                        }
                    }
                }
            });

            result.push({
                property: 'dimension_fields',
                tab: oc.lang.get('dashboard.tab_general'),
                title: oc.lang.get('dashboard.prop_extra_table_fields'),
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
    },
    template: '#dashboard_vuecomponents_dashboard_widget_table'
});
