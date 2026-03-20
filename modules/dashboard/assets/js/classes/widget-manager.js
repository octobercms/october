'use strict';

import Sizing from './sizing.js';
import Helpers from './helpers.js';

/**
 * WidgetManager class for dashboard widget creation.
 */
export default class WidgetManager
{
    constructor() {
        this.sizing = Sizing.instance();
        this.helpers = Helpers.instance();
    }

    static instance() {
        return this.$instance || (this.$instance = new this);
    }

    createWidget(store, rows, row, type, defaultConfig, fullWidth) {
        if (fullWidth && row.widgets.length > 0) {
            return false;
        }

        const totalRowWidgetsWidth = this.sizing.totalWidgetsWidth(row.widgets);
        const availableWidth = this.sizing.totalColumns - totalRowWidgetsWidth;

        if (availableWidth < this.sizing.minWidth) {
            return false;
        }

        const newWidgetWidth = fullWidth
            ? this.sizing.totalColumns
            : Math.min(availableWidth, 4);

        const configuration = {
            type: type,
            reportName: this.helpers.makeCustomReportName()
        };

        if (typeof defaultConfig === 'object') {
            Object.assign(configuration, defaultConfig);
        }

        const newWidget = {
            _unique_key: this.helpers.makeUniqueKey(rows),
            configuration: configuration,
            width: newWidgetWidth,
        };

        row.widgets.push(newWidget);
        store.setSystemDataFlag(newWidget, 'needsConfiguration', true)

        return true;
    }
}
