'use strict';

import { dataLoader } from '../../../../backend/vuecomponents/inspector/assets/js/classes/index.js';

/**
 * InspectorConfigurator class for dashboard widget configuration.
 */
export default class InspectorConfigurator
{
    constructor($el, translationFn, store) {
        this.trans = translationFn;
        this.store = store;
        this.$el = $el;

        this.filterAttributeCacheKey = 'ds-filter-attribute';
        this.filterAttributeCachePropertyNames = ['dataSource', 'dimension'];
        this.metricsCacheKey = 'ds-metrics';
        this.metricsCachePropertyNames = ['dataSource', 'dimension'];

        this.dataLoader = dataLoader;
    }

    get filterOperations() {
        return {
            '=': oc.t("Equal to"),
            '>=': oc.t("Greater or equal to"),
            '<=': oc.t("Less or equal to"),
            '>': oc.t("Greater than"),
            '<': oc.t("Less than"),
            'string_starts_with': oc.t("Starts with"),
            'string_includes': oc.t("Includes"),
            'one_of': oc.t("One of"),
        }
    }

    defineDataSource(configuration, tab, allowedDimensionTypes) {
        const getDynamicOptionsExtraData = () => {
            const result = {};
            if (Array.isArray(allowedDimensionTypes)) {
                result.allowed_dimension_types = allowedDimensionTypes.join(',');
            }

            return result;
        };

        configuration.push({
            property: 'dataSource',
            tab: tab,
            title: oc.t("Data source"),
            getDynamicOptionsExtraData: getDynamicOptionsExtraData,
            type: 'dropdown',
            validation: {
                required: {
                    message: oc.t("Please select a data source"),
                }
            }
        });

        configuration.push({
            property: 'dimension',
            tab: tab,
            title: oc.t("Dimension"),
            getDynamicOptionsExtraData: getDynamicOptionsExtraData,
            type: 'dropdown',
            depends: ['dataSource'],
            dataCacheKeyName: 'ds-dimensions',
            dataCacheKeyPropertyNames: ['dataSource'],
            validation: {
                required: {
                    message: oc.t("Please select a dimension"),
                }
            }
        });
    }

    propVisible(filter, suppress, propName) {
        const result = !filter.length || filter.includes(propName);
        if (!result) {
            return result;
        }

        return !suppress.includes(propName);
    }

    deletePropertyByName(props, name) {
        const index = props.findIndex(obj => obj.property === name);
        if (index > -1) {
            props.splice(index, 1);
        }
    }

