'use strict';

/**
 * Dashboard_Classes_DataHelper
 */
class Dashboard_Classes_DataHelper
{
    constructor() {
        this.numberFormats = {};
    }

    static instance() {
        return this.$instance || (this.$instance = new this);
    }

    pushChartData(data, loadedData, metricNames, nullAsZero, notSetLabel) {
        data.labels.splice(0, data.labels.length);
        for (let metricIndex = 0; metricIndex < metricNames.length; metricIndex++) {
            const metricName = metricNames[metricIndex];
            const dataset = data.datasets[metricIndex];
            const fullMetricName = 'oc_metric_' + metricName;
            const formattedMetricName = fullMetricName + '_formatted';
            dataset.data.splice(0, dataset.data.length);

            // Initialize array for formatted values (used by tooltips)
            if (!dataset.formattedData) {
                dataset.formattedData = [];
            }
            dataset.formattedData.splice(0, dataset.formattedData.length);

            loadedData.forEach(dataPoint => {
                let value = dataPoint[fullMetricName];
                if (value === null && nullAsZero) {
                    value = 0;
                }

                let dimensionValue = dataPoint.oc_dimension;
                if (dataPoint.oc_dimension_label) {
                    dimensionValue = dataPoint.oc_dimension_label;
                }

                if (dimensionValue === null) {
                    dimensionValue = notSetLabel;
                }

                // dataset.data.push({
                //     x: dimensionValue,
                //     y: value,
                // });

                if (metricIndex === 0) {
                    data.labels.push(dimensionValue);
                }

                dataset.data.push(value);

                // Store formatted value if available (from server-side displayFormatter)
                dataset.formattedData.push(dataPoint[formattedMetricName] ?? null);
            });
        }
    }

    hexToRgbaBackground(hex) {
        hex = hex.startsWith('#') ? hex.slice(1) : hex;

        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);

        return `rgba(${r}, ${g}, ${b}, 0.1)`;
    }

    formatValue(value, formatOptions, locale) {
        const cacheKey = JSON.stringify([locale, formatOptions]);
        if (!(cacheKey in this.numberFormats)) {
            this.numberFormats[cacheKey] = new Intl.NumberFormat(locale ?? undefined, formatOptions ?? undefined);
        }

        return this.numberFormats[cacheKey].format(value);
    }

    /**
     * Formats a value for display, preferring server-side formatted values when available.
     * Used for non-graph displays (tables, indicators) where custom formatting may be needed.
     * @param {*} value The raw value
     * @param {*} formattedValue The server-side formatted value (or undefined if not available)
     * @param {Object} formatOptions Intl.NumberFormat options for client-side fallback
     * @param {string} locale The locale to use for formatting
     * @returns {string} The formatted display string
     */
    formatDisplayValue(value, formattedValue, formatOptions, locale) {
        if (formattedValue !== undefined && formattedValue !== null) {
            return formattedValue;
        }

        return this.formatValue(value, formatOptions, locale);
    }
}
