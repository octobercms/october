/*
 * Computed cell processor for the table control.
 * The computed cell is a read-only cell that takes its value from the input of other cells (processed via AJAX).
 */
+function ($) { "use strict";

    // NAMESPACE CHECK
    // ============================

    if ($.oc.table === undefined) {
        throw new Error("The $.oc.table namespace is not defined. Make sure that the table.js script is loaded.")
    }

    if ($.oc.table.processor === undefined) {
        throw new Error("The $.oc.table.processor namespace is not defined. Make sure that the table.processor.base.js script is loaded.")
    }

    // CLASS DEFINITION
    // ============================

    var Base = $.oc.table.processor.base,
        BaseProto = Base.prototype

    var ComputedProcessor = function(tableObj, columnName, columnConfiguration) {
        //
        // State properties
        //
        this.cachedValues = {};

        //
        // Parent constructor
        //

        Base.call(this, tableObj, columnName, columnConfiguration)
    }

    ComputedProcessor.prototype = Object.create(BaseProto)
    ComputedProcessor.prototype.constructor = ComputedProcessor

    ComputedProcessor.prototype.dispose = function() {
        BaseProto.dispose.call(this)
        this.focusTimeoutHandler = null
    }

    /*
     * Renders the cell in the normal (no edit) mode
     */
    ComputedProcessor.prototype.renderCell = function(value, cellContentContainer) {
        var cellElement = cellContentContainer.parentNode

        cellElement.classList.add('muted')
        this.createViewContainer(cellContentContainer, value)

        if (!value) {
            value = this.getCachedValue(cellElement)

            if (value) {
                this.setViewContainerValue(cellElement, value)
            } else {
                this.getComputedValue(cellElement)
            }
        }
    }

    /*
     * Determines if the processor's cell is focusable.
     */
    ComputedProcessor.prototype.isCellFocusable = function() {
        return false
    }

    /*
     * Determines if the keyboard navigation in the specified direction is allowed
     * by the cell processor. Some processors could reject the navigation, for example
     * the string processor could cancel the left array navigation if the caret
     * in the text input is not in the beginning of the text.
     */
    ComputedProcessor.prototype.keyNavigationAllowed = function(ev, direction) {
        return true
    }

    /*
     * This method is called when a cell value in the row changes.
     */
    ComputedProcessor.prototype.onRowValueChanged = function(columnName, cellElement) {
        var dependsOn = this.columnConfiguration.dependsOn

        if (!dependsOn) {
            return
        }

        if (typeof dependsOn === 'object') {
            for (var i in dependsOn) {
                if (columnName === dependsOn[i]) {
                    this.getComputedValue(cellElement)
                    break
                }
            }
        } else if (columnName === dependsOn) {
            this.getComputedValue(cellElement)
        }
    }

    ComputedProcessor.prototype.getComputedValue = function(cellElement) {
        var row = cellElement.parentNode,
            that = this,
            viewContainer = this.getViewContainer(cellElement)

        viewContainer.setAttribute('class', 'loading')

        var requestData = {
            rowData: this.tableObj.getRowData(row)
        }

        this.tableObj.$el
            .request(this.getHandlerName(), {data: requestData})
            .done(function (data) {
                if (data.result) {
                    that.setViewContainerValue(cellElement, data.result)
                    that.setCachedValue(cellElement, data.result)
                }
            })
    }

    ComputedProcessor.prototype.getCacheKey = function(cellElement) {
        return 'value-'
            + this.tableObj.getAlias() + '-'
            + this.columnName + '-'
            + this.tableObj.getCellRowKey(cellElement)
    }

    ComputedProcessor.prototype.getCachedValue = function(cellElement) {
        var cacheKey = this.getCacheKey(cellElement);

        if (this.cachedValues.hasOwnProperty(cacheKey)) {
            return this.cachedValues[cacheKey]
        }

        return null
    }

    ComputedProcessor.prototype.setCachedValue = function(cellElement, value) {
        this.cachedValues[this.getCacheKey(cellElement)] = value
    }

    ComputedProcessor.prototype.getHandlerName = function() {
        if (this.columnConfiguration.callback) {
            return this.columnConfiguration.callback
        }

        var studlyCase = this.columnName.toLowerCase()
            .split(/[\-_]+/)
            .map(function (item) {
                return item.substr(0, 1).toUpperCase() + item.substr(1)
            })
            .join('')

        return 'onGet' + studlyCase + 'ComputedValue'
    }

    $.oc.table.processor.computed = ComputedProcessor
}(window.jQuery);
