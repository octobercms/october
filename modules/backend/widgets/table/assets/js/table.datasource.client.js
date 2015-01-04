/*
 * Client memory data source for the table control.
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

    var Client = function(tableObj) {
        Base.call(this, tableObj)

        var dataString = tableObj.getElement().getAttribute('data-data')

        if (dataString === null || dataString === undefined)
            throw new Error('The required data-data attribute is not found on the table control element.')

        this.data = JSON.parse(dataString)
    };

    Client.prototype = Object.create(BaseProto)
    Client.prototype.constructor = Client

    Client.prototype.dispose = function() {
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
    Client.prototype.getRecords = function(offset, count, onSuccess) {
        if (!count) {
            // Return all records
            onSuccess(this.data, this.data.length)
        } else {
            // Return a subset of records
            onSuccess(this.data.slice(offset, offset+count), this.data.length)
        }
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
    Client.prototype.createRecord = function(recordData, placement, relativeToKey, offset, count, onSuccess) {
        if (placement === 'bottom') {
            // Add record to the bottom of the dataset
            this.data.push(recordData)
        }
        else if (placement == 'above' || placement == 'below') {
            // Add record above or below the passed record key
            var recordIndex = this.getIndexOfKey(relativeToKey)
            if (placement == 'below')
                recordIndex ++

            this.data.splice(recordIndex, 0, recordData)
        }

        this.getRecords(offset, count, onSuccess)
    }

    /*
     * Updates a record with the specified key with the passed data
     *
     * - key - the record key in the dataset (primary key, etc)
     * - recordData - the record fields.
     */
    Client.prototype.updateRecord = function(key, recordData) {
        var recordIndex = this.getIndexOfKey(key)

        if (recordIndex !== -1) {
            recordData[this.tableObj.options.keyColumn] = key
            this.data[recordIndex] = recordData
        }
        else {
            throw new Error('Record with they key '+key+ ' is not found in the data set')
        }
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
    Base.prototype.deleteRecord = function(key, newRecordData, offset, count, onSuccess) {
        var recordIndex = this.getIndexOfKey(key)

        if (recordIndex !== -1) {
            this.data.splice(recordIndex, 1)

            if (this.data.length == 0)
                this.data.push(newRecordData)

            this.getRecords(offset, count, onSuccess)
        }
        else {
            throw new Error('Record with they key '+key+ ' is not found in the data set')
        }
    }

    Client.prototype.getIndexOfKey = function(key) {
        var keyColumn = this.tableObj.options.keyColumn

        return this.data.map(function(record) {
            return record[keyColumn] + ""
        }).indexOf(key + "")
    }

    Client.prototype.getAllData = function() {
        return this.data
    }

    $.oc.table.datasource.client = Client
}(window.jQuery);