    defineDataSourceProperties(configuration, filter = [], suppress = []) {
        this.propVisible(filter, suppress, 'metrics') && configuration.push({
            property: 'metrics',
            title: oc.t("Metrics"),
            tab: oc.t("General"),
            type: 'objectList',
            titleProperty: 'metric',
            formatItemTitle: async (item, obj, parentObj) => this.formatMetricItemTitle(item, obj, parentObj),
            colorProperty: 'color',
            depends: ['dataSource', 'dimension'],
            itemProperties: [
                {
                    property: 'metric',
                    title: oc.t("Metric"),
                    type: 'dropdown',
                    dataCacheKeyName: this.metricsCacheKey,
                    dataCacheKeyPropertyNames: this.metricsCachePropertyNames,
                    validation: {
                        required: {
                            message: oc.t("Please select metric(s)."),
                        }
                    }
                },
                {
                    property: 'color',
                    title: oc.t("Color"),
                    type: 'dropdown',
                    options: this.store.state.colors,
                    useValuesAsColors: true,
                    validation: {
                        required: {
                            message: oc.t("Select the metric color"),
                        }
                    }
                },
                {
                    property: 'displayTotals',
                    title: oc.t("Display totals"),
                    type: 'checkbox'
                },
            ],
            validation: {
                required: {
                    message: oc.t("Please select metric(s)."),
                }
            }
        });

        this.propVisible(filter, suppress, 'limit') && configuration.push({
            tab: oc.t("Sorting & Filtering"),
            property: 'limit',
            title: oc.t("Limit"),
            placeholder: oc.t("Display all records"),
            type: 'string',
            validation: {
                integer: {
                    allowNegative: false,
                    message: oc.t("Enter a positive number or leave empty to display all records."),
                    min: {
                        value: 1,
                        message: oc.t("The limit value must be at least 1")
                    }
                }
            }
        });

        this.propVisible(filter, suppress, 'empty_dimension_values') && configuration.push({
            tab: oc.t("Sorting & Filtering"),
            property: 'empty_dimension_values',
            group: oc.t("Empty values"),
            title: oc.t("Dimension"),
            default: 'not-set',
            type: 'dropdown',
            options: {
                'not-set': oc.t("Display [not set]"),
                'hide': oc.t("Hide")
            }
        });

        this.propVisible(filter, suppress, 'sortBy') && configuration.push({
            tab: oc.t("Sorting & Filtering"),
            property: 'sortBy',
            group: oc.t("Sorting"),
            title: oc.t("Sort by"),
            type: 'dropdown',
            default: 'oc_dimension',
            placeholder: oc.t("Select a dimension and metrics"),
            depends: ['dataSource', 'dimension', 'metrics'],
            dataCacheKeyName: 'ds-sort-by',
            dataCacheKeyPropertyNames: ['dataSource', 'dimension', 'metrics'],
            validation: {
                required: {
                    message: oc.t("Select sorting metric or dimension"),
                }
            }
        });

        this.propVisible(filter, suppress, 'sortOrder') && configuration.push({
            tab: oc.t("Sorting & Filtering"),
            property: 'sortOrder',
            group: oc.t("Sorting"),
            title: oc.t("Order"),
            type: 'dropdown',
            default: 'asc',
            options: {
                asc: oc.t("Ascending"),
                desc: oc.t("Descending")
            }
        });

        this.propVisible(filter, suppress, 'date_interval') && configuration.push({
            tab: oc.t("Sorting & Filtering"),
            property: 'date_interval',
            group: oc.t("Date interval"),
            title: oc.t("Display"),
            type: 'dropdown',
            default: 'dashboard',
            options: {
                dashboard: oc.t("Dashboard interval"),
                year: oc.t("This year"),
                quarter: oc.t("This quarter"),
                month: oc.t("This month"),
                week: oc.t("This week"),
                hour: oc.t("Past hour"),
                days: oc.t("Past X days")
            }
        });

        this.propVisible(filter, suppress, 'date_interval') && configuration.push({
            tab: oc.t("Sorting & Filtering"),
            property: 'date_interval_days',
            title: oc.t("Number of days"),
            group: oc.t("Date interval"),
            placeholder: oc.t("1 day (today) if not set"),
            type: 'string',
            visibility: {
                source_property: 'date_interval',
                value: 'days'
            },
            validation: {
                integer: {
                    allowNegative: false,
                    message: oc.t("Enter a positive number"),
                    min: {
                        value: 1,
                        message: oc.t("Enter a positive number")
                    }
                }
            }
        });

        this.propVisible(filter, suppress, 'auto_update') && configuration.push({
            tab: oc.t("Sorting & Filtering"),
            property: 'auto_update',
            title: oc.t("Refresh every minute"),
            type: 'checkbox',
        });

        this.propVisible(filter, suppress, 'filters') && configuration.push({
            tab: oc.t("Sorting & Filtering"),
            property: 'filters',
            title: oc.t("Filters"),
            type: 'objectList',
            titleProperty: 'filter_attribute',
            formatItemTitle: async (item, obj, parentObj) => this.formatFilterItemTitle(item, obj, parentObj),
            depends: ['dataSource', 'dimension'],
            itemProperties: [
                {
                    property: 'filter_attribute',
                    title: oc.t("Attribute"),
                    type: 'dropdown',
                    dataCacheKeyName: this.filterAttributeCacheKey,
                    dataCacheKeyPropertyNames: this.filterAttributeCachePropertyNames,
                    validation: {
                        required: {
                            message: oc.t("Select an attribute")
                        }
                    }
                },
                {
                    property: 'operation',
                    title: oc.t("Operation"),
                    type: 'dropdown',
                    options: this.filterOperations,
                    validation: {
                        required: {
                            message: oc.t("Select an operation")
                        }
                    }
                },
                {
                    property: 'value_scalar',
                    title: oc.t("Value"),
                    type: 'string',
                    visibility: {
                        source_property: 'operation',
                        value: 'one_of',
                        inverse: true
                    }
                },
                {
                    property: 'value_array',
                    title: oc.t("Values"),
                    type: 'text',
                    description: oc.t("One value per line"),
                    visibility: {
                        source_property: 'operation',
                        value: 'one_of'
                    }
                }
            ]
        });
    }

    async requestOptions(obj, parentObj, property, cacheKey, cachePropertyNames) {
        var data = Object.assign({}, $.oc.vueUtils.getCleanObject(parentObj), $.oc.vueUtils.getCleanObject(obj));
        data.inspectorProperty = property;

        const responseData = await this.dataLoader.requestOptions(
            this.$el,
            null,
            this.store.getEventHandler('onInspectableGetOptions'),
            data,
            cacheKey,
            cachePropertyNames
        );

        if (!Array.isArray(responseData.options)) {
            throw new Error('onInspectableGetOptions must return an array');
        }

        const result = {};
        responseData.options.forEach(item => {
            result[item.value] = item.title;
        })

        return result;
    }

    async formatFilterItemTitle(item, obj, parentObj) {
        const options = await this.requestOptions(
            obj,
            parentObj,
            'filter_attribute',
            this.filterAttributeCacheKey,
            this.filterAttributeCachePropertyNames
        );

        const attributeName = options[item.filter_attribute];
        let operationName = this.filterOperations[item.operation];
        if (typeof operationName === "string") {
            operationName = operationName.toLowerCase();
        }

        if (item.operation !== 'one_of') {
            return attributeName + ' ' + operationName + ' "' + item.value_scalar + '"';
        }

        const valueArray = item.value_array
            .split('\n')
            .map(item => item.trim())
            .filter((item) => item.length > 0);

        return attributeName + ' ' + operationName + ' ' + '["'+valueArray.join('", "')+'"]';
    }

    async formatMetricItemTitle(item, obj, parentObj) {
        const options = await this.requestOptions(
            obj,
            parentObj,
            'metric',
            this.metricsCacheKey,
            this.metricsCachePropertyNames
        );

        return options[item.metric];
    }
}
