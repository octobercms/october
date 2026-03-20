'use strict';

/**
 * Sizing class for dashboard widget column calculations.
 */
export default class Sizing
{
    constructor() {
        this.totalColumns = 20;
        this.minWidth = 3;
    }

    static instance() {
        return this.$instance || (this.$instance = new this);
    }

    canFitNewWidget(widgets, newWidgetWidth) {
        let result = 0;
        widgets.forEach((widget) => {
            result += widget.width;
        });

        return newWidgetWidth <= (this.totalColumns - result);
    }

    canFitNewMinSizeWidget(widgets) {
        return this.canFitNewWidget(widgets, this.minWidth);
    }

    totalWidgetsWidth(widgets) {
        let result = 0;
        widgets.forEach((widget) => {
            result += widget.width;
        });

        return result;
    }

    calculateColumnsAvailableForWidget(widgets, currentWidgetIndex) {
        let remainingColumns = this.totalColumns;
        widgets.forEach((widget, index) => {
            if (index === currentWidgetIndex) {
                return;
            }

            remainingColumns -= widget.width;
        });

        return Math.max(this.minWidth, remainingColumns);
    }

    calculateColumnWidth(rowElement) {
        const elementWidth = $(rowElement).width();

        return Math.round(elementWidth / this.totalColumns);
    }
}
