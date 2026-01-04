Vue.component('dashboard-component-dashboard-widget-base', {
    props: {
        error: Boolean,
        widget: Object,
        store: Object,
        loading: Boolean,
        autoUpdating: Boolean
    },
    computed: {
        isConfigured: function () {
            return !!this.widget.configuration.dataSource;
        },

        loadedValue: function () {
            return this.fullWidgetData ? this.fullWidgetData.current.widget_data : undefined;
        },

        totalRecords: function () {
            return this.fullWidgetData ? this.fullWidgetData.current.total_records : 0;
        },

        loadedValuePrev: function () {
            return this.fullWidgetData && this.fullWidgetData.previous
                ? this.fullWidgetData.previous.widget_data
                : undefined;
        },

        metricsData: function () {
            return this.fullWidgetData ? this.fullWidgetData.metrics_data : undefined;
        },

        dimensionFieldsData: function () {
            return this.fullWidgetData ? this.fullWidgetData.dimension_fields_data : undefined;
        },

        metricsTotals: function () {
            return this.fullWidgetData ? this.fullWidgetData.current.metric_totals : undefined;
        },

        metricsTotalsPrev: function () {
            return this.fullWidgetData && this.fullWidgetData.previous
                ? this.fullWidgetData.previous.metric_totals
                : undefined;
        },

        metricsTotalsFormatted: function () {
            return this.fullWidgetData ? this.fullWidgetData.current.metric_totals_formatted : undefined;
        },

        metricsTotalsFormattedPrev: function () {
            return this.fullWidgetData && this.fullWidgetData.previous
                ? this.fullWidgetData.previous.metric_totals_formatted
                : undefined;
        },

        dimensionData: function () {
            return this.fullWidgetData ? this.fullWidgetData.dimension_data : undefined;
        },

        fullWidgetData: function () {
            return this.store.getWidgetDataForDashboard(
                this.store.getCurrentDashboard(),
                this.widget._unique_key
            );
        },

        configuration: function () {
            return this.widget.configuration;
        },

        showMetricsTotalRow: function () {
            if (!this.configuration.metrics) {
                return;
            }

            let result = false;
            this.configuration.metrics.forEach(metricConfig => {
                if (metricConfig.displayTotals) {
                    result = true;
                }
            });

            return result;
        },

        explicitLoading: function () {
            return this.loading && !this.autoUpdating;
        }
    },
    methods: {
        runDataSourceHandler(handlerName, extraData = {}) {
            const widgetConfiguration = $.oc.vueUtils.getCleanObject(this.widget.configuration);
            this.extendConfigurationBeforeDataFetch(widgetConfiguration);

            return this.store.dataSource.runDataSourceHandler(handlerName, widgetConfiguration, extraData);
        },

        request(handlerName, extraData = {}) {
            const widgetConfiguration = $.oc.vueUtils.getCleanObject(this.widget.configuration);
            this.extendConfigurationBeforeDataFetch(widgetConfiguration);

            return this.store.dataSource.runCustomWidgetHandler(handlerName, widgetConfiguration, extraData);
        },

        getRequestDimension: function () {
            throw new Error('getRequestDimension is not implemented');
        },

        getRequestMetrics: function () {
            throw new Error('getRequestMetrics is not implemented');
        },

        getRequestInterval: function (defaultInterval) {
            return defaultInterval;
        },

        extendConfigurationBeforeDataFetch: function (widgetConfiguration) {},

        getWidgetDataForMetricPeriod: function (metricCode, defaultValue, prefix, periodData) {
            if (!this.widget || !Array.isArray(periodData) || periodData.length < 1) {
                return defaultValue;
            }

            let result = periodData[0]['oc_metric_' + metricCode];
            if (prefix) {
                result = prefix + result;
            }

            return result;
        },

        getWidgetDataForMetric: function (metricCode, defaultValue, prefix) {
            return this.getWidgetDataForMetricPeriod(metricCode, defaultValue, prefix, this.loadedValue);
        },

        getWidgetDataForMetricPrev: function (metricCode, defaultValue, prefix) {
            return this.getWidgetDataForMetricPeriod(metricCode, defaultValue, prefix, this.loadedValuePrev);
        },

        getDimensionFieldName: function (dimensionFieldCode) {
            if (!this.dimensionFieldsData) {
                return "";
            }

            return this.dimensionFieldsData[dimensionFieldCode];
        },

        getDimensionFieldValue: function (record, dimensionFieldCode) {
            return record[dimensionFieldCode];
        },

        reloadOnGroupIntervalChange: function () {
            return false;
        },

        getRequestExtraData: function () {
            return {
                current_page: 0
            };
        },

        getSettingsConfiguration: function () {
            throw new Error('getSettingsConfiguration is not implemented');
        },

        useCustomData: function () {
            return false;
        },

        makeDefaultConfigAndData: function () {
            throw new Error('makeDefaultConfigAndData is not implemented');
        },

        getMetricTotalClean: function (metricCode, prevPeriod = false) {
            const totals = prevPeriod ? this.metricsTotalsPrev : this.metricsTotals;

            if (!totals || totals[metricCode] === null || totals[metricCode] === undefined) {
                return null;
            }

            return parseFloat(totals[metricCode]);
        },

        formatMetricValue: function (metricCode, value) {
            return Dashboard_Classes_DataHelper
                .instance()
                .formatValue(
                    value,
                    this.getMetricIntlFormatOptions(metricCode),
                    this.store.state.locale
                );
        },

        getMetricTotal: function (metricCode, prevPeriod = false) {
            const total = this.getMetricTotalClean(metricCode, prevPeriod);
            if (total === null) {
                return null;
            }

            return this.formatMetricValue(metricCode, total);
        },

        /**
         * Gets the formatted total for a metric, preferring server-side formatted values.
         * Use this for non-graph displays (tables, indicators) where custom formatting may be needed.
         */
        getMetricTotalFormatted: function (metricCode, prevPeriod = false) {
            const total = this.getMetricTotalClean(metricCode, prevPeriod);
            if (total === null) {
                return null;
            }

            const formattedTotals = prevPeriod ? this.metricsTotalsFormattedPrev : this.metricsTotalsFormatted;
            const formattedValue = formattedTotals ? formattedTotals[metricCode] : undefined;

            return Dashboard_Classes_DataHelper
                .instance()
                .formatDisplayValue(
                    total,
                    formattedValue,
                    this.getMetricIntlFormatOptions(metricCode),
                    this.store.state.locale
                );
        },

        /**
         * Checks if a metric has a server-side display formatter.
         */
        metricHasDisplayFormatter: function (metricCode) {
            if (!this.metricsData) {
                return false;
            }

            const metric = this.metricsData[metricCode];
            return metric ? !!metric.has_display_formatter : false;
        },

        /**
         * Formats a record's metric value, preferring server-side formatted values.
         * Use this for table displays where custom formatting may be needed.
         */
        formatRecordMetricValue: function (metricCode, record) {
            const columnName = 'oc_metric_' + metricCode;
            const formattedColumnName = columnName + '_formatted';
            const value = record[columnName];
            const formattedValue = record[formattedColumnName];

            return Dashboard_Classes_DataHelper
                .instance()
                .formatDisplayValue(
                    value,
                    formattedValue,
                    this.getMetricIntlFormatOptions(metricCode),
                    this.store.state.locale
                );
        },

        getMetricIntlFormatOptions: function (metricCode) {
            if (!this.metricsData) {
                return;
            }

            const metric = this.metricsData[metricCode];
            if (!metric) {
                return undefined;
            }

            return metric.format_options;
        },

        makeRandomWidth: function () {
            return Math.floor((0.3 + Math.random()*0.3) * 100) + '%';
        },

        // @deprecated
        trans(key) {
            const fullKey = 'data-lang-' + key;
            const result = this.$el.getAttribute(fullKey);
            if (typeof result === 'string') {
                return result;
            }

            const parent = this.$el.closest('[data-report-widget]');
            if (parent) {
                return parent.getAttribute(fullKey);
            }

            return null;
        },

        addTitleConfigurationProp: function (configuration, optional) {
            const prop = {
                property: 'title',
                title: oc.lang.get('dashboard.widget_title'),
                type: 'string'
            };

            if (!optional) {
                prop.validation = {
                    required: {
                        message: oc.lang.get('dashboard.widget_title_required'),
                    }
                }
            }
            else {
                prop.placeholder = oc.lang.get('dashboard.widget_title_optional_placeholder')
            }

            configuration.push(prop);
        },

        addDataSourceProps: function (configuration, tab, allowedDimensionTypes) {
            const configurator = new Dashboard_Classes_InspectorConfigurator(this.$el, this.trans, this.store);
            configurator.defineDataSource(configuration, tab, allowedDimensionTypes);
        },

        addDataSourceConfigurationProps: function(configuration, filter = [], suppress = []) {
            const configurator = new Dashboard_Classes_InspectorConfigurator(this.$el, this.trans, this.store);
            configurator.defineDataSourceProperties(configuration, filter, suppress);
        },

        getConfigurationPropIndex: function(configuration, propertyName) {
            return configuration.findIndex(obj => obj.property === propertyName);
        },

        findConfigurationProp: function(configuration, propertyName) {
            const index = this.getConfigurationPropIndex(configuration, propertyName)
            if (index !== -1) {
                return configuration[index];
            }

            return null;
        },

        onConfigurationUpdated: function() {},

        addConfigurationPropAfter: function(configuration, afterProperty, propConfiguration) {
            const index = this.getConfigurationPropIndex(configuration, afterProperty)

            if (index !== -1) {
                configuration.splice(index + 1, 0, propConfiguration);
            } else {
                throw new Error('Property ' + afterProperty + ' not found in the Inspector configuration');
            }
        },

        addConfigurationPropBefore: function(configuration, beforeProperty, propConfiguration) {
            const index = this.getConfigurationPropIndex(configuration, beforeProperty)

            if (index !== -1) {
                configuration.splice(index, 0, propConfiguration);
            } else {
                throw new Error('Property ' + afterProperty + ' not found in the Inspector configuration');
            }
        }
    }
});
