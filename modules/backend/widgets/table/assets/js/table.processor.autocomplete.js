/*
 * Autocomplete cell processor for the table control.
 */

+function ($) { "use strict";

    // NAMESPACE CHECK
    // ============================

    if ($.oc.table === undefined)
        throw new Error("The $.oc.table namespace is not defined. Make sure that the table.js script is loaded.");

    if ($.oc.table.processor === undefined)
        throw new Error("The $.oc.table.processor namespace is not defined. Make sure that the table.processor.base.js script is loaded.");

    // CLASS DEFINITION
    // ============================

    var Base = $.oc.table.processor.string,
        BaseProto = Base.prototype

    var AutocompleteProcessor = function(tableObj, columnName, columnConfiguration) {
        //
        // State properties
        //

        this.cachedOptionPromises = {}

        //
        // Parent constructor
        //

        Base.call(this, tableObj, columnName, columnConfiguration)
    }

    AutocompleteProcessor.prototype = Object.create(BaseProto)
    AutocompleteProcessor.prototype.constructor = AutocompleteProcessor

    AutocompleteProcessor.prototype.dispose = function() {
        this.cachedOptionPromises = null

        BaseProto.dispose.call(this)
    }

    /*
     * Forces the processor to hide the editor when the user navigates
     * away from the cell. Processors can update the sell value in this method.
     * Processors must clear the reference to the active cell in this method.
     */
    AutocompleteProcessor.prototype.onUnfocus = function() {
        if (!this.activeCell)
            return

        this.removeAutocomplete()

        BaseProto.onUnfocus.call(this)
    }

    /*
     * Renders the cell in the normal (no edit) mode
     */
    AutocompleteProcessor.prototype.renderCell = function(value, cellContentContainer) {
        BaseProto.renderCell.call(this, value, cellContentContainer)

        // this.fetchOptions(cellContentContainer.parentNode)
    }

    AutocompleteProcessor.prototype.buildEditor = function(cellElement, cellContentContainer, isClick) {
        BaseProto.buildEditor.call(this, cellElement, cellContentContainer, isClick)

        var self = this

        this.fetchOptions(cellElement, function autocompleteFetchOptions(options) {
            self.buildAutoComplete(options)

            self = null
        })
    }

    AutocompleteProcessor.prototype.fetchOptions = function(cellElement, onSuccess) {
        if (this.columnConfiguration.options) {
            if (onSuccess !== undefined) {
                onSuccess(this.columnConfiguration.options)
            }
        } else {
            // If options are not provided and not found in the cache,
            // request them from the server. For dependent autocomplete editors
            // the caching key contains the master column values.

            if (this.triggerGetOptions(onSuccess) === false) {
                return
            }

            var row = cellElement.parentNode,
                cachingKey = this.createOptionsCachingKey(row),
                viewContainer = this.getViewContainer(cellElement)

            // Request options from the server. When the table widget builds,
            // multiple cells in the column could require loading the options.
            // The AJAX promises are cached here so that we have a single
            // request per caching key.

            $.oc.foundation.element.addClass(viewContainer, 'loading')

            if (!this.cachedOptionPromises[cachingKey]) {
                var requestData = {
                        column: this.columnName,
                        rowData: this.tableObj.getRowData(row)
                    },
                    handlerName = this.tableObj.getAlias()+'::onGetAutocompleteOptions'

                this.cachedOptionPromises[cachingKey] = this.tableObj.$el.request(handlerName, {data: requestData})
            }

            this.cachedOptionPromises[cachingKey].done(function onAutocompleteLoadOptionsSuccess(data){
                if (onSuccess !== undefined) {
                    onSuccess(data.options)
                }
            }).always(function onAutocompleteLoadOptionsAlways(){
                $.oc.foundation.element.removeClass(viewContainer, 'loading')
            })
        }
    }

    AutocompleteProcessor.prototype.createOptionsCachingKey = function(row) {
        var cachingKey = 'non-dependent',
            dependsOn = this.columnConfiguration.dependsOn

        if (dependsOn) {
            if (typeof dependsOn == 'object') {
                for (var i = 0, len = dependsOn.length; i < len; i++ )
                    cachingKey += dependsOn[i] + this.tableObj.getRowCellValueByColumnName(row, dependsOn[i])
            } else
                cachingKey = dependsOn + this.tableObj.getRowCellValueByColumnName(row, dependsOn)
        }

        return cachingKey
    }

    AutocompleteProcessor.prototype.triggerGetOptions = function(callback) {
        var tableElement = this.tableObj.getElement()
        if (!tableElement) {
            return
        }
        
        var optionsEvent = $.Event('autocompleteitems.oc.table'),
            values = {} // TODO - implement loading values from the current row.

        $(tableElement).trigger(optionsEvent, [{
            values: values, 
            callback: callback,
            column: this.columnName,
            columnConfiguration: this.columnConfiguration
        }])

        if (optionsEvent.isDefaultPrevented()) {
            return false
        }

        return true
    }

    AutocompleteProcessor.prototype.getInput = function() {
        if (!this.activeCell) {
            return null
        }

        return this.activeCell.querySelector('.string-input')
    }

    AutocompleteProcessor.prototype.buildAutoComplete = function(items) {
        if (!this.activeCell) {
            return
        }

        var input = this.getInput()
        if (!input) {
            return
        }

        if (items === undefined) {
            items = []
        }

        $(input).autocomplete({
            source: this.prepareItems(items),
            matchWidth: true,
            menu: '<ul class="autocomplete dropdown-menu table-widget-autocomplete"></ul>',
            bodyContainer: true
        })
    }

    AutocompleteProcessor.prototype.prepareItems = function(items) {
        var result = {}

        if ($.isArray(items)) {
            for (var i = 0, len = items.length; i < len; i++) {
                result[items[i]] = items[i]
            }
        }
        else {
            result = items
        }

        return result
    }

    AutocompleteProcessor.prototype.removeAutocomplete = function() {
        var input = this.getInput()

        $(input).autocomplete('destroy')
    }

    $.oc.table.processor.autocomplete = AutocompleteProcessor;
}(window.jQuery);