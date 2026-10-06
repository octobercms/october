import phosphorIconList from '../../../../../backend/assets/js/ph-icons-list.js';
import DataHelper from '../../../../assets/js/classes/data-helper.js';
import WidgetBase from './widget-base.js';
import { utils as inspectorUtils } from '../../../../../backend/vuecomponents/inspector/assets/js/classes/index.js';
import { modalUtils } from '../../../../../backend/vuecomponents/modal/assets/js/classes/index.js';

export default {
    extends: WidgetBase,
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

            if (!this.linkHref) {
                return this.linkHref;
            }

            // Only allow relative URLs or http and https URLs
            try {
                const url = new URL(this.linkHref, window.location.href);
                if (url.protocol === 'http:' || url.protocol === 'https:') {
                    return this.linkHref;
                }
            }
            catch (err) {}

            return '#';
        },

        complicationClass: function () {
            if (this.isIndicatorDimension) {
                return this.getWidgetDataForMetric('icon_complication', '');
            }

            return null;
        },

        goalValue: function () {
            const goal = parseFloat(this.widget.configuration.goal);
            if (this.isIndicatorDimension || !(goal > 0)) {
                return null;
            }

            return goal;
        },

        goalProgress: function () {
            const total = this.getMetricTotalClean(this.valueMetric);
            if (this.goalValue === null || total === null || isNaN(total)) {
                return null;
            }

            return total / this.goalValue;
        },

        goalBarWidth: function () {
            return Math.min(this.goalProgress, 1) * 100 + '%';
        },

        goalText: function () {
            return oc.t(":percent of :goal", {
                percent: DataHelper.instance().formatValue(
                    this.goalProgress,
                    { style: 'percent', maximumFractionDigits: 0 },
                    this.store.state.locale
                ),
                goal: this.formatMetricValue(this.valueMetric, this.goalValue)
            });
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
            // Vue 3: Direct assignment is reactive
            if (this.widget.configuration.title === undefined) {
                this.widget.configuration.title = oc.t("Indicator");
            }

            if (this.widget.configuration.icon === undefined) {
                this.widget.configuration.icon = 'ph ph-sun';
            }

            this.widget.loadedValue = {
                oc_metric_value: oc.t("No Value"),
                icon_status: 'disabled'
            };
        },

        getSettingsConfiguration: function () {
            const result = [];
            this.addTitleConfigurationProp(result);

            const metricsVisibility = (obj) => {
                return !String(obj.dimension).startsWith('indicator@') &&
                    !inspectorUtils.isValueEmpty(obj.dimension);
            }

            const linkTextVisibility = (obj) => {
                if (!metricsVisibility(obj)) {
                    return false;
                }

                return !inspectorUtils.isValueEmpty(obj.linkText);
            }

            result.push({
                property: 'icon',
                title: oc.t("Icon"),
                tab: oc.t("General"),
                type: 'dropdown',
                options: phosphorIconList,
                useValuesAsIcons: true,
                validation: {
                    required: {
                        message: oc.t("Please select an icon"),
                    }
                }
            });

            this.addDataSourceProps(result, oc.t("General"), ['indicator']);
            this.addDataSourceConfigurationProps(result, ['auto_update']);

            const metricsCacheKey = 'ds-metrics';
            const metricsCachePropertyNames = ['dataSource', 'dimension'];

            result.push({
                property: 'metric',
                title: oc.t("Value"),
                tab: oc.t("General"),
                default: 'value',
                type: 'dropdown',
                dataCacheKeyName: metricsCacheKey,
                dataCacheKeyPropertyNames: metricsCachePropertyNames,
                depends: ['dataSource', 'dimension'],
                visibility: metricsVisibility
            });

            result.push({
                property: 'goal',
                title: oc.t("Goal"),
                description: oc.t("Shows the progress toward this value for the selected period."),
                tab: oc.t("General"),
                type: 'string',
                validation: {
                    float: {
                        allowNegative: false,
                        message: oc.t("Enter a positive number")
                    }
                },
                visibility: metricsVisibility
            });

            result.push({
                property: 'icon_status',
                default: 'icon_status',
                title: oc.t("Icon Status"),
                tab: oc.t("General"),
                type: 'dropdown',
                options: {
                    'status-info': oc.t("Information"),
                    'status-important': oc.t("Important"),
                    'status-success': oc.t("Success"),
                    'status-warning': oc.t("Warning"),
                    'status-disabled': oc.t("Disabled"),
                },
                visibility: metricsVisibility
            });

            result.push({
                property: 'linkText',
                title: oc.t("Link Text"),
                tab: oc.t("General"),
                type: 'string'
            });

            result.push({
                property: 'linkHref',
                default: '',
                title: oc.t("Link URL"),
                tab: oc.t("General"),
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
                await modalUtils.showBasic(
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
    }
};
