'use strict';

/**
 * Dashboard_Classes_Helpers
 */
class Dashboard_Classes_Helpers
{
    constructor() {
        this.lastKnownKey = 0;
    }

    static instance() {
        return this.$instance || (this.$instance = new this);
    }

    dashboardHasUniqueKey(rows, key) {
        return rows.some((row) => {
            return row._unique_key === key || this.hasUniqueKey(row.widgets, key);
        })
    }

    hasUniqueKey(objects, key) {
        return objects.some(function(object) {
            return object._unique_key === key;
        });
    }

    makeUniqueKey(rows) {
        let uniqueKey = rows.length + this.lastKnownKey;

        while (this.dashboardHasUniqueKey(rows, uniqueKey)) {
            uniqueKey++;
        }

        this.lastKnownKey = uniqueKey;

        return uniqueKey;
    }

    makeCustomReportName() {
        return 'custom_report_' + Math.random().toString(36).slice(2, 16);
    }

    setUniqueKeysForDashboard(rows) {
        rows.forEach(row => {
            row._unique_key = this.makeUniqueKey(rows);

            row.widgets.forEach(widget => {
                widget._unique_key = this.makeUniqueKey(rows);
            })
        });
    }
}
