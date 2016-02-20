/*
 * Server memory data source for the table control.
 */
+function ($) { "use strict";

    // NAMESPACE CHECK
    // ============================

    if ($.oc.table === undefined)
        throw new Error("The $.oc.table namespace is not defined. Make sure that the table.js script is loaded.");

    if ($.oc.table.datasource === undefined)
        throw new Error("The $.oc.table.datasource namespace is not defined. Make sure that the table.datasource.base.js script is loaded.");

    // CLASS DEFINITION
    // ============================

    var Base = $.oc.table.datasource.base,
        BaseProto = Base.prototype

    var Server = function(tableObj) {
        Base.call(this, tableObj)

        var dataString = tableObj.getElement().getAttribute('data-data')

        if (dataString === null || dataString === undefined)
            throw new Error('The required data-data attribute is not found on the table control element.')

        this.data = JSON.parse(dataString)
    };

    Server.prototype = Object.create(BaseProto)
    Server.prototype.constructor = Server

    Server.prototype.dispose = function() {
        BaseProto.dispose.call(this)
        this.data = null
    }

    /*
     * Fetches records from the underlying data source and
     * passes them to the onSuccess callback function.
     * The onSuccess callback parameters: records, totalCount.
     * Each record contains the key field which uniquely identifies 
     * the record. The name of the key field is defined with the table 
     * widget options.
     */
    Server.prototype.getRecords = function(offset, count, onSuccess) {
        var handlerName = this.tableObj.getAlias()+'::onServerGetRecords'
        this.tableObj.$el.request(handlerName, {
            data: {
                offset: offset,
                count: count
            }
        }).done(function(data) {
            onSuccess(data.records, data.count)
        })
    }

    /*
     * Creates a record with the passed data and returns the updated page records
     * to the onSuccess callback function.
     * 
     * - recordData - the record fields
     * - placement - "bottom" (the end of the data set), "above", "below"
     * - relativeToKey - a row key, required if the placement is not "bottom"
     * - offset - the current page's first record index (zero-based)
     * - count - number of records to return
     * - onSuccess - a callback function to execute when the updated data gets available.
     *
     * The onSuccess callback parameters: records, totalCount.
     */
    Server.prototype.createRecord = function(recordData, placement, relativeToKey, offset, count, onSuccess) {
        var handlerName = this.tableObj.getAlias()+'::onServerCreateRecord'
        this.tableObj.$el.request(handlerName, {
            data: {
                recordData: recordData,
                placement: placement,
                relativeToKey: relativeToKey,
                offset: offset,
                count: count
            }
        }).done(function(data) {
            onSuccess(data.records, data.count)
        })
    }

    /*
     * Updates a record with the specified key with the passed data
     *
     * - key - the record key in the dataset (primary key, etc)
     * - recordData - the record fields.
     */
    Server.prototype.updateRecord = function(key, recordData) {
        var handlerName = this.tableObj.getAlias()+'::onServerUpdateRecord'
        this.tableObj.$el.request(handlerName, {
            data: {
                key: key,
                recordData: recordData
            }
        })
    }

    /*
     * Deletes a record with the specified key.
     *
     * - key - the record key in the dataset (primary key, etc).
     * - newRecordData - replacement record to add to the dataset if the deletion
     *   empties it.
     * - offset - the current page's first record key (zero-based)
     * - count - number of records to return
     * - onSuccess - a callback function to execute when the updated data gets available.
     *
     * The onSuccess callback parameters: records, totalCount.
     */
    Server.prototype.deleteRecord = function(key, newRecordData, offset, count, onSuccess) {
        var handlerName = this.tableObj.getAlias()+'::onServerDeleteRecord'
        this.tableObj.$el.request(handlerName, {
            data: {
                key: key,
                offset: offset,
                count: count
            }
        }).done(function(data) {
            onSuccess(data.records, data.count)
        })
    }

    $.oc.table.datasource.server = Server
}(window.jQuery);