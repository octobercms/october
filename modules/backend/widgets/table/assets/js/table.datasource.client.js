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
     * Creates a record with the passed data and returns the new record index.
     */
    Client.prototype.createRecord = function(recordData, offset, count, onSuccess) {
        
    }

    /*
     * Updates a record with the specified index with the passed data
     */
    Client.prototype.updateRecord = function(index, recordData) {

    }

    $.oc.table.datasource.client = Client
}(window.jQuery);