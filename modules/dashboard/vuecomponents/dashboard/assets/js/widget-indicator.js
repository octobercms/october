Vue.component('dashboard-component-dashboard-widget-indicator', {
    extends: Vue.options.components['dashboard-component-dashboard-widget-base'],
    data: function () {
        return {
            loadingPopupData: false
        }
    },
    computed: {
        isIndicatorDimension: function () {
            return typeof this.widget.configuration.dimension === 'string' &&
                this.widget.configuration.dimension.startsWith('indicator@');
        },

        valueMetric: function () {
            return this.widget.configuration.metric ?? 'value';
        },

        iconStatusClass: function () {
            if (this.isIndicatorDimension) {
                return this.getWidgetDataForMetric('icon_status', 'status-success', 'status-');
            }

            return this.configuration.icon_status;
        },

        linkEnabled: function () {
            if (this.store.state.editMode) {
                return false;
            }

            if (this.isIndicatorDimension) {
                return this.getWidgetDataForMetric('link_enabled', false);
            }

            return true;
        },

        valueText: function () {
            const result = this.getWidgetDataForMetric(this.valueMetric, '');
            if (this.isIndicatorDimension) {
                return result;
            }

            return this.getMetricTotalFormatted(this.valueMetric);
        },

        prevPeriodDiff: function () {
            if (this.isIndicatorDimension) {
                return null;
            }

            const currentTotal = this.getMetricTotalClean(this.valueMetric);
            const prevTotal = this.getMetricTotalClean(this.valueMetric, true);
            if (prevTotal === null) {
                return null;
            }

            return currentTotal - prevTotal;
        },

        prevPeriodDiffFormatted: function () {
            return this.formatMetricValue(this.valueMetric, this.prevPeriodDiff);
        },

        prevPeriodDiffFormattedAbs: function () {
            return this.formatMetricValue(this.valueMetric, Math.abs(this.prevPeriodDiff));
        },

        linkHref: function () {
            if (this.isIndicatorDimension) {
                return this.getWidgetDataForMetric('link_href', '');
            }

            return this.configuration.linkHref;
        },

        linkHrefProcessed: function () {
            if (this.linkHref === 'popup') {
                return '#';
            }

            return this.linkHref;
        },

        complicationClass: function () {
            if (this.isIndicatorDimension) {
                return this.getWidgetDataForMetric('icon_complication', '');
            }

            return null;
        }
    },
    methods: {
        getRequestDimension: function () {
            return this.widget.configuration.dimension;
        },

        extendConfigurationBeforeDataFetch: function (widgetConfiguration) {
            if (this.isIndicatorDimension) {
                return;
            }

            // In the indicator widget we rely on metric totals
            //
            widgetConfiguration.metrics = [
                {
                    metric: this.valueMetric,
                    displayTotals: 1
                }
            ];

            widgetConfiguration.records_per_page = 1;
        },

        getRequestMetrics: function () {
            if (this.isIndicatorDimension) {
                return [
                    'icon_status',
                    'icon_complication',
                    'value',
                    'link_enabled',
                    'link_href'
                ];
            }
            else {
                return [
                    this.valueMetric
                ]
            }
        },

        makeDefaultConfigAndData: function () {
            if (this.widget.configuration.title === undefined) {
                Vue.set(this.widget.configuration, 'title', 'Indicator');
            }

            if (this.widget.configuration.icon === undefined) {
                Vue.set(this.widget.configuration, 'icon', 'ph ph-sun');
            }

            Vue.set(this.widget, 'loadedValue', {
                oc_metric_value: 'No Value',
                icon_status: 'disabled'
            });
        },

        getSettingsConfiguration: function () {
            const result = [];
            this.addTitleConfigurationProp(result);

            const metricsVisibility = (obj) => {
                return !String(obj.dimension).startsWith('indicator@') &&
                    !oc.vueComponentHelpers.inspector.utils.isValueEmpty(obj.dimension);
            }

            const linkTextVisibility = (obj) => {
                if (!metricsVisibility(obj)) {
                    return false;
                }

                return !oc.vueComponentHelpers.inspector.utils.isValueEmpty(obj.linkText);
            }

            result.push({
                property: 'icon',
                title: oc.lang.get('dashboard.widget_icon'),
                tab: oc.lang.get('dashboard.tab_general'),
                type: 'dropdown',
                options: oc.Modules.import('backend.phosphor-icon-list'),
                useValuesAsIcons: true,
                validation: {
                    required: {
                        message: oc.lang.get('dashboard.widget_icon_required'),
                    }
                }
            });

            this.addDataSourceProps(result, oc.lang.get('dashboard.tab_general'), ['indicator']);
            this.addDataSourceConfigurationProps(result, ['auto_update']);

            const metricsCacheKey = 'ds-metrics';
            const metricsCachePropertyNames = ['dataSource', 'dimension'];

            result.push({
                property: 'metric',
                title: oc.lang.get('dashboard.widget_metric_value'),
                tab: oc.lang.get('dashboard.tab_general'),
                default: 'value',
                type: 'dropdown',
                dataCacheKeyName: metricsCacheKey,
                dataCacheKeyPropertyNames: metricsCachePropertyNames,
                depends: ['dataSource', 'dimension'],
                visibility: metricsVisibility
            });

            result.push({
                property: 'icon_status',
                default: 'icon_status',
                title: oc.lang.get('dashboard.widget_icon_status'),
                tab: oc.lang.get('dashboard.tab_general'),
                type: 'dropdown',
                options: {
                    'status-info': oc.lang.get('dashboard.icon_status_info'),
                    'status-important': oc.lang.get('dashboard.icon_status_important'),
                    'status-success': oc.lang.get('dashboard.icon_status_success'),
                    'status-warning': oc.lang.get('dashboard.icon_status_warning'),
                    'status-disabled': oc.lang.get('dashboard.icon_status_disabled'),
                },
                visibility: metricsVisibility
            });

            result.push({
                property: 'linkText',
                title: oc.lang.get('dashboard.widget_link_text'),
                tab: oc.lang.get('dashboard.tab_general'),
                type: 'string'
            });

            result.push({
                property: 'linkHref',
                default: '',
                title: oc.lang.get('dashboard.widget_href'),
                tab: oc.lang.get('dashboard.tab_general'),
                type: 'string',
                visibility: linkTextVisibility,
                no_focus_on_visible: true
            });

            this.addDataSourceConfigurationProps(result, ['filters', 'date_interval']);

            return result;
        },

        loadAndDisplayPopup: async function () {
            this.loadingPopupData = true;
            const responseData = await this.runDataSourceHandler('onGetPopupData');
            this.loadingPopupData = false;

            try {
                await oc.vueComponentHelpers.modalUtils.showBasic(
                    responseData.title,
                    responseData.content
                );
            }
            catch (err) {}
        },

        onLinkClick: function (ev) {
            if (this.linkHref === 'popup') {
                ev.preventDefault();
                ev.stopPropagation();
                this.loadAndDisplayPopup();
                return;
            }
        }
    },
    template: '#dashboard_vuecomponents_dashboard_widget_indicator'
});
